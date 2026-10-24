---
id: "rig.record.assertion"
maturity: "draft"
summary: "Who stated a fact, and when they observed it. Format when present."
topJson: "{\"description\":\"Who stated a fact and when they observed it. Not document.author and not a query explain-plan.\"}"
fields:
  - name: "source"
    ref: "string"
    required: true
    meaning: "System that asserted it (card-auth, epic, catalog)"
  - name: "asserter"
    ref: "entity"
    meaning: "Optional. Person or organisation that signed the fact"
  - name: "observedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day observed, YYYY-MM-DD"
  - name: "observedMinute"
    type: "integer"
    minimum: 0
    maximum: 1439
    meaning: "Optional. Minute since local midnight, 0-1439"
  - name: "observedSecond"
    type: "integer"
    minimum: 0
    maximum: 59
    meaning: "Optional. Second within that minute, 0-59; absent = unknown within the minute"
    absent: "unknown within the minute"
  - name: "confidence"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1. Absent = unknown"
    absent: "unknown"
---
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
