#!/usr/bin/env node
/**
 * Enforce release tagging on the release branch.
 *
 *   node tools/check-tag.mjs
 *
 * Rule: before `master`/`main` is pushed, the tag `v<VERSION>` must exist,
 * must name the current VERSION at the tagged commit, and the tagged commit
 * must be an ancestor of HEAD. Tags are how a Contract version stops being
 * a moving branch and becomes citable - an untagged VERSION bump is a
 * release nobody can reference.
 *
 * On other branches (and in detached CI checkouts) this is a no-op unless
 * RIG_REQUIRE_TAG=1 is set. It is wired into the pre-push hook, not into
 * `npm run check`, so day-to-day branch work is not blocked by it.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const git = (args) => execSync(`git ${args}`, { cwd: root, encoding: "utf8" }).trim();

let branch = "";
try { branch = git("rev-parse --abbrev-ref HEAD"); } catch { /* not a git tree */ }
const onReleaseBranch = branch === "master" || branch === "main";
if (!onReleaseBranch && process.env.RIG_REQUIRE_TAG !== "1") {
  console.log(`tag check skipped - not on master/main (branch: ${branch || "detached"})`);
  process.exit(0);
}

const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();
const tag = `v${version}`;

let taggedCommit;
try {
  taggedCommit = git(`rev-list -n 1 ${tag}`);
} catch {
  console.error(`check-tag: tag ${tag} does not exist - tag the release commit before pushing ${branch}: git tag -a ${tag} -m "RigWorks ${version}"`);
  process.exit(1);
}

let versionAtTag = "";
try { versionAtTag = git(`show ${tag}:VERSION`); } catch { /* handled below */ }
if (versionAtTag !== version) {
  console.error(`check-tag: tag ${tag} points at a commit whose VERSION is ${JSON.stringify(versionAtTag)}, not ${version}`);
  process.exit(1);
}

try {
  git(`merge-base --is-ancestor ${taggedCommit} HEAD`);
} catch {
  console.error(`check-tag: tag ${tag} (${taggedCommit.slice(0, 7)}) is not an ancestor of HEAD - the tag and the branch have diverged`);
  process.exit(1);
}

console.log(`ok - release tag ${tag} at ${taggedCommit.slice(0, 7)} matches VERSION ${version}`);
