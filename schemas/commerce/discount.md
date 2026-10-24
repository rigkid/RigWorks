---
id: "rig.commerce.discount"
maturity: "draft"
summary: "Adjustment on an offer. Format when present."
topJson: "{\"description\":\"Adjustment on an offer. percent is 0–100 (10 means 10%). amount is money off, not the resulting price. schema.org Discount / PriceSpecification.\"}"
fields:
  - name: "kind"
    type: "string"
    enum: ["percent","amount"]
    required: true
    meaning: "percent or amount"
  - name: "percent"
    type: "number"
    minimum: 0
    maximum: 100
    meaning: "Optional. 0-100; 10 means 10%. Use when kind is percent"
  - name: "amount"
    ref: "float"
    meaning: "Optional. Money off, major-currency. Use when kind is amount"
  - name: "currency"
    type: "string"
    pattern: "^[A-Z]{3}$"
    description: "ISO 4217 (ISO 20022 Ccy)."
    meaning: "Optional. ISO 4217 of amount; omit on a percent discount"
  - name: "code"
    ref: "string"
    meaning: "Optional. Promo / voucher code as printed"
---
# `rig.commerce.discount`

Adjustment on an offer. Format when present.

Field meanings follow [schema.org](https://schema.org/Offer) discount / `PriceSpecification` reduction. This schema is the adjustment - not the resulting price and not a promotions engine.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `percent` or `amount` |
| `percent` | float | Optional. 0-100; `10` means 10%. Use when `kind` is `percent` |
| `amount` | float | Optional. Money off, major-currency. Use when `kind` is `amount` |
| `currency` | string | Optional. ISO 4217 of `amount`; omit on a percent discount |
| `code` | string | Optional. Promo / voucher code as printed |

`kind` is required. Do not fill both `percent` and `amount`. Do not write the sale price here - compose [`rig.commerce.price`](price.md) for the list amount and let a host apply this adjustment.

Compose onto the [`rig.commerce.offer`](offer.md) entity. A second discount is another offer entity.
