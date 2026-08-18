# `rig.plant.occurrence`

This plant record or individual. Format when present.

Field meanings follow Darwin Core `Occurrence`. This schema is those record elements — not a Darwin Core archive and not the taxon.

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

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

The kind of plant is [`rig.plant.taxon`](taxon.md). Where it stands is [`rig.place.geo`](../place/geo.md) / [`rig.place.address`](../place/address.md). Do not put locality text here.

A second record is another entity. Do not invent an occurrences array here.
