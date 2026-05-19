---
title: "Session history — s4 / s4-system-stability-quality-gate-allowed-invariant-20260513"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/benchmark/tool_portfolio_system_gate.py"
  - "services/sast-runner/benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json"
  - "services/sast-runner/tests/test_tool_portfolio_system_stability_gate.py"
  - "services/sast-runner/tests/test_tool_portfolio_experiment_report.py"
original_path: "mcp://record_session_history/s4/s4-system-stability-quality-gate-allowed-invariant-20260513"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-system-stability-quality-gate-allowed-invariant-20260513

## Session
- Lane: s4
- Session ID: s4-system-stability-quality-gate-allowed-invariant-20260513
- Status: completed
- Started at: 2026-05-13
- Updated at: 2026-05-13

## Summary
Aligned S4 report-side systemStabilityGate.qualityGateAllowed with pass-only semantics. default_not_run_system_gate now emits qualityGateAllowed=false, preserving precomputed harness metrics while preventing consumers from interpreting not_run system stability as decision-grade quality eligibility. Regenerated the S4 harness fixture report artifact and verified it matches the builder.

## Related pages
- [[wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md]]
- [[wiki/canon/specs/sast-runner.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/roadmap/s4-roadmap.md]]

## Test evidence

### 2026-05-13T03:26:53.577Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_system_stability_gate.py tests/test_tool_portfolio_experiment_report.py -q`
- Log ref: local-shell:services/sast-runner experiment-report/system-stability focused tests
- 44 passed in 0.09s
- Covers default not_run system gate qualityGateAllowed=false and file-based harness report invariant.

### 2026-05-13T03:26:59.942Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_tool_portfolio_experiment_manifest.py tests/test_tool_portfolio_acquisition_manifest.py tests/test_tool_portfolio_corpus_readiness.py tests/test_tool_portfolio_oracle_matcher.py tests/test_tool_portfolio_experiment_report.py tests/test_tool_portfolio_decision_cycle_freeze.py tests/test_tool_portfolio_system_stability_gate.py -q`
- Log ref: local-shell:services/sast-runner focused tool-portfolio suite
- 81 passed in 0.13s

### 2026-05-13T03:27:05.293Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest -q`
- Log ref: local-shell:services/sast-runner full pytest
- 659 passed in 23.36s

### 2026-05-13T03:27:14.760Z — passed
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python - <<'PY'
import json
from pathlib import Path
from benchmark.tool_portfolio_harness_fixture import build_harness_fixture_report
artifact=Path('benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json')
current=json.loads(artifact.read_text())
rebuilt=build_harness_fixture_report(repo_root=Path('.'))
print({'artifact_matches_builder': current == rebuilt, 'systemStabilityStatus': current['systemStabilityGate']['status'], 'qualityGateAllowed': current['systemStabilityGate']['qualityGateAllowed'], 'qualityGateStatus': current['qualityGate']['status']})
PY`
- Log ref: local-shell:services/sast-runner harness artifact match check
- artifact_matches_builder=True
- systemStabilityStatus=not_run
- qualityGateAllowed=False
- qualityGateStatus=not_decision_grade

### 2026-05-13T03:27:23.659Z — passed
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local-shell:aegis-static-wiki validate_wiki
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
