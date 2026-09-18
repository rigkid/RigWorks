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
| `lastLineAlignment` | enum | Optional. Alignment of a paragraph's last line (a one-line paragraph is its own last line). Same values as `alignment`. Absent = `left` |
| `spaceBefore` | float | Optional. Space before the paragraph |
| `spaceAfter` | float | Optional. Space after the paragraph |
| `firstLineIndent` | float | Optional. First-line indent |
| `leftIndent` | float | Optional. Indent off the frame's left content edge; absent = `0` |
| `rightIndent` | float | Optional. Indent off the frame's right content edge; absent = `0` |
| `tracking` | float | Optional. Uniform letterspace in thousandths of an em; absent = `0` |
| `wordSpacingMin` | float | Optional. Justification word-space floor as % of the font's space; absent = host default |
| `wordSpacingDesired` | float | Optional. Justification word-space target as % of the font's space; absent = host default |
| `wordSpacingMax` | float | Optional. Justification word-space ceiling as % of the font's space; absent = host default |
| `letterSpacingMin` | float | Optional. Justification letterspace floor in thousandths of an em; absent = `0` |
| `letterSpacingMax` | float | Optional. Justification letterspace ceiling in thousandths of an em; absent = `0` |
| `keepFirstLines` | int | Optional. Min lines left before a frame / page break (orphans). `0` = off; absent = host default |
| `keepLastLines` | int | Optional. Min lines carried past a frame / page break (widows). `0` = off; absent = host default |
| `keepLastWords` | int | Optional. Min words on the paragraph's last line (runts). `0` / `1` = off; absent = host default |
| `hyphenate` | bool | Optional. Dictionary hyphenation at line breaks. Absent = `true`; authored soft hyphens (U+00AD) always stay break opportunities |
| `alignToBaselineGrid` | bool | Optional. Snap lines to the document [`rig.layout.grid`](grid.md) baseline increment. Absent = `false` |
| `baselineGridFirstLineOnly` | bool | Optional. With `alignToBaselineGrid`, snap only the paragraph's first line; the rest follow `leading`. Absent = `false` |
| `paint` | entity | Optional. Paint entity (`rig.paint.fill` / `solid`) for the run colour |
| `grepStyles` | array | Optional. GREP style rules, applied in order (see below) |

Based-on chains stay acyclic. A cycle is a document error. Do not put these fields on `rig.story.*`.

## GREP styles

Each `grepStyles` entry is `{ "pattern": <ECMAScript regex>, "characterStyle": <entity> }`: text the pattern matches takes the named [`rig.layout.character_style`](character-style.md). Rules apply in order; an authored run character style - and any earlier rule's match - always wins over a later rule. A match cannot straddle a style boundary, and a style that defines any rules replaces its parent's set rather than merging with it. Patterns that do not compile are ignored.
