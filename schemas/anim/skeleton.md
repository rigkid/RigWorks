# `rig.anim.skeleton`

Ordered bones. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `root` | entity | Root bone |
| `bones` | entity[] | Every bone, including `root` |

Each bone is an entity. Its pose at save is [`rig.spatial.transform`](../spatial/transform.md). Its rest pose, when it differs, is [`rig.anim.bind`](bind.md). Its parent is [`rig.spatial.relationship`](../spatial/relationship.md). A label is [`rig.meta.named`](../meta/named.md).

Skinning is [`rig.anim.skin`](skin.md). Sampled motion is [`rig.anim.clip`](clip.md) plus [`rig.anim.track`](track.md).
