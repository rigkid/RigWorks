# `rig.dmx.fixture`

DMX patch for a scene light. Format when present.

Compose onto the same entity as [`rig.render.light`](../render/light.md). Pose and lamp type stay on that light. This component is only the slot map.

| Field | Type | Meaning |
|-------|------|---------|
| `startChannel` | int | First DMX slot used (1–512) |
| `channelCount` | int | Channels occupied (≥ 1) |
| `port` | entity | Optional. [`rig.io.dmx`](../io/dmx.md) port; absent = host default |

Channel layout (RGB versus RGBW, cell count, wire order) is fixture-profile fulfillment. Do not put live DMX slot bytes here.
