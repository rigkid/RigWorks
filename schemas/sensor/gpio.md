# `rig.sensor.gpio`

| Field | Type | Meaning |
|-------|------|---------|
| `pin` | int | GPIO index |
| `mode` | enum | in, out |
| `level` | float | 0–1 reading or drive |
| `device` | entity | Optional board / network entity; none = local |

Digital hosts threshold `level` themselves (e.g. ≥ 0.5).
