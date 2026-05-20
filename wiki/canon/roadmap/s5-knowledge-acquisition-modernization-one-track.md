---
title: "S5 Knowledge Acquisition Modernization — One-track Plan"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "User S5 modernization discussion, 2026-05-11"
  - "mcp://aegis-static-wiki/read_page/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c"
  - "mcp://aegis-static-wiki/read_page/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d"
  - "mcp://aegis-static-wiki/read_page/s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "s4", "knowledge-base", "etl", "graphrag", "acquisition-ledger", "knowledge-corpus", "cve", "code-graph"]
decision_tags: ["one-track-plan", "knowledge-acquisition-modernization", "golden-set-first", "runtime-vs-offline-evaluation", "typed-retrieval", "system-stability-vs-quality-gate", "sqlite-ledger", "neo4j-qdrant-projections", "keyword-as-signal", "automotive-first-native-system-scope", "s3-conditional-pass"]
related_pages:
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c.md"
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d.md"
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl.md"
  - "wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-.md"
  - "wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s.md"
  - "wiki/canon/work-requests/s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual.md"
  - "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md"
  - "wiki/canon/specs/s5-acquisition-state-machine/readme.md"
  - "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md"
  - "wiki/canon/api/knowledge-base-api.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md"
  - "wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
---


# S5 Knowledge Acquisition Modernization — One-track Plan


## Current-state note — 2026-05-20

This one-track modernization plan is complete as a historical execution plan for G001-G010-era acquisition work. Current active S5 state and post-paper-context readiness live in [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]].

Future acquisition work should start from concrete post-smoke evidence, S3 WRs, or benchmark gaps, and must preserve the current producer-boundary rule: S5 context is supporting evidence, not final TP/FP/UNKNOWN authority.

> Status: `$ultragoal` execution complete — G001-G010 complete
> Owner: S5 Knowledge Base
> Scope: automotive-first C/C++ system / embedded / native-code knowledge acquisition, ETL, durable ledger, and GraphRAG modernization
> Current S3 signal: **CONDITIONAL PASS** on (1) Knowledge Coverage / Acquisition Readiness, (2) Knowledge Corpus taxonomy/profile split, and (3) runtime candidate semantics vs offline quality metrics split.

---

## 1. Why this plan exists

The original user goal was not merely to add a target-context API. The intended S5 modernization has two inseparable outcomes:

1. **ETL pipeline modernization** — collect more relevant, accurate, provenance-rich knowledge and store it as auditable S5-owned truth.
2. **GraphRAG architecture modernization** — turn S5 from a thin hybrid search service into a reliable target-aware knowledge acquisition service whose results S3 can safely consume.

The earlier target-context and acquisition-envelope work was necessary but not sufficient. It added the safe S3/S5 contract surface, but it did not yet modernize the existing ETL pipeline or GraphRAG internals. This plan is the one-track continuation.

---

## 2. Fixed scope decisions

### In scope

S5 modernization targets:

- Automotive-first C/C++ system, embedded, native-code security analysis.
- Public vulnerability intelligence for native/system components.
- Package/component identity and version/range reasoning.
- CWE/CAPEC/ATT&CK/mitigation knowledge.
- Static-analysis tool/rule knowledge for the S4 C/C++ sensor set.
- Target-aware acquisition readiness, evidence-safe no-hit semantics, and projection debt reporting.
- SQLite-backed S5 SQL ledger first, with a later Postgres seam.

### Out of scope

- Python package ecosystem.
- JavaScript/npm/web-app ecosystem.
- S5 final vulnerability/security verdicts.
- S5 clean-pass declarations.
- Runtime exploitability judgment.
- Treating Neo4j/Qdrant as source of truth.
- Treating keyword-only or embedding-only absence as no-hit.

### Framing correction from S3

S3 accepted the taxonomy split with one critical correction:

```text
AEGIS is automotive-first native/embedded security analysis,
not automotive-only keyword matching.
```

Therefore:

```text
Core taxonomy = native/system vulnerability primitives.
Default/primary profile = automotive-specialization.
Additional first-class profiles = embedded-system-specialization and ics-ot-specialization.
```

Automotive is not the core vulnerability taxonomy, but it remains AEGIS's primary/default specialization profile and should enrich/prioritize native/system findings.

---

## 3. Core architectural decision

