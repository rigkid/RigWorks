# `rig.art.object`

Object / work type of an artwork or cultural object. Format when present.

Field meanings follow [CDWA](https://www.getty.edu/research/publications/electronic_publications/cdwa/) Object/Work and Classification (the core subset), and VRA Core `worktype`. This schema is those type slots — not a LIDO XML file and not scene geometry.

| Field | Type | Meaning | CDWA / VRA |
|-------|------|---------|------------|
| `workType` | string | Kind of object (`painting`, `sculpture`, `photograph`) | Object/Work — Type |
| `classification` | string | Collection class (`Paintings`) | Classification |
| `inscription` | string | Inscriptions / marks | Inscriptions/Marks |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

The title is [`rig.meta.named`](../meta/named.md). Maker, date, measurements, materials, location, subject, image, and rights are sibling schemas. Do not re-declare those here.
