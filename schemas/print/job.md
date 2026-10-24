---
id: "rig.print.job"
maturity: "stable"
summary: "One slice job. Format when present."
fields:
  - name: "input"
    ref: "entity"
    required: true
    meaning: "Mesh / STEP / 3MF rig.media.asset_ref (kind model)"
  - name: "output"
    ref: "entity"
    meaning: "Optional. Destination G-code - asset_ref or rig.media.code language gcode"
---
# `rig.print.job`

One slice job. Format when present.

The mesh and the G-code are [`rig.media.asset_ref`](../media/asset-ref.md) entities - do not put filesystem paths, a slicer executable, or last-run status here. Those stay in the host.

| Field | Type | Meaning |
|-------|------|---------|
| `input` | entity | Mesh / STEP / 3MF [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `model`) |
| `output` | entity | Optional. Destination G-code - `asset_ref` or [`rig.media.code`](../media/code.md) `language` `gcode` |

Required: `input`. The slice binary stays outside the document host.
