# `rig.font.glyph`

One glyph in a face. Format when present.

Compose [`rig.meta.named`](../meta/named.md) — `stableId` is the UFO glyph name (`A`, `space`, `a.ss01`). Do not re-declare `name` here.

Contours compose [`rig.geometry.path`](../geometry/path.md) on the **same** entity (font-unit space, y-up, origin on the baseline). Absent path = empty glyph (space, `.notdef` with no outline). Never put command streams on this schema.

| Field | Type | Meaning |
|-------|------|---------|
| `unicodes` | uint32[] | Optional. Unicode code points; absent or empty = unencoded |
| `width` | float | Advance width in font units |

Parent the glyph to a [`rig.font.layer`](layer.md) with [`rig.spatial.relationship`](../spatial/relationship.md). Composites are child entities with [`rig.font.component`](component.md). Named points are child entities with [`rig.font.anchor`](anchor.md).

Left / right sidebearings are not stored — they follow from path bounds and `width`.
