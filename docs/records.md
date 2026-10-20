# Records

A host that holds payments, encounters, catalog rows, or case files **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). Search engines, vector stores, and message parsers are fulfillments. The index is not this catalog.

Portable meaning is [`rig.record.*`](../schemas/record/mark.md) plus the finance, clinic, commerce, and law components those compose. Product names stay out of schema ids. There is no `rig.fhir.*`, `rig.pacs.*`, `rig.dicom.*`, or `rig.gs1.*`.

## Shared record

| Fact | Rig |
|------|-----|
| Perimeter and retention | [`rig.record.mark`](../schemas/record/mark.md) |
| Who stated it, and when | [`rig.record.assertion`](../schemas/record/assertion.md) |
| Happening with no magnitude | [`rig.record.event`](../schemas/record/event.md) plus [`rig.calendar.event`](../schemas/calendar/event.md) |
| Grant, refusal, or withdrawal | [`rig.record.consent`](../schemas/record/consent.md) plus [`rig.calendar.span`](../schemas/calendar/span.md) |
| File about a subject | [`rig.record.case`](../schemas/record/case.md) |
| Reported happening in the world | [`rig.record.incident`](../schemas/record/incident.md) |
| This fact belongs to a file | [`rig.record.concerns`](../schemas/record/concerns.md) |

Members point at the file. The case and the incident hold no arrays. The file's `document.author` stays the file. Join keys live on the noun.

A time of day composes [`rig.calendar.event`](../schemas/calendar/event.md). `startSecond` orders happenings that share a minute. Do not invent a second timestamp type.

## Financial services

| Fact | Rig |
|------|-----|
| Party and cash account | [`rig.person.*`](../schemas/person/name.md) / [`rig.organisation.identity`](../schemas/organisation/identity.md) / [`rig.party.account`](../schemas/party/account.md) |
| Amount | [`rig.commerce.price`](../schemas/commerce/price.md) |
| Movement | [`rig.finance.payment`](../schemas/finance/payment.md) |
| Holding | [`rig.finance.position`](../schemas/finance/position.md) (`isin` is ISO 6166) |
| Policy | [`rig.legal.agreement`](../schemas/legal/agreement.md) `kind` `insurance` |
| Claim | [`rig.finance.claim`](../schemas/finance/claim.md) |
| Fraud or AML file | [`rig.record.case`](../schemas/record/case.md) `kind` `fraud` / `aml` |

Example: [`examples/record-bank.json`](../examples/record-bank.json).

## Healthcare and life sciences

| Fact | Rig |
|------|-----|
| Visit or admission | [`rig.clinic.encounter`](../schemas/clinic/encounter.md) |
| Measurement | [`rig.clinic.observation`](../schemas/clinic/observation.md) |
| Imaging study | [`rig.clinic.study`](../schemas/clinic/study.md) (`studyUid` / `seriesUid`) |
| Trial | [`rig.clinic.trial`](../schemas/clinic/trial.md) |
| Eligibility row | [`rig.clinic.criterion`](../schemas/clinic/criterion.md) |
| Consent | [`rig.record.consent`](../schemas/record/consent.md) |

A measurement is an observation. Do not also attach [`rig.record.event`](../schemas/record/event.md). Pixels stay on the asset file.

Example: [`examples/record-care.json`](../examples/record-care.json).

## Retail

| Fact | Rig |
|------|-----|
| Item | [`rig.commerce.product`](../schemas/commerce/product.md) (`gtin` is digits only; a variant sets `parent`) |
| Offer | [`rig.commerce.offer`](../schemas/commerce/offer.md) `item` |
| Count at a place | [`rig.commerce.stock`](../schemas/commerce/stock.md) |
| Sale | [`rig.commerce.order`](../schemas/commerce/order.md) plus [`rig.commerce.order_line`](../schemas/commerce/order-line.md) |

Session memory and the embedding index stay in the host.

Example: [`examples/record-shop.json`](../examples/record-shop.json).

## Public sector

| Fact | Rig |
|------|-----|
| Citizen case | [`rig.record.case`](../schemas/record/case.md) `kind` `service` / `benefits` |
| Statute | [`rig.law.statute`](../schemas/law/statute.md) |
| Incident | [`rig.record.incident`](../schemas/record/incident.md) |
| Responder fix | [`rig.sensor.gnss`](../schemas/sensor/gnss.md) plus [`rig.place.geo`](../schemas/place/geo.md) plus [`rig.record.concerns`](../schemas/record/concerns.md) |

Example: [`examples/record-civic.json`](../examples/record-civic.json).

## Encodings (fulfillment)

| File | Role |
|------|------|
| ISO 20022 `pacs.*` / `pain.*` / `camt.*` | Map into / out of `rig.finance.payment` + party / account / price |
| FHIR Bundle / resource | Map Encounter, Observation, Consent, ResearchStudy |
| DICOM | Map Study / Series UID onto `rig.clinic.study`; pixels stay the file |
| GS1 / GTIN catalog | Map onto `rig.commerce.product` + offer + stock |
| Case-management export | Map onto `rig.record.case` + `concerns` |

Do not put query explain-plans, vector embeddings, or RBAC tables in portable components - those are the engine.

## Stay out

| Stay out | Why |
|----------|-----|
| Hybrid search, Elasticsearch wire, per-query explain | The engine. Two hosts share the record, not the index |
| Tenant isolation, customer-managed keys, air-gap binary | Deployment posture |
| Generic `system` + `value` identifier bags | Join keys live on the noun |
| Medication, lab panels, trade tickets | Not a shared field set yet |
| `rig.fhir.*` / `rig.pacs.*` / `rig.dicom.*` / `rig.gs1.*` | Product and message names stay out of schema ids |
