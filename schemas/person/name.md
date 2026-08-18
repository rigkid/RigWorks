# `rig.person.name`

Structured personal name of a human, character, user, or contact. Format when present.

Field meanings follow the ISO 20022 `PersonName` type used inside financial MX messages. This schema is that shared element set — not an MX message, not an organisation, and not a display label.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `givenName` | string | Given / first name | `GvnNm` |
| `middleName` | string | Middle name(s) | `MddlNm` |
| `familyName` | string | Family / last name | `LastNm` |
| `namePrefix` | string | Honorific / prefix (`Dr`, `Mx`) | `NmPrfx` |
| `nameSuffix` | string | Generational / suffix (`Jr`, `III`) | `NmSfx` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

The formatted / full name is [`rig.meta.named`](../meta/named.md) `name`. Unstructured ISO 20022 `Nm` stays in the database. The importer maps it into `named` and these parts. Do not dual-author a `fullName` here.

Postal address is [`rig.place.address`](../place/address.md). Reach channels are [`rig.person.contact`](contact.md). Sex, gender identity, and birth are [`rig.person.vital`](vital.md). Employment is [`rig.person.employment`](employment.md). A photo is [`rig.person.portrait`](portrait.md). A payment account is [`rig.party.account`](../party/account.md). Do not re-declare those here.
