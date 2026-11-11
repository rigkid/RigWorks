# OpenUSD

OpenUSD stages (`.usda`, `.usdc`, `.usd`, `.usdz`) are encodings. The OpenUSD library, Hydra, and a writer that merges `over` opinions back onto a layer are fulfillment, not Contract. Do not invent `rig.usd.*` - USD-only fields travel as `x.usd.*`. Product names stay out of schema ids (same rule as [`rig.music.clock`](../schemas/music/clock.md)).

The document is the **composed** stage: spatial / geometry / render / animation / simulation. Sublayers, references, payloads, variant sets, inherits, specializes, and list-editing stay in the USD file. Compose, then write ordinary entities. Switching a variant means composing again. Two hosts that never linked OpenUSD can exchange the picture. A host **is Rig** when it emits those entities against schemas it supports ([honors](honors.md)).

## Map

| OpenUSD idea | Rig |
|--------------|-----|
| Stage / `defaultPrim` | Unparented [`rig.spatial.vertex`](../schemas/spatial/vertex.md) |
| `Xform` | [`rig.spatial.transform`](../schemas/spatial/transform.md) + [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` |
| `Scope` | [`rig.spatial.group`](../schemas/spatial/group.md) |
| Prim name / path | [`rig.meta.named`](../schemas/meta/named.md) (`name`, `stableId`) |
| `UsdGeomMesh` | [`rig.geometry.mesh`](../schemas/geometry/mesh.md). `faceVertexCounts` / `faceVertexIndices` are `loopSizes` / `loops`. Triangle tessellation is `indices` |
| One `GeomSubset` material bind | One mesh entity - [`rig.render.material`](../schemas/render/material.md) composes on the drawable |
| `UsdPreviewSurface` | That material: `diffuseColor` / `metallic` / `roughness` / `emissiveColor` to `albedoRgb` / `metallic` / `roughness` / `emissive`. Copy a shared bind onto each mesh |
| `primvars:st` / `normals` | Mesh `texcoords` / `normals` |
| `UsdGeomCamera` | [`rig.spatial.camera`](../schemas/spatial/camera.md). Focal length and apertures become `fovYDegrees` and `aspect`. Both look along local -Z |
| `DistantLight` | [`rig.render.light`](../schemas/render/light.md) `directional` |
| Point-like `SphereLight` | Same light, `point` |
| `ShapingAPI` cone | Same light, `spot` (`innerConeDegrees` / `outerConeDegrees`) |
| `DomeLight` | [`rig.render.environment`](../schemas/render/environment.md) + [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `image`) |
| Cubic basis curves | [`rig.geometry.path3d`](../schemas/geometry/path3d.md) |
| NURBS curves | [`rig.geometry.spline3d`](../schemas/geometry/spline3d.md) |
| `NurbsPatch` | [`rig.geometry.nurbs_surface`](../schemas/geometry/nurbs-surface.md) |
| Skeleton / bind / skin | [`rig.anim.skeleton`](../schemas/anim/skeleton.md) / [`bind`](../schemas/anim/bind.md) / [`skin`](../schemas/anim/skin.md) |
| Skel animation | [`rig.anim.clip`](../schemas/anim/clip.md) + [`rig.anim.track`](../schemas/anim/track.md). TimeCodes become seconds |
| Same-document reference or expanded point instancer | [`rig.spatial.instance`](../schemas/spatial/instance.md) |
| External reference left unexpanded | [`rig.media.asset_ref`](../schemas/media/asset-ref.md) `kind` `model` |
| Rigid body / collider | [`rig.sim.rigidbody`](../schemas/sim/rigidbody.md) / [`rig.sim.collider`](../schemas/sim/collider.md) |
| Fixed / revolute / prismatic / spherical / distance joint | [`rig.sim.joint`](../schemas/sim/joint.md) `fixed` / `hinge` / `slider` / `ball` / `distance` |
| Composed invisible | [`rig.render.visibility`](../schemas/render/visibility.md) on **that** entity (Rig hide does not inherit) |
| Source stage | One `asset_ref` (`kind` `model`) a writer merges `over` opinions onto |

Axis, unit, time, and quaternion conversion sit at the edge. 3D is right-handed, +Y up ([document Axes](../schemas/document.md#axes)). `upAxis = Z` converts to that. `metersPerUnit` becomes `document.defaultUnit` (`1` is `"m"`, `0.01` is `"cm"`, `0.001` is `"mm"`). USD's fallback is centimetres. `xformOp` stacks bake into one transform (`position` / `rotation` / `scale` / `shear`). Extent caches stay out.

`GfQuat` is real, i, j, k (`w, x, y, z`). Rig rotation is `[x, y, z, w]`. Animation `timeCodes / timeCodesPerSecond` is seconds (`timeCodesPerSecond` fallback 24).

[`rig.anim.skin`](../schemas/anim/skin.md) is four influences per vertex. A host that reads a vertex with more keeps the four heaviest weights and renormalizes - same rule as [spine.md](spine.md).

Photometric light intensity, active variant, purpose, kind, subdivision scheme, and double-sided travel as `x.usd.*`. Rect, disk, and cylinder lights stay in the USD file - [`rig.render.light`](../schemas/render/light.md) has no area lights. A D6 joint stays in the USD file.

## Sketch

A world, a cube with a material, sitting on y = 0:

```json
{
  "entities": [
    {
      "id": "world",
      "components": {
        "rig.meta.named": { "name": "World", "stableId": "World" },
        "rig.spatial.vertex": {}
      }
    },
    {
      "id": "body",
      "components": {
        "rig.meta.named": { "name": "Body", "stableId": "World/Body" },
        "rig.spatial.relationship": { "parent": "world" },
        "rig.spatial.transform": { "position": [0, 50, 0] },
        "rig.geometry.mesh": {
          "positions": [
            -50, -50, -50, 50, -50, -50, 50, 50, -50, -50, 50, -50,
            -50, -50, 50, 50, -50, 50, 50, 50, 50, -50, 50, 50
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
          "albedoRgb": [0.82, 0.78, 0.72],
          "roughness": 0.45
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
| Sublayers, references as arcs, payloads | Composition stays in the USD file. The `.rig` is the composed picture |
| Variant sets, inherits, specializes, list-editing | Same. Switching a variant re-composes the USD file |
| Hydra, MaterialX, shader graphs | Presenters and networks are fulfillment |
| Blend shapes, creases, extra UV sets | Mesh morphs and extra primvars stay encoding until a second host stores them |
| Primvars other than one UV set plus per-vertex normals | One `texcoords` / `normals` packing on the mesh |
| Unexpanded point instancers | Expand to `spatial.instance`, or leave them in the USD file |
| Area lights, D6 joints | Leave them in the USD file |
| `rig.usd.*` | Product names stay out of schema ids |

## Encodings (fulfillment)

| Surface | Role |
|---------|------|
| `.usda` / `.usdc` / `.usd` | Compose, then map the result into the table above |
| `.usdz` | Packaged stage; textures and payloads travel in the zip. Sidecars that leave with a `.rig` go in `.rigz` `data/` |
| Source `asset_ref` | `kind` `model`; a writer merges authored transforms and visibility back as `over` opinions, same bargain as [kicad.md](kicad.md#round-trip) |
| `x.usd.*` | Active variant, purpose, kind, subdivision scheme, double-sided, photometric intensity - travel; do not port |

Example: [`examples/usd-stage.json`](../examples/usd-stage.json).
