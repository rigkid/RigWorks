# Versioning

RigWorks uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`). **One source of truth:** [`VERSION`](../VERSION). Document envelopes carry the same value as the root `"rig"` field.

| Range | Meaning |
|-------|---------|
| **0.x.y** | Draft. Grammar floor (entity/component POD + schemas) holds. Live-host conventions (SUDE + runtime ECS) hold. Schemas may grow or tighten. |
| **1.0.0** | First stable release. Breaking schema or core-rule changes need a major bump. |

Until 1.0.0, prefer additive schema fields - and do **not** keep dual-field legacy aliases for renamed keys. Tag releases `v0.1.0`, `v0.2.0`, ... then `v1.0.0`.

When you bump `VERSION`, add a History row in [history.md](history.md) (release notes, not a second source of truth). Do not copy the number into README or elsewhere. `npm run check:version` checks SemVer + site badges; full CI is `npm run check` (pre-push after `npm run hooks:install`).

## Maturity tiers and the 1.0 freeze

Every schema carries a maturity tier (`stable` / `draft` / `experimental`) in its frontmatter, in [`schemas/index.json`](../schemas/index.json), and as `x-rig-maturity` in its JSON Schema - see [schemas/README.md](../schemas/README.md#source-of-truth-and-maturity). Tagging is enforced: a schema without frontmatter or a `stable` schema with no example fails `check:parity`; `rig-validate` notes `experimental` ids in emitted documents; the release tag (`tools/check-tag.mjs`) is required by the local pre-push hook and re-verified server-side by GitHub Actions on master and tag pushes. Tier evidence (worked example, host consumption) is measured by `tools/audit-maturity.mjs`.

The bump rules apply per tier: breaking a `stable` schema after 1.0.0 needs `MAJOR`; tightening a `draft` schema is a `MINOR` with a History note; `experimental` schemas may change in any minor. **1.0.0 freezes the `stable` tier**, not the whole catalog. The additive-validity promise in each History row is scoped to `stable` and `draft` documents, and is tested by the frozen corpus in `tools/test/fixtures/compat/` (`tools/test/compat.test.mjs`), not just asserted.


## History

Release notes moved to [history.md](history.md) so this file stays the short rulebook.
