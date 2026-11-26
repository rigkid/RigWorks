---
id: "rig.vision.segment"
maturity: "draft"
summary: "Authored segmentation request. Format when present. Masks are host cache."
fields:
  - name: "source"
    ref: "entity"
    required: true
    meaning: "Frame to read: a rig.pixel.canvas, raster, image rig.media.asset_ref, or video source"
  - name: "model"
    ref: "entity"
    meaning: "Optional. Entity carrying rig.vision.model. Absent = host default model"
    absent: "host default model"
  - name: "scoreThreshold"
    ref: "float"
    meaning: "Optional. Minimum score 0-1. Absent = 0.5"
    absent: "0.5"
  - name: "maxResults"
    type: "integer"
    minimum: 1
    meaning: "Optional. Cap on returned instances. Absent = 16"
    absent: "16"
---
# `rig.vision.segment`

Authored segmentation request. Format when present. Masks are host cache.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Frame to read: a [`rig.pixel.canvas`](../pixel/canvas.md), raster, image [`rig.media.asset_ref`](../media/asset-ref.md), or video source |
| `model` | entity | Optional. Entity carrying [`rig.vision.model`](model.md). Absent = host default model |
| `scoreThreshold` | float | Optional. Minimum score 0-1. Absent = 0.5 |
| `maxResults` | int | Optional. Cap on returned instances. Absent = 16 |

This describes the request, not its results. Masks and frame pixels stay in the host keyed by a frame id - they do not travel in the document.
