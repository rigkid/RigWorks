---
id: "rig.vision.model"
maturity: "draft"
summary: "Vision model asset and fixed input spec. Format when present. At least one field."
topJson: "{\"minProperties\":1}"
fields:
  - name: "asset"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref of the compiled model file (HEF / RT / other)"
  - name: "task"
    type: "string"
    enum: ["detect", "segment", "pose"]
    meaning: "Optional. Task this artifact runs. Absent = detect"
    absent: "detect"
  - name: "targetArch"
    type: "string"
    enum: ["hailo10h", "hailo8l", "hailo8", "cpu", "gpu"]
    meaning: "Optional. Architecture the artifact was compiled for. Absent = hailo10h"
    absent: "hailo10h"
  - name: "inputWidth"
    type: "integer"
    minimum: 1
    meaning: "Optional. Fixed input width in pixels. Absent = host default for the model"
    absent: "host default for the model"
  - name: "inputHeight"
    type: "integer"
    minimum: 1
    meaning: "Optional. Fixed input height in pixels. Absent = host default for the model"
    absent: "host default for the model"
  - name: "inputChannels"
    type: "integer"
    minimum: 1
    maximum: 4
    meaning: "Optional. Channel count. Absent = 3"
    absent: "3"
  - name: "inputLayout"
    type: "string"
    enum: ["nhwc", "nchw"]
    meaning: "Optional. Tensor layout. Absent = nhwc"
    absent: "nhwc"
---
# `rig.vision.model`

Vision model asset and fixed input spec. Format when present. At least one field.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) of the compiled model file (HEF / RT / other) |
| `task` | enum | Optional. `detect`, `segment`, or `pose`. Absent = `detect` |
| `targetArch` | enum | Optional. `hailo10h`, `hailo8l`, `hailo8`, `cpu`, or `gpu`. Absent = `hailo10h` |
| `inputWidth` | int | Optional. Fixed input width in pixels. Absent = host default for the model |
| `inputHeight` | int | Optional. Fixed input height in pixels. Absent = host default for the model |
| `inputChannels` | int | Optional. Channel count 1-4. Absent = 3 |
| `inputLayout` | enum | Optional. `nhwc` or `nchw`. Absent = `nhwc` |

A model whose `targetArch` does not match the device is unavailable - the host does not reinterpret it. HEF files are generation-bound (Hailo-10H vs Hailo-8 / 8L). Decode and device handles stay in the host.
