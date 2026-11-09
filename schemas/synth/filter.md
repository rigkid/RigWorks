---
id: "rig.synth.filter"
maturity: "draft"
summary: "Audio filter in a voice. Format when present."
fields:
  - name: "mode"
    type: "string"
    enum: ["low-pass","high-pass","band-pass"]
    required: true
    meaning: "low-pass, high-pass, band-pass"
  - name: "cutoffHertz"
    type: "number"
    minimum: 0
    required: true
    meaning: "Cutoff (Hz) at no modulation. 0 is closed"
  - name: "resonance"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 emphasis at the cutoff. Absent = 0"
    absent: "0"
  - name: "decibelsPerOctave"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Slope (dB/octave). Absent = unset"
    absent: "unset"
  - name: "input"
    ref: "entity"
    meaning: "Optional. Entity whose audio this filter reads. Absent = unset"
    absent: "unset"
---
# `rig.synth.filter`

Audio filter in a voice. Format when present.

A drawing filter is [`rig.paint.filter`](../paint/filter.md).

| Field | Type | Meaning |
|-------|------|---------|
| `mode` | enum | low-pass, high-pass, band-pass |
| `cutoffHertz` | float | Cutoff (Hz) at no modulation. 0 is closed |
| `resonance` | float | Optional. 0-1 emphasis at the cutoff. Absent = 0 |
| `decibelsPerOctave` | float | Optional. Slope (dB/octave). Absent = unset |
| `input` | entity | Optional. Entity whose audio this filter reads. Absent = unset |

`cutoffHertz` is the corner when nothing is pushing it. An envelope or an LFO moves it through a [`rig.mod.binding`](../mod/binding.md) on `cutoffHertz`. The open frequency after that push stays host cache.

`input` is one source, the previous block in the voice. A saw into this filter points `input` at that [`rig.synth.oscillator`](oscillator.md).

## Fulfillment

Hosts run the filter in **Update** over the source sample. Coefficients and the last sample stay a runtime cache.
