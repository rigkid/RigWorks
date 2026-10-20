# `rig.sim.joint`

Constraint between two bodies. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `fixed`, `hinge`, `distance`, `spring`, `slider` |
| `a` | entity | First body |
| `b` | entity | Second body |
| `anchorA` | vec3 | Optional. Anchor in `a`'s local space; absent = origin |
| `anchorB` | vec3 | Optional. Anchor in `b`'s local space; absent = origin |
| `axis` | vec3 | Optional. Hinge or slider axis in `a`'s local space; absent = local +Y |
| `min` | float | Optional. Lower limit. Degrees for `hinge`, distance for `distance` / `slider`. Absent = unlimited |
| `max` | float | Optional. Upper limit, same units as `min`. Absent = unlimited |
| `stiffness` | float | Optional. Spring stiffness. Meaningful for `spring` |
| `damping` | float | Optional. Spring damping. Meaningful for `spring` |
| `breakForce` | float | Optional. Impulse that breaks the joint. Absent = unbreakable |
| `collideConnected` | bool | Optional. The two bodies also collide; absent = false |
| `mimic` | entity | Optional. Joint this one follows |
| `mimicMultiplier` | float | Optional. Scale on the followed joint's position. Absent = 1 |
| `mimicOffset` | float | Optional. Added after the scale. Same units as `min`. Absent = 0 |

Limits and break thresholds are authored intent. A host that cannot represent a kind skips that joint. A host that finds a mimic cycle skips the mimic. A drive on this joint is [`rig.sim.actuator`](actuator.md).
