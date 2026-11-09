---
id: "rig.music.step"
maturity: "draft"
summary: "One cell in a pattern grid. Format when present."
fields:
  - name: "active"
    ref: "bool"
    required: true
    meaning: "Fire this step"
  - name: "pitch"
    type: "integer"
    minimum: 0
    maximum: 127
    meaning: "Optional. MIDI note number 0-127; absent = 60. 60 is C4. Same numbering as rig.music.note"
    absent: "60"
  - name: "velocity"
    type: "integer"
    minimum: 0
    maximum: 127
    meaning: "Optional. 0-127 (maps to host volume); absent = 100"
    absent: "100"
  - name: "gate"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 fraction of the step duration; absent = 1"
    absent: "1"
  - name: "waveform"
    type: "integer"
    minimum: 0
    maximum: 255
    meaning: "Optional. 0-255; absent = 0. 0 sine, 1 tri, 2 saw, 3 square, 4 noise. 5-7 are unassigned. 8 and up are host instrument slots"
    absent: "0"
  - name: "effect"
    type: "integer"
    minimum: 0
    maximum: 7
    meaning: "Optional. 0-7; absent = 0. 0 is no effect. 1-7 are host slots with no shared effect"
    absent: "0"
  - name: "intervals"
    schemaJson: "{\"type\":\"array\",\"items\":{\"type\":\"integer\",\"minimum\":-127,\"maximum\":127},\"uniqueItems\":true}"
    meaning: "Optional. Semitone offsets in 12-tone equal temperament from pitch, not scale degrees. A major third is 4. Absent = pitch alone. Omit 0. A major triad is [4, 7]; a minor triad is [3, 7]"
    absent: "pitch alone"
---
# `rig.music.step`

One cell in a pattern grid. Format when present.

Owned by [`rig.music.pattern`](pattern.md) (`steps` array). Not a free-time piano-roll note - that is [`rig.music.note`](note.md).

| Field | Type | Meaning |
|-------|------|---------|
| `active` | bool | Fire this step |
| `pitch` | int | Optional. MIDI note number 0-127; absent = 60. 60 is C4. Same numbering as [`rig.music.note`](note.md) |
| `velocity` | int | Optional. 0-127 (maps to host volume); absent = 100 |
| `gate` | float | Optional. 0-1 fraction of the step duration; absent = 1 |
| `waveform` | int | Optional. 0-255; absent = 0. 0 sine, 1 tri, 2 saw, 3 square, 4 noise. 5-7 are unassigned. 8 and up are host instrument slots |
| `effect` | int | Optional. 0-7; absent = 0. 0 is no effect. 1-7 are host slots with no shared effect |
| `intervals` | int[] | Optional. Semitone offsets in 12-tone equal temperament from `pitch`, not scale degrees. A major third is 4. Absent = `pitch` alone. Omit 0. A major triad is `[4, 7]`; a minor triad is `[3, 7]` |

Only `active` is required - an inactive step can be `{"active": false}` with nothing invented for the silent fields.

The step sounds `pitch` and each `pitch + interval`. `pitch` is the chord root. A note below the root is a negative offset. Letter names are derived. 60 is C4.

`waveform` 0-3 use the same four words as [`rig.mod.lfo`](../mod/lfo.md): sine, tri, saw, square. 4 is noise (unpitched). 5, 6, and 7 have no portable shape; a host does not guess one. 8 and up are host instrument slots.

`effect` 0 means the cell has no effect. 1-7 are host slots. Two documents that both store `effect` 3 have not agreed on an effect. There is no portable effect catalog, and no parallel sample schema.

Human words for a part: [music.md](../../docs/music.md).
