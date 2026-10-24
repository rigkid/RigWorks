---
id: "rig.interact.selectable"
maturity: "stable"
summary: "Opt-in selection eligibility. Format when present."
topJson: "{\"minProperties\":0}"
fields:
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Eligible for selection when true; absent = true"
    absent: "true"
---
# `rig.interact.selectable`

Opt-in selection eligibility. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Eligible for selection when true; absent = true |

The selection snapshot is [`rig.interact.selected`](selected.md). Hover stays in the host.
Hit-test geometry is [`rig.sim.collider`](../sim/collider.md) when that component is present; otherwise transform / shape / mesh.

Hosts without this component may still pick entities (legacy). When present, pick must honor `enabled`.
