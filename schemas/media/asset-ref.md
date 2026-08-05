# `rig.media.asset_ref`

**File identity.** One schema for paths. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | image, audio, video, model, font, other |
| `path` | string | File or directory path (host root rules apply) |
| `loop` | bool | Playback loop when the asset kind supports it |

Decode / GPU / players are fulfillment. Other schemas reference this entity — they do not invent parallel path fields.
