---
id: "rig.sensor.gpio"
maturity: "draft"
summary: "Digital hosts threshold level themselves (e.g. ≥ 0.5). A ROS 2 node entity is a valid device - docs/ros.md."
fields:
  - name: "pin"
    ref: "int"
    required: true
    meaning: "GPIO index"
  - name: "mode"
    type: "string"
    enum: ["in","out"]
    required: true
    meaning: "in, out"
  - name: "level"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 reading or drive; absent = 0"
    absent: "0"
  - name: "device"
    ref: "entity"
    meaning: "Optional board / network entity; absent or none = local"
    absent: "or none = local"
  - name: "terminal"
    ref: "entity"
    meaning: "Optional. rig.circuit.pin this line drives or reads; absent = not linked to a design"
    absent: "not linked to a design"
---
# `rig.sensor.gpio`

| Field | Type | Meaning |
|-------|------|---------|
| `pin` | int | GPIO index |
| `mode` | enum | in, out |
| `level` | float | Optional. 0-1 reading or drive; absent = 0 |
| `device` | entity | Optional board / network entity; absent or none = local |
| `terminal` | entity | Optional. [`rig.circuit.pin`](../circuit/pin.md) this line drives or reads; absent = not linked to a design |

Digital hosts threshold `level` themselves (e.g. ≥ 0.5). A ROS 2 node entity is a valid `device` - [docs/ros.md](../../docs/ros.md).

`pin` is the controller's logical line (BCM 17 on a Raspberry Pi). The physical terminal it comes out on (header pin 11) is the `terminal` entity's `number`. Keep both: code addresses the line, a wiring diagram addresses the terminal.
