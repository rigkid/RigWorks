---
id: "rig.sensor.presence"
maturity: "draft"
summary: "Occupancy / presence reading. Format when present."
fields:
  - name: "level"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 occupancy; absent = 0"
    absent: "0"
  - name: "device"
    ref: "entity"
    meaning: "Optional board / network entity; absent = local"
    absent: "local"
---
# `rig.sensor.presence`

Occupancy / presence reading. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `level` | float | Optional. 0-1 occupancy; absent = 0 |
| `device` | entity | Optional board / network entity; absent = local |

Digital hosts threshold `level` themselves. Bus addresses, UART handles, and raw mmWave packets stay in the host (or `x.<vendor>.*` device ops). A ROS 2 node entity is a valid `device` - [docs/ros.md](../../docs/ros.md).
