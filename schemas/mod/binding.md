# `rig.mod.binding`

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Modulator entity (e.g. LFO) |
| `target` | entity | Driven entity |
| `propertyKey` | string | Field name / path (same style as tween) |
| `depth` | float | Optional. Scale; absent = 1 |
| `min` | float | Optional. Clamp; absent = unclamped |
| `max` | float | Optional. Clamp; absent = unclamped |
| `additive` | bool | Optional. Add vs replace; absent = false (replace) |

## Fulfillment

A binding is two entities plus a property address — fulfill it as an **Update** system that reads the source modulator and writes the target field (same `propertyKey` style as [`rig.ui.control`](../ui/control.md) and tween). Do not park live values on the import report. Tween / orbit drives follow the same pattern when implemented.
