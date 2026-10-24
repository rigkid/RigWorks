---
id: "rig.anim.bind"
maturity: "draft"
summary: "Rest pose of one bone. Format when present. Compose on the bone entity."
fields:
  - name: "position"
    ref: "vec3"
    meaning: "Optional. Local rest translation; absent = the bone's transform position"
    absent: "the bone's transform position"
  - name: "rotation"
    ref: "quat"
    meaning: "Optional. Local rest rotation, x y z w; absent = the bone's transform rotation"
    absent: "the bone's transform rotation"
  - name: "scale"
    ref: "vec3"
    meaning: "Optional. Local rest scale; absent = the bone's transform scale"
    absent: "the bone's transform scale"
---
# `rig.anim.bind`

Rest pose of one bone. Format when present. Compose on the bone entity.

| Field | Type | Meaning |
|-------|------|---------|
| `position` | vec3 | Optional. Local rest translation; absent = the bone's transform position |
| `rotation` | quat | Optional. Local rest rotation, x y z w; absent = the bone's transform rotation |
| `scale` | vec3 | Optional. Local rest scale; absent = the bone's transform scale |

[`rig.spatial.transform`](../spatial/transform.md) is the pose at save. This component is the pose clips are authored against. When a field is absent, that channel's rest matches the transform, so a bone that was never posed stores neither twice.

The posed mesh is a host cache. Inverse bind matrices stay on [`rig.anim.skin`](skin.md).
