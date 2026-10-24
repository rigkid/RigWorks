---
id: "rig.paint.gradient"
maturity: "stable"
summary: "Shared gradient paint (optional library entity)."
fields:
  - name: "kind"
    type: "string"
    enum: ["linear","radial"]
    required: true
    meaning: "linear, radial"
  - name: "stops"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"t\",\"rgba\"],\"properties\":{\"t\":{\"type\":\"number\",\"minimum\":0,\"maximum\":1},\"rgba\":{\"$ref\":\"./_defs.schema.json#/$defs/rgba\"}}}"
    required: true
    meaning: "Sorted t in 0-1"
  - name: "start"
    ref: "vec2"
    meaning: "Optional. Start / center; absent = (0, 0) in object space"
    absent: "(0, 0) in object space"
  - name: "end"
    ref: "vec2"
    meaning: "Optional. End / radius hint; absent = (1, 0) in object space"
    absent: "(1, 0) in object space"
  - name: "spread"
    type: "string"
    enum: ["pad","repeat","mirror"]
    meaning: "Optional. pad / repeat / mirror; absent = pad"
    absent: "pad"
---
# `rig.paint.gradient`

Shared gradient paint (optional library entity).

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | linear, radial |
| `stops` | {t:float, rgba:vec4}[] | Sorted t in 0-1 |
| `start` | vec2 | Optional. Start / center; absent = (0, 0) in object space |
| `end` | vec2 | Optional. End / radius hint; absent = (1, 0) in object space |
| `spread` | enum | Optional. `pad` / `repeat` / `mirror`; absent = `pad` |

A gradient transform is [`rig.spatial.transform`](../spatial/transform.md) on this entity. Do not add a matrix field.
