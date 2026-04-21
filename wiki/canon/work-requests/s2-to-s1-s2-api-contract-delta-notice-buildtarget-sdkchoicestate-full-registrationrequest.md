---
title: "S2 API contract delta notice: BuildTarget sdkChoiceState + full RegistrationRequest responses + structured_finalizer display hint"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-api-contract-delta-notice-buildtarget-sdkchoicestate-full-registrationrequest"
last_verified: "2026-04-21"
service_tags: ["s2", "s1", "backend", "frontend", "api-contract", "auth", "buildtarget", "analysis"]
decision_tags: ["contract-change", "frontend-impact", "quick-eligibility", "registration-request-shape", "structured-finalizer"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/work-requests/s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate.md", "wiki/canon/work-requests/s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-api-contract-delta-notice-buildtarget-sdkchoicestate-full-registrationrequest"
wr_kind: "notice"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-21T07:32:02.376Z"}]
registered_at: "2026-04-21T07:25:16.196Z"
completed_at: "2026-04-21T07:32:02.376Z"
---

# S2 API contract delta notice: BuildTarget sdkChoiceState + full RegistrationRequest responses + structured_finalizer display hint

## Summary
- Kind: notice
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S2 changed/clarified several canonical API contract points while resolving the 2026-04-21 WR backlog. This notice is for S1 to update frontend typing/UX assumptions and QA fixtures if needed.

## Contract delta 1 — BuildTarget Quick preflight
`BuildTarget.sdkChoiceState` is now explicitly canonical in `wiki/canon/api/shared-models.md`.

```ts
type BuildTargetSdkChoiceState = "sdk-selected" | "sdk-none-explicit" | "sdk-unresolved";

interface BuildTarget {
  // ...
  sdkChoiceState: BuildTargetSdkChoiceState;
}
```

S1 guidance:
- `sdk-unresolved` => disable Quick and explain that SDK choice must be selected or explicitly set to no-SDK/native.
- `sdk-selected` / `sdk-none-explicit` => SDK-choice preflight is satisfied; still respect the other build/Quick prerequisites.

## Contract delta 2 — RegistrationRequest full response shape
The following routes now return the full shared `RegistrationRequest` shape with populated organization fields:

- `GET /api/auth/registrations/lookup/:lookupToken`
- `POST /api/auth/registration-requests/:id/approve`
- `POST /api/auth/registration-requests/:id/reject`

S1 can rely on:
- `organizationId`
- `organizationCode`
- `organizationName`
- `fullName`
- `createdAt`
- `lookupExpiresAt`
- `assignedRole` / `approvedAt` on approval
- `decisionReason` / `rejectedAt` on rejection

S1 may remove the extra post-action `refresh()` workaround and update the in-place row from the returned `data`.

## Contract delta 3 — structured_finalizer policy flag visibility
S3 may now return `result.policyFlags` containing `structured_finalizer` for Deep results that passed strict JSON finalization after earlier non-JSON output. S2 preserves this flag in the resulting `AnalysisResult.policyFlags`.

S1 guidance:
- No blocking UI change is required.
- If S1 displays policy flags/provenance, treat `structured_finalizer` as an informational provenance marker, not a vulnerability classification.
- S3/S2 finalizer failure remains a failed Deep result; S1 should continue rendering the existing failure/error path.

## Docs updated
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`

## Verification on S2
- shared/backend typecheck passed
- focused backend tests: 3 files / 211 tests passed
- full backend verification: 27 files / 482 tests passed; backend build passed

## Requested S1 action
Please review frontend typing/UX for these deltas and complete this notice when S1 has either:
1. no-op confirmed, or
2. adjusted code/fixtures/tests accordingly.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
