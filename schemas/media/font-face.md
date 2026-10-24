# `rig.media.font_face`

Named compiled face for a canvas run. Format when present.

This is `@font-face`: a family name plus a file. The file is a [`rig.media.asset_ref`](asset-ref.md) (`kind` `font`). An editable UFO source stays [`rig.font.face`](../font/face.md).

| Field | Type | Meaning |
|-------|------|---------|
| `family` | string | Family name a run looks up |
| `asset` | entity | [`rig.media.asset_ref`](asset-ref.md) of the compiled file |
| `weight` | float | Optional. 100-900; absent = 400 |
| `style` | enum | Optional. `normal` / `italic`. Absent = `normal` |

A [`rig.media.text`](text.md) `font` points at the asset entity (or at this entity when both components share it). Decode and glyph caches stay fulfillment.
