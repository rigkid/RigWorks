"""Unit tests for the Blender add-on core. No Blender required.

    python tools/blender-addon/test_core.py

The fixture is a small scene in Blender space (Z-up, w-first habits
already translated by the fake adapter): a cube in a collection, a
camera, a sun, and a two-bone armature with a skinned flag. Expected
values below are the Rig-space (Y-up) result from docs/blender.md.
"""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "rig_exporter"))
import core  # noqa: E402


def _translation(x, y, z):
    return [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]


IDENTITY = _translation(0, 0, 0)


def build_fixture():
    cube_positions = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ]
    return {
        "name": "Scene",
        "fps": 24.0,
        "unit": "m",
        "collections": [{"name": "Rig", "parent": None}],
        "objects": [
            {
                "name": "Cube", "type": "MESH", "parentObject": None,
                "collection": "Rig", "matrixLocal": _translation(0, 0, 1),
                "hide": False,
                "mesh": {
                    "positions": cube_positions, "normals": None,
                    "loops": [0, 1, 2, 3], "loopSizes": [4],
                    "indices": [0, 1, 2, 0, 2, 3], "texcoords": None,
                    "material": {"albedoRgb": [0.8, 0.2, 0.1],
                                 "metallic": 0.0, "roughness": 0.45,
                                 "emissive": None, "image": None},
                    "skin": None,
                },
                "camera": None, "light": None, "armature": None,
            },
            {
                "name": "Camera", "type": "CAMERA", "parentObject": None,
                "collection": "Rig", "matrixLocal": _translation(0, -6, 2),
                "hide": False, "mesh": None,
                "camera": {"projection": "perspective", "fovYDegrees": 40.0,
                           "nearClip": 0.1, "farClip": 100.0},
                "light": None, "armature": None,
            },
            {
                "name": "Sun", "type": "LIGHT", "parentObject": None,
                "collection": "Rig", "matrixLocal": IDENTITY,
                "hide": False, "mesh": None, "camera": None,
                "light": {"type": "SUN", "rgb": [1, 1, 1], "intensity": 3.0},
                "armature": None,
            },
            {
                "name": "Armature", "type": "ARMATURE", "parentObject": None,
                "collection": "Rig", "matrixLocal": _translation(-3, 0, 0),
                "hide": False, "mesh": None, "camera": None, "light": None,
                "armature": {"bones": [
                    {"name": "Root", "parent": None,
                     "restLocal": IDENTITY, "poseLocal": IDENTITY},
                    {"name": "Tip", "parent": "Root",
                     "restLocal": _translation(0, 0, 1),
                     "poseLocal": _translation(0, 0, 1)},
                ]},
            },
            {
                "name": "Flag", "type": "MESH", "parentObject": "Armature",
                "collection": "Rig", "matrixLocal": IDENTITY,
                "hide": False,
                "mesh": {
                    "positions": [[-0.5, 0, 0], [0.5, 0, 0],
                                  [-0.5, 0, 2], [0.5, 0, 2]],
                    "normals": None,
                    "loops": [0, 1, 3, 2], "loopSizes": [4],
                    "indices": [0, 1, 3, 0, 3, 2],
                    "texcoords": [[0, 0], [1, 0], [0, 1], [1, 1]],
                    "material": None,
                    "skin": {
                        "armature": "Armature", "joints": ["Root", "Tip"],
                        "inverseBind": [IDENTITY, _translation(0, 0, -1)],
                        "weights": [[["Root", 1.0]], [["Root", 1.0]],
                                    [["Root", 1.0], ["Tip", 2.0]],
                                    [["Tip", 1.0]]],
                    },
                },
                "camera": None, "light": None, "armature": None,
            },
        ],
        "animations": [{
            "name": "Wave", "wrap": "loop",
            "samples": [
                {"targetKind": "bone", "object": "Armature", "bone": "Tip",
                 "time": t, "position": [0, 0, 1],
                 "quaternion": q, "scale": [1, 1, 1]}
                for t, q in [(0.0, [0, 0, 0, 1]),
                             (0.5, [0, 0, 0.382683, 0.92388]),
                             (1.0, [0, 0, 0, 1])]
            ],
        }],
        "environment": {"image": "sky.hdr", "intensity": 1.0},
        "sourceBlend": "set.blend",
    }


