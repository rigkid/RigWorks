# Music, audio, animation, modulation

Load for: transport, sequencers, notes, audio buses/voices, analysis, LFO/binding, tweens, clips, skeletons, visualizers, synth voice. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/music-chord.json`](../../../examples/music-chord.json), [`examples/lfo-binding.json`](../../../examples/lfo-binding.json), [`examples/synth-voice.json`](../../../examples/synth-voice.json), [`examples/visualizer.json`](../../../examples/visualizer.json), [`examples/play-scene.json`](../../../examples/play-scene.json). Human words: [`docs/music.md`](../../../docs/music.md). Spine files stay a host encoding: [`docs/spine.md`](../../../docs/spine.md). A Pure Data or Max patch is the node graph: [`docs/pd.md`](../../../docs/pd.md).

## Compose

| Want | Compose |
|---|---|
| Song position / tempo | `rig.music.transport` + `rig.music.clock` |
| A step sequence | `rig.music.sequencer` with `rig.music.pattern` of `rig.music.step`; song order is `rig.music.arrangement` |
| A note / chord tone | `rig.music.note` |
| MIDI in / out endpoints | `rig.music.midi_input`, `rig.music.midi_output` (ports are endpoints, not note data) |
| A sound source | `rig.audio.voice` (`asset` + `bus`); mix bus is `rig.audio.bus`. `gain` is linear amplitude - never store decibels beside it |
| Audio / picture features | `rig.audio.analysis`, `rig.picture.analysis` (authored config, not live buffers) |
| A show deck | `rig.visualizer.deck` |
| An oscillator modulator | `rig.mod.lfo`; wire it with `rig.mod.binding`; a fired trigger is `rig.mod.trigger` |
| A synth voice | `rig.synth.oscillator` into `rig.synth.filter` (`input`) into `rig.synth.amplifier` (`input`, linear `gain`). `rig.synth.envelope` opens `gain` and `cutoffHertz` through `rig.mod.binding` |
| A tween / curve | `rig.anim.tween`, `rig.anim.curve` |
| A clip of sampled tracks | `rig.anim.clip` + `rig.anim.track` (`clip` points at the clip); blend with `rig.anim.blend`; bind with `rig.anim.bind` |
| Bones and skinning | `rig.anim.skeleton` (bones parent via `rig.spatial.relationship`), `rig.anim.skin` (`joints`) |

## Guards

- Do not serialize live audio mix buffers, pending MIDI queues, or last-sample state. Those are host runtime.
- Bar/beat is derived from `positionBeats` by the host; do not store it as a second field.
- Arrangement frames hold `patterns` (entities, by `lane`); the arrangement does not carry step data. A frame has no title; name the part with `rig.meta.named` on the pattern.
- Pitch is a MIDI note number (60 = C4). `intervals` are 12-tone semitones, not scale degrees. `scale` and `rootNote` name the collection and do not transpose steps. `waveform` 0-4 are sine, tri, saw, square, noise. 5-7 are unassigned. `effect` 1-7 are host slots.
- A synth block's phase, envelope stage, and sample are host cache. `rig.synth.filter` shapes a tone (`rig.paint.filter` draws). `rig.synth.amplifier` is one voice stage (`rig.audio.bus` is the mix). Jack volts and `decibelsPerVolt` stay on `rig.modular.port`. The oscillator has no noise shape.

## Ids in this slice

`rig.music.transport`, `rig.music.clock`, `rig.music.sequencer`, `rig.music.pattern`, `rig.music.arrangement`, `rig.music.step`, `rig.music.note`, `rig.music.midi_output`, `rig.music.midi_input`, `rig.audio.analysis`, `rig.audio.bus`, `rig.audio.voice`, `rig.picture.analysis`, `rig.visualizer.deck`, `rig.mod.lfo`, `rig.mod.binding`, `rig.mod.trigger`, `rig.anim.tween`, `rig.anim.curve`, `rig.anim.skeleton`, `rig.anim.skin`, `rig.anim.clip`, `rig.anim.track`, `rig.anim.blend`, `rig.anim.bind`, `rig.synth.oscillator`, `rig.synth.filter`, `rig.synth.amplifier`, `rig.synth.envelope`
