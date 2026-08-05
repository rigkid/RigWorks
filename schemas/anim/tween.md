# `rig.anim.tween`

Drive one float property over time. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `target` | entity | Entity to drive |
| `propertyKey` | string | Field name / path |
| `from` | float | Start |
| `to` | float | End |
| `duration` | float | Seconds |
| `elapsed` | float | Seconds |
| `easing` | enum | linear, easeIn, easeOut, easeInOut |
| `loop` | bool | Repeat |
| `playing` | bool | Active |

No onComplete callbacks — host flags / events only.
