---
id: "rig.music.pattern"
maturity: "draft"
summary: "Ordered steps. Format when present."
fields:
  - name: "steps"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.music.step.schema.json\"}"
    required: true
    meaning: "Ordered rig.music.step cells; length = pattern length"
  - name: "rootNote"
    type: "integer"
    minimum: 0
    maximum: 127
    meaning: "Optional. MIDI pitch 0-127, the scale root. 60 is C4. Absent = 60. With scale, names the collection; does not transpose steps"
    absent: "60"
  - name: "scale"
    type: "string"
    enum: ["chromatic","major","minor","dorian","pentatonic"]
    meaning: "Optional. chromatic, major, minor, dorian, or pentatonic; absent = chromatic. Semitone sets from rootNote, 12-tone equal temperament: chromatic 0-11, major 0 2 4 5 7 9 11, minor 0 2 3 5 7 8 10 (natural), dorian 0 2 3 5 7 9 10, pentatonic 0 2 4 7 9 (major pentatonic). Does not transpose steps"
    absent: "chromatic"
  - name: "lane"
    ref: "int"
    meaning: "Optional. Voice index when several patterns play together"
  - name: "stepsPerBeat"
    type: "number"
    exclusiveMinimum: 0
    meaning: "Optional. Steps advanced per transport beat; absent = 4 (16th notes)"
    absent: "4 (16th notes)"
  - name: "loopStartStep"
    ref: "int"
    meaning: "Optional. First step of the loop region; absent = 0"
    absent: "0"
  - name: "loopEndStep"
    ref: "int"
    meaning: "Optional. Step after the last looped step; absent = steps.length (loop the whole pattern)"
    absent: "steps"
---
# `rig.music.pattern`

Ordered steps. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label. Tempo comes from transport - no `bpm` here.

A [`rig.music.sequencer`](sequencer.md) **has** a pattern. A pattern **has** steps.

| Field | Type | Meaning |
|-------|------|---------|
| `steps` | step[] | Ordered [`rig.music.step`](step.md) cells; length = pattern length |
| `rootNote` | int | Optional. MIDI pitch 0-127, the scale root. 60 is C4. Absent = 60. With `scale`, names the collection; does not transpose steps |
| `scale` | enum | Optional. chromatic, major, minor, dorian, or pentatonic; absent = chromatic. Semitone sets from `rootNote`, 12-tone equal temperament: chromatic 0-11, major 0 2 4 5 7 9 11, minor 0 2 3 5 7 8 10 (natural), dorian 0 2 3 5 7 9 10, pentatonic 0 2 4 7 9 (major pentatonic). Does not transpose steps |
| `lane` | int | Optional. Voice index when several patterns play together |
| `stepsPerBeat` | float | Optional. Steps advanced per transport beat; absent = 4 (16th notes) |
| `loopStartStep` | int | Optional. First step of the loop region; absent = 0 |
| `loopEndStep` | int | Optional. Step after the last looped step; absent = `steps.length` (loop the whole pattern) |

No parallel `numSteps` - use `steps.length`.

`stepsPerBeat` is musical time: the wall-clock rate comes from transport bpm. A tracker that used an absolute per-pattern speed converts through the transport - pick bpm and `stepsPerBeat` so the step rate matches the original (default `stepsPerBeat` 4 is sixteenth notes at the transport tempo).

`steps` is a single row. A drum grid is several pattern entities sharing one [`rig.music.sequencer`](sequencer.md), each with its own `lane` - not one pattern holding a matrix. Lanes advance together, so patterns in one stack should be the same length; a host running unequal lengths is polymetric, which the Contract does not describe.

Omit `lane` for a single-voice pattern. Two patterns in one stack sharing a lane number is a document error, not a layering instruction.

`scale` and `rootNote` name a collection. A step `pitch` stays an absolute MIDI note, the same numbering as [`rig.music.note`](note.md). `pitch` 0 is MIDI note 0, not scale degree 1. A host may quantize a performance to the collection; the stored pitches stay absolute. The word `pentatonic` is major pentatonic. Minor pentatonic has no scale word; write the pitches.

How the words map: [music.md](../../docs/music.md).
