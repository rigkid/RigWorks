---
id: "rig.music.note"
maturity: "draft"
summary: "Free-time piano-roll / clip note (beats). Format when present."
fields:
  - name: "pitch"
    type: "integer"
    minimum: 0
    maximum: 127
    required: true
    meaning: "MIDI note number 0-127. 60 is C4. Pitch class is pitch modulo 12, C = 0"
  - name: "velocity"
    type: "integer"
    minimum: 0
    maximum: 127
    meaning: "Optional. 0-127; absent = 100"
    absent: "100"
  - name: "channel"
    type: "integer"
    minimum: 0
    maximum: 15
    meaning: "Optional. 0-15; absent = 0"
    absent: "0"
  - name: "start"
    ref: "float"
    required: true
    meaning: "Beats"
  - name: "duration"
    ref: "float"
    required: true
    meaning: "Beats; 0 = instantaneous"
  - name: "clip"
    ref: "entity"
    meaning: "Optional. Parent clip entity; none = unbound"
  - name: "intervals"
    schemaJson: "{\"type\":\"array\",\"items\":{\"type\":\"integer\",\"minimum\":-127,\"maximum\":127},\"uniqueItems\":true}"
    meaning: "Optional. Semitone offsets in 12-tone equal temperament from pitch, not scale degrees. A major third is 4. Absent = pitch alone. Omit 0. A major triad is [4, 7]; a minor triad is [3, 7]"
    absent: "pitch alone"
---
# `rig.music.note`

Free-time piano-roll / clip note (beats). Format when present.

Grid cells are [`rig.music.step`](step.md) inside a pattern - not this schema.

| Field | Type | Meaning |
|-------|------|---------|
| `pitch` | int | MIDI note number 0-127. 60 is C4. Pitch class is `pitch` modulo 12, C = 0 |
| `velocity` | int | Optional. 0-127; absent = 100 |
| `channel` | int | Optional. 0-15; absent = 0 |
| `start` | float | Beats |
| `duration` | float | Beats; 0 = instantaneous |
| `clip` | entity | Optional. Parent clip entity; none = unbound |
| `intervals` | int[] | Optional. Semitone offsets in 12-tone equal temperament from `pitch`, not scale degrees. A major third is 4. Absent = `pitch` alone. Omit 0. A major triad is `[4, 7]`; a minor triad is `[3, 7]` |

The note sounds `pitch` and each `pitch + interval`. Same chord shape as [`rig.music.step`](step.md). Letter names and octave words are derived from the number. Human words for the rest of a part: [music.md](../../docs/music.md).

Raw MIDI bytes stay in the host behind [`rig.music.midi_output`](midi-output.md).

## Beats vs host ticks

`start` / `duration` are **beats**, not host clock ticks. That matches industry sync (Ableton Link speaks beat + phase) and keeps notes portable across hosts with different `ticksPerQuarter`.

Hosts that store notes in ticks convert at the **document** boundary using the scene [`rig.music.clock`](clock.md) (`ticksPerQuarter`). A per-component codec that cannot see the clock cannot convert honestly - that is a host IO smell, not a reason to change this schema. Tick grids stay host-local; do not serialize tick positions as if they were beats.
