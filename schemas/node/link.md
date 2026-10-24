---
id: "rig.node.link"
maturity: "stable"
summary: "Directed connection from an output pin to an input pin inside a rig.node.graph."
fields:
  - name: "id"
    ref: "uint"
    required: true
    meaning: "Stable id within the graph"
  - name: "fromNode"
    ref: "uint"
    required: true
    meaning: "Source node id"
  - name: "fromPin"
    ref: "uint"
    required: true
    meaning: "Source pin id"
  - name: "toNode"
    ref: "uint"
    required: true
    meaning: "Target node id"
  - name: "toPin"
    ref: "uint"
    required: true
    meaning: "Target pin id"
---
# `rig.node.link`

Directed connection from an output pin to an input pin inside a [`rig.node.graph`](graph.md).

| Field | Type | Meaning |
|-------|------|---------|
| `id` | uint | Stable id within the graph |
| `fromNode` | uint | Source node id |
| `fromPin` | uint | Source pin id |
| `toNode` | uint | Target node id |
| `toPin` | uint | Target pin id |
