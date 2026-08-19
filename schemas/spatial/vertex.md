# `rig.spatial.vertex`

Locator / point marker. Format when present — presence means this entity is a point in the scene graph, not a drawable and not a mesh corner.

No fields. Pose lives on [`rig.spatial.transform`](transform.md). Compose:

- [`rig.spatial.transform`](transform.md) — the point (usual)
- [`rig.meta.named`](../meta/named.md) — label
- [`rig.spatial.relationship`](relationship.md) — children may parent here (null object)

**A scene is a root vertex.** An unparented vertex is the world origin; children set `parent` to it. A locator that is not a scene parents to that vertex (or to a [`rig.spatial.group`](group.md) under it). More than one unparented vertex that others parent to is more than one scene.

Do **not** put `x` / `y` / `z` on this schema. Do **not** invent `rig.spatial.scene` or a `kind` tag — the graph is the tag. Do **not** index into [`rig.geometry.mesh`](../geometry/mesh.md) `positions` — mesh corners stay packed arrays. Do **not** invent `rig.geometry.vertex` or `rig.geometry.point` for a locator.

Not [`rig.spatial.anchor`](anchor.md) (which cell of bounds is the origin). Not [`rig.font.anchor`](../font/anchor.md) (named glyph point; font cannot reuse transform).

A drawable dot is still a host present of this marker (or a tiny geometry primitive). The Contract names the role; it does not ship a point glyph.
