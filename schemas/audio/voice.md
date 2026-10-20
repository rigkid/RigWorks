# `rig.audio.voice`

One playing asset. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | [`rig.media.asset_ref`](../media/asset-ref.md) of the clip |
| `bus` | entity | Optional. [`rig.audio.bus`](bus.md). Absent = the host's default bus |
| `gain` | float | Optional. 0-1 linear gain; absent = 1 |
| `pitch` | float | Optional. Playback rate; absent = 1 |
| `loop` | bool | Optional. Repeat; absent = false |
| `playing` | bool | Optional. Audible when true; absent = true |
| `time` | float | Optional. Playhead in seconds at load; absent = 0 |
| `spatial` | bool | Optional. Pan from this entity's transform when true; absent = false |
| `maxDistance` | float | Optional. Distance past which a spatial voice is silent. Absent = no cutoff |
| `unitSize` | float | Optional. Distance scale for rolloff. Absent = the host default |
| `rolloff` | enum | Optional. `none`, `linear`, `inverse`, `inverse-square`, `logarithmic`. Absent = `inverse` when `spatial`, otherwise ignored |

`gain` is linear amplitude, 0-1. A host that stores decibels converts (`linear = 10^(dB/20)`).

`time` and `playing` are the voice when the document is loaded, the same way a body's velocity is. Decoders, voice pools, mix buffers, and doppler tracking stay in the host.
