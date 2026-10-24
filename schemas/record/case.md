---
id: "rig.record.case"
maturity: "draft"
summary: "A file about a subject. Format when present."
topJson: "{\"description\":\"A file about a subject. Members point at it with rig.record.concerns. Title is rig.meta.named.\"}"
fields:
  - name: "subject"
    ref: "entity"
    required: true
    meaning: "Person or organisation the file is about"
  - name: "kind"
    type: "string"
    enum: ["fraud","aml","service","benefits","other"]
    required: true
    meaning: "fraud / aml / service / benefits / other"
  - name: "status"
    type: "string"
    enum: ["open","pending","closed"]
    required: true
    meaning: "open / pending / closed"
  - name: "assignee"
    ref: "entity"
    meaning: "Optional. Person or organisation working the file"
  - name: "openedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day opened, YYYY-MM-DD"
  - name: "identifier"
    ref: "string"
    meaning: "Optional. Case number as issued"
---
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
