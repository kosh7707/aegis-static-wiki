---
title: "S5 Threat KB Megagoal Discussion Context"
page_type: "spec"
canonical: true
source_refs:
  - "user discussion 2026-05-12 S5 Threat KB megagoal"
last_verified: "2026-05-20"
service_tags: ["S5", "knowledge-base", "threat-kb", "graphrag", "golden-set"]
decision_tags: ["discussion-context", "megagoal", "answerability", "quality-gate", "answerability-native-golden-set-v1", "scoring-policy-v1", "serving-requery-contract-v1", "source-coverage-matrix-v1", "typed-conflict-model-v1"]
related_pages:
  - "wiki/canon/specs/s5-evidence-grounded-threat-knowledge-db.md"
  - "wiki/canon/handoff/s5/session-2026-05-12-s5-evidence-grounded-threat-kb-foundation.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
---


# S5 Threat KB Megagoal Discussion Context


## Current-state note — 2026-05-20

This megagoal discussion remains useful for direction, but it is no longer the active operational entry point. Use [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]] for current implementation state and [[wiki/canon/api/s5-paper-context-api]] for S3-consumable paper API details.

The current S5 role is narrower and safer than a final judge: S5 supplies contextual Threat KB / Source Code KG rows, diagnostics, provenance IDs, and traceability. S3 remains responsible for final packet construction and triage semantics.

Last updated: 2026-05-12
Lane: S5 / `services/knowledge-base/**`
Purpose: preserve the long-form design discussion before a future `$ralplan` or `/goal` execution pass.

## 1. Current framing

S5 is no longer scoped as a small ETL improvement or a narrow GraphRAG patch. The working target is:

> Evidence-Grounded Threat / Vulnerability Intelligence Knowledge DB for C/C++ native-code static analysis.

The project should be treated as a large, unified goal rather than many disconnected mini-goals. Internal milestones may exist, but the semantic objective is one system: S5 must ingest, ground, score, serve, and validate threat knowledge in a way that S3/S4 analysis agents can use and re-query.

## 2. Non-negotiable scope decisions

### 2.1 C/C++ native-only first target

The primary target is C/C++ native/system/embedded code. Golden sets and first-class source coverage should stay within this domain.

Explicitly out of scope for the first S5 golden set:

- Java / Maven-centric vulnerability cases
- JavaScript / Node / npm cases
- Python / PyPI cases
- Ruby, Go module, and web-framework-first ecosystems

Reason: once non-native ecosystems enter the benchmark, package identity, affectedness, and language/runtime assumptions expand without bound and dilute the S3/S4 paper axis.

### 2.2 A/B/C answer axes are all required

S5 must support three answer axes:

1. **A — Affectedness**: whether the current build target/component/version/config is actually affected.
2. **B — Weakness & attack semantics**: CWE/CAPEC/ATT&CK meaning, weakness explanation, attack path, mitigation semantics.
3. **C — Triage / prioritization**: which candidates should be looked at first.

If forced to order dependencies, the order is A -> B -> C. This is not an importance ranking; all three are required. A weak affectedness layer makes B explanatory but target-weak, and makes C a ranking game rather than a grounded triage system.

## 3. Serving and re-query contract decisions

S5 is an internal evidence service, not a terse public API. Verbose responses, echo-back, and duplicated context are acceptable and desirable because they improve debugging, auditability, golden set validation, and S3/S4 re-query behavior.

### 3.1 Answer packet shape

S5 answers should include at minimum:

- query context
- applied controls
- verdict / answer
- evidence packet
- identity and affectedness reasoning path
- uncertainty / conflict / staleness
- quality gate status
- score vector
- re-query handles

### 3.2 Control model

S3/S4 should be able to re-query using at least:

- `exclude`
  - CVE/advisory
  - evidence source
  - identity mapping
  - affected range claim
  - risk signal
- `prefer`
  - source priority
  - identity priority
  - affectedness source priority
  - risk-signal priority
- `force_context`
  - exact package/version
  - distro/backport status
  - vendored source marker/hash
  - target architecture
  - linked/static/dynamic usage
  - build-observed component scope
