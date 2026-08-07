# `rig.music.arrangement`

Ordered playback frames — a tracker's order list / a fantasy console's music track. Format when present.

An arrangement **has** frames. A frame **has** patterns. A pattern **has** steps.

## Frame

| Field | Type | Meaning |
|-------|------|---------|
| `patterns` | entity[] | [`rig.music.pattern`](pattern.md) entities active this frame; each pattern's own `lane` says which channel it plays on |

Omit a lane from `patterns` to leave that channel silent for the frame — no placeholder pattern needed.

## Arrangement

| Field | Type | Meaning |
|-------|------|---------|
| `frames` | frame[] | Ordered frames |
| `currentFrame` | int | Optional. Playhead index into `frames`; absent = 0 |
| `loop` | bool | Optional. Loop; absent = false |
| `loopStartFrame` | int | Optional. First frame of the loop region; absent = 0 |
| `loopEndFrame` | int | Optional. Frame after the last looped frame; absent = `frames.length` |

Running state comes from transport (`playing`). No onFrame callbacks.

Each pattern advances at its own `stepsPerBeat`; the arrangement only orders which patterns play in which frame, not their internal timing. A frame's duration is however long its longest active pattern takes to loop once — the Contract does not add a separate frame-length field.
