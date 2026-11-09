"""Walk a live Blender scene into the plain dicts ``core`` consumes.

This is the only module that touches bpy / mathutils. Everything is
copied into plain lists and tuples here, so ``core`` never sees a
Blender type. Evaluated data (dependency graph, current pose, sampled
frames) is read at export time; the ``.blend`` stays the source of
truth for modifiers, constraints, drivers, and node trees.
"""

import math
import os


def _rows(matrix):
    return [[float(matrix[r][c]) for c in range(4)] for r in range(4)]


def _vec(vector):
    return [float(v) for v in vector]


def _collection_tree(scene):
    """Flatten the scene collection tree: [{name, parent}] + obj -> coll."""
    flat = []
    primary = {}

    def walk(collection, parent_name):
        flat.append({"name": collection.name, "parent": parent_name})
        for child_obj in collection.objects:
            primary.setdefault(child_obj.name, collection.name)
        for child in collection.children:
            walk(child, collection.name)

    # The master scene collection itself becomes the scene root, not a group.
    for child in scene.collection.children:
        walk(child, None)
    for child_obj in scene.collection.objects:
        primary.setdefault(child_obj.name, None)
    return flat, primary


def _principled(material):
    if material is None:
        return None
    # use_nodes is deprecated in Blender 5.2 (removed in 6.0); node_tree
    # presence is the durable test.
    if getattr(material, "node_tree", None) is None:
        return {"albedoRgb": [0.8, 0.8, 0.8], "metallic": 0.0,
                "roughness": 0.5, "emissive": None, "image": None}
    principled = next(
        (n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED"),
        None)
    if principled is None:
        return None

    def scalar(name, fallback):
        socket = principled.inputs.get(name)
        return float(socket.default_value) if socket else fallback

    base = principled.inputs.get("Base Color")
    result = {
        "albedoRgb": _vec(base.default_value[:3]) if base else [0.8, 0.8, 0.8],
        "metallic": scalar("Metallic", 0.0),
        "roughness": scalar("Roughness", 0.5),
        "emissive": None,
        "image": None,
    }
    if base and base.links:
        node = base.links[0].from_node
        if node.type == "TEX_IMAGE" and node.image:
            result["image"] = os.path.basename(node.image.filepath) \
                if node.image.filepath else node.image.name
    for name in ("Emission Color", "Emission"):
        socket = principled.inputs.get(name)
        if socket is not None:
            strength = scalar("Emission Strength", 1.0)
            if strength > 0:
                result["emissive"] = _vec(socket.default_value[:3])
            break
    return result


def _mesh_data(bpy, obj, depsgraph, apply_modifiers):
    armature_mod = next(
        (m for m in obj.modifiers if m.type == "ARMATURE" and m.object), None)
    if apply_modifiers and armature_mod is None:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        owned = True
    else:
        mesh = obj.data
        owned = False
    try:
        mesh.calc_loop_triangles()
        positions = [_vec(v.co) for v in mesh.vertices]
        # Split normals live on loop corners; Rig packs one normal per
        # vertex, so average the corners (docs/blender.md).
        normals = [[0.0, 0.0, 0.0] for _ in positions]
        for loop in mesh.loops:
            normal = normals[loop.vertex_index]
            for i in range(3):
                normal[i] += float(loop.normal[i])
        for normal in normals:
            length = math.sqrt(sum(c * c for c in normal)) or 1.0
            for i in range(3):
                normal[i] /= length
        loops, loop_sizes = [], []
        for polygon in mesh.polygons:
            loop_sizes.append(len(polygon.loop_indices))
            for loop_index in polygon.loop_indices:
                loops.append(mesh.loops[loop_index].vertex_index)
        indices = []
        for triangle in mesh.loop_triangles:
            indices.extend(int(v) for v in triangle.vertices)
        texcoords = None
        if mesh.uv_layers.active:
            texcoords = [[0.0, 0.0] for _ in positions]
            seen = [False] * len(positions)
            uv_data = mesh.uv_layers.active.data
            for loop in mesh.loops:
                if not seen[loop.vertex_index]:
                    seen[loop.vertex_index] = True
                    texcoords[loop.vertex_index] = _vec(uv_data[loop.index].uv)
        material = None
        if mesh.materials:
            material = _principled(mesh.materials[0])
        skin = None
        if armature_mod is not None:
            armature_obj = armature_mod.object
            group_names = {g.index: g.name for g in obj.vertex_groups}
            joints = [b.name for b in armature_obj.data.bones
                      if b.name in group_names.values()]
            mesh_world_inv = obj.matrix_world.inverted()
            inverse_bind = []
            for joint in joints:
                bone = armature_obj.data.bones[joint]
                bind = mesh_world_inv @ armature_obj.matrix_world @ bone.matrix_local
                inverse_bind.append(_rows(bind.inverted()))
            weights = []
            for vertex in mesh.vertices:
                weights.append([
                    [group_names[g.group], float(g.weight)]
                    for g in vertex.groups if g.group in group_names
                ])
            skin = {"armature": armature_obj.name, "joints": joints,
                    "inverseBind": inverse_bind, "weights": weights}
        return {
            "positions": positions, "normals": normals,
            "loops": loops, "loopSizes": loop_sizes, "indices": indices,
            "texcoords": texcoords, "material": material, "skin": skin,
        }
    finally:
        if owned:
            evaluated.to_mesh_clear()


def _camera_data(obj, scene):
    data = obj.data
    result = {"nearClip": float(data.clip_start), "farClip": float(data.clip_end)}
    aspect = scene.render.resolution_x / max(1, scene.render.resolution_y)
    result["aspect"] = aspect
    if data.type == "ORTHO":
        result["projection"] = "orthographic"
        result["orthoHeight"] = float(data.ortho_scale) / aspect
    else:
        result["projection"] = "perspective"
        result["fovYDegrees"] = math.degrees(float(data.angle_y))
    return result


def _light_data(obj):
    data = obj.data
    result = {"type": data.type, "rgb": _vec(data.color)}
    # Blender point/spot energy is watts; sun energy is irradiance.
    # Neither is a Rig unit - normalise point/spot by 1000 so typical
    # values land near 1, and say so in the README.
    if data.type == "SUN":
        result["intensity"] = float(data.energy)
    else:
        result["intensity"] = float(data.energy) / 1000.0
    if getattr(data, "cutoff_distance", 0):
        result["range"] = float(data.cutoff_distance)
    if data.type == "SPOT":
        outer = math.degrees(float(data.spot_size))
        result["outerConeDegrees"] = outer
        result["innerConeDegrees"] = outer * (1.0 - float(data.spot_blend))
    return result


def _armature_data(obj):
    bones = []
    for bone in obj.data.bones:
        if bone.parent:
            rest_local = bone.parent.matrix_local.inverted() @ bone.matrix_local
        else:
            rest_local = bone.matrix_local
        pose_bone = obj.pose.bones.get(bone.name)
        if pose_bone is not None:
            if bone.parent and obj.pose.bones.get(bone.parent.name):
                pose_local = obj.pose.bones[bone.parent.name].matrix.inverted() \
                    @ pose_bone.matrix
            else:
                pose_local = pose_bone.matrix
        else:
            pose_local = rest_local
        bones.append({
            "name": bone.name,
            "parent": bone.parent.name if bone.parent else None,
            "restLocal": _rows(rest_local),
            "poseLocal": _rows(pose_local),
        })
    return {"bones": bones}


def _sample_animation(bpy, scene, frame_step):
    """Bake current actions to per-frame TRS samples (docs: sampled)."""
    fps = scene.render.fps / max(1e-6, scene.render.fps_base)
    start, end = scene.frame_start, scene.frame_end
    animated = [o for o in scene.objects
                if o.animation_data and o.animation_data.action]
    if not animated:
        return []
    by_action = {}
    original_frame = scene.frame_current
    try:
        for frame in range(start, end + 1, max(1, frame_step)):
            scene.frame_set(frame)
            bpy.context.view_layer.update()
            time = (frame - start) / fps
            for obj in animated:
                action = obj.animation_data.action
                entry = by_action.setdefault(action.name, {
                    "name": action.name,
                    "wrap": "loop" if getattr(action, "use_cyclic", False) else "once",
                    "samples": [],
                })
                if obj.type == "ARMATURE":
                    for bone in obj.data.bones:
                        pose_bone = obj.pose.bones[bone.name]
                        if bone.parent and obj.pose.bones.get(bone.parent.name):
                            local = obj.pose.bones[bone.parent.name].matrix.inverted() \
                                @ pose_bone.matrix
                        else:
                            local = pose_bone.matrix
                        loc, quat, scale = local.decompose()
                        entry["samples"].append({
                            "targetKind": "bone", "object": obj.name,
                            "bone": bone.name, "time": time,
                            "position": _vec(loc),
                            "quaternion": [quat.x, quat.y, quat.z, quat.w],
                            "scale": _vec(scale),
                        })
                loc, quat, scale = obj.matrix_local.decompose()
                entry["samples"].append({
                    "targetKind": "object", "object": obj.name, "bone": None,
                    "time": time, "position": _vec(loc),
                    "quaternion": [quat.x, quat.y, quat.z, quat.w],
                    "scale": _vec(scale),
                })
    finally:
        scene.frame_set(original_frame)
        bpy.context.view_layer.update()
    return list(by_action.values())


def collect_scene(bpy, *, apply_modifiers=True, export_animation=False,
                  frame_step=1):
    """Read the current scene into core's plain-dict shape."""
    scene = bpy.context.scene
    depsgraph = bpy.context.evaluated_depsgraph_get()
    collections, primary_collection = _collection_tree(scene)
    unit_scale = scene.unit_settings.scale_length or 1.0
    unit = "m" if abs(unit_scale - 1.0) < 1e-6 else "cm" \
        if abs(unit_scale - 0.01) < 1e-6 else "mm" \
        if abs(unit_scale - 0.001) < 1e-6 else "m"

    objects = []
    for obj in scene.objects:
        entry = {
            "name": obj.name,
            "type": obj.type,
            "parentObject": obj.parent.name if obj.parent else None,
            "collection": primary_collection.get(obj.name),
            "matrixLocal": _rows(obj.matrix_local),
            "hide": bool(obj.hide_viewport or obj.hide_render),
            "mesh": None, "camera": None, "light": None, "armature": None,
        }
        if obj.type == "MESH":
            entry["mesh"] = _mesh_data(bpy, obj, depsgraph, apply_modifiers)
        elif obj.type == "CAMERA":
            entry["camera"] = _camera_data(obj, scene)
        elif obj.type == "LIGHT":
            entry["light"] = _light_data(obj)
        elif obj.type == "ARMATURE":
            entry["armature"] = _armature_data(obj)
        objects.append(entry)

    environment = None
    world = scene.world
    if world and world.use_nodes:
        env_node = next((n for n in world.node_tree.nodes
                         if n.type == "TEX_ENVIRONMENT" and n.image), None)
        background = next((n for n in world.node_tree.nodes
                           if n.type == "BACKGROUND"), None)
        if env_node is not None:
            image = env_node.image
            environment = {
                "image": os.path.basename(image.filepath)
                if image.filepath else image.name,
                "intensity": float(background.inputs["Strength"].default_value)
                if background else 1.0,
            }

    animations = []
    if export_animation:
        animations = _sample_animation(bpy, scene, frame_step)

    return {
        "name": scene.name,
        "fps": scene.render.fps / max(1e-6, scene.render.fps_base),
        "unit": unit,
        "collections": collections,
        "objects": objects,
        "animations": animations,
        "environment": environment,
        "sourceBlend": os.path.basename(bpy.data.filepath)
        if bpy.data.filepath else None,
    }
