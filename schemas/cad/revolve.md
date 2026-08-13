# `rig.cad.revolve`

Solid from a 2D profile spun about local +Y. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `profile` | entity | Contour entity: [`rig.geometry.polygon`](../geometry/polygon.md), [`rig.geometry.path`](../geometry/path.md), or [`rig.geometry.spline`](../geometry/spline.md) |
| `revolveDegrees` | float | Optional. Sweep angle. Absent = 360 |
| `circularSegments` | int | Optional. Tessellation hint around the axis (≥ 3). Absent = host default |

The profile is read in that entity's local XY. A full revolve expects the profile on one side of the Y axis. This entity's [`rig.spatial.transform`](../spatial/transform.md) places the solid.

When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake.
