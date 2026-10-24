---
id: "rig.picture.analysis"
maturity: "draft"
summary: "Request for live frame analysis of a picture. Format when present."
fields:
  - name: "source"
    ref: "entity"
    required: true
    meaning: "Frame to read: a rig.pixel.canvas, raster, image rig.media.asset_ref, video source, or a rig.visualizer.deck output"
  - name: "features"
    type: "array"
    itemsType: "string"
    itemsEnum: ["color","temperature"]
    meaning: "Optional. Which live signals to publish: color, temperature. Absent = both"
    absent: "both"
---
# `rig.picture.analysis`

Request for live frame analysis of a picture. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Frame to read: a [`rig.pixel.canvas`](../pixel/canvas.md), raster, image [`rig.media.asset_ref`](../media/asset-ref.md), video source, or a [`rig.visualizer.deck`](../visualizer.md) `output` |
| `features` | string[] | Optional. Which live signals to publish: `color`, `temperature`. Absent = both |

This describes the analysis to perform, not its results. Dominant / average `color` (rgba) and `temperature` (0 = cold, 1 = warm) change every frame and are host state.

The same two live names are used by [`rig.audio.analysis`](../audio/analysis.md). [`rig.art.image`](../art/image.md) is a documentary still of a work - not this.

To drive a property from the live color, use [`rig.mod.binding`](../mod/binding.md).
