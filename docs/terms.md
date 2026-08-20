# Terms

Rig prose leans on a few words in a precise way. This page is the reference.

## The name

**RigWorks** is the project. **Rig** is the spoken name in running text. The expansion is **Readable Independent Grammar** — once per surface, then say Rig.

## Contract and fulfillment

| Term | Meaning |
|------|---------|
| **Contract** | The concept. Grammar (schema ids, field names, units, [datatypes](properties.md)) and entity/component [POD composition](ecs.md). Portable. Versioned. Written down, never compiled. [SUDE](sude.md) and runtime ECS systems are live-host conventions in the same Contract, not the floor for every Rig speaker. |
| **Fulfillment** | The execution. Any code that honors the Contract — a host, a pack, a renderer, a UI. Replaceable. |

Everything in this repository is Contract. Nothing in this repository is fulfillment.

When a document says a detail is "fulfillment, not Contract", it means: implement it however you like, and do not expect other hosts to match you. When it says "Contract-facing", it means the field or seam is portable, so keep host types out of it.

## Roles

| Term | Meaning |
|------|---------|
| **Host** | A live program that loads documents, typically runs the [SUDE](sude.md) loop, and owns the registry, clock, and windowing. [RigKit](https://github.com/rigkid/RigKit) is the reference host. |
| **Live host** | A host that runs creative work over time. Honors SUDE + runtime ECS conventions in addition to the grammar floor. |
| **Pack** | An optional module a host loads to add capability — a UI pack, a device pack, a render backend. Packs are fulfillment; they interoperate through shared schema ids, not through a shared API. |
| **App** | The piece being authored. Owns its entities. Runs inside a host. |
| **Document** | A [`rig.document`](../schemas/document.md) JSON payload — entities and their components, on the wire. On disk: `.rig`, or `.rigz` when a `data/` folder of sidecar files travels with it. |

## Data words

| Term | Meaning |
|------|---------|
| **POD** | Plain old data. Numbers, small structs, strings, entity ids. No pointers, handles, callbacks, or toolkit types. |
| **Entity** | An id that owns a set of components. Carries no behavior. |
| **Component** | A named POD payload attached to an entity, keyed by schema id (`rig.spatial.transform`). |
| **Schema id** | The stable name of a component layout: `rig.<domain>.<name>`. The unit of interoperability — two hosts that speak the same id share fields and units. |
| **Portable** | Meaning survives leaving your process. Portable fields get serialized; everything else stays in the host. |
| **Host cache** | A value a host derives and may keep, but must not serialize — world matrices, Euler angles, polygon winding from vertex order, an LFO's last sample, hover state. |

## Reading the rules

"Is it Rig?" is answered in [honors.md](honors.md): entity/component POD documents against schemas you support. Schemas are opt-in — [ship what you support](../schemas/README.md). Live hosts also honor [SUDE](sude.md). **Rig + UI** is an optional layer in the same Contract ([ui.md](ui.md)) — not a separate named spec.
