# Robots

An app that designs, simulates, tests, or trains a robot **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). Isaac Sim, Gazebo, MuJoCo, Webots, and the rest are fulfillments. The solver, the trainer, and the renderer are not this catalog.

ROS 2 middleware stays [ros.md](ros.md). There is no `rig.isaac.*`, `rig.gazebo.*`, or `rig.mujoco.*`.

## Design

A mechanism is an [`rig.sim.articulation`](../schemas/sim/articulation.md) on the root link. Each link is an entity:

| Fact | Rig |
|------|-----|
| Name | [`rig.meta.named`](../schemas/meta/named.md) |
| Pose in the parent | [`rig.spatial.transform`](../schemas/spatial/transform.md) + [`rig.spatial.relationship`](../schemas/spatial/relationship.md) |
| Mass, centre of mass, inertia | [`rig.sim.rigidbody`](../schemas/sim/rigidbody.md) |
| Collision | [`rig.sim.collider`](../schemas/sim/collider.md) |
| Visual | [`rig.geometry.mesh`](../schemas/geometry/mesh.md) and [`rig.render.material`](../schemas/render/material.md), or a [`rig.cad.*`](../schemas/cad/cuboid.md) solid whose mesh is a bake |
| Joint | [`rig.sim.joint`](../schemas/sim/joint.md) |
| Motor | [`rig.sim.actuator`](../schemas/sim/actuator.md) |
| Electronics | [`rig.circuit.*`](../schemas/circuit/part.md) / [`rig.pcb.*`](../schemas/pcb/board.md) - [kicad.md](kicad.md) |
| Printed parts | [`rig.print.*`](../schemas/print/machine.md) - [print.md](print.md) |

`inertia` is six numbers about the centre of mass, body frame: `ixx`, `iyy`, `izz`, `ixy`, `ixz`, `iyz`. Mass times scene length squared.

## Simulate

Compose [`rig.sim.world`](../schemas/sim/world.md) on the scene vertex. Gravity is scene units per second squared (+Y up). A body may replace it.

Contact friction and restitution live on the collider, including how two materials combine. The contact manifold does not.

| Sensor | Rig |
|--------|-----|
| Colour camera | [`rig.spatial.camera`](../schemas/spatial/camera.md). Frames stay in the host. A file is [`rig.pixel.source`](../schemas/pixel/source.md) |
| Depth | [`rig.sensor.depth`](../schemas/sensor/depth.md) on that camera |
| Class image | [`rig.sensor.label`](../schemas/sensor/label.md) on that camera. A mesh's class is [`rig.sensor.class`](../schemas/sensor/class.md) |
| Lidar | [`rig.sensor.lidar`](../schemas/sensor/lidar.md). The cloud stays in the host |
| One beam | [`rig.sensor.range`](../schemas/sensor/range.md) |
| IMU | [`rig.sensor.imu`](../schemas/sensor/imu.md). Orientation is the transform |
| Force / torque | [`rig.sensor.wrench`](../schemas/sensor/wrench.md) |
| GNSS | [`rig.sensor.gnss`](../schemas/sensor/gnss.md) plus [`rig.place.geo`](../schemas/place/geo.md) |
| Bumper | [`rig.sim.collider`](../schemas/sim/collider.md) `sensor` true. The contact list stays in the host |

A save writes the current pose, the body velocity, the joint `position` and `velocity`, and the latest sensor sample. Another host can continue from that file.

## Test

[`rig.sim.episode`](../schemas/sim/episode.md) is one attempt. `task` is the name. `success` is the judgement. Absent `success` means the attempt was not judged. Tracks on the episode are what was commanded and what was recorded. Several attempts are several episode entities.

## Train

[`rig.ai.policy`](../schemas/ai/policy.md) names the actuators it writes and the sensors it reads. A checkpoint file is [`rig.media.asset_ref`](../schemas/media/asset-ref.md) `kind` `other` on `weights`. [`rig.sim.domain`](../schemas/sim/domain.md) redraws a field from a range at each reset. The episode is the take and the score.

A behavior tree ([`rig.ai.behavior`](../schemas/ai/behavior.md)) can call the policy by action name. It does not store the network.

## Stay out

| Stay out | Why |
|----------|-----|
| Solver, iteration counts, warm starts | Fulfillment. Two hosts need not reproduce one contact from the same coefficients |
| Contact manifolds, point clouds, images, depth buffers | Host cache. The sensor component names the device and the sample at save |
| Network shape, optimizer, replay buffer | The wiring and the checkpoint file travel. The trainer does not |
| Soft bodies, cloth, fluids | Not a shared field set yet |
| `rig.isaac.*` / `rig.gazebo.*` / `rig.mujoco.*` / `rig.webots.*` | Product names stay out of schema ids |

## Example

[`examples/robot-lab.json`](../examples/robot-lab.json) — a bench with Earth gravity, a fixed-base arm, a wrist wrench, a range beam, a class camera, a GNSS fix, a mass range for reset, a policy, and a failed reach test.
