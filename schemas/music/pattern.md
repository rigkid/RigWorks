# `rig.music.pattern`

Ordered steps. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label. Tempo comes from transport — no `bpm` here.

A [`rig.music.sequencer`](sequencer.md) **has** a pattern. A pattern **has** steps.

| Field | Type | Meaning |
|-------|------|---------|
| `steps` | step[] | Ordered [`rig.music.step`](step.md) cells; length = pattern length |
| `rootNote` | int | MIDI pitch 0–127 (scale root) |
| `scale` | enum | chromatic, major, minor, dorian, pentatonic |

No parallel `numSteps` — use `steps.length`.
