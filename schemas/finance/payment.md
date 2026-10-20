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
