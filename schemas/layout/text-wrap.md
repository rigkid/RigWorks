---
id: "rig.layout.text_wrap"
maturity: "draft"
summary: "Text wrap - text in frames on the same page flows around this entity. Format when present."
fields:
  - name: "shape"
    type: "string"
    enum: ["box","contour","alpha"]
    meaning: "Optional. box (the geometry bounds), contour (the geometry itself), or alpha (the sprite texture's opaque pixels). Absent = box"
    absent: "box"
  - name: "offset"
    ref: "faceInsets"
    meaning: "number[1..6]"
  - name: "sides"
    type: "string"
    enum: ["both","left","right","largest","jump"]
    meaning: "Optional. Where text may sit beside the wrap area: both, left, right, largest, jump. Absent = both"
    absent: "both"
  - name: "alphaThreshold"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. With shape alpha, pixels above this opacity are inside the area; absent = 0"
    absent: "0"
---
# `rig.layout.text_wrap`

Text wrap - text in frames on the same page flows around this entity. Format when present.

Compose on a page item: an image frame ([`rig.render.image_fit`](../render/image-fit.md)), a drawable, or a [`rig.layout.frame`](frame.md). The **wrap area** is `shape`, grown outward by `offset`. Lines of text in any other `rig.layout.frame` on the same page skip the area where it overlaps them; stacking order does not matter. A frame never wraps around itself.

| Field | Type | Meaning |
|-------|------|---------|
| `shape` | enum | Optional. `box` (the geometry bounds), `contour` (the geometry itself), or `alpha` (the sprite texture's opaque pixels). Absent = `box` |
| `offset` | number \| number[1..6] | Optional. Distance the area grows **outward**, in local units (same channels as page `margins`; floor and ceiling are unused). With `contour` or `alpha`, only the first value is used, all round. Absent = 0 |
| `sides` | enum | Optional. Where text may sit beside the wrap area: `both`, `left`, `right`, `largest`, `jump`. Absent = `both` |
| `alphaThreshold` | float | Optional. With `shape` `alpha`, pixels above this opacity are inside the area; absent = 0 |

`sides`:

| Literal | Text sits |
|---------|-----------|
| `both` | On either side of the area, per line |
| `left` | Only to the left of the area |
| `right` | Only to the right of the area |
| `largest` | On whichever side has more room, per line |
| `jump` | Not beside the area: lines resume below it |

`alpha` reads the texture as it is placed by `image_fit`, clipped by the frame. Without a texture it is `contour`; `contour` on an entity without geometry is `box`.

Mappings: CSS `float` / `shape-outside` in [css.md](../../docs/css.md); InDesign `TextWrapPreference` in [idml.md](../../docs/idml.md).
