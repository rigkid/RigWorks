---
id: "rig.commerce.price"
maturity: "draft"
summary: "Money amount of a thing or an offer. Format when present."
topJson: "{\"description\":\"Money amount. Field meanings follow ISO 20022 ActiveOrHistoricCurrencyAndAmount and schema.org PriceSpecification. Not a formatted price string.\"}"
fields:
  - name: "amount"
    ref: "float"
    required: true
    meaning: "Major-currency value (12.99, not pence)"
  - name: "currency"
    type: "string"
    pattern: "^[A-Z]{3}$"
    description: "ISO 4217 (ISO 20022 Ccy)."
    required: true
    meaning: "ISO 4217 alpha-3, uppercase"
  - name: "unit"
    type: "string"
    enum: ["each","hour","day","week","month","year","metre","kilogram","other"]
    meaning: "Optional. each / hour / day / week / month / year / metre / kilogram / other; absent = each"
    absent: "each"
  - name: "vatIncluded"
    ref: "bool"
    meaning: "Optional. Whether amount includes VAT / sales tax; absent = unknown"
    absent: "unknown"
---
# `rig.commerce.price`

Money amount of a thing or an offer. Format when present.

Field meanings follow ISO 20022 `ActiveOrHistoricCurrencyAndAmount` and [schema.org](https://schema.org/PriceSpecification) `PriceSpecification`. This schema is those amount elements - not a formatted price string, a cart, or a tax engine.

| Field | Type | Meaning |
|-------|------|---------|
| `amount` | float | Major-currency value (`12.99`, not pence) |
| `currency` | string | ISO 4217 alpha-3, uppercase |
| `unit` | enum | Optional. `each` / `hour` / `day` / `week` / `month` / `year` / `metre` / `kilogram` / `other`; absent = `each` |
| `vatIncluded` | bool | Optional. Whether `amount` includes VAT / sales tax; absent = unknown |

`amount` and `currency` are required.

Do not store `"£12.99"`. Do not put a list price and a sale price on one component - a sale is another [`rig.commerce.offer`](offer.md) or a [`rig.commerce.discount`](discount.md) on the offer.

Compose onto the offer entity (or onto the item when the price is the item's list price with no seller). Validity of a sale window is [`rig.calendar.span`](../calendar/span.md), not dates here.
