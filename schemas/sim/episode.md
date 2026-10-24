---
id: "rig.sim.episode"
maturity: "draft"
summary: "One recorded attempt. Format when present. At least one field."
topJson: "{\"minProperties\":1}"
fields:
  - name: "clip"
    ref: "entity"
    meaning: "Optional. rig.anim.clip of the take. Absent = outcome only"
    absent: "outcome only"
  - name: "task"
    ref: "string"
    meaning: "Optional. Host task name, the same idea as an rig.ai.behavior action"
  - name: "success"
    ref: "bool"
    meaning: "Optional. Whether the task finished. Absent = not judged"
    absent: "not judged"
  - name: "actions"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. rig.anim.track entities commanded as actions. Absent = none"
    absent: "none"
  - name: "observations"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. Tracks recorded as observations. Absent = none"
    absent: "none"
---
# `rig.sim.episode`

One recorded attempt. Format when present. At least one field.

| Field | Type | Meaning |
|-------|------|---------|
| `clip` | entity | Optional. [`rig.anim.clip`](../anim/clip.md) of the take. Absent = outcome only |
| `task` | string | Optional. Host task name, the same idea as an [`rig.ai.behavior`](../ai/behavior.md) `action` |
| `success` | bool | Optional. Whether the task finished. Absent = not judged |
| `actions` | entity[] | Optional. [`rig.anim.track`](../anim/track.md) entities commanded as actions. Absent = none |
| `observations` | entity[] | Optional. Tracks recorded as observations. Absent = none |

When `clip` is set, every track in `actions` and `observations` has that `clip`. Images stay on their own entities ([`rig.pixel.source`](../pixel/source.md), [`rig.media.asset_ref`](../media/asset-ref.md)). Policy weights stay in the host.

`success` absent is not a failure. An unknown `task` name still records; the host may ignore it.

A policy that trains or is scored on this attempt is [`rig.ai.policy`](../ai/policy.md). Fields redrawn at reset are [`rig.sim.domain`](domain.md).
