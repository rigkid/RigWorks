# `rig.geometry.shape`

Parametric 2D primitive (bbox model). Format when present.

Use [`rig.geometry.path`](path.md) for freeform command streams — not both for the same contour.

| Field | Type | Meaning |
|-------|------|---------|
| `type` | enum | rectangle, ellipse, line, polygon, star |
| `x1` | float | Start / min X |
| `y1` | float | Start / min Y |
| `x2` | float | End / max X |
| `y2` | float | End / max Y |
| `sides` | int | Star / regular-polygon side count |
| `innerRadius` | float | Star inner radius (0–1 of outer) |

`polygon` / `star` are regular n-gons in the bbox. Freeform polygons use path.

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
