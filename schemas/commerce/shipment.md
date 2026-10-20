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
