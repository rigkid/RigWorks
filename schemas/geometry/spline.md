---
id: "rig.geometry.spline"
maturity: "stable"
summary: "NURBS / control-point spline in the plane. Format when present. Space curves use rig.geometry.spline3d."
fields:
  - name: "degree"
    ref: "int"
    required: true
    meaning: "Polynomial degree (typically 3)"
  - name: "closed"
    ref: "bool"
    meaning: "Optional. Absent = false"
    absent: "false"
  - name: "controlPoints"
    type: "array"
    minItems: 2
    itemsRef: "vec2"
    required: true
    meaning: "Control polygon (at least two points)"
  - name: "knots"
    type: "array"
    itemsType: "number"
    required: true
    meaning: "Knot vector (non-decreasing)"
  - name: "weights"
    type: "array"
    itemsType: "number"
    meaning: "Optional. Empty or absent = all weights 1 (non-rational). Same length as controlPoints when present"
  - name: "fitPoints"
    type: "array"
    itemsRef: "vec2"
    meaning: "Optional. Authoring / DXF fit points; not required for evaluation when control points + knots are present"
---
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

Tessellation to polylines or path commands is host fulfillment - this schema is the parametric source of truth. Do not also attach [`rig.geometry.path`](path.md) for the same contour.

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).

