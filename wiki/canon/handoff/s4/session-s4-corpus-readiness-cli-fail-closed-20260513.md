---
title: "Session history — s4 / s4-corpus-readiness-cli-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_corpus_readiness.py"
  - "services/sast-runner/tests/test_tool_portfolio_corpus_readiness.py"
original_path: "mcp://record_session_history/s4/s4-corpus-readiness-cli-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-corpus-readiness-cli-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-corpus-readiness-cli-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Continued S4 modernization by making Corpus Readiness Gate v1 independently executable and fail-closed. Added python -m benchmark.tool_portfolio_corpus_readiness CLI with deterministic JSON output and exit codes 0 available, 2 blocked/not_run, 1 invalid. Empty required corpora now blocks with CORPUS_REQUIRED_CORPORA_NOT_DECLARED so decisionGradeReady cannot become true by omission. No production /v1 API change and no S3/S5 coupling.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T02:35:11.619Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_corpus_readiness.py -q`
- Log ref: local-shell:services/sast-runner corpus readiness focused tests
- 9 passed in 0.06s
- Covers empty required-corpora fail-closed behavior, CLI blocked stdout behavior, and CLI available output-file behavior.

### 2026-05-13T02:35:16.419Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell:services/sast-runner focused tool-portfolio suite
- 73 passed in 0.14s

### 2026-05-13T02:35:24.290Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local-shell:services/sast-runner full pytest
- 651 passed in 24.43s

### 2026-05-13T02:35:35.698Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m benchmark.tool_portfolio_corpus_readiness --corpus-manifest tests/fixtures/tool_portfolio_experiment_v1/corpus_manifest.json --acquisition-manifest tests/fixtures/tool_portfolio_experiment_v1/acquisition_manifest.json --required-corpus juliet-c-cpp-1.3 --base-path .`
- Log ref: local-shell:services/sast-runner corpus readiness CLI fixture smoke
- Command returned expected readiness-blocked exit code 2.
- Output JSON summary: status=blocked, decisionGradeReady=false, reasonCodes=['LOCAL_JULIET_CORPUS_NOT_PRESENT'], externalCorpusStatus.juliet.status=blocked.

### 2026-05-13T02:35:40.516Z — passed
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local-shell:aegis-static-wiki validate_wiki
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
