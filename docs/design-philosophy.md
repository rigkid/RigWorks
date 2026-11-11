# Design philosophy

Rig is a **future-proof**, **host-independent**, **human-readable** vocabulary for real work.

**Rig** - Readable Independent Grammar.

| Letter | Meaning |
|--------|---------|
| **Readable** | Human readable and human editable |
| **Independent** | Of host, runtime, language, and platform |
| **Grammar** | The schemas - field names, units, ids - and the wire shape that carries them: entities with POD components |

This page is the tablet. It states what Rig optimises for and where its boundaries sit. [Why no code](why-no-code.md) argues for agreement instead of a library and names the cost. [AI co-coding](ai-collaboration.md) follows one consequence: when execution becomes cheap to generate, shared concepts become more valuable, not less.

## What the claims mean

| Claim | Meaning |
|-------|---------|
| **Future-proof** | Concepts, field names, and units outlive the renderers, runtimes, and languages that execute them. |
| **Host-independent** | Two hosts that never met can exchange work when they speak the same schema ids. Neither links the other's code. |
| **Human-readable** | A document is plain data. Open the file, change a number, save it, and load it somewhere else. |

## Principles

1. **One concept, one home.** Prefer composition over duplication - [`rig.meta.named`](../schemas/meta/named.md), [`rig.spatial.anchor`](../schemas/spatial/anchor.md), [`rig.render.visibility`](../schemas/render/visibility.md), [`rig.render.blend`](../schemas/render/blend.md) - not the same idea re-declared on every domain schema. The grammar is the schemas plus entity/component composition on the wire ([`rig.document`](../schemas/document.md)).
2. **Concept over execution.** The [Contract](terms.md) says what a transform *is* and which units it uses. A [fulfillment](terms.md) decides how to draw, play, print, or otherwise execute it this year, on this hardware.
3. **Ship what you support.** A host that implements six schemas and ignores the rest is still Rig. Add a schema when a second host needs the same meaning - not before.
4. **Portable meaning, private execution.** Portable fields use `rig.<domain>.<name>`. Host-only meaning uses `x.<vendor>.<name>` - see [extension components](../schemas/document.md#extension-components). Do not mirror a Contract component under `x.*` to add one field. Derived values and live state stay [host cache](terms.md), not document data.
5. **The document is the evaluated picture.** When a source tool stacks up work - modifiers, node trees, composition layers, drivers - the evaluation stays in the source file and the document carries the result. Changing the stack means evaluating the source again, not editing the document into a second source. See [usd.md](usd.md) and [blender.md](blender.md).
6. **Text is data when text is the artifact.** Scripts, markup, chapters, and registers travel as [`rig.media.code`](../schemas/media/code.md) - text plus a grammar id - not as a private file format beside the document. What a host parses out of the text is cache, or compiled POD with a stated order of truth; the same meaning never travels twice in two competing spellings.

## Encoding

The portable wire is **JSON** ([`rig.document`](../schemas/document.md), [interchange](interchange.md)). On disk that JSON is a `.rig` file, or a `.rigz` ZIP when sidecar files travel in `data/`. Other on-disk encodings (OpenBIM, UFO, IDML, SVG, Spine, OpenUSD, Blender) are host mappings at the boundary. JSON is the wire because every host already has a parser for it - a different surface syntax earns its place as a boundary mapping with a lossless converter, not by replacing the envelope.

## Next

[why-no-code.md](why-no-code.md) - the anti-library argument and honest price · [ai-collaboration.md](ai-collaboration.md) - why shared concepts matter when models write execution · [terms.md](terms.md) - Contract, fulfillment, host, pack · [honors.md](honors.md) - the minimum bar
