---
id: "rig.audio.voice"
maturity: "draft"
summary: "One playing asset. Format when present."
fields:
  - name: "asset"
    ref: "entity"
    required: true
    meaning: "rig.media.asset_ref of the clip"
  - name: "bus"
    ref: "entity"
    meaning: "Optional. rig.audio.bus. Absent = the host's default bus"
    absent: "the host's default bus"
  - name: "gain"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 linear gain; absent = 1"
    absent: "1"
  - name: "pitch"
    ref: "float"
    meaning: "Optional. Playback rate; absent = 1"
    absent: "1"
  - name: "loop"
    ref: "bool"
    meaning: "Optional. Repeat; absent = false"
    absent: "false"
  - name: "playing"
    ref: "bool"
    meaning: "Optional. Audible when true; absent = true"
    absent: "true"
  - name: "time"
    ref: "float"
    meaning: "Optional. Playhead in seconds at load; absent = 0"
    absent: "0"
  - name: "spatial"
    ref: "bool"
    meaning: "Optional. Pan from this entity's transform when true; absent = false"
    absent: "false"
  - name: "maxDistance"
    ref: "float"
    meaning: "Optional. Distance past which a spatial voice is silent. Absent = no cutoff"
    absent: "no cutoff"
  - name: "unitSize"
    ref: "float"
    meaning: "Optional. Distance scale for rolloff. Absent = the host default"
    absent: "the host default"
  - name: "rolloff"
    type: "string"
    enum: ["none","linear","inverse","inverse-square","logarithmic"]
    meaning: "Optional. none, linear, inverse, inverse-square, logarithmic. Absent = inverse when spatial, otherwise ignored"
    absent: "inverse when spatial, otherwise ignored"
---
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
