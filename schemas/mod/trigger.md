---
id: "rig.mod.trigger"
maturity: "draft"
summary: "Discrete gated event. Format when present."
fields:
  - name: "source"
    ref: "entity"
    required: true
    meaning: "Sensor / GPIO / presence / switch entity that fires this trigger"
  - name: "action"
    type: "string"
    enum: ["color-flash","play-sample"]
    required: true
    meaning: "color-flash or play-sample"
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Skip when false; absent = true"
    absent: "true"
  - name: "cooldownMs"
    ref: "int"
    meaning: "Optional. Minimum ms between successful fires; absent = 0"
    absent: "0"
  - name: "calendar"
    ref: "entity"
    meaning: "Optional. Entity carrying calendar hours / span that must be active; absent = always"
    absent: "always"
  - name: "fadeInMs"
    ref: "int"
    meaning: "Optional. Colour-flash fade in; absent = host default"
    absent: "host default"
  - name: "holdMs"
    ref: "int"
    meaning: "Optional. Colour-flash hold; absent = host default"
    absent: "host default"
  - name: "fadeOutMs"
    ref: "int"
    meaning: "Optional. Colour-flash fade out; absent = host default"
    absent: "host default"
  - name: "palette"
    type: "array"
    itemsRef: "rgba"
    meaning: "Optional. Colour-flash palette (0-1 floats); absent = host default"
    absent: "host default"
  - name: "mode"
    type: "string"
    enum: ["forward","backward","pendulum","random"]
    meaning: "Optional. forward, backward, pendulum, random; absent = forward"
    absent: "forward"
  - name: "volume"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. Play-sample gain 0-1; absent = host default"
    absent: "host default"
  - name: "loop"
    ref: "bool"
    meaning: "Optional. Play-sample loop; absent = false"
    absent: "false"
  - name: "samples"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. Play-sample assets (rig.media.asset_ref); absent = none"
    absent: "none"
---
# `rig.mod.trigger`

Discrete gated event. Format when present.

Unlike [`rig.mod.binding`](binding.md) (continuous property drive), a trigger fires an action when its source asserts and gates allow.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Sensor / GPIO / presence / switch entity that fires this trigger |
| `action` | enum | `color-flash` or `play-sample` |
| `enabled` | bool | Optional. Skip when false; absent = true |
| `cooldownMs` | int | Optional. Minimum ms between successful fires; absent = 0 |
| `calendar` | entity | Optional. Entity carrying calendar hours / span that must be active; absent = always |
| `fadeInMs` | int | Optional. Colour-flash fade in; absent = host default |
| `holdMs` | int | Optional. Colour-flash hold; absent = host default |
| `fadeOutMs` | int | Optional. Colour-flash fade out; absent = host default |
| `palette` | rgba[] | Optional. Colour-flash palette (0-1 floats); absent = host default |
| `mode` | enum | Optional. `forward`, `backward`, `pendulum`, `random`; absent = `forward` |
| `volume` | float | Optional. Play-sample gain 0-1; absent = host default |
| `loop` | bool | Optional. Play-sample loop; absent = false |
| `samples` | entity[] | Optional. Play-sample assets ([`rig.media.asset_ref`](../media/asset-ref.md)); absent = none |

Edge / cooldown clocks and LED status flashes are host runtime - do not serialize them.
