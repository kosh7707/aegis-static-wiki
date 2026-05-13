---
title: "S5 Loop 9 — Typed Relation Graph and Conflict Model"
page_type: "session-history"
canonical: true
source_refs:
  - ".omx/plans/s5-loop9-typed-relation-conflict-model-plan-20260512.md"
  - "services/knowledge-base/app/relations/conflict_model.py"
  - "services/knowledge-base/app/quality/ledger_quality.py"
  - "services/knowledge-base/app/projections/ledger_projection.py"
  - "services/knowledge-base/tests/test_relation_conflict_model_v1.py"
last_verified: "2026-05-12"
service_tags: ["s5", "knowledge-base", "etl", "relation-graph", "conflict-model"]
decision_tags: ["loop9", "typed-conflict-model-v1", "critic-plan-pass"]
related_pages: ["wiki/canon/specs/s5-evidence-grounded-threat-knowledge-db.md", "wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md", "wiki/canon/api/knowledge-base-api.md"]
---

# S5 Loop 9 — Typed Relation Graph and Conflict Model

## Status

Implementation complete locally. Plan gate completed with Critic PASS after one FAIL/amendment cycle. Implementation Critic validation initially failed on alias exception/evidence refs; fix applied and final re-validation PASS.

## Scope

Loop 9 implements executable typed conflict detection for the S5 evidence ledger.

In scope:

- `app/relations/conflict_model.py`
- integration with `run_ledger_quality_gate(...)`
- conflict projection nodes/text chunks in ledger projection bundles
- tests in `tests/test_relation_conflict_model_v1.py`
- canonical docs for the internal conflict report shape

Out of scope:

- public S3/S4 API changes
- direct Judge conflict population beyond preserving existing `uncertainty.conflicts`
- service health/readiness changes
- final S3 security verdict authority

## Critic plan gate

Initial Critic result: FAIL.

Required amendments were:

1. make Judge visibility explicit and defer direct conflict population;
2. pin affectedness range-conflict grouping, tuple normalization, severity, and stable ID inputs;
3. enumerate exact vs non-exact alias semantics;
4. require health/readiness non-conflation verification;
5. pin quality metrics and issue codes.

Amended plan result: PASS.

## Implementation summary

The implementation adds:

- `s5-relation-conflict-report-v1` from `detect_relation_conflicts(...)`;
- durable `conflict_record` writes with `s5-conflict-evidence-v1` evidence payloads;
- conflict families: affectedness status, affectedness range, opposite relation predicate, and exact alias conflicts;
- quality-gate metrics `conflictRecordCount`, `newlyRecordedConflictCount`, `openConflictCount`, and `conflictKinds`;
- score-vector `conflictPenalty` for open conflicts;
- projection conflict nodes/text chunks with `consumerPolicy=conflicting_evidence_not_negative_evidence`.

Default fixture corpus remains conflict-free. Injected contradictory evidence is recorded and quality-gated.

## Verification evidence

Focused relation-conflict tests passed:

```text
cd services/knowledge-base && .venv/bin/python -m pytest -q tests/test_relation_conflict_model_v1.py
8 passed in 21.43s
```

Focused integration bundle passed:

```text
cd services/knowledge-base && .venv/bin/python -m pytest -q \
  tests/test_relation_conflict_model_v1.py \
  tests/test_evidence_grounded_threat_kb_v1.py \
  tests/test_ledger_projection_v1.py \
  tests/test_judge_answer_contract_v1.py \
  tests/test_api_error_responses.py
53 passed in 63.59s
```

Full S5 suite passed:

```text
cd services/knowledge-base && .venv/bin/python -m pytest -q tests
469 passed in 175.43s
```

Clean S5-only validation worktree `/tmp/aegis-s5-loop9-validation` contained no non-S5 changes and passed:

```text
focused bundle: 53 passed in 62.59s
full S5 suite: 469 passed in 176.14s
```

Final Critic implementation validation: PASS after alias/evidence fixes.
## Critic implementation gate

Initial implementation Critic result: FAIL.

Blocking issues:

1. implementation had an unplanned CVE/advisory alias carve-out;
2. `conflict_record.evidence_json` lacked involved ledger table/ID refs.

Fix applied:

- provider advisory CVE co-references now use `RELATED_ALIAS` during ingestion instead of exact identity semantics; the conflict model no longer has a CVE/advisory carve-out;
- conflict evidence now includes `involvedLedgerRefs`;
- regression coverage verifies default provider CVE co-references are related aliases, not exact identity conflicts, and verifies involved ledger refs in recorded conflict evidence.

Post-fix verification:

```text
relation conflict focused: 8 passed in 21.43s
focused integration bundle: 53 passed in 63.59s
full S5 suite: 469 passed in 175.43s
```

Clean S5-only validation passed after this fix: focused bundle 53 passed in 62.59s; full S5 suite 469 passed in 176.14s. Final Critic implementation re-validation: PASS with no blockers.
