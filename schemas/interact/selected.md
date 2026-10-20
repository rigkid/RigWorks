# `rig.interact.selected`

Selection snapshot. Format when present. Presence means the entity is selected.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | int | Optional. Index in a multi-selection; absent = 0 |

Eligibility is [`rig.interact.selectable`](selectable.md). Hover and the press that produced this selection stay in the host. An editor that does not save selection omits this component.
