---
title: "AEGIS static wiki writing guide"
page_type: "system-writing-guide"
canonical: false
source_refs:
  - "../../AGENTS.md"
  - "../../README.md"
  - "../../../.omx/plans/prd-aegis-static-wiki-next-phase.md"
last_verified: "2026-04-05"
service_tags: ["platform"]
decision_tags: ["maintenance", "mcp", "index", "log"]
related_pages: ["./index.md", "./log.md", "./migration-map.md", "../../Home.md"]
---

# AEGIS Static Wiki Writing Guide

This is the main maintenance contract for the wiki.

## Core rule
Agents should prefer **typed MCP operations** over ad-hoc manual edits for critical maintenance files.

## Control files
- `wiki/system/index.md` — content-oriented catalog of the wiki
- `wiki/system/log.md` — append-only chronological activity ledger
- `wiki/system/migration-map.md` — source-to-target migration ledger
- `wiki/system/writing-guide.md` — this contract

## Required maintenance behavior
### When pages are added or migrated
1. write or migrate the page canonically
2. update `migration-map.md` status if source coverage changed
3. rebuild/update `index.md`
4. append a `log.md` entry

### When pages are edited through MCP
- Use `write_page` for typed page upserts
- Use `append_log_entry` for `log.md`
- Use `update_index` for deterministic index regeneration
- Use `record_migration_transition` for migration-map status changes

## Log format
Use parseable headings:

```md
## [YYYY-MM-DD] <event> | <subject>
- detail 1
- detail 2
```

Events should be short and stable, for example:
- `migration`
- `maintenance`
- `query`
- `lint`
- `mcp`

## Index expectations
`index.md` should list the wiki by category and give each page:
- a link
- a one-line summary
- optionally lightweight metadata such as verification date or service tags

## Canonicality rules
- `wiki/canon/**` pages are canonical migrated documentation.
- `wiki/context/**` pages are synthesized and must not silently override canonical meaning.
- `wiki/system/**` pages define operational control surfaces.

## Prohibited maintenance pattern
Do **not** treat raw freehand edits to `index.md`, `log.md`, or `migration-map.md` as the normal maintenance path when MCP is available.

## Operational note
Obsidian is optional human UI. Agent maintenance should remain correct even when Obsidian is not present.
