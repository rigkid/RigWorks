---
id: "rig.finance.payment"
maturity: "draft"
summary: "A movement of money between two parties. Format when present."
topJson: "{\"description\":\"A movement of money. Field meanings follow ISO 20022 payment identification. Not a pacs message.\"}"
fields:
  - name: "debtor"
    ref: "entity"
    required: true
    meaning: "Party that pays"
  - name: "creditor"
    ref: "entity"
    required: true
    meaning: "Party that receives"
  - name: "status"
    type: "string"
    enum: ["pending","booked","rejected","cancelled"]
    required: true
    meaning: "pending / booked / rejected / cancelled"
  - name: "debtorAccount"
    ref: "entity"
    meaning: "Optional. Debtor rig.party.account"
  - name: "creditorAccount"
    ref: "entity"
    meaning: "Optional. Creditor account"
  - name: "endToEndId"
    ref: "string"
    meaning: "Optional. End-to-end identification"
  - name: "bookedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Booking day, YYYY-MM-DD"
  - name: "invoice"
    ref: "entity"
    meaning: "Optional. The rig.commerce.invoice this settles"
---
# `rig.finance.payment`

A movement of money between two parties. Format when present.

Field meanings follow ISO 20022 `CreditTransferTransaction` / `PaymentIdentification` elements used inside financial MX messages. This schema is those payment elements - not a `pacs.*` / `pain.*` message, and not a settlement engine.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `debtor` | entity | Party that pays | `Dbtr` |
| `creditor` | entity | Party that receives | `Cdtr` |
| `status` | enum | `pending` / `booked` / `rejected` / `cancelled` | `TxSts` |
| `debtorAccount` | entity | Optional. Debtor [`rig.party.account`](../party/account.md) | `DbtrAcct` |
| `creditorAccount` | entity | Optional. Creditor account | `CdtrAcct` |
| `endToEndId` | string | Optional. End-to-end identification | `EndToEndId` |
| `bookedDate` | string | Optional. Booking day, `YYYY-MM-DD` | `BookgDt` |
| `invoice` | entity | Optional. The [`rig.commerce.invoice`](../commerce/invoice.md) this settles | - |

`debtor`, `creditor`, and `status` are required.

The amount is [`rig.commerce.price`](../commerce/price.md) on this entity. The clock of the happening is [`rig.calendar.event`](../calendar/event.md). A file this payment belongs to is [`rig.record.concerns`](../record/concerns.md). A second payment is another entity.
