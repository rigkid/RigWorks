---
id: "rig.node.param"
maturity: "stable"
summary: "Inline property row on a rig.node.node."
special: "raw-top"
topJson: "{\"description\":\"Serialize key, type, and only the storage field selected by type (f/i/s/v).\",\"oneOf\":[{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"key\",\"type\",\"f\"],\"properties\":{\"key\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"float\"},\"f\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"key\",\"type\",\"f\"],\"properties\":{\"key\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"double\"},\"f\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"key\",\"type\",\"i\"],\"properties\":{\"key\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"enum\":[\"bool\",\"int\",\"uint\",\"enum\",\"entity\"]},\"i\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"key\",\"type\",\"s\"],\"properties\":{\"key\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"const\":\"string\"},\"s\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"}}},{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"key\",\"type\",\"v\"],\"properties\":{\"key\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"type\":{\"enum\":[\"vec2\",\"vec3\",\"vec4\",\"quat\"]},\"v\":{\"$ref\":\"./_defs.schema.json#/$defs/vec4\"}}}]}"
fields:
---
# `rig.node.param`

Inline property row on a [`rig.node.node`](node.md).

Same datatype vocabulary as [properties](../../docs/properties.md). One active storage field per `type`.

| Field | Type | Meaning |
|-------|------|---------|
| `key` | string | Param name / path key |
| `type` | string | Property datatype id (`float`, `vec2`, `vec4`, `enum`, ...) |
| `f` | float | When `type` is `float` or `double` |
| `i` | int | When `type` is `bool`, `int`, `uint`, `enum`, or `entity` |
| `s` | string | When `type` is `string` |
| `v` | vec4 | When `type` is `vec2`, `vec3`, `vec4`, or `quat` (unused lanes 0; quat order x, y, z, w) |

Serialize `key`, `type`, and **only** the storage field that `type` selects. Omit the others.

`enum` literals are catalog / host-documented for that node `typeId` + param `key` (same idea as schema enum fields).

`f` / `i` / `s` / `v` are the intentional exception to spelled-out field names - compact tagged-union storage slots selected by `type`. Do not invent more single-letter fields outside this pattern.

Default `type` when omitted on read: `float`.
