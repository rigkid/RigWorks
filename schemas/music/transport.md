---
id: "rig.music.transport"
maturity: "stable"
summary: "**Tempo and playhead authority.** One per scene when music schemas are present."
fields:
  - name: "playing"
    ref: "bool"
    meaning: "Optional. Running; absent = false"
    absent: "false"
  - name: "bpm"
    ref: "float"
    required: true
    meaning: "Tempo"
  - name: "timeSigNum"
    ref: "int"
    meaning: "Optional. Beats per bar; absent = 4"
    absent: "4"
  - name: "timeSigDen"
    ref: "int"
    meaning: "Optional. Note value of beat; absent = 4"
    absent: "4"
  - name: "positionBeats"
    ref: "float"
    meaning: "Optional. Playhead in beats; absent = 0"
    absent: "0"
  - name: "loop"
    ref: "bool"
    meaning: "Optional. Loop; absent = false"
    absent: "false"
  - name: "loopStartBeats"
    ref: "float"
    meaning: "Loop in; required when loop"
  - name: "loopEndBeats"
    ref: "float"
    meaning: "Loop out; required when loop"
---
# `rig.music.transport`

**Tempo and playhead authority.** One per scene when music schemas are present.

| Field | Type | Meaning |
|-------|------|---------|
| `playing` | bool | Optional. Running; absent = false |
| `bpm` | float | Tempo |
| `timeSigNum` | int | Optional. Beats per bar; absent = 4 |
| `timeSigDen` | int | Optional. Note value of beat; absent = 4 |
| `positionBeats` | float | Optional. Playhead in beats; absent = 0 |
| `loop` | bool | Optional. Loop; absent = false |
| `loopStartBeats` | float | Loop in; required when `loop` |
| `loopEndBeats` | float | Loop out; required when `loop` |

`barIndex` / `beatInBar` are derived from `positionBeats` - do not serialize; recompute.
Pause = `playing=false` while keeping `positionBeats`.

Advance during `Update`. Clock / pattern / sequencer do **not** own bpm or the global playhead.
