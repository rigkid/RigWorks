---
id: "rig.vision.device"
maturity: "draft"
summary: "Authored vision backend preference. Format when present. Live device presence is host cache."
fields:
  - name: "backendPreference"
    type: "string"
    enum: ["auto", "hailo", "cpu", "gpu"]
    meaning: "Optional. Preferred backend. Absent = auto"
    absent: "auto"
---
# `rig.vision.device`

Authored vision backend preference. Format when present. Live device presence is host cache.

| Field | Type | Meaning |
|-------|------|---------|
| `backendPreference` | enum | Optional. `auto`, `hailo`, `cpu`, or `gpu`. Absent = `auto` |

Presence, arch, HailoRT version, and the backend actually used are host cache. A request for `hailo` that falls back to CPU reports CPU - it does not claim the NPU.

Compose [`rig.meta.named`](../meta/named.md) for a label when needed. Object detect / segment / pose requests are [`rig.vision.detect`](detect.md) / [`segment`](segment.md) / [`pose`](pose.md). Model identity is [`rig.vision.model`](model.md).
