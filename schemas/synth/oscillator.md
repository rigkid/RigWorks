---
id: "rig.synth.oscillator"
maturity: "draft"
summary: "Pitched audio oscillator. Format when present."
fields:
  - name: "waveform"
    type: "string"
    enum: ["sine","tri","saw","square"]
    required: true
    meaning: "sine, tri, saw, square. The same four words as rig.mod.lfo"
  - name: "pitch"
    type: "integer"
    minimum: 0
    maximum: 127
    meaning: "Optional. MIDI note 0-127 at no modulation. 60 is C4. Absent = 60. Same numbering as rig.music.note"
    absent: "60"
  - name: "pulseWidth"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1 duty of a square. Absent = 0.5. Other waveforms ignore it"
    absent: "0.5"
---
# `rig.synth.oscillator`

Pitched audio oscillator. Format when present.

The shapes are the same four words as [`rig.mod.lfo`](../mod/lfo.md). This one is the tone. The LFO is the slow modulator. Unpitched noise stays `waveform` 4 on [`rig.music.step`](../music/step.md).

| Field | Type | Meaning |
|-------|------|---------|
| `waveform` | enum | sine, tri, saw, square. The same four words as [`rig.mod.lfo`](../mod/lfo.md) |
| `pitch` | int | Optional. MIDI note 0-127 at no modulation. 60 is C4. Absent = 60. Same numbering as [`rig.music.note`](../music/note.md) |
| `pulseWidth` | float | Optional. 0-1 duty of a square. Absent = 0.5. Other waveforms ignore it |

`pitch` is the note the oscillator holds when nothing is pushing it. A host turns that note into a frequency. The live frequency, the phase, and the sample stay host cache.

Frequency modulation and pulse-width modulation are a [`rig.mod.binding`](../mod/binding.md) onto `pitch` or `pulseWidth`. A second oscillator is a second entity.

A panel that carries this block also carries [`rig.modular.module`](../modular/module.md). Its jacks are child [`rig.modular.port`](../modular/port.md) entities. Volts per octave stay on the jack.

## Fulfillment

Hosts advance the oscillator in **Update**. Sample into a runtime cache. Do not serialize the last sample.
