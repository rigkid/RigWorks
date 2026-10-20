# `rig.anim.blend`

Blend tree over clips. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `root` | uint | `id` of the output node |
| `nodes` | object[] | Tree nodes |

Each node:

| Field | Type | Meaning |
|-------|------|---------|
| `id` | uint | Stable id within this tree |
| `kind` | enum | `clip`, `lerp`, `additive` |
| `clip` | entity | Clip entity. Required when `kind` is `clip` |
| `weight` | float | Optional. 0-1. On `clip`, scale. On `lerp`, blend toward `b` (absent = 0.5). On `additive`, scale of `b` (absent = 1) |
| `a` | uint | Input node. Required for `lerp` and `additive` |
| `b` | uint | Input node. Required for `lerp` and `additive` |

`lerp` is `(1 - weight) * a + weight * b`. `additive` is `a + weight * b`. A host that cannot pose a property from these nodes skips that subtree.

Masks and layers beyond this tree stay in the host.
