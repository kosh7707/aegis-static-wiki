---
title: "S4 SAST Runner — 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/tests/test_paper_static_evidence.py"
  - "wiki/canon/work-requests/s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-.md"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "paper-pipeline", "traceaudit"]
decision_tags: ["roadmap", "e2e-smoke-ready", "current-six-tools", "quality-gate"]
related_pages: ["wiki/canon/handoff/s4/readme.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/handoff/s4/session-s4-log-analyzer-traceability-20260520.md"]
---

# S4 SAST Runner — 로드맵

> Last verified: **2026-05-20**
> Owner: **S4 / SAST Runner**

## Current state

```text
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
S4_CANONICAL_JSONL_LOG_ANALYZER_TRACEABILITY = pass
S4_E2E_SMOKE_READINESS = ready
Open S4 WRs = none at last check
```

Current verification:

- Full S4 service suite: `1395 passed, 1 skipped in 34.93s`.
- Paper/logging focused suite: `63 passed, 1 skipped in 2.02s`.
- Canonical JSONL/log-analyzer proof request: `req-s4-log-proof-1779259710-6143`.
- Wiki validation: `PASS`.

## Immediate next

### 1. Support S3 e2e smoke

S4 is ready to be consumed by S3 for paper/e2e smoke through:

```http
POST /v1/paper/static-evidence
Prefer: respond-async
X-Request-Id: <s3-owned request id>
```

S3 should then poll:

```http
GET /v1/requests/{requestId}
GET /v1/requests/{requestId}/result
```

S4-side expectations for e2e:

- request appears in `/home/kosh/AEGIS/logs/s4-sast-runner.jsonl` with `service="s4-sast"` and numeric `level`;
- paper lifecycle rows include `requestId`, `caseId`, `buildTargetId`, `paperRunId`, status/result phase, and elapsed timing where applicable;
- result is either a valid produced bundle or a diagnostic failed bundle/error envelope according to `sast-runner-paper-static-evidence-api.md`;
- S4 does not emit final `TP | FP | UNKNOWN` or negative security claims.

### 2. Keep S4 docs/API aligned during S3 consumption

If S3 finds a consumer mismatch during e2e, update S4-owned docs first, then code if needed, then reply by WR. If the mismatch is S3-side consumption, send WR rather than editing S3 code.

### 3. Runtime tool-liveness check at smoke time

Even though current-six tools were available in the latest runtime proof, the host can drift. Before interpreting e2e failures, check `/v1/health` or a small paper-path request.

## Medium-term S4 work

### A. Paper static-evidence consumer hardening follow-up

Do only if S3 e2e reveals gaps:

- add more file-backed/live-equivalent examples;
- add additional consumer canary fixture variants;
- expand diagnostics for unusual `compile_commands.json` cases;
- keep B2/B4 same-row/text/order behavior locked.

### B. Tool Portfolio Experiment continuation

Do **not** add/remove/upgrade tools yet. The next proper tool-portfolio work is still measurement:

- run decision-grade corpus experiments over the pinned Juliet/SARD cache;
- separate measurement defects from true tool gaps;
- decompose low metrics by CWE/tool/match class;
- keep `systemStabilityGate`, `corpusReadinessGate`, and local `qualityGate` separate;
- update Tool Portfolio docs only after reproducible report artifacts exist.

### C. Build/analysis compatibility maintenance

Maintain current boundaries:

- `/v1/build` remains caller-materialized execution-only;
- `/v1/build-and-analyze` remains convenience/transitional, not canonical paper orchestration;
- `discover-targets` remains identity hint source, not durable ID authority;
- analysis path SDK interpretation remains S4-local and deterministic.

## Lower-priority backlog

- CWE-457 recall/noise investigation after decision-grade corpus runs.
- Additional parser compatibility fixtures for newly observed tool output variants.
- More real-CVE-pair corpus candidates after manifest/checksum/provenance rules are satisfied.
- Refine SCA library version/diff evidence without turning it into CVE affectedness or integrity proof.
- Further observability improvements only if e2e traces show blind spots.

## Recently completed highlights

### 2026-05-20 — canonical log-analyzer traceability proof

- Live `/v1/paper/static-evidence` proof request produced canonical JSONL rows.
- `log-analyzer.trace_request` found S4 waterfall by request id.
- Reply WR sent to S3: `wiki/canon/work-requests/s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-.md`.

### 2026-05-20 — paper static-evidence freeze/observability hardening

- Failed-bundle validation mode.
- Strict trace required fields.
- Diagnostic allowlists and message sanitization.
- Surface count reconciliation.
- Integrity/reproducibility/final-verdict alias blocking.
- B2/B4 evidence+diagnostic order stability.
- Durable ownership and lifecycle logging for paper endpoint.
- Critic final PASS.

### 2026-05-20 — paper static-evidence durable ownership

- `Prefer: respond-async` supported on `/v1/paper/static-evidence`.
- Status/result/cancel surfaces reused from durable ownership store.
- Duplicate same-endpoint request id is idempotent; cross-endpoint reuse conflicts.

### 2026-05-14 and earlier — tool portfolio / staticEvidenceContract hardening

Historical detailed entries remain in session artifacts and old WRs. Current operational summary:

- `staticEvidenceContract` remains v1 and additive.
- Tool-set decision remains `keep-current-six-tools`.
- Consumer canaries are strict and fail closed on unsafe projection.
- Offline quality reports are diagnostic only unless system/corpus/local gates prove decision-grade readiness.

## Known caveats

- S4 docs now describe current code, but live runtime must be checked when a long-lived uvicorn process may predate code/docs.
- S4 root contains ignored artifacts/caches; they are not e2e inputs unless a caller points `sourceRoot` at the S4 service tree.
- `/v1/health` is good for liveness/tool status but not proof of inbound request lifecycle logging; use paper-path request for trace proof.
