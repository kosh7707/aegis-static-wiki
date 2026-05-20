---
title: "S5 Evidence-Grounded Threat Knowledge DB Foundation"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/knowledge-base/app/ledger/migrations/0001_init.sql"
  - "services/knowledge-base/app/ledger/repository.py"
  - "services/knowledge-base/app/ingestion/corpus_ingestion.py"
  - "services/knowledge-base/app/ingestion/source_coverage_matrix.py"
  - "services/knowledge-base/app/ingestion/cached_artifact_adapter.py"
  - "services/knowledge-base/config/source-coverage-matrix-v1.json"
  - "services/knowledge-base/app/quality/ledger_quality.py"
  - "services/knowledge-base/app/affectedness/engine.py"
  - "services/knowledge-base/app/projections/ledger_projection.py"
  - "services/knowledge-base/app/relations/conflict_model.py"
  - "services/knowledge-base/fixtures/corpus-ingestion-v1/source-manifest.json"
  - "services/knowledge-base/tests/test_corpus_ingestion_v1.py"
  - "services/knowledge-base/tests/test_source_coverage_matrix_v1.py"
  - "services/knowledge-base/tests/test_evidence_grounded_threat_kb_v1.py"
  - "services/knowledge-base/tests/test_ledger_projection_v1.py"
  - "services/knowledge-base/tests/test_relation_conflict_model_v1.py"
  - ".omx/reports/s5_threat_knowledge_db_external_review.md"
  - ".omx/reports/s5-external-review-integration-20260512.md"
last_verified: "2026-05-20"
service_tags: ["s5", "knowledge-base", "threat-knowledge", "etl", "quality-gate", "projection"]
decision_tags: ["evidence-ledger", "affectedness-first", "manual-cache", "no-production-overwrite", "projection-dry-run", "coverage-profile", "cwe-catalog", "source-coverage-matrix", "cached-artifact-adapter", "typed-conflict-model"]
related_pages:
  - "wiki/canon/specs/knowledge-base.md"
  - "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md"
  - "wiki/canon/specs/s5-retrieval-quality-modernization.md"
  - "wiki/canon/api/knowledge-base-api.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
---


# S5 Evidence-Grounded Threat Knowledge DB Foundation


## Current-state note — 2026-05-20

This foundation document remains valid as S5 Threat KB rationale. Current active implementation state is now tracked by [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]].

For TraceAudit/e2e smoke, Threat KB output is exposed through `POST /v1/paper/threat-context/generic` as generic context only. Hidden CVE/fix/advisory/provenance material is filtered or redacted; S5 Threat KB rows are not final verdict evidence.

## Status

Implemented in `services/knowledge-base` on 2026-05-12 as the first foundation pass after external review. Coverage-profile hardening for the CWE-78-only fixture objection is complete and Critic-verified.

This page records the architecture decision and code-level contract for the S5 ETL/ledger/projection work. It intentionally does **not** introduce a new public S3/S4 API contract yet.

## Decision

S5 is an **Evidence-Grounded Threat Knowledge DB** for C/C++ systems, embedded, and native-code static-analysis agents.

Durable storage truth is the typed evidence ledger. Operational query truth is affectedness over a concrete build/component/version context. CWE/CAPEC/ATT&CK remain explanatory layers, not the storage center.

## Implemented scope

Included:

1. ETL coverage foundation for source-family roles.
2. Source artifact metadata with checksum/version/parser/normalizer provenance.
3. Separate identity classes for package, product/CPE, and source component identities.
4. First-class affectedness records.
5. Time-stamped risk signals for CVSS/KEV/EPSS.
6. Identity alias records that avoid exact CPE/PURL collapse.
7. Unresolved/conflict ledger tables.
8. Ledger Quality Gate.
9. Projection bundle dry-run manifest with nodes/edges/text chunks/checksums.
10. Deterministic affectedness query helper over the ledger.
11. Coverage-profile semantics so fixture slices cannot masquerade as full CWE coverage.
12. CWE cached-catalog ingestion test path with multi-CWE relation extraction.
13. Durable serving ledger for Judge query/answer replay, cache/fallback/control trace preservation, and future golden-set promotion.
14. Explicit identity-resolution trace and affectedness guardrails separating package, product/CPE, and source-component identity.
15. Threat KB retrieval evidence packet for Judge answers, with retrieval/context evidence explicitly barred from affectedness proof.
16. Source Coverage Matrix v1 and local cached-artifact adapter for executable ETL source-family coverage gates.
17. Typed Relation Graph / Conflict Model v1 for durable contradictory-evidence recording, quality-gate impact, and projection visibility.

Excluded by user scope:

- live download automation unless explicitly invoked later;
- production Neo4j/Qdrant overwrite;
- final S3/S4 public API contract;
- GraphRAG retrieval hard-gating;
- making CWE/CAPEC/ATT&CK the storage center.

## Coverage profile policy

The default fixture corpus is explicitly a `fixture_slice`. A one-record CWE fixture may be internally complete as a test slice, but it must never be interpreted as full CWE corpus coverage.

