---
id: "rig.calendar.recurrence"
maturity: "draft"
summary: "How an event repeats. Format when present."
fields:
  - name: "frequency"
    type: "string"
    enum: ["daily","weekly","monthly","yearly"]
    required: true
    meaning: "daily / weekly / monthly / yearly"
  - name: "interval"
    type: "integer"
    minimum: 1
    meaning: "Optional. Every N periods; absent = 1"
    absent: "1"
  - name: "count"
    type: "integer"
    minimum: 1
    meaning: "Optional. How many occurrences; omit if the series uses untilDate"
  - name: "untilDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Last day an occurrence may fall (YYYY-MM-DD)"
  - name: "byWeekday"
    type: "array"
    minItems: 7
    maxItems: 7
    itemsType: "boolean"
    meaning: "Optional. Which weekdays fire; index 0 = Sunday ... 6 = Saturday"
---
# `rig.calendar.recurrence`

How an event repeats. Format when present.

Field meanings follow the *elements* of RFC 5545 `RRULE` (`FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`) - not an `RRULE` string. Do not encode `FREQ=WEEKLY;BYDAY=TU`.

| Field | Type | Meaning |
|-------|------|---------|
| `frequency` | enum | `daily` / `weekly` / `monthly` / `yearly` |
| `interval` | int | Optional. Every N periods; absent = 1 |
| `count` | int | Optional. How many occurrences; omit if the series uses `untilDate` |
| `untilDate` | string | Optional. Last day an occurrence may fall (`YYYY-MM-DD`) |
| `byWeekday` | bool[7] | Optional. Which weekdays fire; index 0 = Sunday ... 6 = Saturday |

`frequency` is required. Prefer `count` *or* `untilDate`, not both.

Compose onto the same entity as [`rig.calendar.event`](event.md). The event's `startDate` / `startMinutes` are the first occurrence. Dark days of a series are [`rig.calendar.exception`](exception.md) entities, not `EXDATE` strings.

`BYMONTHDAY`, `BYSETPOS`, `WKST`, `RDATE`, and `RECURRENCE-ID` stay in the iCalendar source. A host that needs them keeps the `.ics` as fulfillment.
