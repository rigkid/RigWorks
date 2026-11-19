---
id: "rig.layout.layer"
maturity: "draft"
summary: "A named document-wide layer. Format when present. Items point here via rig.layout.layer_ref."
fields:
  - name: "name"
    ref: "string"
    meaning: "Optional. Display name. Absent = \"Layer 1\""
    absent: "Layer 1"
  - name: "visible"
    ref: "bool"
    meaning: "Optional. Screen visibility for items on this layer. Absent = true"
    absent: "true"
  - name: "locked"
    ref: "bool"
    meaning: "Optional. Prevents edit of items on this layer. Absent = false"
    absent: "false"
  - name: "order"
    ref: "int"
    meaning: "Optional. Stack order among document layers, ascending back to front. Absent = 0"
    absent: "0"
  - name: "color"
    ref: "rgba"
    meaning: "Optional. Editor chrome colour for the layer (RGBA). Absent = host default"
---
# `rig.layout.layer`

A named document-wide layer. Format when present. Items point here via [`rig.layout.layer_ref`](layer-ref.md).

InDesign-style: one stack for the whole document. Page items join a layer through a layer ref; per-item z-order / visibility chrome stays on the item (host `CLayer`), not here.

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Optional. Display name. Absent = `"Layer 1"` |
| `visible` | bool | Optional. Screen visibility for items on this layer. Absent = true |
| `locked` | bool | Optional. Prevents edit of items on this layer. Absent = false |
| `order` | int | Optional. Stack order among document layers, ascending back to front. Absent = 0 |
| `color` | rgba | Optional. Editor chrome colour for the layer (RGBA). Absent = host default |

### Labels, not print policy

What a layer is *for* (guides, proof chrome, ink) is not a field here. Compose [`rig.meta.tags`](../meta/tags.md) on the layer entity with host-authored labels. Export and print are fulfillment: a POD preset may omit layers tagged `guide` or `proof`; a proofing pass may keep them. The Contract does not define which tags print.

### Related

- [`rig.layout.layer_ref`](layer-ref.md) — membership of a page item in a document layer
- [`rig.meta.tags`](../meta/tags.md) — free-form labels on the layer entity
- [`rig.layout.page`](page.md) — the page the item sits on
