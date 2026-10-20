# `rig.record.consent`

Permission a subject gave for a purpose. Format when present.

This schema is the grant, refusal, or withdrawal - not a consent-workflow, and not the classification mark ([`rig.record.mark`](mark.md)).

| Field | Type | Meaning |
|-------|------|---------|
| `subject` | entity | Person (or organisation) who decided |
| `purpose` | string | What was granted (`treatment`, `research`, `marketing`) |
| `status` | enum | `granted` / `refused` / `withdrawn` |
| `instrument` | entity | Optional. Signed file ([`rig.media.asset_ref`](../media/asset-ref.md) `kind` `document`) |

`subject`, `purpose`, and `status` are required.

The window is [`rig.calendar.span`](../calendar/span.md) on this entity. A second purpose is another entity.
