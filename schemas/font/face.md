---
id: "rig.font.face"
maturity: "stable"
summary: "Editable typeface metrics. Format when present."
fields:
  - name: "family"
    ref: "string"
    meaning: "Optional. Family name (UFO familyName)"
  - name: "style"
    ref: "string"
    meaning: "Optional. Style name (UFO styleName); absent = Regular"
    absent: "Regular"
  - name: "unitsPerEm"
    ref: "float"
    meaning: "Optional. Font units per em; absent = 1000"
    absent: "1000"
  - name: "ascender"
    ref: "float"
    meaning: "Optional. Ascender in font units"
  - name: "descender"
    ref: "float"
    meaning: "Optional. Descender in font units (typically negative)"
  - name: "capHeight"
    ref: "float"
    meaning: "Optional. Cap height in font units"
  - name: "xHeight"
    ref: "float"
    meaning: "Optional. x-height in font units"
  - name: "italicAngle"
    ref: "float"
    meaning: "Optional. Slant in degrees, counter-clockwise from vertical (UFO italicAngle); absent = 0"
    absent: "0"
  - name: "version"
    ref: "string"
    meaning: "Optional. Face version string (1.000)"
  - name: "copyright"
    ref: "string"
    meaning: "Optional. Copyright statement (UFO copyright)"
  - name: "trademark"
    ref: "string"
    meaning: "Optional. Trademark statement (UFO trademark)"
  - name: "designer"
    ref: "string"
    meaning: "Optional. Designer name (UFO openTypeNameDesigner)"
  - name: "designerUrl"
    ref: "string"
    meaning: "Optional. Designer URL (UFO openTypeNameDesignerURL)"
  - name: "manufacturer"
    ref: "string"
    meaning: "Optional. Foundry name (UFO openTypeNameManufacturer)"
  - name: "manufacturerUrl"
    ref: "string"
    meaning: "Optional. Foundry URL (UFO openTypeNameManufacturerURL)"
  - name: "licence"
    ref: "string"
    meaning: "Optional. Licence description (UFO openTypeNameLicense)"
  - name: "licenceUrl"
    ref: "string"
    meaning: "Optional. Licence URL (UFO openTypeNameLicenseURL)"
  - name: "note"
    ref: "string"
    meaning: "Optional. Free-form note (UFO note)"
  - name: "features"
    ref: "entity"
    meaning: "Optional. rig.media.code buffer; language fea (AFDKO)"
---
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
