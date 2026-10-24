# Books, papers, art

Load for: books and ISBNs, journal articles and citations, artworks. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/book-isbn.json`](../../../examples/book-isbn.json), [`examples/paper-citation.json`](../../../examples/paper-citation.json), [`examples/art-object.json`](../../../examples/art-object.json).

## Compose

| Want | Compose |
|---|---|
| A book's identifier | `rig.book.identifier` (`isbn13` digits only) |
| The book's title | `rig.meta.named` for the display title; extra title elements (subtitle, original title, edition) are `rig.book.title` |
| Author / contributor | An entity with `rig.book.contribution`; publisher is `rig.book.publication` (publisher is an entity) |
| A cover | `rig.book.cover` + `rig.media.asset_ref` |
| Subjects | `rig.book.subject` |
| A paper | `rig.paper.article` in a `rig.paper.issue`; its ids are `rig.paper.identifier` (DOI/PMID/arXiv); the journal's ISSN stays on the journal entity |
| A citation | `rig.paper.citation` (`citing` / `cited` entities) - never a formatted bibliography string |
| An artwork | `rig.art.object`; maker is `rig.art.attribution`, medium `rig.art.material`, size `rig.art.dimensions` (millimetres), creation `rig.art.creation`, place `rig.art.location`, subject `rig.art.subject`, image `rig.art.image` + asset_ref |
| Copyright holder / licence | `rig.rights.statement` (see [commerce-records.md](commerce-records.md)) |

## Guards

- No price on a book or art schema; a price is `rig.commerce.price` on an offer for it.
- The title is not a schema field to re-declare: `rig.book.title` holds only the *extra* ONIX title elements, and the display title is `rig.meta.named`.

## Ids in this slice

`rig.book.identifier`, `rig.book.title`, `rig.book.publication`, `rig.book.contribution`, `rig.book.cover`, `rig.book.subject`, `rig.paper.identifier`, `rig.paper.article`, `rig.paper.issue`, `rig.paper.citation`, `rig.art.object`, `rig.art.creation`, `rig.art.attribution`, `rig.art.dimensions`, `rig.art.material`, `rig.art.location`, `rig.art.subject`, `rig.art.image`
