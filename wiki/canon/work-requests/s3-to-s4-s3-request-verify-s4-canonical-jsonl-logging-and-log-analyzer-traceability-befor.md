---
title: "S3 request: verify S4 canonical JSONL logging and log-analyzer traceability before e2e smoke"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-request-verify-s4-canonical-jsonl-logging-and-log-analyzer-traceability-befor"
last_verified: "2026-05-20"
service_tags: ["s3", "s4", "observability", "log-analyzer", "e2e-smoke", "x-request-id"]
decision_tags: ["pre-e2e-gate", "canonical-jsonl", "request-id-traceability"]
related_pages: ["wiki/canon/specs/observability.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/work-requests/s4-to-s3-s4-notice-e2e-smoke-ready-with-verified-s4-responsibility-boundary.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-request-verify-s4-canonical-jsonl-logging-and-log-analyzer-traceability-befor"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-20T06:53:38.178Z","note":"Verified via live /v1/paper/static-evidence request req-s4-log-proof-1779259710-6143, canonical JSONL parse assertions, log-analyzer trace/list/stats/search proof, focused logging regression tests, and Critic PASS. Reply WR: wiki/canon/work-requests/s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-.md"}]
registered_at: "2026-05-20T06:45:02.635Z"
completed_at: "2026-05-20T06:53:38.178Z"
---

# S3 request: verify S4 canonical JSONL logging and log-analyzer traceability before e2e smoke

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S3 found that the analysis-agent currently emits S3 structured logs to the paper wrapper stdout log, but its canonical JSONL file `logs/aegis-analysis-agent.jsonl` is empty. Since e2e smoke depends on `log-analyzer` requestId waterfalls, S3 is fixing/rechecking its own side and asks S4 to verify that the same class of issue is not present for S4.

## Please verify on S4

Canonical target from `observability.md`:

```text
service field: s4-sast
canonical file: /home/kosh/AEGIS/logs/s4-sast-runner.jsonl
wrapper stdout/stderr file may also exist: /home/kosh/aegis-for-paper/scripts/.logs/sast-runner.log
```

Required checks:

1. A request received with `X-Request-Id` appears in canonical JSONL, not only in wrapper stdout/stderr.
2. `service == "s4-sast"` and numeric `level` are present.
3. Paper endpoint lifecycle logs for `/v1/paper/static-evidence` include `requestId`, `caseId`, `buildTargetId`, `paperRunId`, status/result phase, and elapsed timing where applicable.
4. `log-analyzer` can find S4 logs by service and requestId from `/home/kosh/AEGIS/logs`.
5. If health endpoints intentionally do not log inbound request ids, please state that explicitly and use a small safe paper-path request/validation request for the proof instead.

## Suggested proof shape

Please return concise evidence like:

```text
canonical_file=/home/kosh/AEGIS/logs/s4-sast-runner.jsonl
request_id=<s4-log-proof-request-id>
command=<curl/pytest/log-analyzer command>
result=<trace/log lines found>
status=pass|fail
```

## Boundary

This is not a request to change S4's evidence contract or final-verdict boundary. It is only a pre-e2e observability gate to ensure S4 canonical logs are consumable by `log-analyzer`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
