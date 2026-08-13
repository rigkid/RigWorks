# `rig.geometry.nurbs_surface`

NURBS surface (control net in 3-space). Format when present.

Curves stay on [`rig.geometry.spline`](spline.md) / [`rig.geometry.spline3d`](spline3d.md). Do not flatten a patch to a spline, and do not invent a second curve schema.

| Field | Type | Meaning |
|-------|------|---------|
| `degreeU` | int | Polynomial degree in U (typically 3) |
| `degreeV` | int | Polynomial degree in V (typically 3) |
| `countU` | int | Control points along U; at least 2 |
| `countV` | int | Control points along V; at least 2 |
| `controlPoints` | vec3[] | Row-major net, U varies fastest. Length is `countU * countV` |
| `knotsU` | float[] | Knot vector in U (non-decreasing) |
| `knotsV` | float[] | Knot vector in V (non-decreasing) |
| `weights` | float[] | Optional. Empty or absent = all weights 1 (non-rational). Same length as `controlPoints` when present |
| `closedU` | bool | Optional. Absent = false |
| `closedV` | bool | Optional. Absent = false |

A bilinear patch is `degreeU`/`degreeV` 1 with a 2×2 net. Open uniform cubic knots for four points in one direction are `[0,0,0,0,1,1,1,1]`.

Tessellation to [`rig.geometry.mesh`](mesh.md) is host fulfillment — this schema is the parametric source of truth. Do not also attach a mesh for the same surface unless the mesh is a bake the host may rebuild.

Appearance: compose [`rig.render.material`](../render/material.md) or [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
