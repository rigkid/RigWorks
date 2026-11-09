---
id: "rig.modular.rail"
maturity: "draft"
summary: "One supply rail and the limits it is built to hold. Format when present."
fields:
  - name: "volts"
    ref: "float"
    required: true
    meaning: "Nominal voltage. Negative for a negative rail. 0 is the 0 V return"
  - name: "toleranceMillivolts"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Allowed departure from volts (mV). Absent = unset"
    absent: "unset"
  - name: "loadRegulationMillivolts"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Load regulation (mV RMS). Absent = unset"
    absent: "unset"
  - name: "noiseMillivolts"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Noise bound (mV) over noiseMinHertz to noiseMaxHertz. Absent = unset"
    absent: "unset"
  - name: "noiseMinHertz"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Lower end of the noise band (Hz). Absent = unset"
    absent: "unset"
  - name: "noiseMaxHertz"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Upper end of the noise band (Hz). Absent = unset. Not below noiseMinHertz"
    absent: "unset"
  - name: "maxImpedanceMilliohm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Maximum impedance from a module terminal to the supply, cables included (milliohm). Absent = unset"
    absent: "unset"
---
# `rig.modular.rail`

One supply rail and the limits it is built to hold. Format when present.

A child of the [`rig.modular.case`](case.md), or of whatever entity owns the supply. The copper the rail lands on is a [`rig.circuit.net`](../circuit/net.md). This component is the limit; the net is the node.

| Field | Type | Meaning |
|-------|------|---------|
| `volts` | float | Nominal voltage. Negative for a negative rail. 0 is the 0 V return |
| `toleranceMillivolts` | float | Optional. Allowed departure from `volts` (mV). Absent = unset |
| `loadRegulationMillivolts` | float | Optional. Load regulation (mV RMS). Absent = unset |
| `noiseMillivolts` | float | Optional. Noise bound (mV) over `noiseMinHertz` to `noiseMaxHertz`. Absent = unset |
| `noiseMinHertz` | float | Optional. Lower end of the noise band (Hz). Absent = unset |
| `noiseMaxHertz` | float | Optional. Upper end of the noise band (Hz). Absent = unset. Not below `noiseMinHertz` |
| `maxImpedanceMilliohm` | float | Optional. Maximum impedance from a module terminal to the supply, cables included (milliohm). Absent = unset |

Required: `volts`.

Chassis metal is its own net. It is not this rail, including when `volts` is 0. Where those two nets are allowed to meet is a bonding decision for a qualified person; the document keeps them distinct so a host can see that they are distinct. EuroSynth rail limits: [eurosynth.md](../../docs/eurosynth.md).
