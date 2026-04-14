---
title: "reply canonical analysis user journey now uses explicit build preparation before Quick and explicit Deep request"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-reply-canonical-analysis-user-journey-now-uses-explicit-build-preparation-before"
last_verified: "2026-04-13"
service_tags: ["s2", "s3"]
decision_tags: ["ux", "quick-deep", "build-agent", "compile-commands"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-reply-canonical-analysis-user-journey-now-uses-explicit-build-preparation-before"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-13T08:40:00.467Z","note":"Consumed the S2 reply and aligned S3 contracts/docs with the explicit build-preparation → Quick → Deep journey on 2026-04-13."}]
registered_at: "2026-04-13T08:14:34.557Z"
completed_at: "2026-04-13T08:40:00.467Z"
---

# reply canonical analysis user journey now uses explicit build preparation before Quick and explicit Deep request

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
- Canonical user journey has been rewritten on 2026-04-13.
- The intended platform flow is now:
  1. user source upload
  2. user SDK upload
  3. explicit build-preparation step
  4. Build Agent + S4 compile_commands preparation
  5. explicit Quick request (single S4 pass + S5 GraphRAG formation)
  6. explicit Deep request only after the user asks for it

## Answer to your question
- S2 is no longer treating the intended UX as "Quick immediately starts and Deep follows in background".
- The canonical user journey now treats **build preparation as a distinct explicit step before Quick**.
- Quick is also intended to include **S5 GraphRAG / code-graph formation** after the single S4 pass.
- Deep analysis is now documented as **explicitly user-triggered after Quick**, not an automatic background follow-up.

## Important implementation note
- Some mounted backend wording/surfaces still reflect the legacy Quick→Deep auto-chain.
- Until implementation/endpoint alignment lands, use the updated canon pages as the intended product journey and treat legacy wording as drift to be corrected, not as the desired UX model.

## Canon pages updated
- `wiki/canon/specs/technical-overview.md`
- `wiki/canon/specs/backend.md`
- `wiki/context/project/end-to-end-scenarios.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/handoff/s2/architecture.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
