# People, places, calendar, plants

Load for: persons, addresses, contacts, employment, calendar events, plants. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/person-contact.json`](../../../examples/person-contact.json), [`examples/place-address.json`](../../../examples/place-address.json), [`examples/calendar-event.json`](../../../examples/calendar-event.json), [`examples/plant-taxon.json`](../../../examples/plant-taxon.json).

## Compose

| Want | Compose |
|---|---|
| A person's name | `rig.person.name` (given/family); the formatted full name is `rig.meta.named.name` |
| Sex, birthday | `rig.person.vital` (recorded sex is ISO/IEC 5218; do not copy `sex` into `gender`) |
| Email / phone | `rig.person.contact` |
| Job, department, employer | `rig.person.employment` (employer is an entity) |
| Issued ids (MRN, tax, passport) | `rig.person.identifier` - named fields, not a `system`+`value` bag |
| A photo | `rig.person.portrait` + `rig.media.asset_ref` |
| An organisation | `rig.organisation.identity`; a bank account (IBAN/BIC) is `rig.party.account` |
| Postal / civic address | `rig.place.address`; WGS84 position is `rig.place.geo` - neither is a transform, neither is a person field |
| A calendar event | `rig.calendar.event` + `rig.calendar.recurrence` + `rig.calendar.attendee` on entities; title is `rig.meta.named`, location is `rig.place.address` |
| A weekly span / exception | `rig.calendar.weekly`, `rig.calendar.span`, `rig.calendar.exception` |
| A plant taxon | `rig.plant.taxon` (name parts on taxon, display name via `rig.meta.named` - no `scientificName` blob) |
| Cultivar / habit / occurrence | `rig.plant.cultivar`, `rig.plant.habit`, `rig.plant.occurrence`; a plant photo is `rig.plant.portrait` + asset_ref; habitat is the site (`rig.place.geo`/`address`) |

## Guards

- Calendar times are `startMinutes` in `document.timeZone`; `startSecond` (0-59) orders events sharing a minute. No `RRULE`, `DTSTART`, or `ATTENDEE` strings. No `rig.calendar.todo`, `alarm`, `freebusy`, or `timezone` - those stay in the `.ics` source.
- Do not copy an issued id onto an encounter or other documents; join keys live on the person.

## Ids in this slice

`rig.person.name`, `rig.person.vital`, `rig.person.contact`, `rig.person.employment`, `rig.person.portrait`, `rig.person.identifier`, `rig.organisation.identity`, `rig.party.account`, `rig.place.address`, `rig.place.geo`, `rig.calendar.weekly`, `rig.calendar.span`, `rig.calendar.exception`, `rig.calendar.event`, `rig.calendar.recurrence`, `rig.calendar.attendee`, `rig.plant.taxon`, `rig.plant.cultivar`, `rig.plant.habit`, `rig.plant.occurrence`, `rig.plant.portrait`
