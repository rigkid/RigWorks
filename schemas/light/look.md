---
id: "rig.light.look"
maturity: "experimental"
summary: "Show look applied to a scene light. Format when present."
fields:
  - name: "effectId"
    ref: "string"
    required: true
    meaning: "Registry name of the look (none, color, rainbow, pulse, strobe, chase, freeze, ...). Hosts ship what they support."
  - name: "speed"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 look rate; absent = host default"
    absent: "host default"
  - name: "freezeTimeoutMinutes"
    ref: "float"
    meaning: "Optional. Auto-release for freeze-style looks; absent = host default"
    absent: "host default"
---
# `rig.light.look`

Show look applied to a scene light. Format when present.

Compose onto the same entity as [`rig.render.light`](../render/light.md). Colour and intensity stay on that light.

| Field | Type | Meaning |
|-------|------|---------|
| `effectId` | string | Registry name of the look (`none`, `color`, `rainbow`, `pulse`, `strobe`, `chase`, `freeze`, ...). Hosts ship what they support. |
| `speed` | float | Optional. 0-1 look rate; absent = host default |
| `freezeTimeoutMinutes` | float | Optional. Auto-release for freeze-style looks; absent = host default |

Effect algorithms are fulfillment. Do not serialize progress, freeze snapshots, or per-frame buffers.
