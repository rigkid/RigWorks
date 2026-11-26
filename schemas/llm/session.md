---
id: "rig.llm.session"
maturity: "draft"
summary: "Authored local LLM session knobs. Format when present. Transcript is host cache."
fields:
  - name: "model"
    ref: "entity"
    meaning: "Optional. Entity carrying rig.llm.model. Absent = host default model"
    absent: "host default model"
  - name: "backendPreference"
    type: "string"
    enum: ["auto", "hailo", "cpu", "gpu", "vulkan", "cuda"]
    meaning: "Optional. Preferred backend. Absent = auto"
    absent: "auto"
  - name: "temperature"
    ref: "float"
    meaning: "Optional. Sampling temperature. Absent = host default"
    absent: "host default"
  - name: "topP"
    ref: "float"
    meaning: "Optional. Nucleus sampling 0-1. Absent = host default"
    absent: "host default"
  - name: "maxTokens"
    type: "integer"
    minimum: 1
    meaning: "Optional. Reply cap in tokens for this session. Absent = model or host default"
    absent: "model or host default"
  - name: "contextTokens"
    type: "integer"
    minimum: 1
    meaning: "Optional. Context window override. Absent = model or host default"
    absent: "model or host default"
---
# `rig.llm.session`

Authored local LLM session knobs. Format when present. Transcript is host cache.

| Field | Type | Meaning |
|-------|------|---------|
| `model` | entity | Optional. Entity carrying [`rig.llm.model`](model.md). Absent = host default model |
| `backendPreference` | enum | Optional. `auto`, `hailo`, `cpu`, `gpu`, `vulkan`, or `cuda`. Absent = `auto` |
| `temperature` | float | Optional. Sampling temperature. Absent = host default |
| `topP` | float | Optional. Nucleus sampling 0-1. Absent = host default |
| `maxTokens` | int | Optional. Reply cap in tokens for this session. Absent = model or host default |
| `contextTokens` | int | Optional. Context window override. Absent = model or host default |

Messages, tool calls, and the backend actually used are host cache. A preference for `gpu` that falls back to CPU reports CPU.
