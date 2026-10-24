---
id: "rig.bim.site"
maturity: "draft"
summary: "Site / plot marker (IfcSite). Format when present."
fields:
  - name: "latitudeDegrees"
    ref: "float"
    meaning: "Optional. Decimal degrees north; absent = unset"
    absent: "unset"
  - name: "longitudeDegrees"
    ref: "float"
    meaning: "Optional. Decimal degrees east; absent = unset"
    absent: "unset"
  - name: "elevation"
    ref: "float"
    meaning: "Optional. Site elevation in document units; absent = unset"
    absent: "unset"
---
# `rig.bim.site`

Site / plot marker (`IfcSite`). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `latitudeDegrees` | float | Optional. Decimal degrees north; absent = unset |
| `longitudeDegrees` | float | Optional. Decimal degrees east; absent = unset |
| `elevation` | float | Optional. Site elevation in document units; absent = unset |

Compose [`rig.spatial.group`](../spatial/group.md) when children nest under this site. Do not emit IFC’s DMS latitude/longitude triples - convert to decimal degrees at the host boundary.
