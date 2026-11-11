# Blender add-on: Export Rig Document

Exports the **evaluated** Blender scene as a Rig document (`.rig`), implementing the map in [`docs/blender.md`](../../docs/blender.md). Blender stays the authoring tool; the `.rig` is the portable picture other Rig hosts present and play. Nothing here parses `.blend` files - Blender itself walks its own scene.

Open the `.rig` in RigKit **example-stage**: `--open=path/to/scene.rig` (phase plan: RigKit [`docs/blender-load.md`](https://github.com/rigkid/RigKit/blob/main/docs/blender-load.md)).

## Install

1. Zip the `rig_exporter/` folder in this directory (the zip root must contain `rig_exporter/__init__.py`), or in Blender: Preferences > Add-ons > Install and pick that zip.
2. Enable **Import-Export: Rig Document**.
3. Use **File > Export > Rig Document (.rig)**.

Requires Blender 3.6 or newer.

## Options

| Option | Meaning |
|--------|---------|
| Apply Modifiers | Export dependency-graph evaluated meshes. Skinned meshes always export unevaluated, so the bind pose survives |
| Export Animation | Sample assigned actions frame by frame into `rig.anim.clip` + `rig.anim.track` (seconds, through scene FPS) |
| Frame Step | Sample every Nth frame when exporting animation |

## Supported subset

Ship what you support - this add-on ports:

- Scene and Collection hierarchy (`rig.spatial.vertex` / `rig.spatial.group`), object parenting, local transforms, hide flags.
- Meshes: positions, averaged vertex normals, authored polygon `loops` / `loopSizes`, triangle `indices`, active UV map (first loop corner per vertex wins).
- First material slot when it is a Principled BSDF: base colour, metallic, roughness, emission, and an image texture on base colour as `albedoMap`.
- Cameras (perspective FOV from lens/sensor, orthographic height, clip planes) and Sun / Point / Spot lights.
- Armatures: bones as entities with rest pose (`rig.anim.bind` when posed), `rig.anim.skeleton`, and vertex-group skins packed to four influences per vertex, heaviest first, renormalised.
- World environment image as `rig.render.environment`, and the source `.blend` as an `asset_ref` (`kind` `model`) when the file is saved.

Everything else is named in an export warning, never silently dropped and never emitted as a fake component: area lights, Curve / Text / Surface datablocks (transform and name only), extra material slots, extra UV maps, shape keys, constraints, drivers, and node trees stay in the `.blend`.

Known unit fudge: Blender point/spot energy is watts and sun energy is irradiance; neither is a Rig unit. Point/spot intensity is exported as watts / 1000 so typical scenes land near 1. Treat light intensity as approximate across hosts.

## Layout

| File | Role |
|------|------|
| `rig_exporter/__init__.py` | Blender operator and menu wiring |
| `rig_exporter/collect.py` | Walks `bpy` (evaluated depsgraph, pose, sampled frames) into plain dicts |
| `rig_exporter/core.py` | Pure assembly: ids, Z-up to Y-up conversion, skin packing, clip/track sampling. No `bpy` import |
| `test_core.py` | Unit tests for `core.py`; runs with system Python, no Blender needed |

## Test

```bash
python tools/blender-addon/test_core.py
python tools/blender-addon/test_core.py --dump /tmp/blender-addon-out.json
node tools/rig-validate/cli.js --strict /tmp/blender-addon-out.json
```

The dumped fixture document must validate. The `bpy` adapter (`collect.py`) only runs inside Blender; smoke it headless (verified on Blender 5.2):

```bash
blender --background --factory-startup --python tools/blender-addon/smoke_test.py -- /tmp/rig-smoke
node tools/rig-validate/cli.js --strict /tmp/rig-smoke/smoke-anim.rig
```

`smoke_test.py` builds a scene exercising every ported feature (Principled cube, camera, sun/spot/area lights, a skinned two-bone armature with a keyframed bone, a hidden empty, a curve), exports through the real operator with animation sampling, and asserts on the JSON - including that the area light and curve export honestly with warnings instead of fake components. It prints `SMOKE OK` on success. To exercise the installed add-on path instead of the `sys.path` fallback, copy `rig_exporter/` into `$BLENDER_USER_SCRIPTS/addons/` first.
