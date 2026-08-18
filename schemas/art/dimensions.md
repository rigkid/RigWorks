# `rig.art.dimensions`

Measurements of a work. Format when present.

Field meanings follow CDWA Measurements and Object ID dimensions.

| Field | Type | Meaning |
|-------|------|---------|
| `heightMillimetres` | float | Height, millimetres |
| `widthMillimetres` | float | Width, millimetres |
| `depthMillimetres` | float | Depth, millimetres |
| `weightGrams` | float | Weight, grams |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Convert centimetres and inches on import. Do not store a display string (`71 x 93 cm`) beside these values.
