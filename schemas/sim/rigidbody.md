# `rig.sim.rigidbody`

Physics body. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `bodyType` | enum | Optional. `static`, `dynamic`, `kinematic`; absent = `dynamic` |
| `velocity` | vec3 | Optional. World-space linear velocity, units per second; absent = at rest |
| `angularVelocityDegrees` | vec3 | Optional. World-space angular velocity, degrees per second about X Y Z; absent = no spin |
| `mass` | float | Optional. Mass; must be greater than 0; absent = 1 |
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

Contact shape, friction, and restitution are [`rig.sim.collider`](collider.md). Constraints are [`rig.sim.joint`](joint.md). Contact manifolds and the solver stay in the host.
