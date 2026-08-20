# `rig.layout.facing`

Facing-pages preference for a document. Format when present.

Compose on the document envelope entity (or the host project singleton). Absent = singles. A spread is two [`rig.layout.page`](page.md) records side by side — not a second entity type.

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Facing on; absent = true when this component is present |
| `binding` | enum | Optional. `left` or `right` — which edge is bound. Absent = `left` |

Recto-first (page 1 alone on the right, then 2\|3, 4\|5) is the usual left-binding view. Inner/outer margins are the page's left/right channels, swapped on verso — do not add a second margin pair.
