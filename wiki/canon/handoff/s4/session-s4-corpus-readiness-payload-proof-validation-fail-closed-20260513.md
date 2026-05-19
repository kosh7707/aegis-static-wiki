---
title: "Session history — s4 / s4-corpus-readiness-payload-proof-validation-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/benchmark/tool_portfolio_corpus_readiness.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-corpus-readiness-payload-proof-validation-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-corpus-readiness-payload-proof-validation-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-corpus-readiness-payload-proof-validation-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened offline Tool Portfolio corpusReadinessGate caller-provided payload/proof validation. RED tests covered explicit malformed payloads, forged available gates, required-corpus case/projection binding, non-available projection suppression, available+reasonCodes inconsistency, malformed nested reasonCodes/acquisitionIds, and multi-corpus projection overvalidation. Critic final PASS; no S3/S5 or production /v1/scan API changes.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T06:32:04.919Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: local-shell-2026-05-13
- Final focused report suite: 107 passed in 0.33s.
- Covers corpusReadinessGate payload/proof validation, required-corpus evidence binding, external projection reasonCodes/acquisitionIds, and multi-corpus projection regression.

### 2026-05-13T06:32:05.003Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell-2026-05-13
- Focused report/corpus/system suite: 152 passed in 0.37s.

### 2026-05-13T06:32:05.085Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell-2026-05-13
- Focused Tool Portfolio suite: 180 passed in 0.42s.

### 2026-05-13T06:32:05.167Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local-shell-2026-05-13
- Full services/sast-runner pytest gate: 765 passed in 25.63s.

### 2026-05-13T06:32:05.248Z — passed
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local-shell-2026-05-13
- Wiki validation after canonical doc updates: PASS.
