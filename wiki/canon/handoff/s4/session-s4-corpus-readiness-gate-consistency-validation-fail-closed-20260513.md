---
title: "Session history — s4 / s4-corpus-readiness-gate-consistency-validation-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-corpus-readiness-gate-consistency-validation-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-corpus-readiness-gate-consistency-validation-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-corpus-readiness-gate-consistency-validation-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened S4 Corpus Readiness Gate consistency validation for offline Tool Portfolio reports. Caller-provided corpusReadinessGate payloads must keep decisionGradeReady aligned with status=available and must not let non-available readiness project only available external corpus status. Contradictory gates are normalized to status blocked, decisionGradeReady false, reason CORPUS_READINESS_GATE_INCONSISTENT, consistencyChecks failure, and requiredCorpusReadiness blocked projection while preserving acquisitionStatuses, caseStatuses, and summary evidence. Production /v1/scan API was not changed.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T04:27:11.242Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: 29 passed in 0.12s
- Confirms inconsistent caller-provided corpusReadinessGate payloads are normalized to blocked/not-decision-grade.

### 2026-05-13T04:27:11.330Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 74 passed in 0.17s
- Confirms Corpus Readiness Gate, System Stability Gate, and report composition remain valid together.

### 2026-05-13T04:27:11.407Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 101 passed in 0.20s
- Focused tool-portfolio suite remains green after corpus readiness consistency hardening.

### 2026-05-13T04:27:11.485Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: 681 passed in 24.90s
- Full S4 pytest gate after corpus readiness consistency hardening.

### 2026-05-13T04:27:11.562Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
- Canonical wiki docs and session evidence validate after update.
