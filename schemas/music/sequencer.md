# `rig.music.sequencer`

Playhead over a pattern. Format when present.

A sequencer **has** a pattern. The pattern **has** steps.

| Field | Type | Meaning |
|-------|------|---------|
| `pattern` | entity | Entity with [`rig.music.pattern`](pattern.md) |
| `currentStep` | int | Playhead index into `pattern.steps` |
| `clock` | entity | Entity with [`rig.music.clock`](clock.md) |

Running state comes from transport (`playing`). Step count = `pattern.steps.length`.
No onStep callbacks.
