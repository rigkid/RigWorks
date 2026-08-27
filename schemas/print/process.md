# `rig.print.process`

Slice process knobs. Line width is commanded and stays commanded - stack sag is [`rig.print.compression`](compression.md), not a width change. This is not a layout style and not envelope `pdfX`.

| Field | Type | Meaning |
|-------|------|---------|
| `layerHeightMm` | float | Nominal layer height (mm) |
| `lineWidthMm` | float | Commanded bead width (mm) |
| `printSpeedMms` | float | Printing move speed (mm/s) |
| `travelSpeedMms` | float | Travel move speed (mm/s) |
| `adaptiveLayers` | bool | Optional. Absent = false |

Required: `layerHeightMm`, `lineWidthMm`.
