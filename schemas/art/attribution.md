---
id: "rig.art.attribution"
maturity: "draft"
summary: "One maker on one work. Format when present."
topJson: "{\"description\":\"One maker on one work. Field meanings follow CDWA Creation/Creator. Name is on the person entity.\"}"
fields:
  - name: "work"
    ref: "entity"
    required: true
    meaning: "The artwork entity"
  - name: "person"
    ref: "entity"
    required: true
    meaning: "Maker"
  - name: "role"
    type: "string"
    enum: ["artist","attributed-to","workshop-of","school-of","after","photographer","other"]
    required: true
    meaning: "artist / attributed-to / workshop-of / school-of / after / photographer / other"
  - name: "sequence"
    ref: "int"
    meaning: "Optional. Credit order, 1-based"
---
# `rig.art.attribution`

One maker on one work. Format when present.

Field meanings follow CDWA Creation - Creator and VRA Core `agent`. The person's name is not repeated here.

| Field | Type | Meaning | CDWA |
|-------|------|---------|------|
| `work` | entity | The artwork entity | - |
| `person` | entity | Maker | Creator |
| `role` | enum | `artist` / `attributed-to` / `workshop-of` / `school-of` / `after` / `photographer` / `other` | Creator - Role |
| `sequence` | int | Optional. Credit order, 1-based | - |

`work`, `person`, and `role` are required.

Name the person with [`rig.meta.named`](../meta/named.md) plus [`rig.person.name`](../person/name.md). A second maker is another entity.
