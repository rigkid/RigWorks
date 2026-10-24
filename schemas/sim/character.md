---
id: "rig.sim.character"
maturity: "draft"
summary: "Kinematic capsule motor. Format when present."
fields:
  - name: "radius"
    ref: "float"
    required: true
    meaning: "Capsule radius"
  - name: "height"
    ref: "float"
    required: true
    meaning: "Capsule height, end to end"
  - name: "stepHeight"
    ref: "float"
    meaning: "Optional. Max step the motor climbs; absent = 0"
    absent: "0"
  - name: "slopeLimitDegrees"
    ref: "float"
    meaning: "Optional. Steepest walkable slope; absent = 45"
    absent: "45"
  - name: "jumpSpeed"
    ref: "float"
    meaning: "Optional. Upward speed on jump, units per second; absent = 0"
    absent: "0"
  - name: "grounded"
    ref: "bool"
    meaning: "Optional. Standing on a surface at save. Absent = the host probes on load"
    absent: "the host probes on load"
  - name: "velocity"
    ref: "vec3"
    meaning: "Optional. World-space velocity at load, units per second; absent = at rest"
    absent: "at rest"
  - name: "up"
    ref: "vec3"
    meaning: "Optional. Up axis; absent = +Y"
    absent: "+Y"
  - name: "floorSnap"
    ref: "float"
    meaning: "Optional. Distance the motor snaps down onto a floor; absent = 0"
    absent: "0"
  - name: "motion"
    type: "string"
    enum: ["grounded","floating"]
    meaning: "Optional. grounded or floating; absent = grounded"
    absent: "grounded"
---
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
