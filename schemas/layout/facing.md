---
id: "rig.layout.facing"
maturity: "stable"
summary: "Facing-pages preference for a document. Format when present. Spreads are one or more pages in a row; spanning items stay parented to one page and print on every page of the same spread their footprint crosses."
fields:
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Facing on; absent = true when this component is present"
    absent: "true when this component is present"
  - name: "binding"
    type: "string"
    enum: ["left","right"]
    meaning: "Optional. left or right - which edge is bound. Absent = left"
    absent: "left"
---
# `rig.layout.facing`

Facing-pages preference for a document. Format when present.

Compose on the document envelope entity (or the host project singleton). Absent = singles. A spread is an ordered row of one or more [`rig.layout.page`](page.md) records along the binding axis - not a second entity type. Two pages side by side is the common case; hosts MAY place more than two in one spread (gatefold, accordion, wrap).

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Facing on; absent = true when this component is present |
| `binding` | enum | Optional. `left` or `right` - which edge is bound. Absent = `left` |

Recto-first (page 1 alone on the right, then 2\|3, 4\|5, …) is the usual left-binding **default** when the host does not form a longer run. Inner/outer margins are the page's left/right channels, swapped on verso - do not add a second margin pair. Spread membership beyond that default is host presentation until a dedicated field exists.

## Spanning items (host agreement)

There is **no** second parent and **no** spread entity. A page item (image frame, text frame, path, …) stays parented with [`rig.spatial.relationship`](../spatial/relationship.md) to **one** page - conventionally the left-most page of the span under left binding (the verso of a pair; the first leaf of a longer spread).

Hosts MUST treat geometry that extends past that page's trim into other pages of the **same spread** as also present on those pages:

1. **Footprint.** The item's axis-aligned box in its parent page's local units (same space as [`rig.layout.page`](page.md) trim: origin at the page's local (0,0), +X toward the outer edge on a recto for left binding). Width past `page.width` lands on the next page to the right by successive page widths; an origin past `0` into negative X lands on pages to the left. Across an N-page spread the offset of another page relative to the parent is the signed sum of intervening page widths.
2. **Screen.** In a facing / spread view, draw and hit-test that footprint across every gutter the art crosses (outer bleeds of the first and last page in the span). One drag that starts on one page's bleed and ends on another's authors **one** item.
3. **Emit.** When writing a PDF (or other per-page sheet), each page also receives items whose parent is another page of the same spread and whose footprint intersects this page's trim-plus-bleed box, transformed by that cumulative page offset along X and clipped to this page's bleed. The gutter edge on screen may show no bleed; the POD sheet still gets bleed on all four sides, filled from the spanning art where needed.
4. **Singles.** When `enabled` is false or the component is absent, there is no spread neighbour: footprint past trim is still the item's geometry, but hosts do not print it on another page.

Right binding mirrors the X sense (pages read right-to-left; verso sits on the right). A lone folio (typically page 1) has no spanning neighbour until the host joins it into a longer spread.
