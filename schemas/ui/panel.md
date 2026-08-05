# `rig.ui.panel`

Grouping and ordering for a control surface. Labels compose [`rig.meta.named`](../meta/named.md) — do not re-declare `name` here.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | int | Sort key among sibling panels |
| `visible` | bool | Whether the panel is shown |

Controls and actions reference this entity via their `panel` field. Layout chrome (docks, tabs, ESP page shells) is fulfillment — not this schema.

A host that implements six schemas and ignores the rest may still ship a panel over the fields it understands. Ship what you support.
