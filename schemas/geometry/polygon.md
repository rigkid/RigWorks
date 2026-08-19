# `rig.geometry.polygon`

Freeform polygon with explicit vertices. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `points` | vec2[] | Vertices in order; at least 3. Winding is this order — no `winding` field |
| `closed` | bool | Optional. Absent means closed |
| `fillRule` | enum | Optional. nonzero, evenodd; absent = nonzero. Self-intersecting rings only |

This is a **single** ring. Compound shapes with holes use [`rig.geometry.path`](path.md) (extra `move-to` … `close` subpaths). A lone ring used as a CAD boolean / extrude operand still has orientation: reverse `points` to flip it.

**2D page space** (+X right, +Y down): clockwise shoelace = outer / solid; counter-clockwise = hole (boolean difference or profile cutout). Under `fillRule: nonzero`, opposite winding punches a hole. Under `evenodd`, overlap toggles.

Do not put `fillRule` on paint. Do not add a `winding` field here or on rectangle / ellipse / star / ring.

For an n-gon defined by a radius and a side count rather than by vertices, use [`rig.geometry.regular_polygon`](regular-polygon.md) — it survives editing as a parametric shape, where this one has already been resolved to points.

Curved contours use [`rig.geometry.path`](path.md).

Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md).
