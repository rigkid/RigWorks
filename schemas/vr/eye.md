# `rig.vr.eye`

One eye of a stereo view. Format when present.

Projection is [`rig.spatial.camera`](../spatial/camera.md). Pose is [`rig.spatial.transform`](../spatial/transform.md), parented to the head [`rig.vr.tracker`](tracker.md) with [`rig.spatial.relationship`](../spatial/relationship.md). Off-axis frustums use the camera's `leftDegrees` / `rightDegrees` / `upDegrees` / `downDegrees`.

| Field | Type | Meaning |
|-------|------|---------|
| `side` | enum | `left`, `right` |
| `headset` | entity | Optional. [`rig.vr.headset`](headset.md). Absent = the player's only headset |

Left is −X from the head in the 3D axes ([document.md](../document.md#axes)). The eye looks along local −Z.

A depth image on this view is [`rig.sensor.depth`](../sensor/depth.md) on the same entity. The depth buffer stays in the host.
