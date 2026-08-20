# `rig.layout.paragraph_style`

Visual map for a [`rig.story.paragraph_style`](../story/paragraph-style.md). Format when present.

Story styles stay identity-only (name + basedOn + listKind). Font, size, leading, alignment, and colour live here so any host can open the same book. Key with `storyStyle`; resolve `basedOn` chains on this schema separately from the story chain.

| Field | Type | Meaning |
|-------|------|---------|
| `storyStyle` | entity | Optional. Story paragraph style this map applies to |
| `basedOn` | entity | Optional. Parent layout paragraph style; absent / `null` = none |
| `font` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) kind font |
| `fontSize` | float | Optional. Size in document units (or points when the host documents that) |
| `leading` | float | Optional. Line spacing; absent = host default from `fontSize` |
| `alignment` | enum | Optional. `left` / `center` / `right` / `justify`. Absent = `left` |
| `spaceBefore` | float | Optional. Space before the paragraph |
| `spaceAfter` | float | Optional. Space after the paragraph |
| `firstLineIndent` | float | Optional. First-line indent |
| `paint` | entity | Optional. Paint entity (`rig.paint.fill` / `solid`) for the run colour |

Based-on chains stay acyclic. A cycle is a document error. Do not put these fields on `rig.story.*`.
