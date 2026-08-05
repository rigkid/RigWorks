# `rig.music.midi_output`

MIDI sink identity. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `portName` | string | Device / port |
| `open` | bool | Port open |

Pending byte queues stay in the host — do not serialize. Flush in a code pack.