The accepted storage decision remains:

```text
S5 SQL ledger = source of truth.
Neo4j = graph/query projection derived from the ledger.
Qdrant = vector/search projection derived from the ledger.
S2 DB = orchestration/report database, not S5 acquisition truth.
```

Alpha storage target:

```text
services/knowledge-base/data/s5-ledger.sqlite
AEGIS_KB_LEDGER_URL=sqlite:///data/s5-ledger.sqlite
```

The current `data/target-contexts.json` store is a bootstrap compatibility store, not the final durable ledger.

---

## 4. S3 feedback incorporated

### Knowledge Coverage / Acquisition Readiness reply

S3 conditionally accepted the Knowledge Coverage / Acquisition Readiness direction and required that S5 freeze machine-readable semantics before making the ledger authoritative.

S3's required sequencing:

1. Freeze `Knowledge Coverage Contract v1`.
2. Freeze `Acquisition Readiness Contract v1`.
3. Add candidate-CVE vs CVE-discovery fixtures/oracles.
4. Align S3 EvidenceCatalog mapping.
5. Then implement/finalize the S5-owned SQL durable acquisition ledger.

Important S3 warning:

```text
Do not let an ambiguous ledger become source of truth before fixture/oracle semantics are locked.
```

### Knowledge Corpus taxonomy/profile reply

S3 conditionally accepted the split into native/system core taxonomy plus specialization profiles, with automotive as the primary/default profile. S3 also requested deeper retrieval-signal discussion before GraphRAG/reranker implementation.

### Runtime candidate semantics vs offline metrics reply

S3 validated the distinction between:

1. **Runtime S5 acquisition/retrieval** — candidates, methods, provenance, readiness, projection/provider state, consumer policy.
2. **Offline S5 Golden Set / Quality Gate evaluation** — fixture/oracle metrics such as TP/FP/FN/Recall/Precision/NDCG/MRR.
3. **S3 final claim quality** — accepted claims, no accepted claims, inconclusive outcomes, clean pass, final evidence admissibility.

Required terminology guards:

```text
completed_hit != true_positive
completed_hit != accepted vulnerability claim
completed_no_hit != no_candidate_returned
completed_no_hit != proof of target safety
no_candidate_returned != completed_no_hit
candidate_returned != accepted claim
```

---

## 5. One-track phase plan

This is one track, not separate tracks. The phases are ordered because later work depends on earlier semantics.

### Phase 0 — Contract, vocabulary, and runtime/offline semantics freeze

Goal: make S5 legible to S3 before deeper ETL/GraphRAG changes.

Deliverables:

- `Knowledge Coverage Contract v1`.
- `Acquisition Readiness Contract v1`.
- Runtime vs offline evaluation vocabulary.
- CVE candidate evaluation vs CVE discovery split.
- EvidenceCatalog mapping rules for S5 results.
- No-hit, stale-cache, keyword fallback, provider timeout/error, projection debt policies.
- Target-scoped readiness shape with per-surface status.

Minimum S3-required surfaces:

- `weaknessTaxonomy`
- `attackPatternMapping`
- `mitigationKnowledge`
- `publicVulnerabilityKnowledge`
- `cveCandidateEvaluation`
- `cveDiscovery`
- `versionRangeEvaluation`
- `semanticThreatRetrieval`
- `semanticCodeRetrieval`
- `structuralCodeProjection`
- `dangerousCallerTraversal`
- `projectMemoryContext`
- `providerFreshness` / `cacheFreshness`
- `projectionState`

Must remain explicit `not_provided`:

- `finalSecurityVerdict`
- `cleanPass`
- `runtimeBehavior`
- `exploitabilityJudgment`
- `completeProjectSafety`

Runtime language S5 may use:

- `candidate_returned`
- `no_candidate_returned`
- `candidate_count`
- `method_used` / `methodsUsed`
- `confidence` / `score`
- `consumerPolicy`
- `projectionState`
- `providerState`
- `retrievalTrace`

Offline quality language reserved for Golden Set reports:

- `true_positive`
- `false_positive`
- `false_negative`
- `recall`
- `precision`
- `NDCG`
- `MRR`

Acceptance criteria:

