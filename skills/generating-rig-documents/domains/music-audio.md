# Music, audio, animation, modulation

Load for: transport, sequencers, notes, audio buses/voices, analysis, LFO/binding, tweens, clips, skeletons, visualizers. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/music-chord.json`](../../../examples/music-chord.json), [`examples/lfo-binding.json`](../../../examples/lfo-binding.json), [`examples/visualizer.json`](../../../examples/visualizer.json).

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
| A tween / curve | `rig.anim.tween`, `rig.anim.curve` |
| A clip of sampled tracks | `rig.anim.clip` + `rig.anim.track` (`clip` points at the clip); blend with `rig.anim.blend`; bind with `rig.anim.bind` |
| Bones and skinning | `rig.anim.skeleton` (bones parent via `rig.spatial.relationship`), `rig.anim.skin` (`joints`) |

## Guards

- Do not serialize live audio mix buffers, pending MIDI queues, or last-sample state. Those are host runtime.
- Bar/beat is derived from `positionBeats` by the host; do not store it as a second field.
- Arrangement frames hold `patterns` (entities, by `lane`); the arrangement does not carry step data.

## Ids in this slice

`rig.music.transport`, `rig.music.clock`, `rig.music.sequencer`, `rig.music.pattern`, `rig.music.arrangement`, `rig.music.step`, `rig.music.note`, `rig.music.midi_output`, `rig.music.midi_input`, `rig.audio.analysis`, `rig.audio.bus`, `rig.audio.voice`, `rig.picture.analysis`, `rig.visualizer.deck`, `rig.mod.lfo`, `rig.mod.binding`, `rig.mod.trigger`, `rig.anim.tween`, `rig.anim.curve`, `rig.anim.skeleton`, `rig.anim.skin`, `rig.anim.clip`, `rig.anim.track`, `rig.anim.blend`, `rig.anim.bind`