- `answer_mode`
  - `affectedness_only`
  - `weakness_explanation_only`
  - `triage_only`
  - `full`

S5 must echo requested, accepted, rejected, ignored controls and control effects. Silent fallback is forbidden.

### 3.3 Who decides exclusions?

S5 provides default evidence-grounded judgments. However, S3/S4 may determine that a result is irrelevant in the current build target context and can ask S5 to exclude it. Example: S3 determines a CVE is already patched for the actual target library version and requests a re-query excluding that CVE.

S5 must then recalculate and show that the exclusion was applied.

## 4. Ledger and cache decisions

### 4.1 Three ledger families

S5 likely needs three durable ledger families:

1. **Acquisition ledger**
   - what external source data entered, how it was normalized, transform decisions, unresolved references, conflicts.
2. **Projection ledger**
   - which knowledge snapshot became a Neo4j/Qdrant/serving bundle, including manifest, checksums, QA report, and production write gating.
3. **Serving ledger**
   - what S3/S4 asked, which controls were applied, which snapshot/policy was used, what answer and evidence were returned.

The serving ledger is especially important because it can later feed golden set promotion, regression tests, query debugging, and paper evaluation traces.

### 4.2 Query cache direction

Raw free-form query-to-answer blob caching is expected to have poor hit rate because S3/S4 queries vary by target context, controls, answer mode, and build state.

The correct cache target is reusable decision fragments:

- evidence cache
- identity resolution cache
- affectedness decision cache
- semantic expansion cache
- risk signal cache
- answer assembly cache as an optional session-local optimization

### 4.3 Canonical query planner

Before effective caching, S5 needs a canonical query planner that normalizes S3/S4 input into:

- `QueryIntent`
- `TargetContext`
- `ControlSet`
- `AnswerMode`
- `EvidenceScope`

This canonical form becomes the basis for cache keys, serving ledger records, and golden set cases.

## 5. Quality Gate and scoring decisions

### 5.1 Embedding/GraphRAG is not a Quality Gate substitute

Embedding, vector search, graph traversal, and reranking can improve candidate discovery, semantic expansion, explanation, and evidence navigation. They cannot replace evidence-grounded affectedness scoring.

The core distinction:

- retrieval/reranking score: how relevant a candidate appears
- evidence/answerability score: whether S5 should trust the answer
- operational priority score: what S3/S4 should inspect first

### 5.2 Always expose score vector

S5 should always expose detailed scores in responses and serving ledger entries.

Candidate score dimensions:

- `retrieval_relevance`
- `identity_confidence`
- `affectedness_confidence`
- `version_range_confidence`
- `evidence_strength`
- `source_reliability`
- `freshness`
- `coverage_score`
- `conflict_penalty`
- `control_compliance`
- `overall_answerability`

### 5.3 Dual-phase scoring

Scoring is split across two phases because neither phase covers the other.

ETL/projection-time knowledge quality scores:

- source reliability
- freshness
- coverage score
- relation completeness
- artifact integrity
- schema validity
- conflict density
- unresolved reference density

Serving-time answerability scores:

- retrieval relevance
- identity confidence
- affectedness confidence
- version range confidence
- evidence strength
- conflict penalty
- control compliance
- overall answerability

### 5.4 Runtime policy config

Thresholds and verdict gates must not be hardcoded. They should be runtime-configurable policy files with schema validation, `policy_id`, version, hash, and audit trail.

Suggested profiles:

- `strict`: evaluation/golden set; fewer false positives, more unknowns.
- `balanced`: default analysis profile.
- `exploratory`: broad candidate discovery / research.

Default profile comes from S5 config. S3/S4 may explicitly request a profile. S5 must echo requested/applied/rejected profiles and must not silently switch policies.

## 6. Golden set decisions

### 6.1 Golden set is answerability-first

The golden set is not a record-count benchmark. It is not primarily “how many CWE/CVE records parsed.” The main unit is:

> canonical query + expected answer packet.

The golden set verifies whether S5 answers S3/S4-style queries correctly with evidence, controls, scores, quality gate, and re-query affordances.

### 6.2 Minimum size and importance

The core golden set must contain **at least 10 carefully selected C/C++ native answerability cases**. More is better. This is the most important long-term milestone and should be reusable across future S5 changes.

