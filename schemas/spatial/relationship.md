# `rig.spatial.relationship`

Scene-graph parent. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `parent` | entity | Parent entity; none = root |

Compositor grouping uses `groupParent` on [`rig.pixel.layer`](../pixel/layer.md) — different graph, different field.

Scene group folders compose [`rig.spatial.group`](group.md) on the parent entity — still use this `parent` field for children.
