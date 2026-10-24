---
id: "rig.node.node"
maturity: "stable"
summary: "One node inside a rig.node.graph. Nested POD - not a separate ECS entity unless a host chooses that layout."
fields:
  - name: "id"
    ref: "uint"
    required: true
    meaning: "Stable id within the graph"
  - name: "typeId"
    ref: "string"
    required: true
    meaning: "Catalog **behavior** key (host vocabulary, e.g. float.add) - not a property datatype"
  - name: "title"
    ref: "string"
    required: true
    meaning: "Display label"
  - name: "position"
    ref: "vec2"
    required: true
    meaning: "Editor canvas position (not world transform)"
  - name: "pins"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.node.pin.schema.json\"}"
    required: true
    meaning: "See rig.node.pin - pin type uses property datatypes"
  - name: "params"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.node.param.schema.json\"}"
    required: true
    meaning: "See rig.node.param - same datatype table"
  - name: "nested"
    schemaJson: "{\"$ref\":\"./rig.node.graph.schema.json\"}"
    meaning: "When present, this node **is a group**; interior is a full rig.node.graph"
  - name: "publishes"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.node.publish.schema.json\"}"
    meaning: "Outer pin to interior pin - see rig.node.publish"
---
# `rig.node.node`

One node inside a [`rig.node.graph`](graph.md). Nested POD - not a separate ECS entity unless a host chooses that layout.

| Field | Type | Meaning |
|-------|------|---------|
| `id` | uint | Stable id within the graph |
| `typeId` | string | Catalog **behavior** key (host vocabulary, e.g. `float.add`) - not a property datatype |
| `title` | string | Display label |
| `position` | vec2 | Editor canvas position (not world transform) |
| `pins` | pin[] | See [`rig.node.pin`](pin.md) - pin `type` uses [property datatypes](../../docs/properties.md) |
| `params` | param[] | See [`rig.node.param`](param.md) - same datatype table |
| `nested` | graph? | When present, this node **is a group**; interior is a full [`rig.node.graph`](graph.md) |
| `publishes` | publish[] | Outer pin to interior pin - see [`rig.node.publish`](publish.md) |

## Leaf vs group

- **Leaf:** omit `nested` (and usually `publishes`). `typeId` selects catalog evaluation.
- **Group:** `nested` is present. Outer `pins[]` are the only interface other nodes link to. Author publishes chosen interior pins; host keeps outer pin `name` / `kind` / `type` aligned with (or renamed from) the inner pin. `typeId` is host vocabulary (e.g. `group`); eval runs the nested graph, not a maths catalog entry.

Groups nest recursively: nodes inside `nested` may themselves have `nested`.

`typeId` selects evaluation / catalog entry for leaves. Pin and param `type` fields describe **values**, using the Contract property table.
