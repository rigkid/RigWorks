---
id: "rig.sim.joint"
maturity: "draft"
summary: "Constraint between two bodies. Format when present."
fields:
  - name: "kind"
    type: "string"
    enum: ["fixed","hinge","distance","spring","slider","ball"]
    required: true
    meaning: "fixed, hinge, distance, spring, slider, ball"
  - name: "a"
    ref: "entity"
    required: true
    meaning: "First body"
  - name: "b"
    ref: "entity"
    required: true
    meaning: "Second body"
  - name: "anchorA"
    ref: "vec3"
    meaning: "Optional. Anchor in a's local space; absent = origin"
    absent: "origin"
  - name: "anchorB"
    ref: "vec3"
    meaning: "Optional. Anchor in b's local space; absent = origin"
    absent: "origin"
  - name: "axis"
    ref: "vec3"
    meaning: "Optional. Hinge or slider axis in a's local space; absent = local +Y"
    absent: "local +Y"
  - name: "min"
    ref: "float"
    meaning: "Optional. Lower limit. Degrees for hinge, distance for distance / slider. Absent = unlimited"
    absent: "unlimited"
  - name: "max"
    ref: "float"
    meaning: "Optional. Upper limit, same units as min. Absent = unlimited"
    absent: "unlimited"
  - name: "stiffness"
    ref: "float"
    meaning: "Optional. Spring stiffness. Meaningful for spring"
  - name: "damping"
    ref: "float"
    meaning: "Optional. Spring damping. Meaningful for spring"
  - name: "breakForce"
    ref: "float"
    meaning: "Optional. Impulse that breaks the joint. Absent = unbreakable"
    absent: "unbreakable"
  - name: "collideConnected"
    ref: "bool"
    meaning: "Optional. The two bodies also collide; absent = false"
    absent: "false"
  - name: "mimic"
    ref: "entity"
    meaning: "Optional. Joint this one follows"
  - name: "mimicMultiplier"
    ref: "float"
    meaning: "Optional. Scale on the followed joint's position. Absent = 1"
    absent: "1"
  - name: "mimicOffset"
    ref: "float"
    meaning: "Optional. Added after the scale. Same units as min. Absent = 0"
    absent: "0"
  - name: "swingDegrees"
    type: "number"
    minimum: 0
    meaning: "Optional. Cone from the rest pose. Meaningful for ball. Absent = unlimited"
    absent: "unlimited"
  - name: "position"
    ref: "float"
    meaning: "Optional. Joint coordinate at load. Degrees for hinge, scene units for slider and distance. Absent = the pose implied by the two transforms"
    absent: "the pose implied by the two transforms"
  - name: "velocity"
    ref: "float"
    meaning: "Optional. Rate of position at load. Degrees per second, or scene units per second. Absent = at rest"
    absent: "at rest"
---
# `rig.sim.joint`

Constraint between two bodies. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `fixed`, `hinge`, `distance`, `spring`, `slider`, `ball` |
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
| `swingDegrees` | float | Optional. Cone from the rest pose. Meaningful for `ball`. Absent = unlimited |
| `position` | float | Optional. Joint coordinate at load. Degrees for `hinge`, scene units for `slider` and `distance`. Absent = the pose implied by the two transforms |
| `velocity` | float | Optional. Rate of `position` at load. Degrees per second, or scene units per second. Absent = at rest |

Limits and break thresholds are authored intent. A host that cannot represent a kind skips that joint. A host that finds a mimic cycle skips the mimic. A drive on this joint is [`rig.sim.actuator`](actuator.md).

`ball` has no single axis and no single `position`. Its pose is the child transform. `swingDegrees` is the cone a host may enforce. A `fixed` joint has no `position`.

`position` and `velocity` are the joint when the document is loaded, the same bargain as a body's velocity. A save of a running robot writes them so another host can continue.
