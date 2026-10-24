---
id: "rig.sensor.wrench"
maturity: "draft"
summary: "Force and torque sample. Format when present. The frame is this entity."
fields:
  - name: "rateHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Samples per second. Absent = the host default"
    absent: "the host default"
  - name: "force"
    ref: "vec3"
    meaning: "Optional. Force at load, in the entity frame. Mass unit of rig.sim.rigidbody mass, scene length, seconds. Absent = not measured"
    absent: "not measured"
  - name: "torque"
    ref: "vec3"
    meaning: "Optional. Torque at load, same frame and units times a length. Absent = not measured"
    absent: "not measured"
  - name: "device"
    ref: "entity"
    meaning: "Optional board / network entity. Absent = local"
    absent: "local"
---
# `rig.sensor.wrench`

Force and torque sample. Format when present. The frame is this entity.

| Field | Type | Meaning |
|-------|------|---------|
| `rateHz` | float | Optional. Samples per second. Absent = the host default |
| `force` | vec3 | Optional. Force at load, in the entity frame. Mass unit of [`rig.sim.rigidbody`](../sim/rigidbody.md) `mass`, scene length, seconds. Absent = not measured |
| `torque` | vec3 | Optional. Torque at load, same frame and units times a length. Absent = not measured |
| `device` | entity | Optional board / network entity. Absent = local |

`force` and `torque` are the sample when the document is loaded. A host that saves a running sensor writes the current sample. The history stays in the host.

Pose is [`rig.spatial.transform`](../spatial/transform.md). A wrist sensor parents to the link it measures.
