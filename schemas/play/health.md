---
id: "rig.play.health"
maturity: "draft"
summary: "Hit points. Format when present."
fields:
  - name: "current"
    ref: "float"
    meaning: "Optional. Remaining. Absent = maximum"
    absent: "maximum"
  - name: "maximum"
    ref: "float"
    meaning: "Optional. Full. Absent = 1"
    absent: "1"
---
# `rig.play.health`

Hit points. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `current` | float | Optional. Remaining. Absent = `maximum` |
| `maximum` | float | Optional. Full. Absent = 1 |

`current` is the value at load, including a save of a running scene. Damage rules stay in the host.
