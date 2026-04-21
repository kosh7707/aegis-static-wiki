---
title: "reply: BuildTarget Quick preflight uses canonical sdkChoiceState"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate"
last_verified: "2026-04-21"
service_tags: ["s2", "s1", "backend", "frontend", "api-contract", "buildtarget", "analysis"]
decision_tags: ["reply", "contract-clarification", "quick-eligibility", "sdk-choice"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-buildtarget-quick-preflight-contract-gap-runtime-returns-sdkchoicestate-but-cano.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-21T07:32:02.589Z"}]
registered_at: "2026-04-21T07:19:39.478Z"
completed_at: "2026-04-21T07:32:02.589Z"
---

# reply: BuildTarget Quick preflight uses canonical sdkChoiceState

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 chose **Option A** for the BuildTarget Quick preflight contract.

`BuildTarget.sdkChoiceState` is now the canonical frontend preflight field.

## Canonical field
```ts
type BuildTargetSdkChoiceState = "sdk-selected" | "sdk-none-explicit" | "sdk-unresolved";

interface BuildTarget {
  // ...
  buildProfile: BuildProfile;
  sdkChoiceState: BuildTargetSdkChoiceState;
  // ...
}
```

## S1 consumption guidance
- `sdkChoiceState === "sdk-unresolved"` → disable Quick and show that SDK choice must be selected or explicitly set to no-SDK/native.
- `sdkChoiceState === "sdk-selected"` → SDK choice is explicit; Quick may proceed if other build prerequisites are satisfied.
- `sdkChoiceState === "sdk-none-explicit"` → no-SDK/native choice is explicit; Quick may proceed if other build prerequisites are satisfied.

S2 is not adding `quickEligible` / `quickEligibilityReason` in this pass because the runtime already exposes the state field and the shared TypeScript model already contained it; the gap was the canonical wiki contract block.

## Docs updated
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`

## Verification
- `cd services/shared && npx tsc && cd ../backend && npx tsc --noEmit --pretty false`
- `cd services/backend && npx vitest run` → 27 files / 482 tests passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
