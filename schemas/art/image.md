# `rig.art.image`

Documentary image of a work. Format when present.

VRA Core distinguishes the work from images of the work. This schema is that image link.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | Entity carrying [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `image`) |

Do not put a path on this schema. File identity lives on the asset entity. A second image is another entity.
