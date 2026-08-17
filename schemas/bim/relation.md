# `rig.bim.relation`

OpenBIM relationship between two entities. Format when present — this component lives on **its own entity** (same pattern as [`rig.mod.binding`](../mod/binding.md)).

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `voids`, `fills`, `connects`, `aggregates`, or `services` |
| `a` | entity | First participant |
| `b` | entity | Second participant |

| `kind` | `a` | `b` | Meaning |
|--------|-----|-----|---------|
| `voids` | opening | host element | Opening voids the wall / slab (`IfcRelVoidsElement`) |
| `fills` | door / window | opening | Filler fills the opening (`IfcRelFillsElement`) |
| `connects` | element | element | Connection / join (`IfcRelConnects*`) |
| `aggregates` | whole | part | Aggregation (`IfcRelAggregates`) |
| `services` | system / element | element | Services / assignment (`IfcRelServicesBuildings`, …) |

Many relations per element — do not hang a single `host` field on the wall. Scene containment (element on a storey) stays on [`rig.spatial.relationship`](../spatial/relationship.md). Hosted openings are **not** [`rig.cad.boolean`](../cad/boolean.md).
