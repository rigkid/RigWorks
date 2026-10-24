---
id: "rig.commerce.invoice"
maturity: "draft"
summary: "A bill for a sale. Format when present."
topJson: "{\"description\":\"A bill for a sale. Field meanings follow schema.org Invoice. Total composes rig.commerce.price. Lines are rig.commerce.invoice_line.\"}"
fields:
  - name: "buyer"
    ref: "entity"
    required: true
    meaning: "Person or organisation billed"
  - name: "seller"
    ref: "entity"
    required: true
    meaning: "Person or organisation that bills"
  - name: "status"
    type: "string"
    enum: ["draft","issued","paid","void","credited"]
    required: true
    meaning: "draft / issued / paid / void / credited"
  - name: "identifier"
    ref: "string"
    meaning: "Optional. Invoice number as issued"
  - name: "issuedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day issued, YYYY-MM-DD"
  - name: "dueDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day payment is due, YYYY-MM-DD"
  - name: "order"
    ref: "entity"
    meaning: "Optional. The rig.commerce.order this bills"
---
# `rig.commerce.invoice`

A bill for a sale. Format when present.

Field meanings follow [schema.org](https://schema.org/Invoice) `Invoice`. This schema is the bill - not a tax engine, not a reminder, and not the payment.

| Field | Type | Meaning |
|-------|------|---------|
| `buyer` | entity | Person or organisation billed |
| `seller` | entity | Person or organisation that bills |
| `status` | enum | `draft` / `issued` / `paid` / `void` / `credited` |
| `identifier` | string | Optional. Invoice number as issued |
| `issuedDate` | string | Optional. Day issued, `YYYY-MM-DD` |
| `dueDate` | string | Optional. Day payment is due, `YYYY-MM-DD` |
| `order` | entity | Optional. The [`rig.commerce.order`](order.md) this bills |

`buyer`, `seller`, and `status` are required.

The total is [`rig.commerce.price`](price.md) on this entity. Lines are [`rig.commerce.invoice_line`](invoice-line.md) entities that point at this invoice. Do not put a lines array here. Do not derive `overdue` - that is a host reading of `dueDate`.

The payment that settles it sets [`rig.finance.payment`](../finance/payment.md) `invoice`.