- S3 can tell which S5 surface is ready, partial, stale, input-insufficient, provider-unavailable, or projection-debt-bound.
- No `completed_no_hit` can be emitted without explicit method/scope completeness.
- `no_candidate_returned` is not upgraded to `completed_no_hit` unless all S3 no-hit rules pass.
- `completed_hit` is not represented as true positive or S3 claim support.
- Keyword-only no-result cannot become no-hit.
- Provider timeout/error returns acquisition envelope when target context is resolved.

---

### Phase 1 — Golden Set v1 and gate model

Goal: make modernization measurable before changing algorithms.

Gate separation:

1. **System Stability Gate** — did the system run honestly and reproducibly?
2. **Evidence Readiness Gate** — can downstream consumers safely interpret the artifact?
3. **Quality Gate** — is the result actually good according to fixtures/metrics?

System Stability Gate examples:

- ETL job completes or fails with explicit diagnostics.
- Raw source manifests are persisted.
- Ledger writes are idempotent.
- Projection failure records projection debt instead of hiding failure.
- Neo4j/Qdrant projection failure does not corrupt ledger truth.

Evidence Readiness Gate examples:

- Coverage/readiness contracts exist.
- No-hit scope/method set is auditable.
- Provider errors, stale cache, keyword fallback, projection debt are not negative evidence.
- Item-level status remains authoritative.
- Relation provenance exists.

Quality Gate examples:

- Package identity accuracy.
- CVE range-out correctness.
- Retrieval precision/recall/NDCG/MRR.
- Expected-candidate coverage / hit-rate.
- Evidence-slot fill rate.
- Relation correctness.
- Keyword false positive/false negative rate.
- Method-level, queryIntent-level, corpus-partition, and profile-specific breakdowns.
- Reranker/top-k/embedding comparison.

Minimum S3-required quality metrics:

- `Precision@k`
- `Recall@k`
- `NDCG@k`
- `MRR`
- hit-rate / expected-candidate coverage
- false-positive count/rate
- false-negative count/rate
- method-level breakdown
- queryIntent-level breakdown
- corpus-partition breakdown
- profile-specific breakdown, especially automotive vs non-automotive

Golden set families:

- ETL transform fixtures.
- CVE/package fixtures.
- Threat GraphRAG retrieval fixtures.
- Code graph fixtures.
- S3 evidence-slot end-to-end fixtures.

Minimum CVE/package fixtures required by S3:

1. known library + candidate CVE range-out + discovery no-hit;
2. known library + candidate CVE range-out + different CVE discovery hit;
3. version unknown/ambiguous -> `input_insufficient` and non-negative diagnostic;
4. keyword-only fallback no-result -> no `completed_no_hit`;
5. provider timeout/error -> acquisition envelope, no no-hit;
6. stale cache only -> contextual/diagnostic only;
7. projection debt for code search/dangerous callers -> empty result is not no caller/path;
8. mixed batch `completed_no_hit + timeout/error/not_ready/input_insufficient/stale_cache_only` -> no `partial_hit` without a real `completed_hit`.

Minimum retrieval/taxonomy fixtures required by S3:

1. command execution local evidence without automotive keywords still maps to `command_execution` / CWE-78-like context;
2. automotive gateway context enriches severity/explanation but does not create vulnerability by itself;
3. keyword absence does not become no-hit or low-confidence vulnerability verdict;
4. global embedding similarity returns plausible noise, but typed/constrained retrieval suppresses irrelevant hits;
5. keyword false positive is recorded as weak candidate only;
6. keyword false negative is retrieval miss in offline quality evaluation only, not runtime negative evidence;
7. tool-rule mapping connects S4 local finding to CWE/taxonomy context without becoming local support;
8. package identity alias maps repo/package/CPE without relying only on NVD keywordSearch;
9. profile tags are additive context, not final verdicts.


Current G002 artifact paths:

- `services/knowledge-base/app/evaluation/golden_set.py`
- `services/knowledge-base/fixtures/golden-set-v1/manifest.json`
- `services/knowledge-base/tests/test_golden_set_v1.py`

G002 implementation boundary: this establishes deterministic fixtures and a separated offline gate harness. It does not yet claim improved retrieval algorithms, ledger-backed ingestion, or projection rebuild.

Acceptance criteria:

- A failing Quality Gate does not imply system instability.
- A passing System Stability Gate does not imply evidence sufficiency.
- A passing Evidence Readiness Gate does not imply retrieval quality is good.
- False clean/no-hit from incomplete acquisition is prevented by tests.

