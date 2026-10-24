---
id: "rig.sensor.gnss"
maturity: "draft"
summary: "Satellite fix. Format when present."
fields:
  - name: "rateHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Fixes per second. Absent = the host default"
    absent: "the host default"
  - name: "horizontalMetres"
    type: "number"
    minimum: 0
    meaning: "Optional. Horizontal accuracy, metres. Absent = unknown"
    absent: "unknown"
  - name: "verticalMetres"
    type: "number"
    minimum: 0
    meaning: "Optional. Vertical accuracy, metres. Absent = unknown"
    absent: "unknown"
  - name: "device"
    ref: "entity"
    meaning: "Optional. Absent = local"
    absent: "local"
---
# `rig.sensor.gnss`

Satellite fix. Format when present.

The coordinates are [`rig.place.geo`](../place/geo.md) on this entity. This component is the receiver: rate and accuracy. Do not copy latitude onto it.

| Field | Type | Meaning |
|-------|------|---------|
| `rateHz` | float | Optional. Fixes per second. Absent = the host default |
| `horizontalMetres` | float | Optional. Horizontal accuracy, metres. Absent = unknown |
| `verticalMetres` | float | Optional. Vertical accuracy, metres. Absent = unknown |
| `device` | entity | Optional. Absent = local |

Accuracy is metres whatever `document.defaultUnit` says. Absent [`rig.place.geo`](../place/geo.md) means no fix was measured. The satellite list and the NMEA stream stay in the host.

Scene pose of the antenna is [`rig.spatial.transform`](../spatial/transform.md). Geodetic and scene coordinates are different homes.
