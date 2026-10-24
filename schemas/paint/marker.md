# `rig.paint.marker`

Marker graphic placed on stroke vertices. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | float | Optional. Tile width |
| `height` | float | Optional. Tile height |
| `ref` | vec2 | Optional. Origin inside the tile; absent = (0, 0) |
| `orient` | enum | Optional. `auto`, `auto-start-reverse`, or `angle`. Absent = `auto` |
| `orientDegrees` | float | Optional. Used when `orient` is `angle` |
| `units` | enum | Optional. `stroke-width` or `user-space`. Absent = `stroke-width` |

Children of this entity are the drawable content. A path names this entity from [`rig.paint.markers`](markers.md).
