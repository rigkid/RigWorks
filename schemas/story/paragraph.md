---
id: "rig.story.paragraph"
maturity: "stable"
summary: "One paragraph in a rig.story.flow (or a table cell). Format when present."
fields:
  - name: "style"
    ref: "entity"
    meaning: "Optional. rig.story.paragraph_style; absent = no paragraph style"
    absent: "no paragraph style"
  - name: "breakType"
    type: "string"
    enum: ["column","page","odd","even"]
    meaning: "Optional. column, page, odd, or even - break after this paragraph. Absent = next paragraph"
    absent: "next paragraph"
  - name: "runs"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"text\"],\"properties\":{\"text\":{\"$ref\":\"./_defs.schema.json#/$defs/string\"},\"style\":{\"$ref\":\"./_defs.schema.json#/$defs/entity\"}}}"
    required: true
    meaning: "Ordered character runs; empty is a blank paragraph"
---
# `rig.story.paragraph`

One paragraph in a [`rig.story.flow`](flow.md) (or a table cell). Format when present.

An applied paragraph style, optional column/page/odd/even break, then character runs. A trailing paragraph break is implied - do not store a sentinel run for it.

| Field | Type | Meaning |
|-------|------|---------|
| `style` | entity | Optional. [`rig.story.paragraph_style`](paragraph-style.md); absent = no paragraph style |
| `breakType` | enum | Optional. `column`, `page`, `odd`, or `even` - break after this paragraph. Absent = next paragraph |
| `runs` | run[] | Ordered character runs; empty is a blank paragraph |

Line breaks inside a paragraph are `\n` in `text`. Flow breaks are `breakType`, not a run.

- `column` — advance to the next column when the layout has columns; otherwise hosts MAY treat as `page`
- `page` — advance to the next page (default hard break)
- `odd` — advance so the following content starts on an odd (recto) page
- `even` — advance so the following content starts on an even (verso) page

## Run

| Field | Type | Meaning |
|-------|------|---------|
| `text` | string | Content (may be empty) |
| `style` | entity | Optional. [`rig.story.character_style`](character-style.md); absent = no character style |

Semantics only: a run is text plus a style identity. Bold, italic, underline, strike, super/sub, font, size, and colour are **not** fields here. Unstyled local emphasis becomes a named character style. Nested emphasis is a distinct style that `basedOn` the outer one.

Do not put a URL here - a hyperlink is a character style identity; the href is fulfillment.
