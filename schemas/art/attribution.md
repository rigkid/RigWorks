# `rig.art.attribution`

One maker on one work. Format when present.

Field meanings follow CDWA Creation — Creator and VRA Core `agent`. The person's name is not repeated here.

| Field | Type | Meaning | CDWA |
|-------|------|---------|------|
| `work` | entity | The artwork entity | — |
| `person` | entity | Maker | Creator |
| `role` | enum | `artist` / `attributed-to` / `workshop-of` / `school-of` / `after` / `photographer` / `other` | Creator — Role |
| `sequence` | int | Optional. Credit order, 1-based | — |

`work`, `person`, and `role` are required.

Name the person with [`rig.meta.named`](../meta/named.md) plus [`rig.person.name`](../person/name.md). A second maker is another entity.
