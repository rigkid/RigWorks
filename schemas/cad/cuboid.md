# `rig.cad.cuboid`

Axis-aligned rectangular solid. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `sizeX` | float | Extent along local X |
| `sizeY` | float | Extent along local Y |
| `sizeZ` | float | Extent along local Z |
| `center` | bool | Optional. Absent = true: the cuboid is centred on the local origin. False: the origin is a corner, extents run +X +Y +Z |

This is a CSG primitive, not a triangle mesh. Pose lives on [`rig.spatial.transform`](../spatial/transform.md). When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake a CSG host may rebuild.

A 2D rectangle stays on [`rig.geometry.rectangle`](../geometry/rectangle.md).
