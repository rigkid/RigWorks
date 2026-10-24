---
id: "rig.art.subject"
maturity: "draft"
summary: "Subject matter of a work. Format when present."
topJson: "{\"description\":\"Subject matter. Field meanings follow CDWA Subject Matter. A second heading is another entity.\",\"minProperties\":2}"
fields:
  - name: "work"
    ref: "entity"
    required: true
    meaning: "The artwork entity"
  - name: "heading"
    ref: "string"
    meaning: "Description (irises, portrait)"
  - name: "interpretation"
    ref: "string"
    meaning: "Optional. Iconographic reading"
---
# `rig.art.subject`

Subject matter of a work. Format when present.

Field meanings follow CDWA Subject Matter. This is what the work depicts - not an ONIX book heading.

| Field | Type | Meaning | CDWA |
|-------|------|---------|------|
| `work` | entity | The artwork entity | - |
| `heading` | string | Description (`irises`, `portrait`) | Subject Matter - Description |
| `interpretation` | string | Optional. Iconographic reading | Subject Matter - Interpretation |

`work` is required. Emit at least one of `heading` or `interpretation`.

A second heading is another entity. Book-trade classifications stay on [`rig.book.subject`](../book/subject.md).
