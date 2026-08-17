# `rig.bim.site`

Site / plot marker (`IfcSite`). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `latitudeDegrees` | float | Optional. Decimal degrees north; absent = unset |
| `longitudeDegrees` | float | Optional. Decimal degrees east; absent = unset |
| `elevation` | float | Optional. Site elevation in document units; absent = unset |

Compose [`rig.spatial.group`](../spatial/group.md) when children nest under this site. Do not emit IFC’s DMS latitude/longitude triples — convert to decimal degrees at the host boundary.
