# `rig.music.note`

Free-time piano-roll / clip note (beats). Format when present.

Grid cells are [`rig.music.step`](step.md) inside a pattern — not this schema.

| Field | Type | Meaning |
|-------|------|---------|
| `pitch` | int | 0–127 |
| `velocity` | int | 0–127 |
| `channel` | int | 0–15 |
| `start` | float | Beats |
| `duration` | float | Beats; 0 = instantaneous |
| `clip` | entity | Parent clip entity; none = unbound |

Raw MIDI bytes stay in the host behind [`rig.music.midi_output`](midi-output.md).
