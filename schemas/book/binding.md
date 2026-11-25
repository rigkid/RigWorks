---
id: "rig.book.binding"
maturity: "draft"
summary: "Physical binding and paper for a print book product. Format when present."
topJson: "{\"description\":\"Physical binding and paper. Spine width is computed from pageCount and paperCaliper unless spineOverride is set.\",\"minProperties\":1}"
fields:
  - name: "form"
    type: "string"
    enum: ["paperback", "case", "jacket", "saddle"]
    meaning: "paperback / case / jacket / saddle"
  - name: "paperCaliper"
    type: "number"
    minimum: 0
    meaning: "Thickness per leaf in caliperUnit"
  - name: "caliperUnit"
    type: "string"
    enum: ["mm", "in"]
    meaning: "Unit of paperCaliper and boardThickness"
  - name: "boardThickness"
    type: "number"
    minimum: 0
    meaning: "Case board thickness (each side); 0 for paperback/saddle"
  - name: "hinge"
    type: "number"
    minimum: 0
    meaning: "Hinge / score width in caliperUnit"
  - name: "wrap"
    type: "number"
    minimum: 0
    meaning: "Wrap allowance in caliperUnit"
  - name: "flap"
    type: "number"
    minimum: 0
    meaning: "Flap width in caliperUnit"
  - name: "fold"
    type: "number"
    minimum: 0
    meaning: "Fold mark in caliperUnit"
  - name: "spineOverride"
    type: "number"
    minimum: 0
    meaning: "Optional. Fixed spine width in caliperUnit; absent = compute"
---
# `rig.book.binding`

Physical binding and paper for a print book product. Format when present.

Compose on the book / project entity beside [`rig.book.publication`](publication.md). Extent in pages is `publication.pageCount` (or the host document page count when publication is absent).

| Field | Type | Meaning |
|-------|------|---------|
| `form` | enum | `paperback` / `case` / `jacket` / `saddle` |
| `paperCaliper` | number | Thickness **per leaf** in `caliperUnit` |
| `caliperUnit` | enum | `mm` / `in` |
| `boardThickness` | number | Case board thickness (each side); 0 when not case |
| `hinge` | number | Hinge / score width |
| `wrap` | number | Wrap allowance |
| `flap` | number | Flap width |
| `fold` | number | Fold mark |
| `spineOverride` | number | Optional fixed spine; omit to compute |

**Compute (fulfillment):**  
`spine = pageCount / 2 × paperCaliper + (form == case ? 2 × boardThickness : 0)`  
in `caliperUnit`. When `spineOverride` is present, use it as the spine instead.

Cover geometry (`CoverSpec` / panel resolve) is host fulfillment — this schema is the portable binding inputs only.

All fields optional. An empty component is invalid — attach at least one field.