---

### Phase 2 — Knowledge Corpus v1 and taxonomy/profile freeze

Goal: decide what S5 collects and how it organizes knowledge before tuning matching.

S3-accepted structure:

```text
Core C/C++ native/system taxonomy
  + automotive-specialization as primary/default AEGIS profile
  + embedded-system-specialization
  + ics-ot-specialization
```

Minimum core categories requested by S3:

- `memory_safety`
- `command_execution`
- `input_validation`
- `path_file_access`
- `crypto_tls`
- `authn_authz`
- `network_protocol`
- `parser_serialization`
- `concurrency`
- `resource_lifecycle`
- `credential_secret_exposure`
- `information_exposure_logging`
- `third_party_component`
- `build_supply_chain`
- `firmware_boot_update`
- `os_kernel_driver`
- `rtos_embedded`
- `privilege_boundary`

Primary/default automotive profile examples:

- `can_bus`
- `ecu_gateway`
- `telematics`
- `ivi`
- `ota_vehicle`
- `adas_sensor`
- `charging_infra`
- `vehicle_key_auth`
- `diagnostic_service`
- `in_vehicle_network`

Embedded-system profile examples:

- `rtos_tasking`
- `firmware_image`
- `bootloader`
- `secure_boot`
- `mcu_peripheral`
- `cross_compilation`
- `bare_metal`
- `resource_constrained_runtime`

ICS/OT profile examples:

- `plc`
- `scada`
- `hmi`
- `modbus`
- `dnp3`
- `opc_ua`
- `iec_62443`
- `industrial_control_network`

Knowledge Corpus v1 source families:

A. Schema/taxonomy/provenance/golden set first:

- taxonomy enum
- specialization profile enum
- relation method enum
- consumerPolicy mapping
- relation provenance schema
- retrieval false-positive / false-negative golden set
- GraphRAG retrieval quality oracle

B. Weakness/attack/tool-rule core:

- CWE
- CAPEC
- ATT&CK ICS
- native/system-relevant ATT&CK Enterprise subset
- Semgrep rule metadata
- Cppcheck categories
- clang-tidy checks
- gcc-fanalyzer diagnostics
- scan-build / Clang Static Analyzer checkers
- Flawfinder rule/category data
- curated CWE ↔ tool-rule ↔ taxonomy mapping

C. Package/component identity:

- CPE dictionary
- purl/package-url-compatible identity mapping
- OSV package ecosystem metadata
- native/system library aliases
- vendor/project/repo alias table
- repo URL ↔ package name ↔ CPE candidate map

D. Vulnerability intelligence:

- OSV
- NVD CVE
- GHSA
- CISA KEV
- FIRST EPSS

E. Domain profiles:

- automotive-specialization
- embedded-system-specialization
- ICS/OT-specialization


Current G003 artifact paths:

- `services/knowledge-base/app/corpus/knowledge_corpus.py`
- `services/knowledge-base/fixtures/knowledge-corpus-v1/manifest.json`
- `services/knowledge-base/tests/test_knowledge_corpus_v1.py`

G003 implementation boundary: this freezes versioned machine-readable taxonomy/profile/method/provenance assets and tests. It does not implement ledger schema, source ingestion, transform-decision persistence, projection rebuild, or typed GraphRAG runtime changes.

Acceptance criteria:

- Automotive is the primary/default specialization, not the core vulnerability taxonomy and not an afterthought.
- Current `automotive_relevance` is replaced or wrapped by profile-aware relevance.
- Taxonomy assets are data/versioned inputs, not hardcoded process truth.
- Keyword-derived profile tags are stored as signals with method/confidence/provenance.

---

### Phase 3 — SQLite ledger foundation

Goal: introduce S5-owned source-of-truth storage before projection rebuild.

Minimum repository seam:

- `LedgerRepository` interface.
- SQLite implementation.
- Migration/init logic.
- Config seam via `AEGIS_KB_LEDGER_URL`.
- Tests against temp SQLite DB.

Candidate entities:

- `knowledge_source`
- `raw_artifact`
- `normalized_record`
- `package_identity`
- `vulnerability_advisory`
- `affected_range`
- `weakness`
- `attack_pattern`
- `mitigation`
- `tool_rule`
- `domain_concept`
- `relation_record`
- `transform_decision`
- `provider_observation`
- `target_context`
- `target_context_version`
- `acquisition_run`
- `acquisition_item`
- `projection_state`
- `projection_job`

