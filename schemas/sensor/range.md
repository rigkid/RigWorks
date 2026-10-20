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
