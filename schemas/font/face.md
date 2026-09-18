# `rig.font.face`

Editable typeface metrics. Format when present.

This is the **source** face - UFO / GLIF meaning. A compiled file on disk is [`rig.media.asset_ref`](../media/asset-ref.md) kind font. A positioned canvas run is [`rig.media.text`](../media/text.md). Do not grow text or asset_ref with outline fields.

Compose [`rig.meta.named`](../meta/named.md) for the face label. `.ufo` / `.ufoz` stay host encodings - [ufo.md](../../docs/ufo.md).

| Field | Type | Meaning |
|-------|------|---------|
| `family` | string | Optional. Family name (UFO `familyName`) |
| `style` | string | Optional. Style name (UFO `styleName`); absent = Regular |
| `unitsPerEm` | float | Optional. Font units per em; absent = 1000 |
| `ascender` | float | Optional. Ascender in font units |
| `descender` | float | Optional. Descender in font units (typically negative) |
| `capHeight` | float | Optional. Cap height in font units |
| `xHeight` | float | Optional. x-height in font units |
| `italicAngle` | float | Optional. Slant in degrees, counter-clockwise from vertical (UFO `italicAngle`); absent = 0 |
| `version` | string | Optional. Face version string (`1.000`) |
| `copyright` | string | Optional. Copyright statement (UFO `copyright`) |
| `trademark` | string | Optional. Trademark statement (UFO `trademark`) |
| `designer` | string | Optional. Designer name (UFO `openTypeNameDesigner`) |
| `designerUrl` | string | Optional. Designer URL (UFO `openTypeNameDesignerURL`) |
| `manufacturer` | string | Optional. Foundry name (UFO `openTypeNameManufacturer`) |
| `manufacturerUrl` | string | Optional. Foundry URL (UFO `openTypeNameManufacturerURL`) |
| `licence` | string | Optional. Licence description (UFO `openTypeNameLicense`) |
| `licenceUrl` | string | Optional. Licence URL (UFO `openTypeNameLicenseURL`) |
| `note` | string | Optional. Free-form note (UFO `note`) |
| `features` | entity | Optional. [`rig.media.code`](../media/code.md) buffer; `language` `fea` (AFDKO) |

Name-table strings stay these UFO meanings; a structured rights graph on other works is [`rig.rights.statement`](../rights/statement.md) - do not dual-author both on a face.

Layers, glyphs, kern pairs, groups, and design axes are other entities. Containment is [`rig.spatial.relationship`](../spatial/relationship.md) `parent` under this face (layers, axes) or under a layer (glyphs).

Variable design space: child entities with [`rig.font.axis`](axis.md) (+ optional [`rig.font.avar`](avar.md)). Authoring masters are layers composing [`rig.font.master`](master.md); live lattice deltas on a glyph are [`rig.font.cell`](cell.md). Hinting and colour-font tables are fulfillment / later schemas.
