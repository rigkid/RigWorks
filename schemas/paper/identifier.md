# `rig.paper.identifier`

Article identifiers of a science paper or preprint. Format when present.

Field meanings follow [JATS](https://jats.nlm.nih.gov/) `article-id` and Crossref work IDs. This schema is those identifiers — not a JATS XML file and not a book product.

| Field | Type | Meaning | Standard |
|-------|------|---------|----------|
| `doi` | string | Digital Object Identifier | ISO 26324; JATS `pub-id-type="doi"` |
| `pmid` | string | PubMed identifier, digits only | JATS `pmid` |
| `pmcid` | string | PubMed Central id (`PMC` + digits) | JATS `pmcid` |
| `arxiv` | string | arXiv id (`1706.03762` or `arXiv:1706.03762v1`) | arXiv |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Prefer `doi` when the source has one. Do not put ISBN here — that is [`rig.book.identifier`](../book/identifier.md). Journal ISSN lives on the journal entity, not on the article.

The article title is [`rig.meta.named`](../meta/named.md).
