---
id: "rig.modular.power"
maturity: "draft"
summary: "What a module draws, and which header it draws it through. Format when present."
fields:
  - name: "header"
    type: "string"
    enum: ["idc-10","idc-16"]
    required: true
    meaning: "idc-10, idc-16"
  - name: "positive12MilliAmps"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Draw from +12 V (mA). Absent = not stated. Absent is not 0"
    absent: "not stated"
  - name: "negative12MilliAmps"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Draw from -12 V (mA). Absent = not stated. Absent is not 0"
    absent: "not stated"
  - name: "positive5MilliAmps"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Draw from +5 V (mA). Absent = not stated. Absent is not 0"
    absent: "not stated"
---
# `rig.modular.power`

What a module draws, and which header it draws it through. Format when present.

Compose on the [`rig.modular.module`](module.md) entity. The header's contacts are not fields here: they are [`rig.circuit.pin`](../circuit/pin.md) children of a [`rig.circuit.part`](../circuit/part.md), each pointing at a [`rig.circuit.net`](../circuit/net.md). Pin 1's function is how a host knows the cable is not reversed.

| Field | Type | Meaning |
|-------|------|---------|
| `header` | enum | idc-10, idc-16 |
| `positive12MilliAmps` | float | Optional. Draw from +12 V (mA). Absent = not stated. Absent is not 0 |
| `negative12MilliAmps` | float | Optional. Draw from -12 V (mA). Absent = not stated. Absent is not 0 |
| `positive5MilliAmps` | float | Optional. Draw from +5 V (mA). Absent = not stated. Absent is not 0 |

Required: `header`.

A stated `0` means the module draws none of that rail. An omitted current means the author did not say. A supply sized from an omission will be short. EuroSynth's 10-pin header and the 16-pin header it still has to meet: [eurosynth.md](../../docs/eurosynth.md).
