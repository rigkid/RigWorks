---
id: "rig.vr.tracker"
maturity: "draft"
summary: "One tracked pose. Format when present."
fields:
  - name: "player"
    ref: "int"
    meaning: "Optional. Player index (0-based); absent = 0"
    absent: "0"
  - name: "role"
    type: "string"
    enum: ["head","gaze","left-hand","right-hand","left-shoulder","right-shoulder","left-elbow","right-elbow","chest","waist","left-knee","right-knee","left-foot","right-foot","gamepad","tracker"]
    required: true
    meaning: "Which body or device this pose is"
  - name: "index"
    ref: "int"
    meaning: "Optional. Disambiguates a repeated role; absent = 0"
    absent: "0"
  - name: "device"
    ref: "entity"
    meaning: "Optional. rig.vr.headset or rig.vr.controller this pose belongs to"
---
# `rig.vr.tracker`

One tracked pose. Format when present.

The pose at save is [`rig.spatial.transform`](../spatial/transform.md). Parent is [`rig.spatial.relationship`](../spatial/relationship.md). A label is [`rig.meta.named`](../meta/named.md).

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `role` | enum | Which body or device this pose is |
| `index` | int | Optional. Disambiguates a repeated role; absent = 0 |
| `device` | entity | Optional. [`rig.vr.headset`](headset.md) or [`rig.vr.controller`](controller.md) this pose belongs to |

`role` is `head`, `gaze`, `left-hand`, `right-hand`, `left-shoulder`, `right-shoulder`, `left-elbow`, `right-elbow`, `chest`, `waist`, `left-knee`, `right-knee`, `left-foot`, `right-foot`, `gamepad`, or `tracker`.

`gaze` index 0 is the left eye and index 1 is the right eye. `tracker` index distinguishes extra pucks. Other roles ignore `index`.

Grip and aim are child entities with [`rig.vr.pose`](pose.md), not extra roles. A tracked hand skeleton is [`rig.vr.hand`](hand.md).

Lost tracking, pose velocity, and prediction stay in the host. A host that saves a running session writes the current pose into the transform, the same way [`rig.sensor.imu`](../sensor/imu.md) writes its sample.
