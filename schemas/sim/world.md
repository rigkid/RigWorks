---
id: "rig.sim.world"
maturity: "draft"
summary: "Shared physical scene. Format when present. Compose on the scene rig.spatial.vertex."
fields:
  - name: "gravity"
    ref: "vec3"
    meaning: "Optional. Acceleration, scene units per second squared. Absent = the host default"
    absent: "the host default"
  - name: "stepSeconds"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Fixed step. Absent = one step per Update, using SUDE dt"
    absent: "one step per Update, using SUDE dt"
---
# `rig.sim.world`

Shared physical scene. Format when present. Compose on the scene [`rig.spatial.vertex`](../spatial/vertex.md).

| Field | Type | Meaning |
|-------|------|---------|
| `gravity` | vec3 | Optional. Acceleration, scene units per second squared. Absent = the host default |
| `stepSeconds` | float | Optional. Fixed step. Absent = one step per Update, using SUDE `dt` |

+Y is up, so Earth gravity in a metres scene is `[0, -9.81, 0]`. A host substeps when `stepSeconds` is shorter than the frame.

A [`rig.sim.rigidbody`](rigidbody.md) `gravity` replaces this vector. `gravityScale` multiplies it when the body does not set its own. The solver stays in the host.
