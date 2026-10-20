# `rig.play.health`

Hit points. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `current` | float | Optional. Remaining. Absent = `maximum` |
| `maximum` | float | Optional. Full. Absent = 1 |

`current` is the value at load, including a save of a running scene. Damage rules stay in the host.
