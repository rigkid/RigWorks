# `rig.paper.article`

Article-level metadata. Format when present.

Field meanings follow JATS `article-meta`. This schema is the article — not the journal issue and not a trade blurb.

| Field | Type | Meaning | JATS |
|-------|------|---------|------|
| `abstract` | string | Abstract | `abstract` |
| `pageStart` | string | First page (`737`, `e123`) | `fpage` |
| `pageEnd` | string | Last page | `lpage` |
| `articleNumber` | string | Article / elocation id | `elocation-id` |
| `publishedDate` | string | Publication day or year (`YYYY` / `YYYY-MM` / `YYYY-MM-DD`) | `pub-date` |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

The title is [`rig.meta.named`](../meta/named.md). Authors are [`rig.book.contribution`](../book/contribution.md) (`work` is this article). Volume and issue are [`rig.paper.issue`](issue.md). A PDF is [`rig.media.asset_ref`](../media/asset-ref.md) `kind` `document`.
