# ROS 2

A ROS 2 host **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). rmw, DDS, launch files, and bags are fulfillment — not this catalog.

Unlike [OpenBIM](openbim.md), there is no `rig.ros2.*` layer. Portable meaning is spatial / I/O / sensor / [SUDE](sude.md). Product protocol names stay out of schema ids (same rule as [`rig.music.clock`](../schemas/music/clock.md)). ROS-only fields travel as `x.ros2.*` until a second speaker needs the same meaning in the catalog.

## Map (existing ids only)

| ROS 2 idea | Rig |
|------------|-----|
| TF frame | Entity with [`rig.meta.named`](../schemas/meta/named.md) + [`rig.spatial.transform`](../schemas/spatial/transform.md) |
| Parent frame | [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` |
| URDF link | Same as TF; mesh / material compose as usual |
| Joint / constraint | Stay out — [`rig.sim.rigidbody`](../schemas/sim/rigidbody.md) already refuses shared constraint numbers |
| Graph member (ROS node) | Entity + [`rig.meta.named`](../schemas/meta/named.md). Namespace, `domainId`, FQN stay `x.ros2.*`. Do not call this a "host" (Rig **host** = live program) |
| Topic / service / action | Named bus, like [`rig.io.osc`](../schemas/io/osc.md). Message type strings and QoS stay `x.ros2.*` |
| Message payload | Land on existing fields in Update (`transform`, `rig.sim.rigidbody.velocity`, `rig.sensor.*`, `rig.pixel.source`) — do not catalog Twist / Image as schemas |
| `/clock` | [SUDE](sude.md) `dt`. Do not reuse [`rig.music.clock`](../schemas/music/clock.md) |
| Camera stream | [`rig.pixel.source`](../schemas/pixel/source.md) when it is capture; frames stay in the host |
| GPIO / occupancy | [`rig.sensor.gpio`](../schemas/sensor/gpio.md) / [`presence`](../schemas/sensor/presence.md); `device` may point at the node entity |

World pose / TF lookup caches stay in the host — rebuild from local transform + parent, same as any scene graph.

**Do not map ROS nodes onto [`rig.node.*`](../schemas/node/node.md).** That catalog is an artist patcher (`typeId` = host behaviour). Different graph — see [Grouping graphs (do not merge)](../schemas/README.md#grouping-graphs-do-not-merge).

## TF sketch

Two frames, existing schemas only:

```json
{
  "entities": [
    {
      "id": "base_link",
      "components": {
        "rig.meta.named": { "name": "base_link", "stableId": "base_link" },
        "rig.spatial.transform": {
          "position": [0, 0, 0],
          "rotation": [0, 0, 0, 1],
          "scale": [1, 1, 1]
        }
      }
    },
    {
      "id": "camera_link",
      "components": {
        "rig.meta.named": { "name": "camera_link", "stableId": "camera_link" },
        "rig.spatial.transform": {
          "position": [0.1, 0, 0.2],
          "rotation": [0, 0, 0, 1],
          "scale": [1, 1, 1]
        },
        "rig.spatial.relationship": { "parent": "base_link" }
      }
    }
  ]
}
```

(Wrap in a full document with `"rig"` set to the current [`VERSION`](../VERSION) before validating.)

## Stay out

| Stay out | Why |
|----------|-----|
| DDS discovery / `ros2 node list` | Who is alive is a host cache — same class as a LAN scan table |
| QoS, last message, in-flight goals | Runtime state — do not serialize |
| Launch, bags, rmw vendor | Process graph and middleware are fulfillment |
| `rig.ros2.*` | Product protocol names stay out of schema ids |

A scan of who is up is not Contract meaning. RigKit's `x.rigkit.net_scan` / `x.rigkit.net_host` stay host extensions.

## Encodings (fulfillment)

| Surface | Role |
|---------|------|
| TF2 / URDF | Map frames and links into spatial transform + relationship |
| Topics / services / actions | Pub/sub and RPC in Update; write portable fields from payloads |
| `x.ros2.*` | Namespace, domain, message type, QoS — travel; do not port |
| Bags / launch | Replay and process graph stay in the host |

## Honest limit

Two hosts that speak transform + relationship + the sensors they share can exchange a robot pose tree as `.rig`. Round-tripping every ROS message type, QoS profile, and discovery snapshot is not required. A host that needs the rest keeps it in ROS and maps what it understands.
