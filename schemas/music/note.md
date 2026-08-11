# `rig.music.note`

Free-time piano-roll / clip note (beats). Format when present.

Grid cells are [`rig.music.step`](step.md) inside a pattern — not this schema.

| Field | Type | Meaning |
|-------|------|---------|
| `pitch` | int | 0–127 |
| `velocity` | int | Optional. 0–127; absent = 100 |
| `channel` | int | Optional. 0–15; absent = 0 |
| `start` | float | Beats |
| `duration` | float | Beats; 0 = instantaneous |
| `clip` | entity | Optional. Parent clip entity; none = unbound |

Raw MIDI bytes stay in the host behind [`rig.music.midi_output`](midi-output.md).

## Beats vs host ticks

`start` / `duration` are **beats**, not host clock ticks. That matches industry sync (Ableton Link speaks beat + phase) and keeps notes portable across hosts with different `ticksPerQuarter`.

Hosts that store notes in ticks convert at the **document** boundary using the scene [`rig.music.clock`](clock.md) (`ticksPerQuarter`). A per-component codec that cannot see the clock cannot convert honestly — that is a host IO smell, not a reason to change this schema. Tick grids stay host-local; do not serialize tick positions as if they were beats.
