---
id: "rig.layout.frame"
maturity: "draft"
summary: "Text frame - a box a rig.story.flow flows through. Format when present."
fields:
  - name: "width"
    ref: "float"
    required: true
    meaning: "Box width in the parent page unit (or document.defaultUnit)"
  - name: "height"
    ref: "float"
    required: true
    meaning: "Box height"
  - name: "insets"
    ref: "faceInsets"
    meaning: "number[1..6]"
  - name: "columnCount"
    ref: "int"
    meaning: "Optional. Text columns; absent = 1"
    absent: "1"
  - name: "columnGutter"
    ref: "float"
    meaning: "Optional. Space between columns; absent = 0"
    absent: "0"
  - name: "firstBaseline"
    type: "string"
    enum: ["ascent","cap-height","leading","x-height","em-box","fixed"]
    meaning: "Optional. How the first line sits: ascent, cap-height, leading, x-height, em-box, fixed. Absent = ascent"
    absent: "ascent"
  - name: "firstBaselineMin"
    ref: "float"
    meaning: "Optional. Minimum first-baseline offset from the inset top. When firstBaseline is fixed, this is the offset"
---
# `rig.layout.frame`

Text frame - a box a [`rig.story.flow`](../story/flow.md) flows through. Format when present.

Bounds, columns, insets, and first baseline. Thread several frames with [`rig.layout.frame_chain`](frame-chain.md). Parent the frame to a [`rig.layout.page`](page.md) (or master) with [`rig.spatial.relationship`](../spatial/relationship.md). Pose is [`rig.spatial.transform`](../spatial/transform.md) - do not put `x` / `y` here.

This is not [`rig.geometry.rectangle`](../geometry/rectangle.md) (a drawable). An image frame is geometry plus [`rig.render.image_fit`](../render/image-fit.md), not this schema. Text that flows around another item is [`rig.layout.text_wrap`](text-wrap.md) on that item. Anchored objects stay out - [idml.md](../../docs/idml.md).

A frame's background and border compose on the frame entity, with the box (`width` by `height`) as their contour: [`rig.paint.fill`](../paint/fill.md) draws under the text, [`rig.paint.stroke`](../paint/stroke.md) and [`rig.paint.stroke_style`](../paint/stroke-style.md) over it, and [`rig.render.blend`](../render/blend.md) applies to all three. Insets do not move the stroke.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | float | Box width in the parent page `unit` (or `document.defaultUnit`) |
| `height` | float | Box height |
| `insets` | number \| number[1..6] | Optional. Face insets **inward** from the box (same channels as page `margins`). Absent = no insets |
| `columnCount` | int | Optional. Text columns; absent = 1 |
| `columnGutter` | float | Optional. Space between columns; absent = 0 |
| `firstBaseline` | enum | Optional. How the first line sits: `ascent`, `cap-height`, `leading`, `x-height`, `em-box`, `fixed`. Absent = `ascent` |
| `firstBaselineMin` | float | Optional. Minimum first-baseline offset from the inset top. When `firstBaseline` is `fixed`, this is the offset |

Equal columns from `columnCount` + `columnGutter`. Per-column widths stay out.

Which point of the box is local (0,0) is [`rig.spatial.anchor`](../spatial/anchor.md). Absent anchor means top-left of the box.

Name the frame by composing [`rig.meta.named`](../meta/named.md). Overflow text is fulfillment state - do not store it here.
