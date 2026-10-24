---
id: "rig.book.title"
maturity: "draft"
summary: "Title detail beyond the distinctive title. Format when present."
topJson: "{\"description\":\"Title detail beyond the distinctive title. Field meanings follow ONIX TitleDetail. Distinctive title is rig.meta.named.\",\"minProperties\":1}"
fields:
  - name: "subtitle"
    ref: "string"
    meaning: "Subtitle"
  - name: "originalTitle"
    ref: "string"
    meaning: "Title in the original language (translations)"
  - name: "titlePrefix"
    ref: "string"
    meaning: "Leading article (The, A) when split for sorting"
  - name: "editionStatement"
    ref: "string"
    meaning: "Edition as printed (Revised, 3rd ed.)"
  - name: "editionNumber"
    ref: "int"
    meaning: "Numeric edition"
  - name: "seriesName"
    ref: "string"
    meaning: "Series / collection title"
  - name: "seriesNumber"
    ref: "string"
    meaning: "Number within the series (Vol. 2)"
  - name: "description"
    ref: "string"
    meaning: "Short bibliographic note / blurb"
---
# `rig.book.title`

Title detail beyond the distinctive title. Format when present.

Field meanings follow ONIX for Books `TitleDetail` / `TitleElement`. This schema is those extra title elements - not the product identifier and not the display label.

| Field | Type | Meaning | ONIX |
|-------|------|---------|------|
| `subtitle` | string | Subtitle | `Subtitle` |
| `originalTitle` | string | Title in the original language (translations) | original-language title |
| `titlePrefix` | string | Leading article (`The`, `A`) when split for sorting | `TitlePrefix` |
| `editionStatement` | string | Edition as printed (`Revised`, `3rd ed.`) | `EditionStatement` |
| `editionNumber` | int | Numeric edition | `EditionNumber` |
| `seriesName` | string | Series / collection title | collection `TitleText` |
| `seriesNumber` | string | Number within the series (`Vol. 2`) | `PartNumber` |
| `description` | string | Short bibliographic note / blurb | `TextContent` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid - attach at least one field.

The distinctive title (ONIX `TitleType` `01` `TitleText`) is [`rig.meta.named`](../meta/named.md) `name`. Do not dual-author a `titleText` here.
