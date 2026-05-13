---
title: "S5 GraphRAG and Source Code Graph Boundary"
page_type: "spec"
canonical: true
source_refs:
  - "user discussion 2026-05-12 S5 GraphRAG/source-code boundary"
last_verified: "2026-05-12"
service_tags: ["S5", "knowledge-base", "graphrag", "source-code-graph", "threat-kb"]
decision_tags: ["architecture-boundary", "discussion-context", "answerability", "source-kg-ownership", "rich-analysis-ir", "repository-snapshot-versioning", "source-artifact-retention", "s5-api-authority", "judge-taxonomy", "grounded-unknown", "source-code-kg-ledger-v1", "judge-answer-contract-v1"]
related_pages: ["wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md", "wiki/canon/specs/s5-evidence-grounded-threat-knowledge-db.md"]
---

# S5 GraphRAG and Source Code Graph Boundary

Last updated: 2026-05-12

## Decision candidate

The emerging architecture is:

1. **Threat KB GraphRAG**
   - Applies to threat/vulnerability knowledge: CVE, advisory, CWE, CAPEC, ATT&CK, affected ranges, product/package/source-component identities, risk signals, mitigation text, and other textual evidence.
   - Uses graph traversal plus retrieval/reranking to find evidence paths and explanatory context.

2. **S5-owned Source Code Knowledge Graph / Code Graph Context with rich analysis IR**
   - Applies to source/build facts produced by S3/S4: function, file, call graph, dataflow, component, build target, dependency, linked library, reachability, finding location, compile/build metadata.
   - This layer is not first-class GraphRAG. It is an authoritative structured graph owned, versioned, indexed, enriched, and served by S5.
   - S3/S4 are producers of analysis facts; S5 is the durable owner of the Source Code KG used for cross-run retrieval, Threat KB joining, serving ledger replay, and golden-set validation.
   - Storage should include rich analysis artifacts from the start where available, not only minimal graph facts: AST fragments, CFG, PDG, taint traces, symbol tables, macro expansion information, compile commands, and evidence snippets.
   - Full source/repository snapshot artifacts are allowed by default in the current project context because no sensitive-code input is expected; they support replay, dataset construction, and later re-analysis.

3. **Evidence-Grounded Answering / Judge Layer**
   - Newly named layer that combines Threat KB GraphRAG evidence with S5-owned Source Code KG facts and applies identity resolution, affectedness logic, quality gates, score vectors, runtime policy, re-query controls, and serving ledger recording.
   - It produces the final A/B/C answers: affectedness, weakness/attack semantics, and triage/prioritization.
   - Its output taxonomy should separate `verdict` from `status`: verdict says what S5 judges; status says how usable/complete that answer is.

## Boundary clarification

This is not a three-layer GraphRAG design. GraphRAG remains on the Threat KB side. Source code is represented as an S5-owned knowledge graph / code graph context with rich analysis IR. The answering layer is a judge/composition layer, not a separate GraphRAG.

A compact formula:

```text
Threat KB GraphRAG
+ S5-owned Source Code Knowledge Graph with rich analysis IR
+ Evidence-Grounded Judge
= S5 answer packet
```

## Ownership decision

S5 should ingest and persist the full Source Code KG needed for durable analysis, rather than only receiving transient compact projections or references to S3/S4-owned snapshots.

Rationale:

- S5 is the knowledge service; if source graph facts remain siloed in S3/S4, S5 cannot fully own answerability, replay, caching, or benchmark evaluation.
- Durable Source Code KG snapshots let the Judge reproduce prior answers using the same code/build graph, Threat KB snapshot, policy, and controls.
- Golden/negative set validation needs stable source graph fixtures and graph hashes that can be replayed without depending on live S3/S4 state.
- S5 can enrich source graph nodes with component identity, CPE/PURL/source-component mappings, affectedness links, risk annotations, and evidence paths.
- Accumulated source evidence and answer traces can become reusable datasets and golden-set material, creating a research/evaluation feedback loop.

Guardrail:

- S5 owns the Source Code KG as a durable knowledge layer, but S3/S4 remain the primary producers of high-fidelity analysis facts such as AST/CFG/PDG, call/dataflow/reachability/finding evidence, symbol information, macro expansion data, and compile/build metadata.
- S5 should not silently invent source-analysis facts from fuzzy retrieval. Optional code retrieval may assist explanation or incomplete-context exploration, but it must not replace source graph facts or become affectedness proof by itself.

## Source Code KG storage scope

The initial scope should be the rich option, not a minimal graph-only option. The volume is acceptable because these artifacts are useful for durable replay, evidence grounding, dataset construction, and later Judge improvements.

S5 should store/version, where available:

