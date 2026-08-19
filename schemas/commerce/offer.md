# `rig.commerce.offer`

Someone offers an item. Format when present.

Field meanings follow [schema.org](https://schema.org/Offer) `Offer`. This schema is that commercial relationship — not a checkout, inventory system, or payment.

| Field | Type | Meaning |
|-------|------|---------|
| `item` | entity | What is offered |
| `seller` | entity | Optional. Person or organisation that offers it |
| `availability` | enum | Optional. `in-stock` / `out-of-stock` / `pre-order` / `limited` / `unknown` |
| `sku` | string | Optional. Seller's stock-keeping unit |

`item` is required. Name the seller on that entity with [`rig.meta.named`](../meta/named.md). Product identifiers stay on the item (`rig.book.identifier`, and so on) — do not copy an ISBN onto the offer.

Compose [`rig.commerce.price`](price.md) on this entity. A discount is [`rig.commerce.discount`](discount.md) on the same entity. The window the offer is good for is [`rig.calendar.span`](../calendar/span.md).

A second offer (another seller, another price, another window) is another entity.
