---
id: "rig.art.image"
maturity: "draft"
summary: "Documentary image of a work. Format when present."
topJson: "{\"description\":\"Documentary image of a work. asset is a rig.media.asset_ref entity. Not an inline path.\"}"
fields:
  - name: "asset"
    ref: "entity"
    required: true
    meaning: "Entity carrying rig.media.asset_ref (kind image)"
---
# `rig.art.image`

Documentary image of a work. Format when present.

VRA Core distinguishes the work from images of the work. This schema is that image link.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | Entity carrying [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `image`) |

Do not put a path on this schema. File identity lives on the asset entity. A second image is another entity.
