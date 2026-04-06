---
title: "Why the wiki is canonical"
page_type: "context-decision"
canonical: false
source_refs:
  - "../../canon/charter/aegis.md"
  - "../../../README.md"
  - "../../system/migration-map.md"
  - "../../system/writing-guide.md"
last_verified: "2026-04-05"
service_tags: ["platform"]
decision_tags: ["canonicality", "migration", "agent-memory"]
related_pages:
  - "../../system/migration-map.md"
  - "../../system/taxonomy.md"
  - "./mcp-over-obsidian.md"
---

# Why the wiki is canonical

## Decision
`aegis-static-wiki` is the canonical home for migrated AEGIS documentation rather than a secondary summary layer.

## Why this was chosen
- Future agent sessions need one place to recover prior decisions and official context.
- A shadow wiki would create long-term drift between [[wiki/system/migration-map|AEGIS/docs]] and the agent-facing knowledge base.
- The owner explicitly chose one unified repository that holds both project-history knowledge and S4/static-analysis knowledge.

## Consequences
- Canonical and synthesized pages must be clearly distinguished.
- Migration must preserve old-path provenance.
- Bucket cutovers need explicit status tracking in the migration map.

## Follow-up question
How much of the old [[wiki/system/migration-map|AEGIS/docs]] tree should remain as redirect/pointer stubs after each bucket is cut over?


## Related notes
- [[Home]]
- [[wiki/system/index]]
- [[wiki/system/migration-map]]
- [[wiki/context/decisions/mcp-over-obsidian]]
- [[wiki/context/services/s4-sast-runner]]
