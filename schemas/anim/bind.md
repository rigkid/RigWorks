# `rig.anim.bind`

Rest pose of one bone. Format when present. Compose on the bone entity.

| Field | Type | Meaning |
|-------|------|---------|
| `position` | vec3 | Optional. Local rest translation; absent = the bone's transform position |
| `rotation` | quat | Optional. Local rest rotation, x y z w; absent = the bone's transform rotation |
| `scale` | vec3 | Optional. Local rest scale; absent = the bone's transform scale |

[`rig.spatial.transform`](../spatial/transform.md) is the pose at save. This component is the pose clips are authored against. When a field is absent, that channel's rest matches the transform, so a bone that was never posed stores neither twice.

The posed mesh is a host cache. Inverse bind matrices stay on [`rig.anim.skin`](skin.md).
