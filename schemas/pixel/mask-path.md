---
id: "rig.pixel.mask_path"
maturity: "draft"
summary: "Polygon used as a compositor mask."
fields:
  - name: "strokeWidth"
    ref: "float"
    meaning: "Optional. Canvas-px stroke; absent = 16"
    absent: "16"
  - name: "closed"
    ref: "bool"
    meaning: "Optional. Absent = true"
    absent: "true"
  - name: "filled"
    ref: "bool"
    meaning: "Optional. Absent = true"
    absent: "true"
  - name: "xy"
    type: "array"
    itemsRef: "float"
    meaning: "Packed x,y pairs in canvas pixels"
---
# `rig.pixel.mask_path`

Polygon used as a compositor mask.

Prefer composing [`rig.geometry.path`](../geometry/path.md) when the contour is a real command stream. This schema is the host bag when the polygon is still a packed `xy[]`.

| Field | Type | Meaning |
|-------|------|---------|
| `strokeWidth` | float | Optional. Canvas-px stroke; absent = 16 |
| `closed` | bool | Optional. Absent = true |
| `filled` | bool | Optional. Absent = true |
| `xy` | float[] | Packed x,y pairs in canvas pixels |

Compose [`rig.meta.named`](../meta/named.md) for the label.
