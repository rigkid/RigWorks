---
id: "rig.book.contribution"
maturity: "draft"
summary: "One contributor on one work. Format when present."
topJson: "{\"description\":\"One contributor on one work. Field meanings follow ONIX Contributor. Name is on the person entity.\"}"
fields:
  - name: "work"
    ref: "entity"
    required: true
    meaning: "The bibliographic work (book or paper)"
  - name: "person"
    ref: "entity"
    required: true
    meaning: "Contributor person"
  - name: "role"
    type: "string"
    enum: ["author","editor","translator","illustrator","photographer","compiler","introduction","other"]
    required: true
    meaning: "author / editor / translator / illustrator / photographer / compiler / introduction / other"
  - name: "sequence"
    ref: "int"
    meaning: "Optional. Title-page order, 1-based"
---
# `rig.book.contribution`

One contributor on one work. Format when present.

Field meanings follow ONIX for Books `Contributor`. The person's name is not repeated here.

| Field | Type | Meaning | ONIX |
|-------|------|---------|------|
| `work` | entity | The bibliographic work (book or paper) | - |
| `person` | entity | Contributor person | `Contributor` |
| `role` | enum | `author` / `editor` / `translator` / `illustrator` / `photographer` / `compiler` / `introduction` / `other` | `ContributorRole` (`A01`, `B01`, `B06`, ...) |
| `sequence` | int | Optional. Title-page order, 1-based | `SequenceNumber` |

`work`, `person`, and `role` are required.

Name the person with [`rig.meta.named`](../meta/named.md) plus [`rig.person.name`](../person/name.md). A corporate author is an organisation entity in `person` only if you must - prefer a person; an organisation as author stays a named organisation entity referenced here.

A second contributor is another entity. Do not invent a contributors array here.
