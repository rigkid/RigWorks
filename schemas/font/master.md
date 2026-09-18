# `rig.font.master`

One interpolation master on a face. Format when present.

Compose on the [`rig.font.layer`](layer.md) entity that holds this master's outlines - the designspace `<source>` idea: same glyph set, drawn at one location in the design space. The default master is the layer without this component (or with every value at the axis default).

| Field | Type | Meaning |
|-------|------|---------|
| `location` | term[] | Required. Design coordinates for this master |

## Location term

| Field | Type | Meaning |
|-------|------|---------|
| `tag` | string | Required. Axis `tag` on a face [`rig.font.axis`](axis.md) (`wght`) |
| `value` | float | Required. Design value on that axis (`900`) |

Axes absent from `location` sit at their default. Interpolation math and compiled deltas are fulfillment; live reconstruction data is [`rig.font.cell`](cell.md) on the glyph. Named instances stay fulfillment.
