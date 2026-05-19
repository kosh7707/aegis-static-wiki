---
title: "Session history — s4 / s4-local-quality-required-splits-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-local-quality-required-splits-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-local-quality-required-splits-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-local-quality-required-splits-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened S4 Local Quality Gate threshold configuration. Explicit empty or blank-only thresholds.requiredSplits can no longer pass local quality by vacuity; the local and final quality gates fail with QUALITY_REQUIRED_SPLITS_NOT_DECLARED when system stability and corpus readiness prerequisites pass. Required splits are normalized deterministically.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T03:39:28.856Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: local-shell:services/sast-runner experiment-report focused tests
- 12 passed in 0.08s
- Covers empty and blank-only requiredSplits fail-closed behavior and existing pass path with validation/test/canary required splits.

### 2026-05-13T03:39:44.775Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell:services/sast-runner experiment-report/system-stability focused tests
- 46 passed in 0.09s

### 2026-05-13T03:39:51.387Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell:services/sast-runner focused tool-portfolio suite
- 83 passed in 0.14s

### 2026-05-13T03:40:00.385Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local-shell:services/sast-runner full pytest
- 661 passed in 23.39s

### 2026-05-13T03:40:10.019Z — passed
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local-shell:aegis-static-wiki validate_wiki
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
