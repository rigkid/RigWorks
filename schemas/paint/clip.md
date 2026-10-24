---
id: "rig.paint.clip"
maturity: "draft"
summary: "Clip a drawable to a path. Format when present."
fields:
  - name: "path"
    ref: "entity"
    required: true
    meaning: "Clip contour. Clip rule is that path's rig.geometry.path fillRule"
---
# `rig.paint.clip`

Clip a drawable to a path. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `path` | entity | Clip contour. Clip rule is that path's [`rig.geometry.path`](../geometry/path.md) `fillRule` |

Compose on the drawable. The contour stays on its own entity. Do not reuse [`rig.pixel.mask_path`](../pixel/mask-path.md) - that bag is a packed compositor polygon.
