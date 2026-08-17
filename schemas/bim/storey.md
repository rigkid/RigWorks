# `rig.bim.storey`

Building storey / level datum (`IfcBuildingStorey`). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `elevation` | float | Optional. Storey elevation in document units; absent = 0 |

A storey is a datum, not only a folder. Compose [`rig.spatial.group`](../spatial/group.md) so elements can set [`rig.spatial.relationship`](../spatial/relationship.md) `parent` to this entity for containment. Pose of the group (if any) stays on [`rig.spatial.transform`](../spatial/transform.md).
