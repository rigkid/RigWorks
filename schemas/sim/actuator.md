---
id: "rig.sim.actuator"
maturity: "draft"
summary: "Drive on one joint. Format when present."
fields:
  - name: "joint"
    ref: "entity"
    required: true
    meaning: "rig.sim.joint this drive commands"
  - name: "mode"
    type: "string"
    enum: ["position","velocity","effort"]
    meaning: "Optional. position, velocity, effort. Absent = position"
    absent: "position"
  - name: "effort"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Maximum effort. Torque on a hinge, force on a slider or distance joint. Absent = unlimited"
    absent: "unlimited"
  - name: "maxSpeed"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Hinge: degrees per second. Slider and distance: scene units per second. Absent = unlimited"
    absent: "unlimited"
  - name: "stiffness"
    type: "number"
    minimum: 0
    meaning: "Optional. Position-drive stiffness. Absent = host default"
    absent: "host default"
  - name: "damping"
    type: "number"
    minimum: 0
    meaning: "Optional. Drive damping. Absent = host default"
    absent: "host default"
  - name: "target"
    ref: "float"
    meaning: "Optional. Command at load. Hinge: degrees. Slider and distance: scene units. Absent = hold the joint's current position"
    absent: "hold the joint's current position"
---
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
