---
id: "rig.bim.classify"
maturity: "draft"
summary: "IFC / OpenBIM classification on an element or type. Format when present."
fields:
  - name: "ifcClass"
    ref: "string"
    required: true
    meaning: "IFC entity type name (IfcWall, IfcDoor, IfcWallType, ...)"
  - name: "predefinedType"
    ref: "string"
    meaning: "Optional. IFC PredefinedType literal when present on the source"
  - name: "scheme"
    ref: "string"
    meaning: "Optional. Classification system name (Uniclass2015, OmniClass, bSDD dictionary title, ...)"
  - name: "code"
    ref: "string"
    meaning: "Optional. Code within scheme"
  - name: "uri"
    ref: "string"
    meaning: "Optional. Absolute URI for the classification concept (bSDD or other)"
---
# `rig.bim.classify`

IFC / OpenBIM classification on an element or type. Format when present.

Class is identity - not a free label. Do not put IFC class on [`rig.meta.tags`](../meta/tags.md).

| Field | Type | Meaning |
|-------|------|---------|
| `ifcClass` | string | IFC entity type name (`IfcWall`, `IfcDoor`, `IfcWallType`, ...) |
| `predefinedType` | string | Optional. IFC `PredefinedType` literal when present on the source |
| `scheme` | string | Optional. Classification system name (`Uniclass2015`, `OmniClass`, bSDD dictionary title, ...) |
| `code` | string | Optional. Code within `scheme` |
| `uri` | string | Optional. Absolute URI for the classification concept (bSDD or other) |

Compose [`rig.meta.named`](../meta/named.md) for display name / GlobalId. Geometry stays on [`rig.cad.*`](../cad/cuboid.md) / [`rig.geometry.mesh`](../geometry/mesh.md). Do not invent `rig.bim.wall` - use this component with `ifcClass`.