### 6.3 Golden set case axes

Cases should cover at least:

1. actually affected cases
2. ambiguous / insufficient / conflicting cases
3. re-query-required cases

Representative answerability types:

- affected-clear
- patched-not-affected
- ambiguous identity
- CPE false positive
- PURL/package match
- distro/backport
- vendored source
- kernel/config-dependent
- re-query exclude
- prefer-source-policy
- force-context
- risk prioritization
- weakness/attack semantics explanation
- conflicting/stale evidence

### 6.4 Tiering

Proposed golden set tiers:

- **Gold/Core**: manually curated, expected answer packet fully specified, required completion gate.
- **Silver/Expanded**: official-source-derived expanded cases for broader coverage/regression.
- **Negative/Adversarial**: traps where S5 must not overclaim.

Negative set examples:

- CPE false positive
- patched version false positive
- excluded CVE resurrection after re-query
- identity ambiguity overclaim
- distro/backport overclaim
- vendored source overclaim
- stale evidence overclaim
- treating KEV/EPSS/CVSS as affectedness proof

Principle: `unknown` can be a correct answer; a confident but ungrounded `affected` is a serious failure.

## 7. Current large goal candidate list

The unified goal currently contains roughly these epics. They should be treated as one integrated S5 megagoal, not independent deliverables:

1. S5 Research Charter / Coverage Matrix v1
2. ETL Source Coverage Expansion
3. Cached Snapshot / Acquisition Adapter Framework
4. Evidence / Acquisition Ledger
5. Canonical Identity Model
6. Identity Resolution Engine
7. Affectedness Engine
8. Weakness & Attack Semantics Graph
9. Risk Signal Modeling
10. Typed Relation Graph / Conflict Model
11. Projection Bundle
12. Threat KB GraphRAG + S5-owned Source Code KG with Rich Analysis IR + Evidence-Grounded Judge
13. Serving Answer Contract
14. Re-query Controls
15. Control Echo-back / Control Effects
16. Canonical Query Planner & Decision Cache
17. Quality Gate / Score Vector / Runtime Policy
18. Golden Set / Validation / Negative Set

## 8. Points that still need discussion

### 8.1 GraphRAG / Source Code KG / Judge placement — resolved as decision candidate

This issue was clarified after further discussion. The current decision candidate is:

```text
Threat KB GraphRAG
+ S5-owned Source Code Knowledge Graph / Code Graph Context with rich analysis IR
+ Evidence-Grounded Answering/Judge Layer
= S5 answer packet
```

Important boundary:

- GraphRAG remains on the **Threat KB** side.
- Source code is modeled as an **S5-owned Knowledge Graph / Code Graph Context with rich analysis IR**, not as first-class Source Code GraphRAG.
- The new **Evidence-Grounded Judge** is a composition and verdict layer, not another GraphRAG layer.

Threat KB GraphRAG covers CVE, advisory, CWE, CAPEC, ATT&CK, affected range, identity relations, risk signals, mitigation text, vendor notes, and other textual/evidence relations. This side needs graph traversal, retrieval, reranking, and evidence navigation.

S5-owned Source Code KG stores structural and build facts produced by S3/S4: function, file, call edge, dataflow edge, component, build target, dependency, linked library, reachability, finding location, compile flag, and related source/build metadata. These facts should be treated as authoritative graph context, persisted/versioned by S5, and traversed deterministically by default. The initial storage scope should include graph facts, evidence snippets, and rich IR artifacts where available: AST fragments, CFG, PDG, taint traces, symbol tables, macro expansion information, compile commands, include paths, and build flags. Optional code retrieval may assist explanation or incomplete-context exploration, but must not replace source graph facts or become affectedness proof by itself.

The Evidence-Grounded Judge combines Threat KB GraphRAG evidence with S5-owned Source Code KG facts, then applies identity resolution, affectedness logic, Quality Gate, score vector, runtime policy, re-query controls, and serving ledger recording to produce A/B/C answers.

Related canonical detail page:

- `wiki/canon/specs/s5-graphrag-source-code-boundary.md`

### 8.2 Source code graph contract from S3/S4

