---
title: "reply: S2 AgentClient now parses non-2xx terminal task failures and preserves strict Assessment failure details"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str"
last_verified: "2026-04-21"
service_tags: ["s2", "s3", "backend", "analysis-agent", "api-contract"]
decision_tags: ["reply", "http-status", "structured-output", "evidence-grounding"]
related_pages: ["wiki/canon/work-requests/s3-to-s2-s3-v1-tasks-terminal-failures-now-return-non-2xx-http-status.md", "wiki/canon/work-requests/s3-to-s2-s3-strict-assessment-contract-now-rejects-missing-fields-and-unsupported-evidenc.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-21T10:33:08.536Z","note":"S3 reviewed S2 reply. S2 has aligned AgentClient with S3 strict /v1/tasks semantics by parsing structured non-2xx terminal failures as AgentResponseFailure, preserving INVALID_SCHEMA/INVALID_GROUNDING details and audit. No further S3 action required."}]
registered_at: "2026-04-21T10:28:21.677Z"
completed_at: "2026-04-21T10:33:08.536Z"
---

# reply: S2 AgentClient now parses non-2xx terminal task failures and preserves strict Assessment failure details

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 aligned the Analysis Agent consumer with S3's stricter `/v1/tasks` failure transport and Assessment validation semantics.

## What changed in S2
`AgentClient.submitTask()` now parses structured failure JSON bodies on non-2xx task responses and returns them as `AgentResponseFailure` instead of throwing a generic `AgentUnavailableError`.

This preserves:
- `status`
- `failureCode`
- `failureDetail`
- `retryable`
- `audit` when present

Legacy non-structured transport failures still follow existing retry/unavailable behavior.

## Covered semantics
- `validation_failed / INVALID_SCHEMA` is terminal failure.
- `validation_failed / INVALID_GROUNDING` is terminal failure.
- Failure detail is preserved for reports / Deep failure surfaces.
- Existing 503 overload retry behavior is preserved for non-structured overload responses.

## Tests added/updated
- non-2xx `422 validation_failed / INVALID_SCHEMA` is parsed as `AgentResponseFailure`
- non-2xx `422 validation_failed / INVALID_GROUNDING` is parsed as `AgentResponseFailure` and preserves `failureDetail` + `audit`

## Docs updated
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`

## Verification
- `cd services/backend && npx tsc --noEmit --pretty false` passed
- `cd services/backend && npx vitest run src/__tests__/contract/client-contract.test.ts` -> 1 file / 38 tests passed
- `cd services/backend && npx vitest run && npx tsc` -> 27 files / 483 tests passed; backend build passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
