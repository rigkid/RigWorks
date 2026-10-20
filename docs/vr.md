# VR

A VR host **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). OpenXR, WebXR, and vendor runtimes are fulfillment. The session, the swapchains, and the compositor are not this catalog.

Portable meaning is [`rig.vr.*`](../schemas/vr/space.md) plus the spatial, camera, and input components those compose. Product runtime names stay out of schema ids.

## Map

| Runtime idea | Rig |
|--------------|-----|
| Reference space (`local`, `local-floor`, `stage` / bounded-floor, `unbounded`) | [`rig.vr.space`](../schemas/vr/space.md) |
| Play-area polygon | `space.bounds` (x, z on the floor) |
| Refresh, per-eye resolution, IPD | [`rig.vr.headset`](../schemas/vr/headset.md) |
| Environment blend / passthrough | `headset.blend` (`opaque` / `additive` / `alpha`) |
| Eye pose | [`rig.vr.eye`](../schemas/vr/eye.md) + [`rig.spatial.transform`](../schemas/spatial/transform.md), parented to the head tracker. Left is −X |
| Eye projection, including off-axis | [`rig.spatial.camera`](../schemas/spatial/camera.md). Four signed degree fields replace `fovYDegrees` + `aspect` |
| Head, gaze, hands, body landmarks, extra pucks | [`rig.vr.tracker`](../schemas/vr/tracker.md). Gaze index 0 is the left eye |
| Interaction profile | [`rig.vr.controller`](../schemas/vr/controller.md) `profile` |
| Grip and aim | Child [`rig.vr.pose`](../schemas/vr/pose.md). Aim looks along local −Z |
| Trigger, stick, squeeze, face buttons | [`rig.input.binding`](../schemas/input/binding.md) `device` `vr` into [`rig.input.axes`](../schemas/input/axes.md) and [`rig.input.buttons`](../schemas/input/buttons.md). Squeeze is `leftGrip` / `rightGrip` |
| Hand joints | [`rig.vr.hand`](../schemas/vr/hand.md) + [`rig.vr.joint`](../schemas/vr/joint.md) |
| Haptic click | [`rig.vr.haptic`](../schemas/vr/haptic.md) |
| Spatial anchor | [`rig.vr.anchor`](../schemas/vr/anchor.md) |
| Depth on a view | [`rig.sensor.depth`](../schemas/sensor/depth.md) on the eye. The buffer stays in the host |
| Headset IMU | [`rig.sensor.imu`](../schemas/sensor/imu.md) on the head tracker. Orientation is that transform |
| Listener | The `head` tracker transform. A spatial [`rig.audio.voice`](../schemas/audio/voice.md) still pans from its own transform |
| Scene content | Mesh, light, material, skeleton, as any other scene |

Binding `index` 0 is the left controller and 1 is the right. Well-known `code` tokens for `device` `vr`: `trigger`, `squeeze`, `thumbstick-x`, `thumbstick-y`, `thumbstick-click`, `trackpad-x`, `trackpad-y`, `trackpad-touch`, `menu`, `system`, `a`, `b`, `x`, `y`.

## Stay out

| Stay out | Why |
|----------|-----|
| Instance, session, swapchain, frame timing | Compositor lifecycle is fulfillment |
| Predicted display time, pose velocity, "is tracked" | Host cache. The pose at save is the transform |
| Foveation, hidden-area mesh, reprojection | Present path |
| Haptic PCM and queues | One pulse is [`rig.vr.haptic`](../schemas/vr/haptic.md) |
| Vendor body-joint sets beyond [`rig.vr.tracker`](../schemas/vr/tracker.md) roles and the hand joint list | Those names are not shared yet. Extra joints travel as `x.<vendor>.*` until a second host needs them |
| Action-set objects | The map is [`rig.input.binding`](../schemas/input/binding.md) |
| `rig.openxr.*` / `rig.webxr.*` / `rig.steamvr.*` | Product runtime names stay out of schema ids |

## Example

[`examples/vr-room.json`](../examples/vr-room.json) — a stage, a headset, two off-axis eyes, a left controller with grip and aim, a partial hand, a floor pin, and a trigger binding.