def _entity(document, entity_id):
    return next(e for e in document["entities"] if e["id"] == entity_id)


class ConversionTests(unittest.TestCase):
    def test_point_z_up_to_y_up(self):
        self.assertEqual(core.convert_point((1, 2, 3)), (1, 3, -2))

    def test_quaternion_about_blender_z_becomes_about_rig_y(self):
        converted = core.convert_quaternion((0, 0, 0.382683, 0.92388))
        for got, want in zip(converted, (0, 0.382683, 0, 0.92388)):
            self.assertAlmostEqual(got, want, places=5)

    def test_identity_quaternion_survives(self):
        converted = core.convert_quaternion((0, 0, 0, 1))
        for got, want in zip(converted, (0, 0, 0, 1)):
            self.assertAlmostEqual(got, want, places=6)


class DocumentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.document, cls.warnings = core.build_document(build_fixture())

    def test_no_warnings_for_supported_fixture(self):
        self.assertEqual(self.warnings, [])

    def test_cube_position_is_y_up(self):
        cube = _entity(self.document, "cube")
        self.assertEqual(
            cube["components"]["rig.spatial.transform"]["position"], [0, 1, 0])
        self.assertEqual(
            cube["components"]["rig.render.material"]["albedoRgb"],
            [0.8, 0.2, 0.1])

    def test_camera_position_is_y_up(self):
        camera = _entity(self.document, "camera")
        self.assertEqual(
            camera["components"]["rig.spatial.transform"]["position"],
            [0, 2, 6])

    def test_skeleton_and_bone_parenting(self):
        root = _entity(self.document, "root")
        self.assertEqual(root["components"]["rig.anim.skeleton"],
                         {"root": "root", "bones": ["root", "tip"]})
        tip = _entity(self.document, "tip")
        self.assertEqual(
            tip["components"]["rig.spatial.relationship"]["parent"], "root")
        # Bone rest offset along Blender +Z is along Rig +Y.
        self.assertEqual(
            tip["components"]["rig.spatial.transform"]["position"], [0, 1, 0])

    def test_skin_packs_four_influences_and_renormalizes(self):
        flag = _entity(self.document, "flag")
        skin = flag["components"]["rig.anim.skin"]
        self.assertEqual(skin["skeleton"], "root")
        self.assertEqual(skin["joints"], ["root", "tip"])
        # Third vertex: Root 1, Tip 2 -> renormalised 1/3, 2/3, heaviest first.
        self.assertEqual(skin["jointIndices"][8:12], [1, 0, 0, 0])
        weights = skin["jointWeights"][8:12]
        self.assertAlmostEqual(weights[0], 0.666667, places=5)
        self.assertAlmostEqual(weights[1], 0.333333, places=5)
        # Inverse bind of Tip: translation (0, -1, 0) in column-major Rig space.
        self.assertEqual(skin["inverseBind"][16 + 12:16 + 15], [0, -1, 0])

    def test_action_samples_to_clip_and_tracks(self):
        wave = _entity(self.document, "wave")
        self.assertEqual(wave["components"]["rig.anim.clip"],
                         {"duration": 1, "wrap": "loop"})
        tracks = [e for e in self.document["entities"]
                  if "rig.anim.track" in e["components"]]
        rotation = next(t for t in tracks
                        if t["components"]["rig.anim.track"]["propertyKey"]
                        == "rotation")
        track = rotation["components"]["rig.anim.track"]
        self.assertEqual(track["target"], "tip")
        self.assertEqual(track["times"], [0, 0.5, 1])
        self.assertEqual(track["stride"], 4)
        # Middle key: about Blender Z, so about Rig Y.
        for got, want in zip(track["values"][4:8], (0, 0.382683, 0, 0.92388)):
            self.assertAlmostEqual(got, want, places=5)

    def test_ids_are_unique(self):
        ids = [e["id"] for e in self.document["entities"]]
        self.assertEqual(len(ids), len(set(ids)))


if __name__ == "__main__":
    if "--dump" in sys.argv:
        document, _warnings = core.build_document(build_fixture())
        out = sys.argv[sys.argv.index("--dump") + 1]
        with open(out, "w", encoding="utf-8") as handle:
            json.dump(document, handle, indent=2)
        print("wrote", out)
    else:
        unittest.main()
