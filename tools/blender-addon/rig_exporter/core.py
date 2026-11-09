"""Build a Rig document (docs/blender.md) from a plain-dict Blender scene.

This module never imports bpy. ``collect.py`` walks a live Blender scene
and hands over plain dicts; everything here - id allocation, the Z-up to
Y-up conversion, skin packing, action sampling - is testable with system
Python (see ``../test_core.py``).

Plain scene shape (all matrices are 4x4 row-major, Blender space)::

    {
      "name": "Scene", "fps": 24.0, "unit": "m",
      "collections": [{"name": "Rig", "parent": None}],
      "objects": [{
        "name": "Cube", "type": "MESH",
        "parentObject": None, "collection": "Rig",
        "matrixLocal": [[...], ...], "hide": False,
        "mesh": {
          "positions": [[x, y, z], ...], "normals": [[...], ...] | None,
          "loops": [0, 1, 2, 3], "loopSizes": [4],
          "indices": [0, 1, 2, 0, 2, 3],
          "texcoords": [[u, v], ...] | None,
          "material": {"albedoRgb": [r, g, b], "metallic": 0.0,
                       "roughness": 0.5, "emissive": [r, g, b],
                       "image": "wood.png" | None} | None,
          "skin": {"armature": "Armature", "joints": ["Root", "Tip"],
                   "inverseBind": [<4x4>, ...],
                   "weights": [[["Root", 1.0]], ...]} | None,
        },
        "camera": {...} | None, "light": {...} | None,
        "armature": {"bones": [{"name": "Root", "parent": None,
                                "restLocal": <4x4>, "poseLocal": <4x4>}]}
                    | None,
      }],
      "animations": [{"name": "Wave", "wrap": "loop", "samples": [
        {"targetKind": "bone", "object": "Armature", "bone": "Tip",
         "time": 0.0, "position": [x, y, z],
         "quaternion": [x, y, z, w], "scale": [x, y, z]}]}],
      "environment": {"image": "sky.hdr", "intensity": 1.0} | None,
      "sourceBlend": "set.blend" | None,
    }

``build_document(scene)`` returns ``(document, warnings)``. Warnings name
everything the exporter saw but could not port - nothing is dropped
silently, and nothing unsupported is emitted as a fake component.
"""

import math
import re

# Sync with the RigWorks VERSION file when the Contract moves.
RIG_VERSION = "1.4.0"

_EPS = 1e-6

# Blender (x, y, z) Z-up to Rig (x, z, -y) Y-up. A proper rotation
# (det +1), so quaternion conjugation preserves angle direction.
_BASIS = ((1.0, 0.0, 0.0), (0.0, 0.0, 1.0), (0.0, -1.0, 0.0))
_BASIS4 = (
    (1.0, 0.0, 0.0, 0.0),
    (0.0, 0.0, 1.0, 0.0),
    (0.0, -1.0, 0.0, 0.0),
    (0.0, 0.0, 0.0, 1.0),
)


def _clean(value):
    """Round to 6 decimals and normalise -0.0, for stable documents."""
    value = round(float(value), 6)
    return 0.0 if value == 0 else value


def _clean_seq(values):
    return [_clean(v) for v in values]


# ---------------------------------------------------------------------------
# Small matrix / quaternion helpers (row-major 4x4, xyzw quaternions)
# ---------------------------------------------------------------------------

def mat_mul(a, b):
    return tuple(
        tuple(sum(a[r][k] * b[k][c] for k in range(4)) for c in range(4))
        for r in range(4)
    )


def mat_invert(m):
    """General 4x4 inverse via Gauss-Jordan; raises on a singular matrix."""
    rows = [list(m[r]) + [1.0 if c == r else 0.0 for c in range(4)] for r in range(4)]
    for col in range(4):
        pivot = max(range(col, 4), key=lambda r: abs(rows[r][col]))
        if abs(rows[pivot][col]) < 1e-12:
            raise ValueError("singular matrix")
        rows[col], rows[pivot] = rows[pivot], rows[col]
        scale = rows[col][col]
        rows[col] = [v / scale for v in rows[col]]
        for r in range(4):
            if r != col and rows[r][col] != 0.0:
                factor = rows[r][col]
                rows[r] = [v - factor * p for v, p in zip(rows[r], rows[col])]
    return tuple(tuple(rows[r][4 + c] for c in range(4)) for r in range(4))


