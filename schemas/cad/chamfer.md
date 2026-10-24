---
id: "rig.cad.chamfer"
maturity: "draft"
summary: "Bevel selected edges of a solid. Format when present."
fields:
  - name: "distance"
    ref: "float"
    required: true
    meaning: "Chamfer setback along both faces"
  - name: "edges"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"a\",\"b\"],\"properties\":{\"a\":{\"$ref\":\"./_defs.schema.json#/$defs/uint32\"},\"b\":{\"$ref\":\"./_defs.schema.json#/$defs/uint32\"}}}"
    meaning: "Optional. Undirected vertex pairs into that entity's rig.geometry.mesh positions. Store min(a,b), max(a,b). See mesh edges"
  - name: "allEdges"
    ref: "bool"
    meaning: "Optional. Absent = false. True = every authored mesh edge; edges is ignored"
    absent: "false"
---
# `rig.cad.chamfer`

Bevel selected edges of a solid. Format when present.

Compose on the solid entity ([`rig.cad.cuboid`](cuboid.md), [`rig.cad.boolean`](boolean.md), a mesh solid, ...).

| Field | Type | Meaning |
|-------|------|---------|
| `distance` | float | Chamfer setback along both faces |
| `edges` | {a,b}[] | Optional. Undirected vertex pairs into that entity's [`rig.geometry.mesh`](../geometry/mesh.md) `positions`. Store `min(a,b)`, `max(a,b)`. See [mesh edges](../geometry/mesh.md#edges) |
| `allEdges` | bool | Optional. Absent = false. True = every authored mesh edge; `edges` is ignored |

Name edges or set `allEdges`. An empty target list is a no-op.

Same honesty as [`rig.cad.fillet`](fillet.md): this is authored intent. A mesh CSG kernel may approximate; it is not a B-rep chamfer.
