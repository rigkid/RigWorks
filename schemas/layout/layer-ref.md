---
id: "rig.layout.layer_ref"
maturity: "draft"
summary: "Membership of a page item in a document layer. Format when present."
fields:
  - name: "layer"
    ref: "entity"
    meaning: "Optional. Entity that carries rig.layout.layer. Absent or null = unassigned (hosts treat as visible/unlocked)"
---
# `rig.layout.layer_ref`

Membership of a page item in a document layer. Format when present.

Compose on the page item. The target entity speaks [`rig.layout.layer`](layer.md).

| Field | Type | Meaning |
|-------|------|---------|
| `layer` | entity | Optional. Entity that carries `rig.layout.layer`. Absent or null = unassigned (hosts treat as visible/unlocked) |
