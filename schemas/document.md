# `rig.document`

JSON document envelope for Rig interchange. Format when present as a file or payload.

This is the **Contract wire format** (JSON). Field meaning remains POD; vectors and quats are JSON number arrays. Hosts may use other encodings internally — portable emission targets this envelope.

## Root

| Field | Type | Meaning |
|-------|------|---------|
| `rig` | string | Contract version this document targets (`MAJOR.MINOR.PATCH`) |
| `document` | object | Optional metadata (`title`, `author`, `createdAt`, `modifiedAt`, `defaultUnit`, …) |
| `entities` | entity[] | Scene / graph contents |

## Entity

| Field | Type | Meaning |
|-------|------|---------|
| `id` | string | Stable within this file. Fields typed `entity` reference these ids (or `null` for none). |
| `components` | map | Keys are schema ids `rig.<domain>.<name>`. Values match that schema’s serializable fields. |

## Rules

- Component keys **must** be catalog schema ids — not host type names (`Transform`) and not C++ class names.
- Serialize only portable fields listed on each schema. Omit host caches (Euler, world matrix, selection state, dirty flags, GPU handles).
- Unknown schema ids: validators **warn** by default; fail with `--strict`.
- Being Rig still means honoring [SUDE](../docs/sude.md) + [ECS](../docs/ecs.md). This envelope is how shared POD travels between hosts and tools.

Machine grammar: [`schemas/json/rig.document.schema.json`](json/rig.document.schema.json).

See [docs/interchange.md](../docs/interchange.md) for RigKit `.rig` key mapping.
