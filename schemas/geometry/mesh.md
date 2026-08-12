# `rig.geometry.mesh`

Indexed mesh. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `positions` | float[] | xyz tightly packed (x0,y0,z0,x1,…) |
| `normals` | float[] | Optional per-vertex normals, same packing, parallel to `positions` |
| `indices` | uint32[] | Triangle (or line) indices; empty = sequential |
| `texcoords` | float[] | Optional per-vertex uv, tightly packed (u0,v0,u1,…); empty = none |
| `mode` | enum | triangles, lines, lineStrip |
| `faceColors` | vec4[] | Optional per-face colour |
| `facePalette` | uint8[] | Optional per-face palette index |

One packing only — packed `float[]`, not `vec3[]` / `vec2[]` beside it. Hosts may expand for editors; the wire form stays flat.

`faceColors` and `facePalette` are alternatives. Carrying both on one mesh is a document error (same rule as inline vs referenced paint).

`normals` is authored shading data — mixed hard/soft edges need it. When absent, a presenter computes **face normals (flat shading)**; it must not smooth-average shared vertices, which fakes roundness the document never asked for.

Appearance: compose [`rig.render.material`](../render/material.md) on the same entity for shaded 3D. 2D / unlit presenters may use [`rig.paint.fill_stroke`](../paint/fill-stroke.md) instead. Do not add a material field on this schema.

No GPU buffer handles.
