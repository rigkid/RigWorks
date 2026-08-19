# ECS conventions

Entity–component composition is how Rig portable meaning is shaped. No particular registry library. No GPU or UI toolkit types inside Contract-facing components.

Two layers share the name “ECS”:

| Layer | Where | Floor? |
|-------|--------|--------|
| **Document composition** | Entities with POD components keyed by schema ids ([`rig.document`](../schemas/document.md)) | Yes — [honors.md](honors.md) |
| **Runtime systems** | Registry, Update/Draw phases, host systems over those components | Live hosts only — with [SUDE](sude.md) |

## Why ECS

We use entity–component composition because we build for change. Composition over inheritance. Portable fields stay reusable across hosts and packs. That wire shape is what makes the vocabulary powerful — not a requirement to link an ECS library.

## Document composition (Contract floor)

- Portable meaning is **POD / plain data** (numbers, small structs, strings, entity ids).
- No window pointers, GPU handles, UI toolkit types, or behavior callbacks in Contract-facing components.
- No dirty flags, pending queues, or ephemeral edge state (hover/press) in portable components — those stay in the host and are not serialized.
- One type per field. Host-only resources may exist keyed by opaque ids; they are not Rig portable meaning.
- Creative layouts live under [`../schemas/`](../schemas/) — formats when present. Compose [`meta.named`](../schemas/meta/named.md) for labels; [`media.asset_ref`](../schemas/media/asset-ref.md) for paths.
- Editor-visible fields use portable [property datatypes](properties.md).
- On the wire, do not invent a second scene graph beside entities and components.

> **Schema alignment matters more than identical registry libraries.**

## Runtime (live hosts)

### Registry

- The **app** owns the logical registry (scene / document).
- The host must not require a second hidden registry for app entities.
- Registry implementation is host-specific.

### Systems and phases

| Phase | When | Intent |
|-------|------|--------|
| Simulation | during `Update(dt)` | Mutate state |
| Present | during `Draw()` | Read mostly; present |

Light hosts may run only simulation.

Cross-entity wires (`rig.mod.binding`, `rig.anim.tween` → property, orbit → camera)
belong in **Update systems**, not free ticks after import. UI controls are views over
the same property addressing — never a second store.

## Hierarchy (optional shape)

When you have a scene graph:

- Parent / child as entity ids
- Local transform: position (vec3), rotation (quat), scale (vec3)
- Optional locator / scene root: [`rig.spatial.vertex`](../schemas/spatial/vertex.md) (an unparented vertex is a scene)
- Optional anchor: which point of local bounds that pose attaches to ([`rig.spatial.anchor`](../schemas/spatial/anchor.md))
- World matrix as a cache written by a transform system

Exact type names are host-specific. See [schemas/spatial/transform.md](../schemas/spatial/transform.md).

## Light / Embedded hosts

Document tools are Rig when they speak entity/component POD against schemas they support. Live hosts add SUDE + these runtime rules.

See [honors.md](honors.md). UI is separate — [ui.md](ui.md).
