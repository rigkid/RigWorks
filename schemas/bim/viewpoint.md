# `rig.bim.viewpoint`

BCF viewpoint on a topic. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `topic` | entity | Parent [`rig.bim.topic`](topic.md) |
| `selected` | entity[] | Optional. Highlighted / selected elements; absent = none |
| `hidden` | entity[] | Optional. Hidden elements; absent = none |
| `clipPlanes` | object[] | Optional. Clip planes; each has `origin` (vec3) and `normal` (vec3) |

Compose [`rig.spatial.transform`](../spatial/transform.md) and [`rig.spatial.camera`](../spatial/camera.md) on the same entity for camera pose and projection. Snapshot image is [`rig.media.asset_ref`](../media/asset-ref.md) `kind: image` on the same entity — do not invent a parallel path field.
