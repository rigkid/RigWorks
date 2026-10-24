---
id: "rig.vr.haptic"
maturity: "draft"
summary: "One vibration pulse on a rig.vr.controller. Format when present."
fields:
  - name: "amplitude"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1. Absent = 0"
    absent: "0"
  - name: "durationSeconds"
    type: "number"
    minimum: 0
    meaning: "Optional. Length of the pulse. Absent = the host default"
    absent: "the host default"
  - name: "frequencyHz"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Absent = the host default"
    absent: "the host default"
---
# `rig.vr.haptic`

One vibration pulse on a [`rig.vr.controller`](controller.md). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `amplitude` | float | Optional. 0-1. Absent = 0 |
| `durationSeconds` | float | Optional. Length of the pulse. Absent = the host default |
| `frequencyHz` | float | Optional. Absent = the host default |

This is the pulse when the document is loaded. An author writes a click; a save writes the command in effect. PCM streams, queues, and device handles stay in the host.