Minimum relation provenance fields requested by S3:

- `subjectId`
- `predicate`
- `objectId`
- `sourceKind`
- `sourceId`
- `sourceVersion`
- `sourceUrl`
- `method`
- `methodVersion`
- `confidence`
- `taxonomyFamily`
- `specializationProfiles[]`
- `matchedTerms[]`
- `score`
- `consumerPolicy`
- `createdAt`
- `freshness`

Important ledger rule:

```text
The ledger stores truth and decisions. Neo4j/Qdrant store projections.
```


Current G004 artifact paths:

- `services/knowledge-base/app/ledger/repository.py`
- `services/knowledge-base/app/ledger/migrations/0001_init.sql`
- `services/knowledge-base/tests/test_ledger_repository.py`
- `services/knowledge-base/tests/test_target_context_ledger_integration.py`

G004 implementation boundary: this establishes the authoritative SQLite ledger repository, schema/init, target-context ledger-first seam, and compatibility mirror failure semantics. It does not ingest new corpus sources, populate transform decisions, rebuild Neo4j/Qdrant projections, or implement typed GraphRAG runtime changes.

Acceptance criteria:

- Target context versioning can be moved behind repository seam.
- Acquisition envelopes/items can be persisted.
- Provider observations can be persisted independently of transient response.
- Projection states can represent synced/pending/stale/failed/debt.
- Existing JSON store remains dev fallback or migration source only.
- Relation `method` distinguishes official source relation, curated mapping, provider affected-range evaluation, graph-derived neighbor, keyword match, and embedding similarity.

---

### Phase 4 — ETL source expansion and normalization

Goal: collect more ground truth with source/provenance/freshness.

S3 ordering emphasizes schema/taxonomy/golden set first, then weakness/tool-rule core, package identity, vulnerability intelligence, and profiles. Implementation may stage data ingestion incrementally, but must not claim quality without the earlier schema/oracle surfaces.

Public vulnerability intelligence should store:

- advisory/source ID;
- source provider;
- affected/fixed ranges;
- package ecosystem;
- CPE and purl-like identity;
- repo/commit when available;
- CVSS/EPSS/KEV;
- source timestamps;
- fetch timestamp and freshness;
- parse/transform diagnostics.

Package identity should avoid keyword-only NVD lookup as the primary mechanism. Instead, S5 should maintain candidate identity rows such as:

```text
name / alias / vendor / repo / CPE / purl / ecosystem / confidence / source
```


Current G005 artifact paths:

- `services/knowledge-base/app/ingestion/corpus_ingestion.py`
- `services/knowledge-base/fixtures/corpus-ingestion-v1/source-manifest.json`
- `services/knowledge-base/fixtures/corpus-ingestion-v1/raw/*.json`
- `services/knowledge-base/tests/test_corpus_ingestion_v1.py`

G005 implementation boundary: this ingests deterministic fixtures into the authoritative SQLite ledger and records manifest-only/deferred source coverage explicitly. It does not perform live provider downloads, broad production ingestion, transform-decision signal modeling, Neo4j/Qdrant projection rebuild, or typed GraphRAG runtime changes.

Acceptance criteria:

- Raw artifacts are manifest-tracked.
- Every normalized record can trace to raw source and transform version.
- Package aliases and CPE candidates are auditable.
- Provider freshness and stale-cache states are explicit.

---

### Phase 5 — Keyword/semantic/graph signal model

Goal: keep keyword matching but demote it from truth to evidence signal.

Signal hierarchy:

| Signal | Strength | Role |
|---|---:|---|
| explicit source relation | strong | relation ground truth |
| curated mapping | strong/medium | taxonomy/rule mapping |
| version range match | strong scoped | candidate CVE evaluation |
| package identity exact match | strong | CVE lookup input |
| graph-derived relation | medium | contextual expansion |
| keyword match | medium/low | candidate generation / contextual tag |
| embedding similarity | medium/low | retrieval candidate |
| constrained embedding rerank | medium/low | ordering inside typed candidate set |
| global embedding search | low trust | must be explicit in trace |
| keyword-only no-result | weak observation | no-hit forbidden |
| semantic-only no-result | weak observation | no-hit forbidden |

