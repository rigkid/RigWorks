# `rig.bim.building`

Building marker (`IfcBuilding`). Format when present — presence means this entity is a building root.

No fields. Compose:

- [`rig.spatial.group`](../spatial/group.md) — children (storeys) set `parent` via [`rig.spatial.relationship`](../spatial/relationship.md)
- [`rig.bim.classify`](classify.md) when useful (`IfcBuilding`)
- [`rig.meta.named`](../meta/named.md) — label / GlobalId
- [`rig.bim.pset`](pset.md) — building property sets

Elevation of a storey lives on [`rig.bim.storey`](storey.md), not here.
