# `rig.story.paragraph`

One paragraph in a [`rig.story.flow`](flow.md) (or a table cell). Format when present.

An applied paragraph style, optional column/page break, then character runs. A trailing paragraph break is implied — do not store a sentinel run for it.

| Field | Type | Meaning |
|-------|------|---------|
| `style` | entity | Optional. [`rig.story.paragraph_style`](paragraph-style.md); absent = no paragraph style |
| `breakType` | enum | Optional. `column` or `page` — break after this paragraph. Absent = next paragraph |
| `runs` | run[] | Ordered character runs; empty is a blank paragraph |

Line breaks inside a paragraph are `\n` in `text`. Column and page breaks are `breakType`, not a run.

## Run

| Field | Type | Meaning |
|-------|------|---------|
| `text` | string | Content (may be empty) |
| `style` | entity | Optional. [`rig.story.character_style`](character-style.md); absent = no character style |

Semantics only: a run is text plus a style identity. Bold, italic, underline, strike, super/sub, font, size, and colour are **not** fields here. Unstyled local emphasis becomes a named character style. Nested emphasis is a distinct style that `basedOn` the outer one.

Do not put a URL here — a hyperlink is a character style identity; the href is fulfillment.
