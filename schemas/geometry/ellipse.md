# `rig.geometry.ellipse`

Axis-aligned ellipse. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `centerX` | float | Centre X, local space |
| `centerY` | float | Centre Y, local space |
| `radiusX` | float | Radius along X |
| `radiusY` | float | Radius along Y |

A circle is an ellipse with `radiusX` equal to `radiusY`. There is no separate circle schema — a reader that only draws circles should treat unequal radii as an ellipse rather than pick one radius.

Rotation belongs to [`rig.spatial.transform`](../spatial/transform.md).

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
