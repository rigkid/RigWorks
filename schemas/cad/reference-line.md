# `rig.cad.reference_line`

Unbounded straight datum to build against. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `origin` | vec3 | Optional. Absent = `0,0,0`. A point the line passes through |
| `direction` | vec3 | Optional. Absent = `1,0,0`. Which way the line runs; need not be unit length |
| `a` | entity | Optional. Anchor entity. With `b`, derives the line from the two entities |
| `b` | entity | Optional. Second anchor entity. Only read when `a` is also present |

This is not a solid. Do not put it on the same entity as [`rig.cad.cuboid`](cuboid.md) / [`boolean`](boolean.md), and never list it in `boolean.operands` - a datum has no volume to add or subtract.

The line has no ends. `origin` and `direction` state where it lies, not how far it goes; a host draws whatever span suits the current view. Reach for [`rig.geometry.line`](../geometry/line.md) when the endpoints are the point of the thing.

When `a` and `b` are both present they are the placement: the line passes through `a` and runs toward `b`, and `origin` / `direction` are ignored. That way the datum tracks its parts when the model rebuilds. A host that cannot resolve either entity ignores the component rather than falling back to the coordinates. `direction` (or a coincident `a` and `b`) of zero length is ignored the same way.

Give the datum a readable label with [`rig.meta.named`](../meta/named.md) - an axis is a reference line called "axis", not a separate schema id.
