# `rig.vr.anchor`

A pin in the user's space. Format when present.

Pose is [`rig.spatial.transform`](../spatial/transform.md). Parent is [`rig.spatial.relationship`](../spatial/relationship.md), usually the [`rig.vr.space`](space.md). A label is [`rig.meta.named`](../meta/named.md).

| Field | Type | Meaning |
|-------|------|---------|
| `persistentId` | string | Optional. Id the runtime uses to find this pin in a later session. Absent = this session only |

Compose [`rig.spatial.vertex`](../spatial/vertex.md) when the pin is also a scene locator. The cloud of anchors a runtime discovered and has not saved stays in the host.