Versioning decision candidate: the primary Source Code KG identity should be a repository snapshot, with commit hash/tree hash/submodule hashes attached to analysis metadata/provenance. Build target, toolchain, analyzer version, analysis config, and rich IR hashes are derivation metadata, not the primary version root.

Source artifact retention decision candidate: S5 may retain or reference full repository/source snapshot artifacts by default. In this project context, sensitive-code input is not expected, so initial design does not need a restrictive private-code retention profile. Routine answer packets should expose only needed snippets, hashes, line ranges, and artifact IDs, but full source artifacts are useful for replay, validation, later graph/IR regeneration, dataset construction, and audit workflows. Accumulated source evidence and serving traces should feed golden/negative datasets over time.

Recommended layering:

```text
Repository Snapshot  # repo URL/id + commit/tree/submodule hashes
  -> Build Target Context(s)
      -> Analysis Artifact Set(s)
          -> Source Code KG records / rich IR artifacts
```

Ownership decision candidate: S5 should ingest and persist the full Source Code KG with rich analysis IR needed for durable analysis. S3/S4 should not be the durable owners of source graph knowledge; they should produce source/build analysis facts and hand them to S5. S5 then owns storage, versioning, enrichment, joining with Threat KB, replay, serving ledger references, and golden-set fixtures. S5 also owns the producer API contract: it should specify the source/build graph, rich IR, repository snapshot metadata, and source artifact fields it needs, then require S3/S4 to provide them.

Judge output taxonomy decision candidate: separate `verdict` from `status`. `verdict` answers what S5 judges (`affected`, `not_affected`, `unknown`, `conflicting`). `status` describes how usable or operationally constrained the answer is (`complete`, `requires_requery`, `insufficient_input`, `degraded_quality`, `stale_cache`, `policy_blocked`). This prevents mixing what S5 believes with how safely S3/S4 should consume the answer.

Grounded unknown decision candidate: `unknown` can be a successful answer when S5 provides explicit evidence gaps, reasons, required inputs, and re-query/follow-up affordances. If the unknown reason is library version, source diff, or vendored patch uncertainty, S5 should expose that so S3 can route a follow-up request to S4, which owns open-source library version finding and diff finding capabilities. Lazy unknown without concrete reason/next action is a failure.

Guardrail: this does not mean S5 becomes the static analyzer for all facts. S3/S4 remain producers of high-fidelity call/dataflow/reachability/finding evidence. S5 owns the knowledge layer derived from those facts.

Remaining questions:

- What source graph, rich IR, and source artifact schema must S3/S4 emit or register into S5?
- What is the minimal full-code-graph plus rich-IR unit: repository, build target, component, compile unit, or analysis snapshot?
- How are build target, component, function, call path, dataflow, dependency, and linked-library facts represented with stable IDs?
- How should heavy artifacts and source snapshots be stored: inline normalized records, external blob references, compressed archives, content-addressed storage, or tiered retention?
- How should S5 version, garbage-collect, and replay Source Code KG snapshots?

### 8.3 Golden set exact cases

The minimum is >=10 C/C++ native cases, but exact cases remain to be curated. Candidate families include:

- OpenSSL / Heartbleed
- OpenSSL other high-profile CVEs
- glibc / GHOST
- Linux kernel / Dirty COW
- sudo / Baron Samedit
- curl/libcurl
- OpenSSH
- zlib
- libpng
- libxml2
- libexpat
- SQLite
- BusyBox
- libtiff
- FFmpeg
- wolfSSL / mbedTLS

Need final selection based on answerability type coverage, evidence availability, and native/static-analysis relevance.

### 8.4 Initial scoring formulas and policy profiles

Score dimensions and runtime policy config are agreed, but formulas/default thresholds are unresolved.

Questions:

- What is the first `strict`, `balanced`, and `exploratory` threshold set?
- Which scores are deterministic vs learned/reranked?
- How should conflict penalties and freshness decay combine?
- What score is allowed to lower verdict from `affected` to `unknown`?

### 8.5 Storage strategy

SQLite staging is acceptable for now. Production overwrite into Neo4j/Qdrant is currently excluded while the design is still changing. Need later decision on:

