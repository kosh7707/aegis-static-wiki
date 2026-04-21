---
title: "Session history — s3 / s3-structured-output-fallback-20260421"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/analysis-agent/app/core/agent_loop.py"
  - "services/analysis-agent/tests/test_agent_loop.py"
original_path: "mcp://record_session_history/s3/s3-structured-output-fallback-20260421"
last_verified: "2026-04-21"
service_tags: ["s3"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/api/analysis-agent-api.md"]
migration_status: "canonicalized"
---

# Session history — s3 / s3-structured-output-fallback-20260421

## Session
- Lane: s3
- Session ID: s3-structured-output-fallback-20260421
- Status: completed
- Started at: 2026-04-21T15:25:00+09:00
- Updated at: 2026-04-21T15:32:00+09:00

## Summary
Handled follow-up concern that deep-analyze non-JSON output is the more fundamental stability problem. Added AgentLoop deterministic structured fallback when the LLM emits non-JSON after the structured retry but deterministic Phase 1 findings and whitelisted evidence refs exist. Fallback returns an evidence-backed Assessment JSON with a SAST-grounded claim, caveat, usedEvidenceRefs, human-review flag, and structured_output_fallback policy flag rather than dropping the run. Existing no-evidence unstructured-twice behavior remains validation_failed.

## Related pages
- [[wiki/canon/handoff/s3/readme.md]]
- [[wiki/canon/specs/analysis-agent.md]]
- [[wiki/canon/api/analysis-agent-api.md]]

## Test evidence

### 2026-04-21T06:30:53.760Z — passed
- Command: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q tests/test_agent_loop.py tests/test_generate_poc_handler.py && .venv/bin/python -m pytest -q`
- Log ref: local terminal output
- Focused: 28 passed in 2.71s
- Full analysis-agent suite: 332 passed in 4.44s
- Regression added for unstructured content twice with Phase 1 SAST evidence producing a structured_output_fallback completed result.
- Existing unstructured twice without deterministic fallback evidence remains validation_failed.
