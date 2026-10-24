---
name: generating-rig-documents
description: >-
  Generate and edit Rig entity/component JSON, SUDE hosts, and ECS schemas
  against the Rig vocabulary (SemVer). Use for rig.* components, rig.document,
  .rig / .rigz, Contract VERSION bumps, and before committing or pushing
  Contract changes (npm run check). Triggers: Rig, SUDE, RigKit.
---

# Generating Rig documents

**Rig** is portable entity/component POD keyed by schema ids ([`rig.document`](../../schemas/document.md)). Ship what you support. Nothing to link. Floor: [honors.md](../../docs/honors.md). Live hosts also honor [SUDE](../../docs/sude.md) and runtime [ECS](../../docs/ecs.md).

This file is the **router**. Load it, pick **one** domain slice (two only when the task spans domains), copy the closest example, emit, validate. Field details live in each schema's frontmatter (`schemas/<domain>/<name>.md`); [`schemas/index.json`](../../schemas/index.json) is the generated catalog. Do not load the whole catalog.

## Router - load one slice

| Task mentions | Load |
|---|---|
| scene, shape, drawing, transform, mesh, paint, light, camera | [domains/scene.md](domains/scene.md) |
| page, layout, story, text frame, paragraph style | [domains/layout-story.md](domains/layout-story.md) |
| font, glyph, UFO, variable font | [domains/font.md](domains/font.md) |
| music, chord, sequencer, audio, LFO, animation, tween | [domains/music-audio.md](domains/music-audio.md) |
| person, address, contact, calendar, event, plant | [domains/people-calendar.md](domains/people-calendar.md) |
| price, offer, order, invoice, payment, record, clinic, legal | [domains/commerce-records.md](domains/commerce-records.md) |
| book, ISBN, paper, citation, artwork, rights | [domains/knowledge.md](domains/knowledge.md) |
| BIM, IFC, BCF, IDS, CAD, solid, dimension | [domains/bim-cad.md](domains/bim-cad.md) |
| KiCad, circuit, PCB, print, FGF, dev machine, OSC, serial, DMX | [domains/machines.md](domains/machines.md) |
| robot, simulation, physics, VR, game, play, AI policy, ROS | [domains/sim-vr-play.md](domains/sim-vr-play.md) |
| UI panel, control, node graph, patcher | [domains/ui-node.md](domains/ui-node.md) |

## Composition (all domains)

- POD only: numbers, small structs, strings, entity ids. Key components by full schema ids (`rig.spatial.transform`).
- No GPU/UI types, callbacks, dirty flags, hover/press, or pending queues.
- No derived fields (winding, world matrices, Euler, bar/beat). Hosts cache those - [Host cache](../../docs/terms.md).
- Hierarchy is optional: parent entity id, local `position` / `rotation` (quat) / `scale`.
- Compose, do not re-declare: display name is `rig.meta.named`; file identity is `rig.media.asset_ref`.
- Maturity: prefer `stable`, then `draft`; emit `experimental` only when the task asks for it, and say which tier you used.

## SUDE and runtime ECS (live hosts)

`Setup()` once; `Update(dt)` each tick before Draw (`dt` in seconds), mutating the one app-owned registry; `Draw()` presents after Update; `Exit()` once before teardown. Empty bodies are fine. Do not nest hooks. No window, GPU, UI, filesystem, or audio required.

## Semantic versioning

One source: [`VERSION`](../../VERSION) ([docs/versioning.md](../../docs/versioning.md)); never copy the number elsewhere. Additive schema/field (0.x) bumps `MINOR`; breaking a `stable` schema after `1.0.0` bumps `MAJOR`. A schema change adds a row in [docs/history.md](../../docs/history.md). Root `"rig"` is the current `VERSION`, or an older version the document targets.

## Document shape

JSON on disk is `.rig`, or `.rigz` (ZIP: one `.rig` at the archive root plus `data/`). `data/` may hold more `.rig` files. [interchange](../../docs/interchange.md#package). Emit the envelope. A bare `entities` array is not a document.

| Root | Meaning |
|------|---------|
| `rig` | Contract SemVer |
| `document` | Optional metadata (`title`, `defaultUnit`, ...) |
| `entities` | `{ id, components }[]` |

- `id` is unique in the file. `components` keys are full schema ids.
- `entity` fields are a string id or `null`.
- `vec*` / `quat` are number arrays. **Quat order is x, y, z, w**, and rotation quaternions are unit length.
- Enums are kebab-case schema literals (`top-left`, `color-dodge`).
- Fields are lowerCamelCase and spelled out ([Field naming](../../schemas/README.md#field-naming)): `radiusX`, not `rx`.
- Measurements: ratios 0-1; scene lengths in `document.defaultUnit`; catalog facts are SI in the field name. [Measurements](../../schemas/README.md#measurements).
- Omit optional fields you did not measure. An absent `gate` means 1. An invented `gate` looks like data.
- Source of truth per schema: frontmatter in [`schemas/`](../../schemas/). Grammar is generated into [`schemas/json/`](../../schemas/json/) - never hand-edit generated JSON.
- `x.<vendor>.<name>` is a host extension the validator carries and reports. Do not emit it. If no `rig.*` id fits, say so. [Extension components](../../schemas/document.md#extension-components).

## Validate

Do not deliver unvalidated JSON.

```bash
npm run setup
node tools/rig-validate/cli.js path/to/doc.json
```

Fix the reported JSON Pointers and re-run until the CLI prints `ok`. `--strict` makes unknown ids errors and suggests the closest catalog ids. Semantic checks JSON Schema cannot express also run: paint spelling conflicts, parent cycles, duplicate `stableId`, non-unit quaternions, missing compositions, and cross-field ranges (ring radii, axis min/max, reversed date spans, knot and gradient-stop order). A semantic failure is a real failure.

## Before commit / push (CI precheck)

Do not push Contract changes until the GitHub Actions gate passes locally.

```bash
npm run setup    # once per clone / when validate deps change
npm run check    # the full local gate
```

Frontmatter/generator changes need `check:schemas` (stale: `npm run gen`, re-check); skill changes need `check:skill`; push/PR needs the full check. Hooks (`npm run hooks:install`) help locally, but CI re-runs everything server-side, including the release-tag match on master pushes and tag pushes - push releases with `git push --follow-tags`.

## Guards (all domains)

Component keys are full `rig.*` ids; PascalCase (`Transform`, `Shape`) is not a key. Sidecar bytes go in `data/` inside `.rigz`; `asset_ref.path` is relative to `data/`. No inline blobs or data URIs. Domain-specific guards live in the slices, next to the composition table that replaces them.
