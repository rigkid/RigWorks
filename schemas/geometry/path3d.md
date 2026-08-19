# `rig.geometry.path3d`

Freeform 3D path command stream. Format when present.

The 3D sibling of [`rig.geometry.path`](path.md) — same command grammar, `vec3` points. Cubic Bézier data is the `cubic-to` command. Planar contours stay on path; do not put z = 0 on path3d to fake 2D.

A contour that stays editable as NURBS belongs on [`rig.geometry.spline3d`](spline3d.md). Use a path once it has been resolved to commands, and never both for the same contour. Hosts may convert cubic segments to NURBS for an evaluator; they must not discard the path and claim NURBS is the portable authoring form. Circular and elliptical arcs stay on [`arc`](arc.md); do not invent path arc commands for them.

| Field | Type | Meaning |
|-------|------|---------|
| `commands` | command[] | Ordered path commands |

## Command

| Field | Type | Meaning |
|-------|------|---------|
| `type` | enum | move-to, line-to, cubic-to, quad-to, close |
| `point` | vec3 | Endpoint (move/line); unused for close |
| `control1` | vec3 | Cubic/quad control 1 |
| `control2` | vec3 | Cubic control 2 |

Closed contours use a `close` command. Unknown types → skip / reject. Extend only by appending enum values.

Fill rule and hole winding are 2D — they live on [`rig.geometry.path`](path.md). Space curves stay unfilled unless the host tessellates to a mesh. Mesh front-face is caller-owned; do not add a winding field here.

Tessellation to polylines or [`rig.geometry.mesh`](mesh.md) is host fulfillment.
