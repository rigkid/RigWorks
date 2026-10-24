---
id: "rig.node.graph"
maturity: "stable"
summary: "Portable node graph on one entity. Format when present."
fields:
  - name: "nodes"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.node.node.schema.json\"}"
    required: true
    meaning: "Graph nodes - see rig.node.node"
  - name: "links"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.node.link.schema.json\"}"
    required: true
    meaning: "Directed pin links - see rig.node.link"
  - name: "buses"
    type: "array"
    itemsSchemaJson: "{\"$ref\":\"./rig.node.bus.schema.json\"}"
    meaning: "Optional. Named rails pins tap without a drawn link - see rig.node.bus"
  - name: "nextId"
    ref: "uint"
    required: true
    meaning: "Next id allocator for nodes / links / pins / buses"
---
# `rig.node.graph`

Portable node graph on one entity. Format when present.

Also used **inline** as `nested` on a [`rig.node.node`](node.md) for nestable groups.

| Field | Type | Meaning |
|-------|------|---------|
| `nodes` | node[] | Graph nodes - see [`rig.node.node`](node.md) |
| `links` | link[] | Directed pin links - see [`rig.node.link`](link.md) |
| `buses` | bus[] | Optional. Named rails pins tap without a drawn link - see [`rig.node.bus`](bus.md) |
| `nextId` | uint | Next id allocator for nodes / links / pins / buses |

## Contract vs host

| Layer | Owned by | Examples |
|-------|----------|----------|
| Portable PODs | Rig | graph / node / pin / link / bus / param / publish fields |
| Value `type` ids | Rig [properties](../../docs/properties.md) | `float`, `vec2`, `vec4`, ... |
| Catalog `typeId`s | Host / pack | `float.add`, `mod.lfo`, `color.value`, `group` |
| Evaluation | Host / pack | Graph walk, group recursion, coercion, outputs |

## Nestable groups

A node with `nested` is a group: it appears as one node on the parent canvas; its interior is another graph. Published pins ([`rig.node.publish`](publish.md)) expose selected interior pins as the group's outer interface. Recursion is allowed.

Editor mirrors (`nodeCount`, ...) and dive UI state are host-only - do not serialize.

## Fulfillment

[RigKit](https://github.com/rigkid/RigKit)'s node editor over the same PODs - two value nodes into an add node, one link per pin pair. Canvas positions, live pin readouts, and selection are host state; only the fields above travel.

![RigKit node editor - Value A and Value B into an Add node](../../examples/img/node_editor.png)
