# AGENTS

RigWorks (Rig for short) is a no-code creative application framework — a shared data vocabulary for creative applications. Apps and packs that speak the same schema ids interoperate. It is not a library to link and not another editor; speakers emit/consume entity/component POD JSON. Live hosts also honor SUDE and runtime ECS.

## Before generating Rig data

1. Read [`skills/generating-rig-documents/SKILL.md`](skills/generating-rig-documents/SKILL.md).
2. Copy patterns from [`examples/`](examples/).
3. Validate every document you produce:

```bash
npm run setup
node tools/rig-validate/cli.js path/to/doc.json
```

Do not deliver unvalidated output.

## Before push

Run the CI precheck — same as GitHub Actions — before pushing Contract changes:

```bash
npm run setup
npm run check
```

Details: [`skills/generating-rig-documents/SKILL.md`](skills/generating-rig-documents/SKILL.md#before-commit--push-ci-precheck). Install hooks with `npm run hooks:install` (pre-commit = SemVer; pre-push = full `npm run check`).

## Key paths

| Path | Role |
|------|------|
| [`skills/generating-rig-documents/SKILL.md`](skills/generating-rig-documents/SKILL.md) | Condensed AI-facing rules + examples |
| [`schemas/json/`](schemas/json/) | JSON Schema grammar |
| [`schemas/`](schemas/) | Prose field meaning |
| [`examples/`](examples/) | Reference documents |
| [`docs/interchange.md`](docs/interchange.md) | Wire format + RigKit key aliases |
| [`docs/terms.md`](docs/terms.md) | Contract vs fulfillment, host, pack, POD |
| [`docs/versioning.md`](docs/versioning.md) | SemVer ranges + history (`VERSION`) |
| [`tools/rig-validate/`](tools/rig-validate/) | Validator CLI |

Discovery index for generic LLM tooling: [`llms.txt`](llms.txt).

Reference host: [RigKit](https://github.com/rigkid/RigKit). In-repo SVG fulfillment: [`tools/render-svg.mjs`](tools/render-svg.mjs).

## Host-specific AI guidance lives with the host

This repo holds the portable rules (grammar, entity/component POD, SUDE for live hosts, UI, Terms, property datatypes, schema shapes) — true for any Rig fulfillment, not just one host. Skills or rules about a specific host's packs, pillar mapping, target ladder, UI chrome, or build habits belong in that host's own repo.
