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
