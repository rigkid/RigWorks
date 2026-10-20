# `rig.sim.collider`

Contact shape. Format when present. One shape on the entity; a compound is child entities.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `sphere`, `box`, `capsule`, `mesh` |
| `radius` | float | Sphere radius, or capsule radius. Required for those kinds |
| `height` | float | Capsule height, end to end. Required when `kind` is `capsule` |
| `halfExtents` | vec3 | Box half-size. Required when `kind` is `box` |
| `mesh` | entity | Optional. Entity with [`rig.geometry.mesh`](../geometry/mesh.md). Absent = the mesh on this entity. Used when `kind` is `mesh` |
| `offset` | vec3 | Optional. Shape centre in the entity's local space; absent = origin |
| `sensor` | bool | Optional. Overlap reports and no response; absent = false |
| `friction` | float | Optional. Contact friction, 0 or greater; absent = the host default |
| `restitution` | float | Optional. Bounce, 0-1; absent = 0 |
| `restitutionThreshold` | float | Optional. Minimum speed that still bounces. Absent = the host default |
| `density` | float | Optional. Mass per volume for hosts that derive mass from shapes. Must be greater than 0. Ignored when the body sets `mass` |
| `layer` | int | Optional. Collision layer; absent = 0 |
| `mask` | uint | Optional. Bitmask of layers this shape collides with; absent = every layer |
| `frictionCombine` | enum | Optional. `average`, `multiply`, `minimum`, `maximum`. How this friction mixes with the other shape. Absent = the host default |
| `restitutionCombine` | enum | Optional. Same tokens, for bounce |

`halfExtents` is half the box on each axis. A host whose shape size is the full side length halves it on the way in.

The numbers are the authored request. The solver is fulfillment: two hosts need not reproduce the same contact from the same coefficients.

Hit tests for [`rig.interact.selectable`](../interact/selectable.md) use this shape when it is present.
