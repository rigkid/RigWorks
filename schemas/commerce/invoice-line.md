# `rig.commerce.invoice_line`

One line of an invoice. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `invoice` | entity | The [`rig.commerce.invoice`](invoice.md) |
| `product` | entity | Optional. The [`rig.commerce.product`](product.md) |
| `quantity` | float | Count billed |
| `orderLine` | entity | Optional. The [`rig.commerce.order_line`](order-line.md) this bills |

`invoice` and `quantity` are required.

The line amount is [`rig.commerce.price`](price.md) on this entity. A second line is another entity.
