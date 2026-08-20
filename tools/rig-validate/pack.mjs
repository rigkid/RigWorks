#!/usr/bin/env node
/**
 * Copy the catalog and starter document into this package so `npx rigkit`
 * can init and validate without a RigWorks checkout.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const schemaSrc = path.join(root, "schemas", "json");
const schemaDest = path.join(here, "schemas");

fs.rmSync(schemaDest, { recursive: true, force: true });
fs.mkdirSync(schemaDest, { recursive: true });
for (const name of fs.readdirSync(schemaSrc)) {
  if (!name.endsWith(".schema.json")) continue;
  fs.copyFileSync(path.join(schemaSrc, name), path.join(schemaDest, name));
}
fs.copyFileSync(path.join(root, "VERSION"), path.join(here, "VERSION"));
fs.copyFileSync(
  path.join(root, "examples", "minimal-scene.json"),
  path.join(here, "starter.rig")
);

const count = fs.readdirSync(schemaDest).length;
console.log(`packed ${count} schemas, VERSION, starter.rig`);
