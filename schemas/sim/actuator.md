# `rig.sim.actuator`

Drive on one joint. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `joint` | entity | [`rig.sim.joint`](joint.md) this drive commands |
| `mode` | enum | Optional. `position`, `velocity`, `effort`. Absent = `position` |
| `effort` | float | Optional. Maximum effort. Torque on a hinge, force on a slider or distance joint. Absent = unlimited |
| `maxSpeed` | float | Optional. Hinge: degrees per second. Slider and distance: scene units per second. Absent = unlimited |
| `stiffness` | float | Optional. Position-drive stiffness. Absent = host default |
| `damping` | float | Optional. Drive damping. Absent = host default |
| `target` | float | Optional. Command at load. Hinge: degrees. Slider and distance: scene units. Absent = hold the joint's current position |

Meaningful for `hinge`, `slider`, and `distance`. A `fixed` joint has no drive. A `ball` has no single target; pose the child. A host that cannot represent a mode skips that actuator.

`target` is the command when the document is loaded. A series of commands is [`rig.anim.track`](../anim/track.md) on `target`. The solver stays in the host.
