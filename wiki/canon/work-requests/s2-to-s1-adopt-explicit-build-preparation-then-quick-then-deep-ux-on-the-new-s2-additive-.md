---
title: "adopt explicit build-preparation then Quick then Deep UX on the new S2 additive contract surfaces"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-adopt-explicit-build-preparation-then-quick-then-deep-ux-on-the-new-s2-additive-"
last_verified: "2026-04-14"
service_tags: ["s1", "s2"]
decision_tags: ["ux", "quick-deep", "build-prep", "graphrag", "contract"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-adopt-explicit-build-preparation-then-quick-then-deep-ux-on-the-new-s2-additive-"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-14T05:09:18.267Z","note":"Administrative closure requested by user during cross-lane cleanup. Marked completed for recipient lane S1 without additional implementation or verification in this S7 session."}]
registered_at: "2026-04-13T09:50:55.030Z"
completed_at: "2026-04-14T05:09:18.267Z"
---

# adopt explicit build-preparation then Quick then Deep UX on the new S2 additive contract surfaces

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 additive explicit-step migration is now far enough along that S1 can begin aligning the UX to the new backend contract.

Canonical journey intent:
1. source upload
2. SDK upload
3. explicit build-preparation
4. explicit Quick
5. Quick includes S5 GraphRAG/code-graph formation
6. explicit Deep only after the user asks for it

## S2 surfaces now available
### Build preparation
- `POST /api/projects/:pid/pipeline/prepare`
- `POST /api/projects/:pid/pipeline/prepare/:targetId`

### Analysis
- `POST /api/analysis/quick`
- `POST /api/analysis/deep`
- `POST /api/analysis/run` remains mounted only as a **legacy Quick alias**

### Analysis progress / recovery
- `/ws/analysis?analysisId=`
- additive phase: `quick_graphing`
- recovery remains:
  - `GET /api/analysis/status/:analysisId`
  - `GET /api/analysis/results/:analysisId`

## What S1 should do
1. **Expose build-preparation as its own visible step**
   - Use the new `/pipeline/prepare*` surface rather than implying Quick starts immediately after upload.

2. **Treat Quick as its own explicit action**
   - Use `/api/analysis/quick` as the primary action.
   - Do not present `/api/analysis/run` as the canonical user-facing path anymore.

3. **Treat Deep as a second explicit action**
   - Use `/api/analysis/deep` only after a Quick result exists.
   - Pass `quickAnalysisId` from the completed Quick run.

4. **Handle `quick_graphing` visibly**
   - During Quick, `/ws/analysis` may now enter `quick_graphing` while S5 GraphRAG/code-graph context is being formed.
   - Do not collapse this into a generic undifferentiated spinner if the product can show the stage label.

5. **Update copy / step semantics**
   - Stop implying a mandatory auto Quick→Deep chain.
   - UX copy should present Deep as user-triggered after reviewing Quick.

## Important compatibility note
- S2 still keeps some legacy compatibility surfaces while migration finishes.
- For new S1 work, treat the explicit surfaces above as authoritative.
- `/api/analysis/run` should be treated as a compatibility alias, not the future-facing primary UX contract.

## Recovery / follow-up note
- This WR is intentionally sent only after S2 additive surfaces are in place and verified.
- Further cleanup may still happen on S2, but the explicit-step surfaces above are now real and test-backed enough for S1 integration work to start.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
