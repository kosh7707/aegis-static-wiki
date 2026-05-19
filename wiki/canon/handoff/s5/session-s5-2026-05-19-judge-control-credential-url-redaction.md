---
title: "Session history — S5 / s5-2026-05-19-judge-control-credential-url-redaction"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/knowledge-base/app/serving/query_planner.py"
  - "services/knowledge-base/app/contracts/judge.py"
  - "services/knowledge-base/tests/test_judge_api_contract_v1.py"
original_path: "mcp://record_session_history/s5/s5-2026-05-19-judge-control-credential-url-redaction"
last_verified: "2026-05-19"
service_tags: ["s5"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
---

# Session history — S5 / s5-2026-05-19-judge-control-credential-url-redaction

## Session
- Lane: S5
- Session ID: s5-2026-05-19-judge-control-credential-url-redaction
- Status: completed
- Started at: 2026-05-19
- Updated at: 2026-05-19

## Summary
TDD loop completed for Judge control credential URL redaction. Credential-bearing URL-like control values, object keys, and unsupported control labels are redacted across response echoes, canonicalQuery.controlSummary, and serving-ledger request/answer packets. Contract and canonical docs expose credentialBearingUrlRedaction=true and servingLedger.answerPacket coverage. Critic returned PASS.

## Related pages
- [[wiki/canon/api/knowledge-base-api.md]]
- [[wiki/canon/handoff/s5/readme.md]]

## Test evidence

### 2026-05-19T01:21:49.572Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_api_redacts_credential_bearing_control_echoes_from_response_and_serving_ledger services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_contract_endpoint_freezes_runtime_boundary services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_api_redacts_oversized_accepted_control_values_from_response_and_serving_ledger services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_api_bounds_many_small_unknown_control_echoes_in_response_and_serving_ledger -q`
- Log ref: wiki/system/log.md
- TDD red: credential-bearing forceContext URL values, unsupported control values, and unsupported control names/keys leaked before sanitizer/key-label fix.
- Green after implementation and docs/contract fixes: 4 passed in 8.12s.

### 2026-05-19T01:21:49.662Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_judge_api_contract_v1.py services/knowledge-base/tests/test_judge_answer_contract_v1.py -q`
- Log ref: wiki/system/log.md
- Adjacent Judge contract suite: 63 passed in 93.87s.

### 2026-05-19T01:21:49.744Z — passed
- Command: `Codex Critic: Judge control credential URL redaction final re-check`
- Log ref: wiki/system/log.md
- Initial Critic found unsupported control key/name leak and missing servingLedger.answerPacket contract/doc literal.
- Fixes applied; final Critic PASS with exact docs literals credentialBearingUrlRedaction=true and servingLedger.answerPacket confirmed.

### 2026-05-19T01:22:03.804Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_threat_retrieval_evidence_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_judge_answer_contract_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py services/knowledge-base/tests/test_relation_conflict_model_v1.py services/knowledge-base/tests/test_analyst_brief_v1.py services/knowledge-base/tests/test_target_context_api.py -q`
- Log ref: wiki/system/log.md
- Focused S5/Judge/Source KG suite: 275 passed in 279.18s.

### 2026-05-19T01:22:03.895Z — passed
- Command: `cd services/knowledge-base && PYTHONPATH=. .venv/bin/python -m pytest tests -q`
- Log ref: wiki/system/log.md
- Full Knowledge Base suite: 711 passed in 402.04s (0:06:42).
- Post-test ledger restored with git checkout -- services/knowledge-base/data/s5-ledger.sqlite.

### 2026-05-19T01:22:03.982Z — passed
- Command: `git diff --check -- scripts/knowledge-base services/knowledge-base && git -C /home/kosh/aegis-static-wiki diff --check -- wiki/canon/api/knowledge-base-api.md wiki/canon/handoff/s5 wiki/system/index.md wiki/system/log.md`
- Log ref: wiki/system/log.md
- Whitespace/diff hygiene check passed with no output.
