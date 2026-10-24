---
id: "rig.interact.selected"
maturity: "draft"
summary: "Selection snapshot. Format when present. Presence means the entity is selected."
topJson: "{\"minProperties\":0}"
fields:
  - name: "order"
    ref: "int"
    meaning: "Optional. Index in a multi-selection; absent = 0"
    absent: "0"
---
# `rig.interact.selected`

Selection snapshot. Format when present. Presence means the entity is selected.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | int | Optional. Index in a multi-selection; absent = 0 |

Eligibility is [`rig.interact.selectable`](selectable.md). Hover and the press that produced this selection stay in the host. An editor that does not save selection omits this component.
