# EuroSynth

Rig names a modular faceplate, its jacks, and its supply as [`rig.modular.*`](../schemas/modular/module.md). EuroSynth and Eurorack are published numbers written into those fields. The names are not schema ids.

A jack publishes the window it accepts or produces. A panel publishes its fit. Two builders compare those numbers before a cable joins the modules.

The numbers below are the EuroSynth figures this document uses. New figures take a new `spec` id.

## Thin layer

Do **not** invent `rig.eurosynth.*` or `rig.eurorack.*`. A jack's live voltage is host cache. Nominal width (`hp * pitchMm`) is host arithmetic. Finished width is `widthMm` when the spec or the calipers give it.

| Idea | Rig |
|------|-----|
| Case, skiff, rack row | [`rig.modular.case`](../schemas/modular/case.md) |
| Module faceplate | [`rig.modular.module`](../schemas/modular/module.md) + [`rig.meta.named`](../schemas/meta/named.md) |
| Which published spec | A named entity (`stableId` `eurosynth`). Case and module `spec` point at it |
| Patch jack | Child [`rig.modular.port`](../schemas/modular/port.md). Bushing colour is [`rig.paint.fill_stroke`](../schemas/paint/fill-stroke.md) |
| Drawn panel, labels | Geometry and [`rig.media.text`](../schemas/media/text.md). Faceplate height is only in the mechanical drawing; set `heightMm` from a measurement |
| Module current and header | [`rig.modular.power`](../schemas/modular/power.md) on the module |
| Header contacts | [`rig.circuit.part`](../schemas/circuit/part.md) + child [`rig.circuit.pin`](../schemas/circuit/pin.md), each `net` pointing at a [`rig.circuit.net`](../schemas/circuit/net.md) |
| Supply limits | Child [`rig.modular.rail`](../schemas/modular/rail.md) |
| Chassis metal | Its own `rig.circuit.net`. Not the 0 V rail |
| MIDI DIN | [`rig.music.midi_input`](../schemas/music/midi-input.md) / [`midi_output`](../schemas/music/midi-output.md). The CV and gate that MIDI becomes are ports |

## Mechanical

Eurocard horizontal pitch. `pitchMm` is 5.08. `hp` is a whole number.

EuroSynth publishes a finished width per HP, shorter than `hp * 5.08`, so panels can sit side by side. That figure is `widthMm`. The example uses an 8 HP faceplate at 40.30 mm and an 84 HP opening at 426.40 mm. A host computes the nominal width as `hp * pitchMm`.

Panels state a general thickness of 2.5 mm (`thicknessMm`). The proposed module depth, from the inside face to the furthest rear point, is 60 mm (`depthMm`). A 19 inch sub-rack still allows 160 mm. A host compares module `depthMm` with case `depthMm`.

The thread is M3 (`fastener` `m3`). Eurocard's M2.5 is `m2-5`. EuroSynth uses M3, and prefers a slotted hole with a captive thumbscrew.

Every panel has two fixings on the left. A panel wider than 10 HP adds two on the right. In the published table those right-hand fixings sit 7.74 mm in from the nominal right edge (`hp * 5.08 - 7.74`, measured from the left). Vertical positions are in the mechanical drawing; place [`rig.spatial.vertex`](../schemas/spatial/vertex.md) children when that drawing has been measured.

A PCB parallel to the panel is limited to `(hp * 5.08) - 2` mm wide and 110 mm tall. Those are checks against a [`rig.pcb.board`](../schemas/pcb/board.md), not extra fields.

## Power

EuroSynth uses a 10-pin boxed IDC header (`header` `idc-10`). Pin 1 of the cable is pin 1 of the header, and pin 1 is -12 V. Eurorack's 16-pin header (`idc-16`) uses the same first ten pins, then +5 V, CV, and gate. EuroSynth leaves those off. A module that still needs +5 V sets `positive5MilliAmps`. The adaptor is not in the document.

| Pins | `function` | EuroSynth |
|------|------------|-----------|
| 1, 2 | `-12V` | kept, blue pair |
| 3, 4, 5, 6, 7, 8 | `0V` | kept, black |
| 9, 10 | `+12V` | kept, red pair |
| 11, 12 | `+5V` | 16-pin only |
| 13, 14 | `CV` | 16-pin only |
| 15, 16 | `GATE` | 16-pin only |

