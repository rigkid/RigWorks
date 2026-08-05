# Versioning

**Current: 0.4.0** ([VERSION](../VERSION))

| Range | Meaning |
|-------|---------|
| **0.x.y** | Draft. Core rules (SUDE + ECS) hold. Schemas may grow or tighten. |
| **1.0.0** | First stable release. Breaking schema or core-rule changes need a major bump. |

Until 1.0.0, prefer additive schema fields. Tag releases `v0.1.0`, `v0.2.0`, … then `v1.0.0`.

## History

| Version | Notes |
|---------|-------|
| **0.4.0** | Renamed the project from Stitch to **RigWorks** (Rig for short), under the [rigkid](https://github.com/rigkid) org. Schema ids are now `rig.<domain>.<name>`; the document root key is `rig`; the `$id` base is `https://rig.works/schemas/`. Clean break — no aliases for the old `stitch.*` ids. |
| **0.3.0** | Last release under the Stitch name. |
