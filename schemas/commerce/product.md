# `rig.commerce.product`

A sellable item. Format when present.

Field meanings follow [GS1](https://www.gs1.org/) GTIN and [schema.org](https://schema.org/Product) `Product`. This schema is the item - not an offer, not stock, and not a checkout.

| Field | Type | Meaning |
|-------|------|---------|
| `gtin` | string | Optional. GTIN digits only (8, 12, 13, or 14) |
| `brand` | entity | Optional. Organisation that brands it |
| `parent` | entity | Optional. Product this variant belongs to |

All fields optional. A product with only a name is still a product - the name is [`rig.meta.named`](../meta/named.md). An empty component is valid: presence means this entity is a product.

A variant sets `parent`. Do not invent a second product id. The importer strips GTIN hyphens and spaces. Do not store a GTIN-13 that is an ISBN under a second key - that ISBN stays on [`rig.book.identifier`](../book/identifier.md).

An offer of this product is [`rig.commerce.offer`](offer.md) `item`. Stock at a place is [`rig.commerce.stock`](stock.md).
