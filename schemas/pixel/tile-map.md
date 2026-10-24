---
id: "rig.pixel.tile_map"
maturity: "experimental"
summary: "Tile-index grid over a tile set. Format when present."
fields:
  - name: "tileSet"
    ref: "entity"
    required: true
    meaning: "Entity with rig.pixel.tile_set"
  - name: "width"
    ref: "int"
    required: true
    meaning: "Width in tiles"
  - name: "height"
    ref: "int"
    required: true
    meaning: "Height in tiles"
  - name: "originX"
    ref: "int"
    meaning: "Optional. Column where this region sits inside a larger host map; absent = 0"
    absent: "0"
  - name: "originY"
    ref: "int"
    meaning: "Optional. Row where this region sits inside a larger host map; absent = 0"
    absent: "0"
  - name: "tiles"
    type: "array"
    itemsRef: "int"
    required: true
    meaning: "Row-major tile indices into the tile set; length = width * height"
---
# `rig.pixel.tile_map`

Tile-index grid over a tile set. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for a label. The sheet is [`rig.pixel.tile_set`](tile-set.md) via `tileSet`.

| Field | Type | Meaning |
|-------|------|---------|
| `tileSet` | entity | Entity with [`rig.pixel.tile_set`](tile-set.md) |
| `width` | int | Width in tiles |
| `height` | int | Height in tiles |
| `originX` | int | Optional. Column where this region sits inside a larger host map; absent = 0 |
| `originY` | int | Optional. Row where this region sits inside a larger host map; absent = 0 |
| `tiles` | int[] | Row-major tile indices into the tile set; length = `width * height` |

`width` × `height` is the meaningful area, not the host's allocation. A 16×2 banner inside a 128×32 console map is a 16×2 map with an origin - not a 128×32 grid padded with zeros.

Camera / scroll / clip stay in the host.
