# `rig.pixel.source`

Playback / capture settings for a raster input. Format when present.

File identity is [`rig.media.asset_ref`](../media/asset-ref.md) via `asset`. Compose [`rig.meta.named`](../meta/named.md) for a label.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | none, imageFile, generator, imageSequence, webcam, videoFile |
| `asset` | entity | Asset ref when kind needs a path; none otherwise |
| `generatorName` | string | Generator id when `kind=generator` |
| `sequenceFps` | float | Sequence playback |
| `sequenceFrame` | int | Current frame index |
| `webcamDevice` | int | Device index when `kind=webcam` |
| `webcamWidth` | int | Capture width hint |
| `webcamHeight` | int | Capture height hint |
| `videoTime` | float | Seconds into clip when `kind=videoFile` |

Loop comes from the asset_ref when applicable. Decode / grab / bake = fulfillment.
