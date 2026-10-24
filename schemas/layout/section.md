---
id: "rig.layout.section"
maturity: "draft"
summary: "A numbering section start. Format when present."
fields:
  - name: "name"
    ref: "string"
    meaning: "Optional. Section title; running-header variables may show it. Not the page's display name (rig.meta.named)"
  - name: "numberingStyle"
    type: "string"
    enum: ["arabic","roman","roman-upper","alpha","alpha-upper"]
    meaning: "Optional. arabic, roman, roman-upper, alpha, alpha-upper (enum literals stay kebab-case). Absent = arabic"
    absent: "arabic"
  - name: "startAt"
    ref: "int"
    meaning: "Optional. First page number of the section. Absent = 1"
    absent: "1"
  - name: "prefix"
    ref: "string"
    meaning: "Optional. Emitted before the number (A- → A-1, A-2)"
  - name: "startSide"
    type: "string"
    enum: ["any","recto","verso"]
    meaning: "Optional. any, recto, verso - declared side the section opens on; a host may insert a blank page to honour it. Such a pad carries rig.layout.applied_master with no master - deliberately chrome-free. Absent = any"
    absent: "any"
---
# `rig.layout.section`

A numbering section start. Format when present.

Compose on a [`rig.layout.page`](page.md) that is not a master. The section runs from that page until the next page carrying its own `rig.layout.section`. Folio variables on stamped master items resolve against the innermost section: page number = `startAt` + pages since the section start, rendered in `numberingStyle` with `prefix` in front. Pages before the first section fall back to the host's plain sequence.

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Optional. Section title; running-header variables may show it. Not the page's display name ([`rig.meta.named`](../meta/named.md)) |
| `numberingStyle` | enum | Optional. `arabic`, `roman`, `roman-upper`, `alpha`, `alpha-upper` (enum literals stay kebab-case). Absent = `arabic` |
| `startAt` | int | Optional. First page number of the section. Absent = `1` |
| `prefix` | string | Optional. Emitted before the number (`A-` → `A-1`, `A-2`) |
| `startSide` | enum | Optional. `any`, `recto`, `verso` - declared side the section opens on; a host may insert a blank page to honour it. Such a pad carries [`rig.layout.applied_master`](applied-master.md) with no `master` - deliberately chrome-free. Absent = `any` |

Front matter in roman then a body restarting at 1 is two sections: `{numberingStyle: "roman"}` on the first page, `{startAt: 1}` on the first body page.