- graph facts: function, file, component, build target, dependency, call edge, dataflow edge, finding location, reachability, line spans, hashes, metadata
- evidence snippets: source/sink context, finding snippets, relevant line ranges, evidence IDs
- rich IR artifacts: AST fragments, CFG, PDG, taint traces, symbol tables, macro expansion information, compile commands, include paths, build flags
- source artifacts: full repository/source snapshot archives or content-addressed references

The implementation may stage heavy artifacts behind typed artifact records, compressed archives, content-addressed blob references, or tiered retention, but the architecture should treat them as first-class S5-owned knowledge, not optional afterthoughts.

## Source artifact retention and serving exposure

S5 may retain or reference full source/repository snapshot artifacts by default in the current project context. There is no expected sensitive-code input, so a restrictive private-code retention policy is not required for the initial design.

Normal answer packets should still expose only the necessary evidence snippets, line ranges, hashes, and artifact IDs by default. Full source artifacts exist for replay, validation, later graph/IR regeneration, dataset construction, and audit workflows, not for dumping entire repositories into routine answers.

This creates a positive feedback loop:

```text
S3/S4 analysis facts + source artifacts
  -> S5 Source Code KG / rich IR / evidence ledger
  -> Judge answers and serving traces
  -> curated golden/negative datasets
  -> better S5 validation and future analysis quality
```

## S5 API authority for Source Code KG inputs

S5 owns the API contract for the Source Code KG ingestion surface. Instead of minimizing around existing S3/S4 contracts, S5 should define the source/build graph, rich IR, repository snapshot metadata, and source artifact fields it requires. S3/S4 then adapt as producers of those facts.

This is preferable to under-specifying the contract and later discovering that the Judge lacks required source/build context for affectedness, semantics, or triage.

## Judge output taxonomy

The Judge should separate `verdict` and `status`.

`verdict` answers what S5 believes about the target question:

- `affected`
- `not_affected`
- `unknown`
- `conflicting`

`status` describes how usable, complete, or operationally constrained the answer is:

- `complete`
- `requires_requery`
- `insufficient_input`
- `degraded_quality`
- `stale_cache`
- `policy_blocked`

Examples:

```text
verdict: unknown
status: requires_requery
reason: exact component version is missing
```

```text
verdict: affected
status: degraded_quality
reason: version range matches, but evidence freshness is below strict-policy threshold
```

This prevents mixing the judgment itself with the operational quality state. In short: verdict is what S5 thinks; status is how safely S3/S4 should consume it.

### Grounded unknown

`unknown` can be a successful answer when it is evidence-grounded and actionable. A grounded unknown includes explicit reasons, evidence gaps, required inputs, and re-query or handoff affordances. A lazy unknown without reasons or next actions is a failure.

Examples where `unknown` is correct:

- component version is missing
- component identity is ambiguous across CPE/PURL/source-component candidates
- upstream version appears vulnerable but distro/backport status is unknown
- vendored source may have cherry-picked patches but source diff/hash evidence is missing
- build flags or preprocessor configuration determine whether vulnerable code is compiled in
- evidence sources conflict and S5 lacks enough information to resolve the conflict

If the unknown reason is library version, source diff, or vendored patch uncertainty, S5 should make that explicit so S3 can route a follow-up request to S4. S4 currently owns capabilities such as open-source library version finding and diff finding, so this should become a first-class follow-up path in the answer packet.

Golden/negative set implication:

- grounded `unknown` with clear reason/evidence/required input can pass
- unsupported or vague `unknown` fails
- `unknown` on a clearly affected/not-affected gold case fails unless the expected answer itself is unknown

## Source Code KG versioning and provenance

Primary source identity should be a **repository snapshot**, not a build-target or analyzer-run identity.

Recommended root identity fields:

- repository URL or repository identifier
- commit hash
- source tree hash when available
- submodule hashes when applicable

This repository snapshot identity should be attached to analysis metadata/provenance so the evidence cannot be lost. Build target, toolchain, analyzer version, analysis config, and rich IR artifact hashes are important derivation metadata, but they should not replace the repository snapshot as the primary version root.

Layering:

```text
Repository Snapshot  # primary source version
  -> Build Target Context(s)  # target/toolchain/flags/dependencies
      -> Analysis Artifact Set(s)  # S3/S4 analyzer version/config and graph/IR hashes
          -> Source Code KG records / rich IR artifacts
```

Reason: S5 may not regenerate Source Code KG frequently, but source versions must not be mixed. If commit A contains a reachable vulnerable function and commit B deletes it, the Judge must know which repository snapshot a Source Code KG belongs to. If the same commit is built with different flags, that belongs in the build context derivation layer.

## Why source code should not be first-class GraphRAG by default

For C/C++ static analysis, the most trusted source-side facts are structural and build-derived: call edges, dataflow edges, reachability, component boundaries, linked dependencies, build target facts, and exact finding locations. These should not be replaced by embedding similarity or fuzzy retrieval.

