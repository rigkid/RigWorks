---
id: "rig.circuit.pin"
maturity: "draft"
summary: "One physical terminal of a part - the metal you solder to or probe. Format when present."
fields:
  - name: "number"
    ref: "string"
    required: true
    meaning: "Terminal number as printed on the package or connector (1, A1, EP). A string, not an index"
  - name: "function"
    ref: "string"
    meaning: "Optional. Terminal function (GPIO17, VCC, SDA); absent = none"
    absent: "none"
  - name: "electricalType"
    type: "string"
    enum: ["input","output","bidirectional","tri-state","passive","free","unspecified","power-in","power-out","open-collector","open-emitter","no-connect"]
    meaning: "Optional. input, output, bidirectional, tri-state, passive, free, unspecified, power-in, power-out, open-collector, open-emitter, no-connect; absent = unspecified"
    absent: "unspecified"
  - name: "net"
    ref: "entity"
    meaning: "Optional. rig.circuit.net this terminal connects to; absent or none = unconnected"
    absent: "or none = unconnected"
---
# `rig.circuit.pin`

One physical terminal of a part - the metal you solder to or probe. Format when present.

The entity is a child of its [`rig.circuit.part`](part.md). Drawings of the terminal compose on the same entity: a footprint pad is [`rig.pcb.pad`](../pcb/pad.md); a schematic symbol pin is a future drawing schema. KiCad joins symbol pin and pad by matching `number` strings - here they are one entity, so there is nothing to join.

| Field | Type | Meaning |
|-------|------|---------|
| `number` | string | Terminal number as printed on the package or connector (`1`, `A1`, `EP`). A string, not an index |
| `function` | string | Optional. Terminal function (`GPIO17`, `VCC`, `SDA`); absent = none |
| `electricalType` | enum | Optional. input, output, bidirectional, tri-state, passive, free, unspecified, power-in, power-out, open-collector, open-emitter, no-connect; absent = unspecified |
| `net` | entity | Optional. [`rig.circuit.net`](net.md) this terminal connects to; absent or none = unconnected |

Required: `number`.

Two entities may share a `number` on one part (a split exposed pad, a shield tab drawn twice). They are the same terminal electrically.

A live line that reads or drives this terminal is [`rig.sensor.gpio`](../sensor/gpio.md) with `terminal` pointing here. GPIO `pin` is the controller's logical line (BCM 17); `number` here is the physical terminal (header pin 11) - different numbers, both true.

Not [`rig.node.pin`](../node/pin.md) - that is a socket on an artist node graph. Different graph; do not merge.
