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
| `palette` | rgba[] | Optional. Colour-flash palette (0–1 floats); absent = host default |
| `mode` | enum | Optional. `forward`, `backward`, `pendulum`, `random`; absent = `forward` |
| `volume` | float | Optional. Play-sample gain 0–1; absent = host default |
| `loop` | bool | Optional. Play-sample loop; absent = false |
| `samples` | entity[] | Optional. Play-sample assets ([`rig.media.asset_ref`](../media/asset-ref.md)); absent = none |

Edge / cooldown clocks and LED status flashes are host runtime — do not serialize them.
