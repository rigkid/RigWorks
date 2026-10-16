# `rig.pcb.via`

Plated hole joining copper layers. Format when present.

Position is [`rig.spatial.transform`](../spatial/transform.md) in board coordinates. [`rig.pcb.layer_set`](layer-set.md) names the two copper layers it runs between (front and back for a through via).

| Field | Type | Meaning |
|-------|------|---------|
| `diameter` | float | Outer copper ring diameter |
| `drill` | float | Hole diameter |
| `kind` | enum | Optional. through, blind-buried, micro; absent = through |
| `net` | entity | Optional. [`rig.circuit.net`](../circuit/net.md); absent or none = no net |

Required: `diameter`, `drill`.
