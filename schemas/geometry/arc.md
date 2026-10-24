---
id: "rig.geometry.arc"
maturity: "draft"
summary: "Circular or elliptical arc (or pie wedge). Format when present."
fields:
  - name: "centerX"
    ref: "float"
    required: true
    meaning: "Centre X, local space"
  - name: "centerY"
    ref: "float"
    required: true
    meaning: "Centre Y, local space"
  - name: "radiusX"
    ref: "float"
    required: true
    meaning: "Radius along local X"
  - name: "radiusY"
    ref: "float"
    required: true
    meaning: "Radius along local Y"
  - name: "startAngleDegrees"
    ref: "float"
    required: true
    meaning: "Start angle, 0 along +X, increasing toward +Y"
  - name: "endAngleDegrees"
    ref: "float"
    required: true
    meaning: "End angle, same convention"
  - name: "pie"
    ref: "bool"
    meaning: "Optional. Absent = false; true closes the contour through the centre"
    absent: "false"
---
# `rig.geometry.arc`

Circular or elliptical arc (or pie wedge). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `centerX` | float | Centre X, local space |
| `centerY` | float | Centre Y, local space |
| `radiusX` | float | Radius along local X |
| `radiusY` | float | Radius along local Y |
| `startAngleDegrees` | float | Start angle, 0 along +X, increasing toward +Y |
| `endAngleDegrees` | float | End angle, same convention |
| `pie` | bool | Optional. Absent = false; true closes the contour through the centre |

A circle is an arc with equal radii. Same fields as [`rig.geometry.ellipse`](ellipse.md), plus the angle span.

Rotation of an elliptical arc belongs on [`rig.spatial.transform`](../spatial/transform.md) - do not bake a major-axis angle into this component. Local (0,0) is the authored centre - see [`rig.spatial.anchor`](../spatial/anchor.md).

Angles are degrees, not radians, matching `fovYDegrees` on [`rig.spatial.camera`](../spatial/camera.md).

Sweep runs from start to end in increasing angle. An end angle below the start wraps past 360; the values are not normalized, so a 720-degree sweep is a legal double loop and a host that cannot draw one clamps rather than takes the modulus.

Full axis-aligned ellipses (no start/end span) use [`rig.geometry.ellipse`](ellipse.md). A freeform contour that contains an endpoint arc uses [`rig.geometry.path`](path.md) `arc-to`. Do not put both this primitive and a path on the same contour.

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
