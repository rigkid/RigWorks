# Design philosophy

Rig is a **future-proof**, **host-independent**, **human-readable** vocabulary for creative work. The framework ships no code — [why no code](why-no-code.md) — because agreement outlives every fulfillment that honors it.

**Rig** — Readable Independent Grammar.

| Letter | Meaning |
|--------|---------|
| **Readable** | Human readable and human editable |
| **Independent** | Of host, runtime, language, and platform |
| **Grammar** | The schemas — field names, units, ids — and the wire shape that carries them: entities with POD components |

## Principles

1. **Human readable and human editable.** A document is plain data. Open the file, change a number, save it.
2. **Host / application independent.** Portable meaning lives in the [Contract](terms.md). Independent of host, runtime, language, and platform — [fulfillments](terms.md) come and go. Two hosts that never met can exchange work if they speak the same schema ids.
3. **One concept, one home.** Prefer composition over duplication — [`rig.meta.named`](../schemas/meta/named.md), [`rig.spatial.anchor`](../schemas/spatial/anchor.md), [`rig.render.visibility`](../schemas/render/visibility.md), [`rig.render.blend`](../schemas/render/blend.md) — not the same idea re-declared on every domain schema. The grammar is the schema catalog plus entity/component composition on the wire ([`rig.document`](../schemas/document.md)).

**Future-proof** means concept over execution: what a transform *is* outlives every renderer that draws one.

## Private data

Portable fields use `rig.<domain>.<name>`. Host-only meaning uses `x.<vendor>.<name>` — see [extension components](../schemas/document.md#extension-components). Do not mirror a Contract component under `x.*` to add one field.

## Ship what you support

A host that implements six schemas and ignores the rest is still Rig. Grow the catalog when a second host needs the same meaning — not before.

## Encoding

The portable wire is **JSON** ([`rig.document`](../schemas/document.md), [interchange](interchange.md)). Other on-disk encodings are host mappings at the boundary.

## Next

[why-no-code.md](why-no-code.md) — anti-library argument and honest price · [terms.md](terms.md) — Contract, fulfillment, host, pack · [honors.md](honors.md) — the minimum bar
