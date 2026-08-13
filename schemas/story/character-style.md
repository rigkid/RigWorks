# `rig.story.character_style`

Named character style. Format when present.

The display name is [`rig.meta.named`](../meta/named.md) — do not re-declare `name` here. Identity only: no face, underline weight, colour, or local emphasis flags. A style named Bold is Bold because it is named that — a host maps the name at emit time.

Nested emphasis becomes a distinct style that `basedOn` the outer one.

| Field | Type | Meaning |
|-------|------|---------|
| `basedOn` | entity | Optional. Parent character style; absent / `null` = none |

Do not put bold/italic/underline/strike/position on this schema or on the [run](paragraph.md#run). That would be a second representation of the same meaning.

Based-on chains stay acyclic. A cycle is a document error.
