# `rig.plant.taxon`

Botanical taxon of a plant (or alga / fungus named under the same code). Format when present.

Field meanings follow [Darwin Core](https://dwc.tdwg.org/list/) `Taxon` and the [International Code of Nomenclature for algae, fungi, and plants](https://www.iapt-taxon.org/nomen/main.php) (ICN / ICNafp). This schema is those name parts — not a Darwin Core archive, not a nursery catalog row, and not a display label.

| Field | Type | Meaning | Darwin Core |
|-------|------|---------|-------------|
| `kingdom` | string | Kingdom | `kingdom` |
| `phylum` | string | Phylum / division | `phylum` |
| `class` | string | Class | `class` |
| `order` | string | Order | `order` |
| `family` | string | Family | `family` |
| `genus` | string | Genus | `genus` |
| `specificEpithet` | string | Species epithet | `specificEpithet` |
| `infraspecificEpithet` | string | Subspecies / variety / form epithet | `infraspecificEpithet` |
| `taxonRank` | string | Rank of the name (`species`, `variety`, …) | `taxonRank` |
| `scientificNameAuthorship` | string | Authorship (`L.`, `Mill.`) | `scientificNameAuthorship` |
| `vernacularName` | string | Common name | `vernacularName` |
| `nomenclaturalCode` | enum | `icn` / `icncp` / `iczn` / `icnp` / `biocode` | `nomenclaturalCode` |
| `taxonomicStatus` | string | `accepted`, `synonym`, … | `taxonomicStatus` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

The formatted scientific name is [`rig.meta.named`](../meta/named.md) `name`. Unstructured Darwin Core `scientificName` stays in the database. The importer maps it into `named` and these parts. Do not dual-author a `scientificName` here.

A cultivar, Group, or grex is [`rig.plant.cultivar`](cultivar.md). Growth form is [`rig.plant.habit`](habit.md). This individual / record is [`rig.plant.occurrence`](occurrence.md). A site pin is [`rig.place.geo`](../place/geo.md). Do not re-declare those here.
