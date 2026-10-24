---
id: "rig.paint.pattern"
maturity: "draft"
summary: "Tiled paint. Format when present."
fields:
  - name: "width"
    ref: "float"
    required: true
    meaning: "Tile width"
  - name: "height"
    ref: "float"
    required: true
    meaning: "Tile height"
  - name: "units"
    type: "string"
    enum: ["object","user-space"]
    meaning: "Optional. object or user-space. Absent = object"
    absent: "object"
  - name: "contentUnits"
    type: "string"
    enum: ["object","user-space"]
    meaning: "Optional. object or user-space. Absent = user-space"
    absent: "user-space"
---
# `rig.paint.pattern`

Tiled paint. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | float | Tile width |
| `height` | float | Tile height |
| `units` | enum | Optional. `object` or `user-space`. Absent = `object` |
| `contentUnits` | enum | Optional. `object` or `user-space`. Absent = `user-space` |

Tile pose is [`rig.spatial.transform`](../spatial/transform.md) on this entity. Children are the tile. A drawable references this entity through [`rig.paint.fill`](fill.md) / [`stroke`](stroke.md) `paint`.
