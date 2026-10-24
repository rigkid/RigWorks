---
id: "rig.io.dmx"
maturity: "draft"
summary: "DMX512 port. Format when present."
fields:
  - name: "universe"
    ref: "int"
    meaning: "Optional. Logical universe index; absent = 1"
    absent: "1"
  - name: "direction"
    type: "string"
    enum: ["in","out"]
    required: true
    meaning: "in or out"
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Port active; absent = true"
    absent: "true"
---
# `rig.io.dmx`

DMX512 port. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `universe` | int | Optional. Logical universe index; absent = 1 |
| `direction` | enum | `in` or `out` |
| `enabled` | bool | Optional. Port active; absent = true |

UART / RS485 handles and the 512-byte slot buffer stay in the host. Patch lamps with [`rig.dmx.fixture`](../dmx/fixture.md) on the light entities.
