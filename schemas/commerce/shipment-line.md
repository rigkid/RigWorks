# `rig.commerce.shipment_line`

One line of a shipment. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `shipment` | entity | The [`rig.commerce.shipment`](shipment.md) |
| `product` | entity | The [`rig.commerce.product`](product.md) |
| `quantity` | float | Count in this box |
| `orderLine` | entity | Optional. The [`rig.commerce.order_line`](order-line.md) this ships |

`shipment`, `product`, and `quantity` are required. A second line is another entity.
