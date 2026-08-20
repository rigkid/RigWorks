# `rig.media.asset_ref`

**File identity.** One schema for paths. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | image, audio, video, model, font, document, other |
| `path` | string | File or directory path. Sidecars that travel with the document are relative to the package `data/` folder (`covers/moby-dick.jpg`, not `data/covers/moby-dick.jpg`). Absolute, URL, and other host-root paths stay host-root — [interchange](../../docs/interchange.md#package) |
| `loop` | bool | Optional. Playback loop when the asset kind supports it; meaningless for stills, so absent is not false — it is "not applicable" |

Decode / GPU / players are fulfillment. Other schemas reference this entity — they do not invent parallel path fields.
