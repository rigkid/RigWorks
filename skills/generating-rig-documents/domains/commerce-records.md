# Commerce, records, finance, clinic, legal

Load for: prices, offers, orders, invoices, payments, case files, encounters, agreements. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/commerce-offer.json`](../../../examples/commerce-offer.json), [`examples/legal-agreement.json`](../../../examples/legal-agreement.json), [`examples/record-bank.json`](../../../examples/record-bank.json), [`examples/record-care.json`](../../../examples/record-care.json), [`examples/record-shop.json`](../../../examples/record-shop.json), [`examples/record-civic.json`](../../../examples/record-civic.json). Mapping notes: [`docs/records.md`](../../../docs/records.md).

## Compose

| Want | Compose |
|---|---|
| A price | `rig.commerce.price` composed on the offer / payment / claim / order line / invoice line that carries it |
| A discount | `rig.commerce.discount` (percent is 0-100 here) |
| A catalog item | `rig.commerce.product` (`gtin` digits only; a variant sets `parent`); stock is `rig.commerce.stock` |
| An offer | `rig.commerce.offer` (`item` + `seller` entities; price/discount compose on the offer) |
| An order / a bill / a shipment | `rig.commerce.order` + `order_line` entities; `rig.commerce.invoice` + `invoice_line`; `rig.commerce.shipment` + `shipment_line`. The payment that settles a bill sets `rig.finance.payment.invoice` |
| A payment / holding / claim | `rig.finance.payment`; `rig.finance.position` (`isin`); `rig.finance.claim` |
| Classification of a record | `rig.record.mark`; who stated a fact is `rig.record.assertion`; consent is `rig.record.consent` + a span |
| A happening with no magnitude | `rig.record.event` + `rig.calendar.event`; a measurement is `rig.clinic.observation` (do not also attach `record.event`) |
| A file things belong to | `rig.record.case` or `rig.record.incident`; members point at it with `rig.record.concerns`; a note is `rig.record.note` on its subject |
| A visit / study / trial | `rig.clinic.encounter`; `rig.clinic.study`; `rig.clinic.trial` + `rig.clinic.criterion` rows |
| A deal between parties | `rig.legal.agreement` with `rig.legal.party` entities; an insurance policy is `agreement.kind` `insurance`; a licence deal is `kind` `licence` |
| Copyright / licence of a work | `rig.rights.statement` (not on the agreement, not on the work) |
| A statute | `rig.law.statute` |

## Guards

- No `rig.fhir.*`, `rig.pacs.*`, `rig.dicom.*`, `rig.gs1.*`. Those files are host mappings; portable meaning is the record/finance/clinic/commerce ids above.
- No price string, and no list-plus-sale price pair, on book/art/play schemas. No price on `rig.play.item`. No cart, checkout, or tax engine - those are fulfillment.
- Search indexes, vectors, and message formats stay fulfillment.

## Ids in this slice

`rig.commerce.price`, `rig.commerce.offer`, `rig.commerce.discount`, `rig.commerce.product`, `rig.commerce.stock`, `rig.commerce.order`, `rig.commerce.order_line`, `rig.commerce.invoice`, `rig.commerce.invoice_line`, `rig.commerce.shipment`, `rig.commerce.shipment_line`, `rig.finance.payment`, `rig.finance.position`, `rig.finance.claim`, `rig.record.mark`, `rig.record.assertion`, `rig.record.event`, `rig.record.consent`, `rig.record.case`, `rig.record.incident`, `rig.record.concerns`, `rig.record.note`, `rig.clinic.encounter`, `rig.clinic.observation`, `rig.clinic.study`, `rig.clinic.trial`, `rig.clinic.criterion`, `rig.law.statute`, `rig.legal.agreement`, `rig.legal.party`, `rig.rights.statement`
