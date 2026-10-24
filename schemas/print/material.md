---
id: "rig.print.material"
maturity: "draft"
summary: "Pellet / filament grade used on a rig.print.machine. Format when present."
fields:
  - name: "densityKgM3"
    ref: "float"
    required: true
    meaning: "Solid density (kg/m3) for mass from extruded volume"
  - name: "feedZoneC"
    ref: "float"
    meaning: "Optional. Barrel feed zone (C)"
  - name: "meltZoneC"
    ref: "float"
    meaning: "Optional. Barrel melt zone (C)"
  - name: "nozzleZoneC"
    ref: "float"
    meaning: "Optional. Nozzle zone (C)"
  - name: "maxVolumetricMm3s"
    ref: "float"
    meaning: "Optional. Grade MVS (mm3/s). Absent = use the machine ceiling"
    absent: "use the machine ceiling"
---
# `rig.print.material`

Pellet / filament grade used on a [`rig.print.machine`](machine.md). Format when present.

This is not [`rig.art.material`](../art/material.md) (CDWA medium) and not [`rig.render.material`](../render/material.md) (shader).

| Field | Type | Meaning |
|-------|------|---------|
| `densityKgM3` | float | Solid density (kg/m3) for mass from extruded volume |
| `feedZoneC` | float | Optional. Barrel feed zone (C) |
| `meltZoneC` | float | Optional. Barrel melt zone (C) |
| `nozzleZoneC` | float | Optional. Nozzle zone (C) |
| `maxVolumetricMm3s` | float | Optional. Grade MVS (mm3/s). Absent = use the machine ceiling |

Display name composes [`rig.meta.named`](../meta/named.md). Required: `densityKgM3`. Do not re-declare density on [`rig.print.compression`](compression.md).
