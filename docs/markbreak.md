# MarkBreak to RigWorks

How a print-manuscript Markdown profile maps onto Contract schemas. MarkBreak is a fulfillment dialect (specification outside this tree); portable meaning lands here.

| MarkBreak | RigWorks |
|-----------|----------|
| `.md` file + path | [`rig.media.code`](../schemas/media/code.md) (`language` `markdown`) + [`rig.media.asset_ref`](../schemas/media/asset-ref.md) |
| Body after ingest | `rig.story.flow` then [`rig.story.paragraph`](../schemas/story/paragraph.md) / table |
| `//break`, raw `\columnbreak` | `breakType` `column` |
| `//break page`, `\newpage`, `\pagebreak` | `breakType` `page` |
| `//break odd`, `\cleardoublepage` | `breakType` `odd` |
| `//break even` | `breakType` `even` |
| Heading keep | [`rig.story.paragraph_style`](../schemas/story/paragraph-style.md) `keepWithNext` |
| `role` | [`rig.story.flow`](../schemas/story/flow.md) `role` |
| `meta` | `meta.md`: `title`, `subtitle`, `author`, `language`, `isbn13`, `publisher` |
| `layout` | RigWorks layout document: [`rig.layout.page`](../schemas/layout/page.md), [`rig.layout.facing`](../schemas/layout/facing.md), [`rig.layout.paragraph_style`](../schemas/layout/paragraph-style.md) `fontSize` and `leading` |

`margins` are `[top, right, bottom, left]` in the page unit. With facing pages, the left and right channels swap on the verso. Do not add a second inner/outer pair.

The writer copies that page into Docx and PDF. Do not invent parallel break fields under `x.*` when `breakType` already carries the meaning. Do not invent a paper-size enum when `width` and `height` already carry the trim. Example: [`markbreak-chapter.json`](../examples/markbreak-chapter.json).
