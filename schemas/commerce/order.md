# `rig.commerce.order`

A sale between a buyer and a seller. Format when present.

Field meanings follow [schema.org](https://schema.org/Order) `Order`. This schema is the order header - not a cart, not a payment, and not the line items.

| Field | Type | Meaning |
|-------|------|---------|
| `buyer` | entity | Person or organisation that buys |
| `seller` | entity | Person or organisation that sells |
| `status` | enum | `draft` / `placed` / `paid` / `fulfilled` / `cancelled` |
| `identifier` | string | Optional. Order number as issued |

`buyer`, `seller`, and `status` are required.

Lines are [`rig.commerce.order_line`](order-line.md) entities that point at this order. Do not put a lines array here. The bill is a [`rig.commerce.invoice`](invoice.md). The box is a [`rig.commerce.shipment`](shipment.md). The payment that settled the bill sets [`rig.finance.payment`](../finance/payment.md) `invoice`.
