#!/usr/bin/env node
/**
 * Install RigWorks git hooks (SemVer pre-commit + full CI pre-push).
 * Usage: node tools/install-hooks.mjs
 *        npm run hooks:install
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hooksSrc = path.join(root, "tools", "hooks");

const gitPath = spawnSync("git", ["rev-parse", "--git-path", "hooks"], {
  encoding: "utf8",
  cwd: root,
});
if (gitPath.status !== 0) {
  console.error(gitPath.stderr || "git rev-parse --git-path hooks failed");
  process.exit(1);
}

const hooksDir = path.resolve(root, gitPath.stdout.trim());
fs.mkdirSync(hooksDir, { recursive: true });

for (const name of ["pre-commit", "pre-push"]) {
  const src = path.join(hooksSrc, `${name}.sh`);
  const dest = path.join(hooksDir, name);
  // Normalize to LF so Git for Windows / sh can run the hook.
  const body = fs.readFileSync(src, "utf8").replace(/\r\n/g, "\n");
  fs.writeFileSync(dest, body, { mode: 0o755 });
  try {
    fs.chmodSync(dest, 0o755);
  } catch {
    // Windows may ignore mode bits.
  }
  console.log(`Installed ${name} hook from ${path.relative(root, src)}`);
}
