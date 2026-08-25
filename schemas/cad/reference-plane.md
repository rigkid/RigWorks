# `rig.cad.reference_plane`

Unbounded flat datum to build against. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `origin` | vec3 | Optional. Absent = `0,0,0`. A point on the plane |
| `normal` | vec3 | Optional. Absent = `0,1,0`. Plane normal; need not be unit length |
| `a` | entity | Optional. Anchor entity. Present = the plane passes through it and `origin` is ignored |

This is not a solid. Do not put it on the same entity as [`rig.cad.cuboid`](cuboid.md) / [`boolean`](boolean.md), and never list it in `boolean.operands` — a datum has no volume to add or subtract. It does not cut anything either; a clipped view is [`rig.bim.viewpoint`](../bim/viewpoint.md).

The plane has no edges. A host draws whatever patch suits the current view.

`a` moves the plane onto an entity so the datum tracks it when the model rebuilds; `normal` stays authored either way, since one entity fixes a point but not an orientation. A host that cannot resolve `a` ignores the component rather than falling back to `origin`. A `normal` of zero length is ignored the same way.

Give the datum a readable label with [`rig.meta.named`](../meta/named.md).
