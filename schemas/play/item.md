# `rig.play.item`

A stackable thing. Format when present. Compose [`rig.meta.named`](../meta/named.md) for the label.

| Field | Type | Meaning |
|-------|------|---------|
| `maxStack` | uint | Optional. Most that fit in one inventory slot; absent = 1 |

A picture is [`rig.media.asset_ref`](../media/asset-ref.md) on this entity or a child. Price, when the item is for sale, is [`rig.commerce.offer`](../commerce/offer.md) - do not add a price field here.