Implemented coverage profiles:

- `fixture_slice` — deterministic test slice; logged unresolved referenced CWEs are soft caveats.
- `cached_catalog_snapshot` — local/manual cached catalog snapshot; declared `expectedCoverage` is enforced and unresolved CWE debt is hard failure.
- `production_snapshot` — production-like cached snapshot; declared `expectedCoverage` is enforced and unresolved CWE debt is hard failure.
- `full_cwe_expected` — full-CWE expectation profile; declared `expectedCoverage` is enforced and unresolved CWE debt is hard failure.
- `manifest_only` / `deferred` — non-ingested source states.

The manifest carries `coverageProfile` and `expectedCoverage`; ingestion persists these into `knowledge_source.payload` and `source_artifact.metadata`; projection manifests include `coverageProfilesBySourceKind`; quality reports include the same coverage profile matrix.

Tests enforce:

1. the default CWE-78 fixture is only `fixture_slice`;
2. a single-CWE fixture cannot claim `production_snapshot`, `full_cwe_expected`, or `cached_catalog_snapshot` when declared expected coverage requires more;
3. fixture-slice unresolved CWE references are logged and visible but soft;
4. a cached CWE catalog resolving CWE-78/190/134/415/416 removes the tool-rule CWE debt;
5. cached/production/full profiles hard-fail new unresolved CWE references;
6. undercovered cached catalog artifacts fail manifest validation on `minimumWeaknessCount` and `requiredWeaknessIds`.


## Source Coverage Matrix / Cached Artifact Adapter v1

Loop 8 adds an executable source-family coverage gate for ETL expansion. The matrix lives at `services/knowledge-base/config/source-coverage-matrix-v1.json` and is evaluated by `app/ingestion/source_coverage_matrix.py`.

Key rules:

- First-class scope is C/C++ native/system/embedded/ICS/OT. Non-native-only ecosystem coverage cannot satisfy the S5 first-class gate.
- First-class role source kinds are allowlisted. A matrix that keeps C/C++ language labels but replaces required source roles with non-native ecosystem-only kinds such as npm is rejected.
- Required roles are explicit: weakness taxonomy, attack ontology, vulnerability advisory facts, product/package/source identity, risk signals, C/C++ static analyzer rule mappings, benchmark assets, and the S5 Source Code KG role.
- `risk_exploitation_signal` is axis C/prioritization only. `CISA_KEV` and `FIRST_EPSS` are source kinds; CVSS is a signal extracted from `NVD_CVE` in v1, not a standalone required source kind.
- `source_code_kg` is intentionally present but deferred in fixture corpus evaluation: `requiredSourceKinds=[]`, `deferredSourceKinds=[SOURCE_CODE_KG]`, and `hardFailIfMissing=false`. Runtime Source KG ingest is covered by the Source KG/Judge loop, not by fixture corpus ingestion.
- The returned `coverageGate` is a data-quality coverage gate (`source_coverage_quality_gate_not_service_health`). It is not `/v1/ready`, not service health, and not Neo4j/Qdrant projection freshness.
- The cached-artifact adapter verifies only local `fixturePath`/cache files, hashes, timestamps, provider state, and transform version. It never dereferences `sourceUrl` or artifact `uri`; live downloads remain out of scope unless explicitly invoked later.

`ingest_fixture_corpus(...)` now includes `sourceCoverage` in its report. This makes source coverage/audit evidence visible without changing row transforms or production projection behavior.


## Typed Relation Graph / Conflict Model v1

Loop 9 makes `conflict_record` executable instead of schema-only. `app/relations/conflict_model.py` detects typed contradictions and records durable conflict rows with `schemaVersion=s5-conflict-evidence-v1`.

Conflict families and quality effects:

- `affectedness_status_conflict` / issue `AFFECTEDNESS_STATUS_CONFLICT` — same advisory/subject has affected-like and unaffected-like records; hard quality rejection.
- `affectedness_range_conflict` / issue `AFFECTEDNESS_RANGE_CONFLICT` — same advisory/subject has incompatible normalized range tuples; soft caveat unless paired with a hard status conflict.
- `relation_predicate_conflict` / issue `RELATION_PREDICATE_CONFLICT` — exact opposite relation predicates such as `affects_package` vs `does_not_affect_package`; hard quality rejection.
- `identity_alias_exact_conflict` / issue `IDENTITY_ALIAS_EXACT_CONFLICT` — exact aliases collide across subjects or exact/non-exact semantics conflict for the same subject/alias pair; hard quality rejection. Provider advisories that merely co-reference the same CVE must use `RELATED_ALIAS`, not exact identity semantics.

`run_ledger_quality_gate(...)` now runs conflict detection and exposes `conflictRecordCount`, `newlyRecordedConflictCount`, `openConflictCount`, and `conflictKinds`. `scoreVector.conflictPenalty` reflects open conflicts. These are data-quality/evidence gates only; they do not mutate `/v1/health`, `/v1/ready`, projection readiness, or S3 final verdict authority.

