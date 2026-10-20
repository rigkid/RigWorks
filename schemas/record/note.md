# `rig.record.note`

A note about a fact. Format when present.

This schema is ordinary prose that hangs on a case, an order, an encounter, or any other entity - not a BCF comment ([`rig.bim.comment`](../bim/comment.md)), not editorial copy ([`rig.story.flow`](../story/flow.md)), and not a mailbox ([`rig.person.contact`](../person/contact.md)).

| Field | Type | Meaning |
|-------|------|---------|
| `subject` | entity | What the note is about |
| `body` | string | The note |
| `author` | entity | Optional. Person or organisation that wrote it |

`subject` and `body` are required.

The clock is [`rig.calendar.event`](../calendar/event.md) on this entity. A title is [`rig.meta.named`](../meta/named.md). A second note is another entity. Do not invent a notes array on the subject.
