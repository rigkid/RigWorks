---
id: "rig.font.component"
maturity: "stable"
summary: "Composite reference - draw another glyph into this one. Format when present."
fields:
  - name: "glyph"
    ref: "entity"
    required: true
    meaning: "Source rig.font.glyph"
  - name: "scaleX"
    ref: "float"
    meaning: "Optional. UFO xScale; absent = 1"
    absent: "1"
  - name: "xyScale"
    ref: "float"
    meaning: "Optional. UFO xyScale; absent = 0"
    absent: "0"
  - name: "yxScale"
    ref: "float"
    meaning: "Optional. UFO yxScale; absent = 0"
    absent: "0"
  - name: "scaleY"
    ref: "float"
    meaning: "Optional. UFO yScale; absent = 1"
    absent: "1"
  - name: "offsetX"
    ref: "float"
    meaning: "Optional. UFO xOffset in font units; absent = 0"
    absent: "0"
  - name: "offsetY"
    ref: "float"
    meaning: "Optional. UFO yOffset in font units; absent = 0"
    absent: "0"
---
# `rig.font.component`

Composite reference - draw another glyph into this one. Format when present.

UFO `component` in a GLIF. Live on a **child** of the composite [`rig.font.glyph`](glyph.md) (one component type per entity). Do not reuse [`rig.spatial.transform`](../spatial/transform.md) - that is 3D TRS.

| Field | Type | Meaning |
|-------|------|---------|
| `glyph` | entity | Source [`rig.font.glyph`](glyph.md) |
| `scaleX` | float | Optional. UFO `xScale`; absent = 1 |
| `xyScale` | float | Optional. UFO `xyScale`; absent = 0 |
| `yxScale` | float | Optional. UFO `yxScale`; absent = 0 |
| `scaleY` | float | Optional. UFO `yScale`; absent = 1 |
| `offsetX` | float | Optional. UFO `xOffset` in font units; absent = 0 |
| `offsetY` | float | Optional. UFO `yOffset` in font units; absent = 0 |

The six numbers are the UFO 2×3 affine. Omit identity terms.
