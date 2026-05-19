---
title: "Session history — s4 / s4-corpus-readiness-authoritative-report-merge-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_corpus_readiness.py"
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_corpus_readiness.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-corpus-readiness-authoritative-report-merge-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-corpus-readiness-authoritative-report-merge-20260513

## Session
- Lane: s4
- Session ID: s4-corpus-readiness-authoritative-report-merge-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Closed an additional Corpus Readiness fail-open path in S4 tool-portfolio experiment reports. Reports now merge legacy explicit external_corpus_status with readiness-derived projection, but corpusReadinessGate remains authoritative: not_run/blocked readiness cannot be suppressed by a legacy available status. Added regression tests for default not-run readiness projection and explicit available legacy status override attempts. Updated S4 docs and evidence.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T02:51:45.537Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: local-shell:services/sast-runner readiness/report focused tests
- 19 passed in 0.08s
- Covers default not-run readiness projection, explicit legacy available external status override attempt, and available readiness quality-gate pass path.

### 2026-05-13T02:51:58.594Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell:services/sast-runner focused tool-portfolio suite
- 76 passed in 0.12s

### 2026-05-13T02:52:08.198Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local-shell:services/sast-runner full pytest
- 654 passed in 23.96s

### 2026-05-13T02:52:22.487Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m benchmark.tool_portfolio_corpus_readiness --corpus-manifest tests/fixtures/tool_portfolio_experiment_v1/corpus_manifest.json --acquisition-manifest tests/fixtures/tool_portfolio_experiment_v1/acquisition_manifest.json --required-corpus juliet-c-cpp-1.3 --base-path .`
- Log ref: local-shell:services/sast-runner corpus readiness CLI fixture smoke
- Command returned expected readiness-blocked exit code 2.
- Output JSON summary remains explicit Juliet blocked: status=blocked, decisionGradeReady=false, reasonCodes=['LOCAL_JULIET_CORPUS_NOT_PRESENT'], externalCorpusStatus.juliet.status=blocked.

### 2026-05-13T02:52:34.650Z — passed
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local-shell:aegis-static-wiki validate_wiki
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
