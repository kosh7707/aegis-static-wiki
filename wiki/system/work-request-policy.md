---
title: "Work request policy"
page_type: "system-work-request-policy"
canonical: false
source_refs:
  - "../../AGENTS.md"
  - "./writing-guide.md"
last_verified: "2026-04-06"
service_tags: ["platform"]
decision_tags: ["work-requests", "mcp", "policy"]
related_pages:
  - "./writing-guide.md"
  - "./session-history-policy.md"
  - "./test-evidence-policy.md"
---

# Work request policy

Canonical work requests live under `wiki/canon/work-requests/**`.

## Core model
- one unified WR schema
- `wr_kind`: `request | reply | notice | question`
- global state: `open | completed`
- recipient completion is recipient-scoped
- completion metadata lives in `completed_by`

## Completion rule
- only recipients may complete a WR
- multi-recipient WRs close globally only when all listed recipients are complete
- `to-all` completion records who completed it, but does not force a global close

## Preferred MCP surface
- `list_my_open_wrs`
- `register_wr`
- `complete_wr`
