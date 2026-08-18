# `rig.art.creation`

Creation date and period of a work. Format when present.

Field meanings follow CDWA Creation (date, period) and VRA Core `date` / `stylePeriod`. The maker is not repeated here.

| Field | Type | Meaning | CDWA |
|-------|------|---------|------|
| `createdDate` | string | Creation date as the source wrote it (`1889`, `ca. 1888–1889`) | Creation — Date |
| `period` | string | Style / period / movement | Styles/Periods |
| `culture` | string | Culture or people | Culture |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Do not force ISO 8601 when the source is approximate. The maker is [`rig.art.attribution`](attribution.md).
