# `rig.paper.issue`

Issue or proceedings container for an article. Format when present.

Field meanings follow JATS `journal-meta` / `issue-meta` and conference proceedings metadata. This schema is the container — not the article.

| Field | Type | Meaning | JATS |
|-------|------|---------|------|
| `journal` | entity | Journal or proceedings series | `journal-title` (on that entity) |
| `volume` | string | Volume | `volume` |
| `issue` | string | Issue / number | `issue` |
| `conferenceName` | string | Conference name (proceedings) | conference-name |
| `conferencePlace` | string | Conference city / venue | conference-loc |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Name the journal with [`rig.meta.named`](../meta/named.md). Its ISSN is [`rig.book.identifier`](../book/identifier.md) `issn` on that same journal entity. Do not put a journal title string here.
