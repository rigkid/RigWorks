# `rig.music.transport`

**Tempo and playhead authority.** One per scene when music schemas are present.

| Field | Type | Meaning |
|-------|------|---------|
| `playing` | bool | Running |
| `bpm` | float | Tempo |
| `timeSigNum` | int | Beats per bar |
| `timeSigDen` | int | Note value of beat |
| `positionBeats` | float | Playhead in beats |
| `loop` | bool | Loop |
| `loopStartBeats` | float | Loop in |
| `loopEndBeats` | float | Loop out |

`barIndex` / `beatInBar` are derived from `positionBeats` — do not serialize; recompute.
Pause = `playing=false` while keeping `positionBeats`.

Advance during `Update`. Clock / pattern / sequencer do **not** own bpm or the global playhead.
