# `rig.geometry.mesh`

Indexed mesh. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `positions` | float[] | xyz tightly packed (x0,y0,z0,x1,…) |
| `normals` | float[] | Optional per-vertex normals, same packing, parallel to `positions` |
| `indices` | uint32[] | Triangle (or line) tessellation; empty = sequential. Hosts may rebuild this from `loops`. |
| `loops` | uint32[] | Optional concatenated n-gon vertex indices (authored faces). Empty = faces are implicit triangles from `indices`. |
| `loopSizes` | uint32[] | Optional vertex count per authored face; sum equals `loops.length`. A cube is six 4-gons, not twelve triangles. |
| `texcoords` | float[] | Optional per-vertex uv, tightly packed (u0,v0,u1,…); empty = none |
| `mode` | enum | triangles, lines, line-strip |
| `faceColors` | vec4[] | Optional per-face colour |
| `facePalette` | uint8[] | Optional per-face palette index |

One packing only — packed `float[]`, not `vec3[]` / `vec2[]` beside it. Hosts may expand for editors; the wire form stays flat. Mesh corners are these arrays, not [`rig.spatial.vertex`](../spatial/vertex.md) entities.

`faceColors` and `facePalette` are alternatives. Carrying both on one mesh is a document error (same rule as inline vs referenced paint). When `loops` is present they are one entry per authored face (per `loopSizes` row), not per tessellated triangle.

`normals` is authored shading data — mixed hard/soft edges need it. When absent, a presenter computes **face normals (flat shading)**; it must not smooth-average shared vertices, which fakes roundness the document never asked for.

## Edges

Do not store a parallel edge table. An authored edge is a consecutive pair in a `loops` face, plus the close from last to first. Name an edge for crease / [`rig.cad.fillet`](../cad/fillet.md) / [`rig.cad.chamfer`](../cad/chamfer.md) as an undirected vertex pair `{a, b}` into `positions` (store `min(a,b)`, `max(a,b)` on the wire).

N-gons are the authored face grammar — a cube is six 4-gons. `indices` are the triangle tessellation a presenter or CSG kernel may rebuild.

## Solids

When any [`rig.cad.*`](../cad/cuboid.md) component is present on the same entity, that CAD tree is the solid source of truth and this mesh is an optional bake. Hosts that can CSG should rebuild the mesh rather than treat the bake as authored.

Appearance: compose [`rig.render.material`](../render/material.md) on the same entity for shaded 3D. 2D / unlit presenters may use [`rig.paint.fill_stroke`](../paint/fill-stroke.md) instead. Do not add a material field on this schema.

No GPU buffer handles.
