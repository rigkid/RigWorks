# `rig.input.axes`

Logical sticks and triggers for one player. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for a label. Device handles and edge caches stay in the host. Which physical control feeds a field is [`rig.input.binding`](binding.md).

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `moveX` | float | Optional. Move stick X, -1..1; absent = 0 |
| `moveY` | float | Optional. Move stick Y, -1..1; absent = 0 |
| `lookX` | float | Optional. Look stick X, -1..1; absent = 0 |
| `lookY` | float | Optional. Look stick Y, -1..1; absent = 0 |
| `leftTrigger` | float | Optional. 0-1; absent = 0 |
| `rightTrigger` | float | Optional. 0-1; absent = 0 |

Hosts poll hardware into these fields during `Update`. Face buttons stay on [`rig.input.buttons`](buttons.md).
