---
id: "rig.organisation.identity"
maturity: "draft"
summary: "Legal identifiers of an organisation. Format when present."
topJson: "{\"description\":\"Organisation legal identifiers. Field meanings follow ISO 20022 OrganisationIdentification. Name is rig.meta.named.\",\"minProperties\":1}"
fields:
  - name: "lei"
    type: "string"
    pattern: "^[A-Z0-9]{20}$"
    description: "ISO 17442 LEI (ISO 20022 LEI)."
    meaning: "20-character Legal Entity Identifier"
  - name: "bic"
    type: "string"
    pattern: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"
    description: "ISO 9362 BIC (ISO 20022 AnyBIC)."
    meaning: "8- or 11-character BIC"
  - name: "registrationNumber"
    ref: "string"
    meaning: "National / trade register id"
---
# `rig.organisation.identity`

Legal identifiers of an organisation. Format when present.

Field meanings follow the ISO 20022 `OrganisationIdentification` type used inside financial MX messages. This schema is those identifiers - not an MX message and not a display name.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `lei` | string | 20-character Legal Entity Identifier | `LEI` (ISO 17442) |
| `bic` | string | 8- or 11-character BIC | `AnyBIC` (ISO 9362) |
| `registrationNumber` | string | National / trade register id | `Othr` / `Id` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid - attach at least one field.

The organisation's name is [`rig.meta.named`](../meta/named.md). Its site is [`rig.place.address`](../place/address.md). A person employed there points here with [`rig.person.employment`](../person/employment.md) `organisation`. An operating account is [`rig.party.account`](../party/account.md) on this entity.
