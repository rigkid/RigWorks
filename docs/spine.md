# Spine

A host **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). Spine skeleton JSON, atlas pages, and compiled playback models are encodings. Compilers, named-assertion gates, and runtimes are fulfillment - not this catalog.

Unlike [OpenBIM](openbim.md), there is no `rig.spine.*` layer. Portable meaning is spatial / animation / mesh / paint. Product names stay out of schema ids (same rule as [`rig.music.clock`](../schemas/music/clock.md)). Spine-only fields travel as `x.spine.*` until a second speaker needs the same meaning in the catalog.

One compiler that emits Spine 4.3 JSON is [rig-c](https://rig-c.org/). Its `rigc-rig/1` and `rigc-motion/1` specs, `skeleton.model.json`, and `@rig-c/play` stay fulfillment.

## Map

| Spine idea | Rig |
|------------|-----|
| Bone | Entity with [`rig.meta.named`](../schemas/meta/named.md) + [`rig.spatial.transform`](../schemas/spatial/transform.md) |
| Parent bone | [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` |
| Bone list | [`rig.anim.skeleton`](../schemas/anim/skeleton.md) `root` / `bones` |
| Setup pose | [`rig.anim.bind`](../schemas/anim/bind.md) on the bone when rest differs from the transform at save |
| Animation | [`rig.anim.clip`](../schemas/anim/clip.md) (`duration` in seconds, `wrap`) |
| Bone keys | [`rig.anim.track`](../schemas/anim/track.md) on `position` / `rotation` / `scale` |
| Region attachment | [`rig.geometry.mesh`](../schemas/geometry/mesh.md) quad + [`rig.render.material`](../schemas/render/material.md) `albedoMap` pointing at [`rig.media.asset_ref`](../schemas/media/asset-ref.md) |
| Atlas rectangle | UVs on that mesh (`texcoords`) |
| Weighted mesh | Same mesh plus [`rig.anim.skin`](../schemas/anim/skin.md) (four influences, `inverseBind`) |
| Draw order | [`rig.spatial.layer`](../schemas/spatial/layer.md) `order` on the drawable |

Axis conversion sits at the edge: Spine 2D is Y-up; Rig 2D is +X right, +Y down ([document Axes](../schemas/document.md#axes)). Rotation on the 2D plane is a quaternion about local Z. Baked animation keys already include IK and path-constraint solves, so those solvers stay in the file that was compiled.

[`rig.anim.skin`](../schemas/anim/skin.md) is four influences per vertex. A measured Spine 4.3 character (rig-c rigboy: 16 region attachments, 3 weighted meshes, 1650 weighted vertices) used at most three bones on any vertex. A host that reads a vertex with more keeps the four heaviest weights and renormalizes.

## Sketch

A root, one child bone, a textured quad on the child, and a one-second loop:

```json
{
  "entities": [
    {
      "id": "root",
      "components": {
        "rig.meta.named": { "name": "root", "stableId": "root" },
        "rig.spatial.transform": { "position": [0, 0, 0] },
        "rig.anim.skeleton": { "root": "root", "bones": ["root", "arm"] }
      }
    },
    {
      "id": "arm",
      "components": {
        "rig.meta.named": { "name": "arm", "stableId": "arm" },
        "rig.spatial.relationship": { "parent": "root" },
        "rig.spatial.transform": { "position": [0, 40, 0] },
        "rig.anim.bind": { "position": [0, 40, 0] }
      }
    },
    {
      "id": "plate",
      "components": {
        "rig.meta.named": { "name": "plate", "stableId": "plate" },
        "rig.spatial.relationship": { "parent": "arm" },
        "rig.geometry.mesh": {
          "positions": [-20, -20, 0, 20, -20, 0, 20, 20, 0, -20, 20, 0],
          "texcoords": [0, 1, 1, 1, 1, 0, 0, 0],
          "indices": [0, 1, 2, 0, 2, 3],
          "mode": "triangles"
        },
        "rig.render.material": { "albedoMap": "paint" }
      }
    },
    {
      "id": "paint",
      "components": {
        "rig.media.asset_ref": { "kind": "image", "path": "parts/plate.png" }
      }
    },
    {
      "id": "wave",
      "components": {
        "rig.meta.named": { "name": "wave", "stableId": "wave" },
        "rig.anim.clip": { "duration": 1, "wrap": "loop" }
      }
    },
    {
      "id": "wave-rot",
      "components": {
        "rig.anim.track": {
          "clip": "wave",
          "target": "arm",
          "propertyKey": "rotation",
          "times": [0, 0.5, 1],
          "values": [0, 0, 0, 1, 0, 0, 0.3827, 0.9239, 0, 0, 0, 1],
          "stride": 4
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
| Slots as objects | Draw order is `spatial.layer`; attachment skins stay encoding or `x.spine.*` |
| Atlas page records | UVs and `asset_ref` already name the image |
| Deform timelines | Mesh morphs stay encoding until a second host stores them |
| Draw-order keys | Live reorder is host cache; authored order is `spatial.layer` |
| IK / transform / path constraints | Solvers are fulfillment, same bargain as [robot.md](robot.md) |
| Cloth / physics | Runtime, not document data |
| `rig.spine.*` / `rig.rigc.*` | Product names stay out of schema ids |

## Encodings (fulfillment)

| Surface | Role |
|---------|------|
| Spine 4.x `skeleton.json` + `.atlas` | Map bones, baked tracks, region quads, and four-influence skins into the table above |
| `rigc-rig/1` / `rigc-motion/1` | Authoring specs a compiler consumes; emit Spine JSON, then map that |
| `skeleton.model.json` | One player's compiled model; not a second Contract document |
| Images | `.rigz` `data/` sidecars; `asset_ref.path` is relative to `data/` |
| `x.spine.*` | Slot names, attachment-skin sets, leftover constraint fields - travel; do not port |

Example: [`examples/play-scene.json`](../examples/play-scene.json) (walk track on a bone).
