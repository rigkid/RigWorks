# `rig.render.sprite`

A textured quad in the entity's plane. Format when present. Colour is paint on the same entity ([`rig.paint.fill`](../paint/fill.md) or [`rig.paint.fill_stroke`](../paint/fill-stroke.md)), not a second colour here.

| Field | Type | Meaning |
|-------|------|---------|
| `texture` | entity | [`rig.media.asset_ref`](../media/asset-ref.md) |
| `tiling` | vec2 | Optional. Texture repeats across the quad; absent = 1, 1 |
| `flipX` | bool | Optional. Mirror in local X; absent = false |
| `flipY` | bool | Optional. Mirror in local Y; absent = false |
| `frame` | uint | Optional. Frame index in a sheet; absent = 0 |
| `columns` | uint | Optional. Sheet columns. Required when `rows` is set |
| `rows` | uint | Optional. Sheet rows. Required when `columns` is set |

Pose and size are [`rig.spatial.transform`](../spatial/transform.md). A single tiling factor writes the same number in both components of `tiling`. Sheet frames are `columns` by `rows`, row-major, index `frame`.
