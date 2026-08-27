# Print (FGF)

Rig names pellet / FGF machine meaning as [`rig.print.*`](../schemas/print/machine.md). G-code **files** and slicer processes stay host mappings at the boundary - same rule as IDML in [idml.md](idml.md).

## Not these

| Nearby id | Why it is different |
|-----------|---------------------|
| Envelope `pdfX` / `outputCondition` / `trapped` | Press / PDF/X job - [document.md](../schemas/document.md) |
| [`rig.layout.page`](../schemas/layout/page.md) / [`frame`](../schemas/layout/frame.md) | Print *spread* (pages, type). Not a bed |
| [`rig.dev.machine`](../schemas/dev/machine.md) | VM / CI recipe - [dev.md](dev.md) |
| [`rig.art.material`](../schemas/art/material.md) | CDWA medium / technique |
| [`rig.render.material`](../schemas/render/material.md) | Shader |
| [`rigGCode`](https://github.com/rigkid/rigGCode) `CPaths` | Plotter toolpaths. FGF G-code is `asset_ref` / [`rig.media.code`](../schemas/media/code.md) `language` `gcode` |
| [`rig.cad.*`](../schemas/cad/cuboid.md) | Authored solid. The part to slice is mesh / CAD + transform |

## Map

| Idea | Rig |
|------|-----|
| Printer envelope | [`rig.print.machine`](../schemas/print/machine.md) |
| Pellet / filament grade | [`rig.print.material`](../schemas/print/material.md) |
| Slice knobs | [`rig.print.process`](../schemas/print/process.md) |
| Hot-stack sag | [`rig.print.compression`](../schemas/print/compression.md) |
| One job | [`rig.print.job`](../schemas/print/job.md) `input` / `output` names asset entities |
| Part pose | [`rig.spatial.transform`](../schemas/spatial/transform.md) |
| Mesh / STEP / 3MF / G-code file | [`rig.media.asset_ref`](../schemas/media/asset-ref.md) |

Do not store slicer executables, last-slice ok/error, or host paths on `rig.print.job`.

Example: [`examples/print-fgf.json`](../examples/print-fgf.json).
