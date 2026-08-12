# `rig.render.visibility`

Per-entity show/hide. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `visible` | bool | False hides this entity |

Absent means visible, so a document only pays for the entities that are hidden.

This is the only portable hide bit for scene / document entities. Do not put `visible` on [`rig.spatial.layer`](../spatial/layer.md) or geometry schemas.

Hiding is not inherited by this component alone. Whether a hidden parent hides its children is the host's scene-graph behaviour; if you need the children hidden in every reader, mark them too.

Draw order is **not** here. Sibling sequence lives in `order` on [`rig.spatial.relationship`](../spatial/relationship.md); layer-list stacking in `order` on [`rig.spatial.layer`](../spatial/layer.md).

Hiding an entity says nothing about whether it still runs — a hidden emitter keeps emitting. Use the host's own enable flag for that.
