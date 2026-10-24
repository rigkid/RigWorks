---
id: "rig.commerce.shipment"
maturity: "draft"
summary: "A box on its way. Format when present."
topJson: "{\"description\":\"A box on its way. Field meanings follow schema.org ParcelDelivery. Address stays on origin / destination places.\"}"
fields:
  - name: "status"
    type: "string"
    enum: ["pending","in-transit","delivered","returned","cancelled"]
    required: true
    meaning: "pending / in-transit / delivered / returned / cancelled"
  - name: "order"
    ref: "entity"
    meaning: "Optional. The rig.commerce.order this ships"
  - name: "carrier"
    ref: "entity"
    meaning: "Optional. Organisation that carries it"
  - name: "tracking"
    ref: "string"
    meaning: "Optional. Tracking number as issued"
  - name: "origin"
    ref: "entity"
    meaning: "Optional. Place it left"
  - name: "destination"
    ref: "entity"
    meaning: "Optional. Place it is going"
  - name: "shippedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day it left, YYYY-MM-DD"
---
# `rig.commerce.shipment`

A box on its way. Format when present.

Field meanings follow [schema.org](https://schema.org/ParcelDelivery) `ParcelDelivery`. This schema is the consignment - not a carrier API, and not warehouse pick.

| Field | Type | Meaning |
|-------|------|---------|
| `status` | enum | `pending` / `in-transit` / `delivered` / `returned` / `cancelled` |
| `order` | entity | Optional. The [`rig.commerce.order`](order.md) this ships |
| `carrier` | entity | Optional. Organisation that carries it |
| `tracking` | string | Optional. Tracking number as issued |
| `origin` | entity | Optional. Place it left |
| `destination` | entity | Optional. Place it is going |
| `shippedDate` | string | Optional. Day it left, `YYYY-MM-DD` |

`status` is required.

Address and geo stay on the place entities. Lines are [`rig.commerce.shipment_line`](shipment-line.md) entities that point at this shipment. Do not put a lines array here. A second box is another entity.
