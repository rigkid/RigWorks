---
id: "rig.pixel.canvas"
maturity: "draft"
summary: "Artboard size and clear colour. Format when present."
fields:
  - name: "width"
    ref: "int"
    required: true
    meaning: "Pixels"
  - name: "height"
    ref: "int"
    required: true
    meaning: "Pixels"
  - name: "clearRgba"
    ref: "rgba"
    meaning: "Optional. Clear colour (0-1); absent = transparent black (0, 0, 0, 0)"
    absent: "transparent black (0, 0, 0, 0)"
---
# `rig.pixel.canvas`

Artboard size and clear colour. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the document title.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | int | Pixels |
| `height` | int | Pixels |
| `clearRgba` | vec4 | Optional. Clear colour (0-1); absent = transparent black (0, 0, 0, 0) |

Dirty flags, GPU preference, and surfaces stay in the host - do not serialize.
