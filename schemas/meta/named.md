---
id: "rig.meta.named"
maturity: "stable"
summary: "Display name and durable id. Compose onto entities that need a label."
fields:
  - name: "name"
    ref: "string"
    required: true
    meaning: "Display name"
  - name: "stableId"
    ref: "string"
    meaning: "Optional durable id (empty = none)"
---
# `rig.meta.named`

Display name and durable id. Compose onto entities that need a label.

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Display name |
| `stableId` | string | Optional durable id (empty = none) |

Do not re-declare `name` on domain schemas.
