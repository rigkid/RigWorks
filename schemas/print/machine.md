# `rig.print.machine`

FGF / pellet printer envelope. Format when present.

This is not a slicer GUI, not [`rig.dev.machine`](../dev/machine.md) (a VM recipe), and not envelope `pdfX` (press). Pose of the part stays on [`rig.spatial.transform`](../spatial/transform.md). Barrel temperatures live on [`rig.print.material`](material.md).

| Field | Type | Meaning |
|-------|------|---------|
| `bedX` | float | Bed extent X (mm) |
| `bedY` | float | Bed extent Y (mm) |
| `bedZ` | float | Printable height (mm) |
| `pelletMode` | bool | Optional. Absent = false. When true, G-code `E` is volume (mm3), not filament length |
| `rotationVolumeMm3` | float | Optional. mm3 per screw turn (pellet). Absent = unset |
| `maxVolumetricMm3s` | float | Optional. Hardware melt / extrude ceiling (mm3/s). Absent = unset |

Required: `bedX`, `bedY`, `bedZ`. A grade MVS is [`rig.print.material`](material.md) `maxVolumetricMm3s` - do not copy the hardware ceiling onto the material unless the grade is tighter.
