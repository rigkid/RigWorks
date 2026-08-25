# `rig.layout.frame`

Text frame — a box a [`rig.story.flow`](../story/flow.md) flows through. Format when present.

Bounds, columns, insets, and first baseline. Thread several frames with [`rig.layout.frame_chain`](frame-chain.md). Parent the frame to a [`rig.layout.page`](page.md) (or master) with [`rig.spatial.relationship`](../spatial/relationship.md). Pose is [`rig.spatial.transform`](../spatial/transform.md) — do not put `x` / `y` here.

This is not [`rig.geometry.rectangle`](../geometry/rectangle.md) (a drawable). Graphic frames, object styles, text wrap, and anchored objects stay out — [idml.md](../../docs/idml.md).

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

Which point of the box is local (0,0) is [`rig.spatial.anchor`](../spatial/anchor.md). Absent anchor ⇒ top-left of the box.

Name the frame by composing [`rig.meta.named`](../meta/named.md). Overflow text is fulfillment state — do not store it here.
