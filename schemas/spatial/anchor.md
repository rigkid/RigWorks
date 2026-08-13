# `rig.spatial.anchor`

Which cell of an entity's local bounds is the local origin. Format when present.
Axes stay +X +Y +Z — the host offsets to the named cell; it does not invert signs.

| Field | Type | Meaning |
|-------|------|---------|
| `point` | string | One of the nine 3×3 face cells (see below) |
| `height` | string | Optional Z slice of the cuboid: `min` / `center` / `max`. Absent = `min`. |

**XY (`point`):**

| | | |
|---|---|---|
| `topLeft` | `topCenter` | `topRight` |
| `middleLeft` | `center` | `middleRight` |
| `bottomLeft` | `bottomCenter` | `bottomRight` |

Together with `height`, that is a **3×3×3** cuboid cell (27 corners / edge midpoints / centre) without twenty-seven string ids.

**Absent component:** do not remap. Local (0,0) stays where the entity's size schema already puts it — page trim defaults to top-left; [`rig.geometry.rectangle`](../geometry/rectangle.md) keeps its authored `x`,`y` corner; centre-authored primitives ([`ellipse`](../geometry/ellipse.md), [`regular_polygon`](../geometry/regular-polygon.md), [`star`](../geometry/star.md), [`arc`](../geometry/arc.md), [`ring`](../geometry/ring.md)) keep their authored `centerX`/`centerY`.

**When present:** `point` (and optional `height`) names which cell of the local axis-aligned bounds coincides with local (0,0,0) (and with [`rig.spatial.transform`](transform.md) `position` when that is present). The host offsets from authored bounds to honour it — geometry field layouts do not change. Interior directions follow the host axes: an origin at top-left on a Y-up bed means the interior is +X and −Y.

Compose onto any entity that has local bounds. On a page, it is also where page-local (0,0) sits for children. `height` matters when the host has a Z extent (machine envelope, mesh AABB, 3D zone); planar pages may omit it.

Do **not** put this enum on transform — pose stays TRS only. Do **not** re-declare the field on `rig.layout.page` or geometry schemas. Do **not** encode origin as axis invert (`signX` / `signY` / `signZ`).

Bounds come from the entity's size (page trim, rectangle extent, ellipse radii, host AABB for meshes). Without bounds, omit this component.
