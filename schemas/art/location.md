# `rig.art.location`

Current repository of a work. Format when present.

Field meanings follow CDWA Current Location and Object ID.

| Field | Type | Meaning | CDWA |
|-------|------|---------|------|
| `repository` | entity | Holding organisation | Current Location — Repository |
| `accessionNumber` | string | Accession / object number | Current Location — Repository Number |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Name the repository with [`rig.meta.named`](../meta/named.md). Its site is [`rig.place.address`](../place/address.md) / [`rig.place.geo`](../place/geo.md). Do not put a repository name string here.
