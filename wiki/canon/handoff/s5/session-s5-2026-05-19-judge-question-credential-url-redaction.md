---
title: "Session history — S5 / s5-2026-05-19-judge-question-credential-url-redaction"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/knowledge-base/app/config.py"
  - "services/knowledge-base/app/serving/query_planner.py"
  - "services/knowledge-base/app/judge/service.py"
  - "services/knowledge-base/app/contracts/judge.py"
  - "services/knowledge-base/tests/test_judge_api_contract_v1.py"
original_path: "mcp://record_session_history/s5/s5-2026-05-19-judge-question-credential-url-redaction"
last_verified: "2026-05-19"
service_tags: ["s5"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
---

# Session history — S5 / s5-2026-05-19-judge-question-credential-url-redaction

## Session
- Lane: S5
- Session ID: s5-2026-05-19-judge-question-credential-url-redaction
- Status: completed
- Started at: 2026-05-19
- Updated at: 2026-05-19

## Summary
TDD loop completed for Judge question credential URL redaction. Credential-bearing URL substrings embedded in request.question are redacted across response queryContext, canonical question terms, serving-ledger request packets, and answer packets. Contract/docs expose request.questionEchoPolicy.credentialBearingUrlRedaction=true. Critic returned PASS.

## Related pages
- [[wiki/canon/api/knowledge-base-api.md]]
- [[wiki/canon/handoff/s5/readme.md]]

## Test evidence

### 2026-05-19T01:46:11.898Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_api_redacts_credential_bearing_question_urls_from_response_and_serving_ledger services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_api_redacts_credential_bearing_control_echoes_from_response_and_serving_ledger services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_contract_endpoint_freezes_runtime_boundary -q`
- Log ref: wiki/system/log.md
- TDD red: request.question with embedded credential-bearing URL leaked via queryContext.question before fix.
- Green after implementation: 3 passed in 5.97s.

### 2026-05-19T01:46:11.986Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_judge_api_contract_v1.py services/knowledge-base/tests/test_judge_answer_contract_v1.py -q`
- Log ref: wiki/system/log.md
- Adjacent Judge contract suite: 64 passed in 119.05s.

### 2026-05-19T01:46:12.070Z — passed
- Command: `Codex Critic: Judge question credential URL redaction review`
- Log ref: wiki/system/log.md
- Critic PASS: question/control URL redaction code, contract, tests, and canonical docs align.

### 2026-05-19T01:46:26.243Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_threat_retrieval_evidence_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_judge_answer_contract_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py services/knowledge-base/tests/test_relation_conflict_model_v1.py services/knowledge-base/tests/test_analyst_brief_v1.py services/knowledge-base/tests/test_target_context_api.py -q`
- Log ref: wiki/system/log.md
- Focused S5/Judge/Source KG suite: 276 passed in 292.72s.

### 2026-05-19T01:46:26.327Z — passed
- Command: `cd services/knowledge-base && PYTHONPATH=. .venv/bin/python -m pytest tests -q`
- Log ref: wiki/system/log.md
- Full Knowledge Base suite: 712 passed in 464.57s (0:07:44).
- Post-test ledger restored with git checkout -- services/knowledge-base/data/s5-ledger.sqlite.

### 2026-05-19T01:46:26.407Z — passed
- Command: `git diff --check -- scripts/knowledge-base services/knowledge-base && git -C /home/kosh/aegis-static-wiki diff --check -- wiki/canon/api/knowledge-base-api.md wiki/canon/handoff/s5 wiki/system/index.md wiki/system/log.md`
- Log ref: wiki/system/log.md
- Whitespace/diff hygiene check passed with no output.
