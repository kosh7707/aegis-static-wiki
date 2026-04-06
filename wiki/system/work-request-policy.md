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
Archived legacy WR files may exist under `docs/work-requests/**` in the AEGIS repo, but they are **not** part of runtime WR semantics.

## Core model
- one unified WR schema
- `wr_kind`: `request | reply | notice | question`
- global state: `open | completed`
- recipient completion is recipient-scoped
- completion metadata lives in `completed_by`
- only canonical new-format WR pages participate in MCP runtime listing/completion

## Completion rule
- only recipients may complete a WR
- multi-recipient WRs close globally only when all listed recipients are complete
- `to-all` completion records who completed it, but does not force a global close

## Archive boundary
- archived docs WRs are preserved for human reference only
- `list_my_open_wrs`, `register_wr`, and `complete_wr` target canonical WR pages only
- archived docs WRs do not affect `list_my_open_wrs` results
- archived docs WRs cannot be completed through runtime WR semantics

## Preferred MCP surface
- these tools operate on canonical new-format WRs only
- archived docs/work-requests entries are excluded from runtime semantics
- `list_my_open_wrs`
- `register_wr`
- `complete_wr`
