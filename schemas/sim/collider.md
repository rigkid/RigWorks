---
id: "rig.sim.collider"
maturity: "draft"
summary: "Contact shape. Format when present. One shape on the entity; a compound is child entities."
fields:
  - name: "kind"
    type: "string"
    enum: ["sphere","box","capsule","mesh"]
    required: true
    meaning: "sphere, box, capsule, mesh"
  - name: "radius"
    ref: "float"
    meaning: "Sphere radius, or capsule radius. Required for those kinds"
  - name: "height"
    ref: "float"
    meaning: "Capsule height, end to end. Required when kind is capsule"
  - name: "halfExtents"
    ref: "vec3"
    meaning: "Box half-size. Required when kind is box"
  - name: "mesh"
    ref: "entity"
    meaning: "Optional. Entity with rig.geometry.mesh. Absent = the mesh on this entity. Used when kind is mesh"
    absent: "the mesh on this entity"
  - name: "offset"
    ref: "vec3"
    meaning: "Optional. Shape centre in the entity's local space; absent = origin"
    absent: "origin"
  - name: "sensor"
    ref: "bool"
    meaning: "Optional. Overlap reports and no response; absent = false"
    absent: "false"
  - name: "friction"
    type: "number"
    minimum: 0
    meaning: "Optional. Contact friction, 0 or greater; absent = the host default"
    absent: "the host default"
  - name: "restitution"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. Bounce, 0-1; absent = 0"
    absent: "0"
  - name: "restitutionThreshold"
    ref: "float"
    meaning: "Optional. Minimum speed that still bounces. Absent = the host default"
    absent: "the host default"
  - name: "density"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Mass per volume for hosts that derive mass from shapes. Must be greater than 0. Ignored when the body sets mass"
  - name: "layer"
    ref: "int"
    meaning: "Optional. Collision layer; absent = 0"
    absent: "0"
  - name: "mask"
    ref: "uint"
    meaning: "Optional. Bitmask of layers this shape collides with; absent = every layer"
    absent: "every layer"
  - name: "frictionCombine"
    type: "string"
    enum: ["average","multiply","minimum","maximum"]
    meaning: "Optional. average, multiply, minimum, maximum. How this friction mixes with the other shape. Absent = the host default"
    absent: "the host default"
  - name: "restitutionCombine"
    type: "string"
    enum: ["average","multiply","minimum","maximum"]
    meaning: "Optional. Same tokens, for bounce"
---
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
