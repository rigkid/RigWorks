# JSON Schema

Machine-readable Rig POD and document grammar (JSON Schema draft 2020-12).

| File | Role |
|------|------|
| `_defs.schema.json` | Shared datatypes (`vec3`, `quat`, `entity`, ...) |
| `rig.document.schema.json` | Document envelope |
| `rig.*.schema.json` | One file per catalog schema id |

These files are **generated** - never hand-edit them. The source of truth is the YAML frontmatter in each prose schema under [`../`](../) (see [`../README.md`](../README.md#source-of-truth-and-maturity)). Regenerate component + document schemas and the catalog index ([`../index.json`](../index.json)):

```bash
node tools/gen-schemas.mjs
```

Validate documents:

```bash
cd tools/rig-validate && npm install && cd ../..
node tools/rig-validate/cli.js examples/minimal-scene.json
```

Prose field meaning stays in the sibling markdown under [`../`](../). Field-level parity (frontmatter vs generated JSON vs prose tables) is checked by:

```bash
node tools/check-schema-parity/check.mjs
```
