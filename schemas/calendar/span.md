# `rig.calendar.span`

Dated show / exhibition run. Format when present.

Dates are local calendar days in the document's `timeZone` (see [`rig.document`](../document.md)).

| Field | Type | Meaning |
|-------|------|---------|
| `startDate` | string | Inclusive start day (`YYYY-MM-DD`) |
| `endDate` | string | Inclusive end day (`YYYY-MM-DD`) |

Compose with [`rig.calendar.weekly`](weekly.md) for opening hours inside the span, and [`rig.calendar.exception`](exception.md) for dark days. Hosts that only speak weekly hours may ignore this component but must preserve it on round trip.
