---
id: "rig.clinic.encounter"
maturity: "draft"
summary: "One visit or admission. Format when present."
topJson: "{\"description\":\"One visit or admission. Visit clock is rig.calendar.event; admission days are rig.calendar.span.\"}"
fields:
  - name: "patient"
    ref: "entity"
    required: true
    meaning: "Person this visit is about"
  - name: "status"
    type: "string"
    enum: ["planned","arrived","in-progress","finished","cancelled"]
    required: true
    meaning: "planned / arrived / in-progress / finished / cancelled"
  - name: "class"
    type: "string"
    enum: ["inpatient","outpatient","emergency","virtual","home"]
    required: true
    meaning: "inpatient / outpatient / emergency / virtual / home"
---
# `rig.clinic.encounter`

One visit or admission. Format when present.

Field meanings follow [FHIR](https://hl7.org/fhir/encounter.html) `Encounter` `status` and `class`. This schema is those visit elements - not a FHIR Bundle, and not the observations taken during it.

| Field | Type | Meaning |
|-------|------|---------|
| `patient` | entity | Person this visit is about |
| `status` | enum | `planned` / `arrived` / `in-progress` / `finished` / `cancelled` |
| `class` | enum | `inpatient` / `outpatient` / `emergency` / `virtual` / `home` |

`patient`, `status`, and `class` are required.

A visit's clock is [`rig.calendar.event`](../calendar/event.md) on this entity. An admission's days are [`rig.calendar.span`](../calendar/span.md). Do not copy one range onto both. A file this visit belongs to is [`rig.record.concerns`](../record/concerns.md).
