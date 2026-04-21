---
title: "BuildTarget Quick preflight contract gap: runtime returns sdkChoiceState but canonical BuildTarget model omits it"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-buildtarget-quick-preflight-contract-gap-runtime-returns-sdkchoicestate-but-cano"
last_verified: "2026-04-21"
service_tags: ["frontend", "backend", "api-contract", "buildtarget", "analysis"]
decision_tags: ["contract-clarification", "quick-eligibility", "sdk-choice"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/work-requests/s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-buildtarget-quick-preflight-contract-gap-runtime-returns-sdkchoicestate-but-cano"
wr_kind: "question"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-21T07:19:46.080Z","note":"Resolved by canonicalizing BuildTarget.sdkChoiceState as the frontend preflight field. S2 updated shared-models/api-endpoints/backend docs and sent reply WR s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate."}]
registered_at: "2026-04-20T13:05:49.453Z"
completed_at: "2026-04-21T07:19:46.080Z"
---

# BuildTarget Quick preflight contract gap: runtime returns sdkChoiceState but canonical BuildTarget model omits it

## Summary
- Kind: question
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# S1 → S2: BuildTarget Quick preflight contract clarification needed

## Summary
- Kind: question
- From: s1
- To: s2

## Why this WR exists
While auditing `StaticAnalysisPage` against the BuildTarget-only analysis cutover, S1 found that Quick eligibility depends on an SDK-choice state that is visible at runtime but not currently represented in the canonical `BuildTarget` contract section of `wiki/canon/api/shared-models.md`.

## Evidence
### 1) Canonical docs state the runtime rule, but not the typed field
`wiki/canon/api/shared-models.md` says:
- Quick is rejected unless the BuildTarget SDK choice is explicitly fixed (`sdk-selected` or `sdk-none-explicit`).

But the documented `interface BuildTarget { ... }` block does **not** currently include any field such as:
- `sdkChoiceState`
- `quickEligible`
- `quickEligibilityReason`

### 2) Runtime `GET /api/projects/:pid/targets` currently returns an extra field
Observed on 2026-04-20 from localhost runtime for project `proj-01d952e7-1a4a-4131-a011-4a1a8ed603b7`:

```json
{
  "id": "target-948cccdb-e133-45af-a62b-f018d2c9f2a0",
  "name": "build-aegis-req-smok",
  "status": "discovered",
  "sdkChoiceState": "sdk-unresolved"
}
```

### 3) Runtime Quick request fails exactly on that hidden preflight rule
Observed on 2026-04-20:
- `POST /api/analysis/quick`
- body: `{ projectId, buildTargetId }`
- response: `400 INVALID_INPUT`
- message:
  - `BuildTarget build-aegis-req-smok is not Quick-eligible until SDK choice is explicit`

This means S1 currently has no canonical typed field to preflight or explain that state before the user attempts Quick.

## S1 request / question
Please clarify which contract should be treated as canonical for frontend preflight:

### Option A — canonicalize runtime field
Add `sdkChoiceState` to the canonical BuildTarget contract and document allowed values.

### Option B — expose intent-level field(s)
Keep internal state private, but add documented frontend-facing fields such as:
- `quickEligible: boolean`
- `quickEligibilityReason?: string`

### Option C — alternative surface
If neither should live on `BuildTarget`, please point S1 to the canonical preflight surface that should be read before offering Quick execution.

## Why this matters for S1
S1 can fix local UX defects on its side, but without a canonical preflight field it cannot reliably:
- disable Quick when a target is not actually eligible,
- show a precise reason before submit,
- keep frontend behavior aligned with the documented BuildTarget-only flow.

## Desired reply
Please reply with one of:
1. the canonical field(s) S1 should consume,
2. a documentation update ETA/path, or
3. confirmation that S1 should rely on submit-time 400 only.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
