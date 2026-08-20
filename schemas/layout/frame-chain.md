# `rig.layout.frame_chain`

Ordered frames a [`rig.story.flow`](../story/flow.md) flows through. Format when present.

When frames fill, a host may append pages from `master`. Absent chain = the flow's parent page (or a single frame the host invents from page margins).

| Field | Type | Meaning |
|-------|------|---------|
| `story` | entity | [`rig.story.flow`](../story/flow.md) being threaded |
| `frames` | entity[] | Optional. Frame / page entities in flow order |
| `master` | entity | Optional. [`rig.layout.master`](master.md) used when auto-adding pages |

Do not store overflow text here — that is fulfillment state.
