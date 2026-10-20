# `rig.record.assertion`

Who stated a fact, and when they observed it. Format when present.

This schema is the fact's own source - not the file's `document.author`, and not a query explain-plan.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | string | System that asserted it (`card-auth`, `epic`, `catalog`) |
| `asserter` | entity | Optional. Person or organisation that signed the fact |
| `observedDate` | string | Optional. Day observed, `YYYY-MM-DD` |
| `observedMinute` | int | Optional. Minute since local midnight, 0-1439 |
| `observedSecond` | int | Optional. Second within that minute, 0-59; absent = unknown within the minute |
| `confidence` | float | Optional. 0-1. Absent = unknown |

`source` is required. An empty component is invalid.

`observedMinute` and `observedSecond` use the document `timeZone`. They are this assertion's clock. The fact's own happening stays on [`rig.calendar.event`](../calendar/event.md) of that entity - do not copy one onto the other.
