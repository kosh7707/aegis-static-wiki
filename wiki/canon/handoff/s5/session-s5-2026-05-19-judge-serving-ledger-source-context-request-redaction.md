---
title: "Session history — S5 / s5-2026-05-19-judge-serving-ledger-source-context-request-redaction"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/knowledge-base/app/judge/service.py"
  - "services/knowledge-base/app/contracts/judge.py"
  - "services/knowledge-base/tests/test_judge_api_contract_v1.py"
original_path: "mcp://record_session_history/s5/s5-2026-05-19-judge-serving-ledger-source-context-request-redaction"
last_verified: "2026-05-19"
service_tags: ["s5"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
---

# Session history — S5 / s5-2026-05-19-judge-serving-ledger-source-context-request-redaction

## Session
- Lane: S5
- Session ID: s5-2026-05-19-judge-serving-ledger-source-context-request-redaction
- Status: completed
- Started at: 2026-05-19
- Updated at: 2026-05-19

## Summary
TDD loop completed for serving-ledger sourceContext request echo redaction. Ledger request packets now redact credential-bearing Source KG selector values under sourceContext before storage/retrieval, while raw values remain available for canonical query/cache-key construction and Source KG resolution. Contract/docs expose servingLedger.requestPacket.sourceContext under queryContextSourceContextEchoPolicy. Critic returned PASS.

## Related pages
- [[wiki/canon/api/knowledge-base-api.md]]
- [[wiki/canon/handoff/s5/readme.md]]

## Test evidence

### 2026-05-19T00:44:49.327Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_api_exposes_partial_source_kg_context_in_answer_and_ledger services/knowledge-base/tests/test_judge_api_contract_v1.py::test_judge_contract_endpoint_freezes_runtime_boundary -q`
- Log ref: wiki/system/log.md
- TDD red: serving ledger request.sourceContext retained raw credential-bearing selector before fix.
- Green after implementation: 2 passed in 3.56s.

### 2026-05-19T00:44:49.411Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_judge_api_contract_v1.py services/knowledge-base/tests/test_judge_answer_contract_v1.py -q`
- Log ref: wiki/system/log.md
- Adjacent Judge contract suite: 62 passed in 86.07s.

### 2026-05-19T00:44:49.494Z — passed
- Command: `Codex Critic: serving-ledger sourceContext request redaction review`
- Log ref: wiki/system/log.md
- Critic PASS: raw selectors drive canonical/cache identity and Source KG resolution before redaction; public/storage echoes include redacted servingLedger.requestPacket.sourceContext; contract/docs expose the field.

### 2026-05-19T00:45:06.050Z — passed
- Command: `PYTHONPATH=services/knowledge-base services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_threat_retrieval_evidence_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_judge_answer_contract_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py services/knowledge-base/tests/test_relation_conflict_model_v1.py services/knowledge-base/tests/test_analyst_brief_v1.py services/knowledge-base/tests/test_target_context_api.py -q`
- Log ref: wiki/system/log.md
- Focused S5/Judge/Source KG suite: 274 passed in 267.62s.

### 2026-05-19T00:45:06.133Z — passed
- Command: `cd services/knowledge-base && PYTHONPATH=. .venv/bin/python -m pytest tests -q`
- Log ref: wiki/system/log.md
- Full Knowledge Base suite: 710 passed in 397.08s (0:06:37).
- Post-test ledger restored with git checkout -- services/knowledge-base/data/s5-ledger.sqlite.

### 2026-05-19T00:45:06.214Z — passed
- Command: `git diff --check -- scripts/knowledge-base services/knowledge-base && git -C /home/kosh/aegis-static-wiki diff --check -- wiki/canon/api/knowledge-base-api.md wiki/canon/handoff/s5 wiki/system/index.md wiki/system/log.md`
- Log ref: wiki/system/log.md
- Whitespace/diff hygiene check passed with no output.
