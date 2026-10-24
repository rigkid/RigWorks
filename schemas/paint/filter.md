---
id: "rig.paint.filter"
maturity: "draft"
summary: "Filter graph pointer, or the graph root. Format when present."
fields:
  - name: "filter"
    ref: "entity"
    meaning: "Optional. Graph root. Used on the drawable"
  - name: "primitiveUnits"
    type: "string"
    enum: ["user-space","object"]
    meaning: "Optional. user-space or object. Absent = user-space. Used on the graph root"
    absent: "user-space"
---
# `rig.paint.filter`

Filter graph pointer, or the graph root. Format when present.

On a drawable, `filter` names the graph entity. On the graph entity, `primitiveUnits` is the length space for the steps.

| Field | Type | Meaning |
|-------|------|---------|
| `filter` | entity | Optional. Graph root. Used on the drawable |
| `primitiveUnits` | enum | Optional. `user-space` or `object`. Absent = `user-space`. Used on the graph root |

Steps are children in [`rig.spatial.relationship`](../spatial/relationship.md) `order`, each [`rig.paint.filter_step`](filter-step.md). A host that cannot run a step skips it. The fields still travel.
