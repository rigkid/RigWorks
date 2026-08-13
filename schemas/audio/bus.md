# `rig.audio.bus`

Master (or named) audio bus gain and mute. Format when present.

Compose [`rig.meta.named`](../meta/named.md) when more than one bus exists.

| Field | Type | Meaning |
|-------|------|---------|
| `gain` | float | Optional. 0–1 linear gain; absent = 1 |
| `mute` | bool | Optional. Silent when true; absent = false |

Per-stream players, decoders, and mix buffers are fulfillment. Asset identity for clips lives on [`rig.media.asset_ref`](../media/asset-ref.md).
