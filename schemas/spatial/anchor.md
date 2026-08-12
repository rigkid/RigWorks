# `rig.spatial.anchor`

Which point of an entity's local bounds is the local origin. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `point` | string | One of the nine 3×3 cells (see below) |

| | | |
|---|---|---|
| `topLeft` | `topCenter` | `topRight` |
| `middleLeft` | `center` | `middleRight` |
| `bottomLeft` | `bottomCenter` | `bottomRight` |

**Absent component:** do not remap. Local (0,0) stays where the entity's size schema already puts it — page trim defaults to top-left; [`rig.geometry.rectangle`](../geometry/rectangle.md) keeps its authored `x`,`y` corner; centre-authored primitives ([`ellipse`](../geometry/ellipse.md), [`regular_polygon`](../geometry/regular-polygon.md), [`star`](../geometry/star.md), [`arc`](../geometry/arc.md), [`ring`](../geometry/ring.md)) keep their authored `centerX`/`centerY`.

**When present:** `point` names which cell of the local axis-aligned bounds coincides with local (0,0) (and with [`rig.spatial.transform`](transform.md) `position` when that is present). The host offsets from authored bounds to honour it — geometry field layouts do not change.

Compose onto any entity that has local bounds. On a page, it is also where page-local (0,0) sits for children.

Do **not** put this enum on transform — pose stays TRS only. Do **not** re-declare the field on `rig.layout.page` or geometry schemas.

Bounds come from the entity's size (page trim, rectangle extent, ellipse radii, host AABB for meshes). Without bounds, omit this component.
