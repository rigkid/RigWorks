---
id: "rig.paint.fill_stroke"
maturity: "stable"
summary: "Inline fill / stroke on a drawable entity. Format when present."
fields:
  - name: "fillRgba"
    ref: "rgba"
    meaning: "Optional. Fill colour (0-1); hosts may store as four floats"
  - name: "strokeRgba"
    ref: "rgba"
    meaning: "Optional. Stroke colour (0-1); hosts may store as four floats"
  - name: "strokeWidth"
    ref: "float"
    meaning: "Optional. Width in content units; absent = 1"
    absent: "1"
  - name: "hasFill"
    ref: "bool"
    meaning: "Optional. Draw fill; absent = whether fillRgba is present"
    absent: "whether fillRgba is present"
  - name: "hasStroke"
    ref: "bool"
    meaning: "Optional. Draw stroke; absent = whether strokeRgba is present"
    absent: "whether strokeRgba is present"
---
# `rig.paint.fill_stroke`

Inline fill / stroke on a drawable entity. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `fillRgba` | vec4 | Optional. Fill colour (0-1); hosts may store as four floats |
| `strokeRgba` | vec4 | Optional. Stroke colour (0-1); hosts may store as four floats |
| `strokeWidth` | float | Optional. Width in content units; absent = 1 |
| `hasFill` | bool | Optional. Draw fill; absent = whether `fillRgba` is present |
| `hasStroke` | bool | Optional. Draw stroke; absent = whether `strokeRgba` is present |

Caps, joins, and dash compose [`rig.paint.stroke_style`](stroke-style.md) on the same entity - do not grow this schema with those fields.

Shared library paints use [`rig.paint.solid`](solid.md) / [`rig.paint.gradient`](gradient.md) on their own entities, referenced from drawables via [`rig.paint.fill`](fill.md) / [`rig.paint.stroke`](stroke.md). Carrying the inline and referenced spelling for the same slot on one entity is a document error.
