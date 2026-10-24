---
id: "rig.node.bus"
maturity: "draft"
summary: "Named rail inside a rig.node.graph - a signal every node in the graph can tap without a drawn link (ground, master clock). Nested POD like pin and link, not a separate ECS entity."
fields:
  - name: "id"
    ref: "uint"
    required: true
    meaning: "Stable id within the graph"
  - name: "name"
    ref: "string"
    required: true
    meaning: "Rail label (ground, clock)"
  - name: "type"
    ref: "propertyType"
    required: true
    meaning: "**Property datatype id** - see properties, same table as pin type"
---
# `rig.node.bus`

Named rail inside a [`rig.node.graph`](graph.md) - a signal every node in the graph can tap without a drawn link (`ground`, `master clock`). Nested POD like [`pin`](pin.md) and [`link`](link.md), not a separate ECS entity.

| Field | Type | Meaning |
|-------|------|---------|
| `id` | uint | Stable id within the graph |
| `name` | string | Rail label (`ground`, `clock`) |
| `type` | string | **Property datatype id** - see [properties](../../docs/properties.md), same table as [pin](pin.md) `type` |

## Rules

- A pin taps a bus through its own `bus` field - do not store a member list here (same member-points-at-rail shape as [`rig.circuit.net`](../circuit/net.md)).
- At most one `out` pin drives a bus. Any number of `in` pins read it.
- An undriven bus reads as its `type` default (zeros / empty).
- An `in` pin that taps a bus is not also a link target - one source per input.
- A bus is scoped to its graph. A `nested` group has its own `buses`; the group interface stays outer pins + [`publish`](publish.md).
- Pin `type` matches bus `type`; hosts may allow the same documented coercions as [pin](pin.md) linking.

How a host draws the tap (a small tag at the pin, a ground-style symbol) is editor chrome; only the fields above travel.

Not [`rig.circuit.net`](../circuit/net.md) - that is electrical potential on circuit entities. Different graph; do not merge.
