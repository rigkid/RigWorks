---
id: "rig.commerce.shipment_line"
maturity: "draft"
summary: "One line of a shipment. Format when present."
topJson: "{\"description\":\"One line of a shipment. Members point at the box.\"}"
fields:
  - name: "shipment"
    ref: "entity"
    required: true
    meaning: "The rig.commerce.shipment"
  - name: "product"
    ref: "entity"
    required: true
    meaning: "The rig.commerce.product"
  - name: "quantity"
    ref: "float"
    required: true
    meaning: "Count in this box"
  - name: "orderLine"
    ref: "entity"
    meaning: "Optional. The rig.commerce.order_line this ships"
---
# `rig.commerce.shipment_line`

One line of a shipment. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `shipment` | entity | The [`rig.commerce.shipment`](shipment.md) |
| `product` | entity | The [`rig.commerce.product`](product.md) |
| `quantity` | float | Count in this box |
| `orderLine` | entity | Optional. The [`rig.commerce.order_line`](order-line.md) this ships |

`shipment`, `product`, and `quantity` are required. A second line is another entity.
