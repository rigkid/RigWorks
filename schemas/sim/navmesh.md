---
id: "rig.sim.navmesh"
maturity: "draft"
summary: "Marker: this entity's rig.geometry.mesh is a walkable surface. No fields."
topJson: "{\"description\":\"Marker: this entity's rig.geometry.mesh is a walkable surface. Solved paths stay in the host.\",\"minProperties\":0}"
fields:
---
# `rig.sim.navmesh`

Marker: this entity's [`rig.geometry.mesh`](../geometry/mesh.md) is a walkable surface. No fields.

An agent that walks it is [`rig.sim.agent`](agent.md). The solved path is a host cache - do not serialize it.
