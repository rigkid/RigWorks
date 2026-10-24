---
id: "rig.layout.table_style"
maturity: "stable"
summary: "Visual map for tables (rig.story.table). Format when present."
fields:
  - name: "name"
    ref: "string"
    meaning: "Optional. Style label"
  - name: "borderStroke"
    ref: "float"
    meaning: "Optional. Outline stroke; 0 / absent = no outline"
  - name: "borderColor"
    ref: "entity"
    meaning: "Optional. Paint entity (rig.paint.solid) for the outline"
  - name: "headerFill"
    ref: "entity"
    meaning: "Optional. Paint entity for the header row band"
  - name: "rowStripeFill"
    ref: "entity"
    meaning: "Optional. Paint entity for the alternating body row band"
  - name: "cellInset"
    ref: "float"
    meaning: "Optional. Cell padding"
  - name: "cellSize"
    ref: "float"
    meaning: "Optional. Body cell type size (pt)"
  - name: "cellLeading"
    ref: "float"
    meaning: "Optional. Cell line height / row pitch (pt)"
  - name: "cellInk"
    ref: "entity"
    meaning: "Optional. Paint entity for body cell text"
  - name: "headerInk"
    ref: "entity"
    meaning: "Optional. Paint entity for header row text"
---
# `rig.layout.table_style`

Visual map for tables ([`rig.story.table`](../story/table.md)). Format when present.

Story tables stay content-only (rows + cells). Cell type size, leading, fills, and inks live here so any host sets the same table. One style normally dresses every table in a document - a table may point at a specific style entity when it must differ.

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Optional. Style label |
| `borderStroke` | float | Optional. Outline stroke; 0 / absent = no outline |
| `borderColor` | entity | Optional. Paint entity ([`rig.paint.solid`](../paint/solid.md)) for the outline |
| `headerFill` | entity | Optional. Paint entity for the header row band |
| `rowStripeFill` | entity | Optional. Paint entity for the alternating body row band |
| `cellInset` | float | Optional. Cell padding |
| `cellSize` | float | Optional. Body cell type size (pt) |
| `cellLeading` | float | Optional. Cell line height / row pitch (pt) |
| `cellInk` | entity | Optional. Paint entity for body cell text |
| `headerInk` | entity | Optional. Paint entity for header row text |

Colours are paint entities, same as [`rig.layout.paragraph_style`](paragraph-style.md) `paint` - a paint carries screen `rgba` plus exact `cmyk` / `ink`, so a print host keeps its separations. Raw rgba fields here would round that away. Absent = host default.

Do not put these fields on `rig.story.table`.
