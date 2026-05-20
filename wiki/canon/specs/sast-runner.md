---
title: "S4. SAST Runner 기능 명세 (v0.11.2)"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/sast-runner/app/config.py"
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/app/scanner/orchestrator.py"
  - "services/sast-runner/app/scanner/paper_static_evidence.py"
  - "services/sast-runner/app/schemas/request.py"
  - "services/sast-runner/app/schemas/response.py"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "static-analysis", "paper-pipeline", "traceaudit"]
decision_tags: ["deterministic-static-evidence", "current-six-tools", "durable-ownership", "observability"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
---

# S4. SAST Runner 기능 명세 (v0.11.2)

> Last verified: **2026-05-20**
> Owner: **S4 / SAST Runner**
> Scope: **C/C++ deterministic static/source/build evidence production**

## 1. Purpose

S4 produces deterministic local evidence for downstream analysis. It runs local static-analysis tools, extracts structural source/build evidence, identifies local library/version/diff clues, and packages paper-specific static evidence for TraceAudit experiments.

S4 must remain **LLM-free** and **local/static/source/build bounded**. S4 output is evidence, not final judgment.

## 2. Non-goals

S4 does not perform or emit:

- final `TP | FP | UNKNOWN` triage;
- final security verdicts, safe/clean claims, or risk scores;
- vulnerability absence or CWE absence claims;
- CVE affectedness or exploitability judgment;
- S5 GraphRAG, threat KB, or external vulnerability lookup;
- LLM calls or prompt/response parsing;
- S2/S3/S5 orchestration decisions.

## 3. Runtime identity

| Item | Value |
|---|---|
| Code path | `services/sast-runner/` |
| Stack | Python 3.12 + FastAPI + Uvicorn |
| Port | `9000` |
| Version | `0.11.2` (`app/config.py`) |
| Service log identity | `s4-sast` |
| Canonical log file | `/home/kosh/AEGIS/logs/s4-sast-runner.jsonl` |
| Current test gate | `1395 passed, 1 skipped in 34.93s` on 2026-05-20 |

## 4. Current route surfaces

S4 currently has 13 HTTP route surfaces:

| Method/path | Purpose |
|---|---|
| `POST /v1/paper/static-evidence` | TraceAudit paper static-evidence bundle for an admitted build target. |
| `POST /v1/scan` | Current-six SAST scan; sync, NDJSON, and durable ownership modes. |
| `POST /v1/functions` | Structural function/call extraction. |
| `POST /v1/includes` | Include graph extraction. |
| `POST /v1/metadata` | Compiler macro/target metadata extraction. |
| `POST /v1/libraries` | Local library identity/version/diff evidence. |
| `POST /v1/build-and-analyze` | Convenience build+analysis surface. Not the canonical paper path. |
| `POST /v1/build` | Caller-materialized build execution and compile DB readiness. |
| `POST /v1/discover-targets` | Build target identity hints. |
| `GET /v1/requests/{requestId}` | Durable ownership status. |
| `GET /v1/requests/{requestId}/result` | Durable result retrieval. |
| `DELETE /v1/requests/{requestId}` | Best-effort durable request cancellation. |
| `GET /v1/health` | Tool liveness, policy status, active request summary. |

## 5. Current-six tool portfolio

S4's production SAST portfolio remains unchanged:

```text
semgrep
cppcheck
flawfinder
clang-tidy
scan-build
gcc-fanalyzer
```

| Tool | Role | Notes |
|---|---|---|
| Semgrep | Pattern + taint rules | Service-local venv executable preferred. |
| Cppcheck | C/C++ static diagnostics | Original profile to avoid SDK-header blowups. |
| Flawfinder | Dangerous function canary | Fast text evidence, not semantic proof. |
| clang-tidy | Compiler-backed CERT/static checks | Enriched profile when compile context supports it. |
| scan-build | Clang Static Analyzer | Per-file analyzer; can be partial under timeouts. |
| gcc-fanalyzer | GCC path-sensitive analyzer | Requires GCC analyzer availability and suitable profile. |

The current governance decision is **keep-current-six-tools**. S4 should not add/remove/upgrade tools until decision-grade corpus and parser evidence support the change.

## 6. Input modes and boundaries

### `/v1/scan`

Supports:

- inline `files[]`;
- `projectPath`;
- optional `compileCommands`;
- optional `buildProfile` for analysis-path SDK interpretation;
- optional `thirdPartyPaths`;
- optional `options.tools` subset.

Rules:

- default required tool set is current-six;
- explicit `options.tools` makes that subset the required tool set;
- unknown `options.tools[]` is caller error `SCAN_TOOL_INVALID`;
- required tool missing/failed/partial/skipped/degraded after preflight is system-stability failure;
- successful scan can still be bounded/partial evidence, but must not become negative security evidence.

### `/v1/build`

Build path is execution-only:

- caller supplies `projectPath`, `buildCommand`, optional `buildEnvironment`;
- S4 does not infer build commands;
- S4 does not interpret `sdkId` on build path;
- readiness is explicit: `ready`, `partial`, `not-ready`;
- `ready` requires successful build and usable user-target compile DB entries.

### `/v1/paper/static-evidence`

Consumes one already-admitted build target:

- `caseId`;
- `buildTargetId`;
- `sourceRoot`;
- `compileContext` with `type=compile_commands_json`, `path`, `ref`;
- `provenance.paperRunId`, `buildSnapshotId`, `buildUnitId`, `sourceRootRef`, `compileContextRef`;
- optional scope arrays.

The endpoint always attempts the full paper bundle profile and rejects/fails closed on fields that try to turn it into build execution, verdicting, CVE lookup, or hash/checksum/integrity proof.

## 7. System stability vs quality

S4 keeps these concerns separate:

| Concern | Owner/surface | Meaning |
|---|---|---|
| Tool liveness | `/v1/health`, runtime preflight | Current host can run the tools. |
| System Stability Gate | runtime scan and offline reports | Required local execution is complete enough to score/use artifact. |
| Evidence Readiness | `staticEvidenceContract` and paper bundle validation | Local evidence surfaces are present/partial/not-ready. |
| Claim Support Readiness | `staticEvidenceContract` | Bounded local claim-support classification, not a quality score. |
| Quality Gate | offline benchmark/tool-portfolio reports | Oracle-backed validation/test/canary metrics after system/corpus readiness. |

A green system-stability gate is not a quality verdict. A green quality gate is not a final security verdict.

## 8. Static evidence contracts

### Runtime `staticEvidenceContract`

Attached to `/v1/scan` and `/v1/build-and-analyze` where S4 has produced or attempted a static evidence artifact.

Key principles:

- schema remains `s4-static-evidence-contract-v1`;
- current-six `toolEvidenceMatrix` is stable order;
- out-of-scope surfaces are explicit `not_provided`;
- `qualityEvaluation` is `not_evaluated` in ordinary runtime responses;
- empty findings are never vulnerability absence evidence.

### Paper static-evidence bundle

`POST /v1/paper/static-evidence` emits `s4-paper-static-evidence-bundle-v1` with:

- top-level bundle envelope;
- full `surfaceStatus` map;
- sanitized `diagnostics[]`;
- row-local `trace` on all major rows and `targetMetadata`;
- current-six `toolRuns[]` honesty;
- top-level `claimBoundaryMatrix` and `claimBoundaries` mirrors;
- no verdict/risk/hash/checksum/integrity/reproducibility semantics.

## 9. Durable ownership

For long-running production or paper calls, caller should use:

```http
Prefer: respond-async
X-Request-Id: <caller request id>
```

Supported on:

- `/v1/paper/static-evidence`;
- `/v1/scan`;
- `/v1/build`;
- `/v1/build-and-analyze`.

Rules:

- initial response is `202` with `statusUrl` and `resultUrl`;
- `GET /v1/requests/{id}/result` returns `202` until terminal result is ready;
- terminal failure/cancel can be transported with `200` result retrieval and nested `success=false`;
- same endpoint + same request id reuses ownership status;
- different endpoint + same request id returns `REQUEST_ID_CONFLICT`.

## 10. Observability

S4 complies with `wiki/canon/specs/observability.md`:

- JSONL file: `/home/kosh/AEGIS/logs/s4-sast-runner.jsonl`;
- service: `s4-sast`;
- numeric `level`, epoch-ms `time`, `msg`, `requestId` when request context exists;
- response header echoes or generates `X-Request-Id`;
- paper lifecycle logs include case/build target/paper run/status/elapsed information.

Current proof:

```text
request_id=req-s4-log-proof-1779259710-6143
log-analyzer trace_request => Services: s4-sast, 15 log entries, 4.4s, terminal end (200)
```

`/v1/health` is not treated as inbound lifecycle-log proof; use a paper-path request for requestId waterfall proof.

## 11. SCA/library evidence

S4 may emit library identity/version/diff evidence from local files and repositories. This evidence is bounded:

- may identify names, versions, tags, commits, repository hints, local diff summaries;
- must not be consumed as CVE affectedness;
- must not be consumed as artifact integrity or reproducible-build proof;
- CVE lookup belongs to S5.

## 12. Code graph evidence

S4 structural extraction is local static structure only:

- functions;
- calls;
- include edges;
- target metadata.

It is not semantic GraphRAG and does not claim completeness for vulnerability reasoning.

## 13. Current verification evidence

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m compileall app
# pass, last recorded in S4 freeze hardening evidence

cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py
# PASS
```

Focused paper/logging proof:

```bash
cd /home/kosh/AEGIS/services/sast-runner && \
  .venv/bin/pytest tests/test_paper_static_evidence.py \
    tests/test_scan_router_logging.py \
    tests/test_main_startup_logging.py -q
# 63 passed, 1 skipped in 2.02s
```

## 14. Related docs

- API: `wiki/canon/api/sast-runner-api.md`
- Paper API: `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
- Static evidence contract: `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- System/quality gate split: `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md`
- Tool portfolio governance: `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`
- Tool portfolio experiment: `wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md`
- Handoff: `wiki/canon/handoff/s4/readme.md`
