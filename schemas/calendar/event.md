# `rig.calendar.event`

One timed happening. Format when present.

Times are wall-clock minutes since local midnight in the document's `timeZone` (see [`rig.document`](../document.md)). Dates are local calendar days. Do not encode iCalendar `DTSTART` strings with offsets — the envelope time zone is the zone.

| Field | Type | Meaning |
|-------|------|---------|
| `startDate` | string | First day (`YYYY-MM-DD`) |
| `endDate` | string | Optional. Last day; absent = `startDate` |
| `startMinutes` | int | Optional. Start, 0–1439; absent with no `endMinutes` = all-day |
| `endMinutes` | int | Optional. End, 0–1439. When `endMinutes` ≤ `startMinutes` on the same day, the event crosses midnight |
| `status` | enum | Optional. `confirmed` / `tentative` / `cancelled`; absent = `confirmed` |
| `organizer` | entity | Optional. Person or organisation |

`startDate` is required.

The title is [`rig.meta.named`](../meta/named.md). A venue is [`rig.place.address`](../place/address.md) / [`rig.place.geo`](../place/geo.md) on this entity or on a place entity — do not put a location string here. A repeating series is [`rig.calendar.recurrence`](recurrence.md) on the same entity. People coming are [`rig.calendar.attendee`](attendee.md) entities.

A show *run* (open these days) is [`rig.calendar.span`](span.md), not this schema. Opening night is an event; the exhibition dates are a span. Do not copy the same range onto both.

This is not iCalendar `VEVENT` XML, not `VTODO`, and not a reminder engine.
