/**
 * Enforce Semantic Versioning for the Contract.
 *
 *   node tools/check-version.mjs
 *
 * [`VERSION`](../VERSION) is the only source of truth for the current
 * Contract version. This check:
 *   - requires VERSION to be a strict MAJOR.MINOR.PATCH SemVer core
 *   - requires site/index.html badges to match VERSION and the schema count
 *
 * History notes in docs/versioning.md are manual release notes — not a
 * second copy of the current version. Docs-only commits do not bump VERSION.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEMVER = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/;

let failed = false;
function fail(msg) {
  console.error(`check-version: ${msg}`);
  failed = true;
}

const versionRaw = fs
  .readFileSync(path.join(root, "VERSION"), "utf8")
  .replace(/^\uFEFF/, "")
  .trim();

if (!SEMVER.test(versionRaw)) {
  fail(
    `VERSION must be MAJOR.MINOR.PATCH (got ${JSON.stringify(versionRaw)}). ` +
      `Only bump when schema meaning changes — not for docs/hooks/skill edits.`
  );
}

const schemaCount = fs
  .readdirSync(path.join(root, "schemas", "json"))
  .filter((n) => n.endsWith(".schema.json") && n !== "_defs.schema.json").length;

const sitePath = path.join(root, "site", "index.html");
if (!fs.existsSync(sitePath)) {
  fail(`missing ${path.relative(root, sitePath)}`);
} else {
  const site = fs.readFileSync(sitePath, "utf8");
  // Allow middle-dot or plain hyphen between version and "draft".
  const badgeVer = site.match(
    /class="badge">v([0-9]+\.[0-9]+\.[0-9]+)\s*[·.•∙⋅\-–—]\s*draft/
  );
  const badgeCount = site.match(/class="badge">([0-9]+)\s+schemas</);
  if (!badgeVer) {
    fail(
      'site/index.html needs a version badge like: <span class="badge">v0.10.0 · draft</span>'
    );
  } else if (badgeVer[1] !== versionRaw) {
    fail(
      `site badge is v${badgeVer[1]} but VERSION is ${versionRaw} — make the badge match VERSION (do not invent a second number)`
    );
  }
  if (!badgeCount) {
    fail(
      'site/index.html needs a count badge like: <span class="badge">72 schemas</span>'
    );
  } else if (Number(badgeCount[1]) !== schemaCount) {
    fail(
      `site badge says ${badgeCount[1]} schemas, but schemas/json has ${schemaCount} (excluding _defs) — update the badge`
    );
  }
}

if (failed) process.exit(1);
console.log(`ok - Contract version ${versionRaw} (SemVer), ${schemaCount} schemas`);
