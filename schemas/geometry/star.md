# `rig.geometry.star`

Alternating-radius star. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `centerX` | float | Centre X, local space |
| `centerY` | float | Centre Y, local space |
| `radius` | float | Centre to outer point |
| `innerRadius` | float | Centre to inner point, in the same units as `radius` |
| `points` | int | Number of outer points; at least 3 |
| `rotationDegrees` | float | Optional. Absent = 0; first outer point along +X |

`innerRadius` is an absolute distance, not a fraction of `radius`. The retired `rig.geometry.shape` used a 0–1 ratio, so a reader converting old documents multiplies by the outer radius. Local (0,0) is the authored centre — see [`rig.spatial.anchor`](../spatial/anchor.md).

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
