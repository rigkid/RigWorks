# CSS to RigWorks

How a CSS style sheet maps onto layout, story, media, paint, and render schemas, and how it round-trips. CSS is an encoding at the boundary ([design philosophy](design-philosophy.md#encoding)); there is no `rig.css.*`.

## The sheet travels as text

A style sheet is [`rig.media.code`](../schemas/media/code.md) with `language` `css` ([text is data](design-philosophy.md)). A document carries at most one sheet. Its `url(...)` values are [`rig.media.asset_ref`](../schemas/media/asset-ref.md) paths, relative to the package `data/` folder.

Compiling the sheet writes ordinary components - [`rig.layout.paragraph_style`](../schemas/layout/paragraph-style.md), [`rig.layout.character_style`](../schemas/layout/character-style.md), [`rig.layout.table_style`](../schemas/layout/table-style.md), [`rig.layout.page`](../schemas/layout/page.md), [`rig.layout.frame`](../schemas/layout/frame.md), [`rig.layout.text_wrap`](../schemas/layout/text-wrap.md), [`rig.media.font_face`](../schemas/media/font-face.md), [`rig.paint.solid`](../schemas/paint/solid.md), [`rig.paint.fill`](../schemas/paint/fill.md), [`rig.paint.stroke`](../schemas/paint/stroke.md), [`rig.paint.stroke_style`](../schemas/paint/stroke-style.md), [`rig.render.blend`](../schemas/render/blend.md), [`rig.render.image_fit`](../schemas/render/image-fit.md) - so a host without a CSS parser still reads the result.

Order of truth:

- **The sheet owns every mapped field its selectors reach.** A compile writes the cascaded value, or clears the field to absent when no rule sets it. Fields the mapping below does not cover are left alone.
- **A host that edits an owned field writes the change into the sheet text** before saving. Otherwise the next compile reverts it.
- **A selector creates nothing it names.** A class that names no style matches nothing, as in CSS. What a declaration needs - a paint entity for a colour, a stroke on a frame, a [role variant](#role-variants) - the compile creates, and removes again when no rule sets it.

## Round trip

| Direction | Guarantee |
|-----------|-----------|
| CSS to Rig to CSS | Exact. The sheet text travels unchanged; compiled fields are derived from it |
| Rig to CSS to Rig | Equal components for every mapped field. A host emits one rule per style or entity it can name (below), with only the fields set on it |
| Unmapped CSS | Kept in the text; the compile reports it and writes nothing. A host that maps more picks it up later |

A Rig field with no CSS property travels as a custom property, `--rig-` plus the field name in kebab case: `keepLastWords` is `--rig-keep-last-words`. Custom properties are valid CSS, so the sheet still parses everywhere.

A host MUST report every selector, declaration, or value it does not compile. It MUST NOT drop text from the sheet.

## Selectors

| CSS | Reaches |
|-----|---------|
| `p` | Root layout paragraph styles (no `basedOn`) |
| `p.Name`, `.Name` | The layout paragraph style for the story paragraph style named `Name` ([`rig.meta.named`](../schemas/meta/named.md)) |
| `span.Name` | The layout character style for the story character style named `Name` |
| `[data-role=R] p`, `[data-role=R] p.Name`, `[data-role=R] .Name` | The same styles' [role variants](#role-variants) for flow role `R` |
| `img` | Entities with [`rig.render.sprite`](../schemas/render/sprite.md) |
| `div` | Entities with `rig.layout.frame` (text frames) |
| `img.tag`, `div.tag` | Those that also carry `tag` in [`rig.meta.tags`](../schemas/meta/tags.md) |
| `table`, `table.Name` | Every `rig.layout.table_style`, or the one named `Name` (`rig.meta.named`, else its `name` field) |
| `th`, `td`, `tbody tr:nth-child(even)` | Parts of those table styles, alone or after `table` / `table.Name` - [Tables](#tables) |
| `#id` | The entity whose `rig.meta.named` `stableId` is `id` |
| `@page` | Every `rig.layout.page`, masters included |
| `@font-face` | One `rig.media.font_face` plus its font `rig.media.asset_ref` |

Style names are CSS-escaped: `p.Numbered\ List`. Specificity and source order decide as in CSS.

A selector reaches the styles it names, not the styles based on them. Inheritance is `basedOn`, resolved the Rig way. Because `p` reaches the root styles, `p { color: ... }` still colours every paragraph that does not set its own. To preview an emitted sheet in a browser, give each element every class in its `basedOn` chain (`class="Note Caption"`) and wrap each flow in an element with `data-role`.

Not compiled: other combinators, pseudo-classes, and pseudo-elements; other attribute selectors; `@media`, `@import`, `!important`.

## Paragraph and character properties

| CSS | Field | Notes |
|-----|-------|-------|
| `font-family`, `font-weight`, `font-style` | `font` | Resolves to the declared `rig.media.font_face` (family, nearest weight, style) and writes its asset. With no declared family: `font-weight` 600 and up sets character `bold`; `italic` / `oblique` sets `italic` |
| `font-size` | `fontSize` | |
| `line-height` | `leading` | Unitless and `%` multiply the font size |
| `color` | `paint` | A `rig.paint.solid`. `rgb()` / hex sets `rgba`; `device-cmyk()` sets `cmyk`; declare both to keep both. `--rig-ink` sets `ink` |
| `text-align` | `alignment` | `left`, `center`, `right`, `justify` |
| `text-align-last` | `lastLineAlignment` | |
| `margin-top` / `margin-bottom` | `spaceBefore` / `spaceAfter` | |
| `margin-left` / `margin-right` | `leftIndent` / `rightIndent` | |
| `text-indent` | `firstLineIndent` | |
| `letter-spacing` | `tracking` | 1 em = 1000 |
| `hyphens` | `hyphenate` | `auto` = true, `manual` = false |
| `orphans` / `widows` | `keepFirstLines` / `keepLastLines` | |
| `font-kerning` | `kerningMode` | `none` = `off`; `auto` / `normal` = `metrics` |
| `vertical-align: <length>` | `baselineShift` | Positive raises, in both |
| `text-transform` | `case` | `uppercase` = `upper`, `lowercase` = `lower` |
| `font-variant-caps: small-caps` | `case` | `small-caps` |
| `text-decoration-line` (or `text-decoration`) | `underline`, `strikethrough` | `underline`, `line-through`, both, or `none`. Character styles only: on `p` it stays text. The line takes the run's paint and the font's metrics, so `text-decoration-color`, `-style`, and `-thickness` stay text |

Custom properties: `--rig-word-spacing-min`, `--rig-word-spacing-desired`, `--rig-word-spacing-max` (CSS `word-spacing` adds a length; Rig stores a percentage of the space), `--rig-letter-spacing-min`, `--rig-letter-spacing-max`, `--rig-keep-last-words`, `--rig-align-to-baseline-grid`, `--rig-baseline-grid-first-line-only`.

`grepStyles` is not mapped: a sheet never owns it.

## Role variants

`[data-role=chapter] p.Body` reaches the `Body` map's variant for flows with [`rig.story.flow`](../schemas/story/flow.md) `role` `chapter` - a [`flowRole`](../schemas/layout/paragraph-style.md#role-variants) map. The compile creates the variant when a rule sets a field on it, with `storyStyle` and `basedOn` pointing at the plain map so it holds only what the rule sets, and removes it when no rule reaches it. `[data-role=chapter] p` makes variants of every root style. Emit one rule per variant with its own fields only.

## Page

| CSS | Field | Notes |
|-----|-------|-------|
| `@page { size: W H }` | `width`, `height` | |
| `@page { margin }` | `margins` | Recto channels; the verso swaps left and right ([markbreak.md](markbreak.md)). `:left` / `:right` compile only when they mirror each other |
| `@page { bleed }` | `bleed` | CSS Paged Media takes one value; uneven bleed is `--rig-bleed` with up to four values |

## Fonts

`@font-face { font-family; src: url(...); font-weight; font-style }` is one `rig.media.font_face` (`family`, `asset`, `weight`, `style`) and its font `asset_ref`. A weight range (a variable face) leaves `weight` absent.

## Frames

`img` and `div` share these. The element's border box is the frame: the geometry for an image frame, `width` by `height` for a text frame. Size and position are the layout, not the sheet - `width`, `height`, `top`, `left`, and `position` stay text.

| CSS | Field | Notes |
|-----|-------|-------|
| `background-color` | [`rig.paint.fill`](../schemas/paint/fill.md) `paint` | A `rig.paint.solid`, as `color`. Draws under the content. `background-image` stays text |
| `border` (all four sides alike) | [`rig.paint.stroke`](../schemas/paint/stroke.md) `paint` + `width`, [`rig.paint.stroke_style`](../schemas/paint/stroke-style.md) `align` `inside` | A CSS border lies inside the border box. Sides that differ stay text |
| `border-style` | `stroke_style` `dash` | `solid` = no dash; `dashed` = `[3w, 3w]`; `dotted` = `[0, 2w]` with `cap` `round` (`w` = border width). `--rig-dash` gives any other array. `none` = no stroke; other styles stay text |
| `opacity` | [`rig.render.blend`](../schemas/render/blend.md) `opacity` | Applies to the frame and its content together |
| `mix-blend-mode` | `blend` `blendMode` | Same literals. `add`, `subtract`, and `disabled` are not CSS: `--rig-blend-mode` |
| `float: left` / `right` | [`rig.layout.text_wrap`](../schemas/layout/text-wrap.md) `sides` `right` / `left` | Text flows on the other side; the frame does not move. `float: none` = no wrap. `--rig-wrap-sides` gives `both`, `largest`, and `jump` |
| `shape-outside: border-box` / `url(<the sprite's texture>)` | `text_wrap` `shape` `contour` / `alpha` | With `float` alone the shape is `box`. Other shapes stay text |
| `shape-margin` / `shape-image-threshold` | `text_wrap` `offset` / `alphaThreshold` | One value all round; `--rig-wrap-offset` takes up to four for `box` |

## Images

| CSS | Field | Notes |
|-----|-------|-------|
| `object-fit` | `rig.render.image_fit` `fit` | Same five values |
| `object-position` | `positionX`, `positionY`, `offsetX`, `offsetY` | `30% 70%` sets the ratios; `right 4mm top 2mm` sets ratio 1 and offset -4 mm, ratio 0 and offset 2 mm; `calc(30% + 4mm)` sets both |
| `padding` | `insets`, plus the border width | CSS fits the image inside the border and the padding. Emit `padding` as `insets` minus the border width; when that is negative, emit `--rig-insets` instead |
| `--rig-image-scale` | `scale` | No CSS property scales content inside its box |
| `border-radius: <length>` | `rig.geometry.rectangle` `cornerRadius` | One radius; per-corner or elliptical radii stay text |
| `image-resolution: from-image` | | The natural-size rule in [image-fit](../schemas/render/image-fit.md#placement). Emit it; other values stay text |

## Text frames

| CSS | Field | Notes |
|-----|-------|-------|
| `padding` | `insets` | A frame's stroke stays on its box, so the border does not add to the inset |
| `column-count` (or `columns: N`) | `columnCount` | `auto` = absent |
| `column-gap` | `columnGutter` | `normal` is 1 em in CSS; emit the length whenever `columnCount` is above 1 |
| `--rig-first-baseline`, `--rig-first-baseline-min` | `firstBaseline`, `firstBaselineMin` | |

`div` padding works like the CSS `box-sizing: border-box` model: the frame box stays `width` by `height`, and the text sits inside the insets.

## Tables

One [`rig.layout.table_style`](../schemas/layout/table-style.md) dresses every table that names it, so table rules compile onto the style, not onto cells.

| CSS | Field | Notes |
|-----|-------|-------|
| `table { border: W solid C }` | `borderStroke`, `borderColor` | Other border styles stay text |
| `th { background-color }` / `th { color }` | `headerFill` / `headerInk` | Header rows are `row < headerRowCount` |
| `td { color }` | `cellInk` | |
| `td { font-size }` / `td { line-height }` | `cellSize` / `cellLeading` | |
| `td { padding }` | `cellInset` | One value; sides that differ stay text |
| `tbody tr:nth-child(even) { background-color }` | `rowStripeFill` | The 2nd, 4th, ... body row |

## Units

Lengths (`mm`, `cm`, `Q`, `in`, `pt`, `pc`, `px` at 96 per inch) convert to the unit of the field they land in. `em` is the resolved font size of the same style.

- **Points** (1/72 in): every length on the paragraph, character, and table styles - type sizes, leading, spacing, indents, baseline shift, cell inset, table border ([units](../schemas/layout/paragraph-style.md#units)).
- **The page or document unit**: page size, margins, bleed; frame insets and gutters; image-fit offsets and insets; stroke widths, dashes, corner radii, and wrap offsets (local units).

## Left to the text

Every mapped property has a home. These stay in the sheet text, reported and unchanged, because no Rig field holds them:

- Borders whose sides differ, and table cell padding whose sides differ
- `background-image`, gradients, `box-shadow`, `filter`
- `text-decoration` on a paragraph, and decoration colour, style, and thickness
- `shape-outside` basic shapes (`circle()`, `polygon()`) that are not the frame's own geometry
- Size and position (`width`, `height`, `top`, `left`, `position`) - placement is the layout
