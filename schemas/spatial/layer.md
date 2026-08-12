# `rig.spatial.layer`

Document / render-order layer chrome. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label. Show/hide is [`rig.render.visibility`](../render/visibility.md) on the same entity — do not re-declare `visible` here.

Compositor stacks use [`rig.pixel.layer`](../pixel/layer.md) on the same entity when needed — do not duplicate these chrome fields there.

| Field | Type | Meaning |
|-------|------|---------|
| `order` | int | Optional. Draw / list order; absent = 0 |
| `locked` | bool | Optional. Edit lock hint; absent = false |
| `rgba` | vec4 | Optional. Tint / label colour (0–1); absent = no label colour. Hosts may store as four floats |

`order` here is layer-list / stack chrome. Sibling sequence under a scene parent is `order` on [`rig.spatial.relationship`](relationship.md) — different graph, same word; do not treat them as one stack.

Parenting stays on [`rig.spatial.relationship`](relationship.md).
