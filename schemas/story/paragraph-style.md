# `rig.story.paragraph_style`

Named paragraph style. Format when present.

The display name is [`rig.meta.named`](../meta/named.md) — do not re-declare `name` here. Identity only: no font, size, colour, or leading. A host maps the name (Heading 1, Normal, Unordered List) at emit time.

| Field | Type | Meaning |
|-------|------|---------|
| `basedOn` | entity | Optional. Parent paragraph style; absent / `null` = none |
| `listKind` | enum | Optional. `bullet` or `numbered`. Absent = not a list style |

Headings are styles whose name the host already knows (`Header 1`, `Heading 1`) — no `headingLevel` field. List membership is this `listKind` on the style, not a separate list object.

Based-on chains stay acyclic. A cycle is a document error.
