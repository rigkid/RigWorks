# `rig.paint.clip`

Clip a drawable to a path. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `path` | entity | Clip contour. Clip rule is that path's [`rig.geometry.path`](../geometry/path.md) `fillRule` |

Compose on the drawable. The contour stays on its own entity. Do not reuse [`rig.pixel.mask_path`](../pixel/mask-path.md) - that bag is a packed compositor polygon.
