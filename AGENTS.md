# AEGIS Static Wiki — Agent Instructions

## Purpose
This repository is the **canonical, agent-facing wiki** for AEGIS.

Primary goals:
1. preserve project direction, rationale, and decision flow across sessions
2. preserve static-analysis / S4 engineering knowledge in the same wiki
3. keep the knowledge base easy for agents to retrieve without depending on desktop UI state

## Core rules
- `wiki/canon/**` is for **canonical migrated documentation**.
- `wiki/context/**` is for **agent-facing synthesized pages** that explain, connect, or summarize canonical pages.
- Do not treat `wiki/context/**` as authoritative over `wiki/canon/**`.
- Every substantive page must carry frontmatter with provenance.
- Preserve rationale, tradeoffs, and migration history; do not reduce everything to polished summaries.
- The wiki is **offline and non-runtime-critical**. Do not design it as an AEGIS runtime dependency.
- Optimize for **agent retrieval first**. Obsidian is optional human UI only.

## Canonicality
- Canonical migrated pages must set `canonical: true`.
- Synthesized context pages must set `canonical: false` and link back to canonical sources.
- When migrating content, update `wiki/system/migration-map.md`.
- Migration happens by **bucket** (`charter`, `specs`, `api`, `handoff`, `roadmap`, `work-requests`, `feedback`).

## Provenance requirements
Every page should include at least:
- `page_type`
- `canonical`
- `source_refs`
- `last_verified`
- `service_tags`
- `decision_tags`
- `related_pages`

## Preferred workflow
1. update or migrate canonical pages
2. update system pages (`index.md`, `log.md`, `migration-map.md`) as needed
3. add or revise context pages that preserve decision flow
4. keep retrieval-friendly links explicit
5. run `python3 tools/validate_wiki.py`

## Retrieval model
- Primary future interface: wiki-focused MCP
- Current ground truth: markdown files in this repo
- Obsidian is optional and must never be the only way to access critical information
