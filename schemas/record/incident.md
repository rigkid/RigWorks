# `rig.record.incident`

A reported happening in the world. Format when present.

Fires, floods, and command incidents land here. A case file about a person is [`rig.record.case`](case.md). A calendar happening is [`rig.calendar.event`](../calendar/event.md).

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | string | Kind as written (`fire`, `flood`) |
| `status` | enum | `reported` / `active` / `contained` / `closed` |
| `openedDate` | string | Optional. Day reported, `YYYY-MM-DD` |
| `place` | entity | Optional. Place entity. Address and geo stay on that entity |

`kind` and `status` are required.

The title is [`rig.meta.named`](../meta/named.md). Members point at this incident with [`rig.record.concerns`](concerns.md). Do not put a members array here. Do not put a location string on this component.
