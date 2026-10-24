# `rig.spatial.instance`

Instance of another entity. Format when present.

This is SVG `<use>`: draw `source` at this entity's pose.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Template. A `<symbol>` is a [`rig.spatial.group`](group.md) with [`rig.render.visibility`](../render/visibility.md) hidden until instanced |

Pose is [`rig.spatial.transform`](transform.md) on this entity. Do not copy the source's components here. Cycles (`source` that reaches this entity) are a document error.
