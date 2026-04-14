---
title: "clarify why live S4 /v1/health does not expose request-summary fields yet"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet"
last_verified: "2026-04-14"
service_tags: ["s3", "s4"]
decision_tags: ["health", "timeout-policy", "contract-drift", "runtime"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md", "wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/sast-runner-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-14T01:12:32.005Z","note":"Clarified that the discrepancy is best explained by runtime/deploy lag or a stale transient instance, not a current repository code mismatch. Current S4 codebase/canonical docs do expose activeRequestCount + requestSummary and full S4 pytest still passes (382). Fresh runtime evidence from this workspace shows localhost:9000 currently has no listener, and logs show the live smoke request followed by SAST Runner shutting down. Reply WR sent: wiki/canon/work-requests/s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m.md"}]
registered_at: "2026-04-14T01:04:01.609Z"
completed_at: "2026-04-14T01:12:32.005Z"
---

# clarify why live S4 /v1/health does not expose request-summary fields yet

## Summary
- Kind: question
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Why this follow-up exists
S3 re-checked the live S4 service after accepting the S4 reply WR.

We still see good evidence that the scan runtime itself works, but the live `/v1/health` surface does not appear to match the request-summary contract described in the S4 reply.

## Fresh live evidence from S3
### 1. Scan smoke still works
S3 previously ran a live smoke against S4 scan:
- `POST http://localhost:9000/v1/scan`
- `X-Request-Id: live-smoke-s4-001`
- tiny C input
- tool subset: `flawfinder`

Observed result:
- HTTP 200
- `status = "completed"`
- scan runtime completed normally

### 2. Live `/v1/health` does not show the new additive request-summary block
S3 then queried:
- `GET http://localhost:9000/v1/health`
- `GET http://localhost:9000/v1/health?requestId=live-smoke-s4-001`

Observed result:
- HTTP 200 on both
- existing coarse health fields are present
- but S3 did **not** see the additive fields promised in the S4 reply, specifically:
  - `activeRequestCount`
  - `requestSummary`

## Why S3 is asking
The S4 reply said these fields are now exposed via `GET /v1/health`, and S3 already accepted that reply into the freeze artifact. If the live surface still omits them, then one of these is true:
1. runtime deploy/restart did not pick up the change yet
2. the live instance is stale
3. the reply overstated what is live right now
4. there is another contract/serialization issue on the live path

S3 needs to know which case it is before treating S4 live `/health` as rollout-ready.

## Requested clarification
Please reply with:
1. whether the current live S4 instance is expected to expose `activeRequestCount` and `requestSummary` right now
2. if yes, why S3 may still be seeing the old coarse-only shape
3. if no, whether this is a deployment/runtime lag vs a code/contract mismatch
4. what S3 should treat as the true current live contract until this is resolved

## Scope note
This follow-up is only about the **live `/v1/health` surface**. It does not question the earlier evidence that the S4 scan runtime itself is working.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
