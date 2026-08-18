# `rig.calendar.exception`

Single-day exception inside a span. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `date` | string | Local calendar day (`YYYY-MM-DD`) in the document's `timeZone` |
| `skip` | bool | Optional. When true (or absent), this day is dark; when false, force open |
| `startMinutes` | int | Optional. Special hours start, 0–1439. Only when `skip` is false |
| `endMinutes` | int | Optional. Special hours end, 0–1439. Only when `skip` is false |

Compose onto the same entity as [`rig.calendar.span`](span.md), or one exception entity per date when many holidays exist.

Christmas Eve open 10:00–14:00 is `skip` false plus minutes. A dark holiday is `skip` true (or omitted) and no minutes. Times on a skipped day have no meaning — omit them.
