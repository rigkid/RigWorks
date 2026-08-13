# `rig.cad.extrude`

Solid from a 2D profile swept along local +Z. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `profile` | entity | Contour entity: [`rig.geometry.polygon`](../geometry/polygon.md), [`rig.geometry.path`](../geometry/path.md), or [`rig.geometry.spline`](../geometry/spline.md) |
| `height` | float | Sweep length along local +Z |
| `nDivisions` | int | Optional. Steps along the sweep (≥ 1). Absent = host default (often 1) |
| `twistDegrees` | float | Optional. Rotation about +Z from base to top. Absent = 0 |
| `scaleTop` | float | Optional. Uniform scale of the top cap relative to the profile. Absent = 1 |

The profile is read in that entity's local XY. This entity's [`rig.spatial.transform`](../spatial/transform.md) places the solid.

When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake.
