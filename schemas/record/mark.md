# `rig.record.mark`

Classification and retention of a fact. Format when present.

This schema is the perimeter a host must honour - not copyright of a work ([`rig.rights.statement`](../rights/statement.md)), not an access-control list, and not a query audit.

| Field | Type | Meaning |
|-------|------|---------|
| `class` | enum | `public` / `internal` / `confidential` / `pii` / `phi` / `pci` / `cui` / `classified` |
| `marking` | string | Optional. Banner as written (`CUI//SP-PRVCY`) |
| `purpose` | string | Optional. Why this fact is held (`payment-auth`, `treatment`) |
| `disposition` | enum | Optional. `keep` / `tombstone` / `hold`; absent = unknown |
| `retainYears` | int | Optional. Years to keep after the fact's day. `0` means do not retain |

`class` is required. Compose onto any entity. A second mark is another entity - do not stack two marks on one fact.

`classified` is the national-security class. The written banner stays on `marking`. Hot, warm, and cold storage stay in the host.
