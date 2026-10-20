# `rig.vr.pose`

Grip or aim on a controller or tracker. Format when present.

The pose is [`rig.spatial.transform`](../spatial/transform.md). Parent it to the [`rig.vr.controller`](controller.md) or [`rig.vr.tracker`](tracker.md) with [`rig.spatial.relationship`](../spatial/relationship.md).

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `grip`, `aim` |

Aim looks along local −Z, the same rule as a camera. Grip is the pose a held object copies. A host converts the runtime's grip and aim spaces into these transforms.
