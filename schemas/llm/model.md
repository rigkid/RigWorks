---
id: "rig.llm.model"
maturity: "draft"
summary: "Local language-model identity. Format when present. At least one field."
topJson: "{\"minProperties\":1}"
fields:
  - name: "asset"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref of the model package or weights file"
  - name: "modelId"
    ref: "string"
    meaning: "Optional. Catalog id the runtime lists (for example qwen2.5:1.5b)"
  - name: "targetArch"
    type: "string"
    enum: ["hailo10h", "cpu", "gpu", "vulkan", "cuda"]
    meaning: "Optional. Where this artifact is meant to run. Absent = cpu"
    absent: "cpu"
  - name: "contextTokens"
    type: "integer"
    minimum: 1
    meaning: "Optional. Context window in tokens. Absent = host default"
    absent: "host default"
  - name: "maxTokens"
    type: "integer"
    minimum: 1
    meaning: "Optional. Default reply cap in tokens. Absent = host default"
    absent: "host default"
---
# `rig.llm.model`

Local language-model identity. Format when present. At least one field.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) of the model package or weights file |
| `modelId` | string | Optional. Catalog id the runtime lists (for example `qwen2.5:1.5b`) |
| `targetArch` | enum | Optional. `hailo10h`, `cpu`, `gpu`, `vulkan`, or `cuda`. Absent = `cpu` |
| `contextTokens` | int | Optional. Context window in tokens. Absent = host default |
| `maxTokens` | int | Optional. Default reply cap in tokens. Absent = host default |

Tokenizer, chat template, transformer weights, and KV layout travel inside the model package / runtime. They are not fields here. A chat session that uses this model is [`rig.llm.session`](session.md). Behavior trees stay [`rig.ai.*`](../ai/behavior.md) - not this schema.
