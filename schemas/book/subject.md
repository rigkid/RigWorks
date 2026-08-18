# `rig.book.subject`

One classification heading of a book. Format when present.

Field meanings follow ONIX for Books `Subject`. This schema is one heading — not a keyword cloud and not [`rig.meta.tags`](../meta/tags.md).

| Field | Type | Meaning | ONIX |
|-------|------|---------|------|
| `work` | entity | The book entity | — |
| `scheme` | enum | `thema` / `bisac` / `bic` / `dewey` / `keyword` | `SubjectSchemeIdentifier` |
| `code` | string | Notation in that scheme | `SubjectCode` |
| `heading` | string | Human heading | `SubjectHeadingText` |

`work` is required. Emit at least one of `scheme`, `code`, or `heading`.

A second heading is another entity. Free-form labels that are not a subject scheme stay on [`rig.meta.tags`](../meta/tags.md).
