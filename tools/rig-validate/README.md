# rigkit

Scaffold and validate Rig documents. JSON is the wire format. On disk that is `.rig`, or `.rigz` (a ZIP of one root `.rig` plus a `data/` folder; `data/` may contain further `.rig` files) - [interchange](../../docs/interchange.md#package).

```bash
npx rigkit init my-scene
npx rigkit validate my-scene/scene.rig
```

From a RigWorks checkout:

```bash
npm run setup
node tools/rig-validate/cli.js init my-scene
node tools/rig-validate/cli.js examples/minimal-scene.json
node tools/rig-validate/cli.js --strict path/to/doc.json
```

`init` writes `my-scene/scene.rig` from [`examples/minimal-scene.json`](../../examples/minimal-scene.json) and refuses to overwrite. Bare file arguments still mean validate, so existing scripts keep working.

## What validate checks

| Check | Level |
|-------|-------|
| Document envelope against [`rig.document`](../../schemas/document.md) | error |
| Each component against its schema id | error |
| Duplicate entity ids | error |
| `entity`-typed fields pointing at ids that do not exist (`null` means none) | error |
| Unknown schema ids (with the closest catalog ids suggested) | warn, or error with `--strict` |
| Document targets a version newer than [`VERSION`](../../VERSION) | warn |
| `.rigz` missing a root `.rig` (or wrapping the package in a folder) | error |
| `.rigz` missing a `data/` folder | warn |

Semantic checks (rules the prose states but JSON Schema cannot express):

| Check | Level |
|-------|-------|
| Inline and referenced paint for the same slot (`rig.paint.fill` + `fill_stroke.fillRgba`, or stroke equivalents) | error |
| Parent cycle in `rig.spatial.relationship` | error |
| Duplicate non-empty `stableId` | error |
| Non-unit `rig.spatial.transform` rotation quaternion | error |
| Missing required composition (`rig.sensor.depth` / `rig.vr.eye` without `rig.spatial.camera`; `rig.sensor.gnss` without `rig.place.geo`) | error |

Each fault is reported once (the envelope and per-component passes are deduplicated). Failures report a JSON Pointer path. Exit `1` if any error; warnings alone exit `0`.

Maturity tiers are surfaced, not enforced as failures: a document using an `experimental` schema id gets one `[note]` per id (`experimental schema id "..." - may change in any minor release`), including under `--strict`. Notes never change the verdict.

The packaged schema copy in `schemas/` next to this CLI is refreshed from `schemas/json/` by `pack.mjs` at pack time (it is gitignored, so there is no stale committed copy), so standalone use validates against the full catalog.

## Repository checks

```bash
npm run check          # all of the below
npm run check:schemas  # generated outputs match schema frontmatter
npm run check:parity   # frontmatter <-> JSON Schema <-> prose fields
npm run check:links    # relative links in all markdown resolve
npm run check:examples # reference documents validate in --strict mode
npm run check:skill    # skill router/slice budgets + schema-id coverage
```

Regenerate the machine grammar after editing schema frontmatter in [`schemas/`](../../schemas/):

```bash
npm run gen
```
