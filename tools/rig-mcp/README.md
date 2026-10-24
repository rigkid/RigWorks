# rig-mcp

The Rig Contract as callable tools for any MCP-capable agent (Claude, Cursor, and peers). No dependencies beyond Node — the server reads `schemas/index.json` and the prose schemas, and validation shells out to `tools/rig-validate/cli.js`, so an agent's verdict is byte-identical to the CLI a human runs.

```bash
node tools/rig-mcp/server.mjs
```

## Tools

| Tool | What it does |
|------|--------------|
| `list_schemas` | Catalog ids by maturity / free text — prefer `stable` when generating |
| `get_schema` | One schema in full: tier, fields, prose meaning |
| `find_examples` | Worked documents using an id, marked teaching vs coverage specimen |
| `validate_document` | rig-validate verdict (envelope, fields, semantic rules) |
| `get_skill` | The generation skill — router, or one domain slice |

## Wire it up

Claude Code / Cursor MCP config:

```json
{
  "mcpServers": {
    "rig": {
      "command": "node",
      "args": ["tools/rig-mcp/server.mjs"],
      "cwd": "/path/to/RigWorks"
    }
  }
}
```

With the server attached, the generation loop is: `list_schemas` (stable first) → `find_examples` → copy the pattern → emit → `validate_document` until `ok`. The same loop the [skill](../../skills/generating-rig-documents/SKILL.md) teaches, without shelling out.
