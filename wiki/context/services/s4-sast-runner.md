---
title: "S4 / SAST Runner context"
page_type: "context-service"
canonical: false
source_refs:
  - "wiki/canon/specs/sast-runner.md"
  - "wiki/canon/api/sast-runner-api.md"
  - "wiki/canon/api/sast-runner-paper-static-evidence-api.md"
  - "wiki/canon/handoff/s4/readme.md"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "context"]
decision_tags: ["detection", "service-context", "current-state"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/system/index.md", "wiki/context/decisions/canonical-wiki.md"]
---

# S4 / SAST Runner context

Last verified: 2026-05-20

S4 is AEGIS's deterministic, non-LLM C/C++ static-analysis and build-evidence producer. It executes local SAST tools, extracts structural/source/library/build metadata, emits `staticEvidenceContract`, and now provides a paper-specific raw static-evidence producer endpoint for TraceAudit experiments.

## Current mental model

- **S4 owns** local tool execution, local source/build evidence, tool liveness/system-stability gates, static evidence contract boundaries, paper static-evidence bundle validity, and canonical JSONL request traces for its service.
- **S4 does not own** S3 final TP/FP/UNKNOWN, S5 GraphRAG/CVE affectedness, LLM reasoning, exploitability judgment, runtime behavior, or final security verdicts.
- **Paper path**: S3 calls `POST /v1/paper/static-evidence`; S4 emits raw bundle + validation semantics; S3 normalizes/ledgers/renders.
- **Build path**: upstream owns snapshot identity; S4 owns concrete execution evidence.

## Start here

Canonical S4 active docs:

- `wiki/canon/handoff/s4/readme.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/api/sast-runner-paper-static-evidence-api.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md`
- `wiki/canon/handoff/s4/build-snapshot-consumer-seam.md`

Historical S4 session pages and WRs should be treated as evidence/history, not as the primary current contract.

## Current proof snapshot

Latest full S4 suite during the 2026-05-20 doc refresh:

```bash
cd services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s
```

Focused paper/logging suite:

```bash
cd services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_scan_router_logging.py tests/test_main_startup_logging.py -q
# 63 passed, 1 skipped in 2.02s
```

Current gates:

```text
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
S4_CANONICAL_JSONL_LOG_ANALYZER_TRACEABILITY = pass
S4_E2E_SMOKE_READINESS = ready
```
