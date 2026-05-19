---
title: "Session history — s4 / s4-matching-policy-semantic-validation-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-matching-policy-semantic-validation-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-matching-policy-semantic-validation-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-matching-policy-semantic-validation-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened offline Tool Portfolio matchingPolicy semantic validation. RED tests reproduced arbitrary mapping acceptance for schema drift, unknown keys, bool/negative/too-large/non-int lineWindowDefault, non-bool functionFallbackDefault, and minimal canonical defaults. Implementation canonicalizes valid/minimal v1 policy and fails invalid semantic fields closed with ORACLE_MATCHING_POLICY_INPUT_INVALID before oracle scoring. Production /v1/scan unchanged.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T07:11:31.079Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q -k 'matching_policy'`
- Log ref: local shell output
- 13 passed, 104 deselected in 0.07s

### 2026-05-13T07:11:31.166Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: local shell output
- 117 passed in 0.36s

### 2026-05-13T07:11:31.248Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local shell output
- 162 passed in 0.39s

### 2026-05-13T07:11:31.332Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_corpus_acquisition.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_oracle_matcher.py -q`
- Log ref: local shell output
- 191 passed in 0.59s

### 2026-05-13T07:11:31.413Z — pass
- Command: `cd services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local shell output
- 775 passed in 25.41s

### 2026-05-13T07:11:45.429Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local shell output
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
