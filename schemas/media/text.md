---
id: "rig.media.text"
maturity: "stable"
summary: "Scene / canvas text run. Format when present."
fields:
  - name: "text"
    ref: "string"
    required: true
    meaning: "Content"
  - name: "font"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref with kind font; absent = host default face"
    absent: "host default face"
  - name: "fontSize"
    ref: "float"
    meaning: "Optional. Point or pixel size as the host documents; absent = host default"
    absent: "host default"
  - name: "axes"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"tag\",\"value\"],\"properties\":{\"tag\":{\"$ref\":\"./_defs.schema.json#/$defs/uint32\"},\"value\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"}}}"
    meaning: "Optional. OpenType variable-font axis values; absent = font defaults"
    absent: "font defaults"
  - name: "features"
    ref: "string"
    meaning: "Optional. Comma-separated OpenType feature tags (e.g. liga,ss01); absent = host default"
    absent: "host default"
  - name: "useKerning"
    ref: "bool"
    meaning: "Optional. Apply kerning; absent = true"
    absent: "true"
  - name: "tracking"
    ref: "float"
    meaning: "Optional. Letter-spacing in thousandths of an em; absent = 0"
    absent: "0"
  - name: "anchor"
    type: "string"
    enum: ["start","middle","end"]
    meaning: "Optional. start / middle / end; absent = start"
    absent: "start"
  - name: "writingMode"
    type: "string"
    enum: ["horizontal-tb","vertical-rl","vertical-lr"]
    meaning: "Optional. horizontal-tb / vertical-rl / vertical-lr; absent = horizontal-tb"
    absent: "horizontal-tb"
  - name: "direction"
    type: "string"
    enum: ["ltr","rtl"]
    meaning: "Optional. ltr / rtl; absent = ltr"
    absent: "ltr"
  - name: "baseline"
    type: "string"
    enum: ["auto","alphabetic","middle","hanging","ideographic","central"]
    meaning: "Optional. auto / alphabetic / middle / hanging / ideographic / central; absent = auto"
    absent: "auto"
  - name: "placements"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"index\"],\"properties\":{\"index\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"x\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"y\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"dx\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"dy\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"},\"rotateDegrees\":{\"$ref\":\"./_defs.schema.json#/$defs/float\"}}}"
    meaning: "Optional. Authored per-character slots (index plus optional x / y / dx / dy / rotateDegrees). Glyph positions the host computes stay a cache"
---
# `rig.media.text`

Scene / canvas text run. Format when present.

Editorial copy (named styles, paragraphs, runs, tables) is [`rig.story.flow`](../story/flow.md), not this schema. Do not flatten a story into canvas runs.

An editable UFO source face is [`rig.font.face`](../font/face.md) - do not put outlines, kern pairs, or glyph names on this schema. `font` here is a compiled [`rig.media.asset_ref`](asset-ref.md).

| Field | Type | Meaning |
|-------|------|---------|
| `text` | string | Content |
| `font` | entity | Optional. [`rig.media.asset_ref`](asset-ref.md) with kind font; absent = host default face |
| `fontSize` | float | Optional. Point or pixel size as the host documents; absent = host default |
| `axes` | axis[] | Optional. OpenType variable-font axis values; absent = font defaults |
| `features` | string | Optional. Comma-separated OpenType feature tags (e.g. `liga,ss01`); absent = host default |
| `useKerning` | bool | Optional. Apply kerning; absent = true |
| `tracking` | float | Optional. Letter-spacing in thousandths of an em; absent = 0 |
| `anchor` | enum | Optional. `start` / `middle` / `end`; absent = `start` |
| `writingMode` | enum | Optional. `horizontal-tb` / `vertical-rl` / `vertical-lr`; absent = `horizontal-tb` |
| `direction` | enum | Optional. `ltr` / `rtl`; absent = `ltr` |
| `baseline` | enum | Optional. `auto` / `alphabetic` / `middle` / `hanging` / `ideographic` / `central`; absent = `auto` |
| `placements` | object[] | Optional. Authored per-character slots (`index` plus optional `x` / `y` / `dx` / `dy` / `rotateDegrees`). Glyph positions the host computes stay a cache |

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md) or [`rig.paint.fill`](../paint/fill.md) on the same entity - do not re-declare colour here. Absent paint means host default (typically black). A run that follows a contour composes [`rig.media.text_path`](text-path.md). A styled child run is another `rig.media.text` entity, not a bag on this one.

## Axis

| Field | Type | Meaning |
|-------|------|---------|
| `tag` | uint32 | 4-char OpenType tag packed as big-endian uint32 (e.g. `'wght'` = `0x77676874`) |
| `value` | float | Authored axis value. Min/max/name come from the font file at fulfillment time |

Face handles, glyph caches, and GPU atlases stay in the host.
