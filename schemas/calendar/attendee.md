# `rig.calendar.attendee`

A person invited to an event. Format when present.

Field meanings follow RFC 5545 `ATTENDEE` / `ROLE` / `PARTSTAT` — as fields, not a `mailto:` line.

| Field | Type | Meaning |
|-------|------|---------|
| `event` | entity | The [`rig.calendar.event`](event.md) |
| `person` | entity | The invitee |
| `role` | enum | Optional. `chair` / `required` / `optional` / `inform`; absent = `required` |
| `status` | enum | Optional. `needsAction` / `accepted` / `declined` / `tentative`; absent = `needsAction` |

`event` and `person` are required. Name the person on that entity. A second guest is another entity.

Do not put an email on this schema — compose [`rig.person.contact`](../person/contact.md) on the person. Organizer stays on the event.
