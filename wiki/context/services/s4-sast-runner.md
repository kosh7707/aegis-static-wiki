---
title: "S4 / SAST Runner context"
page_type: "context-service"
canonical: false
source_refs:
  - "../../canon/specs/sast-runner.md"
  - "../../canon/api/sast-runner-api.md"
  - "../../canon/specs/technical-overview.md"
last_verified: "2026-04-05"
service_tags: ["s4"]
decision_tags: ["detection", "service-context"]
related_pages:
  - "../decisions/canonical-wiki.md"
  - "../../system/index.md"
---

# S4 / SAST Runner context

## Role in the platform
S4 is the deterministic static-analysis service in AEGIS. It runs multiple SAST tools, build/context extraction, and related preprocessing so that downstream analysis can remain evidence-first.

## Why it matters in this wiki
The repo is meant to preserve both project-level decision flow and detection-engineering knowledge. S4 is the main bridge between those two goals because its rule tuning, benchmark interpretation, and build-context quirks are exactly the kind of knowledge that tends to disappear across sessions.

## Canonical pages to start from
- [[wiki/canon/specs/sast-runner|SAST Runner spec]]
- [[wiki/canon/api/sast-runner-api|SAST Runner API]]
- [[wiki/canon/specs/technical-overview|Technical overview]]

## Expected future context pages
- recurring false-positive patterns
- benchmark/regression summaries
- SDK/build failure memory
- tool-profile tradeoff pages


## Related notes
- [[Home]]
- [[wiki/system/index]]
- [[wiki/context/decisions/canonical-wiki]]
- [[wiki/context/decisions/mcp-over-obsidian]]
