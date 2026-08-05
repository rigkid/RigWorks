# `rig.spatial.camera`

Projection parameters (pose lives on transform). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `active` | bool | Used for present (typically one) |
| `projection` | enum | perspective, orthographic |
| `fovYDegrees` | float | Perspective FOV (degrees); ignored if orthographic |
| `orthoHeight` | float | Ortho frustum height when orthographic |
| `nearClip` | float | Near plane |
| `farClip` | float | Far plane |
| `aspect` | float | 0 = use viewport aspect at present |

No camera object / GPU handle.
