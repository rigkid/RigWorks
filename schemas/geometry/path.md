# `rig.geometry.path`

Freeform 2D path command stream. Format when present.

Not a parametric shape — see [`rig.geometry.shape`](shape.md).

| Field | Type | Meaning |
|-------|------|---------|
| `commands` | command[] | Ordered path commands |

## Command

| Field | Type | Meaning |
|-------|------|---------|
| `type` | enum | moveTo, lineTo, cubicTo, quadTo, close |
| `p` | vec2 | Endpoint (move/line); unused for close |
| `c1` | vec2 | Cubic/quad control 1 |
| `c2` | vec2 | Cubic control 2 |

Closed contours use a `close` command. Unknown types → skip / reject. Extend only by appending enum values.
