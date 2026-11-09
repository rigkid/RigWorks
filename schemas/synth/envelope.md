---
id: "rig.synth.envelope"
maturity: "draft"
summary: "Attack, decay, sustain, release. Format when present."
fields:
  - name: "attackSeconds"
    type: "number"
    minimum: 0
    meaning: "Optional. Seconds from 0 to full when the gate opens. Absent = 0"
    absent: "0"
  - name: "decaySeconds"
    type: "number"
    minimum: 0
    meaning: "Optional. Seconds from full to sustain while the gate holds. Absent = 0"
    absent: "0"
  - name: "sustain"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 level held while the gate stays open. Absent = 1"
    absent: "1"
  - name: "releaseSeconds"
    type: "number"
    minimum: 0
    meaning: "Optional. Seconds from the held level to 0 when the gate closes. Absent = 0"
    absent: "0"
  - name: "curve"
    type: "string"
    enum: ["linear","exponential"]
    meaning: "Optional. linear or exponential. Absent = linear"
    absent: "linear"
  - name: "gate"
    ref: "entity"
    meaning: "Optional. Entity that opens this envelope. Absent = the host's playing note"
    absent: "the host's playing note"
---
# `rig.synth.envelope`

Attack, decay, sustain, release. Format when present.

The running level is 0 to 1. 0 is closed. 1 is the peak at the end of the attack. That level is host cache. Bind it with [`rig.mod.binding`](../mod/binding.md): `depth` 1 onto an amplifier `gain` opens the voice; a larger `depth` onto a filter `cutoffHertz` sweeps the corner.

| Field | Type | Meaning |
|-------|------|---------|
| `attackSeconds` | float | Optional. Seconds from 0 to full when the gate opens. Absent = 0 |
| `decaySeconds` | float | Optional. Seconds from full to sustain while the gate holds. Absent = 0 |
| `sustain` | float | Optional. 0-1 level held while the gate stays open. Absent = 1 |
| `releaseSeconds` | float | Optional. Seconds from the held level to 0 when the gate closes. Absent = 0 |
| `curve` | enum | Optional. linear or exponential. Absent = linear |
| `gate` | entity | Optional. Entity that opens this envelope. Absent = the host's playing note |

A gate that opens again during release restarts the attack. `curve` `linear` moves each stage in even steps. `exponential` spends more of the stage at the start, the RC shape.

`gate` names the jack, the sequencer, or the note entity that opens this envelope. The voltage on that jack stays host cache. [`rig.mod.trigger`](../mod/trigger.md) is a show event, a different component.

All four times at 0 and `sustain` 1 hold full while the gate is open and drop when it closes.

## Fulfillment

Hosts advance the stage in **Update**. The stage name and the running level stay a runtime cache.
