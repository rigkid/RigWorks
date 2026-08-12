# `rig.geometry.spline`

NURBS / control-point spline in the plane. Format when present. Space curves use [`rig.geometry.spline3d`](spline3d.md).

| Field | Type | Meaning |
|-------|------|---------|
| `degree` | int | Polynomial degree (typically 3) |
| `closed` | bool | Optional. Absent = false |
| `controlPoints` | vec2[] | Control polygon (at least two points) |
| `knots` | float[] | Knot vector (non-decreasing) |
| `weights` | float[] | Optional. Empty or absent = all weights 1 (non-rational). Same length as `controlPoints` when present |
| `fitPoints` | vec2[] | Optional. Authoring / DXF fit points; not required for evaluation when control points + knots are present |

Tessellation to polylines or path commands is host fulfillment — this schema is the parametric source of truth. Do not also attach [`rig.geometry.path`](path.md) for the same contour.

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).

