# `rig.ui.panel`

Grouping and ordering for a control surface. Labels compose [`rig.meta.named`](../meta/named.md) — do not re-declare `name` here.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | int | Optional. Sort key among sibling panels; absent = 0 |
| `visible` | bool | Optional. Whether the panel is shown; absent = true |

Controls and actions reference this entity via their `panel` field. Layout chrome (docks, tabs, ESP page shells) is fulfillment — not this schema.

A host that implements six schemas and ignores the rest may still ship a panel over the fields it understands. Ship what you support.
