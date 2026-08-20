# `rig.dev.machine`

Portable development-environment recipe. Format when present.

This is not [`rig.audio.bus`](../audio/bus.md) or [`rig.mod.trigger`](../mod/trigger.md), and not a UI workspace dock ([ui.md](../../docs/ui.md)); docks stay fulfillment. Secrets, provider API clients, and cache fingerprints stay in the host — see [dev.md](../../docs/dev.md).

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | Advisory target class: `local`, `vm`, `ci`, or `container`. |
| `provider` | string | Optional. Advisory fulfillment id (`hyper-v`, `freestyle`, `docker`, `local`). Host may ignore or remap. Absent = host default. |
| `base` | string | Optional. Advisory stack / guest label (`node-22`, `ubuntu-22.04`, `pi-bookworm-arm64`); not a Dockerfile path or image digest. Absent = host default. |
| `requiresAuth` | string[] | Optional. Kebab auth catalog ids the host must satisfy before the machine is ready (`github`, `gcloud`). Never secrets or tokens. Absent = none declared. |
| `snapshotRef` | string | Optional. Opaque id or URI of a prepared state the host already knows (checkpoint name, Freestyle snapshot id). The blob stays in the host. Absent = none / create fresh. |
| `memoryBytes` | int | Optional. Advisory RAM in bytes. Absent = host default. |
| `diskBytes` | int | Optional. Advisory disk size in bytes. Absent = host default. |
| `cpus` | int | Optional. Advisory virtual CPU count. Absent = host default. |

Display name and stable id compose [`rig.meta.named`](../meta/named.md). Named operations compose [`rig.dev.op`](op.md).

Required: `kind`.
