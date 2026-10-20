# `rig.clinic.trial`

A clinical trial. Format when present.

Field meanings follow ClinicalTrials.gov / WHO ICTRP identifiers. This schema is the trial - not a protocol PDF, and not the eligibility rows.

| Field | Type | Meaning |
|-------|------|---------|
| `identifier` | string | NCT or sponsor id as issued |
| `status` | enum | `recruiting` / `active` / `completed` / `withdrawn` / `suspended` |
| `phase` | enum | Optional. `phase-1` / `phase-2` / `phase-3` / `phase-4` / `na` |

`identifier` and `status` are required.

The title is [`rig.meta.named`](../meta/named.md). Eligibility rows are [`rig.clinic.criterion`](criterion.md) entities that point at this trial. The protocol file is [`rig.media.asset_ref`](../media/asset-ref.md) `kind` `document` on another entity - do not put protocol text here.
