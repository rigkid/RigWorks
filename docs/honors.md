# Is it Rig?

Rig is a shared vocabulary — **Readable Independent Grammar**: the [schema](../schemas/) catalog (prose + [JSON Schema](../schemas/json/)) and portable **entity + POD component** documents ([`rig.document`](../schemas/document.md)). It is not a library to link into your app.

A project **is Rig** when:

1. It speaks portable meaning as entities with POD components keyed by schema ids (`rig.<domain>.<name>`).
2. It ships the schemas it supports — [ship what you support](../schemas/README.md).

That composition model is the floor. **No entity/component POD, no Rig.** A SUDE loop by itself is a loop convention, not a shared vocabulary.

Schemas and UI are optional beyond what you implement. [`rig-validate`](../tools/rig-validate/) checks emission against the machine grammar — including `rig.ui.*` when present.

### Live hosts

A **live host** (a program that runs creative work over time) typically honors the [SUDE loop](sude.md) and runtime [ECS](ecs.md) conventions (registry, Update/Draw systems). **[RigKit](https://github.com/rigkid/RigKit)** takes SUDE + ECS as **its** floor — required to be RigKit, not required to be Rig. Validators, converters, and static presenters can be Rig without SUDE. See [ecs.md](ecs.md) for the split between document composition (Contract floor) and runtime systems (live hosts).

### Rig + UI (optional)

A project is **Rig + UI** when it already **is Rig** and author/tool surfaces edit the same entity POD through a host seam (not a second scene graph). Full checklist: [ui.md](ui.md). Omitting UI remains valid Rig. Layout chrome and UI packs are fulfillment — portable meaning is `rig.ui.*` in the document.

## What you may omit

Any host, any [UI](ui.md), any pack, device drivers, render backends, SUDE (unless you are RigKit or another host that claims the loop), and every schema you do not implement.
You do not need a particular implementation to be Rig.

## Reference fulfillment

[RigKit](https://github.com/rigkid/RigKit) is the reference live host: a desktop fulfillment (GLFW / OpenGL / packs) that runs the SUDE loop, owns an ECS registry, and reads and writes the schemas it supports. Read it as one worked answer, not as the definition — see [terms.md](terms.md) for what "fulfillment" claims and does not claim.
