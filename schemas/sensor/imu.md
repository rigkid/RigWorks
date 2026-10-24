---
id: "rig.sensor.imu"
maturity: "draft"
summary: "Inertial sample. Format when present. Pose is rig.spatial.transform."
fields:
  - name: "rateHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Samples per second. Absent = host default"
    absent: "host default"
  - name: "acceleration"
    ref: "vec3"
    meaning: "Optional. Specific force at load, scene units per second squared, in the sensor frame. Includes gravity. Absent = not measured"
    absent: "not measured"
  - name: "angularVelocityDegrees"
    ref: "vec3"
    meaning: "Optional. Angular rate at load, degrees per second, in the sensor frame. Absent = not measured"
    absent: "not measured"
  - name: "device"
    ref: "entity"
    meaning: "Optional board / network entity; absent = local"
    absent: "local"
---
# `rig.sensor.imu`

Inertial sample. Format when present. Pose is [`rig.spatial.transform`](../spatial/transform.md).

| Field | Type | Meaning |
|-------|------|---------|
| `rateHz` | float | Optional. Samples per second. Absent = host default |
| `acceleration` | vec3 | Optional. Specific force at load, scene units per second squared, in the sensor frame. Includes gravity. Absent = not measured |
| `angularVelocityDegrees` | vec3 | Optional. Angular rate at load, degrees per second, in the sensor frame. Absent = not measured |
| `device` | entity | Optional board / network entity; absent = local |

`acceleration` and `angularVelocityDegrees` are the sample when the document is loaded. An author writes a known reading. A host that saves a running sensor writes the current sample. At rest in +Y-up, acceleration is about `[0, g, 0]`.

Orientation is the entity transform. Do not store a second quaternion here. Covariance, bias, and the sample history stay in the host. A ROS 2 node entity is a valid `device` - [docs/ros.md](../../docs/ros.md).
