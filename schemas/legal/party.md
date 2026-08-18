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
