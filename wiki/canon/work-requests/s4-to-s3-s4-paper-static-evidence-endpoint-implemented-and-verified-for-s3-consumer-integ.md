---
title: "S4 paper static-evidence endpoint implemented and verified for S3 consumer integration"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ"
last_verified: "2026-05-19"
service_tags: ["s4", "s3", "paper-api", "static-evidence", "traceaudit", "consumer-integration"]
decision_tags: ["implementation-complete", "endpoint-ready", "verification-evidence", "paper-export-ready-support"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/handoff/s4/s4-paper-static-evidence-implementation-crystallization.md", "wiki/canon/handoff/s4/session-s4-paper-static-evidence-implementation-20260519.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality.md", "wiki/canon/work-requests/s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ"
wr_kind: "notice"
status: "open"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: []
registered_at: "2026-05-19T09:52:06.736Z"
---

# S4 paper static-evidence endpoint implemented and verified for S3 consumer integration

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary

S4 implemented the TraceAudit paper static-evidence producer surface accepted by S3:

```http
POST /v1/paper/static-evidence
```

The implementation is in S4-owned code under `services/sast-runner/` and is aligned with the S4-owned API contract:

- `wiki/canon/api/sast-runner-paper-static-evidence-api.md`

## Implemented artifacts

Changed S4 code paths:

- `services/sast-runner/app/schemas/request.py`
  - Adds `PaperStaticEvidenceRequest`, compile-context, provenance, and scope schemas.
- `services/sast-runner/app/scanner/paper_static_evidence.py`
  - Shared paper bundle builder.
  - Explicit compile-context loader/admission from `compile_commands.json`.
  - Source-root escape hardening for compile DB entries.
  - Contract validator with `contractValidation` and `producerSanityValidation` split.
  - File-backed artifact writer for:
    - `s4-static-evidence.raw.json`
    - `s4-static-evidence.validation.json`
  - Current-six liveness helper.
  - B2/B4 reviewer-visible row-order helper.
- `services/sast-runner/app/routers/scan.py`
  - Adds live endpoint `POST /v1/paper/static-evidence`.
  - Adds paper-specific request failure codes for forbidden fields, invalid request shape, unsupported compile context type, and compileContext/provenance ref mismatch.
- `services/sast-runner/tests/test_paper_static_evidence.py`
  - Adds positive and negative tests for paper contract, producer sanity, endpoint, file-backed writer, liveness gate, compile-context admission, failure-policy projection, and B2/B4 stability.

Updated S4 docs:

- `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
  - Aligned status vocabulary with implementation.
  - Documents required `diagnosticRefs` arrays.
  - Documents raw+validation file-backed artifacts.
  - Documents validation report split.
  - Documents compile DB source selection/source-root hardening.

## Consumer-relevant behavior

S4 now returns a bundle with:

- `schemaVersion = s4-paper-static-evidence-bundle-v1`
- `bundleProfile = s4-paper-static-evidence-full-v1`
- all required top-level surfaces present
- required `surfaceStatus` entries
- required `diagnosticRefs` arrays on diagnostic-capable rows/surfaces
- current-six `toolRuns[]` rows in canonical order
- bundle-local stable IDs
- row-local trace/provenance
- top-level `claimBoundaryMatrix` / `claimBoundaries` mirrors
- explicit producer diagnostics for degraded/failed/unavailable/skipped work

Per S3-accepted failure policy, a post-admission current-six tool failure can still yield a contract-valid `bundleStatus=produced` bundle with explicit diagnostics rather than a hidden gap or transport failure.

## Verification evidence

S4 local verification:

```text
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_paper_static_evidence.py -q
# 30 passed, 1 skipped
```

```text
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q
# 1365 passed, 1 skipped
```

```text
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m compileall app
# pass
```

```text
cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py && git diff --check -- wiki/canon/api/sast-runner-paper-static-evidence-api.md
# pass
```

Real admitted-target smoke:

```text
build_paper_static_evidence_bundle against /home/kosh/aegis-for-paper/datasets/build-targets-v1/targets/bt-0001-certificate_maker
```

Observed result:

```text
bundleStatus=produced
validationStatus=pass
contract=pass
producerSanity=pass
sourceFiles=1
findings=18
all current-six toolStatuses=success
```

Critic reviews:

- Plan review: `PASS_WITH_CHANGES`; all must-fix plan changes incorporated.
- Implementation review: `PASS_WITH_CHANGES`; include-edge projection, generic orchestration failure, compile DB hardening, unsupported compile context reason, and docs patch all fixed.
- Docs re-review: `PASS`.

## Requested S3 action

S3 can now proceed with consumer integration against `POST /v1/paper/static-evidence` and/or the file-backed raw+validation artifacts.

Please treat this WR as S4 implementation notice. If S3 finds a consumer mismatch, reply with concrete contract/normalization failure evidence and S4 will patch the S4-owned contract or implementation as needed.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
