# `rig.place.address`

Civic / postal address of a place. Format when present.

Field meanings follow [UPU S42](https://www.upu.int/) international postal address elements and the ISO 20022 `PostalAddress` type used inside financial MX messages. This schema is that shared element set — not an MX message (`pain.*`, `pacs.*`, `camt.*`), not a payment, and not scene pose.

| Field | Type | Meaning | ISO 20022 | S42 |
|-------|------|---------|-----------|-----|
| `streetName` | string | Thoroughfare name | `StrtNm` | thoroughfare |
| `buildingNumber` | string | Premise number (`12A`, not an int) | `BldgNb` | premise |
| `buildingName` | string | Premise name | `BldgNm` | premise |
| `floor` | string | Floor / level | `Flr` | premise |
| `room` | string | Unit / suite / room | `Room` | premise |
| `postBox` | string | Delivery-service box | `PstBx` | delivery service |
| `postCode` | string | Postal code | `PstCd` | postcode |
| `townName` | string | Town / city | `TwnNm` | locality |
| `townLocationName` | string | Suburb / locality qualifier | `TwnLctnNm` | locality |
| `districtName` | string | District | `DstrctNm` | locality |
| `countrySubDivision` | string | State / province | `CtrySubDvsn` | country subdivision |
| `country` | string | ISO 3166-1 alpha-2, uppercase | `Ctry` | country |
| `department` | string | Organisation unit at the place | `Dept` | — |
| `subDepartment` | string | Nested organisation unit | `SubDept` | — |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid — attach at least one field.

Name the place by composing [`rig.meta.named`](../meta/named.md). Nest site → building → floor → room with [`rig.spatial.relationship`](../spatial/relationship.md). Drawing pose is [`rig.spatial.transform`](../spatial/transform.md). A map pin is [`rig.place.geo`](geo.md). A person's postal address is this same schema composed onto the person entity — see [`rig.person.name`](../person/name.md). Do not re-declare those here.

Unstructured ISO 20022 `AdrLine` / free-text blobs stay in the database. The importer maps them into these fields. Do not dual-author structured fields and address lines.

Mail-only MX slots (`AdrTp`, `CareOf`, recipient / mailee) are not site data — leave them in the source system.
