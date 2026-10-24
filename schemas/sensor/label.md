---
id: "rig.sensor.label"
maturity: "draft"
summary: "Class image from a camera. Format when present."
fields:
  - name: "mode"
    type: "string"
    enum: ["semantic","instance"]
    meaning: "Optional. semantic, instance. Absent = semantic"
    absent: "semantic"
  - name: "classes"
    type: "array"
    minItems: 1
    itemsRef: "string"
    required: true
    meaning: "Names the image indexes, in order. Index 0 is the first string"
---
# `rig.sensor.label`

Class image from a camera. Format when present.

Compose on the same entity as [`rig.spatial.camera`](../spatial/camera.md). The picture stays in the host, the same bargain as a depth buffer.

| Field | Type | Meaning |
|-------|------|---------|
| `mode` | enum | Optional. `semantic`, `instance`. Absent = `semantic` |
| `classes` | string[] | Names the image indexes, in order. Index 0 is the first string |

`semantic` paints a class per pixel. `instance` paints an object id; `classes` is still the vocabulary those objects belong to. A host that cannot tell instances apart emits `semantic`.

An entity that should appear in the image composes [`rig.sensor.class`](class.md). The name matches one of these strings. [`rig.meta.tags`](../meta/tags.md) is not a class id.
