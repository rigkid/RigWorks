# `rig.sim.articulation`

One robot: a tree of links solved together. Format when present. Compose on the root link.

Links are child entities. Each link that moves carries [`rig.sim.rigidbody`](rigidbody.md), [`rig.spatial.transform`](../spatial/transform.md), and [`rig.spatial.relationship`](../spatial/relationship.md). Contact is [`rig.sim.collider`](collider.md). A drive is [`rig.sim.joint`](joint.md) plus [`rig.sim.actuator`](actuator.md). A visual is [`rig.geometry.mesh`](../geometry/mesh.md) or a [`rig.cad.*`](../cad/cuboid.md) solid on that link.

| Field | Type | Meaning |
|-------|------|---------|
| `selfCollide` | bool | Optional. Links of this robot collide with each other. Absent = false |
| `fixedBase` | bool | Optional. Root welded to the world. Absent = false (a mobile base) |

A host that has no articulation solver uses ordinary bodies and joints. The tree is the same either way.
