---
id: "rig.anim.skin"
maturity: "draft"
summary: "Skin binding on a mesh entity. Format when present. The drawable is rig.geometry.mesh on the same entity."
fields:
  - name: "skeleton"
    ref: "entity"
    required: true
    meaning: "rig.anim.skeleton"
  - name: "joints"
    type: "array"
    minItems: 1
    itemsRef: "entity"
    required: true
    meaning: "Bone entities, index order for the arrays below"
  - name: "inverseBind"
    type: "array"
    itemsType: "number"
    required: true
    meaning: "Column-major 4×4 per joint, 16 floats each, mesh space to joint space. Length = joints.length * 16"
  - name: "jointIndices"
    type: "array"
    itemsRef: "uint32"
    required: true
    meaning: "Four joint indices per mesh vertex, into joints"
  - name: "jointWeights"
    type: "array"
    itemsType: "number"
    required: true
    meaning: "Four weights per mesh vertex, parallel to jointIndices. Each vertex sums to 1"
---
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
