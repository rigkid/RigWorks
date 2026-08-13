# `rig.calendar.exception`

Single-day exception inside a show span. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `date` | string | Local calendar day (`YYYY-MM-DD`) in the document's `timeZone` |
| `skip` | bool | Optional. When true (or absent), this day is dark; when false, force open despite weekly hours |

Compose onto the same entity as [`rig.calendar.span`](span.md), or one exception entity per date when many holidays exist.
