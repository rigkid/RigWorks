---
id: "rig.sensor.lidar"
maturity: "draft"
summary: "Lidar scan pattern. Format when present. Pose is rig.spatial.transform."
fields:
  - name: "pattern"
    type: "string"
    enum: ["spin","solid-state","flash"]
    meaning: "Optional. spin, solid-state, flash. Absent = spin"
    absent: "spin"
  - name: "channels"
    type: "integer"
    minimum: 1
    meaning: "Optional. Vertical samples. Absent = host default"
    absent: "host default"
  - name: "columns"
    type: "integer"
    minimum: 1
    meaning: "Optional. Horizontal samples per revolution (spin) or per frame. Absent = host default"
    absent: "host default"
  - name: "fovXDegrees"
    type: "number"
    minimum: 0
    maximum: 360
    meaning: "Optional. Horizontal field, 0-360, centered on forward. Absent = 360 when pattern is spin, otherwise the host default"
    absent: "360 when pattern is spin, otherwise the host default"
  - name: "fovYDegrees"
    type: "number"
    minimum: 0
    maximum: 180
    meaning: "Optional. Vertical field, 0-180. Absent = host default"
    absent: "host default"
  - name: "fovYCenterDegrees"
    ref: "float"
    meaning: "Optional. Vertical center, degrees above the local horizontal. Absent = 0"
    absent: "0"
  - name: "rangeMin"
    type: "number"
    minimum: 0
    meaning: "Optional. Nearest return, scene units. Absent = 0"
    absent: "0"
  - name: "rangeMax"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Farthest return, scene units. Absent = host default"
    absent: "host default"
  - name: "rateHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Revolutions per second when spin, frames per second otherwise. Absent = host default"
    absent: "host default"
  - name: "returns"
    type: "integer"
    minimum: 1
    meaning: "Optional. Echoes kept per ray. Absent = 1"
    absent: "1"
  - name: "device"
    ref: "entity"
    meaning: "Optional board / network entity; absent = local"
    absent: "local"
---
# `rig.sensor.lidar`

Lidar scan pattern. Format when present. Pose is [`rig.spatial.transform`](../spatial/transform.md).

| Field | Type | Meaning |
|-------|------|---------|
| `pattern` | enum | Optional. `spin`, `solid-state`, `flash`. Absent = `spin` |
| `channels` | int | Optional. Vertical samples. Absent = host default |
| `columns` | int | Optional. Horizontal samples per revolution (`spin`) or per frame. Absent = host default |
| `fovXDegrees` | float | Optional. Horizontal field, 0-360, centered on forward. Absent = 360 when `pattern` is `spin`, otherwise the host default |
| `fovYDegrees` | float | Optional. Vertical field, 0-180. Absent = host default |
| `fovYCenterDegrees` | float | Optional. Vertical center, degrees above the local horizontal. Absent = 0 |
| `rangeMin` | float | Optional. Nearest return, scene units. Absent = 0 |
| `rangeMax` | float | Optional. Farthest return, scene units. Absent = host default |
| `rateHz` | float | Optional. Revolutions per second when `spin`, frames per second otherwise. Absent = host default |
| `returns` | int | Optional. Echoes kept per ray. Absent = 1 |
| `device` | entity | Optional board / network entity; absent = local |

Yaw is about local +Y. Forward is local −Z, the same axis as a camera. `rangeMax` is greater than `rangeMin` when both are set. A host that sees otherwise skips the sensor.

The point cloud, per-channel elevation table, and the echo samples stay in the host. `returns` is how many to keep, not the samples. A ROS 2 node entity is a valid `device` - [docs/ros.md](../../docs/ros.md).
