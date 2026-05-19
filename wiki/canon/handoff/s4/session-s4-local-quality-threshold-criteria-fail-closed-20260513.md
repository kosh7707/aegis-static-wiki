---
title: "Session history — s4 / s4-local-quality-threshold-criteria-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-local-quality-threshold-criteria-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-local-quality-threshold-criteria-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-local-quality-threshold-criteria-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened S4 Local Quality Gate threshold criteria. The gate now requires at least one actual threshold criterion among minimumTargetRecall, minimumFindingPrecision, and maximumNegativeTargetFpr. If required splits are declared but no threshold criteria are present, local and final quality fail with QUALITY_THRESHOLDS_NOT_DECLARED when prerequisites pass. Existing threshold values such as 0.0 remain declared criteria.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T03:53:30.972Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: 13 passed in 0.08s
- Confirms Local Quality Gate threshold-criteria fail-closed behavior and preserves existing report builder behavior.

### 2026-05-13T03:53:31.053Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 47 passed in 0.10s
- Confirms Local Quality Gate and System Stability Gate interaction remains valid after threshold-criteria hardening.

### 2026-05-13T03:53:31.128Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 84 passed in 0.13s
- Confirms focused tool-portfolio quality/system/corpus gate suite remains green.

### 2026-05-13T03:53:31.211Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: 662 passed in 23.92s
- Full S4 pytest gate after threshold-criteria fail-closed hardening.

### 2026-05-13T03:53:31.287Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
- Canonical wiki pages remained valid after docs/evidence sync.
