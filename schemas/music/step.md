# `rig.music.step`

One cell in a pattern grid. Format when present.

Owned by [`rig.music.pattern`](pattern.md) (`steps` array). Not a free-time piano-roll note - that is [`rig.music.note`](note.md).

| Field | Type | Meaning |
|-------|------|---------|
| `active` | bool | Fire this step |
| `pitch` | int | Optional. 0-127; absent = 60 |
| `velocity` | int | Optional. 0-127 (maps to host volume); absent = 100 |
| `gate` | float | Optional. 0-1 fraction of the step duration; absent = 1 |
| `waveform` | int | Optional. 0-255; absent = 0. 0-7 are the portable synth shapes; 8 and up are host instrument slots |
| `effect` | int | Optional. 0-7 note effect id; absent = 0 |
| `intervals` | int[] | Optional. Semitone offsets from `pitch`. Absent = `pitch` alone. Omit 0. A major triad is `[4, 7]`; a minor triad is `[3, 7]` |

Only `active` is required - an inactive step can be `{"active": false}` with nothing invented for the silent fields.

The step sounds `pitch` and each `pitch + interval`. `pitch` is the chord root. A note below the root is a negative offset.

A tracker-style step row uses `pitch` + `waveform` + `velocity` as volume + `effect` per cell - no parallel sample schema. Waveform values 8 and up are host instrument slots; the Contract does not assign them portable shapes.
