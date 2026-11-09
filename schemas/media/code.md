---
id: "rig.media.code"
maturity: "stable"
summary: "**Editable source buffer.** A text document the app owns; editors edit it in place. Format when present."
fields:
  - name: "text"
    ref: "string"
    required: true
    meaning: "Buffer content - the source of truth, not a cache of a file"
  - name: "language"
    ref: "string"
    meaning: "Optional. Lowercase grammar id (gcode, svg, python, fea); absent or empty = plain text"
    absent: "or empty = plain text"
  - name: "readOnly"
    ref: "bool"
    meaning: "Optional. Edit lock hint; absent = false"
    absent: "false"
---
# `rig.media.code`

**Editable source buffer.** A text document the app owns; editors edit it in place. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the label, and [`rig.media.asset_ref`](asset-ref.md) on the same entity when the buffer has an on-disk origin or export target.

| Field | Type | Meaning |
|-------|------|---------|
| `text` | string | Buffer content - the source of truth, not a cache of a file |
| `language` | string | Optional. Lowercase grammar id (`gcode`, `svg`, `python`, `fea`); absent or empty = plain text |
| `readOnly` | bool | Optional. Edit lock hint; absent = false |

Distinct from [`rig.media.text`](text.md) (positioned canvas run) and [`rig.story.flow`](../story/flow.md) (semantic editorial copy).

Editor state - caret, selection, undo history, modified flags, reload counters - stays in the host.

## Data grammars (text data)

`language` names any grammar, not only programming languages: `markdown`, `html`, `csv`, `xml`, `kdl`, `svg`, or a host grammar id. This component is the catalog's text-data carrier - there is no separate `text_data` component, because the shape (text + grammar id + edit lock) is the same whether an editor presents it as code or as data. A host that understands the grammar parses it; parsing and everything derived from it are fulfillment. A host that does not still preserves and may display the text. Grammars a second host must parse identically belong in a mapping doc (the way [blender.md](../../docs/blender.md) maps a format), not in this field's examples.

## Source or compiled - one truth

Text is either the artifact or an authoring surface. Pick per entity, and say which when both travel:

- **Source of truth.** The text *is* the work (a script, an SVG drawing, a Markdown chapter a layout host has not composed yet). Anything a host parses out of it is host cache - do not serialise the parse beside the buffer as a second, competing truth.
- **Authoring surface.** The artist edits text; the host compiles it to ordinary POD (the evaluated-scene bargain in [blender.md](../../docs/blender.md)). The POD travels; the text stays home, or travels as provenance with an explicit precedence.

The Relay layout host is the worked pattern for provenance: ingest composes this buffer (`language` `markdown` / `html` / `csv`) and a [`rig.media.asset_ref`](asset-ref.md) (`kind` `document`) on the story's source entity, then compiles [`rig.story.flow`](../story/flow.md). After ingest the composed POD is the editable truth (after-touch edits do not rewrite the source text); the buffer is re-parsed only on an explicit re-ingest or rebuild, the same way a CSV register source rebuilds its pages. Example: [`examples/story-source.json`](../../examples/story-source.json).

Never smuggle a second scene graph inside text and expect other hosts to parse portable meaning out of it. If the meaning must port, emit the components; if the text itself is the meaning, this component is its home.

## Size

Inline text suits source-sized payloads (scripts, chapters, registers, markup). A payload that is bulk data rather than source - a baked mesh as XML, a million-row register - is a file: put it in `.rigz` `data/` and point [`rig.media.asset_ref`](asset-ref.md) at it. Do not inline blobs or data URIs.
