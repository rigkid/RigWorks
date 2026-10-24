---
id: "rig.bim.spec"
maturity: "draft"
summary: "One IDS specification (requirements check). Format when present."
fields:
  - name: "ifcVersion"
    type: "string"
    enum: ["ifc2x3","ifc4","ifc4x3"]
    meaning: "Optional. ifc2x3, ifc4, or ifc4x3; absent = any"
    absent: "any"
  - name: "description"
    ref: "string"
    meaning: "Optional. Human description; absent = empty"
    absent: "empty"
  - name: "instructions"
    ref: "string"
    meaning: "Optional. Authoring instructions; absent = empty"
    absent: "empty"
  - name: "applicability"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. rig.bim.facet entities that select which elements apply; absent = none"
    absent: "none"
  - name: "requirements"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. rig.bim.facet entities that must hold; absent = none"
    absent: "none"
---
# `rig.bim.spec`

One IDS specification (requirements check). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `ifcVersion` | enum | Optional. `ifc2x3`, `ifc4`, or `ifc4x3`; absent = any |
| `description` | string | Optional. Human description; absent = empty |
| `instructions` | string | Optional. Authoring instructions; absent = empty |
| `applicability` | entity[] | Optional. [`rig.bim.facet`](facet.md) entities that select which elements apply; absent = none |
| `requirements` | entity[] | Optional. [`rig.bim.facet`](facet.md) entities that must hold; absent = none |

A document may carry specs with no building model, or a model with no specs. Compose [`rig.meta.named`](../meta/named.md) for the specification name.
