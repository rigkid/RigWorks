---
id: "rig.music.midi_output"
maturity: "draft"
summary: "MIDI sink identity. Format when present."
topJson: "{\"allOf\":[{\"anyOf\":[{\"required\":[\"portName\"]},{\"required\":[\"portIndex\"]}]}]}"
fields:
  - name: "portName"
    ref: "string"
    meaning: "Platform port name as reported by the host"
  - name: "portIndex"
    ref: "uint"
    meaning: "Host API port index"
  - name: "open"
    ref: "bool"
    meaning: "Optional. Port open; absent = true"
    absent: "true"
---
# `rig.music.midi_output`

MIDI sink identity. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `portName` | string | Platform port name as reported by the host |
| `portIndex` | uint | Host API port index |
| `open` | bool | Optional. Port open; absent = true |

Ship whichever identifier the host API exposes - `portName` when it names ports, `portIndex` when it numbers them; at least one must be present. Both are machine-local: moving a document between machines will not find the same port, and a host should fail visibly rather than silently bind to the wrong one.

Pending byte queues stay in the host - do not serialize. Flush in a code pack.
