/**
 * Emit schemas/json/rig.*.schema.json from an inline catalog.
 * Run: node tools/gen-schemas.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "schemas", "json");

const ref = (name) => ({ $ref: `./_defs.schema.json#/$defs/${name}` });

function objectSchema(id, properties, opts = {}) {
  const required = opts.required ?? Object.keys(properties);
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://rig.works/schemas/${id}.schema.json`,
    title: id,
    type: "object",
    additionalProperties: false,
    properties,
  };
  if (required.length) schema.required = required;
  if (opts.description) schema.description = opts.description;
  if (opts.allOf) schema.allOf = opts.allOf;
  if (opts.oneOf) schema.oneOf = opts.oneOf;
  if (opts.minProperties !== undefined) schema.minProperties = opts.minProperties;
  return schema;
}

const ENUM_LITERAL = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

function enumOf(values) {
  for (const v of values) {
    if (!ENUM_LITERAL.test(v)) {
      throw new Error(`enum literal must be kebab-case: ${JSON.stringify(v)}`);
    }
  }
  return { type: "string", enum: values };
}

/** @type {Record<string, object>} */
const catalog = {};

function add(id, properties, opts) {
  catalog[id] = objectSchema(id, properties, opts);
}

// --- spatial ---
// All fields optional; absent means identity (position 0,0,0 / rotation
// 0,0,0,1 / scale 1,1,1). Emit only what differs from identity if you like.
add("rig.spatial.transform", {
  position: ref("vec3"),
  rotation: ref("quat"),
  scale: ref("vec3"),
}, { required: [] });

