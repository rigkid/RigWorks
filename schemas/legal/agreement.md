---
id: "rig.legal.agreement"
maturity: "draft"
summary: "A deal between parties. Format when present."
topJson: "{\"description\":\"A deal between parties. Field meanings follow schema.org Contract and ISO 20022 AgreementIdentification. Term dates compose rig.calendar.span.\",\"minProperties\":1}"
fields:
  - name: "kind"
    type: "string"
    enum: ["employment","nda","licence","lease","loan","service","sale","insurance","other"]
    meaning: "employment / nda / licence / lease / loan / service / sale / insurance / other"
  - name: "identifier"
    ref: "string"
    meaning: "Contract / agreement number as issued"
  - name: "status"
    type: "string"
    enum: ["draft","offered","signed","active","suspended","terminated","expired"]
    meaning: "draft / offered / signed / active / suspended / terminated / expired"
  - name: "governingLaw"
    ref: "string"
    meaning: "Jurisdiction as written (e.g. England and Wales)"
  - name: "signedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Day the instrument was executed, YYYY-MM-DD"
  - name: "instrument"
    ref: "entity"
    meaning: "Optional. Signed file (rig.media.asset_ref kind document)"
---
# `rig.legal.agreement`

A deal between parties. Format when present.

Field meanings follow [schema.org](https://schema.org/Contract) `Contract` and ISO 20022 `AgreementIdentification`. This schema is those deal elements - not the Rig Contract (this vocabulary), not a contract-management workflow, and not the copyright of a work.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `employment` / `nda` / `licence` / `lease` / `loan` / `service` / `sale` / `insurance` / `other` |
| `identifier` | string | Contract / agreement number as issued |
| `status` | enum | `draft` / `offered` / `signed` / `active` / `suspended` / `terminated` / `expired` |
| `governingLaw` | string | Jurisdiction as written (e.g. `England and Wales`) |
| `signedDate` | string | Day the instrument was executed, `YYYY-MM-DD` |
| `instrument` | entity | Optional. Signed file ([`rig.media.asset_ref`](../media/asset-ref.md) `kind` `document`) |

All fields optional. Emit what the source has. An empty component is invalid - attach at least one field.

The title is [`rig.meta.named`](../meta/named.md). The term is [`rig.calendar.span`](../calendar/span.md). Each side is a [`rig.legal.party`](party.md) entity. Do not put party name strings here.

Copyright and licence of a *work* stay on [`rig.rights.statement`](../rights/statement.md). A licence *agreement* (you may use this work for a show) is this schema with `kind` `licence`. Job facts stay on [`rig.person.employment`](../person/employment.md) - do not copy `jobTitle` onto the instrument.

E-sign, countersignature workflow, and clause text are fulfillment. Clause copy that must travel is [`rig.story.flow`](../story/flow.md) or the `instrument` file - not an unstructured blob here.
