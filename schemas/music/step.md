# `rig.music.step`

One cell in a pattern grid. Format when present.

Owned by [`rig.music.pattern`](pattern.md) (`steps` array). Not a free-time piano-roll note — that is [`rig.music.note`](note.md).

| Field | Type | Meaning |
|-------|------|---------|
| `active` | bool | Fire this step |
| `pitch` | int | 0–127 |
| `velocity` | int | 0–127 |
| `gate` | float | 0–1 fraction of the step duration |

One hit per step in the current draft. Chords / locks can come later as extra fields or child data.
