---
id: "rig.sim.rigidbody"
maturity: "draft"
summary: "Physics body. Format when present."
fields:
  - name: "bodyType"
    type: "string"
    enum: ["static","dynamic","kinematic"]
    meaning: "Optional. static, dynamic, kinematic; absent = dynamic"
    absent: "dynamic"
  - name: "velocity"
    ref: "vec3"
    meaning: "Optional. World-space linear velocity, units per second; absent = at rest"
    absent: "at rest"
  - name: "angularVelocityDegrees"
    ref: "vec3"
    meaning: "Optional. World-space angular velocity, degrees per second about X Y Z; absent = no spin"
    absent: "no spin"
  - name: "mass"
    ref: "float"
    meaning: "Optional. Mass; must be greater than 0; absent = 1"
    absent: "1"
  - name: "inertia"
    schemaJson: "{\"type\":\"array\",\"minItems\":6,\"maxItems\":6,\"items\":{\"type\":\"number\"},\"$comment\":\"ixx, iyy, izz, ixy, ixz, iyz about centerOfMass, body frame\"}"
    meaning: "Optional. ixx, iyy, izz, ixy, ixz, iyz about centerOfMass, body frame. Mass times scene length squared. Absent = computed from colliders"
    absent: "computed from colliders"
  - name: "drag"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1, fraction of linear velocity lost per second; absent = 0"
    absent: "0"
  - name: "angularDrag"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1, fraction of angular velocity lost per second; absent = 0"
    absent: "0"
  - name: "gravity"
    ref: "vec3"
    meaning: "Optional. Per-body acceleration, units per second squared. When set, replaces ambient gravity and gravityScale is ignored"
  - name: "gravityScale"
    ref: "float"
    meaning: "Optional. Multiplier on the host's ambient gravity; absent = 1"
    absent: "1"
  - name: "lockRotation"
    ref: "bool"
    meaning: "Optional. No spin; forces stay linear; absent = false"
    absent: "false"
  - name: "canSleep"
    ref: "bool"
    meaning: "Optional. May sleep when still; absent = true"
    absent: "true"
  - name: "continuous"
    ref: "bool"
    meaning: "Optional. Continuous collision for fast bodies; absent = false"
    absent: "false"
  - name: "centerOfMass"
    ref: "vec3"
    meaning: "Optional. Local centre of mass. Absent = computed from colliders"
    absent: "computed from colliders"
---
# `rig.sim.rigidbody`

Physics body. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `bodyType` | enum | Optional. `static`, `dynamic`, `kinematic`; absent = `dynamic` |
| `velocity` | vec3 | Optional. World-space linear velocity, units per second; absent = at rest |
| `angularVelocityDegrees` | vec3 | Optional. World-space angular velocity, degrees per second about X Y Z; absent = no spin |
| `mass` | float | Optional. Mass; must be greater than 0; absent = 1 |
| `inertia` | float[6] | Optional. `ixx`, `iyy`, `izz`, `ixy`, `ixz`, `iyz` about `centerOfMass`, body frame. Mass times scene length squared. Absent = computed from colliders |
| `drag` | float | Optional. 0-1, fraction of linear velocity lost per second; absent = 0 |
| `angularDrag` | float | Optional. 0-1, fraction of angular velocity lost per second; absent = 0 |
| `gravity` | vec3 | Optional. Per-body acceleration, units per second squared. When set, replaces ambient gravity and `gravityScale` is ignored |
| `gravityScale` | float | Optional. Multiplier on the host's ambient gravity; absent = 1 |
| `lockRotation` | bool | Optional. No spin; forces stay linear; absent = false |
| `canSleep` | bool | Optional. May sleep when still; absent = true |
| `continuous` | bool | Optional. Continuous collision for fast bodies; absent = false |
| `centerOfMass` | vec3 | Optional. Local centre of mass. Absent = computed from colliders |

`velocity` and `angularVelocityDegrees` are the body when the document is loaded. An author writes the launch. A host that saves a running simulation writes the current values, and another host can continue from that snapshot. Position at that moment is [`rig.spatial.transform`](../spatial/transform.md).

`bodyType` `static` does not integrate. `kinematic` moves from its transform and pushes dynamic bodies. `dynamic` integrates. A [`rig.sim.character`](character.md) on the same entity is the motor either way: do not also integrate this body.

`drag` is a fraction lost per second, not a physics-engine damping coefficient. Hosts convert. Sleeping, contact counts, and applied forces stay in the host.

Ambient gravity is [`rig.sim.world`](world.md) on the scene. This body's `gravity` replaces that vector. `gravityScale` multiplies it when `gravity` is absent. A metres scene that wants Earth sets world gravity to `[0, -9.81, 0]`.

Contact shape, friction, and restitution are [`rig.sim.collider`](collider.md). Constraints are [`rig.sim.joint`](joint.md). Contact manifolds and the solver stay in the host.
