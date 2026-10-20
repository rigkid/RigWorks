# `rig.law.statute`

A statute or regulation. Format when present.

This schema is the instrument - not [`rig.paper.article`](../paper/article.md), not a case report, and not a legislative workflow.

| Field | Type | Meaning |
|-------|------|---------|
| `citation` | string | Citation as written (`42 U.S.C. § 1983`) |
| `status` | enum | `in-force` / `repealed` / `pending` |
| `jurisdiction` | string | Optional. Jurisdiction as written (same idea as [`rig.legal.agreement`](../legal/agreement.md) `governingLaw`) |

`citation` and `status` are required.

The title is [`rig.meta.named`](../meta/named.md). The text is [`rig.story.flow`](../story/flow.md) or a [`rig.media.asset_ref`](../media/asset-ref.md) `kind` `document` - not an unstructured blob here.
