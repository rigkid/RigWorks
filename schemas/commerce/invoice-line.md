---
id: "rig.commerce.invoice_line"
maturity: "draft"
summary: "One line of an invoice. Format when present."
topJson: "{\"description\":\"One line of an invoice. Price composes rig.commerce.price.\"}"
fields:
  - name: "invoice"
    ref: "entity"
    required: true
    meaning: "The rig.commerce.invoice"
  - name: "product"
    ref: "entity"
    meaning: "Optional. The rig.commerce.product"
  - name: "quantity"
    ref: "float"
    required: true
    meaning: "Count billed"
  - name: "orderLine"
    ref: "entity"
    meaning: "Optional. The rig.commerce.order_line this bills"
---
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
