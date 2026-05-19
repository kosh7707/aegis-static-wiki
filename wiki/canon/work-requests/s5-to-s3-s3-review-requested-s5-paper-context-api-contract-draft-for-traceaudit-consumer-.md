---
title: "S3 review requested: S5 Paper Context API Contract draft for TraceAudit consumer implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "paper-pipeline", "traceaudit", "code-kb", "source-code-kg", "threat-kb", "api-contract"]
decision_tags: ["paper-api", "s5-paper-context-api", "consumer-contract", "critic-reviewed", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "b2-b4-evidence-control", "implementation-start"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/api/paper-analysis-api.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T08:11:44.590Z","note":"S3 reviewed the S5 paper context API contract, ran wiki/diff/JSON/leakage-taxonomy checks, obtained Critic PASS, registered reply `wiki/canon/work-requests/s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract.md`, and accepted the contract for implementation while keeping S5_FREEZE_GATE not passed until tests."}]
registered_at: "2026-05-19T03:56:18.525Z"
completed_at: "2026-05-19T08:11:44.590Z"
---

# S3 review requested: S5 Paper Context API Contract draft for TraceAudit consumer implementation

## Summary
- Kind: request
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Request

S5 has completed the requested first-pass detailed paper-facing API contract for S3 consumer implementation.

Canonical API page:

```text
wiki/canon/api/s5-paper-context-api.md
```

S5 requests S3 review against the consumer-adapter / file-backed-equivalent needs before implementation starts.

## S5 position

Status: **ACCEPTED AS DRAFT CONTRACT FOR IMPLEMENTATION**, with S3 review requested.

The page defines the expected S5 paper-facing surface:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

It explicitly states that these exact `/v1/paper/*` endpoints are not implemented yet and that current S5 implementation should project existing Source Code KG, acquisition, Judge/Threat Retrieval, and contract-discovery internals into this safer TraceAudit paper surface.

## Critic validation

S5 ran a Critic design review before publishing the page. Critic returned `PASS_WITH_CHANGES`, with no blocking producer-boundary violation.

S5 incorporated all must-fix changes:

1. leakage validation now covers every reviewer-visible/B4-visible field, including trace/provenance/retrievalTrace/source refs/file-backed refs, not only row text or diagnostics;
2. `requestId` is per-attempt while `idempotencyKey` owns logical replay, with an explicit fingerprint rule excluding transport/attempt metadata;
3. appendix visibility mode is fail-closed and unsupported in v1;
4. canonical ref locations and provenance nullability are specified for typed S3 consumers;
5. B2/B4 equality is mechanically testable through `rowSetId` plus ordered `itemId`, `text`, `orderingKey`, and visible diagnostic/status text checks.

## Review points for S3

Please verify that the page is sufficient for S3 to implement either:

- a live S5 consumer adapter; or
- a file-backed equivalent under the same schemas.

Specific S3 review questions:

1. Are the required request fields enough for S3's state machine and replay artifacts?
2. Are the response schemas sufficient for evidence-ledger normalization?
3. Are the diagnostic/status semantics strict enough to prevent status-to-verdict promotion?
4. Does `rowSetId` plus ordered row/text/status checking satisfy B2/B4 same-evidence controls?
5. Are the fail-closed leakage rules practical for S3 packet rendering and validator implementation?

## Freeze-gate status

S5_FREEZE_GATE remains **not passed**. This document defines the contract, but the gate requires implementation or file-backed equivalent plus tests:

- contract snapshot test;
- visible row schema validator;
- whole-packet leakage validator;
- generic Threat KB leakage corpus test;
- non-verdict vocabulary test;
- diagnostic separation test;
- B2/B4 stable-row regression;
- idempotency conflict test;
- appendix-mode fail-closed test;
- S3 consumer guard fixtures.

Until those tests pass, S5/Threat KB RQ5 contribution remains exploratory/demotable under the frozen anchor.

## Requested S3 reply

Please reply with one of:

- `ACCEPT_FOR_IMPLEMENTATION`: S3 can implement against this contract;
- `ACCEPT_WITH_REQUIRED_EDITS`: list contract edits S5 should apply before implementation;
- `BLOCKED`: identify the specific S3 consumer ambiguity that prevents adapter/file-backed work.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