def _mat3_to_quat(m):
    """Rotation matrix (3x3 row-major) to a unit xyzw quaternion."""
    trace = m[0][0] + m[1][1] + m[2][2]
    if trace > 0.0:
        s = math.sqrt(trace + 1.0) * 2.0
        quat = [(m[2][1] - m[1][2]) / s, (m[0][2] - m[2][0]) / s,
                (m[1][0] - m[0][1]) / s, 0.25 * s]
    elif m[0][0] > m[1][1] and m[0][0] > m[2][2]:
        s = math.sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]) * 2.0
        quat = [0.25 * s, (m[0][1] + m[1][0]) / s,
                (m[0][2] + m[2][0]) / s, (m[2][1] - m[1][2]) / s]
    elif m[1][1] > m[2][2]:
        s = math.sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]) * 2.0
        quat = [(m[0][1] + m[1][0]) / s, 0.25 * s,
                (m[1][2] + m[2][1]) / s, (m[0][2] - m[2][0]) / s]
    else:
        s = math.sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]) * 2.0
        quat = [(m[0][2] + m[2][0]) / s, (m[1][2] + m[2][1]) / s,
                0.25 * s, (m[1][0] - m[0][1]) / s]
    length = math.sqrt(sum(c * c for c in quat)) or 1.0
    return tuple(c / length for c in quat)


def mat_decompose(m):
    """Split a 4x4 into (position, xyzw quaternion, scale). No shear."""
    position = (m[0][3], m[1][3], m[2][3])
    scale = tuple(
        math.sqrt(m[0][c] ** 2 + m[1][c] ** 2 + m[2][c] ** 2) for c in range(3)
    )
    rotation = tuple(
        tuple(m[r][c] / (scale[c] or 1.0) for c in range(3)) for r in range(3)
    )
    return position, _mat3_to_quat(rotation), scale


def quat_mul(a, b):
    ax, ay, az, aw = a
    bx, by, bz, bw = b
    return (
        aw * bx + ax * bw + ay * bz - az * by,
        aw * by - ax * bz + ay * bw + az * bx,
        aw * bz + ax * by - ay * bx + az * bw,
        aw * bw - ax * bx - ay * by - az * bz,
    )


_BASIS_Q = _mat3_to_quat(_BASIS)
_BASIS_Q_INV = (-_BASIS_Q[0], -_BASIS_Q[1], -_BASIS_Q[2], _BASIS_Q[3])


def convert_point(point):
    """Blender Z-up point to Rig Y-up: (x, y, z) to (x, z, -y)."""
    x, y, z = point
    return (x, z, -y)


def convert_quaternion(quat):
    """Blender xyzw quaternion to Rig space by basis conjugation."""
    return quat_mul(_BASIS_Q, quat_mul(quat, _BASIS_Q_INV))


def convert_matrix(m):
    """Blender-space 4x4 to Rig space: C * M * C-inverse."""
    return mat_mul(_BASIS4, mat_mul(m, mat_invert(_BASIS4)))


def _column_major(m):
    return [m[r][c] for c in range(4) for r in range(4)]


# ---------------------------------------------------------------------------
# Ids
# ---------------------------------------------------------------------------

def slugify(name):
    slug = re.sub(r"[^a-z0-9]+", "-", str(name).lower()).strip("-")
    return slug or "entity"


class IdAllocator:
    def __init__(self):
        self._used = {}

    def alloc(self, name):
        base = slugify(name)
        count = self._used.get(base, 0) + 1
        self._used[base] = count
        return base if count == 1 else "%s-%d" % (base, count)


# ---------------------------------------------------------------------------
# Document assembly
# ---------------------------------------------------------------------------

