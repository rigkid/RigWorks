# `rig.layout.frame_chain`

Ordered [`rig.layout.frame`](frame.md) entities a [`rig.story.flow`](../story/flow.md) flows through. Format when present.

When frames fill, a host may append pages from `master` and add frames. Absent chain = the flow's parent page (or a single frame the host invents from page margins). A page in `frames` is that fallback, not a substitute for authored frames.

| Field | Type | Meaning |
|-------|------|---------|
| `story` | entity | [`rig.story.flow`](../story/flow.md) being threaded |
| `frames` | entity[] | Optional. [`rig.layout.frame`](frame.md) entities in flow order |
| `master` | entity | Optional. [`rig.layout.master`](master.md) used when auto-adding pages |

Do not store overflow text here — that is fulfillment state. Previous/next pointers are this array, not fields on the frame.

