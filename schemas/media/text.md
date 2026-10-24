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
