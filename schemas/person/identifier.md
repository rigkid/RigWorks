---
id: "rig.person.identifier"
maturity: "draft"
summary: "Issued identifiers of a person. Format when present."
topJson: "{\"description\":\"Issued identifiers of a person. nationalId, taxId, mrn, passport as the source wrote them. Not a system+value bag.\",\"minProperties\":1}"
fields:
  - name: "nationalId"
    ref: "string"
    meaning: "National identity number as issued"
  - name: "taxId"
    ref: "string"
    meaning: "Tax identifier as issued (TIN, ABN, NINO, TFN)"
  - name: "mrn"
    ref: "string"
    meaning: "Medical record number as issued"
  - name: "passport"
    ref: "string"
    meaning: "Passport number as issued"
---
# `rig.person.identifier`

Issued identifiers of a person. Format when present.

Field meanings follow ISO 20022 party identification slots used inside financial MX messages, plus a medical record number. This schema is those identifiers - not an MX message, not a login, and not a `system` + `value` bag.

| Field | Type | Meaning |
|-------|------|---------|
| `nationalId` | string | National identity number as issued |
| `taxId` | string | Tax identifier as issued (TIN, ABN, NINO, TFN) |
| `mrn` | string | Medical record number as issued |
| `passport` | string | Passport number as issued |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid - attach at least one field.

Compose onto the person. Do not copy an MRN onto an encounter, and do not invent a second identifier scheme field. Name parts stay on [`rig.person.name`](name.md).
