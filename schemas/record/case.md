# `rig.record.case`

A file about a subject. Format when present.

One shape for an AML investigation and a citizen service request. This schema is the file - not a workflow, and not the payments or encounters that belong to it.

| Field | Type | Meaning |
|-------|------|---------|
| `subject` | entity | Person or organisation the file is about |
| `kind` | enum | `fraud` / `aml` / `service` / `benefits` / `other` |
| `status` | enum | `open` / `pending` / `closed` |
| `assignee` | entity | Optional. Person or organisation working the file |
| `openedDate` | string | Optional. Day opened, `YYYY-MM-DD` |
| `identifier` | string | Optional. Case number as issued |

`subject`, `kind`, and `status` are required.

The title is [`rig.meta.named`](../meta/named.md). Members point at this file with [`rig.record.concerns`](concerns.md). Do not put a members array here.