`electricalType` on a module header is `power-in`.

Both 12 V rails are specified to hold:

| Limit | Field | Value |
|-------|--------|-------|
| Tolerance | `toleranceMillivolts` | 10 |
| Load regulation | `loadRegulationMillivolts` | 10 (RMS) |
| Noise | `noiseMillivolts` | 10, from `noiseMinHertz` 10 to `noiseMaxHertz` 10000 |
| Path impedance | `maxImpedanceMilliohm` | 10, from any module terminal to the supply, cables included |

Omitted module current is not 0 mA. A stated 0 means that rail is unused.

Chassis is its own net, separate from 0 V. A panel part on the chassis is not also tied to the module 0 V net. Mains earth is not in this document.

## Signals

`connector` `banana-4mm` is the EuroSynth jack. `ts-3-5mm` is the 3.5 mm Eurorack jack a mixed case still has to name. Input impedance in the spec is typically 100000 ohm and not below 47000. A 1 V/octave output is about 50 ohm. Other outputs are about 330 ohm. The schema accepts whatever was measured; a EuroSynth host can warn outside those bands.

`tolerance` is a fraction of `highVolts`: 0.10 is +/- 10%, 0.01 is +/- 1%.

| Jack | `direction` | `signal` | Window | Other |
|------|-------------|----------|--------|-------|
| Control CV in | `in` | `cv` | 0 V to +5 V, tolerance 0.10 | 1 V/octave. Middle C (MIDI 60) at 2.5 V, so 0 V to 5 V is about 35 Hz to 1 kHz. From 0 Hz |
| Modulation CV in | `in` | `cv` | -2.5 V to +2.5 V | From 0 Hz |
| Control CV out | `out` | `cv` | 0 V to +5 V, tolerance 0.01 | Sensitive pitch output at about 50 ohm. Same 2.5 V Middle C |
| Audio in | `in` | `audio` | typical +/- 2.5 V (5 V peak-to-peak); specified out to +/- 5 V (10 V peak-to-peak) | From 16 Hz. Store the window the jack actually accepts |
| Audio out | `out` | `audio` | +/- 2.5 V | About 330 ohm. From 16 Hz |
| Gate in | `in` | `gate` | nominal 0 V and +5 V, tolerance 0.10 | Off at or below 1 V, on at or above 2 V, trip `thresholdVolts` 1.5. The spec also states +/- 0.1% on that trip |
| Gate out | `out` | `gate` | 0 V and +5 V, tolerance 0.01 | Resting level, not the edge |
| Trigger in | `in` | `trigger` | | Slew at least 0.3 V/us, transition at most 10 us |
| Trigger out | `out` | `trigger` | 0 V and +5 V, tolerance 0.01 | The edge must pass below 1 V and above 2.5 V. A 0 V to 5 V window does |
| VCA law | `in` | `cv` | | `decibelsPerVolt` 12 when the jack is scaled at 12 dB/V. 5 V of that law is 60 dB, and 0 V is shut |

An open top ("greater than 15 kHz", "greater than 16 kHz") stays omitted. `minHertz` records the bottom that was stated.

Bushing paint, from the colour names the spec prints: CV in blue, CV out green, gate in red, gate out yellow, trigger in red, trigger out yellow. The spec names no audio colours in the text, so leave those bushings unpainted.

Eurorack, for a host comparing mixed rows: audio is often +/- 5 V (10 V peak-to-peak), control CV often 0 V to 8 V, modulation the same +/- 2.5 V, gate and trigger 0 V to 5 V, jacks `ts-3-5mm`, outputs often 1000 ohm. Compare `lowVolts` / `highVolts` and `impedanceOhm`. A brand match is not the check. A EuroSynth audio input specified to +/- 5 V accepts a Eurorack +/- 5 V output. A EuroSynth audio output at +/- 2.5 V sits inside a Eurorack input. An 8 V Eurorack CV does not sit inside a EuroSynth control input specified to 5 V +/- 10%.

Example: [`examples/eurosynth.json`](../examples/eurosynth.json).
