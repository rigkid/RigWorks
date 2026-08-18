# `rig.plant.portrait`

Photo of a plant. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | Entity carrying [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `image`) |

Do not put a path on this schema. File identity lives on the asset entity. Decode / GPU / thumbnails are fulfillment.

A second photo is another entity. Do not invent a gallery array here.
