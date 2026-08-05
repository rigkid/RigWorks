# `rig.ui.action`

A command button on a panel. Edges toward behavior; `actionId` is a **host-owned catalog id**, mirroring `typeId` on [`rig.node.node`](../node/node.md). This schema is the piece most likely to change before 1.0.0.

| Field | Type | Meaning |
|-------|------|---------|
| `panel` | entity | Owning [`rig.ui.panel`](panel.md) |
| `order` | int | Sort key within the panel |
| `actionId` | string | Host catalog id (e.g. `transport.play`, `scene.reset`) |
| `enabled` | bool | Whether the action can be invoked |

Labels compose [`rig.meta.named`](../meta/named.md). What the action *does* is fulfillment — the Contract only names which command the surface exposes.

Required: `panel`, `order`, `actionId`.
