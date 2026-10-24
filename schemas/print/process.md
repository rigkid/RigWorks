---
id: "rig.print.process"
maturity: "stable"
summary: "Slice process knobs. Line width is commanded and stays commanded - stack sag is rig.print.compression, not a width change. This is not a layout style and not envelope pdfX."
fields:
  - name: "layerHeightMm"
    ref: "float"
    required: true
    meaning: "Nominal layer height (mm)"
  - name: "lineWidthMm"
    ref: "float"
    required: true
    meaning: "Commanded bead width (mm)"
  - name: "printSpeedMms"
    ref: "float"
    meaning: "Printing move speed (mm/s)"
  - name: "travelSpeedMms"
    ref: "float"
    meaning: "Travel move speed (mm/s)"
  - name: "adaptiveLayers"
    ref: "bool"
    meaning: "Optional. Absent = false"
    absent: "false"
---
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
