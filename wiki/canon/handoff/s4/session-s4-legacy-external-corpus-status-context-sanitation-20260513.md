---
title: "Session history — s4 / s4-legacy-external-corpus-status-context-sanitation-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-legacy-external-corpus-status-context-sanitation-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-legacy-external-corpus-status-context-sanitation-20260513

## Session
- Lane: s4
- Session ID: s4-legacy-external-corpus-status-context-sanitation-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened offline Tool Portfolio legacy external_corpus_status compatibility context. Invalid/reserved/malformed legacy context is omitted from decisionSupport.externalCorpusStatus and reported only with sanitized validation failures, while readiness-derived status remains authoritative for qualityGate and requiredFollowUps. Critic first review BLOCK found reserved-key skip and raw invalid-status echo; both were fixed and re-reviewed PASS.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T07:37:15.122Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q -k 'legacy_external_corpus_status or reserved_legacy_key or invalid_legacy_external_corpus_status_value'`
- Log ref: local shell output
- 7 passed, 116 deselected in 0.07s

### 2026-05-13T07:37:15.205Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: local shell output
- 123 passed in 0.40s

### 2026-05-13T07:37:15.285Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local shell output
- 168 passed in 0.44s

### 2026-05-13T07:37:15.366Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_corpus_acquisition.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_oracle_matcher.py -q`
- Log ref: local shell output
- 197 passed in 0.61s

### 2026-05-13T07:37:15.444Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local shell output
- 781 passed in 25.68s

### 2026-05-13T07:37:35.763Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local shell output
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
