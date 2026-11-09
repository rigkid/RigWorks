"""Headless Blender smoke test for the Rig Document add-on.

Builds a scene that exercises every ported feature - Principled
material, camera, sun / spot / area lights, a two-bone armature with a
skinned flag, a posed + keyframed bone, a hidden empty, and a curve -
then exports through the real operator and asserts on the JSON.

    blender --background --factory-startup --python smoke_test.py -- <outdir>

The add-on must be importable: either install it first, or copy
``rig_exporter/`` into a folder on BLENDER_USER_SCRIPTS/addons and this
script will enable it by name. Validate the output afterwards:

    node tools/rig-validate/cli.js --strict <outdir>/smoke-anim.rig
"""

import json
import math
import os
import sys

import bpy


def _link_only(obj, collection):
    for coll in list(obj.users_collection):
        coll.objects.unlink(obj)
    collection.objects.link(obj)


def _build_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.fps = 24
    scene.frame_start = 1
    scene.frame_end = 12

    rig = bpy.data.collections.new("Rig")
    scene.collection.children.link(rig)

    # Cube with a Principled material, sitting on z = 0 in Blender space.
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 1))
    cube = bpy.context.object
    cube.name = "Cube"
    _link_only(cube, rig)
    material = bpy.data.materials.new("Paint")
    material.use_nodes = True
    principled = material.node_tree.nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (0.8, 0.2, 0.1, 1.0)
    principled.inputs["Roughness"].default_value = 0.45
    cube.data.materials.append(material)

    # Camera at Blender (0, -6, 2).
    camera_data = bpy.data.cameras.new("Camera")
    camera = bpy.data.objects.new("Camera", camera_data)
    rig.objects.link(camera)
    camera.location = (0, -6, 2)
    camera.rotation_euler = (math.radians(90), 0, 0)
    camera_data.lens = 50

    # Sun, spot, and an area light (area must export without a light).
    for name, light_type, location in (
            ("Sun", "SUN", (2, 2, 5)),
            ("Spot", "SPOT", (3, 3, 4)),
            ("Area", "AREA", (0, 4, 3))):
        light_data = bpy.data.lights.new(name, light_type)
        if light_type == "SUN":
            light_data.energy = 3.0
        light = bpy.data.objects.new(name, light_data)
        rig.objects.link(light)
        light.location = location

    # Two-bone armature along +Z.
    armature_data = bpy.data.armatures.new("Armature")
    armature = bpy.data.objects.new("Armature", armature_data)
    rig.objects.link(armature)
    armature.location = (-3, 0, 0)
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode="EDIT")
    root = armature_data.edit_bones.new("Root")
    root.head, root.tail = (0, 0, 0), (0, 0, 1)
    tip = armature_data.edit_bones.new("Tip")
    tip.head, tip.tail = (0, 0, 1), (0, 0, 2)
    tip.parent = root
    bpy.ops.object.mode_set(mode="OBJECT")

    # Skinned flag: bottom verts to Root, top verts mostly to Tip.
    mesh = bpy.data.meshes.new("Flag")
    mesh.from_pydata(
        [(-0.5, 0, 0), (0.5, 0, 0), (-0.5, 0, 2), (0.5, 0, 2)],
        [], [(0, 1, 3, 2)])
    mesh.update()
    flag = bpy.data.objects.new("Flag", mesh)
    rig.objects.link(flag)
    # Parented to the armature at its origin: local transform is identity.
    flag.parent = armature
    flag.location = (0, 0, 0)
    root_group = flag.vertex_groups.new(name="Root")
    tip_group = flag.vertex_groups.new(name="Tip")
    root_group.add([0, 1], 1.0, "REPLACE")
    tip_group.add([2, 3], 1.0, "REPLACE")
    root_group.add([2], 0.25, "REPLACE")
    modifier = flag.modifiers.new("Armature", "ARMATURE")
    modifier.object = armature
    uv = mesh.uv_layers.new(name="UVMap")
    for loop in mesh.loops:
        uv.data[loop.index].uv = ((0.0, 0.0), (1.0, 0.0),
                                  (0.0, 1.0), (1.0, 1.0))[loop.vertex_index]

    # Animate Tip: identity, 45 degrees about pose Z, identity.
    tip_pose = armature.pose.bones["Tip"]
    tip_pose.rotation_mode = "QUATERNION"
    scene.frame_set(1)
    tip_pose.rotation_quaternion = (1, 0, 0, 0)
    tip_pose.keyframe_insert("rotation_quaternion", frame=1)
    scene.frame_set(6)
    tip_pose.rotation_quaternion = (
        math.cos(math.radians(22.5)), 0, 0, math.sin(math.radians(22.5)))
    tip_pose.keyframe_insert("rotation_quaternion", frame=6)
    scene.frame_set(12)
    tip_pose.rotation_quaternion = (1, 0, 0, 0)
    tip_pose.keyframe_insert("rotation_quaternion", frame=12)
    scene.frame_set(1)

    # Hidden empty and a curve: partial / no datablock port.
    empty = bpy.data.objects.new("Guide", None)
    rig.objects.link(empty)
    empty.hide_viewport = True
    empty.hide_render = True
    curve_data = bpy.data.curves.new("Path", "CURVE")
    curve_data.dimensions = "3D"
    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(1)
    curve = bpy.data.objects.new("Path", curve_data)
    rig.objects.link(curve)
    return scene


