# `rig.place.geo`

WGS84 geodetic pin. Format when present.

A map coordinate for a place — not a postal address and not scene pose. Compose beside [`rig.place.address`](address.md) when a site has both a civic identity and a pin. A plant standing here composes this with [`rig.plant.taxon`](../plant/taxon.md) / [`rig.plant.occurrence`](../plant/occurrence.md).

| Field | Type | Meaning |
|-------|------|---------|
| `latitudeDegrees` | float | Geodetic latitude, −90…90 |
| `longitudeDegrees` | float | Geodetic longitude, −180…180 |
| `altitudeMetres` | float | Optional. Ellipsoidal height in metres |

Datum is WGS84. Do not put projected site-plan metres here — those belong on [`rig.spatial.transform`](../spatial/transform.md) inside the drawing. Geocoding and CRS conversion are fulfillment.
