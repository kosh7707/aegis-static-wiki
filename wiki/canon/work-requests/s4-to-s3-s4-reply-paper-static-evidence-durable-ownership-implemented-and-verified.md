---
title: "S4 reply: paper static-evidence durable ownership implemented and verified"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-reply-paper-static-evidence-durable-ownership-implemented-and-verified"
last_verified: "2026-05-20"
service_tags: ["S4", "S3", "paper-path", "traceaudit", "sast-runner"]
decision_tags: ["timeout-policy", "durable-ownership", "api-contract", "critic-pass"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-implement-heartbeat-ownership-semantics-for-paper-static-evidence.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/session-s4-paper-static-evidence-ownership-wr-20260520.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-reply-paper-static-evidence-durable-ownership-implemented-and-verified"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T06:14:36.441Z","note":"S3 implemented recipient-side consumption of S4 durable ownership for the paper static-evidence endpoint: Prefer: respond-async is now the primary path, /v1/requests/{requestId} and /result polling are used through the S4 ownership helper, and synchronous compatibility remains fallback-only."}]
registered_at: "2026-05-20T01:30:38.371Z"
completed_at: "2026-05-20T06:14:36.441Z"
---

# S4 reply: paper static-evidence durable ownership implemented and verified

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S4 implemented the requested no-absolute-read-timeout operational contract for `POST /v1/paper/static-evidence` using the existing durable ownership surface.

## Implemented behavior

- `POST /v1/paper/static-evidence` now supports `Prefer: respond-async`.
- Accepted requests return `202` with `Preference-Applied: respond-async`, `statusUrl`, and `resultUrl`.
- The owned endpoint identity is `paper-static-evidence`.
- S3 should poll:
  - `GET /v1/requests/{requestId}`
  - `GET /v1/requests/{requestId}/result`
- `queued` / `running` means S4 owns the request and S3 should keep waiting while the service remains alive.
- Caller wall-clock duration is not itself correctness failure and must not become TP/FP/UNKNOWN evidence.
- `X-Timeout-Ms` may still shape internal paper/tool execution budget where applicable; it is not a terminal HTTP read-deadline correctness mechanism in durable ownership mode.
- Preflight request validation remains synchronous before ownership submit.
- `PaperStaticEvidenceContractError` inside owned execution is retained as a sanitized terminal `failed` result with specific `errorDetail.code`, not generic `INTERNAL_ERROR`.

## Code anchors

- `services/sast-runner/app/routers/scan.py`
- `services/sast-runner/tests/test_paper_static_evidence.py`

## Documentation updated

- `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
- `wiki/canon/api/sast-runner-api.md`

## Verification evidence

- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_paper_static_evidence.py -q` → `33 passed, 1 skipped`
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_paper_static_evidence.py tests/test_request_ownership.py tests/test_scan_endpoint.py -q` → `146 passed, 1 skipped`
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q` → `1368 passed, 1 skipped`
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m compileall app` → PASS
- `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py && git diff --check -- wiki/canon/api/sast-runner-paper-static-evidence-api.md wiki/canon/api/sast-runner-api.md` → PASS
- Critic re-review `019e42f9-7acc-7663-990a-560c53a03650` → PASS

## Consumer note

Synchronous `200` remains compatibility behavior, but S3 paper-path calls should prefer `Prefer: respond-async` when S4 scans may exceed ordinary client read deadlines.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
