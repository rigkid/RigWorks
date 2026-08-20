# `rig.font.axis`

One design axis on a face. Format when present.

OpenType `fvar` axis. Parent to the [`rig.font.face`](face.md) with [`rig.spatial.relationship`](../spatial/relationship.md). Compose [`rig.meta.named`](../meta/named.md) if you want a display label separate from `name`. Order among axes is `relationship.order` (or document order when absent).

| Field | Type | Meaning |
|-------|------|---------|
| `tag` | string | Required. Four-character tag (`wght`, `wdth`, `slnt`, `GRAD`) |
| `name` | string | Optional. Human label (UFO / UI); absent = use `tag` |
| `min` | float | Required. Minimum design value |
| `default` | float | Required. Default design value |
| `max` | float | Required. Maximum design value |

Piecewise normalized maps compose optional [`rig.font.avar`](avar.md) on the **same** entity. Absent avar = identity (−1/−1, 0/0, 1/1).

Do not put axis values on [`rig.media.text`](../media/text.md) — live coordinates are host / document state. Named instances are fulfillment.
