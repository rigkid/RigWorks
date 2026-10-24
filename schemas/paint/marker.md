---
id: "rig.paint.marker"
maturity: "stable"
summary: "Marker graphic placed on stroke vertices. Format when present."
fields:
  - name: "width"
    ref: "float"
    meaning: "Optional. Tile width"
  - name: "height"
    ref: "float"
    meaning: "Optional. Tile height"
  - name: "ref"
    ref: "vec2"
    meaning: "Optional. Origin inside the tile; absent = (0, 0)"
    absent: "(0, 0)"
  - name: "orient"
    type: "string"
    enum: ["auto","auto-start-reverse","angle"]
    meaning: "Optional. auto, auto-start-reverse, or angle. Absent = auto"
    absent: "auto"
  - name: "orientDegrees"
    ref: "float"
    meaning: "Optional. Used when orient is angle"
  - name: "units"
    type: "string"
    enum: ["stroke-width","user-space"]
    meaning: "Optional. stroke-width or user-space. Absent = stroke-width"
    absent: "stroke-width"
---
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
