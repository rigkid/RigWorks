# `rig.paint.fill_stroke`

Inline fill / stroke on a drawable entity. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `fillRgba` | vec4 | Fill colour (0–1); hosts may store as four floats |
| `strokeRgba` | vec4 | Stroke colour (0–1); hosts may store as four floats |
| `strokeWidth` | float | Width in content units |
| `hasFill` | bool | Draw fill |
| `hasStroke` | bool | Draw stroke |

Host extensions (optional): stroke caps / joins / dash.

Shared library paints use [`rig.paint.solid`](solid.md) / [`rig.paint.gradient`](gradient.md) on their own entities.
