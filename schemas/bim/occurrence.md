# `rig.bim.occurrence`

Instance of a shared BIM type. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `type` | entity | Entity carrying [`rig.bim.type`](type.md); none = untyped occurrence |

Compose [`rig.bim.classify`](classify.md) for the occurrence’s IFC class (`IfcWall`, …). Instance-only property sets live on [`rig.bim.pset`](pset.md) here; shared type psets stay on the type entity.
