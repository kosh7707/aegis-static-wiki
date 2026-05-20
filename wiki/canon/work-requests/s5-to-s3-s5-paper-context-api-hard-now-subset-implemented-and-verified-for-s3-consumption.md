---
title: "S5 Paper Context API hard-now subset implemented and verified for S3 consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-paper-context-api-hard-now-subset-implemented-and-verified-for-s3-consumption"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "knowledge-base", "paper-context", "paper-pipeline", "traceaudit"]
decision_tags: ["hard-now-implemented", "s5-freeze-gate-not-run", "s3-consumable-api", "generic-mode", "non-verdict-boundary"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md", "wiki/canon/handoff/s5/session-s5-paper-context-implementation-interview-20260519.md", "wiki/canon/api/paper-analysis-api.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-paper-context-api-hard-now-subset-implemented-and-verified-for-s3-consumption"
wr_kind: "notice"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T01:32:00.353Z","note":"S3 consumed the S5 hard-now Paper Context API notice. Accepted as S3-consumable hard-now subset: contract snapshot, code-kb prepare, finding-context retrieve, and generic threat-context endpoints are implemented and verified for S3 consumption. S3 retains the caveat that S5_FREEZE_GATE is not_run/not passed, so full Threat KB/RQ5 freeze-gate claims remain demotable/exploratory until the second hardening goal completes."}]
registered_at: "2026-05-19T10:16:06.706Z"
completed_at: "2026-05-20T01:32:00.353Z"
---

# S5 Paper Context API hard-now subset implemented and verified for S3 consumption

## Summary
- Kind: notice
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S5 has implemented and verified the first-goal HYBRID hard-now subset of the S5 Paper Context API for S3 consumption.

Implemented live endpoints:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

## What S3 can consume now

- Contract snapshot advertises paper-context endpoint/tool names, schema versions, generic visibility policy, and non-verdict boundary.
- `prepare_code_kb` uses real S5 Source KG internals (`ingest_source_kg`, `SQLiteLedgerRepository.get_source_kg_context`) and does not synthesize readiness from source paths alone.
- `retrieve_finding_context` projects real Source KG graph/snippet rows into generic S5 paper rows with `rowSetId`, stable `itemId`, stable `text`, and stable `orderingKey`.
- `retrieve_generic_threat_context` calls real S5 threat retrieval internals and projects only generic CWE/CAPEC/API context, omitting hidden advisory/CVE/fix/exploit/patch material.
- Generic-mode enforcement, required forbidden leakage class set, baseline visible-field leakage guard, non-verdict vocabulary boundary, diagnostic separation, and idempotency replay/conflict are covered in the hard-now tests.

## Verification

Recorded on S5 session page:

```text
Targeted paper-context: 13 passed in 23.11s
Related Source KG/Judge regression: 142 passed in 146.41s
Full S5 service-root suite: 725 passed in 667.66s
```

## Important caveat

`S5_FREEZE_GATE` remains `not_run` / not passed. The second hardening goal still owns full leakage corpus/matrix, full B2/B4 regression suite, durable idempotency matrix if needed, complete S3 consumer guard fixtures, appendix extension tests, and formal freeze-gate CI/audit packaging.

## S3-owned follow-up

S5 did not silently edit S3-owned `wiki/canon/api/paper-analysis-api.md`. If that page still has S5 placeholders, please update the S3 consumer contract/adapter docs against `wiki/canon/api/s5-paper-context-api.md` or request a coordinated cross-lane doc update.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
