# aegis-static-wiki

Canonical, agent-facing wiki for AEGIS.

## What this repo is for
- migrate [[wiki/system/migration-map|AEGIS/docs]] into a canonical markdown wiki
- preserve project history, rationale, and decision flow for future coding agents
- keep S4/static-analysis engineering knowledge in the same system
- support future agent retrieval through a wiki-focused MCP

## Information model
- `wiki/canon/**` — canonical migrated documentation
- `wiki/context/**` — synthesized agent-facing context pages
- `wiki/system/**` — index, log, taxonomy, migration map
- `raw/**` — import/snapshot staging
- `templates/**` — page templates
- `schemas/**` — metadata/frontmatter guidance
- `tools/**` — migration and validation scripts

## Bootstrap status
Current bootstrap covers:
- repo spine
- metadata schema guidance
- seed canonical migration for:
  - `docs/AEGIS.md`
  - `docs/specs/**`
  - `docs/api/**`
- initial context pages for canonicality and retrieval decisions

## Commands
```bash
python3 tools/migrate_seed_docs.py
python3 tools/validate_wiki.py
```

## UI and retrieval
- **Agents:** markdown + future MCP
- **Humans:** markdown directly or Obsidian as optional UI


## Obsidian
- Open this repo as an Obsidian vault.
- Use [[Home]] as the main dashboard note.
- Use [[wiki/system/index]] for the canonical navigation entrypoint.
