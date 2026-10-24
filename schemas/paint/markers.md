# `rig.paint.markers`

Marker refs on a stroked path. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `start` | entity | Optional. [`rig.paint.marker`](marker.md) at the first vertex |
| `mid` | entity | Optional. Marker at intermediate vertices |
| `end` | entity | Optional. Marker at the last vertex |

Compose on the drawable. Omit when every ref is absent. Colour and width of the stroke stay on paint. Draw order is [`rig.paint.order`](order.md).
