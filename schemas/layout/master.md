# `rig.layout.master`

Marks a [`rig.layout.page`](page.md) entity as a master page. Format when present.

Document pages apply a master via [`rig.layout.applied_master`](applied-master.md). Facing books typically keep a left and a right master; singles use `side` `single`.

| Field | Type | Meaning |
|-------|------|---------|
| `side` | enum | Optional. `left`, `right`, or `single`. Absent = `single` |

Master content (headers, folios, frames) parents to the master page the same way as any page. Instantiation onto document pages is fulfillment.
