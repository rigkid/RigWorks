# `rig.story.paragraph_style`

Named paragraph style. Format when present.

The display name is [`rig.meta.named`](../meta/named.md) - do not re-declare `name` here. Identity only: no font, size, colour, or leading. A host maps the name (Heading 1, Normal, Unordered List) at emit time.

| Field | Type | Meaning |
|-------|------|---------|
| `basedOn` | entity | Optional. Parent paragraph style; absent / `null` = none |
| `listKind` | enum | Optional. `bullet` or `numbered`. Absent = not a list style |
| `keepWithNext` | bool | Optional. Never leave a paragraph of this style last on a page - break before it so it travels with the block that follows (headings). Absent = `false` |
| `keepWithPrevious` | bool | Optional. Never start a page with a paragraph of this style - it travels with the block before it (captions). Absent = `false` |

Headings are styles whose name the host already knows (`Header 1`, `Heading 1`) - no `headingLevel` field. List membership is this `listKind` on the style, not a separate list object.

Keeps are style facts, not per-paragraph switches: a heading style holds its section (`keepWithNext`), a caption style holds its figure (`keepWithPrevious`). Either side of a pair declaring the bond is enough. Keeping a paragraph's own lines together is host compose policy, not a schema field.

Based-on chains stay acyclic. A cycle is a document error.
