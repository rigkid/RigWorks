---
id: "rig.ai.policy"
maturity: "draft"
summary: "A learned map from observations to drives. Format when present. At least one field."
topJson: "{\"minProperties\":1}"
fields:
  - name: "actions"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. rig.sim.actuator entities the policy commands"
  - name: "observations"
    type: "array"
    itemsRef: "entity"
    meaning: "Optional. Sensors, bodies, or rig.anim.track entities it reads"
  - name: "task"
    ref: "string"
    meaning: "Optional. Host task name, the same idea as rig.sim.episode task"
  - name: "weights"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref of a checkpoint file (kind other)"
  - name: "episode"
    ref: "entity"
    meaning: "Optional. rig.sim.episode this policy is training or being scored on"
---
# `rig.ai.policy`

A learned map from observations to drives. Format when present. At least one field.

| Field | Type | Meaning |
|-------|------|---------|
| `actions` | entity[] | Optional. [`rig.sim.actuator`](../sim/actuator.md) entities the policy commands |
| `observations` | entity[] | Optional. Sensors, bodies, or [`rig.anim.track`](../anim/track.md) entities it reads |
| `task` | string | Optional. Host task name, the same idea as [`rig.sim.episode`](../sim/episode.md) `task` |
| `weights` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) of a checkpoint file (`kind` `other`) |
| `episode` | entity | Optional. [`rig.sim.episode`](../sim/episode.md) this policy is training or being scored on |

`actions` and `observations` are the contract two hosts share. The network, the optimizer, and the replay buffer stay in the host. An unknown checkpoint is kept and not run.

A [`rig.ai.behavior`](behavior.md) tree may name an action the host implements by stepping this policy. The tree does not embed the weights.

[`rig.sim.domain`](../sim/domain.md) redraws scene fields between episodes. Recorded samples stay on the episode's tracks.
