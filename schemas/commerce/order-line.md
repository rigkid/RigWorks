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
