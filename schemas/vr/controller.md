---
id: "rig.vr.controller"
maturity: "draft"
summary: "A held input device. Format when present."
fields:
  - name: "player"
    ref: "int"
    meaning: "Optional. Player index (0-based); absent = 0"
    absent: "0"
  - name: "hand"
    type: "string"
    enum: ["left","right","none"]
    meaning: "Optional. left, right, none. Absent = none"
    absent: "none"
  - name: "profile"
    ref: "string"
    meaning: "Optional. Interaction profile token the host understands"
---
# `rig.vr.controller`

A held input device. Format when present.

Pose of the device is [`rig.spatial.transform`](../spatial/transform.md). Grip and aim are child [`rig.vr.pose`](pose.md) entities. Buttons, triggers, and sticks are [`rig.input.binding`](../input/binding.md) `device` `vr` into [`rig.input.buttons`](../input/buttons.md) and [`rig.input.axes`](../input/axes.md). A pulse is [`rig.vr.haptic`](haptic.md) on this entity.

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `hand` | enum | Optional. `left`, `right`, `none`. Absent = `none` |
| `profile` | string | Optional. Interaction profile token the host understands |

Well-known `profile` tokens: `khr-simple`, `generic-trigger-squeeze-thumbstick`, `oculus-touch`, `valve-index`, `microsoft-motion`, `htc-vive`. Any other string is a profile that host implements. An unknown profile is kept; the host still maps the generic binding codes it knows.

Binding `index` 0 is the left controller and 1 is the right controller of that `player`. `hand` `none` uses `index` as written (a gamepad).

The tracked pose for this device is a [`rig.vr.tracker`](tracker.md) whose `device` points here, or this entity's own transform when it is the pose.
