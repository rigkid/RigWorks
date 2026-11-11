# Blender

Blender scenes (`.blend`) are encodings. The dependency graph and an exporter that walks the evaluated scene are fulfillment, not Contract. There is no `rig.blender.*` layer - product names stay out of schema ids (same rule as [`rig.music.clock`](../schemas/music/clock.md)). Blender-only fields travel as `x.blender.*`.

The document is the **evaluated** scene: spatial / geometry / render / animation / simulation as ordinary entities. Modifier stacks, constraints, drivers, Geometry Nodes, library links, and overrides stay in the `.blend`. Changing a modifier means evaluating again. Two hosts that never ran Blender can still exchange the picture. A host **is Rig** when it emits those entities against schemas it supports ([honors](honors.md)).

## Map

| Blender idea | Rig |
|--------------|-----|
| Scene | Unparented [`rig.spatial.vertex`](../schemas/spatial/vertex.md) |
| Collection | [`rig.spatial.group`](../schemas/spatial/group.md) |
| Object name / scene path | [`rig.meta.named`](../schemas/meta/named.md) (`name`, `stableId`) |
| Object parent + local matrix | [`rig.spatial.transform`](../schemas/spatial/transform.md) + [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` |
| Empty | [`rig.spatial.vertex`](../schemas/spatial/vertex.md) on the object entity |
| Mesh datablock | [`rig.geometry.mesh`](../schemas/geometry/mesh.md). Polygons are `loops` / `loopSizes`; `loop_triangles` tessellation is `indices` |
| One material slot | [`rig.render.material`](../schemas/render/material.md) composes on the drawable |
| Principled BSDF | That material: base colour / metallic / roughness / emission to `albedoRgb` / `metallic` / `roughness` / `emissive`. An image texture on base colour is `albedoMap` pointing at [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `image`) |
| Active UV map / vertex normals | Mesh `texcoords` / `normals`. Blender UVs and split normals live on loop corners; Rig packs one UV and one normal per vertex, so the corner value of the first loop wins |
| Curve (Bezier / NURBS) | [`rig.geometry.path3d`](../schemas/geometry/path3d.md) once resolved to commands, or [`rig.geometry.spline3d`](../schemas/geometry/spline3d.md) when it stays editable as NURBS |
| NURBS surface | [`rig.geometry.nurbs_surface`](../schemas/geometry/nurbs-surface.md) |
| Text object | [`rig.media.text`](../schemas/media/text.md). The font is a [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `font`) |
| Camera (`lens`, `sensor`, ortho) | [`rig.spatial.camera`](../schemas/spatial/camera.md). Lens and sensor become `fovYDegrees` and `aspect`; ortho scale becomes `orthoHeight`. Both look along local -Z |
| Sun light | [`rig.render.light`](../schemas/render/light.md) `directional` |
| Point / Spot light | Same light, `point` / `spot`. Spot angle and blend become `outerConeDegrees` / `innerConeDegrees` |
| World HDRI background | [`rig.render.environment`](../schemas/render/environment.md) + [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `image`) |
| Armature / bones | [`rig.anim.skeleton`](../schemas/anim/skeleton.md) / [`bind`](../schemas/anim/bind.md) / bone entities. Each bone is an entity: rest pose is `bind` when it differs, pose at save is [`rig.spatial.transform`](../schemas/spatial/transform.md), parent is [`rig.spatial.relationship`](../schemas/spatial/relationship.md) |
| Vertex groups + Armature modifier | [`rig.anim.skin`](../schemas/anim/skin.md) on the mesh entity. Group weights become the four heaviest `jointWeights` per vertex |
| Action + F-Curves | [`rig.anim.clip`](../schemas/anim/clip.md) + [`rig.anim.track`](../schemas/anim/track.md), sampled. Frame numbers become seconds through the scene FPS |
| Linked duplicate / Collection instance (expanded) | [`rig.spatial.instance`](../schemas/spatial/instance.md) |
| Linked library asset left unexpanded | [`rig.media.asset_ref`](../schemas/media/asset-ref.md) `kind` `model` |
| Rigid body / collision / joint | [`rig.sim.rigidbody`](../schemas/sim/rigidbody.md) / [`rig.sim.collider`](../schemas/sim/collider.md) / [`rig.sim.joint`](../schemas/sim/joint.md) |
| Hidden object (`hide_viewport` / `hide_render`) | [`rig.render.visibility`](../schemas/render/visibility.md) on **that** entity (Rig hide does not inherit) |
| Source `.blend` | One `asset_ref` (`kind` `model`) a writer merges authored transforms and visibility back onto |

Axis, unit, time, and quaternion conversion sit at the edge. 3D is right-handed, +Y up ([document Axes](../schemas/document.md#axes)). Blender is right-handed, +Z up, so a point converts as `(x, y, z)` to `(x, z, -y)` and a rotation by conjugating with that basis change. Scene unit scale becomes `document.defaultUnit` (`1.0` with metres is `"m"`). Blender quaternions are `w, x, y, z`; Rig rotation is `[x, y, z, w]`. Frames become seconds (`frame / fps`).

Bone locals need care: a Blender bone's local frame has +Y along the bone, so a child bone's rest offset is `(0, bone length, 0)` in its parent's frame, under a parent rotation that carries that frame. Convert each bone local by the same conjugation (`C * L * C-inverse`) as any other object - do not convert bone offsets as if they were armature-space points. The composed hierarchy, and `inverseBind` converted the same way, then agree with the converted mesh.

[`rig.anim.skin`](../schemas/anim/skin.md) is four influences per vertex. A vertex weighted to more bones keeps the four heaviest weights and renormalizes - same rule as [usd.md](usd.md) and [spine.md](spine.md).

Custom properties (ID properties), panel state, and evaluated-only hints travel as `x.blender.*`. Area lights stay in the `.blend` file - [`rig.render.light`](../schemas/render/light.md) has no area lights. Shape keys stay in the `.blend` file, like USD blend shapes.

## Sketch

A scene, a collection with a cube and a camera, and a sun:

```json
{
  "entities": [
    {
      "id": "scene",
      "components": {
        "rig.meta.named": { "name": "Scene", "stableId": "Scene" },
        "rig.spatial.vertex": {}
      }
    },
    {
      "id": "cube",
      "components": {
        "rig.meta.named": { "name": "Cube", "stableId": "Scene/Rig/Cube" },
        "rig.spatial.relationship": { "parent": "scene" },
        "rig.spatial.transform": { "position": [0, 1, 0] },
        "rig.geometry.mesh": {
          "positions": [
            -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1
          ],
          "indices": [
            0, 1, 2, 0, 2, 3, 4, 7, 6, 4, 6, 5, 0, 4, 5, 0, 5, 1,
            1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0
          ],
          "loops": [
            0, 1, 2, 3, 4, 7, 6, 5, 0, 4, 5, 1, 1, 5, 6, 2, 2, 6, 7, 3, 3, 7, 4, 0
          ],
          "loopSizes": [4, 4, 4, 4, 4, 4],
          "mode": "triangles"
        },
        "rig.render.material": {
          "albedoRgb": [0.8, 0.2, 0.1],
          "roughness": 0.45
        }
      }
    },
    {
      "id": "camera",
      "components": {
        "rig.meta.named": { "name": "Camera", "stableId": "Scene/Rig/Camera" },
        "rig.spatial.relationship": { "parent": "scene" },
        "rig.spatial.transform": { "position": [0, 2, 6] },
        "rig.spatial.camera": { "fovYDegrees": 40, "nearClip": 0.1, "farClip": 100 }
      }
    },
    {
      "id": "sun",
      "components": {
        "rig.meta.named": { "name": "Sun", "stableId": "Scene/Rig/Sun" },
        "rig.spatial.relationship": { "parent": "scene" },
        "rig.spatial.transform": {
          "rotation": [-0.4226, 0, 0, 0.9063]
        },
        "rig.render.light": {
          "type": "directional",
          "intensity": 3
        }
      }
    }
  ]
}
```

(Wrap in a full document with `"rig"` set to the current [`VERSION`](../VERSION) before validating.)

## Stay out

| Stay out | Why |
|----------|-----|
| Modifier stack, Geometry Nodes | Evaluation stays in the `.blend`. The `.rig` is the evaluated picture |
| Constraints, drivers, NLA strips | Solvers and blending are fulfillment. Actions sample to tracks; the rest evaluates, then exports |
| Library linking, overrides, proxies | Linking stays in the `.blend` file. Expand an instance, or leave it as `asset_ref` |
| Shader node trees, Cycles / Eevee settings | Networks and renderers are fulfillment. Only the Principled base channels port |
| Shape keys, sculpt / multires detail | Mesh morphs and detail layers stay encoding until a second host stores them |
| UV maps beyond the active one, split normals per corner | One `texcoords` / `normals` packing on the mesh |
| Area lights, particle systems | No schema yet |
| `rig.blender.*` | Product names stay out of schema ids |

## Encodings (fulfillment)

| Surface | Role |
|---------|------|
| `.blend` | Evaluate, then map the result into the table above |
| [`tools/blender-addon/`](../tools/blender-addon/) | Blender add-on (Export > Rig Document) that walks the evaluated scene and emits this map. Bones, skins, and sampled actions included; see its README for the supported subset |
| glTF / FBX / OBJ export from Blender | The interchange route into hosts that read meshes only; treat it as a mesh bake, not this map |
| Textures and other sidecars | `.rigz` `data/`; `asset_ref.path` is relative to `data/` |
| Source `asset_ref` | `kind` `model`; a writer merges authored transforms and visibility back onto the `.blend`, same bargain as [kicad.md](kicad.md#round-trip) |
| `x.blender.*` | Custom properties, light energy in Blender units, extra UV layer names - travel; do not port |

Example: [`examples/blender-scene.json`](../examples/blender-scene.json).
