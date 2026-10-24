---
id: "rig.play.save"
maturity: "draft"
summary: "One save slot. Format when present. Compose rig.meta.named for the label a player sees."
fields:
  - name: "slot"
    ref: "uint"
    required: true
    meaning: "Slot index, 0-based"
  - name: "asset"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref whose path is the saved .rig. Absent = this document is the saved scene"
    absent: "this document is the saved scene"
---
# `rig.play.save`

One save slot. Format when present. Compose [`rig.meta.named`](../meta/named.md) for the label a player sees.

| Field | Type | Meaning |
|-------|------|---------|
| `slot` | uint | Slot index, 0-based |
| `asset` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) whose path is the saved `.rig`. Absent = this document is the saved scene |

The slot names where a scene lives. Writing the file is the host.
