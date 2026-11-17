# Is it Rig?

Rig is a shared vocabulary - **Readable Independent Grammar**: the [schemas](../schemas/) (prose + [JSON Schema](../schemas/json/)) and portable **entity + POD component** documents ([`rig.document`](../schemas/document.md)). It is not a library to link into your app.

MUST, SHOULD, and MAY on this page are [requirement words](terms.md#requirement-words).

To be Rig, a project:

1. MUST emit entities with POD components keyed by schema ids (`rig.<domain>.<name>`).
2. MUST ship the schemas it supports - [ship what you support](../schemas/README.md).

That composition model is the floor. **No entity/component POD, no Rig.** A SUDE loop by itself is a loop convention, not a shared vocabulary.

Schemas and UI are optional beyond what you implement. [`rig-validate`](../tools/rig-validate/) checks emission against the machine grammar - including `rig.ui.*` when present.

### Live hosts

A **live host** (a program that runs work over time) SHOULD honor the [SUDE loop](sude.md) and runtime [ECS](ecs.md) conventions (registry, Update/Draw systems). **[RigKit](https://github.com/rigkid/RigKit)** takes SUDE + ECS as **its** floor - a host MUST honor them to be RigKit, not to be Rig. Validators, converters, and static presenters MAY be Rig without SUDE. See [ecs.md](ecs.md) for the split between document composition (Contract floor) and runtime systems (live hosts).

### Rig + UI (optional)

To be **Rig + UI**, a project MUST already be Rig, and its author/tool surfaces MUST edit the same entity POD through a host seam. They MUST NOT keep a second scene graph. Full checklist: [ui.md](ui.md). Omitting UI remains valid Rig. Layout chrome and UI packs are fulfillment - the document carries `rig.ui.*`.

## What you may omit

A project MAY omit any host, any [UI](ui.md), any pack, device drivers, render backends, SUDE (unless it is RigKit or another host that claims the loop), and every schema it does not implement.
You do not need a particular implementation to be Rig.

## Reference fulfillment

[RigKit](https://github.com/rigkid/RigKit) is the reference live host: a desktop fulfillment (GLFW / OpenGL / packs) that runs the SUDE loop, owns an ECS registry, and reads and writes the schemas it supports. Read it as one worked answer, not as the definition - see [terms.md](terms.md) for what "fulfillment" claims and does not claim.
