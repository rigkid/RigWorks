---
id: "rig.media.text_path"
maturity: "stable"
summary: "Bind a canvas text run to a baseline contour. Format when present."
fields:
  - name: "path"
    ref: "entity"
    required: true
    meaning: "Baseline. It carries rig.geometry.path or rig.geometry.arc, one of them"
  - name: "startOffset"
    ref: "float"
    meaning: "Optional. Absent = 0"
    absent: "0"
  - name: "startOffsetMode"
    type: "string"
    enum: ["length","ratio"]
    meaning: "Optional. length or ratio. Absent = length. length is a scene length along the path. ratio is 0-1 of the current path length"
    absent: "length"
  - name: "method"
    type: "string"
    enum: ["align","stretch"]
    meaning: "Optional. align or stretch. Absent = align. align keeps glyph advances. stretch scales the run along the path"
    absent: "align"
  - name: "spacing"
    type: "string"
    enum: ["auto","exact"]
    meaning: "Optional. auto or exact. Absent = exact"
    absent: "exact"
  - name: "side"
    type: "string"
    enum: ["left","right"]
    meaning: "Optional. left or right. Absent = left. Which side of the direction of travel the glyphs sit on"
    absent: "left"
---
# `rig.media.text_path`

Bind a canvas text run to a baseline contour. Format when present.

Compose on the same entity as [`rig.media.text`](text.md). The contour stays on its own entity. Colour stays on paint. Glyph positions along the curve are a host cache.

| Field | Type | Meaning |
|-------|------|---------|
| `path` | entity | Baseline. It carries [`rig.geometry.path`](../geometry/path.md) or [`rig.geometry.arc`](../geometry/arc.md), one of them |
| `startOffset` | float | Optional. Absent = 0 |
| `startOffsetMode` | enum | Optional. `length` or `ratio`. Absent = `length`. `length` is a scene length along the path. `ratio` is 0-1 of the current path length |
| `method` | enum | Optional. `align` or `stretch`. Absent = `align`. `align` keeps glyph advances. `stretch` scales the run along the path |
| `spacing` | enum | Optional. `auto` or `exact`. Absent = `exact` |
| `side` | enum | Optional. `left` or `right`. Absent = `left`. Which side of the direction of travel the glyphs sit on |

Where on the run the offset lands is [`rig.media.text`](text.md) `anchor`. The host rotates each glyph to the tangent - that rotation is not a field.

Do not grow text with a path command list. Do not flatten the run into outlines on this component.
