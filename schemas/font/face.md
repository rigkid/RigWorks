# `rig.font.face`

Editable typeface metrics. Format when present.

This is the **source** face — UFO / GLIF meaning. A compiled file on disk is [`rig.media.asset_ref`](../media/asset-ref.md) kind font. A positioned canvas run is [`rig.media.text`](../media/text.md). Do not grow text or asset_ref with outline fields.

Compose [`rig.meta.named`](../meta/named.md) for the face label. `.ufo` / `.ufoz` stay host encodings — [ufo.md](../../docs/ufo.md).

| Field | Type | Meaning |
|-------|------|---------|
| `family` | string | Optional. Family name (UFO `familyName`) |
| `style` | string | Optional. Style name (UFO `styleName`); absent = Regular |
| `unitsPerEm` | float | Optional. Font units per em; absent = 1000 |
| `ascender` | float | Optional. Ascender in font units |
| `descender` | float | Optional. Descender in font units (typically negative) |
| `capHeight` | float | Optional. Cap height in font units |
| `xHeight` | float | Optional. x-height in font units |
| `version` | string | Optional. Face version string (`1.000`) |
| `features` | entity | Optional. [`rig.media.code`](../media/code.md) buffer; `language` `fea` (AFDKO) |

Layers, glyphs, kern pairs, and groups are other entities. Containment is [`rig.spatial.relationship`](../spatial/relationship.md) `parent` under this face (layers) or under a layer (glyphs).

Hinting, variable design space, and colour-font tables are fulfillment / later schemas.
