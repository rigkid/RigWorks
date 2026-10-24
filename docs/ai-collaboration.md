# AI co-coding

**AI co-coding is here to stay.** Not as a prediction to argue about - as a design constraint we address.

[Design philosophy](design-philosophy.md) states the tablet and [why no code](why-no-code.md) makes the anti-library argument. This page covers the consequence for model-authored work: when execution becomes cheap to generate, agreement becomes the scarce asset.

## What changes?

If a model can write a renderer, a parser, or an inspector in an afternoon, implementations stop being the scarce thing. What stays scarce is agreement: what a rectangle is, which units a transform uses, and whether rotation is a quaternion or three angles.

That inverts the usual priority. A generated renderer is useful and disposable. A generated *vocabulary* is a liability, because the next session may invent a different one. Rig publishes the vocabulary once, in a form people and models read the same way.

## The cheapest token

The cheapest token is the one the model never generates.

The Contract is paid once. A later session spells `rig.spatial.transform` the same way, quaternion order included. Load the skill and one example. Leave the catalog on disk. The model writes the document and stops. The host that draws it is a fulfillment, written when someone needs it.

The finished document is both output and artifact. A document one agent emits is data the next agent already accepts, so neither side spends a context window explaining a private format and neither writes a converter. The tokens that format would have cost on every exchange after the first are never generated.

## Why a vocabulary beats a prompt

| | A prompt | A schema id |
|--|----------|-------------|
| Output | Something plausible | `rig.spatial.transform`, spelled the same way |
| Across sessions | Drifts | Stable |
| Across models and vendors | Drifts | Stable |
| Across two different apps | Incompatible | Interoperable |
| Verifiable | By reading it | By running a validator |

Two agents working in two unrelated applications converge on compatible data - not because they coordinated, but because they read the same catalog. That convergence is the product.

Rig is not another editor, patcher, or agentic design canvas. Those are fulfillments. Rig is the shared vocabulary their documents could have in common.

## The closed loop

Generation without verification is a guess. The loop is what makes AI-authored Rig trustworthy:

```text
read the skill, copy a reference example, emit JSON, validate, fix at the reported path, repeat until ok
```

```bash
node tools/rig-validate/cli.js path/to/doc.json
```

Every failure names a JSON Pointer, so a model can correct itself without a human interpreting the error. `--strict` turns invented schema ids into failures, and the validator suggests the closest catalog ids. That is the check worth running when you suspect confident guessing.

Never deliver an unvalidated document. Eyeballing JSON is exactly the review that looks fine and is wrong.

Start from [`llms.txt`](../llms.txt) for discovery and load [`skills/generating-rig-documents/SKILL.md`](../skills/generating-rig-documents/SKILL.md) before generating. Schema prose carries meaning and units; generated JSON Schema carries the machine-checkable grammar. Keeping those in parity matters because models read the prose while tools enforce the grammar.

## Why "co-"

The division of labour is the same one the Contract already draws.

**People own the concept:** which ids exist, what they mean, which units they carry, what stays portable, and when a second host justifies a new schema.

**Models are good at the instance:** emitting documents against that concept, copying established patterns, fixing a reported field, and writing or porting a fulfillment when one is needed.

Spend human review on ids, units, and portable-versus-host boundaries. Let the validator catch field-by-field drift.
