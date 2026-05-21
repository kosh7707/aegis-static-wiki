---
title: "S4. SAST Runner 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/app/scanner/orchestrator.py"
  - "services/sast-runner/app/scanner/paper_static_evidence.py"
  - "services/sast-runner/tests/test_paper_static_evidence.py"
last_verified: "2026-05-21"
service_tags: ["s4", "sast-runner", "paper-pipeline", "traceaudit", "observability", "semgrep-effective-coverage"]
decision_tags: ["current-state", "handoff", "s4-static-evidence-freeze-gate", "e2e-smoke-ready", "session-reset-bootstrap"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md", "wiki/canon/handoff/s4/session-s4-log-analyzer-traceability-20260520.md", "wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md", "wiki/canon/handoff/s4/session-s4-semgrep-effective-coverage-hardening-20260520.md", "wiki/canon/work-requests/s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-.md"]
---

# S4. SAST Runner 인수인계서

> Last verified: **2026-05-21**
> Owner: **S4 / SAST Runner**
> Code owner path: `services/sast-runner/`
> Service: `s4-sast`, port `9000`, version `0.11.2`

## 0. Start here

1. Read `docs/AEGIS.md` and `docs/mcp.md` from `~/AEGIS`.
2. Use this page as the S4 lane entry point.
3. For API details use:
   - `wiki/canon/api/sast-runner-api.md`
   - `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
4. For current implementation boundaries use:
   - `wiki/canon/specs/sast-runner.md`
   - `wiki/canon/specs/sast-runner-static-evidence-contract.md`
   - `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md`
5. Check open WRs with `aegis-static-wiki.list_my_open_wrs(lane="s4")`.

### 0.1 Fresh-session reset bootstrap — 2026-05-21

If the S4 session context is being reset, treat this subsection as the minimal state-transfer packet.

1. **Do not restart discovery from old docs.** Canonical state is this page plus the related wiki pages listed in section 7.
2. **Current code checkpoint is post-Semgrep hardening and may be uncommitted** until S2/user commits. Expected S4-owned changed paths include:
   - `services/sast-runner/app/scanner/semgrep_coverage.py`
   - `services/sast-runner/rules/cpp/command-injection.yaml`
   - `services/sast-runner/app/scanner/orchestrator.py`
   - `services/sast-runner/app/scanner/static_evidence_contract.py`
   - `services/sast-runner/app/scanner/paper_static_evidence.py`
   - `services/sast-runner/app/routers/scan.py`
   - `services/sast-runner/app/schemas/response.py`
   - `services/sast-runner/benchmark/static_evidence_consumer_canary.py`
   - Semgrep/coverage/consumer regression tests under `services/sast-runner/tests/`.
3. **Do not touch other lane dirty files.** S4 may read/write only `services/sast-runner/` and S4-owned wiki/API/spec/handoff pages.
4. **Current S3 notification WR is already registered:** `wiki/canon/work-requests/s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-.md`.
5. **Current verification baseline:** full S4 suite `1406 passed, 1 skipped in 34.39s`; Semgrep rule validation `41 rule(s), 0 configuration errors`; wiki validation `PASS`.
6. **Current semantic boundary:** Semgrep `coverageDegraded=true` is an effective-coverage caveat, not tool process failure, not `execution.degraded`, not negative security evidence, and not an offline quality score.
7. **If resuming work:** first run `git status --short -- services/sast-runner`, read this page, then read `wiki/canon/roadmap/s4-roadmap.md`; only re-run tests if code changed after the baseline above.

## 1. Current S4 role

S4 is the **LLM-free deterministic static/source/build evidence producer** for C/C++ analysis.

S4 owns:

- current-six local SAST execution:
  `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`;
- SAST finding normalization and CWE metadata projection;
- local tool-liveness and system-stability gates;
- SCA/library identity and local upstream-diff evidence;
- structural code graph/function/include/metadata extraction;
- caller-materialized build execution and compile DB readiness evidence;
- durable ownership for long-running S4 requests;
- TraceAudit paper static-evidence bundle production;
- S4-owned contract validators, consumer canaries, corpus/tool-portfolio experiment harnesses;
- S4 canonical JSONL logging at `/home/kosh/AEGIS/logs/s4-sast-runner.jsonl`.

S4 does **not** own:

- final `TP | FP | UNKNOWN` triage or final security verdicts — S3;
- GraphRAG, threat KB, CVE affectedness, external vulnerability knowledge — S5;
- LLM prompts/responses/generation — S3/S7;
- UI — S1;
- platform orchestration/start-stop integration — S2;
- S2/S3/S5/S7 code changes.

## 2. Current API surfaces

S4 currently exposes **13 route surfaces** in `services/sast-runner/app/routers/scan.py`:

| Surface | Status | Notes |
|---|---|---|
| `POST /v1/paper/static-evidence` | active | TraceAudit paper raw static evidence bundle. Prefer `Prefer: respond-async` for e2e. |
| `POST /v1/scan` | active | Current-six SAST scan, sync/NDJSON/durable ownership. |
| `POST /v1/functions` | active | Structural function/call graph extraction. |
| `POST /v1/includes` | active | Include dependency extraction. |
| `POST /v1/metadata` | active | Target/compiler macro/build metadata extraction. |
| `POST /v1/libraries` | active | Local library identity/version/diff evidence. CVE lookup is not S4. |
| `POST /v1/build-and-analyze` | compatibility/convenience | Build + scan + structural helpers. Not canonical paper orchestration. |
| `POST /v1/build` | active | Caller-materialized build execution; S4 does not infer build command or SDK intent. |
| `POST /v1/discover-targets` | active | Deterministic build target hints only; S4 does not mint durable `buildUnitId`. |
| `GET /v1/requests/{requestId}` | active | Durable ownership status. |
| `GET /v1/requests/{requestId}/result` | active | Durable terminal result/failure retrieval. |
| `DELETE /v1/requests/{requestId}` | active | Best-effort cancellation. |
| `GET /v1/health` | active | Tool liveness/policy/request summary. Not an inbound request lifecycle log surface. |

## 3. Current gates and readiness

As of 2026-05-20:

```text
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
S4_CANONICAL_JSONL_LOG_ANALYZER_TRACEABILITY = pass
S4_E2E_SMOKE_READINESS = ready
S4_SEMGREP_CPP_EFFECTIVE_COVERAGE_CANARY = pass
```

Meaning:

- S4 paper static-evidence producer invariants are implemented and tested.
- S4 canonical JSONL logs are visible to `log-analyzer` by `service=s4-sast` and `requestId`.
- S4 has no known open S4-lane WR blocker before S3 e2e smoke.
- S4 has already notified S3 about the Semgrep effective-coverage additive contract fields.

Caveat:

- Runtime tool liveness must still be checked at e2e time with `/v1/health` or an actual paper-path request, because host environment can drift.
- Semgrep now reports effective-coverage caveats separately from liveness: `coverageDegraded=true` / `coverageReasons[]` does not mean process failure, but S3 must not treat `findingsCount=0` as clean evidence when coverage diagnostics are present.

## 4. Current proof snapshot

Latest S4 verification evidence recorded on 2026-05-20:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1406 passed, 1 skipped in 34.39s

cd /home/kosh/AEGIS/services/sast-runner && \
  .venv/bin/pytest tests/test_paper_static_evidence.py \
    tests/test_scan_router_logging.py \
    tests/test_main_startup_logging.py -q
# 63 passed, 1 skipped in 2.02s

cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py
# PASS
```

Runtime observability proof:

```text
canonical_file=/home/kosh/AEGIS/logs/s4-sast-runner.jsonl
request_id=req-s4-log-proof-1779259710-6143
log-analyzer trace_request => Services: s4-sast, 15 log entries, 4.4s, end (200)
```

Session evidence:

- `wiki/canon/handoff/s4/session-s4-log-analyzer-traceability-20260520.md`
- `wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md`
- `wiki/canon/handoff/s4/session-s4-semgrep-effective-coverage-hardening-20260520.md`

## 5. Implementation map

```text
services/sast-runner/
├── app/
│   ├── main.py                         # FastAPI app, canonical JSONL logging, pre-router errors
│   ├── config.py                       # SERVICE_VERSION=0.11.2, SAST_* settings
│   ├── context.py                      # requestId context propagation
│   ├── runtime/request_ownership.py    # durable ownership store
│   ├── runtime/request_summary.py      # health/request summary state
│   ├── routers/scan.py                 # all S4 HTTP routes
│   ├── schemas/request.py              # Scan/Build/Paper request schemas
│   ├── schemas/response.py             # response schemas and health model
│   └── scanner/
│       ├── orchestrator.py             # ALL_TOOLS current-six orchestration
│       ├── paper_static_evidence.py    # TraceAudit paper bundle builder/validator
│       ├── static_evidence_contract.py # runtime staticEvidenceContract
│       ├── claim_support_gate.py       # claim-boundary readiness
│       ├── *_runner.py                 # individual SAST adapters
│       ├── ast_dumper.py               # function/call graph
│       ├── include_resolver.py         # include graph
│       ├── build_runner.py             # caller-materialized build execution
│       └── library_*                   # SCA identity/diff/hash helpers
├── benchmark/                          # deterministic offline reports/corpus/tool portfolio harnesses
├── rules/automotive/                   # Semgrep C rules
├── rules/cpp/                          # Semgrep C++ canary rules
└── tests/                              # S4-owned regression/contract/oracle tests
```

## 6. Operational notes

- Do **not** modify other services. Use WRs for S3/S5/S2/S7 changes.
- Do **not** commit from S4; commit/push is handled outside this lane unless user explicitly changes process.
- Do **not** execute `scripts/start*.sh`/`scripts/stop*.sh` without explicit user permission. If a service is already running, safe HTTP probes are allowed when needed for verification.
- Prefer `log-analyzer` MCP for runtime log diagnosis.
- Canonical docs live in `/home/kosh/aegis-static-wiki`; update wiki first.

## 7. Managed S4 documents

| Purpose | Path |
|---|---|
| Lane entry | `wiki/canon/handoff/s4/readme.md` |
| Roadmap | `wiki/canon/roadmap/s4-roadmap.md` |
| Main service spec | `wiki/canon/specs/sast-runner.md` |
| Main API contract | `wiki/canon/api/sast-runner-api.md` |
| Paper static-evidence API | `wiki/canon/api/sast-runner-paper-static-evidence-api.md` |
| Static evidence contract | `wiki/canon/specs/sast-runner-static-evidence-contract.md` |
| System/quality gate split | `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md` |
| Tool portfolio governance | `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md` |
| Tool portfolio experiment | `wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md` |
| Build snapshot seam | `wiki/canon/handoff/s4/build-snapshot-consumer-seam.md` |

## 8. Next work pointer

Use `wiki/canon/roadmap/s4-roadmap.md` for next S4 work. At this checkpoint the next likely work is **S3 e2e smoke support and consumer integration evidence**, not another S4-internal contract rewrite and not another Semgrep coverage rewrite unless S3 reports a concrete consumer mismatch.
