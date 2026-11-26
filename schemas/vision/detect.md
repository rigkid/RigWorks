---
id: "rig.vision.detect"
maturity: "draft"
summary: "Authored object-detect request. Format when present. Results are host cache."
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
    meaning: "Optional. Cap on returned boxes. Absent = 32"
    absent: "32"
---
# `rig.vision.detect`

Authored object-detect request. Format when present. Results are host cache.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Frame to read: a [`rig.pixel.canvas`](../pixel/canvas.md), raster, image [`rig.media.asset_ref`](../media/asset-ref.md), or video source |
| `model` | entity | Optional. Entity carrying [`rig.vision.model`](model.md). Absent = host default model |
| `scoreThreshold` | float | Optional. Minimum score 0-1. Absent = 0.5 |
| `maxResults` | int | Optional. Cap on returned boxes. Absent = 32 |

This describes the request, not its results. Boxes, scores, labels, and a frame id stay in the host, capped by `maxResults`. Frame pixels and masks are not fields here.

Show color / temperature analysis stays [`rig.picture.analysis`](../picture/analysis.md) - not this schema.
