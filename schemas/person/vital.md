---
id: "rig.person.vital"
maturity: "draft"
summary: "Sex, gender identity, and birth of a human, character, user, or contact. Format when present."
topJson: "{\"description\":\"Sex, gender identity, and birth. Sex follows ISO/IEC 5218; gender is self-described; birth follows ISO 20022 DateAndPlaceOfBirth.\",\"minProperties\":1}"
fields:
  - name: "sex"
    type: "string"
    enum: ["unknown","male","female","not-applicable"]
    meaning: "Recorded sex: unknown / male / female / not-applicable"
  - name: "gender"
    ref: "string"
    meaning: "Self-described gender identity"
  - name: "birthDate"
    type: "string"
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    description: "ISO 8601 calendar date (ISO 20022 BirthDt)."
    meaning: "Calendar day, YYYY-MM-DD"
  - name: "birthTown"
    ref: "string"
    meaning: "Town / city of birth"
  - name: "birthCountrySubDivision"
    ref: "string"
    meaning: "State / province of birth"
  - name: "birthCountry"
    type: "string"
    pattern: "^[A-Z]{2}$"
    description: "ISO 3166-1 alpha-2 (ISO 20022 CtryOfBirth)."
    meaning: "ISO 3166-1 alpha-2, uppercase"
  - name: "nationality"
    type: "string"
    pattern: "^[A-Z]{2}$"
    description: "ISO 3166-1 alpha-2 (ISO 20022 Ntlty)."
    meaning: "ISO 3166-1 alpha-2, uppercase"
  - name: "countryOfResidence"
    type: "string"
    pattern: "^[A-Z]{2}$"
    description: "ISO 3166-1 alpha-2 (ISO 20022 CtryOfRes)."
    meaning: "ISO 3166-1 alpha-2, uppercase"
---
# `rig.person.vital`

Sex, gender identity, and birth of a human, character, user, or contact. Format when present.

Recorded sex follows [ISO/IEC 5218](https://www.iso.org/standard/36266.html). Gender identity is a separate self-described string - not an ISO 5218 code. Birth and nationality fields follow ISO 20022 `DateAndPlaceOfBirth` / party residence.

| Field | Type | Meaning | Standard |
|-------|------|---------|----------|
| `sex` | enum | Recorded sex: `unknown` / `male` / `female` / `not-applicable` | ISO/IEC 5218 `0` / `1` / `2` / `9` |
| `gender` | string | Self-described gender identity | - |
| `birthDate` | string | Calendar day, `YYYY-MM-DD` | ISO 8601; ISO 20022 `BirthDt` |
| `birthTown` | string | Town / city of birth | ISO 20022 `CityOfBirth` |
| `birthCountrySubDivision` | string | State / province of birth | ISO 20022 `PrvcOfBirth` |
| `birthCountry` | string | ISO 3166-1 alpha-2, uppercase | ISO 20022 `CtryOfBirth` |
| `nationality` | string | ISO 3166-1 alpha-2, uppercase | ISO 20022 `Ntlty` |
| `countryOfResidence` | string | ISO 3166-1 alpha-2, uppercase | ISO 20022 `CtryOfRes` |

All fields optional. Emit what the source has; omit empty strings. An empty component is invalid - attach at least one field.

`sex` and `gender` are different meanings. Do not copy one into the other. ISO 20022 `GenderCode` (`MALE` / `FEMALE`) maps onto `sex`, not `gender`.

Name parts are [`rig.person.name`](name.md). Do not re-declare those here.
