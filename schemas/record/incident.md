---
id: "rig.record.incident"
maturity: "draft"
summary: "A reported happening in the world. Format when present."
topJson: "{\"description\":\"A reported happening in the world. Address and geo stay on place. Members point here with rig.record.concerns.\"}"
fields:
  - name: "kind"
    ref: "string"
    required: true
    meaning: "Kind as written (fire, flood)"
  - name: "status"
    type: "string"
    enum: ["reported","active","contained","closed"]
    required: true
    meaning: "reported / active / contained / closed"
  - name: "openedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day reported, YYYY-MM-DD"
  - name: "place"
    ref: "entity"
    meaning: "Optional. Place entity. Address and geo stay on that entity"
---
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
