# `rig.pixel.region`

Found or drawn feeder region.

Compose [`rig.meta.named`](../meta/named.md) for the label. Outline may later compose [`rig.geometry.path`](../geometry/path.md).

| Field | Type | Meaning |
|-------|------|---------|
| `fit` | enum | loose, polyline, curves |
| `fill` | enum | none, hatch, cross-hatch, stipple, flow, outline, paint |
| `paintBrushWidth` | float | Optional. Canvas-px brush for `paint` fill; absent = host default |
| `color` | vec3 | Optional. Region tint 0-1; absent = black |

Fill strokes and outline vertices are derived / host until the path compose is honest.
