---
id: "rig.person.portrait"
maturity: "draft"
summary: "Portrait photo of a human, character, user, or contact. Format when present."
topJson: "{\"description\":\"Portrait photo. asset is a rig.media.asset_ref entity. Not an inline path.\"}"
fields:
  - name: "asset"
    ref: "entity"
    required: true
    meaning: "Entity carrying rig.media.asset_ref (kind image)"
---
# `rig.person.portrait`

Portrait photo of a human, character, user, or contact. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `asset` | entity | Entity carrying [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `image`) |

Do not put a path on this schema. File identity lives on the asset entity. Decode / GPU / thumbnails are fulfillment.

A second photo is another entity. Do not invent a gallery array here.
