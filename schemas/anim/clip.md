# `rig.anim.clip`

A span of sampled motion. Format when present. Compose [`rig.meta.named`](../meta/named.md) for the clip name.

| Field | Type | Meaning |
|-------|------|---------|
| `duration` | float | Seconds |
| `wrap` | enum | Optional. `once`, `loop`, `ping-pong`; absent = `once` |

Samples live on [`rig.anim.track`](track.md) entities that point here. A blend of clips is [`rig.anim.blend`](blend.md).

A single float eased in place stays [`rig.anim.tween`](tween.md). This clip is the sampled take.
