# `rig.story.flow`

Editorial story — an ordered sequence of copy blocks. Format when present.

Paragraphs and tables in document order. It is **not** [`rig.media.text`](../media/text.md) (a positioned canvas run with a face and size). Font, leading, and colour stay off this schema — a host maps named styles at emit time.

Compose [`rig.meta.named`](../meta/named.md) for the story title. Thread the flow through [`rig.layout.frame`](../layout/frame.md) entities with [`rig.layout.frame_chain`](../layout/frame-chain.md). Do not parent the flow to a page when frames exist — that is one box per page, not a layout. A snippet has no page.

| Field | Type | Meaning |
|-------|------|---------|
| `blocks` | entity[] | Ordered [`rig.story.paragraph`](paragraph.md) and/or [`rig.story.table`](table.md) entities |

Do not also list nested table-cell paragraphs here — those live on the cell `blocks` array. Sibling order is this array, not `spatial.relationship.order`.

Snippet headers and optical-margin preferences are fulfillment.