def _entity(document, entity_id):
    return next(e for e in document["entities"] if e["id"] == entity_id)


def _check(document):
    cube = _entity(document, "cube")
    assert cube["components"]["rig.spatial.transform"]["position"] == [0, 1, 0], \
        cube["components"]
    assert cube["components"]["rig.render.material"]["albedoRgb"] == [0.8, 0.2, 0.1]
    assert cube["components"]["rig.geometry.mesh"]["loopSizes"] == [4] * 6

    camera = _entity(document, "camera")
    assert camera["components"]["rig.spatial.transform"]["position"] == [0, 2, 6]
    assert camera["components"]["rig.spatial.camera"]["projection"] == "perspective"

    assert _entity(document, "sun")["components"]["rig.render.light"]["type"] \
        == "directional"
    assert _entity(document, "spot")["components"]["rig.render.light"]["type"] \
        == "spot"
    assert "rig.render.light" not in \
        _entity(document, "area")["components"], "area light must not fake a light"

    # Blender bones carry a Y-along-bone rotation: Root is rotated, and
    # Tip's offset along its parent's Y converts to Rig (0, 0, -1). The
    # composed world pose is still one metre up - see docs/blender.md.
    root_entity = _entity(document, "root")
    root_rotation = root_entity["components"]["rig.spatial.transform"]["rotation"]
    assert all(abs(a - b) < 1e-5 for a, b in
               zip(root_rotation, (0.707107, 0, 0, 0.707107))), root_rotation
    tip = _entity(document, "tip")
    assert tip["components"]["rig.spatial.relationship"]["parent"] == "root"
    assert tip["components"]["rig.spatial.transform"]["position"] == [0, 0, -1]
    assert root_entity["components"]["rig.anim.skeleton"] == \
        {"root": "root", "bones": ["root", "tip"]}

    flag = _entity(document, "flag")
    skin = flag["components"]["rig.anim.skin"]
    assert skin["joints"] == ["root", "tip"] and skin["skeleton"] == "root"
    assert len(skin["jointWeights"]) == 16
    # Root inverse bind is a pure rotation here (flag shares the
    # armature origin), so its translation column is zero.
    assert skin["inverseBind"][12:15] == [0, 0, 0], skin["inverseBind"]
    assert flag["components"]["rig.geometry.mesh"]["texcoords"] == \
        [0, 0, 1, 0, 0, 1, 1, 1]

    guide = _entity(document, "guide")
    assert guide["components"]["rig.render.visibility"] == {"visible": False}
    assert "rig.geometry.path3d" not in \
        _entity(document, "path")["components"], "curve must not fake geometry"

    clips = [e for e in document["entities"] if "rig.anim.clip" in e["components"]]
    assert clips, "expected a sampled clip"
    clip = clips[0]["components"]["rig.anim.clip"]
    assert abs(clip["duration"] - 11 / 24) < 1e-5, clip
    tracks = [e["components"]["rig.anim.track"]
              for e in document["entities"] if "rig.anim.track" in e["components"]]
    rotation = [t for t in tracks if t["propertyKey"] == "rotation"
                and t["target"] == "tip"]
    assert rotation and len(rotation[0]["times"]) == 12, rotation


def main():
    outdir = sys.argv[sys.argv.index("--") + 1]
    os.makedirs(outdir, exist_ok=True)

    # Build first: read_factory_settings in _build_scene would disable
    # an add-on enabled through addon_utils, which is test scaffolding
    # order, not a user flow (users enable once, then work).
    _build_scene()

    import addon_utils
    addon_utils.enable("rig_exporter", default_set=True)
    _loaded, enabled = addon_utils.check("rig_exporter")
    if not enabled:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import rig_exporter
        rig_exporter.register()
    filepath = os.path.join(outdir, "smoke-anim.rig")
    result = bpy.ops.export_scene.rig(
        filepath=filepath, apply_modifiers=True,
        export_animation=True, frame_step=1)
    assert result == {"FINISHED"}, result
    with open(filepath, encoding="utf-8") as handle:
        document = json.load(handle)
    _check(document)
    print("SMOKE OK", filepath, len(document["entities"]), "entities")


if __name__ == "__main__":
    main()
