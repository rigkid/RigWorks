---
id: "rig.meta.tags"
maturity: "experimental"
summary: "Free-form labels for selection and filtering. Format when present."
fields:
  - name: "tags"
    type: "array"
    itemsRef: "string"
    required: true
    meaning: "Labels; order carries no meaning, duplicates are ignored"
---
# `rig.meta.tags`

Free-form labels for selection and filtering. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `tags` | string[] | Labels; order carries no meaning, duplicates are ignored |

Tags are for grouping that cuts across the scene graph - "exported", "wip", "left-wall". They are not identity: use `stableId` on [`rig.meta.named`](named.md) to refer to one entity.

A tag means nothing on its own. Nothing in the Contract reads them, and no host should change behaviour based on a tag string it did not author.
