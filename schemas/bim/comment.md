# `rig.bim.comment`

BCF comment on a topic. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `topic` | entity | Parent [`rig.bim.topic`](topic.md) |
| `body` | string | Comment text |
| `author` | string | Optional. Author; absent = unset |
| `createdAt` | string | Optional. Creation time (ISO-8601); absent = unset |
| `viewpoint` | entity | Optional. Linked [`rig.bim.viewpoint`](viewpoint.md); absent = none |
