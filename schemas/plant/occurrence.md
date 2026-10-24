---
id: "rig.plant.occurrence"
maturity: "draft"
summary: "This plant record or individual. Format when present."
topJson: "{\"description\":\"This plant record / individual. Field meanings follow Darwin Core Occurrence. Site is rig.place.geo.\",\"minProperties\":1}"
fields:
  - name: "catalogNumber"
    ref: "string"
    meaning: "Collection / accession number"
  - name: "recordedBy"
    ref: "string"
    meaning: "Who recorded it"
  - name: "identifiedBy"
    ref: "string"
    meaning: "Who identified it"
  - name: "eventDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Record or planting day, YYYY-MM-DD"
  - name: "establishmentMeans"
    type: "string"
    enum: ["native","introduced","cultivated","naturalised","invasive","uncertain"]
    meaning: "native / introduced / cultivated / naturalised / invasive / uncertain"
  - name: "vitality"
    type: "string"
    enum: ["alive","dead","uncertain"]
    meaning: "alive / dead / uncertain"
  - name: "organismQuantity"
    ref: "string"
    meaning: "Count or cover as the source wrote it"
  - name: "organismQuantityType"
    ref: "string"
    meaning: "What the quantity is (individuals, % cover)"
---
# `rig.plant.occurrence`

This plant record or individual. Format when present.

Field meanings follow Darwin Core `Occurrence`. This schema is those record elements - not a Darwin Core archive and not the taxon.

| Field | Type | Meaning | Darwin Core |
|-------|------|---------|-------------|
| `catalogNumber` | string | Collection / accession number | `catalogNumber` |
| `recordedBy` | string | Who recorded it | `recordedBy` |
| `identifiedBy` | string | Who identified it | `identifiedBy` |
| `eventDate` | string | Record or planting day, `YYYY-MM-DD` | `eventDate` (ISO 8601 date) |
| `establishmentMeans` | enum | `native` / `introduced` / `cultivated` / `naturalised` / `invasive` / `uncertain` | `establishmentMeans` |
| `vitality` | enum | `alive` / `dead` / `uncertain` | `vitality` |
| `organismQuantity` | string | Count or cover as the source wrote it | `organismQuantity` |
| `organismQuantityType` | string | What the quantity is (`individuals`, `% cover`) | `organismQuantityType` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid - attach at least one field.

The kind of plant is [`rig.plant.taxon`](taxon.md). Where it stands is [`rig.place.geo`](../place/geo.md) / [`rig.place.address`](../place/address.md). Do not put locality text here.

A second record is another entity. Do not invent an occurrences array here.
