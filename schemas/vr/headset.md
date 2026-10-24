---
id: "rig.vr.headset"
maturity: "draft"
summary: "The selected stereo display. Format when present."
fields:
  - name: "player"
    ref: "int"
    meaning: "Optional. Player index (0-based); absent = 0"
    absent: "0"
  - name: "refreshHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Selected refresh. Absent = the host default"
    absent: "the host default"
  - name: "ipdMetres"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Interpupillary distance, metres. Absent = the host default"
    absent: "the host default"
  - name: "eyeWidth"
    type: "integer"
    minimum: 1
    meaning: "Optional. Selected render width of one eye, pixels"
  - name: "eyeHeight"
    type: "integer"
    minimum: 1
    meaning: "Optional. Selected render height of one eye, pixels"
  - name: "blend"
    type: "string"
    enum: ["opaque","additive","alpha"]
    meaning: "Optional. opaque, additive, alpha. Absent = opaque"
    absent: "opaque"
---
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
