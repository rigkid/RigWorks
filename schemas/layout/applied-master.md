---
id: "rig.layout.applied_master"
maturity: "stable"
summary: "Which master a document page uses. Format when present."
fields:
  - name: "master"
    ref: "entity"
    meaning: "Optional. rig.layout.master page entity. Absent = no master (deliberate)"
    absent: "no master (deliberate)"
---
# `rig.layout.applied_master`

Which master a document page uses. Format when present.

Compose on a [`rig.layout.page`](page.md) that is not itself a master. Facing hosts pick left vs right from page index when this is absent.

The component present with `master` absent is an explicit opt-out: the page takes no master at all and stays chrome-free - true blanks and the pad a section start inserts. Only the absent *component* falls back to the facing master.

| Field | Type | Meaning |
|-------|------|---------|
| `master` | entity | Optional. [`rig.layout.master`](master.md) page entity. Absent = no master (deliberate) |
