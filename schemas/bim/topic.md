# `rig.bim.topic`

BCF issue / topic. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `topicType` | string | Optional. Topic type (`Clash`, `Issue`, …); absent = unset |
| `topicStatus` | string | Optional. Status (`Open`, `Closed`, …); absent = unset |
| `priority` | string | Optional. Priority label; absent = unset |
| `assignedTo` | string | Optional. Assignee; absent = unset |
| `labels` | string[] | Optional. Labels; order carries no meaning |
| `stage` | string | Optional. Project stage; absent = unset |
| `description` | string | Optional. Body text; absent = empty |
| `dueAt` | string | Optional. Due date/time (ISO-8601); absent = unset |
| `createdBy` | string | Optional. Author; absent = unset |
| `createdAt` | string | Optional. Creation time (ISO-8601); absent = unset |
| `modifiedAt` | string | Optional. Last modification (ISO-8601); absent = unset |

Compose [`rig.meta.named`](../meta/named.md) for the topic title; BCF guid → `stableId`. Comments and viewpoints reference this entity.
