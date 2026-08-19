# `rig.rights.statement`

Copyright and licence of a work. Format when present.

Compose onto any entity that needs rights — an artwork, a book, a paper, a photo. Field meanings follow [Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) `rights` / `license` / `rightsHolder`, [Creative Commons](https://creativecommons.org/licenses/) licence URIs, and [RightsStatements.org](https://rightsstatements.org/).

| Field | Type | Meaning |
|-------|------|---------|
| `copyrightHolder` | entity | Person or organisation that holds copyright |
| `copyrightYear` | int | Copyright year of this object |
| `licence` | enum | `all-rights-reserved` / `public-domain` / `cc0` / `cc-by` / `cc-by-sa` / `cc-by-nd` / `cc-by-nc` / `cc-by-nc-sa` / `cc-by-nc-nd` / `other` |
| `licenceUri` | string | Canonical licence URL |
| `rightsStatementUri` | string | RightsStatements.org (or similar) URI |
| `creditLine` | string | Required credit / courtesy line |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

This is the rights record. [`rig.book.publication`](../book/publication.md) `copyrightYear` is the ONIX product year only — when you have a holder or a licence, compose this schema; do not copy the year into both.

CDWA Copyright/Restrictions maps here. Do not put a rights essay on [`rig.art.object`](../art/object.md).
