---
id: "rig.calendar.exception"
maturity: "draft"
summary: "Single-day exception inside a span. Format when present."
fields:
  - name: "date"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    required: true
    meaning: "Local calendar day (YYYY-MM-DD) in the document's timeZone"
  - name: "skip"
    ref: "bool"
    meaning: "Optional. When true (or absent), this day is dark; when false, force open"
  - name: "startMinutes"
    type: "integer"
    minimum: 0
    maximum: 1439
    meaning: "Optional. Special hours start, 0-1439. Only when skip is false"
  - name: "endMinutes"
    type: "integer"
    minimum: 0
    maximum: 1439
    meaning: "Optional. Special hours end, 0-1439. Only when skip is false"
---
# `rig.calendar.exception`

Single-day exception inside a span. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `date` | string | Local calendar day (`YYYY-MM-DD`) in the document's `timeZone` |
| `skip` | bool | Optional. When true (or absent), this day is dark; when false, force open |
| `startMinutes` | int | Optional. Special hours start, 0-1439. Only when `skip` is false |
| `endMinutes` | int | Optional. Special hours end, 0-1439. Only when `skip` is false |

Compose onto the same entity as [`rig.calendar.span`](span.md), or one exception entity per date when many holidays exist.

Christmas Eve open 10:00-14:00 is `skip` false plus minutes. A dark holiday is `skip` true (or omitted) and no minutes. Times on a skipped day have no meaning - omit them.
