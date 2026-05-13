---
title: "Session history — s5 / 2026-05-12-s5-serving-requery-loop4"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - ".omx/plans/s5-loop4-serving-requery-contract-plan-20260512.md"
  - "services/knowledge-base/app/serving/query_planner.py"
  - "services/knowledge-base/app/serving/decision_cache.py"
  - "services/knowledge-base/app/judge/service.py"
  - "services/knowledge-base/tests/test_serving_requery_contract_v1.py"
original_path: "mcp://record_session_history/s5/2026-05-12-s5-serving-requery-loop4"
last_verified: "2026-05-12"
service_tags: ["s5"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md"]
migration_status: "canonicalized"
---

# Session history — s5 / 2026-05-12-s5-serving-requery-loop4

## Session
- Lane: s5
- Session ID: 2026-05-12-s5-serving-requery-loop4
- Status: completed
- Started at: 2026-05-12T17:05:00+09:00
- Updated at: 2026-05-12T17:58:00+09:00

## Summary
Loop 4 implemented after Critic plan PASS: added canonical query planner, decision-fragment cache, Judge controls echo/fallbackTrace/cacheTrace/canonicalQuery integration, and canonical API/spec docs. First Critic implementation review failed on silent unknown-control loss, incomplete normalization, and missing-input fallback visibility. The fixes now preserve unknown control keys, normalize component/source/exclude identifiers, preserve rejected-control fallback on grounded unknown paths, and refine Judge validation for explicitly explained unresolved Source KG contexts. Verification: focused serving/Judge/scoring tests 17 passed; full S5 suite 430 passed; diff-check passed; clean S5-only validation worktree passed. Critic implementation re-validation PASS.

## Related pages
- [[wiki/canon/api/knowledge-base-api.md]]
- [[wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md]]

## Test evidence

### 2026-05-12T08:28:24.143Z — passed
- Command: `cd services/knowledge-base && .venv/bin/python -m pytest -q tests/test_serving_requery_contract_v1.py tests/test_judge_answer_contract_v1.py tests/test_scoring_policy_v1.py`
- Log ref: local shell output: 16 passed in 24.13s
- Focused Loop 4 tests for canonical query normalization, re-query controls, cache trace, fallback trace, and existing Judge/scoring contracts.

### 2026-05-12T08:28:24.227Z — passed
- Command: `cd services/knowledge-base && .venv/bin/python -m pytest -q tests`
- Log ref: local shell output: 429 passed in 104.15s
- Full S5 suite after Loop 4 serving/re-query integration.

### 2026-05-12T08:28:24.306Z — passed
- Command: `git diff --check -- services/knowledge-base && git -C /home/kosh/aegis-static-wiki diff --check -- wiki/canon/api/knowledge-base-api.md wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md`
- Log ref: local shell output: no whitespace errors
- Diff whitespace check for Loop 4 code/docs.

### 2026-05-12T08:57:00Z — passed
- Command: `cd services/knowledge-base && .venv/bin/python -m pytest -q tests/test_serving_requery_contract_v1.py tests/test_judge_answer_contract_v1.py tests/test_scoring_policy_v1.py`
- Log ref: local shell output: 17 passed in 27.05s
- Post-Critic-fix focused regression: unknown control keys are rejected/echoed, noisy exclude IDs still suppress evidence, missing-input unknown keeps rejected controls in fallbackTrace, and existing Judge/scoring contracts remain green.

### 2026-05-12T08:57:00Z — passed
- Command: `cd services/knowledge-base && .venv/bin/python -m pytest -q tests`
- Log ref: local shell output: 430 passed in 105.25s
- Full S5 suite after Loop 4 Critic fixes.

### 2026-05-12T08:57:00Z — passed
- Command: `clean S5-only validation worktree /tmp/aegis-s5-loop4-validation`
- Log ref: local shell output: focused 17 passed; full 430 passed; `git diff --check -- services/knowledge-base` passed; no non-S5 status.
- Confirms Loop 4 validates independently of unrelated S3/S4 worktree dirtiness.

## Critic validation

- Plan validation: PASS before implementation.
- Implementation validation #1: FAIL; blockers were unknown control key loss, incomplete identifier normalization, and missing-input rejected-control fallback loss.
- Implementation validation #2: PASS after fixes. Critic verified `JudgeControls` extra-control handling, canonical normalization, normalized exclude suppression, rejected-control fallback preservation, unresolved Source KG validation semantics, decision-fragment cache behavior, fresh score policy evaluation, tests, and docs.
