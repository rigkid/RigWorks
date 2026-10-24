---
id: "rig.bim.pset"
maturity: "draft"
summary: "Property sets on a BIM element or type. Format when present."
fields:
  - name: "sets"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"name\",\"properties\"],\"properties\":{\"name\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"properties\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"oneOf\":[{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"name\",\"type\",\"flag\"],\"properties\":{\"name\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"bool\"},\"flag\":{\"$ref\":\"./_defs.schema.json#/$defs/bool\"},\"unit\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"name\",\"type\",\"integer\"],\"properties\":{\"name\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"int\"},\"integer\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"unit\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"name\",\"type\",\"number\"],\"properties\":{\"name\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"float\"},\"number\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"unit\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"name\",\"type\",\"text\"],\"properties\":{\"name\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"string\"},\"text\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"unit\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"}}}]}}}}"
    required: true
    meaning: "Property sets; each has name and properties"
---
# `rig.bim.pset`

Property sets on a BIM element or type. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `sets` | object[] | Property sets; each has `name` and `properties` |

Each set:

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Property set name (`Pset_WallCommon`, ...) |
| `properties` | object[] | Properties in that set |

Each property:

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Property name (`IsExternal`, `FireRating`, ...) |
| `type` | enum | `bool`, `int`, `float`, or `string` |
| `flag` | bool | When `type` is `bool` |
| `integer` | int | When `type` is `int` |
| `number` | float | When `type` is `float` |
| `text` | string | When `type` is `string` |
| `unit` | string | Optional. Unit label for the value (`mm`, `m2`, ...); absent = document `defaultUnit` or dimensionless |

Serialize `name`, `type`, and **only** the value field that `type` selects. Omit the others.

Do not reuse [`rig.node.param`](../node/param.md)’s `f` / `i` / `s` / `v` slots. Area, volume, fire rating, and other typed parameters belong here - not on [`rig.meta.tags`](../meta/tags.md).
