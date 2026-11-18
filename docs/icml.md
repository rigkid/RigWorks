# ICML

An InCopy Markup Language file (`.icml`) is one InDesign story as XML: the `<Story>` plus the styles, colours, and fonts it uses. It has no pages and no frames. It opens with `<?aid SnippetType="InCopyInterchange"?>`, and its elements are the IDML elements of the same name ([IDML File Format Specification](https://raw.githubusercontent.com/jorisros/IDMLlib/master/docs/idml-specification.pdf), version 8.0, Appendix B; Adobe has not published a newer edition). Rig names the story as [`rig.story.*`](../schemas/story/flow.md) and its look as the [`rig.layout.*`](../schemas/layout/paragraph-style.md) style maps - the same thin layer as [idml.md](idml.md). There is no `rig.icml.*`. A reader / writer is fulfillment.

The story files inside an `.idml` package (`Stories/Story_*.xml`) hold the same `<Story>` element, so the [Story](#story), [Styles](#styles), [Local formatting](#local-formatting), and [Tables](#tables) maps below are also how IDML story content lands.

## The file travels as the merge base

Import makes one entity per story:

| Component | Holds |
|-----------|-------|
| [`rig.story.flow`](../schemas/story/flow.md) | The blocks |
| [`rig.media.code`](../schemas/media/code.md) `language` `icml` | The file text, unchanged |
| [`rig.media.asset_ref`](../schemas/media/asset-ref.md) `kind` `document` | Where the file came from and goes back to |
| [`rig.meta.named`](../schemas/meta/named.md) | `name` is `StoryTitle` (the story name InCopy embeds in the file), or the file name when `StoryTitle` is `$ID/` (empty) |

Order of truth:

- **The components are the editable truth.** A Rig host edits the flow, paragraphs, styles, and paints - never the buffer.
- **The buffer is the merge base.** Export merges the components onto it, so what Rig does not name comes back ([Round trip](#round-trip)).
- **A large file may leave the buffer out.** In a `.rigz` the file sits at the `asset_ref` path in `data/`. With both, the buffer is the base.

## Story

| ICML | Rig |
|------|-----|
| `<Story>` | `rig.story.flow`. One file is one flow |
| Story label `rig:role` (`<Properties><Label><KeyValuePair Key="rig:role" Value="chapter"/></Label></Properties>`) | Flow `role` |
| Story label `rig:flow` | The flow's `rig.meta.named` `stableId` - [Stories from another source](#stories-from-another-source) |
| A paragraph: the text up to each `<Br/>` (the last paragraph has none). InDesign writes `<Br/>` inside a `CharacterStyleRange`; other writers put it between ranges. Both are the same paragraph return | [`rig.story.paragraph`](../schemas/story/paragraph.md), in order in `blocks` |
| `ParagraphStyleRange` `AppliedParagraphStyle` | Paragraph `style` |
| `CharacterStyleRange` `AppliedCharacterStyle` | Run `style` |
| Each `<Content>` | One run. Do not merge neighbouring runs: run boundaries are where markup sits ([Round trip](#round-trip)). A `<?ACE n?>` instruction inside `<Content>` (`<?ACE 4?>` is a footnote's number) is not run text |
| `&#x2028;` (forced line break) | `\n` in run text |
| Tab, soft hyphen (U+00AD), no-break space, every other character | The same character in run text |
| `ParagraphBreakType` `NextColumn` / `NextPage` / `NextOddPage` / `NextEvenPage` on the `CharacterStyleRange` holding a paragraph's `<Br/>` | That paragraph's `breakType` `column` / `page` / `odd` / `even`. `Anywhere` is a plain return. `NextFrame` has no Rig value and stays in the base |
| `[No paragraph style]` / `[No character style]` | `style` absent |
| `<Table>` | A [`rig.story.table`](../schemas/story/table.md) block - [Tables](#tables) |

A range that sets attributes beyond its applied style applies a [local style](#local-formatting).

## Styles

| ICML | Rig |
|------|-----|
| `ParagraphStyle` / `CharacterStyle` | One entity: `rig.meta.named` (`name` is `Name`, `stableId` is `Self`), [`rig.story.paragraph_style`](../schemas/story/paragraph-style.md) / [`character_style`](../schemas/story/character-style.md), and [`rig.layout.paragraph_style`](../schemas/layout/paragraph-style.md) / [`character_style`](../schemas/layout/character-style.md) with `storyStyle` pointing at the same entity. A style that sets no mapped attribute has no layout map |
| `$ID/` names | The name without `$ID/`. `$ID/NormalParagraphStyle` is `[Basic Paragraph]`. `[No paragraph style]` holds InDesign's text defaults and is the root every chain ends at |
| `BasedOn` | `basedOn` on the story style and on the layout style |
| `BulletsAndNumberingListType` `BulletList` / `NumberedList` | Story `listKind` `bullet` / `numbered` |
| `KeepWithNext` 1 to 5 (lines of the next paragraph) | Story `keepWithNext`. 0 is false. A writer writes the base value, or 1 for a new style |
| `KeepWithPrevious` | Story `keepWithPrevious` |
| Style groups | Stay in the base. A grouped style's `Name` carries the group path with colons (`Headings:Heading1`), and its `Self` writes each colon as `%3a` (`ParagraphStyle/Headings%3aHeading1`). A new style goes in the root group |
| `<Color>` | One entity: `rig.meta.named` (`Name`, `Self`) and [`rig.paint.solid`](../schemas/paint/solid.md). `Space` `CMYK`: `ColorValue` divided by 100 is `cmyk`. `Space` `RGB`: `ColorValue` divided by 255 is `rgba`. `Model` `Spot` sets `ink` to `Name`. The `rgba` of a CMYK or LAB colour is a preview. `MixedInk` colours, tints, and gradients stay in the base |

The same attributes sit on a style or on a local range:

| ICML | Field | Notes |
|------|-------|-------|
| `PointSize` | `fontSize` | |
| `<Properties>` `<Leading>` | `leading` | A `Properties` child, not an attribute. `Auto` (point size times `AutoLeading`) = absent |
| `Justification` | `alignment`, `lastLineAlignment` | `LeftAlign` / `CenterAlign` / `RightAlign` are `left` / `center` / `right`. `LeftJustified` / `CenterJustified` / `RightJustified` / `FullyJustified` are `justify` with the last line `left` / `center` / `right` / `justify`. `lastLineAlignment` travels only with `justify`. `ToBindingSide` / `AwayFromBindingSide` stay in the base |
| `SpaceBefore` / `SpaceAfter` | `spaceBefore` / `spaceAfter` | |
| `FirstLineIndent` / `LeftIndent` / `RightIndent` | `firstLineIndent` / `leftIndent` / `rightIndent` | |
| `MinimumWordSpacing` / `DesiredWordSpacing` / `MaximumWordSpacing` | `wordSpacingMin` / `wordSpacingDesired` / `wordSpacingMax` | Percent of the space in both |
| `KeepLinesTogether` with `KeepFirstLines` / `KeepLastLines` | `keepFirstLines` / `keepLastLines` | `KeepLinesTogether` false is 0, whatever the counts say (InDesign's defaults are 2 and 2 with the switch off). `KeepAllLinesTogether` stays in the base |
| `Hyphenation` | `hyphenate` | |
| `GridAlignment` / `GridAlignFirstLineOnly` | `alignToBaselineGrid` / `baselineGridFirstLineOnly` | `AlignBaseline` is true, `None` is false. The em-box and ICF alignments stay in the base |
| `Tracking` | `tracking` | Thousandths of an em in both |
| `FillColor` | `paint` | The `<Color>` entity. `Swatch/None` stays in the base |
| `<Properties>` `<AppliedFont>` with `FontStyle` | `font` | Resolves to the declared [`rig.media.font_face`](../schemas/media/font-face.md) (family, nearest weight, `italic` when `FontStyle` says Italic or Oblique) and writes its asset. With no declared family `font` stays absent and the face stays in the base |
| `FontStyle` | `bold`, `italic` | Character only. A free string naming the face in the family (`Regular`, `Bold Italic`, `Bold Condensed`). Semibold, Bold, Heavy, or Black sets `bold`; Italic or Oblique sets `italic`. A writer writes `Regular`, `Bold`, `Italic`, or `Bold Italic` |
| `KerningMethod` | `kerningMode` | Character only. `$ID/Metrics` is `metrics`, `$ID/None` is `off`. `$ID/Optical` stays in the base |
| `BaselineShift` | `baselineShift` | Character only. Positive raises in both |
| `Capitalization` | `case` | Character only. `Normal` / `AllCaps` / `SmallCaps` are `none` / `upper` / `small-caps`. `CapToSmallCap` stays in the base |
| `Underline` / `StrikeThru` | `underline` / `strikethrough` | Character only |

ICML lengths are points, and so are the style lengths ([units](../schemas/layout/paragraph-style.md#units)). Nothing converts. A character-only attribute on a paragraph style stays in the base: `rig.layout.paragraph_style` does not hold it.

## Local formatting

A Rig run carries a style identity only ([run](../schemas/story/paragraph.md#run)). A range that sets attributes beyond its applied style imports as a local style:

- **One entity per distinct set of attributes.** Its story style is `basedOn` the applied style (absent under `[No ... style]`). Its layout style is `basedOn` the applied style's layout map and holds the mapped attributes above.
- **`stableId` is the range element, emptied of content.** Attributes are sorted by name, and `<Properties>` children follow sorted by element name: `<CharacterStyleRange AppliedCharacterStyle="CharacterStyle/$ID/[No character style]" FillColor="Color/Fox" FontStyle="Bold"/>`. A `Self` never starts with `<`, so a `stableId` that does is always local. `ParagraphBreakType` is not part of it - that is `breakType`.
- **`name`** is the applied style's name, then ` + `, then the attribute names: `[No character style] + FillColor, FontStyle`.

Equal sets share one entity. A writer writes a local style back as attributes on the range, never as a named style. Mapped fields changed in Rig overwrite those attributes; the rest come from the `stableId`. Attributes Rig does not map (`Position`, `HorizontalScale`, `AppliedConditions`, ...) ride in the `stableId`, so they come back too.

## Tables

| ICML | Rig |
|------|-----|
| `<Table>` | `rig.story.table`, with `rig.meta.named` `stableId` = `Self`. A paragraph that holds a table and text imports as the text before it, the table, and the text after it, each its own block |
| `HeaderRowCount` / `FooterRowCount` / `ColumnCount` | `headerRowCount` / `footerRowCount` / `columnCount`. `BodyRowCount` is derived from the cells; a writer writes it |
| `<Column>` `SingleColumnWidth` | `columnWidths` - points work as weights |
| `<Cell>` `Name` `"column:row"` (`"2:0"` is the third column of the first row), `ColumnSpan`, `RowSpan` | Cell `column`, `row`, `columnSpan`, `rowSpan` |
| Cell content | Cell `blocks`, mapped like the story |
| `AppliedTableStyle` | `style`: an entity with `rig.meta.named` (`Name`, `Self`) and [`rig.layout.table_style`](../schemas/layout/table-style.md). Table style attributes are not mapped yet and stay in the base |
| `<Row>` `SingleRowHeight`, `AppliedCellStyle`, table strokes and fills | Stay in the base |

A changed table's column widths scale to the base table's total width. A new table's total width is the writer's choice.

## Round trip

| Direction | Guarantee |
|-----------|-----------|
| ICML to Rig to ICML, nothing edited | The base file, unchanged |
| ICML to Rig to ICML, edited | Edited paragraphs, tables, styles, and colours are rewritten; everything else is the base, verbatim |
| Rig to ICML to Rig | Equal components for every mapped field, flow `role` included. Imported back into the document it came from, every entity keeps its `stableId`; into a new document, a style's or colour's `stableId` is its ICML `Self` |

Export merges the document onto the base:

1. **Outside the story and the paragraph, character, and colour definitions, copy the base.** That covers the `<?aid?>` instructions, `Document` attributes, inks, object / table / cell style groups, hyperlink destinations, conditions, and text variables.
2. **Styles and colours match by `Self`.** An entity matches the base definition whose `Self` equals its `stableId`, or else whose `Self` is `ParagraphStyle/`, `CharacterStyle/`, or `Color/` plus its name with each `:` written `%3a`. A mapped field that differs from what importing the base gives is written. Every other attribute stays as the base has it, so a value Rig cannot hold (`$ID/Optical`, `ToBindingSide`) survives until someone changes that field.
3. **A base style or colour with no entity was deleted.** Drop it, unless something kept from the base still names it. `[No paragraph style]`, `[No character style]`, `[Basic Paragraph]`, `None`, `Paper`, `Black`, and `Registration` always stay.
4. **An entity that matches nothing is new.** Add it with `Self` `ParagraphStyle/`, `CharacterStyle/`, or `Color/` plus its name, each `:` written `%3a`.
5. **The `<Story>` element and its children that are not text come from the base** (`StoryPreference`, `InCopyExportOption`, `MetadataPacketPreference`, `StandaloneDocumentPreference`). The writer sets the `rig:role` and `rig:flow` labels from the flow (absent `role` or `stableId` removes the label) and keeps every other label.
6. **Paragraphs match by content.** Import the base again. The longest in-order sequence of blocks whose style and runs equal that import (styles compared by `stableId`) is unchanged. An unchanged paragraph writes its base XML verbatim, with its hyperlinks, notes, footnotes, markers, XML tags, anchored objects, tracked changes, and local attributes. Blocks from one base paragraph (text around a table) match together.
7. **Every other block is written from Rig.** One `ParagraphStyleRange` per paragraph, one `CharacterStyleRange` per run, `<Br/>` between paragraphs (none after the last), and `\n` as `&#x2028;`. Between unchanged paragraphs, the rest pair in order with the remaining base paragraphs. A paired paragraph whose `breakType` is unchanged keeps the base break, `NextFrame` included. A paired run whose text and style are unchanged SHOULD keep the base markup around it.

A writer MUST NOT drop base markup from an unchanged paragraph. It MUST report markup it drops from an edited one.

Without a base (a story authored in Rig) a writer still emits a valid ICML: the two `<?aid?>` instructions (`SnippetType="InCopyInterchange"`), the built-in styles and colours, the document's styles and colours, and the story. InCopy defaults cover the rest.

## Stories from another source

A flow that started somewhere else - a [MarkBreak](markbreak.md) chapter, Markdown, Word - goes to InCopy and comes back into the same document:

1. **Export without a base.** The flow has no `language` `icml` buffer, so the writer emits a whole file. Its style and colour `Self` values are the kind prefix plus the entity's name. The Story labels carry `role` and the flow's `stableId`.
2. **Edit in InCopy.**
3. **Import into the document the flow came from.** The Story whose `rig:flow` label equals a flow's `stableId` updates that flow: its blocks are replaced and the file becomes its buffer. Styles and colours match as in export step 2 (`stableId`, else name), so they keep their `stableId`, and only mapped fields change. A style that is new in InCopy becomes a new entity. Without a match, the import adds a new flow.

From then on the buffer is the base, and later trips are merges.

A book is several flows, one file each. A style or colour shared by two files is one entity. When two files define it differently, the import keeps the document's definition and reports the difference - InDesign does the same when it places a story.

The other source does not follow along:

- **The original source is provenance.** A MarkBreak `.md` buffer is not rewritten by an InCopy import ([code.md](../schemas/media/code.md#source-or-compiled---one-truth)). Re-ingesting it replaces the flow and loses the InCopy edits. To keep both, write Markdown from the flow first - that writer belongs to the dialect, not this mapping.
- **A style with no layout map writes with no attributes.** MarkBreak's `Bold` is a name only. InCopy shows it as plain text until someone gives the style a look, in InCopy or in the Rig layout document. Import keeps it without a layout map until it sets a mapped attribute.
- **Pages stay in the Rig layout document.** An ICML story has no page, so the MarkBreak trim, margins, and facing pages do not travel and are not touched.
- **InCopy local formatting arrives as [local styles](#local-formatting).** To a Markdown writer they are ordinary character and paragraph styles. Their `stableId` means something only to an ICML writer.

## Left to the base

No Rig field holds these. They come back from the base while their paragraph or style is unchanged:

- Hyperlinks, cross-references, notes, footnotes, index and bookmark markers, XML tags, anchored objects and inline graphics
- Tracked changes (`<Change>` with `ChangeType` `InsertedText`, `DeletedText`, or `MovedText`): Rig reads the story with every change accepted, so `DeletedText` content does not import and the other two import as runs
- Conditional text (`AppliedConditions`), text variables, and `<?ACE n?>` special characters
- `Position` (`Superscript`, `Subscript`, and the OpenType positions), horizontal and vertical scale, skew, tints, gradients, text strokes, OpenType features
- Justification letterspacing, optical kerning, binding-side alignment, `StartParagraph`, nested and GREP styles, drop caps, paragraph rules
- Table and cell style attributes, row heights, cell strokes and fills

## Encodings (fulfillment)

| File | Role |
|------|------|
| `.icml` | One story - map into / out of `rig.story.*` plus the layout style maps |
| `.icma` | InCopy assignment (`<?aid type="assignment"?>`): a subset of an InDesign document with its content, styles, and page geometry; its `AssignedStory` elements point at the `.icml` files. Import each story; the assignment stays with InDesign |
| `.icap` | Assignment package: the `.icma`, its `.icml` stories, and linked images, zipped. Unpack, then as `.icma` |
| `.icmt` | InCopy template - styles and sample content, no layout |
| `.incx` / `.inca` / `.incp` | InCopy CS2 and CS3 story, assignment, and package. `.incd` is InCopy CS. Open in current InCopy and save as ICML first |

Example: [`examples/icml-story.json`](../examples/icml-story.json).
