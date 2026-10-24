---
id: "rig.pixel.composite"
maturity: "stable"
summary: "Stack policy for the pixel compositor."
fields:
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Run the layer stack; absent = true"
    absent: "true"
---
# `rig.pixel.composite`

Stack policy for the pixel compositor.

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Run the layer stack; absent = true |

Layer order stays on [`rig.spatial.layer`](../spatial/layer.md) `order`. Blend stays on [`rig.render.blend`](../render/blend.md).
