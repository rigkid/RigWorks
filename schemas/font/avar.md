---
id: "rig.font.avar"
maturity: "draft"
summary: "Axis variation map for one rig.font.axis. Format when present."
fields:
  - name: "segments"
    type: "array"
    minItems: 2
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"fromCoord\",\"toCoord\"],\"properties\":{\"fromCoord\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"toCoord\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"}}}"
    required: true
    meaning: "Required. At least two knots; usually includes (−1,−1), (0,0), (1,1)"
---
# `rig.font.avar`

Axis variation map for one [`rig.font.axis`](axis.md). Format when present.

OpenType `avar` segment list for that axis: normalized design (−1...1) to normalized blend (−1...1). Compose on the **same** entity as the axis. Absent component = identity map.

| Field | Type | Meaning |
|-------|------|---------|
| `segments` | segment[] | Required. At least two knots; usually includes (−1,−1), (0,0), (1,1) |

## Segment

| Field | Type | Meaning |
|-------|------|---------|
| `fromCoord` | float | Normalized design coordinate |
| `toCoord` | float | Normalized blend coordinate |

Hosts interpolate linearly between adjacent knots. Do not invent a second avar grammar on the face.
