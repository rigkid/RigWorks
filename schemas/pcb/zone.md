# `rig.pcb.zone`

Copper pour. Format when present.

The outline is [`rig.geometry.polygon`](../geometry/polygon.md) on the same entity, in board coordinates (or part-local under a footprint). Layers are [`rig.pcb.layer_set`](layer-set.md). A rule area with no copper composes [`rig.pcb.keepout`](keepout.md) instead of, or as well as, this component.

| Field | Type | Meaning |
|-------|------|---------|
| `net` | entity | Optional. [`rig.circuit.net`](../circuit/net.md) the pour connects to; absent or none = isolated copper |
| `priority` | int | Optional. Higher fills first where pours overlap; absent = 0 |
| `clearance` | float | Optional. Gap to other copper; absent = board rule |
| `minThickness` | float | Optional. Narrowest copper the fill may leave; absent = board rule |
| `connection` | enum | Optional. thermal, solid, none, through-hole-only (thermal on through-hole pads, solid on SMD); absent = thermal |
| `thermalGap` | float | Optional. Gap around a thermal-relief pad; absent = board rule |
| `thermalSpokeWidth` | float | Optional. Thermal-relief spoke width; absent = board rule |

Filled polygons are a host cache: the outline, net, and rules above determine them, and a tool refills on load. Do not serialize them. Hatched fills and island removal stay in the source file for now ([`rig.pcb.board`](board.md) `source`).
