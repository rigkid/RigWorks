# `rig.ai.behavior`

Behavior tree. Format when present. Compose [`rig.meta.named`](../meta/named.md) for a label.

| Field | Type | Meaning |
|-------|------|---------|
| `nodes` | object[] | Tree nodes. Exactly one node omits `parent` (the root) |

Each node:

| Field | Type | Meaning |
|-------|------|---------|
| `id` | uint | Stable id within this tree |
| `parent` | uint | Optional. Parent node id. Absent = root |
| `kind` | enum | `sequence`, `selector`, `parallel`, `condition`, `action` |
| `action` | string | Host name for a `condition` or `action`. Ignored on composites |

`sequence` runs children in `id` order until one fails. `selector` until one succeeds. `parallel` runs every child. Success policy for `parallel` is the host's.

`action` is a name the host implements, the same idea as a shared `actionId` on [`rig.ui.action`](../ui/action.md). It is not a callback. An unknown name fails that node. Source text, when it travels, is [`rig.media.code`](../media/code.md) on its own entity; this tree does not embed it.

Blackboard values are ordinary components on entities. Tick state stays in the host.
