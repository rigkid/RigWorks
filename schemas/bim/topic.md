---
id: "rig.bim.topic"
maturity: "draft"
summary: "BCF issue / topic. Format when present."
fields:
  - name: "topicType"
    ref: "string"
    meaning: "Optional. Topic type (Clash, Issue, ...); absent = unset"
    absent: "unset"
  - name: "topicStatus"
    ref: "string"
    meaning: "Optional. Status (Open, Closed, ...); absent = unset"
    absent: "unset"
  - name: "priority"
    ref: "string"
    meaning: "Optional. Priority label; absent = unset"
    absent: "unset"
  - name: "assignedTo"
    ref: "string"
    meaning: "Optional. Assignee; absent = unset"
    absent: "unset"
  - name: "labels"
    type: "array"
    itemsRef: "string"
    meaning: "Optional. Labels; order carries no meaning"
  - name: "stage"
    ref: "string"
    meaning: "Optional. Project stage; absent = unset"
    absent: "unset"
  - name: "description"
    ref: "string"
    meaning: "Optional. Body text; absent = empty"
    absent: "empty"
  - name: "dueAt"
    ref: "string"
    meaning: "Optional. Due date/time (ISO-8601); absent = unset"
    absent: "unset"
  - name: "createdBy"
    ref: "string"
    meaning: "Optional. Author; absent = unset"
    absent: "unset"
  - name: "createdAt"
    ref: "string"
    meaning: "Optional. Creation time (ISO-8601); absent = unset"
    absent: "unset"
  - name: "modifiedAt"
    ref: "string"
    meaning: "Optional. Last modification (ISO-8601); absent = unset"
    absent: "unset"
---
# `rig.bim.topic`

BCF issue / topic. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `topicType` | string | Optional. Topic type (`Clash`, `Issue`, ...); absent = unset |
| `topicStatus` | string | Optional. Status (`Open`, `Closed`, ...); absent = unset |
| `priority` | string | Optional. Priority label; absent = unset |
| `assignedTo` | string | Optional. Assignee; absent = unset |
| `labels` | string[] | Optional. Labels; order carries no meaning |
| `stage` | string | Optional. Project stage; absent = unset |
| `description` | string | Optional. Body text; absent = empty |
| `dueAt` | string | Optional. Due date/time (ISO-8601); absent = unset |
| `createdBy` | string | Optional. Author; absent = unset |
| `createdAt` | string | Optional. Creation time (ISO-8601); absent = unset |
| `modifiedAt` | string | Optional. Last modification (ISO-8601); absent = unset |

Compose [`rig.meta.named`](../meta/named.md) for the topic title; BCF guid becomes `stableId`. Comments and viewpoints reference this entity.
