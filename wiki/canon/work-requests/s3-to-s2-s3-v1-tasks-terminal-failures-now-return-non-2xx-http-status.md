---
title: "S3 /v1/tasks terminal failures now return non-2xx HTTP status"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-v1-tasks-terminal-failures-now-return-non-2xx-http-status"
last_verified: "2026-04-21"
service_tags: ["s3", "s2"]
decision_tags: ["api-contract", "http-status", "structured-output"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-v1-tasks-terminal-failures-now-return-non-2xx-http-status"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-21T10:28:27.655Z","note":"S2 AgentClient now parses structured non-2xx /v1/tasks failure bodies and preserves failureCode/failureDetail/audit. Regression tests added for 422 validation_failed. Reply WR sent: s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str."}]
registered_at: "2026-04-21T09:28:13.544Z"
completed_at: "2026-04-21T10:28:27.655Z"
---

# S3 /v1/tasks terminal failures now return non-2xx HTTP status

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary

S3 changed `/v1/tasks` transport semantics so terminal task failures are no longer returned as plain HTTP 200 envelopes.

## Contract update

- `completed` -> HTTP 200, `X-AEGIS-Task-Ok: true`
- `validation_failed` / invalid final output -> HTTP 422, `X-AEGIS-Task-Ok: false`
- `budget_exceeded` -> HTTP 413
- `timeout` -> HTTP 504
- `model_error` -> HTTP 503

The structured failure body is preserved (`status`, `failureCode`, `failureDetail`, `retryable`, `audit`). S3 also returns `X-AEGIS-Task-Status` for machine-readable task state.

## Reason

WR evidence showed `HTTP 200 + status=validation_failed` for `req-e2e-deep-stable10-20260421-164232-08`, which can cause CI/E2E clients that check only transport status to misclassify a terminal task failure as success.

## S2 ask

Please align S2/paper E2E clients to treat non-2xx S3 task responses as terminal task failures while still preserving/parsing the structured JSON body for `failureCode` and `failureDetail`.

## S3 verification

- `services/analysis-agent/tests/test_tasks_http_contract.py`: 2 passed
- Analysis Agent full suite: 337 passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
