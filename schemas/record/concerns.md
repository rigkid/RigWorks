# `rig.record.concerns`

This fact belongs to a file. Format when present.

The member points at the file - the same rail rule as [`rig.circuit.net`](../circuit/net.md). The case and the incident hold no arrays.

| Field | Type | Meaning |
|-------|------|---------|
| `case` | entity | Optional. The [`rig.record.case`](case.md) |
| `incident` | entity | Optional. The [`rig.record.incident`](incident.md) |

At least one of `case` or `incident` is required. Compose onto the payment, claim, encounter, event, or sensor that belongs to the file. One case and one incident on this component. Do not invent a files array here.
