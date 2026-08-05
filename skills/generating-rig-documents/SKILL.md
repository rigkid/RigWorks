---
name: generating-rig-documents
description: >-
  Generate and edit Rig JSON documents, SUDE-loop hosts, and ECS component
  data against the Rig shared vocabulary. Use when generating or editing
  Rig entity data, SUDE hooks, or ECS component schemas; when creating or
  modifying rig.* components, rig.document JSON, or .rig interchange; or
  when the user mentions Rig, SUDE, or RigKit.
---

# Generating Rig documents

## When to use

Load this skill when generating or editing Rig entity data, SUDE hooks, or ECS component schemas — or when emitting portable JSON a host should load.

## Core model

**Rig** = [SUDE](../../docs/sude.md) + [ECS](../../docs/ecs.md). Schemas are optional; ship what you support. Nothing to link into an app. Rig is a shared vocabulary — not another editor, and not character rigging.

### SUDE

```
Setup → Update → Draw → Exit
```

| Hook | When | Semantics |
|------|------|-----------|
| `Setup()` | Once | Allocate app state. May be empty. |
| `Update(dt)` | Each tick, before Draw | Simulation. `dt` = seconds (host clock). |
| `Draw()` | Each tick, after Update | Present. Always called; empty body OK. |
| `Exit()` | Once, before teardown | Release state. May be empty. |

Do not nest hooks. No display/UI required for SUDE compliance.

### ECS

| Rule | Detail |
|------|--------|
| App owns registry | No second hidden registry for app entities |
| POD only | Numbers, small structs, strings, entity ids |
| No portable handles | No GPU/UI toolkit types, callbacks, dirty flags, hover/press, pending queues |
| Simulate / Present | Mutate in `Update`; present in `Draw` |
| Hierarchy (optional) | Parent as entity id; local `position` / `rotation` (quat) / `scale` |

## Document shape

Wire format is JSON — [`rig.document`](../../schemas/document.md).

| Root field | Meaning |
|------------|---------|
| `rig` | Contract version (`MAJOR.MINOR.PATCH`, e.g. `0.4.0`) |
| `document` | Optional metadata (`title`, `defaultUnit`, …) |
| `entities` | Array of `{ id, components }` |

- `id` — string, unique within the file
- `components` — map keyed by full schema ids (`rig.spatial.transform`), **not** PascalCase host aliases
- `entity`-typed fields — string id or `null`
- `vec*` / `quat` — JSON number arrays; **quat order x, y, z, w**
- Enums — lowerCamelCase literals from the schema
- Serialize only portable fields; omit host caches

Exact grammar: [`schemas/json/`](../../schemas/json/).

## Worked examples

Goldens: [`examples/minimal-scene.json`](../../examples/minimal-scene.json), [`examples/lfo-binding.json`](../../examples/lfo-binding.json).

### Entity with shape + paint

<!-- rig:begin entity=demo-rect from=examples/minimal-scene.json -->
```json
{
  "id": "demo-rect",
  "components": {
    "rig.meta.named": {
      "name": "demo-rect",
      "stableId": "demo-rect"
    },
    "rig.spatial.transform": {
      "position": [
        64,
        64,
        0
      ],
      "rotation": [
        0,
        0,
        0,
        1
      ],
      "scale": [
        1,
        1,
        1
      ]
    },
    "rig.geometry.shape": {
      "type": "rectangle",
      "x1": 0,
      "y1": 0,
      "x2": 180,
      "y2": 110,
      "sides": 5,
      "innerRadius": 0.5
    },
    "rig.paint.fill_stroke": {
      "fillRgba": [
        0.25,
        0.65,
        1,
        1
      ],
      "strokeRgba": [
        0,
        0,
        0,
        1
      ],
      "strokeWidth": 1,
      "hasFill": true,
      "hasStroke": false
    },
    "rig.interact.selectable": {
      "enabled": true
    }
  }
}
```
<!-- rig:end -->

### LFO → binding (Update-side)

```json
{
  "entities": [
    {
      "id": "pulse",
      "components": {
        "rig.meta.named": { "name": "pulse", "stableId": "pulse" },
        "rig.mod.lfo": {
          "waveform": "sine",
          "frequency": 0.5,
          "amplitude": 40,
          "offset": 120,
          "phase": 0
        }
      }
    },
    {
      "id": "dot",
      "components": {
        "rig.meta.named": { "name": "dot", "stableId": "dot" },
        "rig.spatial.transform": {
          "position": [200, 120, 0],
          "rotation": [0, 0, 0, 1],
          "scale": [1, 1, 1]
        }
      }
    },
    {
      "id": "bind-y",
      "components": {
        "rig.mod.binding": {
          "source": "pulse",
          "target": "dot",
          "propertyKey": "position.y",
          "depth": 1,
          "min": 40,
          "max": 280,
          "additive": false
        }
      }
    }
  ]
}
```

(Wrap entities in a full document with `"rig": "0.4.0"` before validating.)

## Feedback loop

Never deliver unvalidated Rig JSON.

1. Write or edit a `.json` document
2. Validate:

```bash
cd tools/rig-validate && npm install && cd ../..
node tools/rig-validate/cli.js path/to/doc.json
```

3. Fix errors at the reported JSON Pointer paths
4. Re-run until the CLI prints `ok`
5. Use `--strict` to treat unknown schema ids as errors

## Common mistakes / non-requirements

- **Do not** serialize Euler angles, world matrices, selection state, dirty flags, GPU handles, or LFO last-sample caches
- **Do not** invent schema ids or use PascalCase keys (`Transform`, `Shape`) — those are RigKit host aliases; see [docs/interchange.md](../../docs/interchange.md)
- **Do not** nest SUDE hooks or skip calling `Draw`
- **Do not** re-declare `name` on domain schemas — compose `rig.meta.named`
- SUDE does **not** require a window, GPU, UI pack, filesystem, or audio
- Being Rig does **not** require implementing every schema

## Vocabulary index

Field meaning: [`schemas/`](../../schemas/). Machine grammar: [`schemas/json/<id>.schema.json`](../../schemas/json/).

| Domain | Schema ids |
|--------|------------|
| Document | `rig.document` |
| Spatial | `transform`, `relationship`, `group`, `camera`, `layer` |
| Geometry | `mesh`, `shape`, `path` |
| Paint | `solid`, `gradient`, `fill_stroke` |
| Meta / render | `named`, `light`, `material` |
| Anim / mod | `tween`, `lfo`, `binding` |
| Music | `transport`, `clock`, `sequencer`, `pattern`, `step`, `note`, `midi_output` |
| Media | `asset_ref`, `text`, `code` |
| Pixel | `canvas`, `source`, `layer`, `raster`, `effect_chain` |
| I/O | `osc`, `serial`, `led.uv_map`, `sensor.gpio` |
| Interact | `selectable` |
| UI | `panel`, `control`, `action` |
| Node | `graph`, `node`, `pin`, `link`, `param`, `publish` |

Prefix every component key with `rig.<domain>.` (e.g. `rig.spatial.transform`).

## Where output goes

[RigKit](https://github.com/rigkid/rigkit) is the reference host. Prefer Contract JSON (`rig.*` keys); translate at the host boundary if the host still uses PascalCase `.rig` keys.
