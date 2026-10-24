# Layout and story - pages, frames, editorial copy

Load for: pages, masters, text frames, stories, styles, tables. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/page-anchor.json`](../../../examples/page-anchor.json), [`examples/story-flow.json`](../../../examples/story-flow.json), [`examples/story-frames.json`](../../../examples/story-frames.json), [`examples/text-path.json`](../../../examples/text-path.json). IDML mapping: [`docs/idml.md`](../../../docs/idml.md).

## Compose

| Want | Compose |
|---|---|
| A page | `rig.layout.page` (may override document unit with `unit`) + `rig.spatial.transform` |
| A master / applied master / facing / section | `rig.layout.master`, `rig.layout.applied_master`, `rig.layout.facing`, `rig.layout.section` |
| A text or graphic frame | `rig.layout.frame` (`width`/`height` on the frame) + transform; thread frames with `rig.layout.frame_chain` |
| Editorial content | `rig.story.flow` holding `rig.story.paragraph` / `rig.story.table` blocks |
| A named text style (meaning only) | `rig.story.paragraph_style` / `rig.story.character_style` - identity, `basedOn`, nothing visual |
| The visual map for a story style | `rig.layout.paragraph_style` / `rig.layout.character_style` / `rig.layout.table_style`, keyed by `storyStyle` |
| Page grid | `rig.layout.grid` |
| A canvas text run (not editorial) | `rig.media.text`; on a contour, `rig.media.text_path` with the path as its own entity |
| Webfont declaration | `rig.media.font_face`; source code / feature text is `rig.media.code` |

## Guards

- No `rig.idml.*`, graphic frames, object styles, text wrap, GREP, footnotes, or variables. Map onto `rig.layout.frame` plus layout/story.
- `rig.geometry.rectangle` is a drawable, not a frame. Do not give a frame rectangle geometry to carry its bounds.
- Do not parent `rig.story.flow` to the page; frames thread with `frame_chain`.
- Stories carry style identity only: no font, size, colour, bold/italic/underline/strike, super/sub on story or run fields. Unstyled local emphasis becomes a named character style. Text colour is paint ([scene.md](scene.md)).
- Origin is `rig.spatial.anchor`, never a page field.

## Ids in this slice

`rig.layout.page`, `rig.layout.master`, `rig.layout.applied_master`, `rig.layout.facing`, `rig.layout.section`, `rig.layout.paragraph_style`, `rig.layout.character_style`, `rig.layout.table_style`, `rig.layout.frame`, `rig.layout.frame_chain`, `rig.layout.grid`, `rig.story.flow`, `rig.story.paragraph`, `rig.story.paragraph_style`, `rig.story.character_style`, `rig.story.table`, `rig.media.text`, `rig.media.text_path`, `rig.media.font_face`, `rig.media.code`
