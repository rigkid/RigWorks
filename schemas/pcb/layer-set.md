# `rig.pcb.layer_set`

Which board layers an item sits on. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `layers` | entity[] | [`rig.pcb.layer`](layer.md) entities, at least one |

Required: `layers`.

A track, graphic, or text lists one layer. A through-hole pad lists every copper layer plus both masks; an SMD pad lists its copper, mask, and paste layers; a via lists the two copper layers it runs between. Wildcards in a file encoding (KiCad `*.Cu`) expand to the explicit layers on import - a writer may fold them back.

Parenting stays on [`rig.spatial.relationship`](../spatial/relationship.md): a pad is a child of its part (pose) and a member of its layers (this component). Different graphs; do not merge.
