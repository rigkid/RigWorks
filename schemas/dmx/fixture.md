---
id: "rig.dmx.fixture"
maturity: "draft"
summary: "DMX patch for a scene light. Format when present."
fields:
  - name: "startChannel"
    type: "integer"
    minimum: 1
    maximum: 512
    required: true
    meaning: "First DMX slot used (1-512)"
  - name: "channelCount"
    type: "integer"
    minimum: 1
    required: true
    meaning: "Channels occupied (≥ 1)"
  - name: "port"
    ref: "entity"
    meaning: "Optional. rig.io.dmx port; absent = host default"
    absent: "host default"
---
# `rig.dmx.fixture`

DMX patch for a scene light. Format when present.

Compose onto the same entity as [`rig.render.light`](../render/light.md). Pose and lamp type stay on that light. This component is only the slot map.

| Field | Type | Meaning |
|-------|------|---------|
| `startChannel` | int | First DMX slot used (1-512) |
| `channelCount` | int | Channels occupied (≥ 1) |
| `port` | entity | Optional. [`rig.io.dmx`](../io/dmx.md) port; absent = host default |

Channel layout (RGB versus RGBW, cell count, wire order) is fixture-profile fulfillment. Do not put live DMX slot bytes here.
