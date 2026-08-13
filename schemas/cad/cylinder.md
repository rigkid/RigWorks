# `rig.cad.cylinder`

Circular cylinder. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `radius` | float | Radius in the local XZ plane |
| `height` | float | Length along local +Y |
| `circularSegments` | int | Optional. Tessellation hint for mesh CSG kernels (≥ 3). Absent = host default |
| `center` | bool | Optional. Absent = true: the cylinder is centred on the local origin along Y. False: the origin is the base, height runs +Y |

This is a CSG primitive, not a triangle mesh. Pose lives on [`rig.spatial.transform`](../spatial/transform.md). When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake.

A 2D ellipse / circle stays on [`rig.geometry.ellipse`](../geometry/ellipse.md).
