---
title: "S4 paper static evidence implementation crystallization"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "conversation://current-thread"
  - "wiki/canon/api/sast-runner-paper-static-evidence-api.md"
  - "wiki/canon/handoff/s4/session-s4-paper-static-evidence-implementation-interview-20260519.md"
  - "wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md"
  - "wiki/canon/handoff/s4/session-s4-log-analyzer-traceability-20260520.md"
last_verified: "2026-05-20"
service_tags: ["s4", "s3", "s5", "paper-api", "static-evidence", "traceaudit"]
decision_tags: ["implementation-crystallization", "paper-static-evidence", "historical-crystallization", "producer-boundary", "traceability", "tdd"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract.md", "wiki/canon/work-requests/s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ.md", "wiki/canon/work-requests/s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-.md"]
---

# S4 paper static evidence implementation crystallization

Last verified: 2026-05-20
Status: historical crystallization, implementation completed and superseded by current API/spec pages

This page records the pre-implementation decisions that shaped `POST /v1/paper/static-evidence`. It is no longer the current API contract. For implementation-facing work, use:

- `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/handoff/s4/readme.md`

## 1. Crystallized principle

S4 is an evidence producer, not a verdict engine.

Core rule:

> S4 must precisely and traceably report what it did and what it could not do.

Therefore S4 must not convert gaps, empty outputs, timeouts, unavailable tools, skipped surfaces, or bounded partial evidence into TP/FP/UNKNOWN, exploitability, risk, safe-code, or negative-vulnerability evidence.

## 2. Endpoint decision

The accepted S4 paper producer surface is:

```http
POST /v1/paper/static-evidence
```

File-backed equivalent:

```text
cases/{caseId}/s4-static-evidence.raw.json
cases/{caseId}/s4-static-evidence.validation.json
```

The live endpoint and file-backed artifact must share the same bundle/validation semantics. Consumers that need paper static evidence should adapt to this surface rather than ask S4 to special-case old S1/S2 paths.

## 3. Boundary decisions from the interview

### Producer boundary

S4 emits raw local deterministic evidence and diagnostics. S3 owns normalization, ledger import, packet rendering, final TP/FP/UNKNOWN, and paper export readiness. S5 owns knowledge/context/GraphRAG surfaces.

### No checksum/hash semantics

The paper API intentionally excludes checksum/hash/digest/fingerprint/artifact-integrity/reproducibility fields. S4 may use internal deterministic IDs, but public row IDs are bundle-local audit refs, not equality proofs or reproducible-build claims.

### Full traceability over stable-id mythology

The accepted trace policy is not “same input must produce same ID”. The accepted policy is: any copied row must remain traceable back to the case, build target, bundle, producer run, source root ref, compile context ref, surface, and raw object location.

Minimum trace doctrine:

```text
caseId
buildTargetId
bundleRef
s4RequestId
s4ProducerRunId
sourceRootRef
compileContextRef
surfaceId
surface
rawObjectRef
```

Row IDs are useful join handles inside one bundle. Trace fields are the audit mechanism.

### `diagnosticRefs` cardinality

Diagnostic-capable rows and surface statuses require `diagnosticRefs` arrays. Empty arrays mean “explicitly no associated producer diagnostic”. Non-empty arrays must resolve against top-level `diagnostics[]`.

### Empty semantics

`empty` is a normal first-class state when a surface was attempted and yielded zero rows. SAST tools often produce zero findings. This must not be treated as failure, safe code, or no vulnerability. Failed/not-run/unavailable/skipped work must not be disguised as `empty`.

### Validation split

S4 owns first-pass validation of its own bundle:

```json
{
  "schemaVersion": "s4-static-evidence-validation-v1",
  "overallStatus": "pass|fail",
  "contractValidation": { "status": "pass|fail", "errors": [], "warnings": [] },
  "producerSanityValidation": { "status": "pass|fail", "errors": [], "warnings": [] }
}
```

`contractValidation` protects S3 consumer safety. `producerSanityValidation` protects S4 honesty about tool/surface work.

## 4. Current implementation result

The crystallized work was implemented. Current state:

```text
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
S4_CANONICAL_JSONL_LOG_ANALYZER_TRACEABILITY = pass
S4_E2E_SMOKE_READINESS = ready
```

Implementation covers:

- live paper endpoint;
- file-backed bundle/validation-equivalent semantics;
- produced and failed bundle shapes;
- forbidden request/response semantics;
- current-six `toolRuns[]` honesty;
- `surfaceStatus` coverage/count rules;
- row-local traces;
- required `diagnosticRefs`;
- claim-boundary mirrors;
- no verdict/risk/hash/checksum/integrity/reproducibility projections;
- B2/B4 same evidence text/order constraints;
- async durable ownership;
- JSONL lifecycle logging and log-analyzer traceability.

## 5. Current verification evidence

Current full S4 suite during doc refresh:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s
```

Focused paper/logging evidence:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_scan_router_logging.py tests/test_main_startup_logging.py -q
# 63 passed, 1 skipped in 2.02s
```

Log-analyzer proof exists for request `req-s4-log-proof-1779259710-6143`, showing S4 paper lifecycle start/end, terminal status 200, `bundleStatus=produced`, and non-empty `s4ProducerRunId` in canonical JSONL logs.

## 6. How to use this page now

Use this page as rationale/history. Do not implement from this page alone. If it conflicts with the current API/spec pages, the current API/spec pages win.

If S3/S5 disagree with paper producer semantics, open a new WR against the current API page rather than editing this historical crystallization as if it were the live contract.
