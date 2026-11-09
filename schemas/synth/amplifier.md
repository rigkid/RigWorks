---
id: "rig.synth.amplifier"
maturity: "draft"
summary: "Level stage in a voice. Format when present."
fields:
  - name: "gain"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 linear gain at no modulation. Absent = 1. A closed voice writes 0"
    absent: "1"
  - name: "input"
    ref: "entity"
    meaning: "Optional. Entity whose audio this stage reads. Absent = unset"
    absent: "unset"
---
# `rig.synth.amplifier`

Level stage in a voice. Format when present.

[`rig.audio.bus`](../audio/bus.md) is the mix this stage may feed. `gain` is the same linear 0-1 number the bus uses. A decibel law on a jack stays [`rig.modular.port`](../modular/port.md) `decibelsPerVolt`.

| Field | Type | Meaning |
|-------|------|---------|
| `gain` | float | Optional. 0-1 linear gain at no modulation. Absent = 1. A closed voice writes 0 |
| `input` | entity | Optional. Entity whose audio this stage reads. Absent = unset |

An envelope opens the stage with a [`rig.mod.binding`](../mod/binding.md) onto `gain`. Write `gain` 0 when the voice should sit silent until that envelope moves.

`input` is one source. A filter into this stage points `input` at that [`rig.synth.filter`](filter.md).

## Fulfillment

Hosts apply `gain` in **Update**. The sample stays a runtime cache.
