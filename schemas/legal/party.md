---
id: "rig.legal.party"
maturity: "draft"
summary: "One side of an agreement. Format when present."
topJson: "{\"description\":\"One side of an agreement. party is a person or organisation entity. A second signatory is another entity.\"}"
fields:
  - name: "agreement"
    ref: "entity"
    required: true
    meaning: "The rig.legal.agreement"
  - name: "party"
    ref: "entity"
    required: true
    meaning: "Person or organisation"
  - name: "role"
    type: "string"
    enum: ["party","buyer","seller","lessor","lessee","employer","employee","licensor","licensee","witness","guarantor"]
    meaning: "Optional. party / buyer / seller / lessor / lessee / employer / employee / licensor / licensee / witness / guarantor"
  - name: "signedDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day this side signed, YYYY-MM-DD"
---
# `rig.legal.party`

One side of an agreement. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `agreement` | entity | The [`rig.legal.agreement`](agreement.md) |
| `party` | entity | Person or organisation |
| `role` | enum | Optional. `party` / `buyer` / `seller` / `lessor` / `lessee` / `employer` / `employee` / `licensor` / `licensee` / `witness` / `guarantor` |
| `signedDate` | string | Optional. Day this side signed, `YYYY-MM-DD` |

`agreement` and `party` are required. Name the party on that entity. A second signatory is another entity.

`signedDate` here is this side's signature day. [`rig.legal.agreement`](agreement.md) `signedDate` is the instrument date when the source only has one.
