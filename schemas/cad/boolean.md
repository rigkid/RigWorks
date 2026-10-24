---
id: "rig.cad.boolean"
maturity: "stable"
summary: "CSG combination of solids. Format when present."
fields:
  - name: "op"
    type: "string"
    enum: ["union","difference","intersection"]
    required: true
    meaning: "union, difference, or intersection"
  - name: "operands"
    type: "array"
    minItems: 2
    itemsRef: "entity"
    required: true
    meaning: "At least two solid entities (cad primitives, other booleans, or mesh solids). Difference is operands[0] minus the rest, in order"
---
# `rig.cad.boolean`

CSG combination of solids. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `op` | enum | `union`, `difference`, or `intersection` |
| `operands` | entity[] | At least two solid entities (cad primitives, other booleans, or mesh solids). Difference is `operands[0]` minus the rest, in order |

Each operand's [`rig.spatial.transform`](../spatial/transform.md) applies before the boolean. This entity's transform places the result.

Do not put two primitive cad components on one entity. One solid source: a primitive, an extrude/revolve, or this boolean. [`rig.cad.fillet`](fillet.md) / [`rig.cad.chamfer`](chamfer.md) may compose on the same entity as modifiers.

When this component is present it is the solid source of truth; [`rig.geometry.mesh`](../geometry/mesh.md) on the same entity is an optional bake a CSG host may rebuild.
