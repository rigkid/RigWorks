---
id: "rig.mod.lfo"
maturity: "draft"
summary: "Low-frequency oscillator. Format when present."
fields:
  - name: "waveform"
    type: "string"
    enum: ["sine","tri","saw","square"]
    required: true
    meaning: "sine, tri, saw, square"
  - name: "frequency"
    ref: "float"
    required: true
    meaning: "Hz"
  - name: "amplitude"
    ref: "float"
    meaning: "Optional. Depth; absent = 1"
    absent: "1"
  - name: "offset"
    ref: "float"
    meaning: "Optional. Bias; absent = 0"
    absent: "0"
  - name: "phase"
    ref: "float"
    meaning: "Optional. 0-1 (wrap); absent = 0"
    absent: "0"
---
# `rig.mod.lfo`

Low-frequency oscillator. Format when present.

Replaces a separate “pulse” schema - use waveform + binding.

| Field | Type | Meaning |
|-------|------|---------|
| `waveform` | enum | sine, tri, saw, square |
| `frequency` | float | Hz |
| `amplitude` | float | Optional. Depth; absent = 1 |
| `offset` | float | Optional. Bias; absent = 0 |
| `phase` | float | Optional. 0-1 (wrap); absent = 0 |

Last sample is a runtime cache - do not serialize. Drive targets through [`rig.mod.binding`](binding.md).

## Fulfillment

Hosts advance LFOs in **Update** (SUDE), typically as an ECS system over LFO components - not a free-function tick over an import side-table. Sample into a runtime cache; bindings apply writes.
