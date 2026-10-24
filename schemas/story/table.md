---
id: "rig.story.table"
maturity: "stable"
summary: "Semantic table in a rig.story.flow. Format when present."
fields:
  - name: "columnCount"
    ref: "int"
    required: true
    meaning: "Number of columns"
  - name: "headerRowCount"
    ref: "int"
    meaning: "Optional. Header rows at the top; absent = 0"
    absent: "0"
  - name: "footerRowCount"
    ref: "int"
    meaning: "Optional. Footer rows at the bottom; absent = 0"
    absent: "0"
  - name: "columnWidths"
    type: "array"
    itemsRef: "float"
    meaning: "Optional. Fractional column weights (unitless, normalised by the host); absent / empty = equal columns"
    absent: "/ empty = equal columns"
  - name: "style"
    ref: "entity"
    meaning: "Optional. rig.layout.table_style dressing this table; absent = the document's default table style"
    absent: "the document's default table style"
  - name: "cells"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"column\",\"row\"],\"properties\":{\"column\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"row\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"columnSpan\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"rowSpan\":{\"$ref\":\"./_defs.schema.json#/$defs/int\"},\"blocks\":{\"type\":\"array\",\"items\":{\"$ref\":\"./_defs.schema.json#/$defs/entity\"}}}}"
    required: true
    meaning: "Occupied cells"
---
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
