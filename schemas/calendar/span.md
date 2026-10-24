---
id: "rig.calendar.span"
maturity: "draft"
summary: "Dated run - show, offer window, or agreement term. Format when present."
fields:
  - name: "startDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    required: true
    meaning: "Inclusive start day (YYYY-MM-DD)"
  - name: "endDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    required: true
    meaning: "Inclusive end day (YYYY-MM-DD)"
---
# `rig.calendar.span`

Dated run - show, offer window, or agreement term. Format when present.

Dates are local calendar days in the document's `timeZone` (see [`rig.document`](../document.md)).

| Field | Type | Meaning |
|-------|------|---------|
| `startDate` | string | Inclusive start day (`YYYY-MM-DD`) |
| `endDate` | string | Inclusive end day (`YYYY-MM-DD`) |

Compose with [`rig.calendar.weekly`](weekly.md) for opening hours inside the span, and [`rig.calendar.exception`](exception.md) for dark or special-hour days. Hosts that only speak weekly hours may ignore this component but must preserve it on round trip.

An offer's validity and an agreement's term reuse this schema. A timed happening on one day is [`rig.calendar.event`](event.md) - do not copy that day's clock onto the span.
