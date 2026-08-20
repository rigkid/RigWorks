# `rig.dev.op`

A named operation on a prepared [`rig.dev.machine`](machine.md). Edges toward behavior; what the op *does* is fulfillment — the Contract only names which command the surface exposes.

| Field | Type | Meaning |
|-------|------|---------|
| `machine` | entity | Owning [`rig.dev.machine`](machine.md) |
| `order` | int | Sort key within the machine |
| `opId` | string | Operation catalog id (e.g. `ssh`, `open-editor`, `open-terminal`, `preview`, `apply`) |
| `enabled` | bool | Optional. Whether the op can be invoked; absent = true |

Labels compose [`rig.meta.named`](../meta/named.md). Prefer shared `opId` names that both hosts implement. Unknown ids may be hidden or disabled (ship what you support). Host-private ids are valid but non-portable — see [dev.md](../../docs/dev.md).

Required: `machine`, `order`, `opId`.
