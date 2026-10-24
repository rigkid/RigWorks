---
id: "rig.art.dimensions"
maturity: "draft"
summary: "Measurements of a work. Format when present."
topJson: "{\"description\":\"Measurements. Field meanings follow CDWA Measurements / Object ID. Values in millimetres and grams.\",\"minProperties\":1}"
fields:
  - name: "heightMillimetres"
    ref: "float"
    meaning: "Height, millimetres"
  - name: "widthMillimetres"
    ref: "float"
    meaning: "Width, millimetres"
  - name: "depthMillimetres"
    ref: "float"
    meaning: "Depth, millimetres"
  - name: "weightGrams"
    ref: "float"
    meaning: "Weight, grams"
---
# `rig.art.dimensions`

Measurements of a work. Format when present.

Field meanings follow CDWA Measurements and Object ID dimensions.

| Field | Type | Meaning |
|-------|------|---------|
| `heightMillimetres` | float | Height, millimetres |
| `widthMillimetres` | float | Width, millimetres |
| `depthMillimetres` | float | Depth, millimetres |
| `weightGrams` | float | Weight, grams |

All fields optional. Emit what the source has. An empty component is invalid - attach at least one field.

Convert centimetres and inches on import. Do not store a display string (`71 x 93 cm`) beside these values.
