---
id: "rig.person.employment"
maturity: "draft"
summary: "Employment of a human, character, user, or contact. Format when present."
topJson: "{\"description\":\"Employment. Job title / department follow ISO 20022 ContactDetails; organisation is an entity.\",\"minProperties\":1}"
fields:
  - name: "jobTitle"
    ref: "string"
    meaning: "Role title"
  - name: "responsibility"
    ref: "string"
    meaning: "What the role covers"
  - name: "department"
    ref: "string"
    meaning: "Organisation unit of the person"
  - name: "occupation"
    ref: "string"
    meaning: "Profession / occupation"
  - name: "employeeId"
    ref: "string"
    meaning: "Staff / payroll number"
  - name: "organisation"
    ref: "entity"
    meaning: "Employer entity"
  - name: "reportsTo"
    ref: "entity"
    meaning: "Manager / supervisor person"
  - name: "startDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "First day, YYYY-MM-DD"
  - name: "endDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date."
    meaning: "Last day, YYYY-MM-DD"
---
# `rig.person.employment`

Employment of a human, character, user, or contact. Format when present.

Job title, responsibility, and department follow those slots on ISO 20022 `ContactDetails`. The employer is an entity - not a second name string.

| Field | Type | Meaning | ISO 20022 |
|-------|------|---------|-----------|
| `jobTitle` | string | Role title | `JobTitl` |
| `responsibility` | string | What the role covers | `Rspnsblty` |
| `department` | string | Organisation unit of the person | `Dept` |
| `occupation` | string | Profession / occupation | - |
| `employeeId` | string | Staff / payroll number | - |
| `organisation` | entity | Employer entity | - |
| `reportsTo` | entity | Manager / supervisor person | - |
| `startDate` | string | First day, `YYYY-MM-DD` | ISO 8601 |
| `endDate` | string | Last day, `YYYY-MM-DD` | ISO 8601 |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid - attach at least one field.

Name the employer with [`rig.meta.named`](../meta/named.md) on the organisation entity. Legal identifiers are [`rig.organisation.identity`](../organisation/identity.md). A site address on that entity is [`rig.place.address`](../place/address.md). Do not put an organisation name string here.

`department` here is the person's unit. [`rig.place.address`](../place/address.md) `department` is an organisation unit *at a place*. They are different meanings - do not copy one into the other.

A portrait is [`rig.person.portrait`](portrait.md). Payroll account is [`rig.party.account`](../party/account.md).
