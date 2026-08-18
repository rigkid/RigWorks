# `rig.book.publication`

Publishing detail of a book product. Format when present.

Field meanings follow ONIX for Books `PublishingDetail` and `Language`. This schema is those publishing elements — not an ONIX message.

| Field | Type | Meaning | ONIX |
|-------|------|---------|------|
| `publisher` | entity | Publisher organisation | `Publisher` |
| `publishedDate` | string | Publication day or year (`YYYY` / `YYYY-MM` / `YYYY-MM-DD`) | `PublishingDate` |
| `language` | string | ISO 639-1 or 639-2/T, lowercase | `Language` |
| `pageCount` | uint | Extent in pages | `Extent` (pages) |
| `productForm` | enum | `hardcover` / `paperback` / `ebook` / `audiobook` / `other` | `ProductForm` (`BB` / `BC` / `ED` / `AJ` / …) |
| `cityOfPublication` | string | City as printed | `CityOfPublication` |
| `copyrightYear` | int | Copyright year of this product | copyright year |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Name the publisher with [`rig.meta.named`](../meta/named.md) on that entity. Legal identifiers are [`rig.organisation.identity`](../organisation/identity.md). Do not put a publisher name string here.

An ebook or PDF file is [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `document`) on a related entity — not a path on this schema. Holder, licence, and credit line are [`rig.rights.statement`](../rights/statement.md). `copyrightYear` here is the ONIX product year only — do not copy it onto the rights record.
