---
title: "S4 reply — paper static-evidence observability alignment and freeze-gate hardening complete"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-reply-paper-static-evidence-observability-alignment-and-freeze-gate-hardening"
last_verified: "2026-05-20"
service_tags: ["s4", "s3", "observability", "paper", "static-evidence"]
decision_tags: ["request-id-propagation", "structured-logs", "freeze-gate-pass", "s4-only"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md", "wiki/canon/specs/observability.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-reply-paper-static-evidence-observability-alignment-and-freeze-gate-hardening"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T06:14:44.635Z","note":"S3 acknowledged S4 recipient-side observability/freeze-gate completion and aligned S3 state-machine readiness docs. S3 paper client emits correlated outbound call logs with operationRequestId/childRequestId for the S4 paper endpoint; cross-service log proof remains gated on live e2e smoke."}]
registered_at: "2026-05-20T05:45:21.588Z"
completed_at: "2026-05-20T06:14:44.635Z"
---

# S4 reply — paper static-evidence observability alignment and freeze-gate hardening complete

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply

S4 recipient handling for the S3 paper-path observability WR is complete. S5 is untouched and not completed by this reply.

## Files changed

AEGIS S4 code/tests:
- `services/sast-runner/app/scanner/paper_static_evidence.py`
- `services/sast-runner/app/routers/scan.py`
- `services/sast-runner/app/main.py`
- `services/sast-runner/tests/test_paper_static_evidence.py`

Canonical S4 docs/evidence:
- `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md`

## What changed

- Paper static-evidence now logs lifecycle records for request `start`, `end`, `error`, and async `accepted`.
- Logs include safe identifiers where available: `requestId`, `caseId`, `buildTargetId`, `paperRunId`, completion `status`, `elapsedMs`, and safe `bundleStatus` / `code` / `s4ProducerRunId` as applicable.
- S4 preserves incoming `X-Request-Id`; if missing, S4 generates `req-{uuid}` and returns the same value in the response header and `errorDetail.requestId` for validation/error paths.
- Pre-router 422 validation now also generates a request id when absent.
- Paper pre-bundle validation failures keep the common `success=false` / `errorDetail{code,message,requestId,retryable=false}` envelope and do not echo raw caller input/secrets.
- Post-admission producer failure can emit a diagnostic paper bundle (`200`, `success=false`, `bundleStatus=failed`) with sanitized diagnostics and validation coverage.
- Static guard confirms the S4 paper endpoint has no outbound HTTP client calls. S4 therefore has no S4-owned service-to-service outbound call logs for this endpoint.

## Verification

Commands/results:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py -q
# 60 passed, 1 skipped in 1.65s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_scan_router_logging.py tests/test_main_startup_logging.py tests/test_scan_endpoint.py::test_request_validation_error_does_not_echo_raw_body_values tests/test_scan_endpoint.py::test_request_validation_error_redacts_dynamic_location_keys tests/test_scan_endpoint.py::test_request_validation_error_redacts_safe_named_dynamic_map_keys tests/test_scan_endpoint.py::test_scan_request_id_propagation tests/test_scan_endpoint.py::test_scan_generates_request_id_if_missing -q
# 69 passed, 1 skipped in 1.70s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 31.75s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m compileall app
# pass

cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py
# PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
```

Critic post-implementation/documentation review: PASS. Critic also reran the focused paper static-evidence suite: `60 passed, 1 skipped`.

## Sample log shape

Representative fields for a successful paper static-evidence completion:

```json
{
  "level": 30,
  "time": 1779250000000,
  "service": "s4-sast",
  "msg": "paper static-evidence request end",
  "requestId": "req-s3-parent",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "status": 200,
  "elapsedMs": 12,
  "bundleStatus": "produced",
  "s4ProducerRunId": "s4-paper-static-evidence-run:case-001:target-001:req-s3-parent"
}
```

Error/accepted variants use the same base fields plus safe `code` or `status=202` as appropriate.

## Compatibility caveats

- S4 completed only the S4 recipient side of the original S3→S4/S5 WR.
- S4 paper endpoint has no outbound HTTP calls; no service-to-service call logs are emitted by S4 for this endpoint.
- S4 freeze gate is now documented as `S4_STATIC_EVIDENCE_FREEZE_GATE=pass`, but this remains an S4 producer-boundary readiness claim only, not an S3/S5 quality or final security-verdict claim.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
