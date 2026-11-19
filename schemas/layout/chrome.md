---
id: "rig.layout.chrome"
maturity: "draft"
summary: "Document-wide master chrome preferences. Format when present."
fields:
  - name: "runningHead"
    ref: "bool"
    meaning: "Optional. Show a running head on masters. Absent = false"
    absent: "false"
  - name: "runningHeader"
    ref: "string"
    meaning: "Optional. Running head text. Absent = empty"
  - name: "pageNumbers"
    ref: "bool"
    meaning: "Optional. Show folio stamps on masters. Absent = true"
    absent: "true"
  - name: "pageOutline"
    ref: "bool"
    meaning: "Optional. Show a trim outline on masters (proof chrome). Absent = true"
    absent: "true"
---
# `rig.layout.chrome`

Document-wide master chrome preferences. Format when present.

Compose on the project entity (host `CProject`) or the document envelope. Page size, margins, and bleed stay on each [`rig.layout.page`](page.md); facing stays on [`rig.layout.facing`](facing.md).

| Field | Type | Meaning |
|-------|------|---------|
| `runningHead` | bool | Optional. Show a running head on masters. Absent = false |
| `runningHeader` | string | Optional. Running head text. Absent = empty |
| `pageNumbers` | bool | Optional. Show folio stamps on masters. Absent = true |
| `pageOutline` | bool | Optional. Show a trim outline on masters (proof chrome). Absent = true |

Hosts may stamp chrome onto master pages from these fields. Export presets may omit outline layers tagged for proofing; that policy is fulfillment, not Contract.