// 3×3×3 registration on local bounds. Absent component = no remap / page trim top-left.
// height is the Z slice of the cuboid (absent = min). Axes never invert — origin is a cell.
add("rig.spatial.anchor", {
  point: enumOf([
    "top-left",
    "top-center",
    "top-right",
    "middle-left",
    "center",
    "middle-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ]),
  height: enumOf(["min", "center", "max"]),
  offset: ref("vec2"),
}, { required: ["point"] });

add(
  "rig.spatial.relationship",
  {
    parent: ref("entity"),
    order: ref("int"),
  },
  { required: ["parent"] }
);

add(
  "rig.spatial.group",
  {},
  {
    required: [],
    description: "Marker: presence means scene group root. No fields.",
    minProperties: 0,
  }
);

// Defaults: active true, projection perspective, fovYDegrees 60,
// nearClip 0.1, farClip 1000, aspect = host viewport.
add("rig.spatial.camera", {
  active: ref("bool"),
  projection: enumOf(["perspective", "orthographic"]),
  fovYDegrees: ref("float"),
  orthoHeight: ref("float"),
  nearClip: ref("float"),
  farClip: ref("float"),
  aspect: ref("float"),
}, { required: [] });

// Defaults: order 0, locked false, rgba = no label colour.
// Show/hide is rig.render.visibility — do not re-declare visible here.
add("rig.spatial.layer", {
  order: ref("int"),
  locked: ref("bool"),
  rgba: ref("rgba"),
}, { required: [] });

// --- layout ---
// Edge arrays run top, right, bottom, left (CSS order).
const edges = {
  type: "array",
  items: { type: "number" },
  minItems: 4,
  maxItems: 4,
};

add("rig.layout.page", {
  index: ref("int"),
  width: ref("float"),
  height: ref("float"),
  unit: ref("string"),
  margins: edges,
  bleed: edges,
  slug: edges,
}, { required: ["width", "height"] });

// --- place (civic / postal + geodetic; not scene pose) ---
// Structured UPU S42 / ISO 20022 PostalAddress elements. All optional;
// emit what the source measured. Unstructured AdrLine is import residue.
add(
  "rig.place.address",
  {
    streetName: ref("string"),
    buildingNumber: ref("string"),
    buildingName: ref("string"),
    floor: ref("string"),
    room: ref("string"),
    postBox: ref("string"),
    postCode: ref("string"),
    townName: ref("string"),
    townLocationName: ref("string"),
    districtName: ref("string"),
    countrySubDivision: ref("string"),
    country: {
      type: "string",
      pattern: "^[A-Z]{2}$",
      description: "ISO 3166-1 alpha-2 (ISO 20022 Ctry).",
    },
    department: ref("string"),
    subDepartment: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Civic / postal address. Field meanings follow UPU S42 and ISO 20022 PostalAddress. Not scene pose.",
  }
);

add(
  "rig.place.geo",
  {
    latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
    longitudeDegrees: { type: "number", minimum: -180, maximum: 180 },
    altitudeMetres: ref("float"),
  },
  {
    required: ["latitudeDegrees", "longitudeDegrees"],
    description:
      "WGS84 geodetic pin. Not a postal address and not scene pose.",
  }
);

// --- person / organisation / party (ISO 20022 party elements; not MX) ---
// Display name is rig.meta.named. Postal address is rig.place.address.
// Photo is an asset entity. Unstructured Nm stays in the source.
const isoDate = {
  type: "string",
  pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
  description: "ISO 8601 calendar date.",
};
const isoCountry = {
  type: "string",
  pattern: "^[A-Z]{2}$",
  description: "ISO 3166-1 alpha-2.",
};
const isoCurrency = {
  type: "string",
  pattern: "^[A-Z]{3}$",
  description: "ISO 4217 (ISO 20022 Ccy).",
};

add(
  "rig.person.name",
  {
    givenName: ref("string"),
    middleName: ref("string"),
    familyName: ref("string"),
    namePrefix: ref("string"),
    nameSuffix: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Structured personal name. Field meanings follow ISO 20022 PersonName. Display name is rig.meta.named.",
  }
);

add(
  "rig.person.vital",
  {
    sex: enumOf(["unknown", "male", "female", "not-applicable"]),
    gender: ref("string"),
    birthDate: { ...isoDate, description: "ISO 8601 calendar date (ISO 20022 BirthDt)." },
    birthTown: ref("string"),
    birthCountrySubDivision: ref("string"),
    birthCountry: { ...isoCountry, description: "ISO 3166-1 alpha-2 (ISO 20022 CtryOfBirth)." },
    nationality: { ...isoCountry, description: "ISO 3166-1 alpha-2 (ISO 20022 Ntlty)." },
    countryOfResidence: { ...isoCountry, description: "ISO 3166-1 alpha-2 (ISO 20022 CtryOfRes)." },
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Sex, gender identity, and birth. Sex follows ISO/IEC 5218; gender is self-described; birth follows ISO 20022 DateAndPlaceOfBirth.",
  }
);

add(
  "rig.person.contact",
  {
    email: ref("string"),
    phone: ref("string"),
    mobile: ref("string"),
    fax: ref("string"),
    preferredMethod: enumOf(["mail", "email", "phone", "mobile", "fax"]),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Reach channels. Field meanings follow ISO 20022 ContactDetails. Not a postal address.",
  }
);

add(
  "rig.person.employment",
  {
    jobTitle: ref("string"),
    responsibility: ref("string"),
    department: ref("string"),
    occupation: ref("string"),
    employeeId: ref("string"),
    organisation: ref("entity"),
    reportsTo: ref("entity"),
    startDate: isoDate,
    endDate: isoDate,
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Employment. Job title / department follow ISO 20022 ContactDetails; organisation is an entity.",
  }
);

add(
  "rig.person.portrait",
  {
    asset: ref("entity"),
  },
  {
    required: ["asset"],
    description:
      "Portrait photo. asset is a rig.media.asset_ref entity. Not an inline path.",
  }
);

add(
  "rig.organisation.identity",
  {
    lei: {
      type: "string",
      pattern: "^[A-Z0-9]{20}$",
      description: "ISO 17442 LEI (ISO 20022 LEI).",
    },
    bic: {
      type: "string",
      pattern: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
      description: "ISO 9362 BIC (ISO 20022 AnyBIC).",
    },
    registrationNumber: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Organisation legal identifiers. Field meanings follow ISO 20022 OrganisationIdentification. Name is rig.meta.named.",
  }
);

add(
  "rig.party.account",
  {
    iban: ref("string"),
    accountNumber: ref("string"),
    accountName: ref("string"),
    currency: isoCurrency,
    bic: {
      type: "string",
      pattern: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
      description: "ISO 9362 BIC (ISO 20022 BICFI).",
    },
    bankName: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Payment account. Field meanings follow ISO 20022 CashAccount and FinancialInstitutionIdentification. Prefer IBAN when present.",
  }
);

// --- commerce (schema.org Offer / PriceSpecification; ISO 4217) ---
// Not a cart, checkout, or tax engine. List price and sale are
// different offer entities. Validity is rig.calendar.span.
add(
  "rig.commerce.price",
  {
    amount: ref("float"),
    currency: isoCurrency,
    unit: enumOf([
      "each",
      "hour",
      "day",
      "week",
      "month",
      "year",
      "metre",
      "kilogram",
      "other",
    ]),
    vatIncluded: ref("bool"),
  },
  {
    required: ["amount", "currency"],
    description:
      "Money amount. Field meanings follow ISO 20022 ActiveOrHistoricCurrencyAndAmount and schema.org PriceSpecification. Not a formatted price string.",
  }
);

add(
  "rig.commerce.offer",
  {
    item: ref("entity"),
    seller: ref("entity"),
    availability: enumOf([
      "in-stock",
      "out-of-stock",
      "pre-order",
      "limited",
      "unknown",
    ]),
    sku: ref("string"),
  },
  {
    required: ["item"],
    description:
      "Someone offers an item. Field meanings follow schema.org Offer. Price composes rig.commerce.price; window composes rig.calendar.span.",
  }
);

add(
  "rig.commerce.discount",
  {
    kind: enumOf(["percent", "amount"]),
    percent: { type: "number", minimum: 0, maximum: 100 },
    amount: ref("float"),
    currency: isoCurrency,
    code: ref("string"),
  },
  {
    required: ["kind"],
    description:
      "Adjustment on an offer. percent is 0–100 (10 means 10%). amount is money off, not the resulting price. schema.org Discount / PriceSpecification.",
  }
);

// --- legal (schema.org Contract / ISO 20022 Agreement; not Rig Contract) ---
// Rights of a work stay on rig.rights.statement. The signed instrument
// file is a media.asset_ref entity. Parties are person / organisation
// entities — do not put name strings here.
add(
  "rig.legal.agreement",
  {
    kind: enumOf([
      "employment",
      "nda",
      "licence",
      "lease",
      "loan",
      "service",
      "sale",
      "other",
    ]),
    identifier: ref("string"),
    status: enumOf([
      "draft",
      "offered",
      "signed",
      "active",
      "suspended",
      "terminated",
      "expired",
    ]),
    governingLaw: ref("string"),
    signedDate: isoDate,
    instrument: ref("entity"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "A deal between parties. Field meanings follow schema.org Contract and ISO 20022 AgreementIdentification. Term dates compose rig.calendar.span.",
  }
);

add(
  "rig.legal.party",
  {
    agreement: ref("entity"),
    party: ref("entity"),
    role: enumOf([
      "party",
      "buyer",
      "seller",
      "lessor",
      "lessee",
      "employer",
      "employee",
      "licensor",
      "licensee",
      "witness",
      "guarantor",
    ]),
    signedDate: isoDate,
  },
  {
    required: ["agreement", "party"],
    description:
      "One side of an agreement. party is a person or organisation entity. A second signatory is another entity.",
  }
);

// --- plant (botanica; Darwin Core Taxon / Occurrence + ICNCP) ---
// Formatted scientific / display name is rig.meta.named. Site is
// rig.place.address / rig.place.geo. Unstructured scientificName stays
// in the source — do not dual-author it here.
add(
  "rig.plant.taxon",
  {
    kingdom: ref("string"),
    phylum: ref("string"),
    class: ref("string"),
    order: ref("string"),
    family: ref("string"),
    genus: ref("string"),
    specificEpithet: ref("string"),
    infraspecificEpithet: ref("string"),
    taxonRank: ref("string"),
    scientificNameAuthorship: ref("string"),
    vernacularName: ref("string"),
    nomenclaturalCode: enumOf(["icn", "icncp", "iczn", "icnp", "biocode"]),
    taxonomicStatus: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Botanical taxon. Field meanings follow Darwin Core Taxon and ICNafp. Display name is rig.meta.named.",
  }
);

add(
  "rig.plant.cultivar",
  {
    cultivarEpithet: ref("string"),
    cultivarGroup: ref("string"),
    grex: ref("string"),
    tradeDesignation: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Cultivated-plant name. Field meanings follow ICNCP and Darwin Core cultivarEpithet. Epithet without quotes.",
  }
);

add(
  "rig.plant.habit",
  {
    lifeForm: enumOf([
      "tree",
      "shrub",
      "herb",
      "vine",
      "grass",
      "fern",
      "moss",
      "succulent",
      "aquatic",
      "palm",
      "other",
    ]),
    leafPersistence: enumOf(["deciduous", "evergreen", "semi-evergreen"]),
    heightMetres: ref("float"),
    spreadMetres: ref("float"),
    hardiness: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Growth form and mature size. Not Darwin Core habitat (that is the event site — compose place).",
  }
);

add(
  "rig.plant.occurrence",
  {
    catalogNumber: ref("string"),
    recordedBy: ref("string"),
    identifiedBy: ref("string"),
    eventDate: isoDate,
    establishmentMeans: enumOf([
      "native",
      "introduced",
      "cultivated",
      "naturalised",
      "invasive",
      "uncertain",
    ]),
    vitality: enumOf(["alive", "dead", "uncertain"]),
    organismQuantity: ref("string"),
    organismQuantityType: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "This plant record / individual. Field meanings follow Darwin Core Occurrence. Site is rig.place.geo.",
  }
);

add(
  "rig.plant.portrait",
  {
    asset: ref("entity"),
  },
  {
    required: ["asset"],
    description:
      "Plant photo. asset is a rig.media.asset_ref entity. Not an inline path.",
  }
);

// --- book (ISO 2108 ISBN + ONIX for Books elements; not an ONIX message) ---
// Distinctive title is rig.meta.named. Contributor names are person
// entities. Publisher is an organisation entity. Cover is an asset.
const onixDate = {
  type: "string",
  pattern: "^[0-9]{4}(-[0-9]{2}(-[0-9]{2})?)?$",
  description: "ISO 8601 date or year (ONIX PublishingDate).",
};

add(
  "rig.book.identifier",
  {
    isbn13: {
      type: "string",
      pattern: "^97[89][0-9]{10}$",
      description: "ISO 2108 ISBN-13 digits only (ONIX ProductIDType 15).",
    },
    isbn10: {
      type: "string",
      pattern: "^[0-9]{9}[0-9X]$",
      description: "ISO 2108 ISBN-10 (ONIX ProductIDType 02). Legacy.",
    },
    doi: ref("string"),
    issn: {
      type: "string",
      pattern: "^[0-9]{4}-[0-9]{3}[0-9X]$",
      description: "ISSN (ISO 3297).",
    },
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Product identifiers. Prefer isbn13 (ISO 2108). Do not invent isbn10 from isbn13.",
  }
);

add(
  "rig.book.title",
  {
    subtitle: ref("string"),
    originalTitle: ref("string"),
    titlePrefix: ref("string"),
    editionStatement: ref("string"),
    editionNumber: ref("int"),
    seriesName: ref("string"),
    seriesNumber: ref("string"),
    description: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Title detail beyond the distinctive title. Field meanings follow ONIX TitleDetail. Distinctive title is rig.meta.named.",
  }
);

add(
  "rig.book.publication",
  {
    publisher: ref("entity"),
    publishedDate: onixDate,
    language: {
      type: "string",
      pattern: "^[a-z]{2,3}$",
      description: "ISO 639-1 or 639-2/T (ONIX Language).",
    },
    pageCount: ref("uint"),
    productForm: enumOf(["hardcover", "paperback", "ebook", "audiobook", "other"]),
    cityOfPublication: ref("string"),
    copyrightYear: { type: "integer", minimum: 1000, maximum: 9999 },
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Publishing detail. Field meanings follow ONIX PublishingDetail. Publisher is an organisation entity.",
  }
);

add(
  "rig.book.contribution",
  {
    work: ref("entity"),
    person: ref("entity"),
    role: enumOf([
      "author",
      "editor",
      "translator",
      "illustrator",
      "photographer",
      "compiler",
      "introduction",
      "other",
    ]),
    sequence: ref("int"),
  },
  {
    required: ["work", "person", "role"],
    description:
      "One contributor on one work. Field meanings follow ONIX Contributor. Name is on the person entity.",
  }
);

add(
  "rig.book.cover",
  {
    asset: ref("entity"),
  },
  {
    required: ["asset"],
    description:
      "Cover image. asset is a rig.media.asset_ref entity. Not an inline path.",
  }
);

add(
  "rig.book.subject",
  {
    work: ref("entity"),
    scheme: enumOf(["thema", "bisac", "bic", "dewey", "keyword"]),
    code: ref("string"),
    heading: ref("string"),
  },
  {
    required: ["work"],
    minProperties: 2,
    description:
      "One classification heading on one work. Field meanings follow ONIX Subject.",
  }
);

// --- paper (JATS / Crossref article + CSL citation link; not a JATS XML file) ---
add(
  "rig.paper.identifier",
  {
    doi: ref("string"),
    pmid: {
      type: "string",
      pattern: "^[0-9]+$",
      description: "PubMed PMID.",
    },
    pmcid: {
      type: "string",
      pattern: "^PMC[0-9]+$",
      description: "PubMed Central PMCID.",
    },
    arxiv: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Article identifiers. Field meanings follow JATS article-id and Crossref. Prefer doi when present.",
  }
);

add(
  "rig.paper.article",
  {
    abstract: ref("string"),
    pageStart: ref("string"),
    pageEnd: ref("string"),
    articleNumber: ref("string"),
    publishedDate: onixDate,
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Article body metadata. Field meanings follow JATS article-meta. Title is rig.meta.named.",
  }
);

add(
  "rig.paper.issue",
  {
    journal: ref("entity"),
    volume: ref("string"),
    issue: ref("string"),
    conferenceName: ref("string"),
    conferencePlace: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Issue / proceedings container. Journal is an entity (name + ISSN). Not the article.",
  }
);

add(
  "rig.paper.citation",
  {
    citing: ref("entity"),
    cited: ref("entity"),
    locator: ref("string"),
  },
  {
    required: ["citing", "cited"],
    description:
      "One bibliographic citation. Field meanings follow CSL / ISO 690 (this work cites that work).",
  }
);

// --- rights (Dublin Core / RightsStatements.org / CC; compose onto any work) ---
add(
  "rig.rights.statement",
  {
    copyrightHolder: ref("entity"),
    copyrightYear: { type: "integer", minimum: 1000, maximum: 9999 },
    licence: enumOf([
      "all-rights-reserved",
      "public-domain",
      "cc0",
      "cc-by",
      "cc-by-sa",
      "cc-by-nd",
      "cc-by-nc",
      "cc-by-nc-sa",
      "cc-by-nc-nd",
      "other",
    ]),
    licenceUri: ref("string"),
    rightsStatementUri: ref("string"),
    creditLine: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Copyright and licence. Meanings follow Dublin Core rights and RightsStatements.org. Compose onto the work.",
  }
);

// --- art (CDWA core / VRA Core / Object ID; not a LIDO XML file) ---
add(
  "rig.art.object",
  {
    workType: ref("string"),
    classification: ref("string"),
    inscription: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Object / work type. Field meanings follow CDWA Object/Work and Classification. Title is rig.meta.named.",
  }
);

add(
  "rig.art.creation",
  {
    createdDate: ref("string"),
    period: ref("string"),
    culture: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Creation date and period. Field meanings follow CDWA Creation. Maker is rig.art.attribution.",
  }
);

add(
  "rig.art.attribution",
  {
    work: ref("entity"),
    person: ref("entity"),
    role: enumOf([
      "artist",
      "attributed-to",
      "workshop-of",
      "school-of",
      "after",
      "photographer",
      "other",
    ]),
    sequence: ref("int"),
  },
  {
    required: ["work", "person", "role"],
    description:
      "One maker on one work. Field meanings follow CDWA Creation/Creator. Name is on the person entity.",
  }
);

add(
  "rig.art.dimensions",
  {
    heightMillimetres: ref("float"),
    widthMillimetres: ref("float"),
    depthMillimetres: ref("float"),
    weightGrams: ref("float"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Measurements. Field meanings follow CDWA Measurements / Object ID. Values in millimetres and grams.",
  }
);

add(
  "rig.art.material",
  {
    medium: ref("string"),
    technique: ref("string"),
    support: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Materials and techniques. Field meanings follow CDWA Materials/Techniques and VRA Core material / technique.",
  }
);

add(
  "rig.art.location",
  {
    repository: ref("entity"),
    accessionNumber: ref("string"),
  },
  {
    required: [],
    minProperties: 1,
    description:
      "Current location. Field meanings follow CDWA Current Location. Repository is an organisation entity.",
  }
);

add(
  "rig.art.subject",
  {
    work: ref("entity"),
    heading: ref("string"),
    interpretation: ref("string"),
  },
  {
    required: ["work"],
    minProperties: 2,
    description:
      "Subject matter. Field meanings follow CDWA Subject Matter. A second heading is another entity.",
  }
);

add(
  "rig.art.image",
  {
    asset: ref("entity"),
  },
  {
    required: ["asset"],
    description:
      "Documentary image of a work. asset is a rig.media.asset_ref entity. Not an inline path.",
  }
);

// --- geometry ---
// One schema per primitive family. A tagged union forced every shape to carry
// every other shape's fields; these carry only what they mean.
add("rig.geometry.rectangle", {
  x: ref("float"),
  y: ref("float"),
  width: ref("float"),
  height: ref("float"),
  cornerRadius: ref("float"),
}, { required: ["x", "y", "width", "height"] });

add("rig.geometry.ellipse", {
  centerX: ref("float"),
  centerY: ref("float"),
  radiusX: ref("float"),
  radiusY: ref("float"),
});

add("rig.geometry.line", {
  x1: ref("float"),
  y1: ref("float"),
  x2: ref("float"),
  y2: ref("float"),
});

add("rig.geometry.polygon", {
  points: { type: "array", items: ref("vec2"), minItems: 3 },
  closed: ref("bool"),
  fillRule: enumOf(["nonzero", "evenodd"]),
}, { required: ["points"] });

add("rig.geometry.regular_polygon", {
  centerX: ref("float"),
  centerY: ref("float"),
  radius: ref("float"),
  sides: { type: "integer", minimum: 3 },
  rotationDegrees: ref("float"),
}, { required: ["centerX", "centerY", "radius", "sides"] });

add("rig.geometry.star", {
  centerX: ref("float"),
  centerY: ref("float"),
  radius: ref("float"),
  innerRadius: ref("float"),
  points: { type: "integer", minimum: 3 },
  rotationDegrees: ref("float"),
}, { required: ["centerX", "centerY", "radius", "innerRadius", "points"] });

// Circular when radiusX == radiusY. Rotation of an elliptical arc belongs on
// rig.spatial.transform, not here.
add("rig.geometry.arc", {
  centerX: ref("float"),
  centerY: ref("float"),
  radiusX: ref("float"),
  radiusY: ref("float"),
  startAngleDegrees: ref("float"),
  endAngleDegrees: ref("float"),
  pie: ref("bool"),
}, { required: ["centerX", "centerY", "radiusX", "radiusY", "startAngleDegrees", "endAngleDegrees"] });

add("rig.geometry.ring", {
  centerX: ref("float"),
  centerY: ref("float"),
  outerRadius: ref("float"),
  innerRadius: ref("float"),
});

// NURBS / DXF-style spline. Tessellation is host fulfillment.
add("rig.geometry.spline", {
  degree: ref("int"),
  closed: ref("bool"),
  controlPoints: { type: "array", items: ref("vec2"), minItems: 2 },
  knots: { type: "array", items: { type: "number" } },
  weights: { type: "array", items: { type: "number" } },
  fitPoints: { type: "array", items: ref("vec2") },
}, { required: ["degree", "controlPoints", "knots"] });

add("rig.geometry.spline3d", {
  degree: ref("int"),
  closed: ref("bool"),
  controlPoints: { type: "array", items: ref("vec3"), minItems: 2 },
  knots: { type: "array", items: { type: "number" } },
  weights: { type: "array", items: { type: "number" } },
  fitPoints: { type: "array", items: ref("vec3") },
}, { required: ["degree", "controlPoints", "knots"] });

const pathCommand = {
  type: "object",
  additionalProperties: false,
  required: ["type"],
  properties: {
    type: enumOf(["move-to", "line-to", "cubic-to", "quad-to", "close"]),
    point: ref("vec2"),
    control1: ref("vec2"),
    control2: ref("vec2"),
  },
};

add("rig.geometry.path", {
  commands: { type: "array", items: pathCommand },
  fillRule: enumOf(["nonzero", "evenodd"]),
}, { required: ["commands"] });

const path3dCommand = {
  type: "object",
  additionalProperties: false,
  required: ["type"],
  properties: {
    type: enumOf(["move-to", "line-to", "cubic-to", "quad-to", "close"]),
    point: ref("vec3"),
    control1: ref("vec3"),
    control2: ref("vec3"),
  },
};

add("rig.geometry.path3d", {
  commands: { type: "array", items: path3dCommand },
});

add("rig.geometry.mesh", {
  positions: { type: "array", items: { type: "number" } },
  normals: { type: "array", items: { type: "number" } },
  indices: { type: "array", items: ref("uint32") },
  loops: { type: "array", items: ref("uint32") },
  loopSizes: { type: "array", items: ref("uint32") },
  texcoords: { type: "array", items: { type: "number" } },
  mode: enumOf(["triangles", "lines", "line-strip"]),
  faceColors: { type: "array", items: ref("rgba") },
  facePalette: { type: "array", items: ref("uint8") },
}, { required: ["positions", "mode"] });

// NURBS patch. Curves stay on spline / spline3d. Tessellation to mesh is fulfillment.
add("rig.geometry.nurbs_surface", {
  degreeU: ref("int"),
  degreeV: ref("int"),
  countU: { type: "integer", minimum: 2 },
  countV: { type: "integer", minimum: 2 },
  controlPoints: { type: "array", items: ref("vec3"), minItems: 4 },
  knotsU: { type: "array", items: { type: "number" } },
  knotsV: { type: "array", items: { type: "number" } },
  weights: { type: "array", items: { type: "number" } },
  closedU: ref("bool"),
  closedV: ref("bool"),
}, { required: ["degreeU", "degreeV", "countU", "countV", "controlPoints", "knotsU", "knotsV"] });

// --- cad ---
// CSG tree as split primitives (not a tagged-union solid blob). When any
// rig.cad.* is present it is the solid source of truth; mesh on the same
// entity is an optional bake. Edges named for fillet/chamfer are undirected
// vertex pairs into that entity's mesh positions.
const meshEdge = {
  type: "object",
  additionalProperties: false,
  required: ["a", "b"],
  properties: {
    a: ref("uint32"),
    b: ref("uint32"),
  },
};

add("rig.cad.cuboid", {
  sizeX: ref("float"),
  sizeY: ref("float"),
  sizeZ: ref("float"),
  center: ref("bool"),
}, { required: ["sizeX", "sizeY", "sizeZ"] });

add("rig.cad.cylinder", {
  radius: ref("float"),
  height: ref("float"),
  circularSegments: { type: "integer", minimum: 3 },
  center: ref("bool"),
}, { required: ["radius", "height"] });

add("rig.cad.sphere", {
  radius: ref("float"),
  circularSegments: { type: "integer", minimum: 3 },
}, { required: ["radius"] });

add("rig.cad.extrude", {
  profile: ref("entity"),
  height: ref("float"),
  nDivisions: { type: "integer", minimum: 1 },
  twistDegrees: ref("float"),
  scaleTop: ref("float"),
}, { required: ["profile", "height"] });

add("rig.cad.revolve", {
  profile: ref("entity"),
  revolveDegrees: ref("float"),
  circularSegments: { type: "integer", minimum: 3 },
}, { required: ["profile"] });

add("rig.cad.boolean", {
  op: enumOf(["union", "difference", "intersection"]),
  operands: { type: "array", items: ref("entity"), minItems: 2 },
}, { required: ["op", "operands"] });

add("rig.cad.fillet", {
  radius: ref("float"),
  edges: { type: "array", items: meshEdge },
  allEdges: ref("bool"),
}, { required: ["radius"] });

add("rig.cad.chamfer", {
  distance: ref("float"),
  edges: { type: "array", items: meshEdge },
  allEdges: ref("bool"),
}, { required: ["distance"] });

// --- paint ---
// Defaults: hasFill = fillRgba present, hasStroke = strokeRgba present,
// strokeWidth 1.
add("rig.paint.fill_stroke", {
  fillRgba: ref("rgba"),
  strokeRgba: ref("rgba"),
  strokeWidth: ref("float"),
  hasFill: ref("bool"),
  hasStroke: ref("bool"),
}, { required: [] });

add("rig.paint.solid", {
  rgba: ref("rgba"),
  cmyk: ref("vec4"),
  ink: ref("string"),
  overprintFill: ref("bool"),
  overprintStroke: ref("bool"),
}, { required: ["rgba"] });

// start/end default to (0,0) -> (1,0) in object space.
add("rig.paint.gradient", {
  kind: enumOf(["linear", "radial"]),
  stops: {
    type: "array",
    items: {
      type: "object",
      additionalProperties: false,
      required: ["t", "rgba"],
      properties: {
        t: { type: "number", minimum: 0, maximum: 1 },
        rgba: ref("rgba"),
      },
    },
  },
  start: ref("vec2"),
  end: ref("vec2"),
}, { required: ["kind", "stops"] });

// Paint by reference — several drawables sharing one paint entity. The inline
// spelling stays on rig.paint.fill_stroke; an entity uses one or the other.
add("rig.paint.fill", {
  paint: ref("entity"),
}, { required: ["paint"] });

add("rig.paint.stroke", {
  paint: ref("entity"),
  width: ref("float"),
}, { required: ["paint"] });

add("rig.paint.library", {
  paints: { type: "array", items: ref("entity") },
}, { required: ["paints"] });

// Defaults: cap butt, join miter, miterLimit 4, dash solid, dashOffset 0.
add("rig.paint.stroke_style", {
  cap: enumOf(["butt", "square", "round"]),
  join: enumOf(["miter", "bevel", "round"]),
  miterLimit: ref("float"),
  dash: { type: "array", items: ref("float") },
  dashOffset: ref("float"),
}, { required: [] });

// --- meta / render ---
add("rig.meta.named", {
  name: ref("string"),
  stableId: ref("string"),
}, { required: ["name"] });

add("rig.meta.tags", {
  tags: { type: "array", items: ref("string") },
});

// Defaults: enabled true, type point, rgb white, intensity 1, ambient 0,
// banded false. Spot cones: inner 0, outer 45. range absent = infinite.
add("rig.render.light", {
  enabled: ref("bool"),
  type: enumOf(["directional", "point", "spot"]),
  rgb: ref("rgb"),
  intensity: ref("float"),
  ambient: ref("float"),
  banded: ref("bool"),
  bands: ref("int"),
  range: ref("float"),
  innerConeDegrees: ref("float"),
  outerConeDegrees: ref("float"),
}, { required: [] });

// Defaults: albedoRgb white, metallic 0, roughness 1, emissive black.
add("rig.render.material", {
  albedoRgb: ref("rgb"),
  albedoMap: ref("entity"),
  metallic: ref("float"),
  roughness: ref("float"),
  emissive: ref("rgb"),
}, { required: [] });

// Per-entity show/hide. Draw order is sibling order — see rig.spatial.relationship.
add("rig.render.visibility", {
  visible: ref("bool"),
}, { required: ["visible"] });

// Defaults: blendMode normal, opacity 1. Compose on any drawable.
add("rig.render.blend", {
  blendMode: enumOf([
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
    "add",
    "subtract",
    "disabled",
  ]),
  opacity: { type: "number", minimum: 0, maximum: 1 },
}, { required: [] });

// --- anim / mod ---
// Defaults: elapsed 0, easing linear, loop false, playing true.
add("rig.anim.tween", {
  target: ref("entity"),
  propertyKey: ref("string"),
  from: ref("float"),
  to: ref("float"),
  duration: ref("float"),
  elapsed: ref("float"),
  easing: enumOf(["linear", "ease-in", "ease-out", "ease-in-out"]),
  loop: ref("bool"),
  playing: ref("bool"),
}, { required: ["target", "propertyKey", "from", "to", "duration"] });

// 1D transfer curve (property datatype `curve`). Defaults: interpolation smooth;
// preset custom when points are authored.
add(
  "rig.anim.curve",
  {
    points: {
      type: "array",
      minItems: 2,
      items: ref("vec2"),
    },
    interpolation: enumOf(["linear", "smooth"]),
    preset: enumOf([
      "linear",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "s-curve",
      "bulge",
      "squeeze",
      "custom",
    ]),
  },
  { required: ["points"] }
);

// Defaults: amplitude 1, offset 0, phase 0.
add("rig.mod.lfo", {
  waveform: enumOf(["sine", "tri", "saw", "square"]),
  frequency: ref("float"),
  amplitude: ref("float"),
  offset: ref("float"),
  phase: ref("float"),
}, { required: ["waveform", "frequency"] });

// Defaults: depth 1, additive false; min/max absent = unclamped.
add("rig.mod.binding", {
  source: ref("entity"),
  target: ref("entity"),
  propertyKey: ref("string"),
  depth: ref("float"),
  min: ref("float"),
  max: ref("float"),
  additive: ref("bool"),
}, { required: ["source", "target", "propertyKey"] });

// --- music ---
// Defaults: playing false, timeSig 4/4, positionBeats 0, loop false.
add("rig.music.transport", {
  playing: ref("bool"),
  bpm: ref("float"),
  timeSigNum: ref("int"),
  timeSigDen: ref("int"),
  positionBeats: ref("float"),
  loop: ref("bool"),
  loopStartBeats: ref("float"),
  loopEndBeats: ref("float"),
}, { required: ["bpm"] });

// Defaults: phaseTicks 0, swingAmount 0, swingSubdiv 2, externalSync false.
add("rig.music.clock", {
  ticksPerQuarter: ref("int"),
  phaseTicks: ref("float"),
  swingAmount: ref("float"),
  swingSubdiv: ref("int"),
  externalSync: ref("bool"),
  syncBeat: ref("float"),
  syncPhase: ref("float"),
  syncPeriodBars: ref("float"),
}, { required: ["ticksPerQuarter"] });

// Defaults: pitch 60, velocity 100, gate 1, waveform 0, effect 0.
// waveform 0-7 are the portable synth shapes; 8+ are host instrument slots.
add("rig.music.step", {
  active: ref("bool"),
  pitch: { type: "integer", minimum: 0, maximum: 127 },
  velocity: { type: "integer", minimum: 0, maximum: 127 },
  gate: { type: "number", minimum: 0, maximum: 1 },
  waveform: { type: "integer", minimum: 0, maximum: 255 },
  effect: { type: "integer", minimum: 0, maximum: 7 },
}, { required: ["active"] });

// Defaults: rootNote 60, scale chromatic, stepsPerBeat 4 (16th notes),
// loopStartStep 0, loopEndStep = steps.length (loop the whole pattern).
add("rig.music.pattern", {
  steps: {
    type: "array",
    items: { $ref: "./rig.music.step.schema.json" },
  },
  rootNote: { type: "integer", minimum: 0, maximum: 127 },
  scale: enumOf(["chromatic", "major", "minor", "dorian", "pentatonic"]),
  // Patterns sharing a sequencer stack by lane; absent means the only lane.
  lane: ref("int"),
  // Musical rate: steps advanced per transport beat.
  stepsPerBeat: { type: "number", exclusiveMinimum: 0 },
  loopStartStep: ref("int"),
  loopEndStep: ref("int"),
}, { required: ["steps"] });

const arrangementFrame = {
  type: "object",
  additionalProperties: false,
  required: ["patterns"],
  properties: {
    patterns: { type: "array", items: ref("entity") },
  },
};

// Defaults: currentFrame 0, loop false, loopStartFrame 0,
// loopEndFrame = frames.length (loop the whole arrangement).
add("rig.music.arrangement", {
  frames: { type: "array", items: arrangementFrame },
  currentFrame: ref("int"),
  loop: ref("bool"),
  loopStartFrame: ref("int"),
  loopEndFrame: ref("int"),
}, { required: ["frames"] });

// Defaults: currentStep 0; clock absent = the host's default clock.
add("rig.music.sequencer", {
  pattern: ref("entity"),
  currentStep: ref("int"),
  clock: ref("entity"),
}, { required: ["pattern"] });

// Defaults: velocity 100, channel 0; clip absent = free note.
add("rig.music.note", {
  pitch: { type: "integer", minimum: 0, maximum: 127 },
  velocity: { type: "integer", minimum: 0, maximum: 127 },
  channel: { type: "integer", minimum: 0, maximum: 15 },
  start: ref("float"),
  duration: ref("float"),
  clip: ref("entity"),
}, { required: ["pitch", "start", "duration"] });

// Ports carry whichever identifier the host API exposes: portName when it
// names ports, portIndex when it numbers them. Both are machine-local.
// At least one must be present. Default: open true.
const portIdentifier = [{ anyOf: [{ required: ["portName"] }, { required: ["portIndex"] }] }];

add("rig.music.midi_output", {
  portName: ref("string"),
  portIndex: ref("uint"),
  open: ref("bool"),
}, { required: [], allOf: portIdentifier });

add("rig.music.midi_input", {
  portName: ref("string"),
  portIndex: ref("uint"),
  open: ref("bool"),
  channel: { type: "integer", minimum: 0, maximum: 15 },
}, { required: [], allOf: portIdentifier });

// --- audio ---
// The analysis request, not its results. Band magnitudes are host state.
add("rig.audio.analysis", {
  source: enumOf(["input", "asset"]),
  asset: ref("entity"),
  bandCount: ref("int"),
  smoothing: { type: "number", minimum: 0, maximum: 1 },
  onsetThreshold: ref("float"),
}, { required: ["source", "bandCount"] });

// Defaults: gain 1, mute false.
add("rig.audio.bus", {
  gain: { type: "number", minimum: 0, maximum: 1 },
  mute: ref("bool"),
}, { required: [] });

// --- media ---
add("rig.media.asset_ref", {
  kind: enumOf(["image", "audio", "video", "model", "font", "document", "other"]),
  path: ref("string"),
  loop: ref("bool"),
}, { required: ["kind", "path"] });

// Defaults: font absent = host default face, fontSize host default,
// rgba black, useKerning true, axes/features absent.
const textAxis = {
  type: "object",
  additionalProperties: false,
  required: ["tag", "value"],
  properties: {
    tag: ref("uint32"),
    value: ref("float"),
  },
};
add("rig.media.text", {
  text: ref("string"),
  font: ref("entity"),
  fontSize: ref("float"),
  axes: { type: "array", items: textAxis },
  features: ref("string"),
  useKerning: ref("bool"),
}, { required: ["text"] });

// Defaults: language absent = plain text, readOnly false.
add("rig.media.code", {
  text: ref("string"),
  language: ref("string"),
  readOnly: ref("bool"),
}, { required: ["text"] });

// --- font (UFO source) ---
// Outlines compose rig.geometry.path on the glyph entity.
// Features compose rig.media.code (language fea) via face.features.
// .ufo / .ufoz stay host encodings — docs/ufo.md.
add("rig.font.face", {
  family: ref("string"),
  style: ref("string"),
  unitsPerEm: ref("float"),
  ascender: ref("float"),
  descender: ref("float"),
  capHeight: ref("float"),
  xHeight: ref("float"),
  version: ref("string"),
  features: ref("entity"),
}, { required: [] });

add("rig.font.glyph", {
  unicodes: { type: "array", items: ref("uint32") },
  width: ref("float"),
}, { required: ["width"] });

add("rig.font.component", {
  glyph: ref("entity"),
  scaleX: ref("float"),
  xyScale: ref("float"),
  yxScale: ref("float"),
  scaleY: ref("float"),
  offsetX: ref("float"),
  offsetY: ref("float"),
}, { required: ["glyph"] });

add("rig.font.anchor", {
  point: ref("vec2"),
}, { required: ["point"] });

add("rig.font.layer", {
  role: enumOf(["foreground", "background", "spare"]),
}, { required: [] });

add("rig.font.kern", {
  left: ref("string"),
  right: ref("string"),
  value: ref("float"),
}, { required: ["left", "right", "value"] });

add("rig.font.group", {
  members: { type: "array", items: ref("string") },
  side: enumOf(["left", "right"]),
}, { required: ["members"] });

// --- story (semantic copy) ---
// Editorial flow: named styles, paragraphs, runs, tables. No font, size, or
// colour — those stay on rig.media.text + paint. Style labels compose
// rig.meta.named. Sequence is blocks[], not spatial.relationship.
add("rig.story.paragraph_style", {
  basedOn: ref("entity"),
  listKind: enumOf(["bullet", "numbered"]),
}, { required: [] });

add("rig.story.character_style", {
  basedOn: ref("entity"),
}, { required: [] });

const storyRun = {
  type: "object",
  additionalProperties: false,
  required: ["text"],
  properties: {
    text: ref("string"),
    style: ref("entity"),
  },
};

add("rig.story.paragraph", {
  style: ref("entity"),
  breakType: enumOf(["column", "page"]),
  runs: { type: "array", items: storyRun },
}, { required: ["runs"] });

const storyCell = {
  type: "object",
  additionalProperties: false,
  required: ["column", "row"],
  properties: {
    column: ref("int"),
    row: ref("int"),
    columnSpan: ref("int"),
    rowSpan: ref("int"),
    blocks: { type: "array", items: ref("entity") },
  },
};

add("rig.story.table", {
  columnCount: ref("int"),
  headerRowCount: ref("int"),
  footerRowCount: ref("int"),
  cells: { type: "array", items: storyCell },
}, { required: ["columnCount", "cells"] });

add("rig.story.flow", {
  blocks: { type: "array", items: ref("entity") },
}, { required: ["blocks"] });

// --- pixel ---
// Default: clearRgba transparent black (0,0,0,0).
add("rig.pixel.canvas", {
  width: ref("int"),
  height: ref("int"),
  clearRgba: ref("rgba"),
}, { required: ["width", "height"] });

// Only the fields the chosen kind needs; the rest stay absent.
add("rig.pixel.source", {
  kind: enumOf(["none", "image-file", "generator", "image-sequence", "webcam", "video-file"]),
  asset: ref("entity"),
  generatorName: ref("string"),
  sequenceFps: ref("float"),
  sequenceFrame: ref("int"),
  webcamDevice: ref("int"),
  webcamWidth: ref("int"),
  webcamHeight: ref("int"),
  videoTime: ref("float"),
}, { required: ["kind"] });

// Defaults: maskSource none, invertMask false. Blend/opacity live on rig.render.blend.
add("rig.pixel.layer", {
  kind: enumOf(["vector", "overlay-image", "solid", "group"]),
  image: ref("entity"),
  rgba: ref("rgba"),
  maskSource: enumOf(["none", "luma", "alpha", "path"]),
  maskAsset: ref("entity"),
  maskLayer: ref("entity"),
  maskPathEntity: ref("entity"),
  invertMask: ref("bool"),
  groupParent: ref("entity"),
}, { required: ["kind"] });

add("rig.pixel.raster", {
  role: enumOf(["working", "output", "layer-pixels", "mask", "composite"]),
  width: ref("int"),
  height: ref("int"),
  rgba: { type: "array", items: ref("uint8") },
});

add("rig.pixel.palette", {
  colors: { type: "array", items: ref("rgba"), minItems: 1 },
});

// flags absent = all zero.
add("rig.pixel.tile_set", {
  palette: ref("entity"),
  tileWidth: ref("int"),
  tileHeight: ref("int"),
  tilesAcross: ref("int"),
  tileRows: ref("int"),
  indices: { type: "array", items: ref("uint8") },
  flags: { type: "array", items: ref("uint8") },
}, { required: ["palette", "tileWidth", "tileHeight", "tilesAcross", "tileRows", "indices"] });

// origin: where this map's region sits inside a larger host map (default 0,0).
add("rig.pixel.tile_map", {
  tileSet: ref("entity"),
  width: ref("int"),
  height: ref("int"),
  originX: ref("int"),
  originY: ref("int"),
  tiles: { type: "array", items: ref("int") },
}, { required: ["tileSet", "width", "height", "tiles"] });

const effectStep = {
  type: "object",
  additionalProperties: false,
  required: ["id", "stage", "effectId"],
  properties: {
    id: ref("uint"),
    stage: enumOf(["image", "draw", "generate"]),
    effectId: ref("string"),
    enabled: ref("bool"),
    parentStep: ref("uint"),
  },
};

// Defaults: step enabled true; nextId = highest step id + 1.
add("rig.pixel.effect_chain", {
  steps: { type: "array", items: effectStep },
  nextId: ref("uint"),
}, { required: ["steps"] });

// --- io / led / sensor / interact / input ---
// Defaults: player 0, all buttons false.
add("rig.input.buttons", {
  player: ref("int"),
  left: ref("bool"),
  right: ref("bool"),
  up: ref("bool"),
  down: ref("bool"),
  o: ref("bool"),
  x: ref("bool"),
}, { required: [] });

// Listen and send sides are independent; enable one, both, or neither.
// listenPort is required when listenEnabled; sendHost + sendPort when
// sendEnabled. Defaults: both sides disabled.
add("rig.io.osc", {
  listenEnabled: ref("bool"),
  listenPort: ref("int"),
  sendEnabled: ref("bool"),
  sendHost: ref("string"),
  sendPort: ref("int"),
  addressPrefix: ref("string"),
}, { required: [] });

// Defaults: baud 9600, enabled false.
add("rig.io.serial", {
  port: ref("string"),
  baud: ref("int"),
  enabled: ref("bool"),
}, { required: ["port"] });

// DMX512 port. Defaults: universe 1, enabled true.
add("rig.io.dmx", {
  universe: ref("int"),
  direction: enumOf(["in", "out"]),
  enabled: ref("bool"),
}, { required: ["direction"] });

// E1.31 / sACN. direction absent = out (pixel transmit path with uvMap).
// Defaults: startChannel 1, universeCount 1, enabled true, host = multicast.
add("rig.io.sacn", {
  universe: { type: "integer", minimum: 1, maximum: 63999 },
  direction: enumOf(["in", "out"]),
  universeCount: { type: "integer", minimum: 1, maximum: 63999 },
  startChannel: { type: "integer", minimum: 1, maximum: 512 },
  host: ref("string"),
  fps: ref("float"),
  enabled: ref("bool"),
  uvMap: ref("entity"),
}, { required: ["universe"] });

// width/height absent = normalized against the host output size.
add("rig.led.uv_map", {
  width: ref("int"),
  height: ref("int"),
  pixels: {
    type: "array",
    items: {
      type: "object",
      additionalProperties: false,
      required: ["index", "u", "v"],
      properties: {
        index: ref("int"),
        u: ref("float"),
        v: ref("float"),
      },
    },
  },
}, { required: ["pixels"] });

// Defaults: level 0; device absent = the host's default GPIO device.
add("rig.sensor.gpio", {
  pin: ref("int"),
  mode: enumOf(["in", "out"]),
  level: { type: "number", minimum: 0, maximum: 1 },
  device: ref("entity"),
}, { required: ["pin", "mode"] });

// Defaults: level 0; device absent = local.
add("rig.sensor.presence", {
  level: { type: "number", minimum: 0, maximum: 1 },
  device: ref("entity"),
}, { required: [] });

// --- dmx ---
// Patch on a scene light. Channel layout is fixture-profile fulfillment.
add("rig.dmx.fixture", {
  startChannel: { type: "integer", minimum: 1, maximum: 512 },
  channelCount: { type: "integer", minimum: 1 },
  port: ref("entity"),
}, { required: ["startChannel", "channelCount"] });

// --- light ---
// Show look. speed / freezeTimeoutMinutes absent = host default.
add("rig.light.look", {
  effectId: ref("string"),
  speed: { type: "number", minimum: 0, maximum: 1 },
  freezeTimeoutMinutes: ref("float"),
}, { required: ["effectId"] });

// --- calendar (wall-clock show planning) ---
// days[0] = Sunday … days[6] = Saturday. Times are minutes since midnight
// in document.timeZone.
add("rig.calendar.weekly", {
  days: {
    type: "array",
    items: { type: "boolean" },
    minItems: 7,
    maxItems: 7,
  },
  startMinutes: { type: "integer", minimum: 0, maximum: 1439 },
  endMinutes: { type: "integer", minimum: 0, maximum: 1439 },
}, { required: ["days", "startMinutes", "endMinutes"] });

add("rig.calendar.span", {
  startDate: isoDate,
  endDate: isoDate,
}, { required: ["startDate", "endDate"] });

add("rig.calendar.exception", {
  date: isoDate,
  skip: ref("bool"),
  startMinutes: { type: "integer", minimum: 0, maximum: 1439 },
  endMinutes: { type: "integer", minimum: 0, maximum: 1439 },
}, { required: ["date"] });

// Timed happening. Title is rig.meta.named. Place is place.address / geo.
// Do not encode iCalendar RRULE strings — recurrence is fields below.
add("rig.calendar.event", {
  startDate: isoDate,
  endDate: isoDate,
  startMinutes: { type: "integer", minimum: 0, maximum: 1439 },
  endMinutes: { type: "integer", minimum: 0, maximum: 1439 },
  status: enumOf(["confirmed", "tentative", "cancelled"]),
  organizer: ref("entity"),
}, { required: ["startDate"] });

add("rig.calendar.recurrence", {
  frequency: enumOf(["daily", "weekly", "monthly", "yearly"]),
  interval: { type: "integer", minimum: 1 },
  count: { type: "integer", minimum: 1 },
  untilDate: isoDate,
  byWeekday: {
    type: "array",
    items: { type: "boolean" },
    minItems: 7,
    maxItems: 7,
  },
}, { required: ["frequency"] });

add("rig.calendar.attendee", {
  event: ref("entity"),
  person: ref("entity"),
  role: enumOf(["chair", "required", "optional", "inform"]),
  status: enumOf(["needs-action", "accepted", "declined", "tentative"]),
}, { required: ["event", "person"] });

// --- install ---
// Show-level audio / visuals bus. Defaults: both false (open).
add("rig.install.av_bus", {
  audioMuted: ref("bool"),
  visualsBlackout: ref("bool"),
}, { required: [] });

// Discrete gated event. mode absent = forward; enabled absent = true.
add("rig.install.trigger", {
  source: ref("entity"),
  action: enumOf(["color-flash", "play-sample"]),
  enabled: ref("bool"),
  cooldownMs: ref("int"),
  calendar: ref("entity"),
  fadeInMs: ref("int"),
  holdMs: ref("int"),
  fadeOutMs: ref("int"),
  palette: { type: "array", items: ref("rgba") },
  mode: enumOf(["forward", "backward", "pendulum", "random"]),
  volume: { type: "number", minimum: 0, maximum: 1 },
  loop: ref("bool"),
  samples: { type: "array", items: ref("entity") },
}, { required: ["source", "action"] });

// --- bim (OpenBIM: IFC model + BCF + IDS) ---
// Thin layer — classify.ifcClass names the IFC type; do not invent
// rig.bim.wall / .door. Geometry stays on cad / mesh. Encodings
// (.ifc, .bcfzip, .ids) are host mappings — see docs/openbim.md.
add("rig.bim.classify", {
  ifcClass: ref("string"),
  predefinedType: ref("string"),
  scheme: ref("string"),
  code: ref("string"),
  uri: ref("string"),
}, { required: ["ifcClass"] });

add("rig.bim.type", {}, { required: [], minProperties: 0 });

add("rig.bim.occurrence", {
  type: ref("entity"),
}, { required: ["type"] });

const bimProperty = {
  type: "object",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["name", "type", "flag"],
      properties: {
        name: ref("string"),
        type: { const: "bool" },
        flag: ref("bool"),
        unit: ref("string"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["name", "type", "integer"],
      properties: {
        name: ref("string"),
        type: { const: "int" },
        integer: ref("int"),
        unit: ref("string"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["name", "type", "number"],
      properties: {
        name: ref("string"),
        type: { const: "float" },
        number: ref("float"),
        unit: ref("string"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["name", "type", "text"],
      properties: {
        name: ref("string"),
        type: { const: "string" },
        text: ref("string"),
        unit: ref("string"),
      },
    },
  ],
};

const bimPset = {
  type: "object",
  additionalProperties: false,
  required: ["name", "properties"],
  properties: {
    name: ref("string"),
    properties: { type: "array", items: bimProperty },
  },
};

add("rig.bim.pset", {
  sets: { type: "array", items: bimPset },
}, { required: ["sets"] });

add("rig.bim.site", {
  latitudeDegrees: ref("float"),
  longitudeDegrees: ref("float"),
  elevation: ref("float"),
}, { required: [] });

add("rig.bim.building", {}, { required: [], minProperties: 0 });

add("rig.bim.storey", {
  elevation: ref("float"),
}, { required: [] });

add("rig.bim.space", {}, { required: [], minProperties: 0 });

add("rig.bim.relation", {
  kind: enumOf(["voids", "fills", "connects", "aggregates", "services"]),
  a: ref("entity"),
  b: ref("entity"),
}, { required: ["kind", "a", "b"] });

add("rig.bim.topic", {
  topicType: ref("string"),
  topicStatus: ref("string"),
  priority: ref("string"),
  assignedTo: ref("string"),
  labels: { type: "array", items: ref("string") },
  stage: ref("string"),
  description: ref("string"),
  dueAt: ref("string"),
  createdBy: ref("string"),
  createdAt: ref("string"),
  modifiedAt: ref("string"),
}, { required: [] });

add("rig.bim.comment", {
  topic: ref("entity"),
  body: ref("string"),
  author: ref("string"),
  createdAt: ref("string"),
  viewpoint: ref("entity"),
}, { required: ["topic", "body"] });

const bimClipPlane = {
  type: "object",
  additionalProperties: false,
  required: ["origin", "normal"],
  properties: {
    origin: ref("vec3"),
    normal: ref("vec3"),
  },
};

add("rig.bim.viewpoint", {
  topic: ref("entity"),
  selected: { type: "array", items: ref("entity") },
  hidden: { type: "array", items: ref("entity") },
  clipPlanes: { type: "array", items: bimClipPlane },
}, { required: ["topic"] });

add("rig.bim.spec", {
  ifcVersion: enumOf(["ifc2x3", "ifc4", "ifc4x3"]),
  description: ref("string"),
  instructions: ref("string"),
  applicability: { type: "array", items: ref("entity") },
  requirements: { type: "array", items: ref("entity") },
}, { required: [] });

add("rig.bim.facet", {
  role: enumOf(["applicability", "requirement"]),
  kind: enumOf([
    "entity",
    "attribute",
    "classification",
    "property",
    "material",
    "part-of",
  ]),
  cardinality: enumOf(["required", "prohibited", "optional"]),
  ifcClass: ref("string"),
  predefinedType: ref("string"),
  attributeName: ref("string"),
  propertySet: ref("string"),
  propertyName: ref("string"),
  value: ref("string"),
  scheme: ref("string"),
  partOfClass: ref("string"),
  partOfRelation: ref("string"),
}, { required: ["role", "kind"] });

// --- sim ---
// Authored initial conditions and constants. Positions integrated at runtime
// belong to rig.spatial.transform; per-particle state is never serialized.
// Defaults: velocity (0,0,0), mass 1, drag 0; gravity absent = the host's
// ambient gravity (a per-body override, not a required constant).
add("rig.sim.rigidbody", {
  velocity: ref("vec3"),
  mass: ref("float"),
  drag: { type: "number", minimum: 0, maximum: 1 },
  gravity: ref("vec3"),
}, { required: [] });

add("rig.sim.particle_emitter", {
  rate: ref("float"),
  lifetime: ref("float"),
  maxParticles: ref("int"),
  gravity: ref("vec3"),
  damping: { type: "number", minimum: 0, maximum: 1 },
  startRgba: ref("rgba"),
  endRgba: ref("rgba"),
}, { required: ["rate", "lifetime", "maxParticles"] });

// Presence means selectable; enabled defaults true.
add("rig.interact.selectable", {
  enabled: ref("bool"),
}, { required: [], minProperties: 0 });

// --- ui (control surfaces: desktop, web, ESP) ---
// Defaults: order 0, visible true. role / preferred* are optional.
add(
  "rig.ui.panel",
  {
    role: ref("string"),
    order: ref("int"),
    visible: ref("bool"),
    preferredWidth: ref("float"),
    preferredHeight: ref("float"),
  },
  {
    required: [],
    description:
      "Portable tool surface. role is a stable tool id; preferred sizes are advisory. Dock/chrome is fulfillment.",
  }
);

// Defaults: orientation vertical, collapsed false, parent null (top-level in panel).
add(
  "rig.ui.group",
  {
    panel: ref("entity"),
    parent: ref("entity"),
    order: ref("int"),
    orientation: enumOf(["vertical", "horizontal"]),
    collapsed: ref("bool"),
  },
  {
    required: ["panel", "order"],
    description:
      "Section/row inside a panel. Nesting via parent (group entity). Flow hints are advisory.",
  }
);

add(
  "rig.ui.control",
  {
    panel: ref("entity"),
    group: ref("entity"),
    order: ref("int"),
    target: ref("entity"),
    propertyKey: ref("string"),
    type: ref("propertyType"),
    min: ref("float"),
    max: ref("float"),
    step: ref("float"),
    enabled: ref("bool"),
    readOnly: ref("bool"),
    options: { type: "array", items: ref("string") },
    widget: enumOf([
      "auto",
      "slider",
      "knob",
      "toggle",
      "field",
      "dropdown",
      "color",
      "xy",
    ]),
  },
  {
    required: ["panel", "order", "target", "propertyKey", "type"],
    description:
      "View over one POD field — never a second store. group is optional; widget is an advisory hint a host may ignore.",
  }
);

add(
  "rig.ui.action",
  {
    panel: ref("entity"),
    group: ref("entity"),
    order: ref("int"),
    actionId: ref("string"),
    enabled: ref("bool"),
  },
  {
    required: ["panel", "order", "actionId"],
    description:
      "Command button. Prefer shared actionId names for portable tools; unknown ids may be hidden. Most likely to change before 1.0.0.",
  }
);

// --- node (nested types first as standalone schemas for $ref) ---
add("rig.node.pin", {
  id: ref("uint"),
  name: ref("string"),
  kind: enumOf(["in", "out"]),
  type: ref("propertyType"),
});

// rig.node.param is defined below as a oneOf-only tagged union.

add("rig.node.link", {
  id: ref("uint"),
  fromNode: ref("uint"),
  fromPin: ref("uint"),
  toNode: ref("uint"),
  toPin: ref("uint"),
});

add("rig.node.publish", {
  pin: ref("uint"),
  innerNode: ref("uint"),
  innerPin: ref("uint"),
});

// node + graph: mutual recursion via $ref
catalog["rig.node.node"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.node.node.schema.json",
  title: "rig.node.node",
  type: "object",
  additionalProperties: false,
  required: ["id", "typeId", "title", "position", "pins", "params"],
  properties: {
    id: ref("uint"),
    typeId: ref("string"),
    title: ref("string"),
    position: ref("vec2"),
    pins: { type: "array", items: { $ref: "./rig.node.pin.schema.json" } },
    params: { type: "array", items: { $ref: "./rig.node.param.schema.json" } },
    nested: { $ref: "./rig.node.graph.schema.json" },
    publishes: {
      type: "array",
      items: { $ref: "./rig.node.publish.schema.json" },
    },
  },
};

catalog["rig.node.graph"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.node.graph.schema.json",
  title: "rig.node.graph",
  type: "object",
  additionalProperties: false,
  required: ["nodes", "links", "nextId"],
  properties: {
    nodes: { type: "array", items: { $ref: "./rig.node.node.schema.json" } },
    links: { type: "array", items: { $ref: "./rig.node.link.schema.json" } },
    nextId: ref("uint"),
  },
};

// Param is a tagged union: only the storage field selected by `type` may be present,
// so it is oneOf-only rather than a properties/required object schema.
catalog["rig.node.param"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.node.param.schema.json",
  title: "rig.node.param",
  description:
    "Serialize key, type, and only the storage field selected by type (f/i/s/v).",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "f"],
      properties: {
        key: ref("string"),
        type: { const: "float" },
        f: ref("float"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "f"],
      properties: {
        key: ref("string"),
        type: { const: "double" },
        f: ref("float"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "i"],
      properties: {
        key: ref("string"),
        type: { enum: ["bool", "int", "uint", "enum", "entity"] },
        i: ref("int"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "s"],
      properties: {
        key: ref("string"),
        type: { const: "string" },
        s: ref("string"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "v"],
      properties: {
        key: ref("string"),
        type: { enum: ["vec2", "vec3", "vec4", "quat"] },
        v: ref("vec4"),
      },
    },
  ],
};

// Document envelope
const componentIds = Object.keys(catalog).filter((id) => id !== "_defs").sort();
const componentMapProperties = Object.fromEntries(
  componentIds.map((id) => [id, { $ref: `./${id}.schema.json` }])
);

catalog["rig.document"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.document.schema.json",
  title: "rig.document",
  description:
    "Rig JSON document envelope. Component keys must be rig.<domain>.<name> schema ids.",
  type: "object",
  additionalProperties: false,
  required: ["rig", "entities"],
  properties: {
    rig: {
      type: "string",
      description: "Contract version this document targets (e.g. 0.9.0).",
      pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$",
    },
    document: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        createdAt: { type: "string" },
        modifiedAt: { type: "string" },
        defaultUnit: { type: "string" },
        colorSpace: {
          type: "string",
          description: "Colour space for all rgba/rgb values (default: srgb).",
        },
        timeZone: {
          type: "string",
          description:
            "IANA time zone for wall-clock calendar fields (e.g. Australia/Sydney). Absent = host local.",
        },
        ifcSchema: {
          type: "string",
          enum: ["ifc2x3", "ifc4", "ifc4x3"],
          description:
            "IFC schema this document was derived from. Absent = not an IFC-derived document.",
        },
        pdfX: {
          type: "string",
          description:
            "PDF/X identification (e.g. PDF/X-4). Empty/absent = not a PDF/X job.",
        },
        outputCondition: {
          type: "string",
          description:
            "OutputIntent OutputConditionIdentifier (e.g. FOGRA39, CGATS TR 001).",
        },
        trapped: {
          type: "string",
          enum: ["unknown", "true", "false"],
          description: "PDF Info Trapped; absent = unknown.",
        },
      },
    },
    entities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "components"],
        properties: {
          id: {
            type: "string",
            minLength: 1,
            description: "Stable within this file; entity-typed fields reference these ids.",
          },
          components: {
            type: "object",
            propertyNames: {
              // Contract ids, or x.<vendor>.<name> for host components the
              // Contract has not named. Extensions travel; they do not port.
              pattern: "^(rig|x)\\.[a-z0-9_]+\\.[a-z0-9_]+$",
            },
            additionalProperties: true,
            properties: componentMapProperties,
          },
        },
      },
    },
  },
};


// Shared POD datatype defs (previously hand-maintained as schemas/json/_defs.schema.json)
catalog["_defs"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/_defs.schema.json",
  $comment: "Shared property datatypes for Rig POD JSON interchange.",
  $defs: {
    bool: { type: "boolean" },
    int: { type: "integer" },
    uint: { type: "integer", minimum: 0 },
    uint8: { type: "integer", minimum: 0, maximum: 255 },
    uint32: { type: "integer", minimum: 0, maximum: 4294967295 },
    float: { type: "number" },
    double: { type: "number" },
    string: { type: "string" },
    vec2: { type: "array", minItems: 2, maxItems: 2, items: { type: "number" } },
    vec3: { type: "array", minItems: 3, maxItems: 3, items: { type: "number" } },
    vec4: { type: "array", minItems: 4, maxItems: 4, items: { type: "number" } },
    quat: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: { type: "number" },
      $comment: "Order: x, y, z, w",
    },
    rgba: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
    rgb: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
    entity: {
      type: ["string", "null"],
      $comment: "Entity id within the document; null = none / unset",
    },
    curve: {
      type: "object",
      description: "1D transfer curve — see schemas/anim/curve.md / rig.anim.curve",
      additionalProperties: false,
      properties: {
        points: {
          type: "array",
          minItems: 2,
          items: { $ref: "#/$defs/vec2" },
        },
        interpolation: {
          type: "string",
          enum: ["linear", "smooth"],
        },
        preset: enumOf([
          "linear",
          "ease-in",
          "ease-out",
          "ease-in-out",
          "s-curve",
          "bulge",
          "squeeze",
          "custom",
        ]),
      },
      required: ["points"],
    },
    propertyType: {
      type: "string",
      description: "Property datatype id from docs/properties.md (or host-prefixed).",
    },
  },
};

const checkOnly = process.argv.includes("--check");

// Working trees with core.autocrlf check these files out as CRLF; compare content, not bytes.
const normalize = (text) => text.replace(/\r\n/g, "\n");

if (checkOnly) {
  const stale = [];
  for (const [id, schema] of Object.entries(catalog)) {
    const file = path.join(outDir, `${id}.schema.json`);
    const expected = JSON.stringify(schema, null, 2) + "\n";
    const actual = fs.existsSync(file) ? normalize(fs.readFileSync(file, "utf8")) : null;
    if (actual !== expected) stale.push(path.relative(root, file));
  }
  if (stale.length) {
    console.error("schemas/json/ is out of date — run: node tools/gen-schemas.mjs");
    for (const file of stale) console.error("  ", file);
    process.exit(1);
  }
  console.log(`schemas up to date — ${Object.keys(catalog).length} schemas`);
} else {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [id, schema] of Object.entries(catalog)) {
    const file = path.join(outDir, `${id}.schema.json`);
    fs.writeFileSync(file, JSON.stringify(schema, null, 2) + "\n");
    console.log("wrote", path.relative(root, file));
  }
  console.log(`done — ${Object.keys(catalog).length} schemas`);
}
