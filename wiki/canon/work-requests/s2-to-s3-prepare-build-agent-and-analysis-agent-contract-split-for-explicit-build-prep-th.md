---
title: "prepare Build Agent and Analysis Agent contract split for explicit build-prep then explicit Deep"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-prepare-build-agent-and-analysis-agent-contract-split-for-explicit-build-prep-th"
last_verified: "2026-04-13"
service_tags: ["s2", "s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-prepare-build-agent-and-analysis-agent-contract-split-for-explicit-build-prep-th"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-13T08:40:00.442Z","note":"Consumed the request and implemented the first explicit-step contract split: Build Agent now emits result.buildPreparation, Analysis Agent accepts buildPreparation/quickContext/graphContext aliases, and canonical S3 docs were updated on 2026-04-13."}]
registered_at: "2026-04-13T08:25:45.491Z"
completed_at: "2026-04-13T08:40:00.442Z"
---

# prepare Build Agent and Analysis Agent contract split for explicit build-prep then explicit Deep

## Summary
- Kind: request
- From: s2
- To: s3

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
5. explicit Deep request only after the user asks for it

This means S3 now needs a cleaner contract boundary between:
- **Build Agent** as build-preparation capability
- **Analysis Agent** as explicit Deep-analysis capability

## What S2 needs from S3
Please prepare / confirm the S3 contract split so S2 can redesign orchestration safely.

### Requested contract outcomes
1. **Build Agent = explicit build-preparation capability**
   - Confirm the canonical request/response shape S2 should rely on when asking S3 to prepare build material.
   - Clarify what outputs S2 can treat as authoritative for the next step (for example build command, build profile, environment, or other prepared material references).

2. **Analysis Agent = explicit Deep capability**
   - Confirm the canonical Deep-analysis input once build preparation and Quick/graph context already exist.
   - Clarify which currently accepted fields are legacy convenience vs the desired long-term Deep contract.

3. **Responsibility boundary**
   - Build Agent should not implicitly stand in for the full Quick→Deep chain.
   - Analysis Agent should not assume that it must decide or synthesize the whole build-prep journey every time if S2 already prepared the prerequisite context.

4. **Legacy drift callout**
   - Current S3 public docs still allow a Deep request that carries buildCommand/buildEnvironment directly.
   - Please clarify what S3 wants to preserve for compatibility and what should become the preferred future path for explicit build-prep + explicit Deep.

## Important boundary
This WR is about **capability/API preparation** for S3-owned services.
It is **not** asking S3 to decide S1 UX or the final S2 orchestration order.

## Why now
S2 can only redesign its public/shared contract after the downstream capability boundaries are clear. S3 is a prerequisite because the new canonical journey depends on a much sharper separation between Build Agent work and Analysis Agent work.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