Runtime observation language:

- `candidate_returned`
- `no_candidate_returned`
- `candidate_count`
- `methodsAttempted[]`
- `methodsSucceeded[]`
- `consumerPolicy`

Offline quality language only:

- TP/FP/FN
- Recall/Precision/NDCG/MRR
- expected-candidate missing

Required transform/retrieval decision fields:

- method
- matched terms or relation source
- source refs
- output field/value
- taxonomy/profile
- confidence
- rule version
- evidence spans when available
- consumer policy


Current G006 artifact paths:

- `services/knowledge-base/app/signals/taxonomy_signals.py`
- `services/knowledge-base/fixtures/transform-signals-v1/manifest.json`
- `services/knowledge-base/tests/test_transform_signal_model_v1.py`
- `services/knowledge-base/app/ledger/repository.py` (`upsert_transform_decision`)
- `services/knowledge-base/app/ingestion/corpus_ingestion.py` (normalized/relation transform-decision persistence)

G006 implementation boundary: this persists transform decisions and signal semantics into the authoritative ledger and fixture harness. It does not rebuild Neo4j/Qdrant projections, implement runtime CVE candidate/discovery endpoints, or tune typed GraphRAG retrieval/reranking.

Acceptance criteria:

- Keyword hit may create candidate/contextual tag.
- Keyword no-result never creates `completed_no_hit`.
- Embedding similarity alone never creates clean/safe/affected/not-affected truth.
- Graph-derived relation is distinguishable from direct source relation.
- Runtime `no_candidate_returned` remains a raw observation unless no-hit rules explicitly promote it.

---

### Phase 6 — Projection rebuild from ledger

Goal: stop building Neo4j from Qdrant metadata and make both projections derive from the ledger.

Current problem:

```text
UnifiedThreatRecord -> Qdrant -> Qdrant metadata scroll -> Neo4j seed
```

Target:

```text
S5 SQL ledger
  ├─ Neo4j graph projection
  └─ Qdrant vector projection
```

Projection requirements:

- relation provenance should be projected into Neo4j payload/properties where useful;
- Qdrant payload should point back to ledger IDs and projection versions;
- projection state rows should record source hash/version and sync/debt status;
- GraphRAG search responses must surface projection debt when relevant.


Current G007 artifact paths:

- `services/knowledge-base/app/projections/ledger_projection.py`
- `services/knowledge-base/app/ledger/repository.py` (`record_projection_job`, `list_projection_jobs`, projection state helpers)
- `services/knowledge-base/scripts/neo4j-seed.py` (ledger-derived default path)
- `services/knowledge-base/tests/test_ledger_projection_v1.py`

G007 implementation boundary: this establishes ledger-derived projection records and projection state/job debt reporting. It does not implement runtime CVE candidate/discovery split or typed GraphRAG planner/reranker/top-k tuning.

Acceptance criteria:

- Qdrant no longer feeds Neo4j truth.
- Projection failures leave ledger truth intact.
- Empty graph/vector result under projection debt cannot be consumed as negative evidence.

---

### Phase 7 — CVE acquisition split and readiness implementation

Goal: make the original CVE requery scenario safe and useful.

Split surfaces:

1. `cveCandidateEvaluation`
   - asks whether a specific candidate CVE affects a library/version/scope.
   - `version_match=false` may reject that candidate only under S3's strict conditions.

2. `cveDiscovery`
   - asks whether public vulnerability context exists for library/version/scope.
   - uses AcquisitionEnvelopeV1 statuses.

Key rules:

- `version_match=false` is scoped candidate exclusion, not library safety.
- `version_match=null` is inconclusive.
- `completed_no_hit` requires explicit method completeness.
- keyword-only no-result is incomplete/caveated, not no-hit.
- provider timeout/error/stale cache returns envelope diagnostics.

Acceptance criteria:

- S3 can reject a specific candidate CVE without declaring the library safe.
- Discovery no-hit is scoped and method-complete.
- Other CVE hits can coexist with original candidate range-out.
- All outcomes are item-level auditable.

Current G008 artifact paths:

- `services/knowledge-base/app/cve/acquisition_split.py`
- `services/knowledge-base/app/routers/target_context_api.py` (`/acquire/cve-candidate-evaluation`, `/acquire/cve-discovery`, compatibility `/acquire/cve`)
- `services/knowledge-base/app/ledger/repository.py` linked acquisition/provider observation list helpers
- `services/knowledge-base/tests/test_cve_acquisition_split_v1.py`
- `services/knowledge-base/tests/test_target_context_api.py`

G008 implementation boundary: this implements runtime CVE candidate/discovery split, conservative method completeness, linked ledger observations, and no unsafe range-out inference. It does not implement typed GraphRAG planner/reranker/top-k tuning.

---

### Phase 8 — Typed GraphRAG architecture modernization

Goal: modernize retrieval only after corpus, ledger, and fixtures exist.

S3-approved model:

```text
typed query intent
  + corpus partitioning
  + constrained candidate retrieval
  + method/provenance-aware reranking
  + explicit consumerPolicy
```

Minimum query intents requested by S3:

- `weakness_context`
- `attack_pattern_context`
- `mitigation_context`
- `tool_rule_mapping`
- `package_identity_resolution`
- `candidate_cve_evaluation`
- `cve_discovery`
- `domain_profile_context`
- `code_context`
- `project_memory_context`

S3 may send these fields where available:

- `queryIntent`
- `localEvidenceFamily`
- `candidateCwe[]`
- `sink` / `callee` / `dangerousFunction`
- `sastTool`
- `sastRuleId`
- `sourceLanguage`
- `domainProfiles[]`
- `targetFacts`
- library identity/version/repo/commit for package/CVE surfaces
- `sourceEvidenceRefs[]` / local evidence refs for reattachment

S5 must support typed intents both with and without explicit `candidateCwe[]`.

Minimum runtime result fields requested by S3:

- `surface`
- `acquisitionStatus`
- `consumerPolicy`
- `results[]`
- `itemAcquisitions[]` when mixed/batch
- `scope`
- `sourceEvidenceRefs[]`
- `derivedFromEvidenceRefs[]`
- `projectionState`
- `providerState`
- `fallbackTrace[]`
- `diagnostics[]`

Minimum `retrievalTrace` fields requested by S3:

- `queryIntent`
- `corpusPartitionsSearched[]`
- `candidateSetSize`
- `returnedCount`
- `methodsUsed[]`
- `methodsAttempted[]`
- `methodsSucceeded[]`
- `filtersApplied[]`
- `rerankersApplied[]`
- `embeddingUsed`
- `embeddingScope: global|constrained|none`
- `keywordUsed`
- `matchedTerms[]`
- `relationMethods[]`
- `profileBoostsApplied[]`
- `projectionState`
- `providerState`
- `fallbackTrace[]`
- truncation/topK/minScore/threshold information where relevant

Critical relation/retrieval methods to distinguish:

- `exact_id_match`
- `curated_mapping`
- `direct_source_relation`
- `provider_range_eval`
- `graph_expansion`
- `keyword_match`
- `embedding_similarity`
- `constrained_embedding_rerank`
- `global_embedding_search`

Acceptance criteria:

- Improvements are measured against Golden Set v1.
- Retrieval quality metrics are separate from system stability.
- Results include enough provenance for S3 to classify evidence correctly.
- GraphRAG does not hide missing projection/provider/source state.
- `global_embedding_search` is visible and treated as low-trust/non-truth path.

---

### Phase 9 — S3/S4 end-to-end consumption validation

Goal: prove S5 modernization improves downstream reasoning without unsafe evidence. G010 implements this as an S5-owned offline consumption-validation fixture/report plus S3 WR handoff; it does not edit S3/S4 runtime code directly.

End-to-end cases:

- S4 says external vulnerability knowledge not provided -> S3 plans S5 cveDiscovery.
- S4 provides version known -> S5 CVE discovery succeeds.
- S4 provides version unknown -> S5 returns input-insufficient diagnostic.
- Candidate CVE range-out -> S3 rejects candidate only.
- Other CVE hit discovered -> S3 keeps contextual public vulnerability evidence.
- Code graph projection debt -> S3 does not treat empty caller result as no caller.
- Keyword-only fallback -> S3 does not accept no-hit.
- S5 completed_hit knowledge context does not become S3 TP or direct claim support.



Current G010 artifact paths:

