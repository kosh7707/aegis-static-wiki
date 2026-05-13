---
title: "S5 Loop 8 — Source Coverage Matrix and Cached Artifact Adapter"
page_type: "session-history"
canonical: true
source_refs:
  - ".omx/plans/s5-loop8-source-coverage-cache-adapter-plan-20260512.md"
  - "services/knowledge-base/config/source-coverage-matrix-v1.json"
  - "services/knowledge-base/app/ingestion/source_coverage_matrix.py"
  - "services/knowledge-base/app/ingestion/cached_artifact_adapter.py"
  - "services/knowledge-base/tests/test_source_coverage_matrix_v1.py"
last_verified: "2026-05-12"
service_tags: ["s5", "knowledge-base", "etl", "source-coverage", "cached-artifact-adapter"]
decision_tags: ["loop8", "source-coverage-matrix-v1", "cached-artifact-adapter-v1", "critic-plan-pass"]
related_pages: ["wiki/canon/specs/s5-evidence-grounded-threat-knowledge-db.md", "wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md", "wiki/canon/api/knowledge-base-api.md"]
---

# S5 Loop 8 — Source Coverage Matrix and Cached Artifact Adapter

## Status

Implementation complete locally after one implementation Critic FAIL and fix. Plan gate completed with Critic PASS after one FAIL/amendment cycle. Final implementation Critic re-validation PASS.

## Scope

Loop 8 implements an executable source coverage matrix and local cached-artifact verification layer for S5 ETL expansion.

In scope:

- `config/source-coverage-matrix-v1.json`
- `app/ingestion/source_coverage_matrix.py`
- `app/ingestion/cached_artifact_adapter.py`
- `ingest_fixture_corpus(...).sourceCoverage`
- tests in `tests/test_source_coverage_matrix_v1.py`
- canonical docs for the internal ETL report shape

Out of scope:

- live downloads
- production Neo4j/Qdrant overwrite
- public S3/S4 API change
- final S3 security verdict authority

## Critic plan gate

Initial Critic result: FAIL.

Required amendments were:

1. explicit C/C++ native/domain/language scope and non-native rejection;
2. CVSS as NVD-derived signal, not standalone required source kind;
3. coverage gate separate from service readiness/health/projection freshness;
4. precise Source Code KG deferred-role shape;
5. no-network cached adapter with explicit metadata/hash diagnostics.

Amended plan result: PASS.

## Implementation summary

The implementation adds:

- source roles for weakness taxonomy, attack ontology, vulnerability advisories, identity, risk signals, C/C++ analyzer rules, benchmark assets, and Source Code KG;
- `coverageGate.kind=source_coverage_quality_gate_not_service_health` as a data-quality gate only;
- C/C++ native first-class scope checks;
- risk-signal axis-C-only enforcement and CVSS-as-NVD-derived semantics;
- `SOURCE_CODE_KG` deferred fixture-corpus role with no hard failure;
- local cache/hash/provider metadata verification that never dereferences `sourceUrl` or artifact `uri`.

## Verification evidence

Focused source coverage tests initially passed with 9 tests; after the Critic-requested non-native source-kind bypass regression, the same suite passed with 10 tests:

```text
cd services/knowledge-base && .venv/bin/python -m pytest -q tests/test_source_coverage_matrix_v1.py
10 passed
```

Focused integration bundle passed:

```text
cd services/knowledge-base && .venv/bin/python -m pytest -q \
  tests/test_source_coverage_matrix_v1.py \
  tests/test_corpus_ingestion_v1.py \
  tests/test_evidence_grounded_threat_kb_v1.py \
  tests/test_ledger_projection_v1.py \
  tests/test_judge_answer_contract_v1.py \
  tests/test_serving_ledger_v1.py
51 passed
```

Full S5 suite passed in the main worktree:

```text
cd services/knowledge-base && .venv/bin/python -m pytest -q tests
461 passed in 161.68s
```

Diff checks passed:

```text
git diff --check -- services/knowledge-base .omx/plans/s5-loop8-source-coverage-cache-adapter-plan-20260512.md
git -C /home/kosh/aegis-static-wiki diff --check -- wiki/canon/specs/s5-evidence-grounded-threat-knowledge-db.md wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md wiki/canon/api/knowledge-base-api.md wiki/canon/handoff/s5/session-2026-05-12-s5-source-coverage-matrix-loop8.md
```

Clean S5-only validation worktree `/tmp/aegis-s5-loop8-validation` contained no non-S5 changes and passed:

```text
focused bundle: 51 passed in 74.59s
full S5 suite: 461 passed in 159.33s
```

## Critic implementation gate

Initial implementation Critic result: FAIL.

Blocking issue: a matrix could preserve C/C++ `languageScope` while replacing every required non-deferred source role with a non-native ecosystem-only source kind such as `NPM`; the evaluator accepted that manifest/matrix pair.

Fix applied:

- added `firstClassSourceKindAllowlist` to `config/source-coverage-matrix-v1.json`;
- added evaluator rejection code `NON_NATIVE_SOURCE_KIND_NOT_ALLOWED_FOR_FIRST_CLASS_COVERAGE`;
- added regression test `test_non_native_role_source_kinds_cannot_bypass_cpp_scope_declaration`.

Post-fix verification:

```text
source coverage focused: 10 passed
focused integration bundle: 51 passed in 75.83s
full S5 suite: 461 passed in 161.68s
clean S5-only focused bundle: 51 passed in 74.59s
clean S5-only full suite: 461 passed in 159.33s
```

Final Critic implementation re-validation: PASS. No blockers found; Critic manually reproduced the prior NPM-only bypass scenario and confirmed it now returns rejected/hardFail with `NON_NATIVE_SOURCE_KIND_NOT_ALLOWED_FOR_FIRST_CLASS_COVERAGE`.