Optional code retrieval can remain a secondary helper for explanation, snippet lookup, or incomplete-context exploration, but it must not be promoted to affectedness proof without graph/evidence grounding.

## Consequences for future planning

- The current megagoal epic formerly phrased as `GraphRAG / Threat KB + Source Code Graph Serving Architecture` should be clarified as `Threat KB GraphRAG + S5-owned Source Code KG with rich analysis IR + Evidence-Grounded Answering Layer`.
- S5 needs a Source Code KG ingestion, storage, repository-snapshot versioning, build-context derivation, rich-IR retention, source-artifact retention, and heavy-artifact strategy.
- S5 should define the producer API contract and require S3/S4 to emit the source/build graph facts, rich analysis IR, source artifacts, and repository snapshot metadata the Judge needs.
- The Judge answer contract should distinguish verdict from status and treat grounded unknown as a potentially successful answer.
- S5 answer packets should include follow-up affordances for S3 to request S4 library-version/diff/vendored-patch clarification when unknown is caused by those evidence gaps.
- GraphRAG metrics should focus on Threat KB evidence retrieval and no unsafe promotion.
- Source Code KG metrics should focus on graph completeness, stable IDs, source/build fact correctness, rich-IR availability, source-artifact traceability, ingest reproducibility, and compatibility with S3/S4-produced facts.
- The Judge metrics should focus on answerability, quality gate behavior, score-vector calibration, re-query control compliance, and golden/negative set results.


## 2026-05-12 implementation slice — Source Code KG ledger v1 + Judge v1

Loop 1 implementation turns the boundary decision into an S5-owned vertical slice.

### Durable Source Code KG ledger tables

Schema v3 adds the following ledger-owned tables:

- `source_repository_snapshot`: repository URL/id, commit hash, tree hash, submodule hashes, metadata, provenance. This is the primary source version root.
- `source_repository_artifact`: full/source archive or content-addressed artifact reference tied to the repository snapshot.
- `source_build_context`: build target, project/target ID, toolchain, compile commands reference, dependency graph, build metadata. This is a derivation under the repository snapshot.
- `source_analysis_artifact_set`: analyzer name/version/config, artifact hashes, produced timestamp, provenance. This is a derivation under a build context.
- `source_evidence_snippet`: file path, line range, language, snippet text, checksum, provenance.
- `source_graph_node`: typed source graph node with stable ID, file span, symbol metadata, evidence snippet reference.
- `source_graph_edge`: typed source graph edge with source/target node IDs and evidence/metadata.
- `source_rich_ir_artifact`: AST/CFG/PDG/taint/symbol/macro/build artifacts as typed rich IR references or payloads.

The ingest path is idempotent and generates deterministic stable IDs when producers omit IDs.

### Machine-readable producer contract

2026-05-13 follow-up: S5 now exposes the Source Code KG producer contract at:

```http
GET /v1/contracts/source-code-kg
```

The response is generated from `app.contracts.source_kg.source_code_kg_contract_snapshot()` and includes:

- endpoint identity for `POST /v1/source-code-kg/ingest`;
- producer requirements for repository snapshots, build contexts, analysis artifact sets, graph nodes/edges, evidence snippets, rich IR artifacts, and source artifacts;
- request/result JSON Schema derived from the Pydantic Source KG models;
- guardrails that S5 owns durable storage, S3/S4 are producers, projection is not source-of-truth, and routine answers expose snippets/hashes rather than whole repositories.

This closes the interview decision that S5 should define what S3/S4 must emit instead of under-specifying the source/build graph contract.


### API surface

`POST /v1/source-code-kg/ingest` accepts `s5-source-code-kg-ingest-request-v1` and returns `s5-source-code-kg-ingest-result-v1`.

The response must declare:

```json
{"ledgerOnly": true, "productionWrites": {"neo4j": false, "qdrant": false}}
```

This makes the boundary explicit: ledger ingest is durable evidence acquisition, not production GraphRAG projection.

### Judge vertical coupling

The Judge v1 internal service must resolve Source KG facts by stable IDs before answering. Its answer packet echoes:

- `queryContext.sourceContext.repositorySnapshotId`
- `queryContext.sourceContext.buildContextId`
- `queryContext.sourceContext.analysisArtifactSetId`
- requested graph node, evidence snippet, and rich IR artifact IDs

and returns resolved facts under `evidence.sourceCodeKg`.

The Judge validator treats a requested Source KG context with no resolved Source KG evidence as `SOURCE_KG_CONTEXT_IGNORED`. This prevents an affectedness-only answer from masquerading as a Source-KG-grounded answer.

### Authority boundary

`verdict` remains an S5 evidence-grounded knowledge verdict over the concrete query and target context. It is not S3's final security verdict. Every answer must keep forbidden inferences visible: final security verdict, clean pass, S5 accepted claim, exploitability judgment, and complete project safety.
