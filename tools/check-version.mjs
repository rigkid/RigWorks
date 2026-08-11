/**
 * Enforce Semantic Versioning for the Contract.
 *
 *   node tools/check-version.mjs
 *
 * [`VERSION`](../VERSION) is the only source of truth for the current
 * Contract version. This check requires it to be a strict MAJOR.MINOR.PATCH
 * SemVer core (no pre-release / build metadata).
 *
 * History notes in docs/versioning.md are manual release notes — not a
 * second copy of the current version.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEMVER = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/;

const versionRaw = fs
  .readFileSync(path.join(root, "VERSION"), "utf8")
  .trim();

if (!SEMVER.test(versionRaw)) {
  console.error(
    `check-version: VERSION must be MAJOR.MINOR.PATCH SemVer (got ${JSON.stringify(versionRaw)})`
  );
  process.exit(1);
}

console.log(`ok - Contract version ${versionRaw} (SemVer)`);
