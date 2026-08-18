# `rig.commerce.discount`

Adjustment on an offer. Format when present.

Field meanings follow [schema.org](https://schema.org/Offer) discount / `PriceSpecification` reduction. This schema is the adjustment — not the resulting price and not a promotions engine.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `percent` or `amount` |
| `percent` | float | Optional. 0–100; `10` means 10%. Use when `kind` is `percent` |
| `amount` | float | Optional. Money off, major-currency. Use when `kind` is `amount` |
| `currency` | string | Optional. ISO 4217 of `amount`; omit on a percent discount |
| `code` | string | Optional. Promo / voucher code as printed |

`kind` is required. Do not fill both `percent` and `amount`. Do not write the sale price here — compose [`rig.commerce.price`](price.md) for the list amount and let a host apply this adjustment.

Compose onto the [`rig.commerce.offer`](offer.md) entity. A second discount is another offer entity.
