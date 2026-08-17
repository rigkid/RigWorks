# `rig.bim.type`

Shared BIM type / family marker (`IfcWallType`, `IfcDoorType`, …). Format when present — presence means this entity is a type definition, not an occurrence.

No fields. Compose:

- [`rig.bim.classify`](classify.md) — IFC class (`IfcWallType`, …) and optional scheme codes
- [`rig.bim.pset`](pset.md) — type property sets
- [`rig.meta.named`](../meta/named.md) — type name / GlobalId

Occurrences point here via [`rig.bim.occurrence`](occurrence.md). Do not copy type psets onto every instance.
