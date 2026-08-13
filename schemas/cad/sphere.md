# `rig.cad.sphere`

Solid sphere centred on the local origin. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `radius` | float | Radius |
| `circularSegments` | int | Optional. Tessellation hint for mesh CSG kernels (≥ 3). Absent = host default |

This is a CSG primitive, not an icosphere mesh. Pose lives on [`rig.spatial.transform`](../spatial/transform.md). When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake.

A 2D circle stays on [`rig.geometry.ellipse`](../geometry/ellipse.md) with equal radii.
