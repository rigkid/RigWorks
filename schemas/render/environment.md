# `rig.render.environment`

Image-based light for the scene. One entity is enough. Format when present.

The lat-long image is a [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `image`). Do not store a path on this component.

| Field | Type | Meaning |
|-------|------|---------|
| `hdri` | entity | [`rig.media.asset_ref`](../media/asset-ref.md) of the lat-long radiance image |
| `intensity` | float | Optional. Scale; absent = 1 |

Decode and the spherical-harmonic projection stay fulfillment. Coefficients are a host cache.
