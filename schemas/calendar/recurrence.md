# `rig.calendar.recurrence`

How an event repeats. Format when present.

Field meanings follow the *elements* of RFC 5545 `RRULE` (`FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`) — not an `RRULE` string. Do not encode `FREQ=WEEKLY;BYDAY=TU`.

| Field | Type | Meaning |
|-------|------|---------|
| `frequency` | enum | `daily` / `weekly` / `monthly` / `yearly` |
| `interval` | int | Optional. Every N periods; absent = 1 |
| `count` | int | Optional. How many occurrences; omit if the series uses `untilDate` |
| `untilDate` | string | Optional. Last day an occurrence may fall (`YYYY-MM-DD`) |
| `byWeekday` | bool[7] | Optional. Which weekdays fire; index 0 = Sunday … 6 = Saturday |

`frequency` is required. Prefer `count` *or* `untilDate`, not both.

Compose onto the same entity as [`rig.calendar.event`](event.md). The event's `startDate` / `startMinutes` are the first occurrence. Dark days of a series are [`rig.calendar.exception`](exception.md) entities, not `EXDATE` strings.

`BYMONTHDAY`, `BYSETPOS`, `WKST`, `RDATE`, and `RECURRENCE-ID` stay in the iCalendar source. A host that needs them keeps the `.ics` as fulfillment.
