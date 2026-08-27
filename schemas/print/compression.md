# `rig.print.compression`

Hot-stack weight sag for FGF. Format when present.

Commanded XY / line width do not change. Extra Z (and optional extra `E`) restore model height after the soft column shortens under its own mass. Mass uses [`rig.print.material`](material.md) `densityKgM3` - do not store a second density here.

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Absent = false |
| `sagMmPerKg` | float | Extra commanded Z (mm) per kilogram already deposited below the current layer |
| `alsoScaleE` | bool | Optional. Absent = false. Scale extrusion by the padded layer height so the bead is not stretched |

Calibrate `sagMmPerKg` on a tall tower: `(commandedZ - measuredZ) / massKg`.
