# `rig.vr.headset`

The selected stereo display. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `refreshHz` | float | Optional. Selected refresh. Absent = the host default |
| `ipdMetres` | float | Optional. Interpupillary distance, metres. Absent = the host default |
| `eyeWidth` | int | Optional. Selected render width of one eye, pixels |
| `eyeHeight` | int | Optional. Selected render height of one eye, pixels |
| `blend` | enum | Optional. `opaque`, `additive`, `alpha`. Absent = `opaque` |

`ipdMetres` is a catalog fact in metres, whatever `document.defaultUnit` says. Eye poses are still [`rig.spatial.transform`](../spatial/transform.md) on each [`rig.vr.eye`](eye.md).

`blend` `alpha` and `additive` are see-through (passthrough). `opaque` hides the room.

Swapchains, foveation, hidden-area masks, and reprojection stay in the host. A head pose is [`rig.vr.tracker`](tracker.md) `role` `head`, not a field here. An inertial sample composes [`rig.sensor.imu`](../sensor/imu.md) on that head entity; orientation is its transform.
