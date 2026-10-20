# `rig.play.inventory`

Slots holding items. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `slots` | object[] | Slots, in order. Empty array = no slots |

Each slot:

| Field | Type | Meaning |
|-------|------|---------|
| `item` | entity | Optional. [`rig.play.item`](item.md). Absent or null = empty |
| `count` | uint | Optional. Stack size; absent = 0 |

`count` above the item's `maxStack` is a document error. The host clamps on load.
