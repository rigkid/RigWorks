# `rig.layout.master`

Marks a [`rig.layout.page`](page.md) entity as a master page. Format when present.

Document pages apply a master via [`rig.layout.applied_master`](applied-master.md). Facing books typically keep a left and a right master; singles use `side` `single`.

| Field | Type | Meaning |
|-------|------|---------|
| `side` | enum | Optional. `left`, `right`, or `single`. Absent = `single` |

Master content (headers, folios, frames) parents to the master page the same way as any page. Instantiation onto document pages is fulfillment.

## Chrome text frames

A master child that carries both a [`rig.story.flow`](../story/flow.md) and a box is page chrome (folio, running header): hosts stamp it onto every page that applies the master, resolving `{{page}}` / `{{pageCount}}` / `{{title}}` / `{{section}}` tokens in the paragraph text per page. The flow's [`rig.layout.paragraph_style`](paragraph-style.md) owns the type - size, alignment within the frame, paint, and `alignToBaselineGrid` - so chrome is document data, not host configuration. Each paragraph sets a single line; chrome does not wrap or overflow.