- durable acquisition/serving ledgers in SQLite vs separate DB
- projection bundle handoff to Neo4j/Qdrant
- whether S5 owns an independent DB separate from S2
- snapshot retention and reproducibility

### 8.6 End-to-end completion gate

Feature presence is not completion. Completion should mean end-to-end answerability benchmark passes:

cached snapshots -> acquisition ledger -> identity/affectedness/semantics/risk graph -> quality scores -> projection bundle -> canonical query planner -> answer packet -> re-query controls -> serving ledger -> golden/negative set verification.

The exact pass/fail thresholds for Gold/Silver/Negative tiers remain to be decided.

## 9. Guidance for future ralplan

Future `$ralplan` should not start by implementing “full CWE ingest” as if that completes S5. Full CWE coverage is one necessary input only.

The plan must preserve these constraints:

- one unified S5 megagoal
- C/C++ native scope
- answerability-first validation
- golden set >=10 and carefully curated
- negative/adversarial tests as first-class gate
- Quality Gate and score vector before trusting golden set results
- runtime-configurable policy thresholds
- verbose serving packets with controls and scores always exposed
- GraphRAG treated as Threat KB GraphRAG only; Source Code is S5-owned Source Code KG/Code Graph Context with rich analysis IR; Evidence-Grounded Judge composes both, not as a third GraphRAG


## 2026-05-12 Loop 2 — C/C++ native answerability golden/negative suite

Loop 2 turns the user discussion about durable golden sets into a reusable S5 fixture contract. The golden set now includes an `answerability-native` family with at least ten C/C++ native/system/embedded cases.

Required category coverage:

1. Heartbleed/OpenSSL affected-clear
2. Heartbleed/OpenSSL patched/not-affected
3. package/source identity ambiguity -> grounded unknown
4. CPE/product false positive -> no overclaim
5. distro/backport ambiguity -> grounded unknown
6. vendored source/cherry-picked patch ambiguity -> grounded unknown
7. kernel/config-dependent reachability -> grounded unknown
8. re-query `exclude` prevents excluded CVE resurrection
9. `prefer` source/local evidence policy
10. `forceContext` target/source context over global retrieval noise

Each answerability case includes an `answerabilityOracle` with C/C++ native language scope, expected Judge verdict/status, required Source Code KG context IDs, expected answer packet fields, baseline forbidden inferences, re-query controls when relevant, and negative assertions for overclaim traps.

The suite explicitly guards against:

- KEV/EPSS/CVSS risk signals being treated as affectedness proof
- keyword/vector no-hit being treated as negative vulnerability evidence
- stale evidence being treated as proof
- excluded CVEs reappearing after re-query
- CPE/product similarity being treated as package/source identity proof
- distro/backport or vendored source uncertainty being overclaimed
- lazy unknowns without reason, required inputs, and follow-up affordances

This is offline/golden-set evidence, not runtime TP/FP/FN vocabulary and not S3 final security verdict authority.


## 2026-05-12 Loop 3 — Configurable Quality Gate / Scoring Policy v1

Loop 3 implements the discussion decision that S5 needs an evidence-grounded Quality Gate and scoring layer that is separate from embeddings, GraphRAG, or reranking.

Key properties:

- scoring policy is file-backed and runtime editable via `config/scoring-policy-v1.json`
- environment overrides are available through `AEGIS_KB_SCORING_POLICY_PATH` and `AEGIS_KB_DEFAULT_SCORING_PROFILE`
- policy identity/audit metadata is exposed: `policyId`, `policyVersion`, `policyHash`, `policySource`, `policyPath`
- profiles are `strict`, `balanced`, and `exploratory`
- phases are separate: `serving` for Judge answer packets and `etl_projection` for ledger/projection quality
- score vectors are always visible in Judge answers and ledger quality reports
- `controlCompliance` and `conflictPenalty` are hard blockers; other threshold failures can produce caveats depending on profile
- existing ledger `qualityGate`/`hardFail` issue semantics remain authoritative, with score policy added as visible diagnostic/audit metadata

The standard score vector fields are:

```text
retrievalRelevance, identityConfidence, affectednessConfidence,
versionRangeConfidence, evidenceStrength, sourceReliability,
freshness, coverageScore, conflictPenalty, controlCompliance,
overallAnswerability
```

This makes S5 answerability debuggable: S3/S4 can see not only `verdict` and `status`, but also why S5 considered the answer acceptable, caveated, or rejected under the active policy profile. These scores still do not constitute S3 final security verdicts or clean-pass authority.


## 2026-05-12 Loop 4 — Serving / Re-query Contract v1

Loop 4 implements the re-query and serving debuggability shape discussed with the user.

Key properties:

- S5 builds `canonicalQuery` records so messy/verbose internal prompts can map to stable canonical query IDs and decision-fragment keys.
- `decisionFragmentKey` includes component identity, source context IDs, accepted controls, and answer mode.
- Component/source context IDs and CVE/advisory control identifiers are normalized before canonical keying so whitespace/case noise cannot break cache identity or let excluded evidence reappear.
- `cacheTrace` exposes hit/miss/store behavior; cache is decision-fragment based rather than raw prompt based.
- `appliedControls` always echoes `requested`, `accepted`, `rejected`, and `ignored` controls.
- Supported controls are `exclude`, `prefer`, `forceContext`, and `answerMode`.
- Unsupported known values, unknown control keys, and unresolved source context appear in `fallbackTrace`; silent fallback remains forbidden.
- Excluded CVEs/advisories cannot reappear through cached decision fragments because controls affect the fragment key and exclude filtering remains part of the cached fragment.

This loop is still S5 internal serving/Judge contract hardening. It does not grant S5 final S3 security verdict authority.


## 2026-05-12 Loop 5 — Durable Serving Ledger v1

Loop 5 implements the durable serving ledger promised by the three-ledger design.

Key properties:

- every internal Judge answer is recorded in SQLite table `serving_query_run`
- returned answers include `servingLedger` with `schemaVersion=s5-serving-ledger-ref-v1`, `servingRunId`, and `createdAt`
- durable rows preserve request packet, canonical query, full answer packet, component/source context, applied controls, control effects, fallback trace, cache trace, score vector, and score policy
- repeated canonical queries create distinct serving rows while sharing canonical query IDs / decision-fragment keys, preserving cache-hit transitions
- grounded unknowns and rejected controls are recorded as first-class replay/debug evidence rather than transient response details
- the serving ledger is still SQLite staging and does not imply production Neo4j/Qdrant overwrite or a public S3/S4 API promotion

This closes the immediate gap between Loop 4's ephemeral re-query packet and the megagoal requirement that serving traces feed query debugging, regression replay, golden/negative set promotion, and paper evaluation evidence.


## 2026-05-12 Loop 6 — Identity Resolution Trace v1

Loop 6 makes identity resolution explicit before affectedness.

Key properties:

- S5 now emits `s5-identity-resolution-v1` in Judge answers under `evidence.identityResolution`.
- Package/PURL identity, product/CPE identity, and source-component identity remain separate.
- Only direct package identity evidence can populate `hardAffectednessPackageIds`.
- `RELATED_PRODUCT_IDENTITY`, `RELATED_SOURCE_COMPONENT`, `AFFECTS_CPE_MATCH`, package CPE columns, risk signals, product-only rows, source-only rows, and vector/retrieval hits are not hard affectedness proof.
- CPE-only and source-component-only Judge requests are identity-bearing inputs, not missing identity; they produce grounded `unknown` with `product_only` or `source_only` diagnostics unless a hard package mapping exists.
- `canonicalQuery.normalized.component` and `decisionFragmentKey` now include `cpe`, `repoUrl`, and `sourceComponentId`, so product/source identity changes cannot share stale decision fragments.
- Serving-ledger rows preserve the identity-resolution evidence for replay, debugging, and future golden/negative-set promotion.

This loop turns the earlier PURL/CPE/source identity separation decision into executable guardrails for affectedness and Judge serving.


## 2026-05-12 Loop 7 — Threat KB Retrieval Evidence v1

Loop 7 connects Threat KB retrieval/GraphRAG-style context to Judge answers without granting retrieval affectedness authority.

Key properties:

- Judge answers now include `evidence.threatRetrieval` with advisory candidates, weakness semantics, attack semantics, risk signals, retrieval trace, and methods.
- The packet authority is always `contextual_support_not_affectedness_proof`.
- `negativeEvidenceAllowed` is always false; no-hit, keyword-only, embedding-only, or graph-neighbor-only contexts cannot prove not-affected or affected.
- Risk signals remain prioritization context only.
- CPE/product-only and source-component-only unknowns may expose contextual Threat KB evidence, but they remain grounded `unknown` unless deterministic identity/affectedness proof exists.
- Serving-ledger rows preserve the full Threat KB retrieval packet for debugging, replay, and future golden/negative-set promotion.
- This remains ledger-backed v1; it does not require live Neo4j/Qdrant production writes.

This loop strengthens the intended architecture: Threat KB uses GraphRAG/retrieval for evidence navigation, Source Code KG stays deterministic graph context, and the Judge composes both under explicit authority boundaries.

## 2026-05-12 Loop 8 — Source Coverage Matrix / Cached Artifact Adapter v1

Loop 8 turns the ETL source-expansion discussion into an executable coverage contract rather than another prose-only source list.

Key properties:

- `config/source-coverage-matrix-v1.json` declares the required S5 source roles: weakness taxonomy, attack ontology, vulnerability advisory facts, product/package/source identity, risk/exploitation signals, C/C++ analyzer rule mappings, benchmark assets, and Source Code KG.
- The matrix is explicitly C/C++ native/system/embedded/ICS scoped; non-native-only ecosystems cannot satisfy first-class S5 coverage.
- The evaluator also rejects non-native-only source-role substitution even if a matrix still declares C/C++ in `languageScope`.
- `risk_exploitation_signal` is axis C only. `CISA_KEV` and `FIRST_EPSS` are standalone sources; CVSS is NVD-derived in v1 and not a required standalone source kind.
- `source_code_kg` is represented as a non-hard-fail deferred role because runtime Source KG ingest was implemented separately in Loop 1.
- `app/ingestion/source_coverage_matrix.py` returns `s5-source-coverage-evaluation-v1` with `coverageGate.kind=source_coverage_quality_gate_not_service_health`; this is a data-quality coverage gate, not `/v1/ready`, service health, or projection freshness.
- `app/ingestion/cached_artifact_adapter.py` verifies local/manual cached artifacts and hashes without dereferencing `sourceUrl` or artifact `uri`.
- `ingest_fixture_corpus(...)` now includes `sourceCoverage` in its report while preserving existing row transforms and production projection behavior.

This loop closes the immediate gap between “we need broader ETL coverage” and “which sources/axes are actually sufficient for fixture, cached, and future production claims.” It does not implement live downloads, production Neo4j/Qdrant overwrite, or a public S3/S4 API change.

## 2026-05-12 Loop 9 — Typed Relation Graph / Conflict Model v1

Loop 9 implements megagoal epic #10 by making contradictory evidence first-class and durable.

Key properties:

- `app/relations/conflict_model.py` detects affectedness status conflicts, affectedness range conflicts, opposite relation predicate conflicts, and exact alias conflicts.
- `conflict_record` rows carry `s5-conflict-evidence-v1`, involved ledger IDs, allowed quality-gate effects, and forbidden effects (`clean_pass`, negative evidence, S3 final security verdict, service-health changes).
- Ledger quality reports now expose `conflictRecordCount`, `newlyRecordedConflictCount`, `openConflictCount`, `conflictKinds`, and score-vector `conflictPenalty`.
- Hard conflicts reject the ETL quality gate; range-only conflicts are visible caveats.
- Projection bundles include conflict nodes/text chunks only when conflicts exist and mark them `conflicting_evidence_not_negative_evidence`.
- Direct Judge conflict population is deferred. Current internal Judge answers preserve `uncertainty.conflicts` as the placeholder while Loop 9 ensures conflicts are ledger/projection quality-gated before serving promotion.
- Health/readiness semantics remain unchanged: conflicts are evidence/data-quality states, not service outages.

This loop closes the schema-only gap around `conflict_record` while preserving S5/S3 authority boundaries.
