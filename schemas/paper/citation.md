# `rig.paper.citation`

One bibliographic citation: this work cites that work. Format when present.

Field meanings follow [CSL](https://citationstyles.org/) cite items and [ISO 690](https://www.iso.org/standard/72642.html) (the reference relationship, not a formatted footnote string).

| Field | Type | Meaning |
|-------|------|---------|
| `citing` | entity | The work that contains the reference |
| `cited` | entity | The work referred to (paper, book, or other named work) |
| `locator` | string | Optional. Page or section cited (`737`, `p. 12`) |

`citing` and `cited` are required.

Do not store a formatted bibliography string here. The cited work carries its own title, identifiers, and authors. A second citation is another entity.
