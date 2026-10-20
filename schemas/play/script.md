# `rig.play.script`

Named behavior attached to an entity. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `className` | string | Host class or script name |
| `asset` | entity | Optional. [`rig.media.code`](../media/code.md) or [`rig.media.asset_ref`](../media/asset-ref.md) for the source |

`className` is a name the host implements, the same idea as an action on [`rig.ai.behavior`](../ai/behavior.md). It is not a callback, and the document does not carry a function pointer. An unknown name is skipped. Source text, when it travels, is the `asset`.
