# aegis-static-wiki

Canonical, agent-facing wiki for AEGIS.

## What this repo is for
- migrate [[wiki/system/migration-map|AEGIS/docs]] into a canonical markdown wiki
- preserve project history, rationale, and decision flow for future coding agents
- keep S4/static-analysis engineering knowledge in the same system
- support agent retrieval and maintenance through a wiki-focused MCP

## Canonical usage
- AEGIS sessions should start here, not from `AEGIS/docs/**`.
- Source-repo `docs/**` now exists as a migration/compatibility surface.
- The canonical navigation entrypoint is `wiki/system/index.md`.

## Information model
- `wiki/canon/**` — canonical migrated documentation
- `wiki/context/**` — synthesized agent-facing context pages
- `wiki/system/**` — index, log, taxonomy, migration map
- `raw/**` — import/snapshot staging
- `templates/**` — page templates
- `schemas/**` — metadata/frontmatter guidance
- `tools/**` — migration and validation scripts

## Current phase status
Current coverage now includes:
- canonical migration of `docs/AEGIS.md`, `docs/specs/**`, and `docs/api/**`
- canonical migration of all handoff, roadmap, work-request, and feedback buckets
- authoritative `wiki/system/index.md`, `wiki/system/log.md`, and `wiki/system/writing-guide.md`
- a typed read/write MCP server for agent retrieval and maintenance workflows

## Commands
```bash
python3 tools/validate_wiki.py
node tools/wiki/migrateRemaining.js
node tools/wiki/rebuildIndex.js
node tools/wiki/mcpServer.js
npm test
```

## UI and retrieval
- **Agents:** markdown + typed read/write MCP
- **Humans:** markdown directly or Obsidian as optional UI


## Obsidian
- Open this repo as an Obsidian vault.
- Use [[Home]] as the main dashboard note.
- Use [[wiki/system/index]] for the canonical navigation entrypoint.


## Maintenance
- Main writing guide: [[wiki/system/writing-guide]]
- Content index: [[wiki/system/index]]
- Chronological log: [[wiki/system/log]]


## MCP
- Project config: `.mcp.json`
- Claude project enablement: `.claude/settings.local.json`
- The MCP exposes typed read/write tools for page updates, log appends, index rebuilds, and migration-status transitions.
