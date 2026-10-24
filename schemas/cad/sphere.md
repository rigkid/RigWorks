---
id: "rig.cad.sphere"
maturity: "draft"
summary: "Solid sphere centred on the local origin. Format when present."
fields:
  - name: "radius"
    ref: "float"
    required: true
    meaning: "Radius"
  - name: "circularSegments"
    type: "integer"
    minimum: 3
    meaning: "Optional. Tessellation hint for mesh CSG kernels (≥ 3). Absent = host default"
    absent: "host default"
---
# `rig.cad.sphere`

Solid sphere centred on the local origin. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `radius` | float | Radius |
| `circularSegments` | int | Optional. Tessellation hint for mesh CSG kernels (≥ 3). Absent = host default |

This is a CSG primitive, not an icosphere mesh. Pose lives on [`rig.spatial.transform`](../spatial/transform.md). When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake.

A 2D circle stays on [`rig.geometry.ellipse`](../geometry/ellipse.md) with equal radii.
