---
id: "rig.bim.space"
maturity: "draft"
summary: "Space / room marker (IfcSpace). Format when present - presence means this entity is a space."
topJson: "{\"minProperties\":0}"
fields:
---
# `rig.bim.space`

Space / room marker (`IfcSpace`). Format when present - presence means this entity is a space.

No fields. Compose:

- [`rig.bim.classify`](classify.md) - `IfcSpace` and optional predefined type
- [`rig.bim.pset`](pset.md) - area, volume, occupancy (`Pset_SpaceCommon`, ...)
- [`rig.spatial.relationship`](../spatial/relationship.md) - containment under a storey
- [`rig.meta.named`](../meta/named.md) - room name / number / GlobalId

Do not invent area or volume fields here - they are typed parameters on `pset`.
