---
id: "rig.cad.fillet"
maturity: "stable"
summary: "Round selected edges of a solid. Format when present."
fields:
  - name: "radius"
    ref: "float"
    required: true
    meaning: "Fillet radius"
  - name: "edges"
    type: "array"
    itemsSchemaJson: "{\"type\":\"object\",\"additionalProperties\":false,\"required\":[\"a\",\"b\"],\"properties\":{\"a\":{\"$ref\":\"./_defs.schema.json#/$defs/uint32\"},\"b\":{\"$ref\":\"./_defs.schema.json#/$defs/uint32\"}}}"
    meaning: "Optional. Undirected vertex pairs into that entity's rig.geometry.mesh positions. Store min(a,b), max(a,b). See mesh edges"
  - name: "allEdges"
    ref: "bool"
    meaning: "Optional. Absent = false. True = every authored mesh edge; edges is ignored"
    absent: "false"
---
# `rig.cad.fillet`

Round selected edges of a solid. Format when present.

Compose on the solid entity ([`rig.cad.cuboid`](cuboid.md), [`rig.cad.boolean`](boolean.md), a mesh solid, ...).

| Field | Type | Meaning |
|-------|------|---------|
| `radius` | float | Fillet radius |
| `edges` | {a,b}[] | Optional. Undirected vertex pairs into that entity's [`rig.geometry.mesh`](../geometry/mesh.md) `positions`. Store `min(a,b)`, `max(a,b)`. See [mesh edges](../geometry/mesh.md#edges) |
| `allEdges` | bool | Optional. Absent = false. True = every authored mesh edge; `edges` is ignored |

Name edges or set `allEdges`. An empty target list is a no-op.

This is authored intent. A mesh CSG kernel may approximate a true CAD fillet, especially `allEdges`. Per-edge B-rep fillets need a kernel that has them. Do not treat a smoothed triangle mesh as a round-trip of this component.
