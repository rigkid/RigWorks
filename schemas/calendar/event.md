---
id: "rig.calendar.event"
maturity: "draft"
summary: "One timed happening. Format when present."
fields:
  - name: "startDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    required: true
    meaning: "First day (YYYY-MM-DD)"
  - name: "endDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Last day; absent = startDate"
    absent: "startDate"
  - name: "startMinutes"
    type: "integer"
    minimum: 0
    maximum: 1439
    meaning: "Optional. Start, 0-1439; absent with no endMinutes = all-day"
    absent: "with no endMinutes = all-day"
  - name: "startSecond"
    type: "integer"
    minimum: 0
    maximum: 59
    meaning: "Optional. Second within startMinutes, 0-59; absent = unknown within the minute"
    absent: "unknown within the minute"
  - name: "endMinutes"
    type: "integer"
    minimum: 0
    maximum: 1439
    meaning: "Optional. End, 0-1439. When endMinutes ≤ startMinutes on the same day, the event crosses midnight"
  - name: "status"
    type: "string"
    enum: ["confirmed","tentative","cancelled"]
    meaning: "Optional. confirmed / tentative / cancelled; absent = confirmed"
    absent: "confirmed"
  - name: "organizer"
    ref: "entity"
    meaning: "Optional. Person or organisation"
---
# `rig.calendar.event`

One timed happening. Format when present.

Times are wall-clock minutes since local midnight in the document's `timeZone` (see [`rig.document`](../document.md)). Dates are local calendar days. Do not encode iCalendar `DTSTART` strings with offsets - the envelope time zone is the zone.

| Field | Type | Meaning |
|-------|------|---------|
| `startDate` | string | First day (`YYYY-MM-DD`) |
| `endDate` | string | Optional. Last day; absent = `startDate` |
| `startMinutes` | int | Optional. Start, 0-1439; absent with no `endMinutes` = all-day |
| `startSecond` | int | Optional. Second within `startMinutes`, 0-59; absent = unknown within the minute |
| `endMinutes` | int | Optional. End, 0-1439. When `endMinutes` ≤ `startMinutes` on the same day, the event crosses midnight |
| `status` | enum | Optional. `confirmed` / `tentative` / `cancelled`; absent = `confirmed` |
| `organizer` | entity | Optional. Person or organisation |

`startDate` is required. `startSecond` orders happenings that share a minute; omit it when the source has no second.

The title is [`rig.meta.named`](../meta/named.md). A venue is [`rig.place.address`](../place/address.md) / [`rig.place.geo`](../place/geo.md) on this entity or on a place entity - do not put a location string here. A repeating series is [`rig.calendar.recurrence`](recurrence.md) on the same entity. People coming are [`rig.calendar.attendee`](attendee.md) entities.

A show *run* (open these days) is [`rig.calendar.span`](span.md), not this schema. Opening night is an event; the exhibition dates are a span. Do not copy the same range onto both.

This is not iCalendar `VEVENT` XML, not `VTODO`, and not a reminder engine.
