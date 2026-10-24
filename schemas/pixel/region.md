---
id: "rig.pixel.region"
maturity: "stable"
summary: "Found or drawn feeder region."
fields:
  - name: "fit"
    type: "string"
    enum: ["loose","polyline","curves"]
    meaning: "loose, polyline, curves"
  - name: "fill"
    type: "string"
    enum: ["none","hatch","cross-hatch","stipple","flow","outline","paint"]
    meaning: "none, hatch, cross-hatch, stipple, flow, outline, paint"
  - name: "paintBrushWidth"
    ref: "float"
    meaning: "Optional. Canvas-px brush for paint fill; absent = host default"
    absent: "host default"
  - name: "color"
    ref: "rgb"
    meaning: "Optional. Region tint 0-1; absent = black"
    absent: "black"
---
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
