# Simulation, robots, VR, play

Load for: physics, robots, training episodes, VR rigs, game state, input devices, network replication. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/robot-lab.json`](../../../examples/robot-lab.json), [`examples/robot-lesson.json`](../../../examples/robot-lesson.json), [`examples/vr-room.json`](../../../examples/vr-room.json), [`examples/play-scene.json`](../../../examples/play-scene.json). Mappings: [`docs/robot.md`](../../../docs/robot.md), [`docs/ros.md`](../../../docs/ros.md), [`docs/vr.md`](../../../docs/vr.md).

## Compose

| Want | Compose |
|---|---|
| Gravity / fixed step | `rig.sim.world` on the scene vertex; a body's own `gravity` replaces it |
| A dynamic body | `rig.sim.rigidbody` (never on an entity with `rig.sim.character` - the character is the motor) |
| Friction / restitution / shape | `rig.sim.collider` (box sizes are half extents); constraints are `rig.sim.joint` (`a`/`b`) driven by `rig.sim.actuator` (`joint`) |
| A robot | `rig.sim.articulation` on the root link; links parent via `rig.spatial.relationship`; joints are `rig.sim.joint` |
| Sensors | Depth: `rig.sensor.depth` + `rig.spatial.camera` (same entity). Scan: `rig.sensor.lidar`. One beam: `rig.sensor.range`. Wrench: `rig.sensor.wrench`. Fix: `rig.sensor.gnss` + `rig.place.geo`. IMU: `rig.sensor.imu` + transform. Class label: `rig.sensor.label` on a camera, `rig.sensor.class` on a mesh. Presence: `rig.sensor.presence` |
| A recorded take / reset range | `rig.sim.episode` (`clip` is an `rig.anim.clip`); `rig.sim.domain` varies one property at reset (`target`) |
| A learned policy | `rig.ai.policy` naming actuators and sensors (`actions`/`observations`); checkpoint is a `rig.media.asset_ref` |
| Agent behaviour | `rig.ai.behavior` (nodes parent by id; `action` is a host name - no callbacks, no expressions); a walker is `rig.sim.agent` + `rig.sim.navmesh` |
| Particles | `rig.sim.particle_emitter` (authored emitter only) |
| VR space / headset / eyes | `rig.vr.space` (`bounds` is the floor polygon as x,z), `rig.vr.headset`, `rig.vr.eye` (composes `rig.spatial.camera`; parent is the head `rig.vr.tracker`) |
| Trackers / controllers / hands | `rig.vr.tracker`, `rig.vr.controller` with `rig.vr.pose` (`grip`/`aim`), `rig.vr.hand` + `rig.vr.joint`, `rig.vr.haptic`, room pin `rig.vr.anchor`; pose is always `rig.spatial.transform`, triggers/grips are `rig.input.axes` / `rig.input.binding` |
| Game state | Hit points `rig.play.health`; `rig.play.item` + `rig.play.inventory` slots; `rig.play.spawner` (`prototype`); `rig.play.save`; a script hook is `rig.play.script` (`className` + optional `rig.media.code` asset - no function pointers) |
| Input devices | `rig.input.buttons`, `rig.input.axes`, `rig.input.pointer`, device codes are `rig.input.binding` (not `rig.input.buttons`) |
| Replication | `rig.net.replica` (not `rig.io.osc`) |

## Guards

- No `rig.ros2.*` (TF is `transform` + `relationship`; ROS nodes are not `rig.node.*`), and no `rig.isaac.*`, `rig.gazebo.*`, `rig.mujoco.*`, `rig.webots.*`, `rig.lerobot.*`. Solvers, renderers, and trainers are fulfillment.
- No `rig.openxr.*`, `rig.webxr.*`, or `rig.steamvr.*`. Sessions, swapchains, and prediction stay fulfillment.
- Do not serialize contact manifolds, live particles, point clouds, covariance, solved nav paths, or button edges. Source text is `rig.media.code`; sprite colour is paint.

## Ids in this slice

`rig.sim.rigidbody`, `rig.sim.particle_emitter`, `rig.sim.collider`, `rig.sim.joint`, `rig.sim.actuator`, `rig.sim.episode`, `rig.sim.character`, `rig.sim.navmesh`, `rig.sim.agent`, `rig.sim.world`, `rig.sim.articulation`, `rig.sim.domain`, `rig.sensor.depth`, `rig.sensor.lidar`, `rig.sensor.range`, `rig.sensor.wrench`, `rig.sensor.gnss`, `rig.sensor.imu`, `rig.sensor.label`, `rig.sensor.class`, `rig.sensor.presence`, `rig.ai.behavior`, `rig.ai.policy`, `rig.vr.space`, `rig.vr.headset`, `rig.vr.eye`, `rig.vr.tracker`, `rig.vr.controller`, `rig.vr.pose`, `rig.vr.hand`, `rig.vr.joint`, `rig.vr.haptic`, `rig.vr.anchor`, `rig.play.health`, `rig.play.item`, `rig.play.inventory`, `rig.play.spawner`, `rig.play.save`, `rig.play.script`, `rig.input.buttons`, `rig.input.axes`, `rig.input.pointer`, `rig.input.binding`, `rig.net.replica`
