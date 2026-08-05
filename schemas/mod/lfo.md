# `rig.mod.lfo`

Low-frequency oscillator. Format when present.

Replaces a separate “pulse” schema — use waveform + binding.

| Field | Type | Meaning |
|-------|------|---------|
| `waveform` | enum | sine, tri, saw, square |
| `frequency` | float | Hz |
| `amplitude` | float | Depth |
| `offset` | float | Bias |
| `phase` | float | 0–1 (wrap) |

Last sample is a runtime cache — do not serialize. Drive targets through [`rig.mod.binding`](binding.md).
