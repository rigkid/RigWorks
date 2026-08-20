# `rig.cad.dimension`

Numeric datum between CAD entities. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `linear`, `aligned`, `horizontal`, `vertical`, `diameter`, or `angle` |
| `a` | entity | First solid / point entity |
| `b` | entity | Optional. Second entity. Required for length and angle kinds. Unused for `diameter` |
| `value` | float | Driving or displayed number. Scene length (`document.defaultUnit`) except `angle`, which is degrees |
| `measurement` | bool | Optional. Absent = false: a solver may move `a` / `b` to match `value`. True = label only; do not drive |
| `offset` | vec3 | Optional. Absent = `0,0,0`. Witness / label placement in the same space as the entities |

This is not a solid. Do not put it on the same entity as `rig.cad.cuboid` / `boolean`. Compose [`rig.spatial.transform`](../spatial/transform.md) on this entity if the host needs a pose for the label.

`linear` is the 3D distance. `aligned` is the distance along the line between the two entities. `horizontal` / `vertical` are the X and Y components (Y-up). `diameter` reads one circular solid (`a`). `angle` is the angle between `a` and `b`.

A host without a solver still stores the fields and may draw the witness. Driving (`measurement` false) is fulfillment — **rigSolveSpace** is one kernel. Do not invent a parallel `rig.cad.constraint` tagged union; geometric constraints (coincident, parallel) stay later split schemas if they earn a catalog id.
