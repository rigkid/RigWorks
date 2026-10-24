---
id: "rig.pixel.tile_set"
maturity: "draft"
summary: "Indexed pixel sheet for tiles / sprites. Format when present."
fields:
  - name: "palette"
    ref: "entity"
    required: true
    meaning: "Entity with rig.pixel.palette"
  - name: "tileWidth"
    ref: "int"
    required: true
    meaning: "Tile width in pixels"
  - name: "tileHeight"
    ref: "int"
    required: true
    meaning: "Tile height in pixels"
  - name: "tilesAcross"
    ref: "int"
    required: true
    meaning: "Columns in the sheet (≥ 1)"
  - name: "tileRows"
    ref: "int"
    required: true
    meaning: "Rows in the sheet (≥ 1)"
  - name: "indices"
    type: "array"
    itemsRef: "uint8"
    required: true
    meaning: "Row-major palette indices for the full sheet; length = tilesAcross * tileRows * tileWidth * tileHeight"
  - name: "flags"
    type: "array"
    itemsRef: "uint8"
    meaning: "Optional. Per-tile flag byte; length = tilesAcross * tileRows; absent or empty = no flags"
    absent: "or empty = no flags"
---
# `rig.pixel.tile_set`

Indexed pixel sheet for tiles / sprites. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for a label. Colour identity is [`rig.pixel.palette`](palette.md) via `palette`. Prefer this over shipping large [`rig.pixel.raster`](raster.md) RGBA when the host is palette-indexed.

| Field | Type | Meaning |
|-------|------|---------|
| `palette` | entity | Entity with [`rig.pixel.palette`](palette.md) |
| `tileWidth` | int | Tile width in pixels |
| `tileHeight` | int | Tile height in pixels |
| `tilesAcross` | int | Columns in the sheet (≥ 1) |
| `indices` | uint8[] | Row-major palette indices for the full sheet; length = `tilesAcross * tileRows * tileWidth * tileHeight` |
| `tileRows` | int | Rows in the sheet (≥ 1) |
| `flags` | uint8[] | Optional. Per-tile flag byte; length = `tilesAcross * tileRows`; absent or empty = no flags |

No texture ids. Decode / atlas upload = fulfillment.
