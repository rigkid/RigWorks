# `rig.anim.skin`

Skin binding on a mesh entity. Format when present. The drawable is [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity.

| Field | Type | Meaning |
|-------|------|---------|
| `skeleton` | entity | [`rig.anim.skeleton`](skeleton.md) |
| `joints` | entity[] | Bone entities, index order for the arrays below |
| `inverseBind` | float[] | Column-major 4×4 per joint, 16 floats each, mesh space to joint space. Length = `joints.length * 16` |
| `jointIndices` | uint32[] | Four joint indices per mesh vertex, into `joints` |
| `jointWeights` | float[] | Four weights per mesh vertex, parallel to `jointIndices`. Each vertex sums to 1 |

Vertex count is `positions.length / 3` on the mesh. Unused influences are index 0 and weight 0.

The posed result is a host cache. Do not serialize a baked posed mesh beside the bind pose.
