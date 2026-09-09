# `rig.story.table`

Semantic table in a [`rig.story.flow`](flow.md). Format when present.

Column count, header/footer row counts, cells with spans. No table/cell visual styles - fills, inks, and type live on [`rig.layout.table_style`](../layout/table-style.md). Header rows are `row < headerRowCount`; footer rows are the last `footerRowCount` rows.

| Field | Type | Meaning |
|-------|------|---------|
| `columnCount` | int | Number of columns |
| `headerRowCount` | int | Optional. Header rows at the top; absent = 0 |
| `footerRowCount` | int | Optional. Footer rows at the bottom; absent = 0 |
| `columnWidths` | float[] | Optional. Fractional column weights (unitless, normalised by the host); absent / empty = equal columns |
| `style` | entity | Optional. [`rig.layout.table_style`](../layout/table-style.md) dressing this table; absent = the document's default table style |
| `cells` | cell[] | Occupied cells |

Body row count is derived from the cells (max `row` + 1 minus header and footer). Do not store a parallel `bodyRowCount`.

## Cell

| Field | Type | Meaning |
|-------|------|---------|
| `column` | int | Column index, 0-based |
| `row` | int | Row index, 0-based |
| `columnSpan` | int | Optional. Columns occupied; absent = 1 |
| `rowSpan` | int | Optional. Rows occupied; absent = 1 |
| `blocks` | entity[] | Optional. Nested [`rig.story.paragraph`](paragraph.md) and/or nested tables, in order |

Do not also list cell `blocks` on the parent flow. Empty `blocks` is an empty cell.
