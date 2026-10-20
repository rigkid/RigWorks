# `rig.finance.position`

A holding of an instrument. Format when present.

Field meanings follow ISO 6166 ISIN and ISO 20022 `SecuritiesBalance`. This schema is those position elements - not a trade ticket, and not a live mark-to-market.

| Field | Type | Meaning | Standard |
|-------|------|---------|----------|
| `holder` | entity | Person or organisation that holds it | ISO 20022 `AcctOwnr` |
| `isin` | string | 12-character ISIN, no spaces | ISO 6166 |
| `quantity` | float | Signed count of the instrument | ISO 20022 `Bal` |
| `side` | enum | `long` / `short` | - |

`holder`, `isin`, `quantity`, and `side` are required. `isin` is uppercase. Do not invent a ticker field from the ISIN.

Authored book value is [`rig.commerce.price`](../commerce/price.md) on this entity. A live mark is host cache. A second instrument is another entity.
