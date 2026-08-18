# `rig.legal.agreement`

A deal between parties. Format when present.

Field meanings follow [schema.org](https://schema.org/Contract) `Contract` and ISO 20022 `AgreementIdentification`. This schema is those deal elements — not the Rig Contract (this vocabulary), not a contract-management workflow, and not the copyright of a work.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `employment` / `nda` / `licence` / `lease` / `loan` / `service` / `sale` / `other` |
| `identifier` | string | Contract / agreement number as issued |
| `status` | enum | `draft` / `offered` / `signed` / `active` / `suspended` / `terminated` / `expired` |
| `governingLaw` | string | Jurisdiction as written (e.g. `England and Wales`) |
| `signedDate` | string | Day the instrument was executed, `YYYY-MM-DD` |
| `instrument` | entity | Optional. Signed file ([`rig.media.asset_ref`](../media/asset-ref.md) `kind` `document`) |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

The title is [`rig.meta.named`](../meta/named.md). The term is [`rig.calendar.span`](../calendar/span.md). Each side is a [`rig.legal.party`](party.md) entity. Do not put party name strings here.

Copyright and licence of a *work* stay on [`rig.rights.statement`](../rights/statement.md). A licence *agreement* (you may use this work for a show) is this schema with `kind` `licence`. Job facts stay on [`rig.person.employment`](../person/employment.md) — do not copy `jobTitle` onto the instrument.

E-sign, countersignature workflow, and clause text are fulfillment. Clause copy that must travel is [`rig.story.flow`](../story/flow.md) or the `instrument` file — not an unstructured blob here.
