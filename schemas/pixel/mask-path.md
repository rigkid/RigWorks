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
