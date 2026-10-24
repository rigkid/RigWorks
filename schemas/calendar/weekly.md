---
id: "rig.calendar.weekly"
maturity: "draft"
summary: "Weekly opening hours. Format when present."
fields:
  - name: "days"
    type: "array"
    minItems: 7
    maxItems: 7
    itemsType: "boolean"
    required: true
    meaning: "Active weekdays; index 0 = Sunday ... 6 = Saturday"
  - name: "startMinutes"
    type: "integer"
    minimum: 0
    maximum: 1439
    required: true
    meaning: "Window start, 0-1439"
  - name: "endMinutes"
    type: "integer"
    minimum: 0
    maximum: 1439
    required: true
    meaning: "Window end, 0-1439. When endMinutes ≤ startMinutes, the window crosses midnight."
---
# `rig.calendar.weekly`

Weekly opening hours. Format when present.

Times are wall-clock minutes since local midnight in the document's `timeZone` (see [`rig.document`](../document.md)). Do not encode iCalendar `RRULE` strings.

| Field | Type | Meaning |
|-------|------|---------|
| `days` | bool[7] | Active weekdays; index 0 = Sunday ... 6 = Saturday |
| `startMinutes` | int | Window start, 0-1439 |
| `endMinutes` | int | Window end, 0-1439. When `endMinutes` ≤ `startMinutes`, the window crosses midnight. |

What the window enables is not this schema - compose or mute a [`rig.audio.bus`](../audio/bus.md), or point a [`rig.mod.trigger`](../mod/trigger.md) gate at this entity.

A second daily window (lunch close, then evening) is another entity with its own `weekly`. Do not invent a windows array here.

A repeating *event* (Tuesday talk at 14:00) is [`rig.calendar.event`](event.md) + [`rig.calendar.recurrence`](recurrence.md), not a second meaning of this schema.
