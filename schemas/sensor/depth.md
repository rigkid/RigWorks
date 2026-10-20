# `rig.sensor.depth`

Depth image on a camera. Format when present. Compose [`rig.spatial.camera`](../spatial/camera.md) for the projection and [`rig.spatial.transform`](../spatial/transform.md) for the pose. Looks along local −Z.

| Field | Type | Meaning |
|-------|------|---------|
| `rangeMin` | float | Optional. Nearest reported distance, scene units. Absent = the camera `nearClip`, or the host default when no camera is composed |
| `rangeMax` | float | Optional. Farthest reported distance, scene units. Absent = the camera `farClip`, or the host default |
| `measure` | enum | Optional. `plane` (distance to the image plane) or `ray` (distance along the view ray). Absent = `plane` |
| `width` | int | Optional. Image width in pixels. Absent = host default |
| `height` | int | Optional. Image height in pixels. Absent = host default |
| `device` | entity | Optional board / network entity; absent = local |

`rangeMax` is greater than `rangeMin` when both are set. A host that sees otherwise skips the sensor.

The depth buffer, noise, and any intrinsics beyond the camera stay in the host. A ROS 2 node entity is a valid `device` - [docs/ros.md](../../docs/ros.md).
