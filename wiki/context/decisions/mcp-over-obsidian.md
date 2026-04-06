---
title: "Why agents should use MCP over Obsidian"
page_type: "context-decision"
canonical: false
source_refs:
  - "../../system/index.md"
  - "../../system/writing-guide.md"
last_verified: "2026-04-05"
service_tags: ["platform"]
decision_tags: ["retrieval", "mcp", "obsidian"]
related_pages:
  - "./canonical-wiki.md"
  - "../../system/taxonomy.md"
---

# Why agents should use MCP over Obsidian

## Decision
Agents should retrieve wiki content through a wiki-focused MCP rather than relying on Obsidian or Obsidian CLI as the primary interface.

## Reasoning
- Obsidian is primarily a human reading and navigation UI.
- Agent workflows need retrieval that is stable in headless environments and independent of desktop application state.
- The markdown repository itself is the canonical data layer; MCP should expose search, read, backlinks, provenance, and migration-path lookup on top of that layer.

## Human role for Obsidian
Obsidian remains useful as an optional UI for browsing the same markdown files, especially for graph view and manual exploration.

## Retrieval implication
The repository must stay useful through plain file traversal even before the MCP is implemented.


## Related notes
- [[Home]]
- [[wiki/system/index]]
- [[wiki/context/decisions/canonical-wiki]]
- [[wiki/context/services/s4-sast-runner]]
