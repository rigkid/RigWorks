# `rig.sim.character`

Kinematic capsule motor. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `radius` | float | Capsule radius |
| `height` | float | Capsule height, end to end |
| `stepHeight` | float | Optional. Max step the motor climbs; absent = 0 |
| `slopeLimitDegrees` | float | Optional. Steepest walkable slope; absent = 45 |
| `jumpSpeed` | float | Optional. Upward speed on jump, units per second; absent = 0 |
| `grounded` | bool | Optional. Standing on a surface at save. Absent = the host probes on load |
| `velocity` | vec3 | Optional. World-space velocity at load, units per second; absent = at rest |
| `up` | vec3 | Optional. Up axis; absent = +Y |
| `floorSnap` | float | Optional. Distance the motor snaps down onto a floor; absent = 0 |
| `motion` | enum | Optional. `grounded` or `floating`; absent = `grounded` |

Pose is [`rig.spatial.transform`](../spatial/transform.md). Overlap uses a [`rig.sim.collider`](collider.md) when one is present; otherwise the capsule above.

This motor moves the entity. A [`rig.sim.rigidbody`](rigidbody.md) on the same entity is not integrated. Slide counts, floor normals, and platform velocity stay in the host.
