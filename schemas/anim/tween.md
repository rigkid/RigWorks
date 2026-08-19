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

No onComplete callbacks — host flags / events only.

## Fulfillment

Advance in **Update** as an ECS system over tween components; write the target field
through the same property addressing as [`rig.mod.binding`](../mod/binding.md). Do not
introduce a free-function tick over an import side-table.
