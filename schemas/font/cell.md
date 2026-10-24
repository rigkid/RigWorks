---
id: "rig.font.cell"
maturity: "stable"
summary: "Live variable-glyph reconstruction on a glyph entity. Format when present."
fields:
  - name: "baseAdv"
    ref: "float"
    required: true
    meaning: "Required. Advance width at the default instance (matches glyph.width when both present)"
  - name: "terms"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"axisTag\",\"sign\",\"adv\",\"segs\"],\"properties\":{\"axisTag\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"sign\":{\"type\":\"integer\",\"enum\":[-1,1]},\"axisTag2\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"sign2\":{\"type\":\"integer\",\"enum\":[-1,1]},\"axisTag3\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"sign3\":{\"type\":\"integer\",\"enum\":[-1,1]},\"center\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"wl\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"wr\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"adv\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"segs\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"type\",\"points\"],\"properties\":{\"type\":{\"type\":\"string\",\"enum\":[\"line\",\"quad\"]},\"points\":{\"type\":\"array\",\"items\":{\"$ref\":\"./_defs.schema.json#/$defs/vec2\"}}}}}}}"
    meaning: "Optional. Reconstruction terms; absent or empty = static glyph"
    absent: "or empty = static glyph"
---
# `rig.font.cell`

Live variable-glyph reconstruction on a glyph entity. Format when present.

Default outline stays on [`rig.geometry.path`](../geometry/path.md) (the default master). This component holds **deltas** that reconstruct other locations: `base + Σ weight(term) · Δ`. Used by lattice / morph hosts ([VarFont](https://github.com/GitBruno/VarFont), vFont). Static UFO faces omit it.

| Field | Type | Meaning |
|-------|------|---------|
| `baseAdv` | float | Required. Advance width at the default instance (matches `glyph.width` when both present) |
| `terms` | term[] | Optional. Reconstruction terms; absent or empty = static glyph |

## Term

| Field | Type | Meaning |
|-------|------|---------|
| `axisTag` | string | Required. Axis `tag` this term rides |
| `sign` | int | Required. `1` = positive half-axis, `-1` = negative |
| `axisTag2` / `sign2` | string / int | Optional. Pair cross term |
| `axisTag3` / `sign3` | string / int | Optional. Triple cross term |
| `center` / `wl` / `wr` | float | Optional. Hat (tent) correction around `center` on [0,1] with left/right spans |
| `adv` | float | Required. Advance delta at full term weight |
| `segs` | deltaSeg[] | Required. Point deltas matching the default path topology |

## Delta segment

| Field | Type | Meaning |
|-------|------|---------|
| `type` | enum | `line` or `quad` - same topology as the default path |
| `points` | vec2[] | Deltas (not absolute positions): line = 2, quad = 3 |

Weighting is host fulfillment (e.g. `|blend|` for linear terms, tent for hats, product for crosses). Do not store GPU buffers, dirty flags, or sampled FreeType outlines here.
