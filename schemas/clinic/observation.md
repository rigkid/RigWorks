# `rig.clinic.observation`

A measurement of a subject. Format when present.

Field meanings follow [FHIR](https://hl7.org/fhir/observation.html) `Observation` value quantity. This schema is those measurement elements - not a FHIR resource, and not [`rig.record.event`](../record/event.md) (a happening with no magnitude).

| Field | Type | Meaning |
|-------|------|---------|
| `subject` | entity | Who or what was measured |
| `code` | string | Observation code as the source wrote it |
| `value` | float | Measured amount |
| `codeSystem` | string | Optional. Code system name (`loinc`, `snomed`) |
| `unit` | string | Optional. UCUM unit (`mm[Hg]`, `Cel`) |
| `comparator` | enum | Optional. `lt` / `le` / `eq` / `ge` / `gt`; absent = `eq` |

`subject`, `code`, and `value` are required.

The clock is [`rig.calendar.event`](../calendar/event.md) on this entity. Do not also attach [`rig.record.event`](../record/event.md). A second measurement is another entity.
