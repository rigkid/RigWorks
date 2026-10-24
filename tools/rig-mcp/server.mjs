#!/usr/bin/env node
/**
 * Rig MCP server - the Contract as callable tools for any agent.
 *
 *   node tools/rig-mcp/server.mjs
 *
 * Newline-delimited JSON-RPC over stdio (MCP). No dependencies beyond
 * Node and the repo itself: schemas come from schemas/index.json and the
 * prose files, validation shells out to tools/rig-validate/cli.js so the
 * answer an agent gets here is byte-identical to the CLI a human runs.
 *
 * Tools:
 *   list_schemas       - catalog ids, filtered by maturity / free text
 *   get_schema         - one schema: tier, fields, prose meaning
 *   find_examples      - worked documents that use a schema id
 *   validate_document  - rig-validate verdict for a document
 *   get_skill          - the generation skill (router or one domain slice)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const index = JSON.parse(fs.readFileSync(path.join(root, "schemas", "index.json"), "utf8"));
const byId = new Map(index.schemas.map((s) => [s.id, s]));

function exampleFiles() {
  const out = [];
  const walk = (dir, kind) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p, entry.name === "coverage" ? "coverage specimen" : kind);
      else if (entry.name.endsWith(".json")) out.push({ file: path.relative(root, p).replaceAll("\\", "/"), kind, text: fs.readFileSync(p, "utf8") });
    }
  };
  walk(path.join(root, "examples"), "teaching example");
  return out;
}

const TOOLS = [
  {
    name: "list_schemas",
    description: "List Rig schema ids with maturity tier and summary. Filter by maturity (stable|draft|experimental) and/or free-text query. Prefer stable ids when generating.",
    inputSchema: {
      type: "object",
      properties: {
        maturity: { type: "string", enum: ["stable", "draft", "experimental"] },
        query: { type: "string", description: "Substring matched against id and summary" },
        limit: { type: "number", description: "Max results (default 50)" },
      },
    },
  },
  {
    name: "get_schema",
    description: "Full detail for one schema id: maturity, every field (name, type, required, meaning, absent-default), and the prose body.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
  },
  {
    name: "find_examples",
    description: "Worked Rig documents that use a schema id, marked teaching example (copy these) or coverage specimen (validator fodder, do not imitate).",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
  },
  {
    name: "validate_document",
    description: "Validate a Rig document with rig-validate (envelope, fields, semantic rules). Returns the CLI output; ok=true only when it prints ok.",
    inputSchema: {
      type: "object",
      properties: {
        document: { description: "The document as a JSON object or JSON string" },
        strict: { type: "boolean", description: "Treat unknown schema ids as errors and get closest-id suggestions" },
      },
      required: ["document"],
    },
  },
  {
    name: "get_skill",
    description: "The Rig generation skill. No argument returns the router; pass a slice name (scene, layout-story, font, music-audio, people-calendar, commerce-records, knowledge, bim-cad, machines, sim-vr-play, ui-node) for that domain slice.",
    inputSchema: { type: "object", properties: { slice: { type: "string" } } },
  },
];

function fieldLine(f) {
  const parts = [`${f.name} (${f.ref ?? f.type}${f.required ? ", required" : ""})`];
  if (f.meaning) parts.push(f.meaning);
  if (f.absent !== undefined) parts.push(`absent = ${f.absent}`);
  return `  - ${parts.join(" - ")}`;
}

async function callTool(name, args = {}) {
  switch (name) {
    case "list_schemas": {
      const limit = Math.min(args.limit ?? 50, 294);
      let list = index.schemas;
      if (args.maturity) list = list.filter((s) => s.maturity === args.maturity);
      if (args.query) {
        const q = args.query.toLowerCase();
        list = list.filter((s) => s.id.toLowerCase().includes(q) || (s.summary ?? "").toLowerCase().includes(q));
      }
      const shown = list.slice(0, limit);
      return `${list.length} schemas${args.maturity ? ` (${args.maturity})` : ""}${list.length > shown.length ? `, first ${shown.length}` : ""}:\n` +
        shown.map((s) => `${s.id} [${s.maturity}] - ${s.summary ?? ""}`).join("\n");
    }
    case "get_schema": {
      const s = byId.get(args.id);
      if (!s) {
        const close = index.schemas.map((x) => x.id).filter((id) => id.includes((args.id ?? "").split(".").pop() ?? ""));
        return `unknown schema id "${args.id}"${close.length ? ` - closest ids: ${close.slice(0, 5).join(", ")}` : ""}`;
      }
      const prose = fs.readFileSync(path.join(root, s.prose), "utf8");
      const body = prose.split(/^---$/m).slice(2).join("---").trim();
      return `${s.id} [${s.maturity}] - ${s.summary ?? ""}\n\nFields:\n${(s.fields ?? []).map(fieldLine).join("\n")}\n\n${body}`;
    }
    case "find_examples": {
      const hits = exampleFiles().filter((e) => e.text.includes(`"${args.id}"`));
      if (!hits.length) return `no example uses ${args.id} - compose it from get_schema, or pick a better-exemplified id`;
      return hits.map((e) => `${e.file} (${e.kind})`).join("\n");
    }
    case "validate_document": {
      const text = typeof args.document === "string" ? args.document : JSON.stringify(args.document, null, 2);
      const tmp = path.join(os.tmpdir(), `rig-mcp-${process.pid}-${Date.now()}.json`);
      fs.writeFileSync(tmp, text);
      try {
        const cliArgs = [...(args.strict ? ["--strict"] : []), tmp];
        const { stdout, code } = await new Promise((resolve) => {
          execFile(process.execPath, [path.join(root, "tools", "rig-validate", "cli.js"), ...cliArgs], { cwd: root }, (err, out, stderr) => {
            resolve({ stdout: (out + stderr).trim(), code: err ? (err.code ?? 1) : 0 });
          });
        });
        return `exit ${code}\n${stdout.replaceAll(tmp, "document.json")}`;
      } finally {
        fs.rmSync(tmp, { force: true });
      }
    }
    case "get_skill": {
      const skillDir = path.join(root, "skills", "generating-rig-documents");
      if (!args.slice) return fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8");
      const file = path.join(skillDir, "domains", `${args.slice}.md`);
      if (!fs.existsSync(file)) {
        const slices = fs.readdirSync(path.join(skillDir, "domains")).map((n) => n.replace(/\.md$/, ""));
        return `unknown slice "${args.slice}" - slices: ${slices.join(", ")}`;
      }
      return fs.readFileSync(file, "utf8");
    }
    default:
      throw new Error(`unknown tool "${name}"`);
  }
}

/* ----- newline-delimited JSON-RPC (MCP stdio transport) ----- */

const rl = readline.createInterface({ input: process.stdin });
const send = (msg) => process.stdout.write(JSON.stringify(msg) + "\n");

rl.on("line", async (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (id === undefined || id === null) return; // notification
  try {
    switch (method) {
      case "initialize":
        send({ jsonrpc: "2.0", id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "rig-mcp", version: "1.0.0" } } });
        break;
      case "ping":
        send({ jsonrpc: "2.0", id, result: {} });
        break;
      case "tools/list":
        send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
        break;
      case "tools/call": {
        const text = await callTool(params?.name, params?.arguments ?? {});
        send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }] } });
        break;
      }
      default:
        send({ jsonrpc: "2.0", id, error: { code: -32601, message: `method not found: ${method}` } });
    }
  } catch (err) {
    send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: `error: ${err.message}` }], isError: true } });
  }
});
