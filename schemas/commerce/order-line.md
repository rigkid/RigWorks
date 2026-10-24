---
id: "rig.commerce.order_line"
maturity: "draft"
summary: "One line of an order. Format when present."
topJson: "{\"description\":\"One line of an order. Price composes rig.commerce.price. Do not copy sku off the offer.\"}"
fields:
  - name: "order"
    ref: "entity"
    required: true
    meaning: "The rig.commerce.order"
  - name: "product"
    ref: "entity"
    required: true
    meaning: "The rig.commerce.product"
  - name: "quantity"
    ref: "float"
    required: true
    meaning: "Count ordered"
  - name: "offer"
    ref: "entity"
    meaning: "Optional. The rig.commerce.offer this line took"
---
# `rig.commerce.order_line`

One line of an order. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | entity | The [`rig.commerce.order`](order.md) |
| `product` | entity | The [`rig.commerce.product`](product.md) |
| `quantity` | float | Count ordered |
| `offer` | entity | Optional. The [`rig.commerce.offer`](offer.md) this line took |

`order`, `product`, and `quantity` are required.

The line price is [`rig.commerce.price`](price.md) on this entity. Do not copy `sku` off the offer. A second line is another entity.
