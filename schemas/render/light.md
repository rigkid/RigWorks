# `rig.render.light`

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Light on |
| `type` | enum | directional, point |
| `rgb` | vec3 | Light colour (0–1); hosts may store as three floats |
| `intensity` | float | Scale |
| `ambient` | float | Fill / darkest band level |
| `banded` | bool | Discrete shade steps when true |
| `bands` | int | Band count when `banded` |

Pose on transform. Directional shines along local −Z (world). Point uses world translation.

Spot / range / cone are not in the current draft — append later if a host ships them.
No light object handle.
