---
id: "rig.pcb.track"
maturity: "draft"
summary: "Copper conductor. Format when present."
fields:
  - name: "width"
    ref: "float"
    required: true
    meaning: "Copper width"
  - name: "net"
    ref: "entity"
    meaning: "Optional. rig.circuit.net; absent or none = no net"
    absent: "or none = no net"
---
# `rig.pcb.track`

Copper conductor. Format when present.

The path is [`rig.geometry.line`](../geometry/line.md) (straight segment) or [`rig.geometry.arc`](../geometry/arc.md) (circular arc, equal radii) on the same entity, in board coordinates. The layer is [`rig.pcb.layer_set`](layer-set.md) with one copper layer.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | float | Copper width |
| `net` | entity | Optional. [`rig.circuit.net`](../circuit/net.md); absent or none = no net |

Required: `width`.

Copper width is a fabrication fact, not paint - do not mirror it into [`rig.paint.fill_stroke`](../paint/fill-stroke.md) `strokeWidth`. Draw colour comes from the layer. Arc direction carries no meaning on a board; a writer may emit the sweep either way.
