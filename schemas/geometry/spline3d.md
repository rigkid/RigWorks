# `rig.geometry.spline3d`

NURBS / control-point spline in 3-space. Format when present.

The 3D sibling of [`rig.geometry.spline`](spline.md) — same fields, `vec3` points. Planar splines stay on spline; do not put z = 0 on spline3d to fake 2D.

| Field | Type | Meaning |
|-------|------|---------|
| `degree` | int | Polynomial degree (typically 3) |
| `closed` | bool | Optional. Absent = false |
| `controlPoints` | vec3[] | Control polygon (at least two points) |
| `knots` | float[] | Knot vector (non-decreasing) |
| `weights` | float[] | Optional. Empty or absent = all weights 1 (non-rational). Same length as `controlPoints` when present |
| `fitPoints` | vec3[] | Optional. Authoring / DXF fit points; not required for evaluation when control points + knots are present |

A NURBS *surface* is [`rig.geometry.nurbs_surface`](nurbs-surface.md), not a grid of spline3d curves.

Tessellation to polylines, path commands, or [`rig.geometry.mesh`](mesh.md) is host fulfillment — this schema is the parametric source of truth. Do not also attach [`rig.geometry.path3d`](path3d.md) for the same contour. Cubic path → NURBS is exact; arbitrary NURBS → cubic Bézier is not. Keep the authored form.

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
