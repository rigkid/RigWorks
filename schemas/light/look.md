# `rig.light.look`

Show look applied to a scene light. Format when present.

Compose onto the same entity as [`rig.render.light`](../render/light.md). Colour and intensity stay on that light.

| Field | Type | Meaning |
|-------|------|---------|
| `effectId` | string | Registry name of the look (`none`, `color`, `rainbow`, `pulse`, `strobe`, `chase`, `freeze`, …). Hosts ship what they support. |
| `speed` | float | Optional. 0–1 look rate; absent = host default |
| `freezeTimeoutMinutes` | float | Optional. Auto-release for freeze-style looks; absent = host default |

Effect algorithms are fulfillment. Do not serialize progress, freeze snapshots, or per-frame buffers.
