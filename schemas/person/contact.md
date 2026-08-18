# `rig.person.contact`

Reach channels for a human, character, user, or contact. Format when present.

Field meanings follow the ISO 20022 `ContactDetails` type used inside financial MX messages. This schema is those telecom / mailbox elements — not a postal address, not employment, and not the person record itself.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `email` | string | Mailbox | `EmailAdr` |
| `phone` | string | Voice number | `PhneNb` |
| `mobile` | string | Mobile number | `MobNb` |
| `fax` | string | Fax number | `FaxNb` |
| `preferredMethod` | enum | `mail` / `email` / `phone` / `mobile` / `fax` | `PrefrdMtd` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

Prefer [E.164](https://www.itu.int/rec/T-REC-E.164) for `phone`, `mobile`, and `fax` when the source has it (`+61412345678`). National formats stay valid strings — do not invent a second field.

Postal / civic fields are [`rig.place.address`](../place/address.md). A map pin is [`rig.place.geo`](../place/geo.md). Job title, department, and organisation are [`rig.person.employment`](employment.md). Name the person with [`rig.meta.named`](../meta/named.md) plus [`rig.person.name`](name.md). Do not re-declare those here.
