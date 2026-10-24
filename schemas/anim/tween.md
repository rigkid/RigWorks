---
id: "rig.anim.tween"
maturity: "stable"
summary: "Drive one float property over time. Format when present."
fields:
  - name: "target"
    ref: "entity"
    required: true
    meaning: "Entity to drive"
  - name: "propertyKey"
    ref: "string"
    required: true
    meaning: "Field name / path"
  - name: "from"
    ref: "float"
    required: true
    meaning: "Start"
  - name: "to"
    ref: "float"
    required: true
    meaning: "End"
  - name: "duration"
    ref: "float"
    required: true
    meaning: "Seconds"
  - name: "elapsed"
    ref: "float"
    meaning: "Optional. Seconds; absent = 0"
    absent: "0"
  - name: "easing"
    type: "string"
    enum: ["linear","ease-in","ease-out","ease-in-out"]
    meaning: "Optional. linear, ease-in, ease-out, ease-in-out; absent = linear"
    absent: "linear"
  - name: "loop"
    ref: "bool"
    meaning: "Optional. Repeat; absent = false"
    absent: "false"
  - name: "playing"
    ref: "bool"
    meaning: "Optional. Active; absent = true"
    absent: "true"
---
# `rig.anim.tween`

Drive one float property over time. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `target` | entity | Entity to drive |
| `propertyKey` | string | Field name / path |
| `from` | float | Start |
| `to` | float | End |
| `duration` | float | Seconds |
| `elapsed` | float | Optional. Seconds; absent = 0 |
| `easing` | enum | Optional. linear, ease-in, ease-out, ease-in-out; absent = linear |
| `loop` | bool | Optional. Repeat; absent = false |
| `playing` | bool | Optional. Active; absent = true |

No onComplete callbacks - host flags / events only.

## Fulfillment

Advance in **Update** as an ECS system over tween components; write the target field
through the same property addressing as [`rig.mod.binding`](../mod/binding.md). Do not
introduce a free-function tick over an import side-table.
