# `rig.art.subject`

Subject matter of a work. Format when present.

Field meanings follow CDWA Subject Matter. This is what the work depicts — not an ONIX book heading.

| Field | Type | Meaning | CDWA |
|-------|------|---------|------|
| `work` | entity | The artwork entity | — |
| `heading` | string | Description (`irises`, `portrait`) | Subject Matter — Description |
| `interpretation` | string | Optional. Iconographic reading | Subject Matter — Interpretation |

`work` is required. Emit at least one of `heading` or `interpretation`.

A second heading is another entity. Book-trade classifications stay on [`rig.book.subject`](../book/subject.md).
