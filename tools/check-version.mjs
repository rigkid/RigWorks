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
 * second copy of the current version.
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
  .trim();

if (!SEMVER.test(versionRaw)) {
  fail(`VERSION must be MAJOR.MINOR.PATCH SemVer (got ${JSON.stringify(versionRaw)})`);
}

const schemaCount = fs
  .readdirSync(path.join(root, "schemas", "json"))
  .filter((n) => n.endsWith(".schema.json") && n !== "_defs.schema.json").length;

const site = fs.readFileSync(path.join(root, "site", "index.html"), "utf8");
const badgeVer = site.match(/class="badge">v([0-9]+\.[0-9]+\.[0-9]+)\s*·/);
const badgeCount = site.match(/class="badge">([0-9]+)\s+schemas</);
if (!badgeVer) {
  fail('site/index.html missing version badge (vX.Y.Z · draft)');
} else if (badgeVer[1] !== versionRaw) {
  fail(`site badge is v${badgeVer[1]}, VERSION is ${versionRaw}`);
}
if (!badgeCount) {
  fail('site/index.html missing "N schemas" badge');
} else if (Number(badgeCount[1]) !== schemaCount) {
  fail(
    `site badge says ${badgeCount[1]} schemas, schemas/json has ${schemaCount} (excluding _defs)`
  );
}

if (failed) process.exit(1);
console.log(`ok - Contract version ${versionRaw} (SemVer), ${schemaCount} schemas`);
