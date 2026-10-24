# UI and node graphs

Load for: control panels, HUDs, actions, node graphs and patchers. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/ui-panel.json`](../../../examples/ui-panel.json), [`examples/portable-tool.json`](../../../examples/portable-tool.json). UI contract: [`docs/ui.md`](../../../docs/ui.md).

## Compose

| Want | Compose |
|---|---|
| A control surface | `rig.ui.panel`; a HUD is the same panel with `surface` `hud` - same controls as a tool |
| Grouping inside a panel | `rig.ui.group`; controls are `rig.ui.control`, commands are `rig.ui.action` |
| A node graph | `rig.node.graph` holding `rig.node.node` entities |
| A socket | `rig.node.pin` (its `type` is a property datatype id - see [`docs/properties.md`](../../../docs/properties.md)) |
| A wire | `rig.node.link`; a graph-level channel is `rig.node.bus` |
| A typed value on a node | `rig.node.param` - the one tagged-union schema (`f`/`i`/`s`/`v` selected by `type`); do not invent more single-letter fields |
| A group interface pin | `rig.node.publish` mapping outer pins to interior pins; nesting is `nested` on `rig.node.node` |

## Guards

- `rig.ui.*` uses the same document envelope as everything else; there is no second UI scene graph. UI chrome layout is fulfillment - the portable meaning is the panel/group/control/action data.
- Node-editor groups are `rig.node.node` with `nested`, not `rig.spatial.group`. A ROS node is not a `rig.node.*` node. A circuit terminal (`rig.circuit.pin`) is not a `rig.node.pin`.
- Pin and param datatypes reuse the property datatype table; do not invent per-graph type systems.

## Ids in this slice

`rig.ui.panel`, `rig.ui.group`, `rig.ui.control`, `rig.ui.action`, `rig.node.graph`, `rig.node.node`, `rig.node.pin`, `rig.node.link`, `rig.node.bus`, `rig.node.param`, `rig.node.publish`
