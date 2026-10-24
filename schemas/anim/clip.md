---
id: "rig.anim.clip"
maturity: "draft"
summary: "A span of sampled motion. Format when present. Compose rig.meta.named for the clip name."
fields:
  - name: "duration"
    ref: "float"
    required: true
    meaning: "Seconds"
  - name: "wrap"
    type: "string"
    enum: ["once","loop","ping-pong"]
    meaning: "Optional. once, loop, ping-pong; absent = once"
    absent: "once"
---
# `rig.anim.clip`

A span of sampled motion. Format when present. Compose [`rig.meta.named`](../meta/named.md) for the clip name.

| Field | Type | Meaning |
|-------|------|---------|
| `duration` | float | Seconds |
| `wrap` | enum | Optional. `once`, `loop`, `ping-pong`; absent = `once` |

Samples live on [`rig.anim.track`](track.md) entities that point here. A blend of clips is [`rig.anim.blend`](blend.md).

A single float eased in place stays [`rig.anim.tween`](tween.md). This clip is the sampled take.
