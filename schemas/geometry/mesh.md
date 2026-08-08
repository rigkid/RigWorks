# `rig.geometry.mesh`

Indexed mesh. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `positions` | float[] / vec3[] | xyz tightly packed or vec3 array |
| `normals` | float[] / vec3[] | Optional per-vertex normals, parallel to `positions` |
| `indices` | uint32[] | Triangle (or line) indices; empty = sequential |
| `texcoords` | float[] / vec2[] | Per-vertex uv (optional; empty = none) |
| `mode` | enum | triangles, lines, lineStrip |
| `faceColors` | vec4[] | Optional per-face colour |
| `facePalette` | uint8[] | Optional per-face palette index |

`normals` is authored shading data — mixed hard/soft edges need it. When absent, a presenter computes **face normals (flat shading)**; it must not smooth-average shared vertices, which fakes roundness the document never asked for.

No GPU buffer handles.
