# `rig.geometry.path`

Freeform 2D path command stream. Format when present. Space curves use [`rig.geometry.path3d`](path3d.md).

Not a parametric shape. A contour that stays editable as parameters belongs to one of the primitives — [`rectangle`](rectangle.md), [`ellipse`](ellipse.md), [`line`](line.md), [`polygon`](polygon.md), [`regular_polygon`](regular-polygon.md), [`star`](star.md), [`arc`](arc.md), [`ring`](ring.md), [`spline`](spline.md). Use a path once it has been resolved to commands, and never both for the same contour. Circular and elliptical arcs stay on [`arc`](arc.md); do not invent path arc commands for them.

| Field | Type | Meaning |
|-------|------|---------|
| `commands` | command[] | Ordered path commands |

## Command

| Field | Type | Meaning |
|-------|------|---------|
| `type` | enum | moveTo, lineTo, cubicTo, quadTo, close |
| `point` | vec2 | Endpoint (move/line); unused for close |
| `control1` | vec2 | Cubic/quad control 1 |
| `control2` | vec2 | Cubic control 2 |

Closed contours use a `close` command. Unknown types → skip / reject. Extend only by appending enum values.
