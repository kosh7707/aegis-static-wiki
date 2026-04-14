---
title: "prepare Quick-stage code-graph and GraphRAG capability contract for the new analysis journey"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal"
last_verified: "2026-04-13"
service_tags: ["s2", "s5"]
decision_tags: ["quick-deep", "graphrag", "code-graph", "contract"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md", "wiki/canon/api/knowledge-base-api.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-04-13T08:36:23.570Z","note":"Implemented the S5-side Quick-stage capability contract: ingest now returns repeatable replace semantics plus authoritative ready/partial/empty readiness signals, canonical API/spec docs were updated, and a reply WR was sent to S2 at wiki/canon/work-requests/s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared.md."}]
registered_at: "2026-04-13T08:25:45.480Z"
completed_at: "2026-04-13T08:36:23.570Z"
---

# prepare Quick-stage code-graph and GraphRAG capability contract for the new analysis journey

## Summary
- Kind: request
- From: s2
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 has rewritten the canonical analysis user journey.

The intended journey is now:
1. source upload
2. SDK upload
3. explicit build-preparation step
4. explicit Quick request
5. Quick includes S4 one-shot scan **and S5 code-graph / GraphRAG formation**
6. explicit Deep request only after the user asks for it

S2 needs S5 capability preparation before it can safely rework orchestration and shared contracts.

## What S2 needs from S5
Please prepare / confirm the S5 contract for **Quick-stage graph formation**.

### Requested contract outcomes
1. **Caller-controlled ingest capability**
   - Confirm the canonical ingest surface S2 should call for Quick-stage code-graph / GraphRAG formation.
   - Clarify the minimum required input shape and authoritative success response.

2. **Idempotent / repeatable caller semantics**
   - S2 may later choose to trigger graph formation after source upload, after build-prep, or after Quick.
   - Please clarify whether the ingest surface is safe for repeated caller-driven use and what the replacement / overwrite semantics are.

3. **Readiness / completion semantics**
   - Define what S2 may treat as "graph ready" for the next stage.
   - Clarify degraded / unavailable / partial-ingest behavior so S2 can model state transitions cleanly.

4. **GraphRAG role in the new flow**
   - Quick now includes graph formation, but S2 still owns the final orchestration decision.
   - Please keep the S5 response focused on capability readiness, not frontend/user-journey policy.

## Important boundary
This WR is about preparing the **capability contract** for S5.
It is **not** asking S5 to decide whether the final trigger should be on upload, on build-prep completion, or on Quick completion. S2 will decide that orchestration later.

## Why now
Quick-stage GraphRAG formation is part of the rewritten canonical journey, but S2 cannot safely redesign its orchestration/API layer until the S5 ingest/readiness contract is explicit.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
