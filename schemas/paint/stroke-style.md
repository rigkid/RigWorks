# `rig.paint.stroke_style`

Stroke caps, joins, and dash on a drawable. Format when present.

Compose on the same entity as [`rig.paint.fill_stroke`](fill-stroke.md) or [`rig.paint.stroke`](stroke.md). Colour and width stay there. Omit this component when every field is the absent default.

| Field | Type | Meaning |
|-------|------|---------|
| `cap` | enum | Optional. butt, square, round; absent = butt |
| `join` | enum | Optional. miter, bevel, round; absent = miter |
| `miterLimit` | float | Optional. Miter cut-off (SVG / canvas); absent = 4. Meaningful when `join` is miter; hosts that do not ship a limiter still accept and ignore it |
| `dash` | float[] | Optional. On/off lengths in content units; absent or empty = solid |
| `dashOffset` | float | Optional. Dash phase in content units; absent = 0 |

Do not grow [`rig.paint.fill_stroke`](fill-stroke.md) with these fields. Do not put them on the paint entity ([`rig.paint.solid`](solid.md) / [`rig.paint.gradient`](gradient.md)).
