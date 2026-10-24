---
id: "rig.bim.comment"
maturity: "draft"
summary: "BCF comment on a topic. Format when present."
fields:
  - name: "topic"
    ref: "entity"
    required: true
    meaning: "Parent rig.bim.topic"
  - name: "body"
    ref: "string"
    required: true
    meaning: "Comment text"
  - name: "author"
    ref: "string"
    meaning: "Optional. Author; absent = unset"
    absent: "unset"
  - name: "createdAt"
    ref: "string"
    meaning: "Optional. Creation time (ISO-8601); absent = unset"
    absent: "unset"
  - name: "viewpoint"
    ref: "entity"
    meaning: "Optional. Linked rig.bim.viewpoint; absent = none"
    absent: "none"
---
# `rig.bim.comment`

BCF comment on a topic. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `topic` | entity | Parent [`rig.bim.topic`](topic.md) |
| `body` | string | Comment text |
| `author` | string | Optional. Author; absent = unset |
| `createdAt` | string | Optional. Creation time (ISO-8601); absent = unset |
| `viewpoint` | entity | Optional. Linked [`rig.bim.viewpoint`](viewpoint.md); absent = none |
