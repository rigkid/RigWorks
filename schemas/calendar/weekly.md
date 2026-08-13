# `rig.calendar.weekly`

Weekly opening hours. Format when present.

Times are wall-clock minutes since local midnight in the document's `timeZone` (see [`rig.document`](../document.md)). Do not encode iCalendar `RRULE` strings.

| Field | Type | Meaning |
|-------|------|---------|
| `days` | bool[7] | Active weekdays; index 0 = Sunday … 6 = Saturday |
| `startMinutes` | int | Window start, 0–1439 |
| `endMinutes` | int | Window end, 0–1439. When `endMinutes` ≤ `startMinutes`, the window crosses midnight. |

What the window enables is not this schema — compose or reference [`rig.install.av_bus`](../install/av-bus.md), or point a [`rig.install.trigger`](../install/trigger.md) gate at this entity.
