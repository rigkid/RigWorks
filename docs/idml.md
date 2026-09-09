# IDML

Rig names InDesign layout meaning as [`rig.layout.*`](../schemas/layout/page.md) plus [`rig.story.*`](../schemas/story/flow.md). InDesign Markup Language **files** stay host mappings at the boundary - same rule as IFC in [openbim.md](openbim.md) and SVG ([design philosophy](design-philosophy.md#encoding)).

The Contract job is entities, POD components, and schema ids. An `.idml` reader / writer (SimpleIDML, a Pandoc wire, or a sibling pack) is fulfillment, not this catalog.

## Thin layer

Do **not** invent `rig.idml.*`. One story and one frame use the schemas below; IDML Self ids land on [`rig.meta.named`](../schemas/meta/named.md) `stableId`. Visual typography stays on `rig.layout.paragraph_style` / `character_style`, never on `rig.story.*`.

| IDML idea | Rig |
|-----------|-----|
| Page / Spread page | [`rig.layout.page`](../schemas/layout/page.md) |
| MasterSpread | [`rig.layout.master`](../schemas/layout/master.md) on a page |
| AppliedMaster | [`rig.layout.applied_master`](../schemas/layout/applied-master.md) |
| FacingPages / BindingLocation | [`rig.layout.facing`](../schemas/layout/facing.md) |
| MarginPreference / Bleed / Slug | page `margins` / `bleed` / `slug` |
| Story | [`rig.story.flow`](../schemas/story/flow.md) |
| ParagraphStyle (identity) | [`rig.story.paragraph_style`](../schemas/story/paragraph-style.md) |
| CharacterStyle (identity) | [`rig.story.character_style`](../schemas/story/character-style.md) |
| ParagraphStyle (face / size / lead / align / colour) | [`rig.layout.paragraph_style`](../schemas/layout/paragraph-style.md) |
| CharacterStyle (face / size / colour / bold / italic) | [`rig.layout.character_style`](../schemas/layout/character-style.md) |
| TextFrame | [`rig.layout.frame`](../schemas/layout/frame.md) |
| GeometricBounds + ItemTransform | [`rig.spatial.transform`](../schemas/spatial/transform.md) + frame `width` / `height` |
| InsetSpacing | frame `insets` |
| TextColumnCount / TextColumnGutter | frame `columnCount` / `columnGutter` |
| FirstBaselineOffset / MinimumFirstBaselineOffset | frame `firstBaseline` / `firstBaselineMin` |
| PreviousTextFrame / NextTextFrame / ParentStory | [`rig.layout.frame_chain`](../schemas/layout/frame-chain.md) |
| Containment (on page or master) | [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` |

GeometricBounds `(y1, x1, y2, x2)` become position `(x1, y1)` and size `(x2 − x1, y2 − y1)` in 2D page space (+X right, +Y down). ItemTransform composes onto the same transform. Do not store the IDML matrix as a second pose.

## Encodings (fulfillment)

| File | Role |
|------|------|
| `.idml` | ZIP of `designmap.xml` + Spreads / Stories / MasterSpreads / Resources - map into / out of layout + story |
| `.indt` / `.indd` | InDesign private database - export IDML first |
| Word / `.docx` | Story-only import to `rig.story.*`. Tables land as [`rig.story.table`](../schemas/story/table.md) content; the document's [`rig.layout.table_style`](../schemas/layout/table-style.md) dresses them - Word table formatting does not travel. Not a layout |

Do not put InDesign Self strings, story overflow, or composed line breaks in portable components - those are encoding / host cache.

## Honest limit

Two hosts that speak `rig.layout.frame` + `frame_chain` + page / master / facing + story styles can exchange a threaded text layout as `.rig`. Round-tripping every InDesign object SimpleIDML can touch is **not required**.

Stay out of v1 (do not invent schemas for these):

- Graphic frames / placed images
- Groups
- Object styles
- Text wrap
- Anchored objects
- Hyphenation and justification settings (alignment `justify` is already on the paragraph style)
- GREP / nested styles
- Footnotes
- Text variables (folio)
- Notes
- XML tags
- Books (`.indb`)

A compose host that parents a flow to a page and clones pages on overflow is not an IDML layout - InDesign threads frames. Masters, facing, slug, and character styles beyond italic are already in this catalog; honor them at emit time.

A Word converter that emits only paragraphs is fine for a novel's `rig.story.*`. It is not a pictured book or a register until tables, lists, images, footnotes, and hyperlinks land in that fulfillment. Tables and list membership are already named here.

Example: [`examples/story-frames.json`](../examples/story-frames.json).
