# `rig.record.event`

A happening with no magnitude. Format when present.

Auth hits, page views, and status changes land here. A measurement with a value is [`rig.clinic.observation`](../clinic/observation.md) - do not attach this schema to one.

| Field | Type | Meaning |
|-------|------|---------|
| `subject` | entity | Who or what the happening is about |
| `code` | string | Event code as the source wrote it |
| `codeSystem` | string | Optional. Code system name (`iso20022`, `custom`) |

`subject` and `code` are required.

The clock is [`rig.calendar.event`](../calendar/event.md) on this entity. Title is [`rig.meta.named`](../meta/named.md). A file this happening belongs to is [`rig.record.concerns`](concerns.md).
