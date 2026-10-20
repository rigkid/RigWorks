# `rig.play.save`

One save slot. Format when present. Compose [`rig.meta.named`](../meta/named.md) for the label a player sees.

| Field | Type | Meaning |
|-------|------|---------|
| `slot` | uint | Slot index, 0-based |
| `asset` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) whose path is the saved `.rig`. Absent = this document is the saved scene |

The slot names where a scene lives. Writing the file is the host.
