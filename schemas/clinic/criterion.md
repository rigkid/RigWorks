# `rig.clinic.criterion`

One eligibility rule of a trial. Format when present.

This schema is the rule as data - not a narrative protocol, and not a matching engine.

| Field | Type | Meaning |
|-------|------|---------|
| `trial` | entity | The [`rig.clinic.trial`](trial.md) |
| `text` | string | Rule as written |
| `code` | string | Optional. Criterion code as the source wrote it |
| `polarity` | enum | Optional. `include` / `exclude`; absent = `include` |

`trial` and `text` are required. A second rule is another entity. Do not invent a criteria array on the trial.
