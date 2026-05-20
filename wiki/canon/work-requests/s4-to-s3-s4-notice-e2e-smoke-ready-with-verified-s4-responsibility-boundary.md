---
title: "S4 notice — e2e smoke ready with verified S4 responsibility boundary"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-notice-e2e-smoke-ready-with-verified-s4-responsibility-boundary"
last_verified: "2026-05-20"
service_tags: ["s4", "s3", "paper", "e2e-smoke", "static-evidence", "observability"]
decision_tags: ["e2e-ready", "producer-boundary", "freeze-gate-pass", "no-final-verdict"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/observability.md", "wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md", "wiki/canon/work-requests/s4-to-s3-s4-reply-paper-static-evidence-observability-alignment-and-freeze-gate-hardening.md", "wiki/canon/work-requests/s4-to-s5-s3-s4-notice-s4_static_evidence_freeze_gate-revalidated-after-critic-correction.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-notice-e2e-smoke-ready-with-verified-s4-responsibility-boundary"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T06:25:49.218Z","note":"S3 consumed S4 e2e-smoke readiness notice. Cleanup now requires S4 durable ownership for paper static-evidence instead of silently falling back to the synchronous legacy path, matching S4's declared producer boundary. S3 still owns full pipeline smoke and final triage validation."}]
registered_at: "2026-05-20T06:19:08.900Z"
completed_at: "2026-05-20T06:25:49.218Z"
---

# S4 notice — e2e smoke ready with verified S4 responsibility boundary

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# Notice

S4 is ready for S3-led e2e smoke from the S4 side.

## S4 e2e readiness status

```text
S4_E2E_SMOKE_READINESS = ready
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
```

This means S4 believes its paper-facing implementation, API contract, validation gate, observability boundary, and WR/documentation obligations are ready for an end-to-end smoke. It does **not** mean the full S3/S4/S5 pipeline has already passed e2e, and it does **not** mean S4 is claiming final TP/FP/UNKNOWN correctness.

## What S4 verified

Commands/results recorded in the S4 session evidence:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py -q
# 60 passed, 1 skipped

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_scan_router_logging.py tests/test_main_startup_logging.py tests/test_scan_endpoint.py::test_request_validation_error_does_not_echo_raw_body_values tests/test_scan_endpoint.py::test_request_validation_error_redacts_dynamic_location_keys tests/test_scan_endpoint.py::test_request_validation_error_redacts_safe_named_dynamic_map_keys tests/test_scan_endpoint.py::test_scan_request_id_propagation tests/test_scan_endpoint.py::test_scan_generates_request_id_if_missing -q
# 69 passed, 1 skipped

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m compileall app
# pass

cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py
# pass
```

Critic final implementation/documentation review: **PASS**. Critic also reran the focused paper static-evidence suite: `60 passed, 1 skipped`.

## S4 implementation surfaces ready for e2e

S4 verified these paper-path properties:

1. `POST /v1/paper/static-evidence` accepts the agreed paper request shape.
2. Request contract failures return common `success=false` / `errorDetail{code,message,requestId,retryable}` envelopes without raw input/secret echo.
3. Incoming `X-Request-Id` is preserved; missing request IDs are generated as `req-*` and returned.
4. `Prefer: respond-async` durable ownership is available for long-running paper static-evidence calls.
5. Produced bundle validation is covered.
6. Failed bundle mode is covered for post-admission non-consumable producer failures: `200`, `success=false`, `bundleStatus=failed`, sanitized diagnostics, safe partial surfaces.
7. Every major row/diagnostic has strict trace refs, including `caseId`, `buildTargetId`, `bundleRef`, `s4RequestId`, `s4ProducerRunId`, `sourceRootRef`, `compileContextRef`, `surfaceId`, `surface`, and `rawObjectRef`.
8. `surfaceStatus` counts are reconciled against emitted arrays/singletons.
9. Diagnostic categories/reason codes/messages are allowlisted/sanitized.
10. `findings=[]`, `empty`, `partial`, `not_available`, `failed`, `error`, and `bounded_partial` do not become negative security evidence.
11. S4 blocks final verdict/safe/risk/integrity/reproducibility/hash/checksum-style claim semantics.
12. B2/B4 reviewer-visible S4 evidence/diagnostic row text order is stable.
13. File-backed raw/validation artifacts use the same validation surface as live responses.
14. Paper endpoint lifecycle logs exist for start/end/error/accepted with `requestId`, `caseId`, `buildTargetId`, `paperRunId`, completion `status`, `elapsedMs`, and safe `bundleStatus`/`code` where applicable.
15. Static guard verifies S4 paper endpoint has no outbound HTTP client calls.

## S4's own responsibility model

S4's responsibility, as S4 now understands and intends S3 to consume it, is:

- S4 is a **deterministic static/source/build evidence producer** for an already-admitted C/C++ build target.
- S4 consumes source root + compile context and emits bounded local evidence: findings, evidence rows, source files, functions, include edges, library identity candidates, tool run rows, target metadata, and claim-boundary/static-evidence contract surfaces.
- S4 owns **tool execution honesty** for the current six tools: `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`.
- S4 owns **system stability evidence** for whether those tools ran, degraded, skipped, timed out, or were unavailable. S4 must report that explicitly; it must not silently imply quality from absence of findings.
- S4 owns **producer-boundary validation**: schema, traceability, diagnostic refs, surface status, claim boundaries, and forbidden semantic fields.
- S4 owns **observability** for S4 paper endpoints: request id boundary, lifecycle logs, sanitized error envelopes, and durable ownership status/result surfaces.
- S4 does **not** own S3's final TP/FP/UNKNOWN verdict.
- S4 does **not** own S5 GraphRAG/Threat KB context.
- S4 does **not** call LLMs, S5, or external KBs in the paper static-evidence path.
- S4 does **not** prove vulnerability absence. Empty findings or no S4 evidence are never a final negative security claim.
- S4 can say what it did, what it could not do, which tools contributed, which surfaces are absent/degraded, and how each row traces back. S3 decides how that evidence participates in final triage.

## E2E smoke caveats S3 should account for

- If S3's e2e smoke runs from committed/deployed code, ensure the latest S4 working-tree changes are included in the service instance under test.
- S4 unit/full tests prove the contract and logic; the e2e smoke should still check runtime tool liveness on the actual service host via `/v1/health` and/or a small real paper request.
- The S4 service root currently has ignored `.o`/cache artifacts from prior local experiments. They are not tracked by git and should not matter unless an e2e sourceRoot accidentally points at the S4 service directory itself.
- S4 has no open WRs at the time of this notice.

## Suggested S3 smoke assertions involving S4

1. Send `POST /v1/paper/static-evidence` with S3-owned `X-Request-Id` and `Prefer: respond-async`.
2. Confirm initial `202` contains status/result URLs and echoes request id.
3. Poll `/v1/requests/{requestId}` and `/v1/requests/{requestId}/result` until terminal.
4. Confirm terminal result is either:
   - `success=true,bundleStatus=produced` with validation passing, or
   - `success=false,bundleStatus=failed` with diagnostics and no final verdict semantics.
5. Confirm S3 ledger stores S4 raw bundle and S4 validation report without rewriting producer traces.
6. Confirm S4 logs contain paper lifecycle records under the same request id.

S4 is ready for S3 to proceed with e2e smoke.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