- `services/knowledge-base/fixtures/consumption-validation-v1/manifest.json`
- `services/knowledge-base/app/evaluation/consumption_validation.py`
- `services/knowledge-base/tests/test_consumption_validation_v1.py`
- S3 review WR: `wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-g010-consumption-validation-report-and-final-modernizatio.md`

G010 completion evidence: focused G010/S5 contract suite `53 passed`; full S5 compile + tests `371 passed`; Critic final PASS `019e16a3-ff1c-7f70-ab68-2796648d647b`.

Acceptance criteria:

- EvidenceCatalog mapping matches S3 rules.
- No knowledge/operational/negative-only record becomes claim support unless valid derived-from-local path exists.
- S5 does not force S3 orchestration decisions but provides enough readiness/follow-up semantics.
- S3 final claim quality remains outside S5 authority.

---

## 6. Ultragoal-ready objective sequence

These are candidate durable goals for later `$ultragoal` creation.

1. **Freeze runtime/offline vocabulary, coverage/readiness contracts, and CVE split fixtures** — G001 complete
   - Docs, schemas/oracles, tests.
   - Incorporate S3 conditional-pass requirements.

2. **Create Golden Set v1 and gate harness skeleton** — G002 complete
   - System Stability / Evidence Readiness / Quality Gate separation.
   - CVE/package, ETL transform, GraphRAG retrieval, code graph, S3-slot fixtures.
   - Include S3-required metrics and breakdowns.

3. **Freeze Knowledge Corpus v1 taxonomy/profile assets** — G003 complete
   - Native/system core taxonomy.
   - Automotive-first default profile plus embedded-system and ICS/OT profiles.
   - Relation method/provenance enums and consumerPolicy mapping.

4. **Introduce SQLite LedgerRepository foundation** — G004 complete
   - Config, schema, migrations/init, repository tests.
   - Move/wrap target-context JSON store behind repository seam.

5. **Implement corpus source manifests and first weakness/tool-rule/package identity ingestion** — G005 complete
   - CWE/CAPEC/ATT&CK/tool-rule core, package identity, then vulnerability intelligence.

6. **Implement transform-decision and taxonomy signal model** — G006 complete
   - Profile-aware taxonomy assets, keyword/semantic/graph signal provenance, confidence, consumer policy.
   - Keyword/embedding misses cannot become no-hit; graph-derived relations are distinguishable from direct/curated/provider relations.

7. **Rebuild Neo4j/Qdrant projections from ledger** — G007 complete
   - Projection state/debt rows; no Qdrant-to-Neo4j truth path.
   - Projection debt/failure prevents projection-dependent no-hit consumption as negative evidence.

8. **Implement CVE candidate evaluation and discovery split** — G008 complete
   - Readiness envelopes, provider observations, method completeness, candidate range-out safety, discovery coexistence, and tests.

9. **Modernize typed GraphRAG retrieval planner/reranker under golden metrics** — G009 complete
   - Query intent schema, corpus partitioning, relation-confidence expansion, reranking, embedding/top-k evaluation.

10. **Run S3/S4 end-to-end consumption validation** — G010 complete
   - EvidenceCatalog mapping, no unsafe negative evidence, fixture-driven final validation.

---

## 7. Pending decisions

1. Exact public API shape for typed query/acquisition inputs.
2. Exact public API shape for runtime `retrievalTrace`.
3. Which GHSA/source API path is acceptable for local/offline testing.
4. Whether package identity uses purl-compatible strings as canonical IDs or secondary aliases.
5. Whether S5 exposes readiness as a standalone endpoint, embedded in target-context ingest, or both.
6. Exact public API shape for candidate CVE evaluation vs discovery.
7. How far static-analysis tool/rule knowledge should go in the first implementation slice.
8. Whether S3 will add role-aware public contextual evidence fields or keep contextual evidence internal/audit-only.

---

## 8. Stop conditions for the modernization program

A phase is not complete unless:

- wiki/API/spec updates exist first;
- executable fixtures/tests prove the semantic claim;
- S3/S4-facing semantics preserve non-negative-evidence rules;
- runtime acquisition, offline quality evaluation, and S3 final claim quality are kept separate;
- system stability, readiness, and quality claims are reported separately;
- durable ledger/projection state is auditable where implementation exists;
- no new GraphRAG quality claim is made without Golden Set evidence.
