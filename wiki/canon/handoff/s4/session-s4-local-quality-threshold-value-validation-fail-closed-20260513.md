---
title: "Session history — s4 / s4-local-quality-threshold-value-validation-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-local-quality-threshold-value-validation-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-local-quality-threshold-value-validation-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-local-quality-threshold-value-validation-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened S4 Local Quality Gate threshold value validation. Declared threshold fields minimumTargetRecall, minimumFindingPrecision, and maximumNegativeTargetFpr must now be numeric, finite, and in the inclusive [0.0, 1.0] range. Invalid values fail closed with QUALITY_THRESHOLD_VALUE_INVALID before split scoring, include invalidThresholdFields diagnostics containing field names only, and do not expose raw non-finite floats in JSON threshold diagnostics. Production /v1/scan API was not changed.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T04:02:08.617Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: 17 passed in 0.09s
- Confirms threshold value validation rejects negative, >1, non-numeric, and non-finite values deterministically.

### 2026-05-13T04:02:08.698Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 51 passed in 0.11s
- Confirms Local Quality Gate threshold validation still composes correctly with System Stability Gate.

### 2026-05-13T04:02:08.771Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 88 passed in 0.16s
- Focused tool-portfolio suite remains green after threshold-value hardening.

### 2026-05-13T04:02:08.842Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: 666 passed in 24.50s
- Full S4 pytest gate after threshold-value validation hardening.

### 2026-05-13T04:02:08.912Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
- Canonical wiki docs and session evidence validate after update.
