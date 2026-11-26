# Vision NPU and local LLM

Load for: object detect / segment / pose requests, Hailo / NPU model assets, local chat sessions, edge LLM knobs. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/vision-llm-lanes.json`](../../../examples/vision-llm-lanes.json). Do not use this slice for robot behavior trees or learned policies - those stay [`sim-vr-play.md`](sim-vr-play.md) (`rig.ai.*`).

## Compose

| Want | Compose |
|---|---|
| Backend preference | `rig.vision.device` (`backendPreference` `auto` / `hailo` / `cpu` / `gpu`) - preference only |
| A compiled vision model | `rig.vision.model` on the same entity as `rig.media.asset_ref` (`kind` `model`); set `task`, `targetArch`, fixed input size / layout |
| Detect / segment / pose | `rig.vision.detect` / `segment` / `pose` with `source` (frame entity) and optional `model`; thresholds and `maxResults` |
| An LLM package | `rig.llm.model` + `rig.media.asset_ref`; optional `modelId`, `targetArch`, token caps |
| A chat session | `rig.llm.session` pointing at the model entity; sampling knobs and backend preference |

## Guards

- Do not emit `rig.ai.*` for chat or detect - those ids are behavior trees and policies.
- Do not put boxes, masks, keypoints, transcripts, or the backend actually used in the document - host cache. Cap results in the host with `maxResults` and a frame id.
- Do not invent `rig.tokenizer.*`, `rig.transformer.*`, or `rig.onnx.*`. Tokenizer and decoder travel inside the model package / runtime.
- HEF `targetArch` must match the device generation (`hailo10h` vs `hailo8l` / `hailo8`). A mismatch is unavailable, not reinterpreted.
- Show color / temperature stays `rig.picture.analysis` - not `rig.vision.*`.

## Ids in this slice

`rig.vision.device`, `rig.vision.model`, `rig.vision.detect`, `rig.vision.segment`, `rig.vision.pose`, `rig.llm.model`, `rig.llm.session`
