---
id: "rig.layout.paragraph_style"
maturity: "stable"
summary: "Visual map for a rig.story.paragraph_style. Format when present."
fields:
  - name: "storyStyle"
    ref: "entity"
    meaning: "Optional. Story paragraph style this map applies to"
  - name: "basedOn"
    ref: "entity"
    meaning: "Optional. Parent layout paragraph style; absent / null = none"
    absent: "/ null = none"
  - name: "font"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref kind font"
  - name: "fontSize"
    ref: "float"
    meaning: "Optional. Size in points"
  - name: "leading"
    ref: "float"
    meaning: "Optional. Line spacing; absent = host default from fontSize"
    absent: "host default from fontSize"
  - name: "alignment"
    type: "string"
    enum: ["left","center","right","justify"]
    meaning: "Optional. left / center / right / justify. Absent = left"
    absent: "left"
  - name: "lastLineAlignment"
    type: "string"
    enum: ["left","center","right","justify"]
    meaning: "Optional. Alignment of a paragraph's last line (a one-line paragraph is its own last line). Same values as alignment. Absent = left"
    absent: "left"
  - name: "spaceBefore"
    ref: "float"
    meaning: "Optional. Space before the paragraph"
  - name: "spaceAfter"
    ref: "float"
    meaning: "Optional. Space after the paragraph"
  - name: "firstLineIndent"
    ref: "float"
    meaning: "Optional. First-line indent"
  - name: "leftIndent"
    ref: "float"
    meaning: "Optional. Indent off the frame's left content edge; absent = 0"
    absent: "0"
  - name: "rightIndent"
    ref: "float"
    meaning: "Optional. Indent off the frame's right content edge; absent = 0"
    absent: "0"
  - name: "tracking"
    ref: "float"
    meaning: "Optional. Uniform letterspace in thousandths of an em; absent = 0"
    absent: "0"
  - name: "wordSpacingMin"
    ref: "float"
    meaning: "Optional. Justification word-space floor as % of the font's space; absent = host default"
    absent: "host default"
  - name: "wordSpacingDesired"
    ref: "float"
    meaning: "Optional. Justification word-space target as % of the font's space; absent = host default"
    absent: "host default"
  - name: "wordSpacingMax"
    ref: "float"
    meaning: "Optional. Justification word-space ceiling as % of the font's space; absent = host default"
    absent: "host default"
  - name: "letterSpacingMin"
    ref: "float"
    meaning: "Optional. Justification letterspace floor in thousandths of an em; absent = 0"
    absent: "0"
  - name: "letterSpacingMax"
    ref: "float"
    meaning: "Optional. Justification letterspace ceiling in thousandths of an em; absent = 0"
    absent: "0"
  - name: "keepFirstLines"
    ref: "int"
    meaning: "Optional. Min lines left before a frame / page break (orphans). 0 = off; absent = host default"
    absent: "host default"
  - name: "keepLastLines"
    ref: "int"
    meaning: "Optional. Min lines carried past a frame / page break (widows). 0 = off; absent = host default"
    absent: "host default"
  - name: "keepLastWords"
    ref: "int"
    meaning: "Optional. Min words on the paragraph's last line (runts). 0 / 1 = off; absent = host default"
    absent: "host default"
  - name: "hyphenate"
    ref: "bool"
    meaning: "Optional. Dictionary hyphenation at line breaks. Absent = true; authored soft hyphens (U+00AD) always stay break opportunities"
    absent: "true"
  - name: "alignToBaselineGrid"
    ref: "bool"
    meaning: "Optional. Snap lines to the document rig.layout.grid baseline increment. Absent = false"
    absent: "false"
  - name: "baselineGridFirstLineOnly"
    ref: "bool"
    meaning: "Optional. With alignToBaselineGrid, snap only the paragraph's first line; the rest follow leading. Absent = false"
    absent: "false"
  - name: "paint"
    ref: "entity"
    meaning: "Optional. Paint entity (rig.paint.fill / solid) for the run colour"
  - name: "grepStyles"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"pattern\"],\"properties\":{\"pattern\":{\"type\":\"string\"},\"characterStyle\":{\"$ref\":\"./_defs.schema.json#/$defs/entity\"}}}"
    meaning: "Optional. GREP style rules, applied in order (see below)"
  - name: "flowRole"
    type: "string"
    enum: ["dedication","epigraph","preface","part","chapter","appendix","epilog","afterword","colophon","toc"]
    meaning: "Optional. Applies only inside a rig.story.flow with this role (see below); absent = every flow"
    absent: "every flow"
---
# `rig.layout.paragraph_style`

Visual map for a [`rig.story.paragraph_style`](../story/paragraph-style.md). Format when present.

Story styles stay identity-only (name + basedOn + listKind). Font, size, leading, alignment, and colour live here so any host can open the same book. Key with `storyStyle`; resolve `basedOn` chains on this schema separately from the story chain.

| Field | Type | Meaning |
|-------|------|---------|
| `storyStyle` | entity | Optional. Story paragraph style this map applies to |
| `basedOn` | entity | Optional. Parent layout paragraph style; absent / `null` = none |
| `font` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) kind font |
| `fontSize` | float | Optional. Size in points |
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
| `flowRole` | enum | Optional. Applies only inside a [`rig.story.flow`](../story/flow.md) with this `role` (see below); absent = every flow |

Based-on chains stay acyclic. A cycle is a document error. Do not put these fields on `rig.story.*`.

## Units

`fontSize`, `leading`, `spaceBefore`, `spaceAfter`, `firstLineIndent`, `leftIndent`, and `rightIndent` are points (1/72 in), whatever `document.defaultUnit` or the page `unit` says. Type is measured in points in every tool that sets it; frames and pages keep the document unit.

## Role variants

A map with `flowRole` is a variant: it dresses its `storyStyle` only in flows whose `role` matches, and wins there over the map without `flowRole`. Set its `basedOn` to that map, so a variant states only what differs - a chapter opening's larger first paragraph, say. At most one map per `storyStyle` and `flowRole` pair; a second is a document error. Without a variant for the flow's role, the plain map applies.

## GREP styles

Each `grepStyles` entry is `{ "pattern": <ECMAScript regex>, "characterStyle": <entity> }`: text the pattern matches takes the named [`rig.layout.character_style`](character-style.md). Rules apply in order; an authored run character style - and any earlier rule's match - always wins over a later rule. A match cannot straddle a style boundary, and a style that defines any rules replaces its parent's set rather than merging with it. Patterns that do not compile are ignored.
