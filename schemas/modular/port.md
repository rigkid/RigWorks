---
id: "rig.modular.port"
maturity: "draft"
summary: "One patch jack and the signal window it accepts or produces. Format when present."
fields:
  - name: "direction"
    type: "string"
    enum: ["in","out","bidirectional"]
    required: true
    meaning: "in, out, bidirectional"
  - name: "signal"
    type: "string"
    enum: ["audio","cv","gate","trigger"]
    required: true
    meaning: "audio, cv, gate, trigger"
  - name: "connector"
    type: "string"
    enum: ["banana-4mm","ts-3-5mm"]
    required: true
    meaning: "banana-4mm, ts-3-5mm (3.5 mm tip-sleeve)"
  - name: "impedanceOhm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Ohms. Absent = unset"
    absent: "unset"
  - name: "lowVolts"
    ref: "float"
    meaning: "Optional. Lower end of the accepted or produced window (V). Absent = unset"
    absent: "unset"
  - name: "highVolts"
    ref: "float"
    meaning: "Optional. Upper end of the accepted or produced window (V). Absent = unset. Not below lowVolts"
    absent: "unset"
  - name: "tolerance"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0,\"maximum\":1}"
    meaning: "Optional. Fraction of highVolts, 0-1. 0.01 is +/- 1%. Absent = unset"
    absent: "unset"
  - name: "thresholdVolts"
    ref: "float"
    meaning: "Optional. Logic trip voltage (V). Absent = unset. When offBelowVolts and onAboveVolts are set, it lies between them"
    absent: "unset"
  - name: "offBelowVolts"
    ref: "float"
    meaning: "Optional. At or below this voltage a logic signal reads off (V). Absent = unset"
    absent: "unset"
  - name: "onAboveVolts"
    ref: "float"
    meaning: "Optional. At or above this voltage a logic signal reads on (V). Absent = unset. Not below offBelowVolts"
    absent: "unset"
  - name: "minSlewVoltsPerMicrosecond"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Minimum edge slew a trigger input requires (V/us). Absent = unset"
    absent: "unset"
  - name: "maxTransitionMicroseconds"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Maximum transition time a trigger input accepts (us). Absent = unset"
    absent: "unset"
  - name: "voltsPerOctave"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"exclusiveMinimum\":0}"
    meaning: "Optional. Pitch law, volts per octave. Absent = unset"
    absent: "unset"
  - name: "decibelsPerVolt"
    ref: "float"
    meaning: "Optional. Level law, decibels per volt. Absent = unset"
    absent: "unset"
  - name: "referencePitch"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/int\",\"minimum\":0,\"maximum\":127}"
    meaning: "Optional. MIDI note that referenceVolts stands for. Middle C is 60. State with referenceVolts, or omit both"
    absent: "omit both"
  - name: "referenceVolts"
    ref: "float"
    meaning: "Optional. Voltage at referencePitch (V). State with referencePitch, or omit both. When lowVolts and highVolts are set, it lies between them"
    absent: "omit both"
  - name: "minHertz"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Lowest frequency the window is specified at (Hz). Absent = unset. An open upper bound stays omitted"
    absent: "unset"
---
# `rig.modular.port`

One patch jack and the signal window it accepts or produces. Format when present.

The window is the contract other modules have to meet. A sample on the wire is host cache: do not store the voltage that happens to be present this frame.

| Field | Type | Meaning |
|-------|------|---------|
| `direction` | enum | in, out, bidirectional |
| `signal` | enum | audio, cv, gate, trigger |
| `connector` | enum | banana-4mm, ts-3-5mm (3.5 mm tip-sleeve) |
| `impedanceOhm` | float | Optional. Ohms. Absent = unset |
| `lowVolts` | float | Optional. Lower end of the accepted or produced window (V). Absent = unset |
| `highVolts` | float | Optional. Upper end of the accepted or produced window (V). Absent = unset. Not below `lowVolts` |
| `tolerance` | float | Optional. Fraction of `highVolts`, 0-1. 0.01 is +/- 1%. Absent = unset |
| `thresholdVolts` | float | Optional. Logic trip voltage (V). Absent = unset. When `offBelowVolts` and `onAboveVolts` are set, it lies between them |
| `offBelowVolts` | float | Optional. At or below this voltage a logic signal reads off (V). Absent = unset |
| `onAboveVolts` | float | Optional. At or above this voltage a logic signal reads on (V). Absent = unset. Not below `offBelowVolts` |
| `minSlewVoltsPerMicrosecond` | float | Optional. Minimum edge slew a trigger input requires (V/us). Absent = unset |
| `maxTransitionMicroseconds` | float | Optional. Maximum transition time a trigger input accepts (us). Absent = unset |
| `voltsPerOctave` | float | Optional. Pitch law, volts per octave. Absent = unset |
| `decibelsPerVolt` | float | Optional. Level law, decibels per volt. Absent = unset |
| `referencePitch` | int | Optional. MIDI note that `referenceVolts` stands for. Middle C is 60. State with `referenceVolts`, or omit both |
| `referenceVolts` | float | Optional. Voltage at `referencePitch` (V). State with `referencePitch`, or omit both. When `lowVolts` and `highVolts` are set, it lies between them |
| `minHertz` | float | Optional. Lowest frequency the window is specified at (Hz). Absent = unset. An open upper bound stays omitted |

Required: `direction`, `signal`, `connector`.

`highVolts` is greater than or equal to `lowVolts`. `onAboveVolts` is greater than or equal to `offBelowVolts`. A trigger input states slew and transition; a gate input states the trip and the off/on window. Pitch states `voltsPerOctave` and, when the spec pins a note to a voltage, both reference fields. A level law such as 12 dB/V is `decibelsPerVolt` on that jack, not a second volts-per-octave figure.

Bushing colour is paint on this entity ([`rig.paint.fill_stroke`](../paint/fill-stroke.md) `fillRgba`). Tip and sleeve, when the author knows which net each lands on, are child [`rig.circuit.pin`](../circuit/pin.md) entities. This jack is not that pin, not [`rig.node.pin`](../node/pin.md), not [`rig.sensor.gpio`](../sensor/gpio.md), and not [`rig.mod.trigger`](../mod/trigger.md).

Published windows for EuroSynth, and the Eurorack figures a mixed case has to compare: [eurosynth.md](../../docs/eurosynth.md).