Projection bundles include conflict nodes and text chunks only when conflicts exist. Conflict projection metadata uses `consumerPolicy=conflicting_evidence_not_negative_evidence` and `negativeEvidenceAllowed=false` so conflicts cannot be interpreted as clean-pass or negative vulnerability proof. Direct Judge conflict population is deferred; existing Judge packets keep `uncertainty.conflicts` as the serving placeholder.

## Ledger sequence

```text
manual source cache
  -> source_artifact
  -> raw_artifact
  -> normalized_record
  -> identity_alias / domain records
  -> affectedness_record / risk_signal
  -> relation_record
  -> transform_decision
  -> unresolved_reference / conflict_record
  -> quality gate
  -> projection bundle dry-run
  -> canonical Judge query/answer
  -> serving_query_run ledger row
```

## Identity policy

S5 separates identity classes:

```text
PackageIdentity          PURL/ecosystem/package-manager identity
ProductIdentity          CPE/vendor/product/platform identity
SourceComponentIdentity  repo/commit/path/fingerprint/vendored source identity
BuildObservedComponent   future S3/S4-supplied observed component context
```

CPE/PURL mapping is stored as confidence-bearing `RELATED_PRODUCT_IDENTITY` evidence, not as `SAME_AS_EXACT` for hard affectedness. The Quality Gate rejects exact CPE/PURL alias collapse.

Loop 6 makes this policy executable through `app/identity/resolver.py`. `resolve_component_identity` emits `s5-identity-resolution-v1` with package/product/source matches, hard affectedness eligibility, ambiguity state, and diagnostics. Only direct package identity evidence may feed `hardAffectednessPackageIds`; CPE/product-only, source-component-only, risk signal, and vector/retrieval evidence cannot become package affectedness proof by themselves.

## Affectedness and risk policy

Affectedness is first-class and deterministic. `app/affectedness/engine.py` returns `affected`, `known_not_affected`, or `unknown` from ledger evidence only; it does not use vector search. The affectedness engine now consumes explicit identity-resolution output and evaluates `affectedness_record` only for hard-eligible package identities.

CVSS, KEV, and EPSS are stored as time-stamped risk/prioritization signals, not as affectedness proof.

## Threat retrieval context policy

Loop 7 adds `evidence.threatRetrieval` to Judge answers. This packet assembles ledger-backed advisory, weakness, attack-pattern, and risk-signal context with retrieval-trace metadata. Its authority is always `contextual_support_not_affectedness_proof`, and `negativeEvidenceAllowed` is always false.

Threat retrieval evidence can support explanation, triage, and evidence navigation. It cannot decide affectedness, cannot create negative evidence from no-hit/keyword/vector results, and cannot override identity-resolution guardrails.

## Projection reliability

Neo4j/Qdrant remain derived projections. Production overwrite is not performed in this pass.

`app/projections/ledger_projection.py` builds dry-run projection bundle artifacts:

- `nodes.jsonl`
- `edges.jsonl`
- `text_chunks.jsonl`
- `manifest.json`
- `qa_report.json`

The manifest records counts, checksums, `coverageProfilesBySourceKind`, and `productionWriteEnabled: false`. Projection edges must carry ledger evidence.

## Durable serving ledger

Loop 5 adds `serving_query_run` as the third ledger-family slice alongside acquisition and projection state.

Each Judge answer is persisted with:

- canonical query ID and decision-fragment key;
- normalized component/source context;
- full request and answer JSON packets;
- applied controls and control effects;
- fallback trace and cache trace;
- verdict, status, quality gate;
- score vector and score policy metadata;
- durable `servingRunId` and `createdAt`.

The returned answer packet includes `servingLedger` so downstream logs, tests, and future golden-set material can point back to an exact replay/debug row. This remains SQLite staging; it does not activate production Neo4j/Qdrant writes.

## Verification evidence

Latest post-Critic-fix verification:

```bash
.venv/bin/python -m pytest tests/test_corpus_ingestion_v1.py tests/test_evidence_grounded_threat_kb_v1.py tests/test_ledger_projection_v1.py -q
# 31 passed in 47.29s

.venv/bin/python -m pytest tests -q
# 403 passed in 68.20s

git diff --check -- services/knowledge-base
# diff-check: ok
```

Critic gates:

- Plan gate #1: PASS with required tightenings.
- Final gate #2: FAIL because `cached_catalog_snapshot` did not enforce `expectedCoverage`.
- Final gate #3: PASS after cached-catalog expected-coverage enforcement and regression tests.

## Follow-up boundaries

Next passes may expand real cached source snapshots and golden sets, but should preserve these constraints:

1. do not collapse source evidence into merged facts too early;
2. do not use fuzzy CPE/PURL equivalence for hard affectedness;
3. do not treat KEV/EPSS as affectedness proof;
4. do not hard-gate GraphRAG before deterministic affectedness and golden-set answerability stabilize;
5. keep Neo4j/Qdrant disposable projections from the ledger;
6. never treat a `fixture_slice` as complete production CWE coverage.
