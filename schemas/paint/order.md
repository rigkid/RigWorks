---
id: "rig.paint.order"
maturity: "draft"
summary: "Draw order of fill, stroke, and markers on one drawable. Format when present."
fields:
  - name: "layers"
    type: "array"
    itemsType: "string"
    itemsEnum: ["fill","stroke","markers"]
    meaning: "Optional. Permutation of fill, stroke, markers. Absent or empty = fill, then stroke, then markers"
    absent: "or empty = fill, then stroke, then markers"
---
# `rig.paint.order`

Draw order of fill, stroke, and markers on one drawable. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `layers` | enum[] | Optional. Permutation of `fill`, `stroke`, `markers`. Absent or empty = fill, then stroke, then markers |

Omit this component when the default order is enough. Colour and width stay on [`rig.paint.fill_stroke`](fill-stroke.md) / [`fill`](fill.md) / [`stroke`](stroke.md). Marker refs stay on [`rig.paint.markers`](markers.md).