def _transform_component(matrix, *, posed=None):
    """Rig transform from a Blender local matrix; identity fields omitted."""
    position, quat, scale = mat_decompose(matrix)
    component = {}
    rig_pos = _clean_seq(convert_point(position))
    if any(abs(v) > _EPS for v in rig_pos):
        component["position"] = rig_pos
    rig_quat = _clean_seq(convert_quaternion(quat))
    if rig_quat != [0.0, 0.0, 0.0, 1.0]:
        component["rotation"] = rig_quat
    rig_scale = _clean_seq(scale)
    if rig_scale != [1.0, 1.0, 1.0]:
        component["scale"] = rig_scale
    return component


def _matrices_differ(a, b):
    return any(abs(a[r][c] - b[r][c]) > 1e-5 for r in range(4) for c in range(4))


def build_document(scene):
    warnings = []
    ids = IdAllocator()
    entities = []

    def add_entity(entity_id, components):
        entities.append({"id": entity_id, "components": components})
        return entity_id

    scene_name = scene.get("name") or "Scene"
    scene_id = add_entity(ids.alloc(scene_name), {
        "rig.meta.named": {"name": scene_name, "stableId": scene_name},
        "rig.spatial.vertex": {},
    })

    # Collections become groups; scene path is the stableId.
    collection_ids = {}
    for coll in scene.get("collections", []):
        parent_id = collection_ids.get(coll.get("parent"), scene_id)
        path = "%s/%s" % (scene_name, coll["name"])
        entity_id = ids.alloc(coll["name"])
        collection_ids[coll["name"]] = entity_id
        add_entity(entity_id, {
            "rig.meta.named": {"name": coll["name"], "stableId": path},
            "rig.spatial.relationship": {"parent": parent_id},
            "rig.spatial.group": {},
        })

    def stable_path(obj):
        parent = obj.get("parentObject") or obj.get("collection") or scene_name
        return "%s/%s/%s" % (scene_name, parent, obj["name"])

    # Image / model assets referenced from materials and the world get
    # their own unparented entities, as in examples/blender-scene.json.
    asset_ids = {}

    def asset_entity(path, kind):
        if path not in asset_ids:
            label = path.rsplit("/", 1)[-1]
            entity_id = ids.alloc(label.rsplit(".", 1)[0] if "." in label else label)
            asset_ids[path] = entity_id
            add_entity(entity_id, {
                "rig.meta.named": {"name": label, "stableId": label},
                "rig.media.asset_ref": {"kind": kind, "path": path},
            })
        return asset_ids[path]

    object_ids = {}
    bone_ids = {}  # (armature object name, bone name) -> entity id
    skeleton_ids = {}  # armature object name -> entity holding rig.anim.skeleton
    pending_skins = []

    for obj in scene.get("objects", []):
        name = obj["name"]
        entity_id = ids.alloc(name)
        object_ids[name] = entity_id
        if obj.get("parentObject") in object_ids:
            parent_id = object_ids[obj["parentObject"]]
        elif obj.get("collection") in collection_ids:
            parent_id = collection_ids[obj["collection"]]
        else:
            parent_id = scene_id
        components = {
            "rig.meta.named": {"name": name, "stableId": stable_path(obj)},
            "rig.spatial.relationship": {"parent": parent_id},
        }
        transform = _transform_component(obj["matrixLocal"])
        if transform:
            components["rig.spatial.transform"] = transform
        if obj.get("hide"):
            components["rig.render.visibility"] = {"visible": False}

        otype = obj.get("type")
        if otype == "EMPTY":
            components["rig.spatial.vertex"] = {}
        elif otype == "MESH" and obj.get("mesh"):
            mesh = obj["mesh"]
            geometry = {
                "positions": _clean_seq(
                    c for v in mesh["positions"] for c in convert_point(v)),
                "indices": list(mesh.get("indices") or []),
                "mode": "triangles",
            }
            if mesh.get("loops"):
                geometry["loops"] = list(mesh["loops"])
                geometry["loopSizes"] = list(mesh["loopSizes"])
            if mesh.get("normals"):
                geometry["normals"] = _clean_seq(
                    c for n in mesh["normals"] for c in convert_point(n))
            if mesh.get("texcoords"):
                geometry["texcoords"] = _clean_seq(
                    c for uv in mesh["texcoords"] for c in uv)
            components["rig.geometry.mesh"] = geometry
            material = mesh.get("material")
            if material:
                rig_material = {}
                if material.get("albedoRgb") is not None:
                    rig_material["albedoRgb"] = _clean_seq(material["albedoRgb"])
                if material.get("metallic"):
                    rig_material["metallic"] = _clean(material["metallic"])
                if material.get("roughness") is not None:
                    rig_material["roughness"] = _clean(material["roughness"])
                if material.get("emissive") is not None:
                    rig_material["emissive"] = _clean_seq(material["emissive"])
                if material.get("image"):
                    rig_material["albedoMap"] = asset_entity(
                        material["image"], "image")
                components["rig.render.material"] = rig_material
            if mesh.get("skin"):
                pending_skins.append((entity_id, name, mesh["skin"]))
        elif otype == "CAMERA" and obj.get("camera"):
            components["rig.spatial.camera"] = {
                k: (_clean(v) if isinstance(v, float) else v)
                for k, v in obj["camera"].items() if v is not None
            }
        elif otype == "LIGHT" and obj.get("light"):
            light = obj["light"]
            type_map = {"SUN": "directional", "POINT": "point", "SPOT": "spot"}
            if light["type"] in type_map:
                rig_light = {"type": type_map[light["type"]]}
                if light.get("rgb") is not None:
                    rig_light["rgb"] = _clean_seq(light["rgb"])
                if light.get("intensity") is not None:
                    rig_light["intensity"] = _clean(light["intensity"])
                if light.get("range"):
                    rig_light["range"] = _clean(light["range"])
                if light["type"] == "SPOT":
                    if light.get("outerConeDegrees") is not None:
                        rig_light["outerConeDegrees"] = _clean(
                            light["outerConeDegrees"])
                    if light.get("innerConeDegrees") is not None:
                        rig_light["innerConeDegrees"] = _clean(
                            light["innerConeDegrees"])
                components["rig.render.light"] = rig_light
            else:
                warnings.append(
                    "%s: %s light has no rig.render.light form - "
                    "transform exported, light skipped" % (name, light["type"]))
        elif otype == "ARMATURE" and obj.get("armature"):
            bones = obj["armature"]["bones"]
            bone_entities = {}
            roots = []
            for bone in bones:
                bone_id = ids.alloc(bone["name"])
                bone_ids[(name, bone["name"])] = bone_id
                bone_entities[bone["name"]] = bone_id
                if bone.get("parent") is None:
                    roots.append(bone["name"])
            for bone in bones:
                bone_id = bone_entities[bone["name"]]
                parent_id = bone_entities.get(bone.get("parent"), entity_id)
                bone_components = {
                    "rig.meta.named": {
                        "name": bone["name"],
                        "stableId": "%s/%s" % (stable_path(obj), bone["name"]),
                    },
                    "rig.spatial.relationship": {"parent": parent_id},
                }
                rest = bone["restLocal"]
                pose = bone.get("poseLocal") or rest
                bone_components["rig.spatial.transform"] = _transform_component(pose)
                if _matrices_differ(pose, rest):
                    bone_components["rig.anim.bind"] = _transform_component(rest)
                if bone["name"] in roots:
                    skeleton_ids.setdefault(name, bone_id)
                    subtree = []
                    for candidate in bones:
                        cursor = candidate
                        while cursor is not None:
                            if cursor["name"] == bone["name"]:
                                subtree.append(bone_entities[candidate["name"]])
                                break
                            cursor = next(
                                (b for b in bones if b["name"] == cursor.get("parent")),
                                None)
                    bone_components["rig.anim.skeleton"] = {
                        "root": bone_id, "bones": subtree}
                add_entity(bone_id, bone_components)
        elif otype not in ("EMPTY", "MESH", "CAMERA", "LIGHT", "ARMATURE"):
            warnings.append(
                "%s: %s datablock does not port yet - "
                "transform and name exported only" % (name, otype))

        add_entity(entity_id, components)

    # Skins resolve after every bone entity exists.
    for entity_id, obj_name, skin in pending_skins:
        joint_ids = []
        missing = False
        for joint in skin["joints"]:
            bone_id = bone_ids.get((skin["armature"], joint))
            if bone_id is None:
                warnings.append(
                    "%s: vertex group %s has no bone on %s - skin skipped"
                    % (obj_name, joint, skin["armature"]))
                missing = True
                break
            joint_ids.append(bone_id)
        if missing:
            continue
        joint_index = {joint: i for i, joint in enumerate(skin["joints"])}
        indices, weights = [], []
        for vertex_weights in skin["weights"]:
            ranked = sorted(
                ((joint_index[j], w) for j, w in vertex_weights if j in joint_index),
                key=lambda pair: -pair[1])[:4]
            total = sum(w for _, w in ranked) or 1.0
            picked = [(i, w / total) for i, w in ranked]
            picked += [(0, 0.0)] * (4 - len(picked))
            indices.extend(i for i, _ in picked)
            weights.extend(_clean(w) for _, w in picked)
        entity = next(e for e in entities if e["id"] == entity_id)
        entity["components"]["rig.anim.skin"] = {
            "skeleton": skeleton_ids.get(skin["armature"]),
            "joints": joint_ids,
            "inverseBind": _clean_seq(
                c for m in skin["inverseBind"] for c in _column_major(convert_matrix(m))),
            "jointIndices": indices,
            "jointWeights": weights,
        }

    environment = scene.get("environment")
    if environment and environment.get("image"):
        add_entity(ids.alloc("world"), {
            "rig.meta.named": {"name": "World", "stableId": "World"},
            "rig.spatial.relationship": {"parent": scene_id},
            "rig.render.environment": {
                "hdri": asset_entity(environment["image"], "image"),
                **({"intensity": _clean(environment["intensity"])}
                   if environment.get("intensity") not in (None, 1) else {}),
            },
        })

    # Actions sample into clip + per-(target, channel) tracks.
    for animation in scene.get("animations", []):
        clip_id = ids.alloc(animation["name"])
        samples = animation["samples"]
        duration = max((s["time"] for s in samples), default=0.0)
        clip = {"duration": _clean(duration)}
        if animation.get("wrap"):
            clip["wrap"] = animation["wrap"]
        add_entity(clip_id, {
            "rig.meta.named": {
                "name": animation["name"], "stableId": animation["name"]},
            "rig.anim.clip": clip,
        })
        tracks = {}
        for sample in samples:
            if sample["targetKind"] == "bone":
                target = bone_ids.get((sample["object"], sample.get("bone")))
            else:
                target = object_ids.get(sample["object"])
            if target is None:
                continue
            for key, stride in (("position", 3), ("rotation", 4), ("scale", 3)):
                tracks.setdefault((target, key), (stride, []))
        for sample in samples:
            if sample["targetKind"] == "bone":
                target = bone_ids.get((sample["object"], sample.get("bone")))
            else:
                target = object_ids.get(sample["object"])
            if target is None:
                continue
            tracks[(target, "position")][1].append(
                (sample["time"], _clean_seq(convert_point(sample["position"]))))
            tracks[(target, "rotation")][1].append(
                (sample["time"],
                 _clean_seq(convert_quaternion(tuple(sample["quaternion"])))))
            tracks[(target, "scale")][1].append(
                (sample["time"], _clean_seq(sample["scale"])))
        for (target, key), (stride, keys) in sorted(tracks.items()):
            keys.sort(key=lambda item: item[0])
            add_entity(ids.alloc("%s-%s" % (animation["name"], key)), {
                "rig.anim.track": {
                    "clip": clip_id,
                    "target": target,
                    "propertyKey": key,
                    "times": [_clean(t) for t, _ in keys],
                    "values": [c for _, values in keys for c in values],
                    "stride": stride,
                },
            })

    if scene.get("sourceBlend"):
        add_entity(ids.alloc("source"), {
            "rig.media.asset_ref": {"kind": "model", "path": scene["sourceBlend"]},
        })

    document = {
        "rig": RIG_VERSION,
        "document": {
            "title": scene_name,
            "defaultUnit": scene.get("unit") or "m",
        },
        "entities": entities,
    }
    return document, warnings
