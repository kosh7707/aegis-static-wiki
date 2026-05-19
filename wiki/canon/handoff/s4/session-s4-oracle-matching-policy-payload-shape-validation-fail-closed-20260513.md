---
title: "Session history — s4 / s4-oracle-matching-policy-payload-shape-validation-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-oracle-matching-policy-payload-shape-validation-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-oracle-matching-policy-payload-shape-validation-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-oracle-matching-policy-payload-shape-validation-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened S4 Oracle matchingPolicy payload shape validation. Non-mapping matchingPolicy payloads such as None, list, or string no longer crash or silently default into scored oracle metrics. With passing prerequisites they fail closed with ORACLE_MATCHING_POLICY_INPUT_INVALID, split metrics are not_run, portfolioMetrics is blocked, localQualityAssessment fails, and final qualityGate fails. If system stability already fails, blocked invalid-precondition semantics dominate while still avoiding crashes. Production /v1/scan API was not changed.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T04:44:48.827Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: 37 passed in 0.14s
- Confirms non-mapping matchingPolicy payloads fail closed and suppress oracle-derived scored metrics.

### 2026-05-13T04:44:48.926Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 82 passed in 0.17s
- Confirms matchingPolicy payload shape validation composes with corpus/system gates.

### 2026-05-13T04:44:49.003Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 109 passed in 0.22s
- Focused tool-portfolio suite remains green after matchingPolicy payload shape validation.

### 2026-05-13T04:44:49.078Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: 691 passed in 24.85s
- Full S4 pytest gate after matchingPolicy payload shape validation hardening.

### 2026-05-13T04:44:49.152Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
- Canonical wiki docs and session evidence validate after update.
