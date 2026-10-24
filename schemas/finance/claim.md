---
id: "rig.finance.claim"
maturity: "draft"
summary: "An insurance claim. Format when present."
topJson: "{\"description\":\"An insurance claim. The policy is rig.legal.agreement kind insurance.\"}"
fields:
  - name: "claimant"
    ref: "entity"
    required: true
    meaning: "Person or organisation making the claim"
  - name: "status"
    type: "string"
    enum: ["open","reserved","settled","denied","closed"]
    required: true
    meaning: "open / reserved / settled / denied / closed"
  - name: "agreement"
    ref: "entity"
    meaning: "Optional. The policy"
  - name: "identifier"
    ref: "string"
    meaning: "Optional. Claim number as issued"
  - name: "incidentDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Optional. Day of the loss, YYYY-MM-DD"
---
# `rig.finance.claim`

An insurance claim. Format when present.

The policy is a [`rig.legal.agreement`](../legal/agreement.md) with `kind` `insurance`. This schema is the claim - not the policy, and not a claims workflow.

| Field | Type | Meaning |
|-------|------|---------|
| `claimant` | entity | Person or organisation making the claim |
| `status` | enum | `open` / `reserved` / `settled` / `denied` / `closed` |
| `agreement` | entity | Optional. The policy |
| `identifier` | string | Optional. Claim number as issued |
| `incidentDate` | string | Optional. Day of the loss, `YYYY-MM-DD` |

`claimant` and `status` are required.

The reserved or settled amount is [`rig.commerce.price`](../commerce/price.md) on this entity. A file this claim belongs to is [`rig.record.concerns`](../record/concerns.md). A second claim is another entity.
