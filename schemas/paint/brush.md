# `rig.paint.brush`

Measured facts about a physical paint brush in a holder.

This is the hair in the ferrule, not the machine that plunges it. Contact Z, feeds, leads, and dip stations stay on the host tool / bed. Colour stays on [`rig.paint.solid`](solid.md). Stroke width on a drawable stays on [`rig.paint.stroke`](stroke.md).

Digital / screen brushes (stamp masks, renderers, opacity, flow, spacing) are **out of scope** — those are host rendering settings, not measured facts. A digital painter may *reference* a `rig.paint.brush` entity to simulate or export for a physical tip (the taper profile answers width-vs-depth either way); exporters clamp stamp sizes to `tipWidthMm..maxWidthMm`. Digital brush presets that need persistence ride `x.rigkit.*` until a second host reads them.

Compose [`rig.meta.named`](../meta/named.md) for the label / `stableId`. Consumers point at that id the way a plot layer already points at a tool preset stem.

| Field | Type | Meaning |
|-------|------|---------|
| `shape` | enum | round, flat, filbert, fan, rigger, mop. The shape a maker sells, not a worn splay |
| `ferruleWidthMm` | float | Optional. Bristle bundle width where it leaves the ferrule (the size you bought). Upper bound on `maxWidthMm` when stated |
| `bristleLengthMm` | float | Optional. Hair length out of the ferrule. Hard ceiling on `taperHeightMm` when stated |
| `tipWidthMm` | float | Optional. Mark width (mm) at zero penetration, tip just touching; absent = 0.3 |
| `maxWidthMm` | float | Mark width (mm) at full taper depth |
| `taperHeightMm` | float | Optional. Plunge depth (mm below contact) over which the tip widens to max; absent = 4. Zero is a constant-width pen expressed with the same schema |
| `taperP1` | vec2 | Optional. First cubic Bezier handle of the width-vs-depth profile. Endpoints are fixed at (0,0) and (1,1). X is depth fraction (clamped 0-1); Y is width fraction (free, so the sides may bow past max or pinch inside the tip). Absent = (1/3, 1/3) |
| `taperP2` | vec2 | Optional. Second handle; absent = (2/3, 2/3). Together with `taperP1` the default is a straight ramp |
| `loadCapacityMm` | float | Optional. Plotted travel (mm) one dip sustains before the mark fails; absent = 400 |
| `lagTipMm` | float | Optional. Contact-patch lag (mm) at zero penetration: the patch trails the handle axis by this much when the tip just touches. Absent = 0 (rigid pen) |
| `lagMaxMm` | float | Optional. Contact-patch lag (mm) at full taper depth. Absent = `lagTipMm` |
| `lagP1` | vec2 | Optional. First cubic Bezier handle of the lag-vs-depth profile. Endpoints are fixed at (0,0) and (1,1). X is depth fraction (clamped 0-1); Y is lag fraction. Absent = (1/3, 1/3) |
| `lagP2` | vec2 | Optional. Second handle; absent = (2/3, 2/3). Together with `lagP1` the default is a straight ramp from `lagTipMm` to `lagMaxMm` |
| `gapMaxMm` | float | Optional. Tip-to-patch-center gap (mm) at full taper depth. Zero at touch, linear in depth. Absent = 0 |

Required: `shape`, `maxWidthMm`.

A host that plunges the brush answers "how wide is the mark at this Z" from `tipWidthMm`, `maxWidthMm`, `taperHeightMm`, and the two taper handles. A host that compensates the toolpath answers "where is the contact patch relative to the handle" from `lagTipMm`, `lagMaxMm`, the two lag handles, and `gapMaxMm`. Live paint level, dip counters, and stamp textures stay in the host.

Do not put stiffness or dry-fade here until a fulfillment reads them.
