---
title: "Session history — s4 / s4-findings-by-config-payload-element-shape-validation-fail-closed-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_experiment_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-findings-by-config-payload-element-shape-validation-fail-closed-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-findings-by-config-payload-element-shape-validation-fail-closed-20260513

## Session
- Lane: s4
- Session ID: s4-findings-by-config-payload-element-shape-validation-fail-closed-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Hardened S4 findings_by_config payload and finding element shape validation. findings_by_config must be a mapping with all required current-six config keys; each config value must be a non-string sequence; every item must be SastFinding or Mapping. Non-mapping payloads, missing required configs, invalid config values, and invalid finding elements now fail closed with FINDINGS_BY_CONFIG_INPUT_INVALID, suppress split scoring, block portfolioMetrics, and fail final qualityGate when prerequisites pass. System invalid-precondition still dominates when system stability fails. A Critic-blocked missing-required-config regression was fixed before final evidence.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T04:59:23.784Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: 48 passed in 0.17s
- Confirms findings_by_config non-mapping, missing required config, invalid config value, and invalid finding element paths fail closed.

### 2026-05-13T04:59:23.864Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 93 passed in 0.21s
- Confirms findings_by_config shape validation composes with corpus/system gates.

### 2026-05-13T04:59:23.936Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: 121 passed in 0.24s
- Focused tool-portfolio suite remains green after findings_by_config shape validation.

### 2026-05-13T04:59:24.018Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: 706 passed in 25.62s
- Full S4 pytest gate after findings_by_config shape validation hardening.

### 2026-05-13T04:59:24.099Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
- Canonical wiki docs and session evidence validate after update.
