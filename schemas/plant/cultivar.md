# `rig.plant.cultivar`

Cultivated-plant name. Format when present.

Field meanings follow the [International Code of Nomenclature for Cultivated Plants](https://www.ishs.org/scripta-horticulturae/international-code-nomenclature-cultivated-plants) (ICNCP) and Darwin Core `cultivarEpithet`. This schema is those cultivated categories — not a trade mark register and not the botanical taxon.

| Field | Type | Meaning | Standard |
|-------|------|---------|----------|
| `cultivarEpithet` | string | Cultivar epithet, without quotes | ICNCP cultivar; Darwin Core `cultivarEpithet` |
| `cultivarGroup` | string | Cultivar Group epithet, without the word Group | ICNCP Group |
| `grex` | string | Grex epithet (orchids) | ICNCP grex |
| `tradeDesignation` | string | Selling / marketing name | ICNCP trade designation |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

Do not wrap `cultivarEpithet` in single quotes. The formatted name (`Rosa` Iceberg `'KORbin'`) is [`rig.meta.named`](../meta/named.md). `tradeDesignation` is not the cultivar — do not copy one into the other.

The species (or genus) the cultigen belongs to is [`rig.plant.taxon`](taxon.md). Set `taxon.taxonRank` to `cultivar`, `cultivar group`, or `grex` when that is the rank of the name.
