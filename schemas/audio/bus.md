# `rig.audio.bus`

Master (or named) audio bus gain and mute. Format when present.

Compose [`rig.meta.named`](../meta/named.md) when more than one bus exists.

| Field | Type | Meaning |
|-------|------|---------|
| `gain` | float | Optional. 0–1 linear gain; absent = 1 |
| `mute` | bool | Optional. Silent when true; absent = false |

A house / master mute is this component on a named bus — do not invent a second mute schema. Visuals going dark is fulfillment (`rig.render.visibility`, light intensity, or a clear), not a portable blackout bit.

Per-stream players, decoders, and mix buffers are fulfillment. Asset identity for clips lives on [`rig.media.asset_ref`](../media/asset-ref.md).
