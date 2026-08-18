# `rig.book.identifier`

Product identifiers of a book (or other ONIX product). Format when present.

ISBN meaning follows [ISO 2108](https://www.iso.org/standard/65483.html). Other slots follow ONIX for Books `ProductIdentifier`. This schema is those identifiers — not an ONIX message and not a title.

| Field | Type | Meaning | Standard |
|-------|------|---------|----------|
| `isbn13` | string | 13 digits, no hyphens or spaces | ISO 2108; ONIX `ProductIDType` `15` |
| `isbn10` | string | 9 digits plus check digit or `X` | ISO 2108 (legacy); ONIX `ProductIDType` `02` |
| `doi` | string | Digital Object Identifier | ONIX `ProductIDType` `06` |
| `issn` | string | `NNNN-NNNC` | ISO 3297 ISSN |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Prefer `isbn13` when the source has one. The importer strips hyphens. Do not invent `isbn10` by converting `isbn13`, and do not store a GTIN-13 that is the same ISBN under a second key.

The distinctive title is [`rig.meta.named`](../meta/named.md). Subtitle and edition are [`rig.book.title`](title.md).
