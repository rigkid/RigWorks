---
id: "rig.led.uv_map"
maturity: "experimental"
summary: "LED UV sampling map. Format when present."
fields:
  - name: "width"
    ref: "int"
    meaning: "Optional. Grid width; absent = normalized against the host output"
    absent: "normalized against the host output"
  - name: "height"
    ref: "int"
    meaning: "Optional. Grid height; absent = normalized against the host output"
    absent: "normalized against the host output"
  - name: "pixels"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"index\",\"u\",\"v\"],\"properties\":{\"index\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"u\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"v\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"}}}"
    required: true
    meaning: "LED index and UV"
---
# `rig.led.uv_map`

LED UV sampling map. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | int | Optional. Grid width; absent = normalized against the host output |
| `height` | int | Optional. Grid height; absent = normalized against the host output |
| `pixels` | {index:int, u:float, v:float}[] | LED index and UV |

Sampling / present in code. Colours are runtime cache.
