---
id: "rig.commerce.stock"
maturity: "draft"
summary: "How many of a product sit at a place. Format when present."
topJson: "{\"description\":\"Count of a product at a place. Not offer availability and not a warehouse engine.\"}"
fields:
  - name: "product"
    ref: "entity"
    required: true
    meaning: "The rig.commerce.product"
  - name: "place"
    ref: "entity"
    required: true
    meaning: "Place that holds it"
  - name: "quantity"
    ref: "float"
    required: true
    meaning: "Count on hand"
  - name: "unit"
    type: "string"
    enum: ["each","kilogram","metre","litre","other"]
    meaning: "Optional. each / kilogram / metre / litre / other; absent = each"
    absent: "each"
---
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
