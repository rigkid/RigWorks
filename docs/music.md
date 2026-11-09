# Music

A player names a tempo, a key, a chord, and a part. Those words land on [`rig.music.*`](../schemas/music/transport.md). A staff, a cent offset, a roman numeral, and a polymetric stack do not get schemas of their own.

Pitch, scales, and chords are 12-tone equal temperament. Letter names are derived from the MIDI number. 60 is C4. Pitch class 0 is C, matching [`rig.audio.analysis`](../schemas/audio/analysis.md) `chroma` and `key`.

## Map

| Human word | Rig |
|------------|-----|
| Tempo | [`rig.music.transport`](../schemas/music/transport.md) `bpm` |
| Meter | `timeSigNum` beats per bar, `timeSigDen` the note that gets one beat. Bar and beat-in-bar are derived from `positionBeats` |
| Playhead | `positionBeats`, in beats. Pause sets `playing` false and keeps `positionBeats` |
| Swing | [`rig.music.clock`](../schemas/music/clock.md) `swingAmount` / `swingSubdiv`. The clock does not own tempo |
| External beat | `externalSync` with `syncBeat` / `syncPhase`. One tempo field, on the transport |
| Step grid | [`rig.music.pattern`](../schemas/music/pattern.md) of [`rig.music.step`](../schemas/music/step.md). Default `stepsPerBeat` 4 is sixteenths |
| Piano-roll note | [`rig.music.note`](../schemas/music/note.md). `start` and `duration` are beats |
| Pitch | MIDI note number on the step or the note. 60 is C4 |
| Key | `rootNote` plus `scale` on the pattern. A heard key is the analysis feature `key` (pitch class plus the same scale word). The heard value stays in the host |
| Scale | `chromatic` (0-11), `major` (0 2 4 5 7 9 11), `minor` (0 2 3 5 7 8 10, natural), `dorian` (0 2 3 5 7 9 10), `pentatonic` (0 2 4 7 9, major pentatonic). Sets are semitones from `rootNote` |
| Chord | `intervals` on the step or the note: semitone offsets from `pitch`, not scale degrees. A major third is 4. A major triad is `[4, 7]`; a minor triad is `[3, 7]`. Omit 0 |
| Tone | `waveform` on the step: 0 sine, 1 tri, 2 saw, 3 square, 4 noise. 0-3 match [`rig.mod.lfo`](../schemas/mod/lfo.md). 5-7 are unassigned. 8 and up are host instrument slots |
| Part, verse, chorus | [`rig.meta.named`](../schemas/meta/named.md) on the pattern. An [`rig.music.arrangement`](../schemas/music/arrangement.md) frame lists which patterns play. The frame has no title |

`scale` and `rootNote` name the collection. They do not move the steps. A step `pitch` is already the MIDI note.

`effect` 0 on a step is no effect. 1-7 are host slots. The Contract assigns them no shared effect.

A drum grid is several patterns, one `lane` each, on one sequencer. Lanes in one stack are the same length. Unequal lengths are polymeter, which the Contract does not describe.

## A voice

The part plays notes. The instrument is four entities. Each block is its own entity, so a second oscillator is a second entity.

| Block | Rig |
|-------|-----|
| Oscillator | [`rig.synth.oscillator`](../schemas/synth/oscillator.md). sine, tri, saw, square. `pitch` is a MIDI note, 60 = C4 |
| Filter | [`rig.synth.filter`](../schemas/synth/filter.md). `low-pass`, `high-pass`, or `band-pass`. `input` is the oscillator |
| Amplifier | [`rig.synth.amplifier`](../schemas/synth/amplifier.md). Linear `gain` 0-1. `input` is the filter. A closed voice writes 0 |
| Envelope | [`rig.synth.envelope`](../schemas/synth/envelope.md). Attack, decay, sustain, release, in seconds. `sustain` is a 0-1 level |

[`rig.mod.binding`](../schemas/mod/binding.md) carries the envelope onto `gain` and onto `cutoffHertz`. [`rig.mod.lfo`](../schemas/mod/lfo.md) uses that same binding. The mix the amplifier feeds is [`rig.audio.bus`](../schemas/audio/bus.md). The faceplate and the jacks stay [`rig.modular.*`](../schemas/modular/module.md).

Worked files: [`examples/music-chord.json`](../examples/music-chord.json), [`examples/music-sequencer.json`](../examples/music-sequencer.json), [`examples/synth-voice.json`](../examples/synth-voice.json).

## Left as fulfillment

Staff notation, clefs, tuplet spellings, solfege, functional harmony (a dominant seventh as a roman numeral), cents, just ratios, groove templates, and a second name for minor pentatonic. A host may compute any of them. The document keeps the numbers above.

A patcher's cords and bangs are a different graph - [pd.md](pd.md). A voice pulled out of that patch uses the four blocks above. A faceplate jack is [`rig.modular.port`](../schemas/modular/port.md) - [eurosynth.md](eurosynth.md).
