---
id: "rig.vision.pose"
maturity: "draft"
summary: "Authored pose / keypoints request. Format when present. Keypoints are host cache."
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
    meaning: "Optional. Cap on returned poses. Absent = 16"
    absent: "16"
---
# `rig.vision.pose`

Authored pose / keypoints request. Format when present. Keypoints are host cache.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Frame to read: a [`rig.pixel.canvas`](../pixel/canvas.md), raster, image [`rig.media.asset_ref`](../media/asset-ref.md), or video source |
| `model` | entity | Optional. Entity carrying [`rig.vision.model`](model.md). Absent = host default model |
| `scoreThreshold` | float | Optional. Minimum score 0-1. Absent = 0.5 |
| `maxResults` | int | Optional. Cap on returned poses. Absent = 16 |

This describes the request, not its results. Keypoint lists stay in the host, capped by `maxResults` and keyed by a frame id.
