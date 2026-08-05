# `rig.spatial.layer`

Document / render-order layer chrome. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label.

Compositor stacks use [`rig.pixel.layer`](../pixel/layer.md) on the same entity when needed — do not duplicate these chrome fields there.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | int | Draw / list order |
| `visible` | bool | Drawn when true |
| `locked` | bool | Edit lock hint |
| `rgba` | vec4 | Tint / label colour (0–1); hosts may store as four floats |

Parenting stays on [`rig.spatial.relationship`](relationship.md).
