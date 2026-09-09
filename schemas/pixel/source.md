# `rig.pixel.source`

Playback / capture settings for a raster input. Format when present.

File identity is [`rig.media.asset_ref`](../media/asset-ref.md) via `asset`. Compose [`rig.meta.named`](../meta/named.md) for a label.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | none, image-file, generator, image-sequence, video-device, video-file, cast-receive |
| `asset` | entity | Asset ref when kind needs a path; absent otherwise |
| `generatorName` | string | Generator id; required when `kind=generator` |
| `sequenceFps` | float | Optional. Sequence playback |
| `sequenceFrame` | int | Optional. Current frame index; absent = 0 |
| `videoDeviceRef` | uint | Optional. Host device index when `kind=video-device`; absent = default device |
| `videoDeviceName` | string | Optional. Device name; stable identity when indices shift (re-plugged or reordered devices) |
| `videoWidth` | uint | Optional. Selected capture width; absent/0 = host default |
| `videoHeight` | uint | Optional. Selected capture height; absent/0 = host default |
| `videoTime` | float | Optional. Seconds into clip when `kind=video-file`; absent = 0 |

Only `kind` is required - emit the fields the chosen kind needs and leave the rest absent.

`kind=cast-receive` is an inbound live frame (AirPlay / peer). How the host opens the session stays fulfillment.

`kind=video-device` is a live video input (camera, capture card, virtual camera) - not a file, and not a generic device. `videoDeviceRef` and `videoDeviceName` are machine-local, same bargain as MIDI `portIndex` / `portName`: ship whichever the host API exposes, and fail visibly rather than bind the wrong device. Prefer `videoDeviceName` when the host reports one. `videoWidth` / `videoHeight` are the one selected capture mode. Mode lists, negotiation, and fallback stay fulfillment; the mode actually delivered is host cache.

Loop comes from the asset_ref when applicable. Decode / grab / bake = fulfillment.
