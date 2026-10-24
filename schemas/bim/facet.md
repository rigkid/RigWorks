---
id: "rig.bim.facet"
maturity: "draft"
summary: "One IDS facet - applicability or requirement. Format when present."
fields:
  - name: "role"
    type: "string"
    enum: ["applicability","requirement"]
    required: true
    meaning: "applicability or requirement"
  - name: "kind"
    type: "string"
    enum: ["entity","attribute","classification","property","material","part-of"]
    required: true
    meaning: "entity, attribute, classification, property, material, or part-of"
  - name: "cardinality"
    type: "string"
    enum: ["required","prohibited","optional"]
    meaning: "Optional. required, prohibited, or optional - requirements only; absent = required when role is requirement"
    absent: "required when role is requirement"
  - name: "ifcClass"
    ref: "string"
    meaning: "When kind is entity (or as needed for other kinds)"
  - name: "predefinedType"
    ref: "string"
    meaning: "Optional. IFC predefined type filter"
  - name: "attributeName"
    ref: "string"
    meaning: "When kind is attribute"
  - name: "propertySet"
    ref: "string"
    meaning: "When kind is property"
  - name: "propertyName"
    ref: "string"
    meaning: "When kind is property"
  - name: "value"
    ref: "string"
    meaning: "Optional. Expected value (string form); absent = presence-only"
    absent: "presence-only"
  - name: "scheme"
    ref: "string"
    meaning: "When kind is classification (or material scheme)"
  - name: "partOfClass"
    ref: "string"
    meaning: "When kind is part-of - parent IFC class"
  - name: "partOfRelation"
    ref: "string"
    meaning: "Optional. When kind is part-of - relation name"
---
# `rig.bim.facet`

One IDS facet - applicability or requirement. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `role` | enum | `applicability` or `requirement` |
| `kind` | enum | `entity`, `attribute`, `classification`, `property`, `material`, or `part-of` |
| `cardinality` | enum | Optional. `required`, `prohibited`, or `optional` - requirements only; absent = `required` when `role` is `requirement` |
| `ifcClass` | string | When `kind` is `entity` (or as needed for other kinds) |
| `predefinedType` | string | Optional. IFC predefined type filter |
| `attributeName` | string | When `kind` is `attribute` |
| `propertySet` | string | When `kind` is `property` |
| `propertyName` | string | When `kind` is `property` |
| `value` | string | Optional. Expected value (string form); absent = presence-only |
| `scheme` | string | When `kind` is `classification` (or material scheme) |
| `partOfClass` | string | When `kind` is `part-of` - parent IFC class |
| `partOfRelation` | string | Optional. When `kind` is `part-of` - relation name |

Emit only the fields the chosen `kind` needs; leave the rest absent. List this entity on [`rig.bim.spec`](spec.md) `applicability` or `requirements`.
