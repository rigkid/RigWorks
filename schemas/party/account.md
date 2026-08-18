# `rig.party.account`

Payment account of a person or organisation. Format when present.

Field meanings follow the ISO 20022 `CashAccount` and `FinancialInstitutionIdentification` types used inside financial MX messages. This schema is those account elements — not an MX message (`pain.*`, `pacs.*`, `camt.*`) and not a payment.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `iban` | string | International bank account number | `IBAN` (ISO 13616) |
| `accountNumber` | string | Domestic / other account id | `Othr` / `Id` |
| `accountName` | string | Name as held by the institution | `CashAccount` / `Nm` |
| `currency` | string | ISO 4217 alpha-3, uppercase | `Ccy` |
| `bic` | string | 8- or 11-character BIC | `BICFI` (ISO 9362) |
| `bankName` | string | Institution name | `FinInstnId` / `Nm` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

Prefer `iban` when the source has one. `accountNumber` is the non-IBAN identifier. Do not dual-author a BBAN you derived from an IBAN.

Compose onto the party that owns the account — a person or an organisation. Account-holder display name stays on [`rig.meta.named`](../meta/named.md) of that party; `accountName` is only the string the bank printed. Institution postal address is [`rig.place.address`](../place/address.md) on a bank entity, not a second address blob here.

A second account is another entity. Do not invent an accounts array here.
