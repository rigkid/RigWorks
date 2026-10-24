---
id: "rig.geometry.regular_polygon"
maturity: "stable"
summary: "Equilateral n-gon about a centre. Format when present."
fields:
  - name: "centerX"
    ref: "float"
    required: true
    meaning: "Centre X, local space"
  - name: "centerY"
    ref: "float"
    required: true
    meaning: "Centre Y, local space"
  - name: "radius"
    ref: "float"
    required: true
    meaning: "Centre to vertex, not centre to edge"
  - name: "sides"
    type: "integer"
    minimum: 3
    required: true
    meaning: "Vertex count; at least 3"
  - name: "rotationDegrees"
    ref: "float"
    meaning: "Optional. Absent = 0; first vertex at angle 0 points along +X"
    absent: "0"
---
# `rig.geometry.regular_polygon`

Equilateral n-gon about a centre. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `centerX` | float | Centre X, local space |
| `centerY` | float | Centre Y, local space |
| `radius` | float | Centre to vertex, not centre to edge |
| `sides` | int | Vertex count; at least 3 |
| `rotationDegrees` | float | Optional. Absent = 0; first vertex at angle 0 points along +X |

A triangle is `sides: 3`. There is no separate triangle schema.

`rotationDegrees` exists so the shape's own phase survives independently of the entity's rotation in [`rig.spatial.transform`](../spatial/transform.md). A host that has only one of the two composes them. Local (0,0) is the authored centre - see [`rig.spatial.anchor`](../spatial/anchor.md).

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
