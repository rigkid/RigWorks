# `rig.organisation.identity`

Legal identifiers of an organisation. Format when present.

Field meanings follow the ISO 20022 `OrganisationIdentification` type used inside financial MX messages. This schema is those identifiers — not an MX message and not a display name.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `lei` | string | 20-character Legal Entity Identifier | `LEI` (ISO 17442) |
| `bic` | string | 8- or 11-character BIC | `AnyBIC` (ISO 9362) |
| `registrationNumber` | string | National / trade register id | `Othr` / `Id` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

The organisation's name is [`rig.meta.named`](../meta/named.md). Its site is [`rig.place.address`](../place/address.md). A person employed there points here with [`rig.person.employment`](../person/employment.md) `organisation`. An operating account is [`rig.party.account`](../party/account.md) on this entity.
