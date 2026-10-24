---
id: "rig.geometry.nurbs_surface"
maturity: "stable"
summary: "NURBS surface (control net in 3-space). Format when present."
fields:
  - name: "degreeU"
    ref: "int"
    required: true
    meaning: "Polynomial degree in U (typically 3)"
  - name: "degreeV"
    ref: "int"
    required: true
    meaning: "Polynomial degree in V (typically 3)"
  - name: "countU"
    type: "integer"
    minimum: 2
    required: true
    meaning: "Control points along U; at least 2"
  - name: "countV"
    type: "integer"
    minimum: 2
    required: true
    meaning: "Control points along V; at least 2"
  - name: "controlPoints"
    type: "array"
    minItems: 4
    itemsRef: "vec3"
    required: true
    meaning: "Row-major net, U varies fastest. Length is countU * countV"
  - name: "knotsU"
    type: "array"
    itemsType: "number"
    required: true
    meaning: "Knot vector in U (non-decreasing)"
  - name: "knotsV"
    type: "array"
    itemsType: "number"
    required: true
    meaning: "Knot vector in V (non-decreasing)"
  - name: "weights"
    type: "array"
    itemsType: "number"
    meaning: "Optional. Empty or absent = all weights 1 (non-rational). Same length as controlPoints when present"
  - name: "closedU"
    ref: "bool"
    meaning: "Optional. Absent = false"
    absent: "false"
  - name: "closedV"
    ref: "bool"
    meaning: "Optional. Absent = false"
    absent: "false"
---
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

Tessellation to [`rig.geometry.mesh`](mesh.md) is host fulfillment - this schema is the parametric source of truth. Do not also attach a mesh for the same surface unless the mesh is a bake the host may rebuild.

Appearance: compose [`rig.render.material`](../render/material.md) or [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
