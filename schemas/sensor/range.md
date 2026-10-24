---
id: "rig.sensor.range"
maturity: "draft"
summary: "One distance beam. Format when present. Looks along local −Z."
fields:
  - name: "rangeMin"
    type: "number"
    minimum: 0
    meaning: "Optional. Near distance, scene units. Absent = 0"
    absent: "0"
  - name: "rangeMax"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Far distance. Absent = the host default"
    absent: "the host default"
  - name: "fovDegrees"
    type: "number"
    minimum: 0
    maximum: 180
    meaning: "Optional. Cone, 0-180. Absent = 0, a single ray"
    absent: "0, a single ray"
  - name: "distance"
    type: "number"
    minimum: 0
    meaning: "Optional. Reading at load, scene units. Absent = not measured"
    absent: "not measured"
  - name: "rateHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Samples per second. Absent = the host default"
    absent: "the host default"
  - name: "device"
    ref: "entity"
    meaning: "Optional. Absent = local"
    absent: "local"
---
# `rig.sensor.range`

One distance beam. Format when present. Looks along local −Z.

| Field | Type | Meaning |
|-------|------|---------|
| `rangeMin` | float | Optional. Near distance, scene units. Absent = 0 |
| `rangeMax` | float | Optional. Far distance. Absent = the host default |
| `fovDegrees` | float | Optional. Cone, 0-180. Absent = 0, a single ray |
| `distance` | float | Optional. Reading at load, scene units. Absent = not measured |
| `rateHz` | float | Optional. Samples per second. Absent = the host default |
| `device` | entity | Optional. Absent = local |

Ultrasonic, infrared, and a one-beam laser share this component. A scan with many columns is [`rig.sensor.lidar`](lidar.md). An image of distances is [`rig.sensor.depth`](depth.md).

The echo waveform stays in the host. Pose is [`rig.spatial.transform`](../spatial/transform.md).
