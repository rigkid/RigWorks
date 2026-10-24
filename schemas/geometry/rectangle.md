---
id: "rig.geometry.rectangle"
maturity: "stable"
summary: "Axis-aligned rectangle. Format when present."
fields:
  - name: "x"
    ref: "float"
    required: true
    meaning: "Left edge, local space"
  - name: "y"
    ref: "float"
    required: true
    meaning: "Top edge, local space"
  - name: "width"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    required: true
    meaning: "Extent along +X; negative is invalid"
  - name: "height"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    required: true
    meaning: "Extent along +Y; negative is invalid"
  - name: "cornerRadius"
    ref: "float"
    meaning: "Optional. Corner rounding in units; absent or 0 = square corners"
    absent: "or 0 = square corners"
---
# `rig.geometry.rectangle`

Axis-aligned rectangle. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `x` | float | Left edge, local space |
| `y` | float | Top edge, local space |
| `width` | float | Extent along +X; negative is invalid |
| `height` | float | Extent along +Y; negative is invalid |
| `cornerRadius` | float | Optional. Corner rounding in units; absent or 0 = square corners |

Position is the top-left corner, not the centre. A host that models rectangles from the centre converts on read. To place a different registration at [`rig.spatial.transform`](../spatial/transform.md) `position`, compose [`rig.spatial.anchor`](../spatial/anchor.md) - do not dual-author the rectangle from the centre.

Rotation belongs to [`rig.spatial.transform`](../spatial/transform.md) - there is no angle field here.

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
