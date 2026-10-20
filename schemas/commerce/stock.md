# `rig.commerce.stock`

How many of a product sit at a place. Format when present.

This schema is the count - not [`rig.commerce.offer`](offer.md) `availability`, and not a warehouse management system.

| Field | Type | Meaning |
|-------|------|---------|
| `product` | entity | The [`rig.commerce.product`](product.md) |
| `place` | entity | Place that holds it |
| `quantity` | float | Count on hand |
| `unit` | enum | Optional. `each` / `kilogram` / `metre` / `litre` / `other`; absent = `each` |

`product`, `place`, and `quantity` are required. Address and geo stay on the place entity. A second place is another entity. Do not copy `in-stock` onto the offer from this count.
