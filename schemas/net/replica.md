---
id: "rig.net.replica"
maturity: "draft"
summary: "Network identity for one entity. Format when present."
fields:
  - name: "netId"
    ref: "string"
    required: true
    meaning: "Stable id across peers"
  - name: "owner"
    ref: "int"
    meaning: "Optional. Player index that owns it. Absent = no owning player"
    absent: "no owning player"
  - name: "authority"
    type: "string"
    enum: ["server","owner"]
    meaning: "Optional. server or owner; absent = server"
    absent: "server"
---
# `rig.net.replica`

Network identity for one entity. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `netId` | string | Stable id across peers |
| `owner` | int | Optional. Player index that owns it. Absent = no owning player |
| `authority` | enum | Optional. `server` or `owner`; absent = `server` |

The replicated fields are the other components on the entity. This component says who may write them.

Transport, interest, and client prediction stay in the host. A show bus such as [`rig.io.osc`](../io/osc.md) is a listen/send endpoint, not this identity.
