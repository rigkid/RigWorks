# `rig.led.uv_map`

LED → UV sampling map. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label.

| Field | Type | Meaning |
|-------|------|---------|
| `width` | int | Grid width |
| `height` | int | Grid height |
| `pixels` | {index:int, u:float, v:float}[] | LED → UV |

Sampling / present in code. Colours are runtime cache.
