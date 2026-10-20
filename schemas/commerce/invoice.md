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
