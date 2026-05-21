---
title: "Knowledge Base API 계약서"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/api/knowledge-base-api.md"
original_path: "docs/api/knowledge-base-api.md"
last_verified: "2026-05-21"
service_tags: ["s5"]
decision_tags: ["judge-question-credential-url-redaction-v1", "judge-control-credential-url-redaction-v1", "judge-serving-ledger-source-context-request-redaction-v1", "judge-source-context-query-echo-redaction-v1", "source-kg-partial-resolution-selector-redaction-v1", "judge-source-kg-validator-diagnostic-payload-budget-v1", "judge-source-kg-validator-diagnostic-payload-redaction-v1", "judge-source-kg-nested-url-redaction-validator-v1", "health-control-v2", "timeout-policy", "ack-liveness", "long-running-ownership", "current-state-boundary", "target-context-bundle-v1", "acquisition-envelope-v1", "non-silent-fallback", "knowledge-coverage-contract-v1", "acquisition-readiness-contract-v1", "runtime-vs-offline-evaluation", "analyst-brief-v1", "source-code-kg-ingest-v1", "judge-answer-contract-v1", "judge-threat-retrieval-topk-policy-v1", "source-kg-context-resolution-v1", "source-kg-rich-ir-payload-policy-v1", "runtime-log-redaction-v1", "judge-candidate-pool-truncation-v1", "judge-control-echo-policy-v1", "source-kg-ingest-size-policy-v1", "judge-keyword-match-discovery-v1", "judge-question-term-discovery-v1", "sync-timeout-no-side-effect-v1", "source-kg-producer-identity-policy-v1", "judge-control-list-cardinality-policy-v1", "judge-missing-version-threat-context-v1", "source-kg-atomic-ingest-policy-v1", "source-kg-producer-id-uniqueness-v1", "judge-force-context-budget-policy-v1", "judge-keyword-match-fielded-policy-v1", "threat-retrieval-runtime-trace-parity-v1", "judge-topk-canonicalization-policy-v1", "source-kg-container-lineage-rebind-policy-v1", "judge-unsupported-control-echo-budget-v1", "judge-compact-revision-hash-policy-v1", "runtime-qdrant-url-log-redaction-v1", "etl-seed-url-redaction-v1", "url-query-secret-redaction-v1", "source-kg-producer-reference-id-length-policy-v1", "source-kg-generated-identity-uniqueness-v1", "source-kg-served-url-redaction-v1", "analyst-brief-selector-non-echo-v1", "analyst-brief-judge-answer-v1", "analyst-brief-contract-v1", "source-kg-checksum-integrity-v1", "ready-ledger-dependency-v1", "source-kg-line-span-validation-v1", "source-kg-repository-root-immutability-v1", "source-kg-explicit-id-content-immutability-v1", "source-kg-nested-object-budget-v1", "source-kg-serving-nested-object-redaction-v1", "judge-source-kg-nested-redaction-validator-v1", "source-kg-redacted-context-diagnostic-v1", "source-kg-projection-diagnostic-budget-v1", "source-kg-compile-commands-artifact-context-v1", "judge-source-kg-url-redaction-validator-v1", "judge-compile-commands-artifact-contract-parity-v1", "source-kg-source-artifact-resolution-accounting-v1", "judge-compile-commands-artifact-validator-v1", "judge-compile-commands-artifact-validator-tolerance-v1", "judge-source-kg-context-resolution-integrity-validator-v1", "judge-source-kg-context-resolution-shape-validator-v1", "judge-source-kg-context-resolution-issue-redaction-v1", "judge-threat-retrieval-authority-boundary-validator-v1", "judge-threat-retrieval-child-authority-validator-v1", "judge-threat-retrieval-authority-issue-metadata-redaction-v1", "judge-threat-retrieval-validator-diagnostic-redaction-v1", "judge-threat-retrieval-validator-field-path-policy-v1", "judge-threat-retrieval-validator-field-normalization-v1", "judge-threat-retrieval-validator-field-catalog-v1", "judge-threat-retrieval-validator-dynamic-field-catalog-v1", "judge-threat-retrieval-validator-issue-code-coverage-v1", "judge-threat-retrieval-validator-issue-code-ast-guard-v1", "judge-threat-retrieval-runtime-diagnostic-contract-v1", "judge-threat-retrieval-runtime-diagnostic-coverage-v1", "judge-source-kg-issue-diagnostic-catalog-v1", "source-kg-serving-diagnostic-coverage-v1", "judge-source-kg-serving-diagnostic-catalog-v1", "judge-relation-conflict-issue-code-catalog-v1", "judge-forbidden-inference-policy-v1", "judge-runtime-vocabulary-policy-v1", "judge-quality-gate-policy-v1", "judge-answer-status-policy-v1", "judge-verdict-policy-v1", "judge-uncertainty-followup-policy-v1", "judge-control-effects-policy-v1", "judge-fallback-trace-policy-v1", "judge-reasoning-path-policy-v1", "judge-reasoning-path-validator-v1", "judge-reasoning-path-sequence-semantics-v1", "judge-reasoning-path-validator-case-coverage-v1", "judge-reasoning-path-validator-issue-catalog-v1", "judge-fallback-trace-validator-v1", "judge-fallback-trace-validator-issue-catalog-v1", "judge-control-effects-validator-v1", "judge-control-effects-trace-scope-v1", "judge-control-effects-trace-alignment-v1", "judge-control-effects-accepted-control-alignment-v1", "judge-control-effects-risk-signal-key-contract-v1", "judge-fallback-trace-payload-validator-v1", "judge-uncertainty-followup-validator-v1", "judge-fallback-trace-payload-cardinality-v1", "judge-uncertainty-field-shape-validator-v1"]
related_pages:
  - "wiki/canon/specs/health-control-signal-rollout-v2.md"
  - "wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md"
  - "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md"
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
  - "wiki/canon/api/s5-paper-context-api.md"
  - "wiki/canon/work-requests/s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow.md"
migration_status: "canonicalized"
---


# Knowledge Base API 계약서


## Current-state overlay — 2026-05-21

This page remains the canonical general Knowledge Base API contract. For the paper-specific S3 consumer surface, use [[wiki/canon/api/s5-paper-context-api]] and the current-state snapshot [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]].

Important current additions since the older general API sections:

- Paper endpoints are implemented and intentionally separated from legacy/general S5 endpoints:
  - `GET /v1/contracts/paper-context`
  - `POST /v1/paper/code-kb/prepare`
  - `POST /v1/paper/finding-context/retrieve`
  - `POST /v1/paper/threat-context/generic`
- `X-Timeout-Ms` is optional for paper endpoints and is not a semantic terminal deadline.
- Paper POST requests require body `requestId` and `idempotencyKey`; if `X-Request-Id` is supplied, it must match body `requestId`.
- Paper responses are contextual support only and must not be consumed as final TP/FP/UNKNOWN evidence.
- `POST /v1/paper/code-kb/prepare` now reports weak/selectable Source KG bundles as `surfaceStatus=partial` with `readiness.sourceKgQualityGate=accepted_with_caveats` and diagnostic-only quality caveats, rather than over-claiming clean `produced` readiness.
- S3 consumer action for this additive paper-context contract update: keep consuming `codeKbRef`/`sourceKgRef` when `stageReadiness=ready` and `readiness.contextSelectable=true`, but preserve `accepted_with_caveats` diagnostics and do not render weak Source KG as complete/high-confidence graph coverage.
- Canonical JSONL logging for S5 is verified at `/home/kosh/AEGIS/logs/aegis-knowledge-base.jsonl` with `service=s5-kb`, numeric levels, request IDs, lifecycle rows, and `log-analyzer.trace_request` support.
- `/v1/health` is liveness-only; it can echo `X-Request-Id` via middleware but intentionally has no explicit lifecycle log. Use paper/contract endpoints for traceability proof.

Current verification references:

```text
S5 paper/freeze/observability focused: 53 passed
S5 full service-root suite: 765 passed
Paper observability/API focused after live log proof: 18 passed in 37.47s
S5 canonical JSONL/log-analyzer proof: PASS
S5 Source KG partial-quality contract/update suite: 143 passed in 154.34s
```

> **소유자**: S5 (Knowledge Base)
> **포트**: 8002
> **호출자**: S2 (Backend), S3 (Analysis Agent)
> **최종 업데이트**: 2026-05-21 (S5 Paper Context API는 별도 계약서 `wiki/canon/api/s5-paper-context-api.md`에서 관리; 본 일반 KB API 계약서에는 paper endpoint 분리, no-final-verdict boundary, canonical JSONL/log-analyzer traceability proof, S5_FREEZE_GATE pass, Source KG partial-quality 소비 규칙을 overlay로 반영)

---

## 공통 사항

### Base URL

```
http://localhost:8002/v1
```

### 헤더

| 헤더 | 필수 | 설명 |
|------|------|------|
| `Content-Type` | POST 요청 시 필수 | `application/json` |
| `X-Request-Id` | 선택 | 교차 서비스 추적용. 전파하면 로그에 포함됨. **응답 헤더에도 동일한 값 반환** |
| `X-Timeout-Ms` | **검색/적재/조회 POST 필수** | 클라이언트 타임아웃 (밀리초). 양의 정수. 누락 시 **400 반환**. 서버가 데드라인 초과 시 **408 반환**. 적용 대상은 아래 권장값 테이블 참조 |

`POST /v1/analyst-brief`는 외부 I/O 없는 순수 변환 endpoint이므로 `X-Timeout-Ms` 필수 대상에서 제외된다. 이 endpoint는 주어진 acquisition artifact를 사람이 읽을 수 있는 S3 소비 가이드로 변환할 뿐, 검색/적재/조회 작업을 수행하지 않는다.

### 로그/운영 노출

Runtime startup logs and ETL/projection-seed progress output must redact userinfo and sensitive query parameters from credential-bearing ledger, Qdrant, and Neo4j URLs before printing them. SQLite ledger paths and local Qdrant file paths remain readable, but URL forms such as `postgresql://user:password@host/db`, `https://user:password@qdrant:6333?api_key=secret`, or `bolt://user:password@neo4j:7687?access_token=secret` must be logged as `postgresql://***:***@host/db` / `https://***:***@qdrant:6333?api_key=***` / `bolt://***:***@neo4j:7687?access_token=***`. API keys and passwords must not be emitted in startup or ETL progress logs.

### 호출자-실행자 경계

**호출자(S3)는 "무엇을(what)" 지정, S5는 "어떻게(how)" 결정.**

- 호출자가 지정: `X-Request-Id`, `X-Timeout-Ms`, `project_id`, `query`, `libraries`, `functions`
- S5 자율 (생략 시 기본값 적용): `top_k`, `min_score`, `graph_depth`, `include_call_chain` 등

호출자는 특별한 이유가 없으면 기본값 파라미터를 생략하고 S5의 기본값에 위임한다.

### 인증

없음. 내부 서비스 간 통신 전용.


### 2026-05-11 Knowledge Coverage / Acquisition Readiness Contract v1

S5는 G001 기준으로 runtime acquisition contract를 기계 판독 가능한 형태로 고정한다.

```http
GET /v1/contracts/acquisition
```

이 endpoint는 S5 코드의 `contract_snapshot()`과 동일한 JSON을 반환하며, S3/S4 소비자는 이 snapshot으로 coverage/readiness vocabulary를 확인할 수 있다.

### 2026-05-13 Source Code KG Producer Contract v1

S5는 Source Code KG producer contract도 기계 판독 가능한 형태로 노출한다. 이 contract는 S3/S4가 S5에 넘겨야 할 repository snapshot, build context, graph facts, evidence snippets, rich IR, source artifact fields를 S5-owned contract로 고정한다.

```http
GET /v1/contracts/source-code-kg
POST /v1/source-code-kg/ingest
POST /v1/source-code-kg/context
```

응답은 S5 코드의 `source_code_kg_contract_snapshot()`과 동일한 JSON이다. 주요 필드:

| 필드 | 의미 |
|---|---|
| `sourceCodeKgContractVersion` | `source-code-kg-ingest-v1` |
| `endpoint.path` | `/v1/source-code-kg/ingest` |
| `endpoint.timeoutFailurePolicy` | Sync timeout guard: if S5 cannot safely start the ledger-write thread with enough remaining budget (`minimumSafeStartBudgetMs=10`), it returns `deadline_exceeded_before_ledger_ingest_completed` and performs no ingest ledger writes; after a durable-write thread has started, S5 waits for completion and returns the committed result instead of emitting a false 408 while the thread keeps writing |
| `contextEndpoint.path` | `/v1/source-code-kg/context`, ledger-only direct context resolver with timeout header |
| `endpoint.errors` | ingest-only error vocabulary: timeout header, request/schema invalid, duplicate graph-node identity, duplicate non-node producer identity, same-lineage explicit ID content conflict, explicit repository root/container ID lineage rebind, unknown compile-commands source artifact reference, graph-node unknown evidence-snippet reference, graph-edge unknown-node reference, ledger unavailable, ingest deadline exceeded |
| `contextEndpoint.errors` | direct-context-only error vocabulary: timeout header, request/schema invalid, no context selector, explicit selector count limit, selector value length limit, ledger unavailable, context deadline exceeded |
| `errorDetail.reason` | Runtime S5 error envelopes expose the contract reason for advertised Source KG transport and validation failures, including `timeout_header_missing_or_invalid`, `ledger_not_initialized`, `deadline_exceeded_before_ledger_ingest_completed`, and `deadline_exceeded_before_context_resolution_completed` |
| `producerRequirements` | S3/S4 producer가 제공해야 하는 field family: `repositorySnapshot`, `buildContext`, `analysisArtifactSet`, `graphNodes`, `graphEdges`, `evidenceSnippets`, `richIrArtifacts`, `sourceArtifacts` |
| `consumerBoundary.owner` | `s5`; S3/S4는 producer, S5 SQL ledger가 storage truth |
| `consumerBoundary.productionWritesDefault` | `{"neo4j": false, "qdrant": false}` |
| `requestJsonSchema` / `resultJsonSchema` | Pydantic model에서 생성한 ingest request/result JSON Schema |
| `producerIdentityPolicy` | Producer bundle-local duplicate `graphNodes[].stableId` and duplicate explicit `graphNodes[].sourceGraphNodeId` are forbidden before ledger writes with `duplicate_source_graph_node_identity`; duplicate explicit `sourceArtifacts[].sourceRepositoryArtifactId`, `evidenceSnippets[].evidenceSnippetId`, `graphEdges[].sourceGraphEdgeId`, and `richIrArtifacts[].richIrArtifactId` are forbidden with `duplicate_source_kg_identity`; after S5 deterministic ID generation, duplicate generated/resolved source artifact, evidence snippet, graph edge, or rich IR IDs are also forbidden before ledger writes so response `counts`/`ids` cannot diverge from durable unique rows; once an explicit/resolved Source KG ID exists for source artifacts, build contexts, analysis artifact sets, evidence snippets, graph nodes, graph edges, or rich IR artifacts, resubmitting that ID with different stored content is rejected before ledger writes with `source_kg_identity_content_conflict` |
| `lineageRebindPolicy` | Explicit `repositorySnapshotId` is immutable to the repository source version fields (`repositoryUrl`, `repositoryId`, `commitHash`, `treeHash`, `submoduleHashes`), and explicit container IDs are immutable to their parent lineage: `sourceRepositoryArtifactId` may not rebind to another `repositorySnapshotId`, `buildContextId` may not rebind to another `repositorySnapshotId`, and `analysisArtifactSetId` may not rebind to another `buildContextId`; violations fail before ledger writes with `source_kg_lineage_rebind_forbidden` |
| `atomicIngestPolicy` | Source KG ingest writes run in a single SQLite transaction; validation failures and late write failures must leave no partial source snapshot/artifact/build/analysis/snippet/node rows. Unknown `buildContext.compileCommandsArtifactId` fails before writes with `build_context_references_unknown_source_artifact` |
| `ingestSizePolicy` | Source KG producer bundle storage/integrity guardrail: `sourceArtifacts<=1024`, `evidenceSnippets<=4096`, `graphNodes<=8192`, `graphEdges<=16384`, `richIrArtifacts<=2048`, producer/reference IDs (`repositorySnapshotId`, `repositoryId`, `sourceRepositoryArtifactId`, `buildContextId`, `projectId`, `targetId`, `compileCommandsArtifactId`, `analysisArtifactSetId`, `evidenceSnippetId`, `sourceGraphNodeId`, `stableId`, edge endpoint refs, `sourceGraphEdgeId`, `richIrArtifactId`) `<=512 chars`, `snippetText<=65536 chars`, nested JSON object fields (`repositorySnapshot.submoduleHashes`, repository/source artifact metadata/provenance dictionaries, build `toolchain`/`dependencyGraph`/`buildMetadata`, analysis config/hash dictionaries, graph node `symbol`/`metadata`, graph edge `evidence`/`metadata`, and rich-IR `provenance`) `<=65536 bytes` each and `<=1048576 bytes` in aggregate per ingest request, rich IR `payload<=262144 bytes`; Source KG checksum fields must use `sha256:<64 lowercase hex>` and supplied evidence snippet checksums must equal S5 recomputation from `snippetText`; evidence snippet and graph node line spans must use 1-based positive line numbers and `lineEnd>=lineStart` when both are supplied; over-limit collections fail with `ingest_collection_limit_exceeded`, oversized values fail with `ingest_value_too_large`, checksum format/mismatch failures use `source_kg_checksum_invalid`, and invalid line spans use `source_kg_line_span_invalid` before ledger writes |
| `contextRequestJsonSchema` / `contextResultJsonSchema` | Pydantic model에서 생성한 direct context resolution request/result JSON Schema |
| `servingContextResolution.outOfLineageCollectionPolicy` | out-of-lineage explicit collection IDs, including IDs supplied under a requested-but-missing repository/analysis container, emit `SOURCE_KG_CONTEXT_INCONSISTENT`, are redacted from returned rows, and are reported as missing IDs |
| `servingContextResolution.richIrPayloadPolicy` | rich IR payload inline cap and redaction metadata: payloads over `maxInlineBytes` are returned as `payload=null` with `payloadByteLength`, `payloadMaxInlineBytes`, `payloadTruncated=true`, and `payloadRedacted=true` while IDs/checksums/URI/provenance remain visible |
| `servingContextResolution.urlRedactionPolicy` | Source KG context and Judge evidence redact userinfo and sensitive query parameters from served `repositorySnapshot.repositoryUrl`, `sourceArtifacts[].artifactUri`, `richIrArtifacts[].uri`, and URL-like string values/keys inside served small nested object projections; ledger storage retains raw producer values for replay/provenance, but routine analysis responses expose redacted URL projections |
| `servingContextResolution.nestedObjectPolicy` | Source KG context and Judge evidence redact oversized nested JSON serving fields (`repositorySnapshot.submoduleHashes`/metadata/provenance, source artifact metadata/provenance, build `toolchain`/`dependencyGraph`/`buildMetadata`/provenance, analysis config/hash/provenance, graph node `symbol`/`metadata`, graph edge `evidence`/`metadata`, snippet provenance, rich-IR provenance) when their canonical JSON exceeds `maxInlineBytes=2048`; served packets expose `*ByteLength`, `*MaxInlineBytes`, `*Truncated=true`, and `*Redacted=true`. Small nested objects remain inline but recursively redact credential-bearing URL string values and keys; the 2048-byte inline budget is measured before URL redaction so long credential URLs cannot bypass redaction by shrinking after masking; ledger storage remains raw for replay. |
| `servingContextResolution.projectionDiagnosticPolicy` | Any redacted/truncated Source KG serving projection emits non-silent context diagnostics: redacted fields use `SOURCE_KG_CONTEXT_REDACTED`, truncated fields use `SOURCE_KG_CONTEXT_TRUNCATED`, `contextResolution.complete=false`, and `contextResolution.partial=true`; projection diagnostics are capped at `maxProjectionDiagnostics=64` and overflow is summarized by `SOURCE_KG_CONTEXT_DIAGNOSTICS_TRUNCATED`; `servingContextResolution.diagnosticCodeCoverage` declares all 5 known serving context diagnostics and contract tests compare ledger-emitted `SOURCE_KG_CONTEXT_*` literals to `diagnosticCodes`; Judge must treat these diagnostics as degraded Source KG context. |
| `servingContextResolution.compileCommandsArtifactPolicy` | When a selected `buildContext` references `compileCommandsArtifactId`, Source KG context/Judge evidence include the referenced `sourceArtifacts[]` record with artifact ID, repository snapshot ID, redacted `artifactUri`, media type, checksum, storage mode, and bounded metadata/provenance; raw ledger artifact URI remains available for replay. The dependent artifact is accounted in `contextResolution.sourceArtifacts` with requested/resolved/missing IDs and `missingDiagnosticField=sourceArtifactIds`. |
| `servingContextResolution.sourceSnippetTextPolicy` | source evidence snippet inline text cap: oversized `snippetText` is UTF-8 truncated to `maxInlineBytes` and carries `snippetTextByteLength`, `snippetTextMaxInlineBytes`, and `snippetTextTruncated=true`; checksums/line ranges/provenance remain visible |
| `servingContextResolution.explicitSelectorLimitPolicy` / `partialResolutionEchoPolicy` | direct context request caps for explicit ID arrays: `graphNodeIds<=256`, `evidenceSnippetIds<=256`, `richIrArtifactIds<=128`; selector scalar/item strings are capped at 512 chars; over-limit counts fail with `explicit_selector_limit_exceeded` and over-length values fail with `selector_value_too_long` before ledger resolution or large `missingIds` echo; `partialResolutionEchoPolicy` requires credential-bearing URL-like requested/missing IDs to be redacted in `contextResolution.requestedId(s)`, `missingIds`, and `SOURCE_KG_CONTEXT_PARTIAL` diagnostics while ledger lookup still uses raw selector values |

Guardrails:

- `repositorySnapshot.commitHash`는 필수다. Source KG facts는 repository snapshot version에 묶인다.
- full/source artifacts는 replay/dataset construction용으로 retain/reference 가능하지만, routine answer는 snippet/hash/line range/artifact id 중심으로 노출한다.
- Source Code KG ingest와 `/context` resolution은 기본적으로 ledger-only이며 production Neo4j/Qdrant projection은 별도 workflow가 필요하다.
- Source KG context/Judge evidence include the source artifact referenced by `buildContext.compileCommandsArtifactId` so S3 can verify build provenance without dumping full source; `sourceArtifacts[].artifactUri` is served only through credential-redacted projection while raw values remain in the S5 ledger. Judge/Source KG contracts expose the exact served source artifact fields and declare this as dependent collection accounting through `contextResolution.sourceArtifacts`, so consumers can verify requested/resolved/missing compile-commands artifact IDs without treating the artifact as a caller-supplied selector.
- Source Code KG ingest timeout semantics are pre-start-only for durable writes: 408 means no ingest worker started and no ingest ledger rows were written. If the worker has already started, S5 must not use `asyncio.wait_for` cancellation semantics that can leave background SQLite side effects after a 408 response; it waits for completion and returns the committed ingest result.
- Source Code KG ingest uses one SQLite transaction for all source/build/analysis/snippet/node/edge/rich-IR rows. Any validation or late write failure rolls back the whole ingest so S5 never exposes partial producer bundles as Source Code KG truth.
- Source Code KG ingest is bounded before SQLite writes. Oversized producer bundles, scalar values, rich-IR payloads, or nested JSON objects are rejected at request validation with sanitized S5 error envelopes, so raw huge snippets/rich-IR payloads/metadata/provenance are not echoed and partial ledger writes do not occur. Nested object budgets are both per-object (`maxNestedObjectBytes=65536`) and aggregate (`maxTotalNestedObjectBytes=1048576`) across the advertised `nestedObjectFields` matrix, preventing many-small-object request bloat in repeated graph/snippet/artifact families.
- Source Code KG graph nodes must have unique producer-bundle identities. Duplicate `stableId` values or duplicate explicit `sourceGraphNodeId` values are rejected before ledger writes with `errorDetail.reason=duplicate_source_graph_node_identity`, preventing SQLite upsert collapse and ambiguous stable-ID edge resolution.
- Source Code KG non-node producer IDs must also be unique inside one ingest bundle. Duplicate explicit source artifact, evidence snippet, graph edge, or rich-IR IDs are rejected before ledger writes with `errorDetail.reason=duplicate_source_kg_identity`, preventing response counts from implying multiple facts that SQLite would collapse into one row. Existing explicit/resolved IDs are content-immutable in their same lineage: source artifacts, build contexts, analysis artifact sets, evidence snippets, graph nodes, graph edges, and rich IR artifacts cannot be overwritten with different stored content; same-lineage content conflicts fail with `errorDetail.reason=source_kg_identity_content_conflict` before any dependent ledger writes.
- Direct Source KG context consumers can call `POST /v1/source-code-kg/context` with repository/build/analysis IDs and optional graph/snippet/rich-IR IDs; result packets use `schemaVersion=s5-source-code-kg-context-result-v1` and include the same `contextResolution` semantics as Judge evidence.
- Explicit direct-context selector arrays are bounded before ledger lookup: `graphNodeIds<=256`, `evidenceSnippetIds<=256`, and `richIrArtifactIds<=128`, and each selector scalar/item value is capped at 512 chars. Over-limit counts are rejected with `errorDetail.reason=explicit_selector_limit_exceeded`; over-length selector values are rejected with `errorDetail.reason=selector_value_too_long` using sanitized validation envelopes that do not echo raw selector input. Partial resolution echoes also redact credential-bearing URL-like selector IDs in requested/missing IDs and diagnostics before returning Source KG context.
- Explicit `graphNodeIds`, `evidenceSnippetIds`, and `richIrArtifactIds` preserve caller request order in both returned collections and `contextResolution.*.resolvedIds`, so consumers can correlate requested and resolved context deterministically. Judge may sort Source KG IDs for canonical query/cache identity, but it must pass the original caller order into Source KG context resolution and return Judge `evidence.sourceCodeKg` collections in that same caller order.
- When explicit `graphNodeIds` are supplied with an `analysisArtifactSetId`, returned `graphEdges` are limited to the induced subgraph whose source and target nodes are both in the resolved requested node set. Whole-analysis unrelated edges must not leak into direct context or Judge evidence, and dense induced subgraphs are capped by the same `graphEdges<=128` response budget with `SOURCE_KG_CONTEXT_TRUNCATED` diagnostics.
- Whole-analysis Source KG context is bounded: `graphNodes<=64`, `graphEdges<=128`, and `richIrArtifacts<=32`; truncation emits `SOURCE_KG_CONTEXT_TRUNCATED` with total/returned/max counts and `complete=false`.
- Rich IR artifact metadata remains useful for replay/correlation, but large inline rich IR payloads are not dumped into routine Source KG/Judge responses. Payloads over the machine-readable `servingContextResolution.richIrPayloadPolicy.maxInlineBytes` are redacted to `payload=null` and carry `payloadByteLength`, `payloadMaxInlineBytes`, `payloadTruncated=true`, and `payloadRedacted=true`; `richIrArtifactId`, `artifactKind`, checksum, redacted URI projection, and provenance stay available. Credential-bearing `repositoryUrl`/`uri` values are stored raw in the ledger for replay but served only through `servingContextResolution.urlRedactionPolicy` projections.
- Evidence snippets stay useful as snippets, but large `snippetText` values are bounded before routine Source KG/Judge responses. Text over `servingContextResolution.sourceSnippetTextPolicy.maxInlineBytes` is UTF-8 truncated and accompanied by `snippetTextByteLength`, `snippetTextMaxInlineBytes`, and `snippetTextTruncated=true`; line ranges, checksums, and provenance remain available for replay or targeted re-query.
- Nested JSON objects stay useful for correlation when small, but large nested objects are not dumped into routine Source KG/Judge responses. Values governed by `servingContextResolution.nestedObjectPolicy` over `maxInlineBytes=2048` are served as `null` with byte length, max-inline, truncated, and redacted metadata; small inline nested objects recursively redact credential-bearing URL string values and keys before serving, while the inline byte budget is still measured on the raw nested object before URL redaction; raw producer values remain in the ledger for replay/dataset construction. Any redacted/truncated serving projection emits context diagnostics (`SOURCE_KG_CONTEXT_REDACTED` or `SOURCE_KG_CONTEXT_TRUNCATED`), sets `complete=false`/`partial=true`, and forces Judge to expose non-silent degraded Source KG context instead of returning a clean `complete` status. Projection diagnostics are response-budgeted (`maxProjectionDiagnostics=64`); overflow emits `SOURCE_KG_CONTEXT_DIAGNOSTICS_TRUNCATED` with total/returned/max counts instead of dumping unbounded per-field diagnostics.
- Repository/build/analysis selectors must be lineage-consistent. Mixed selectors that resolve to different repository snapshots or build contexts emit `SOURCE_KG_CONTEXT_INCONSISTENT`, set `complete=false`, and must not be treated as clean context.
- Explicit collection IDs are lineage-checked too: `graphNodeIds` and `richIrArtifactIds` must belong to the requested `analysisArtifactSetId`; `evidenceSnippetIds` must belong to the requested `repositorySnapshotId`. Out-of-lineage IDs, and IDs supplied under a requested container that cannot be resolved, emit `SOURCE_KG_CONTEXT_INCONSISTENT`, are omitted from returned collections, appear as missing IDs in `contextResolution.*.missingIds`, and set `complete=false` so Judge/direct consumers do not receive chimera source rows as coherent context.
- Producer-supplied Source KG IDs are immutable to their lineage and source version: reusing an existing `repositorySnapshotId` with different repository source version fields (`repositoryUrl`, `repositoryId`, `commitHash`, `treeHash`, `submoduleHashes`) is rejected before the root row can be rewritten; reusing an existing `sourceRepositoryArtifactId` under a different `repositorySnapshotId`, `buildContextId` under a different `repositorySnapshotId`, `analysisArtifactSetId` under a different `buildContextId`, `evidenceSnippetId` under a different `repositorySnapshotId`, or existing graph node/edge/rich-IR IDs under a different `analysisArtifactSetId`, is also rejected before dependent ledger rows are rewritten. Root/source-version and container lineage rebind attempts use `errorDetail.reason=source_kg_lineage_rebind_forbidden`.
- Judge/serving consumption must expose `contextResolution` when requested Source KG IDs are only partially resolved. Missing `graphNodeIds`, `evidenceSnippetIds`, or `richIrArtifactIds` are non-silent fallbacks, not invisible omissions.
- Producers that omit generated graph node IDs should reference graph edges by `sourceStableId`/`targetStableId`. Direct `sourceGraphNodeId` / `targetGraphNodeId` cross-references require producer-supplied explicit IDs.
- fuzzy source/code retrieval은 source-analysis fact를 발명하거나 affectedness proof가 될 수 없다.

### 2026-05-13 Evidence-Grounded Judge Serving Contract v1

S5는 Evidence-Grounded Judge의 machine-readable contract와 HTTP serving endpoint를 노출한다.

```http
GET /v1/contracts/judge
POST /v1/judge/query
```

`GET /v1/contracts/judge` 응답은 S5 코드의 `judge_contract_snapshot()`과 동일한 JSON이다. 주요 필드:

| 필드 | 의미 |
|---|---|
| `schemaVersion` | `s5-judge-contract-v1` |
| `endpoint` | `{"method":"POST","path":"/v1/judge/query"}` |
| `request.schemaVersion` | `s5-judge-query-v1` |
| `request.timeoutFailurePolicy` | Sync timeout guard: if S5 cannot safely start the durable Judge worker with enough remaining budget (`minimumSafeStartBudgetMs=10`), `deadline_exceeded_before_judge_query_completed` does not write a serving-ledger row; after a durable Judge worker has started, S5 waits for completion and returns the recorded answer instead of emitting a false 408 while the worker writes the serving row |
| `request.controlEchoPolicy` | rejected/requested/accepted control echo, `canonicalQuery.controlSummary`, and serving-ledger request/answer packets (`servingLedger.requestPacket`, `servingLedger.answerPacket`) redact credential-bearing URL-like values/keys (`credentialBearingUrlRedaction=true`) as well as oversized control strings/names/object keys beyond 512 chars; recognized controls with oversized values or nested keys are rejected with `control_value_too_long`; `exclude`/`prefer` lists are capped at 128 items and over-limit requests fail before serving-ledger persistence with `control_list_too_long`; `forceContext` is budgeted (`rootKeys<=128`, recursive object/list items<=512, sanitized echo bytes<=16384, depth<=8`) and over-budget requests fail before serving-ledger persistence with `control_object_too_large`; unsupported-control values are also echo-budgeted (`rootItems<=128`, recursive items<=512`) so rejected unknown controls cannot dump credential-bearing URLs or many-small-value arrays/objects into responses or serving-ledger request/answer packets |
| `request.questionEchoPolicy` | Judge question echoes redact credential-bearing URL-like substrings (`credentialBearingUrlRedaction=true`) in `queryContext.question`, `canonicalQuery.normalized.questionTerms`, `servingLedger.requestPacket.question`, and `servingLedger.answerPacket`; raw URL credentials are not required for answer quality and must not be persisted or returned |
| `answer.schemaVersion` | `s5-judge-answer-v1` |
| `answer.notFinalSecurityVerdict` | 항상 `true` |
| `answer.verdictAuthority` | `s5_evidence_grounded_knowledge_verdict_not_s3_final_security_verdict` |
| `answer.verdictPolicy` | `verdict` allowed values are `affected`, `not_affected`, and `unknown`; `conflicting` remains reserved runtime vocabulary represented through `uncertainty.conflicts` plus `qualityGate.gate=rejected`, not a current verdict value; `not_affected` is scope-bound evidence, not a clean pass; `unknown` means more context/re-query, not no-hit or safe. |
| `answer.qualityGatePolicy` | `qualityGate` allowed values are `accepted`, `accepted_with_caveats`, and `rejected`; merge precedence is `rejected > accepted_with_caveats > accepted`; diagnostics and score policy locations are fixed, and `negativeEvidenceAllowed=false` because the gate is S5 runtime answer quality, not a S3 final security verdict or component-safety truth. |
| `answer.answerStatusPolicy` | `status` allowed values are `complete`, `degraded_quality`, `requires_requery`, and `insufficient_input`; `stale_cache`/`policy_blocked` remain reserved runtime vocabulary rather than currently emitted answer statuses; non-complete statuses are re-query or quality signals and `negativeEvidenceAllowed=false`. |
| `answer.uncertaintyPolicy` | `uncertainty` must expose `reason`, `evidenceGaps`, `requiredInputs`, and `conflicts`; required-input vocabulary, follow-up request kinds, and owner lanes are fixed so unknown/degraded/conflict answers guide S3/S4 re-query or context enrichment instead of becoming negative evidence; `fieldShapePolicy` and `validatorIssueCatalog` expose all known `UNCERTAINTY_*`/`FOLLOW_UP_*` issue codes; the Judge answer validator rejects missing uncertainty required fields, missing/non-empty-required reason for unknown or non-complete answers, invalid `evidenceGaps`/`conflicts` shapes, non-dict `uncertainty` containers and malformed uncertainty/follow-up/conflict child containers and entries without crashing later validation paths, Source KG degraded answers missing `source code kg context` in `evidenceGaps`, unknown required inputs, malformed follow-up affordances, unknown follow-up request kind/owner lane, and missing follow-up reasons. |
| `answer.controlEffectsPolicy` | `appliedControls` and `controlEffects` locations are fixed; accepted `exclude` suppresses matching affectedness and Threat Retrieval candidates into `evidence.suppressedAffectedness` / `evidence.threatRetrieval.suppressedCandidateEvidence`; `controlEffects` trace is required for `evidence.suppressedAffectedness` and must exactly match the union of suppressed affectedness `advisoryId`/`advisoryExternalId` values via `suppressedAdvisoryIds`/`suppressedExternalIds`; each suppressed affectedness item must also have at least one normalized advisory/risk-signal key (`advisoryId`, `advisoryExternalId`, `riskSignals[].payload.cve`, or `riskSignals[].payload.cveID`) covered by `appliedControls.accepted.exclude`, while threat-retrieval-only suppressed candidate trace ownership remains `answer.threatRetrievalPolicies.suppressedCandidateResponseBudget`; if all affectedness is suppressed the result is `verdict=unknown`, `status=requires_requery`; the Judge answer validator rejects non-list control effects, non-object entries, missing control/suppression fields, unknown controls, missing affectedness suppression trace, trace/evidence ID mismatches, accepted-control/suppression mismatches, and suppressed-all clean-pass/complete states; suppression does not prove `not_affected`. |
| `answer.fallbackTracePolicy` | `fallbackTrace` entries must expose `stage`, `fallback`, and `silent=false`; known stages are `source_code_kg_context` (`unresolved_context`, `partial_context_resolution`) and `control_validation` (`unsupported_controls_rejected`); the Judge answer validator issue catalog exposes all known `FALLBACK_TRACE_*` issue codes and rejects non-list traces, non-object entries, missing `stage`/`fallback`/`silent`, unknown stage/fallback vocabulary, `partial_context_resolution` entries without non-empty `diagnostics[]`, `unsupported_controls_rejected` entries without non-empty `rejected[]`, and `silent=true`; fallback trace entries are re-query/scope diagnostics, not negative evidence. |
| `answer.reasoningPathPolicy` | `reasoningPath` entries must expose `step` and `status`; step vocabulary is fixed for Source KG resolution, decision cache loading, component identity resolution, package-version affectedness evaluation, exclude control application, Threat KB context assembly, and missing input checks; the step catalog is allowed vocabulary rather than a required per-response sequence, cache-hit answers may omit affectedness evaluation steps, and the Judge answer validator issue catalog exposes all known `REASONING_PATH_*` issue codes and rejects missing/non-list reasoning paths, non-object reasoning path entries, missing `step`/`status`, and unknown step values; reasoning path is explainability trace, not a security verdict. |
| `answer.threatRetrievalPolicies` | `topKPolicy=s5-top-k-policy-v1`, over-cap `controls.topK` values are canonicalized to the final policy cap for accepted controls/cache identity while the raw request is preserved in `appliedControls.requested.topK` and `retrievalTrace.topKPolicy.requestedTopK`, `candidatePoolPolicy=s5-candidate-pool-policy-v1`, `rerankerPolicy=s5-deterministic-method-aware-reranker`, candidate-pool preview is bounded, internal candidate-pool cap truncation is explicit via `candidatePoolTruncated`, normalized component identifiers and security-identifier question terms can discover contextual `keyword_match` advisories only through fielded exact advisory/security-taxonomy/package-identity matches without affectedness authority; raw payload JSON substring scans are forbidden, runtime trace parity fields (`methodsSucceeded`, `filtersApplied`, `matchedTerms`, `relationMethods`, `embeddingScope`, `profileBoostsApplied`, `projectionState`, `providerState`) are always present for Judge Threat Retrieval, missing-version grounded-unknown answers still assemble conservative Threat Retrieval context when component identifiers or security question terms are available, equivalent advisory response budget is bounded, risk signal response budget is bounded, suppressed candidate response budget is bounded, semantic expansion response budget is bounded, `verdictLinkedEvidenceTier=affectedness_evidence`, `contextualPackageTier=package_identity_context` |
| `answer.decisionCachePolicy` | `storageScope=ledger`, `cacheTrace.cacheScopeHash`, `cacheTrace.cacheRevisionHash`; revision hashes use compact per-table revision summaries rather than full table payload serialization; cross-ledger reuse and stale ledger-revision reuse are forbidden |
| `answer.sourceCodeKgContextResolution` | partial/unresolved/inconsistent/truncated/redacted Source KG context is non-silent; affected/not_affected verdicts with degraded requested context use `status=degraded_quality`; Judge `sourceContext` explicit selector arrays share Source KG caps (`graphNodeIds<=256`, `evidenceSnippetIds<=256`, `richIrArtifactIds<=128`) and all source-context selector scalar/item strings are capped at 512 chars; over-limit counts fail with `errorDetail.reason=explicit_selector_limit_exceeded`, and over-length values fail with `selector_value_too_long` before serving-ledger persistence; `queryContextSourceContextEchoPolicy` redacts credential-bearing selector values in `queryContext.sourceContext`, `canonicalQuery.normalized.sourceContext`, and `servingLedger.requestPacket.sourceContext` before returning/storing the Judge answer/request echo while raw selector values remain available only for resolution/cache-key construction; `issueAndDiagnosticCatalog` exposes all 12 known Judge-emitted `SOURCE_KG_*` issue/diagnostic codes by family and declares `negativeEvidenceAllowed=false`, so context-quality, fallback-validation, projection-redaction, and context-resolution issues remain inconclusive diagnostics rather than negative security evidence; `servingContextDiagnosticCatalog` mirrors the direct Source KG contract for the 5 ledger-emitted `SOURCE_KG_CONTEXT_*` context diagnostics at `evidence.sourceCodeKg.contextResolution.diagnostics`, including partial, inconsistent, redacted, truncated, and diagnostics-truncated cases, also with `negativeEvidenceAllowed=false`; `nestedObjectRedactionValidation` advertises validator enforcement for Source KG nested object redaction metadata with issue code `SOURCE_KG_NESTED_OBJECT_REDACTION_INVALID`; `urlRedactionValidation` rejects credential-bearing Source KG URL projections that were not redacted, with issue code `SOURCE_KG_URL_REDACTION_INVALID`, for `repositorySnapshot.repositoryUrl`, `sourceArtifacts[].artifactUri`, `richIrArtifacts[].uri`, and credential-bearing URL string values/keys inside the same nested object fields governed by `nestedObjectRedactionValidation`; small served nested object projections also recursively redact credential-bearing URL string values/keys before Judge evidence assembly, and forged/corrupted Judge packets that reintroduce them are invalid; all Source KG validator diagnostic payloads redact credential-bearing URL-like string values recursively, including strings nested inside structured ID payloads, and bound diagnostic string/container echo size (`maxStringEchoChars=512`, `maxStructuredEchoItems=512`, `maxStructuredEchoBytes=16384`, `maxStructuredEchoDepth=8`) before returning diagnostics; URL-redaction validator issue payloads redact credential-bearing record IDs before returning diagnostics; `projectionDiagnosticPolicy` requires `SOURCE_KG_CONTEXT_REDACTED`, `SOURCE_KG_CONTEXT_TRUNCATED`, and `SOURCE_KG_CONTEXT_DIAGNOSTICS_TRUNCATED` with `maxProjectionDiagnostics=64` to produce non-silent fallback, `accepted_with_caveats`, and `complete_or_consistent_source_code_kg_context` follow-up; `compileCommandsArtifactProjectionPolicy` includes the referenced compile-commands source artifact when a selected build context names one, with artifact URI redacted; it also advertises the served artifact fields (`sourceRepositoryArtifactId`, `repositorySnapshotId`, `artifactUri`, `mediaType`, `checksumSha256`, `storageMode`, `metadata`, `provenance`) and clarifies `sourceArtifacts` as a dependent collection resolved via `buildContext.compileCommandsArtifactId` and accounted under `contextResolution.sourceArtifacts` (`missingDiagnosticField=sourceArtifactIds`); `compileCommandsArtifactValidation` rejects Judge packets whose referenced compile-commands artifact is absent from `sourceArtifacts[]` or unresolved/missing in `contextResolution.sourceArtifacts`, with issue code `SOURCE_KG_COMPILE_COMMANDS_ARTIFACT_CONTEXT_INVALID`; malformed non-string compile artifact IDs produce reason `compile_commands_artifact_id_invalid` instead of raising validator errors; `contextResolutionIntegrityValidation` rejects Judge packets whose served Source KG scalar/collection IDs disagree with `contextResolution.*.resolvedId(s)`, with issue code `SOURCE_KG_CONTEXT_RESOLUTION_INVALID` and safe ID-only issue payloads; its reason taxonomy is frozen, including malformed requested/resolved/missing ID shapes such as `requested_id_invalid`, `requested_ids_invalid`, and `missing_ids_invalid`; credential-bearing URL-like IDs inside forged resolution fields are redacted in validator issues before `servedIds`/`resolvedIds` are returned. |
| `answer.relationConflictVisibility` | `uncertainty.conflicts`에 relevant open conflict를 노출하고 matching `qualityGate.diagnostics`를 요구한다. `consumerPolicy=conflicting_evidence_not_negative_evidence`, `negativeEvidenceAllowed=false`, bounded `conflictingValues` 포함. `issueCodeCatalog` exposes all known relation/affectedness/identity-alias conflict issue codes (`AFFECTEDNESS_STATUS_CONFLICT`, `AFFECTEDNESS_RANGE_CONFLICT`, `RELATION_PREDICATE_CONFLICT`, `IDENTITY_ALIAS_EXACT_CONFLICT`) and hard conflict kinds, with contract drift tests comparing the catalog to the relation conflict model constants. |
| `answer.runtimeVocabularyPolicy` | `runtimeVocabulary` is a declared S5 runtime vocabulary, not an offline quality metric or S3 final-claim label set; `runtimeVocabularyCount` must match the served vocabulary, `offlineQualityVocabularyForbidden=true`, and `offlineQualityMetricTerms` declares the forbidden TP/FP/FN/Precision/Recall/NDCG/MRR vocabulary for drift tests. |
| `answer.offlineQualityVocabularyForbiddenInRuntime` | runtime answer가 TP/FP/FN/Precision/Recall/NDCG/MRR를 truth vocabulary로 쓰지 않음을 고정 |

`POST /v1/judge/query`는 `X-Timeout-Ms`가 필요한 S5 serving endpoint다. 이 endpoint는 S5 SQLite ledger, Source Code KG context, affectedness/identity/retrieval evidence, scoring policy, serving ledger를 조합해 `s5-judge-answer-v1` packet을 반환한다.

Guardrails:

- Judge 응답은 S5 evidence-grounded knowledge verdict이며 S3 final security verdict가 아니다.
- emitted `affected` / `not_affected` / `unknown`은 S5의 지식·증거 판정이고, S3의 accepted claim 또는 clean pass가 아니다. `conflicting`은 reserved vocabulary이며 emitted verdict가 아니다.
- `answer.verdictPolicy`는 현재 emitted verdict를 `affected`/`not_affected`/`unknown`으로 제한하고, conflict는 `verdict=conflicting`이 아니라 `uncertainty.conflicts`와 `qualityGate.gate=rejected`로 표현한다고 고정한다.
- `answer.runtimeVocabulary`는 S5 런타임 상태/근거 어휘의 닫힌 목록이며 `answer.runtimeVocabularyPolicy`가 count/consumer policy/offline metric 금지어를 함께 고정한다. TP/FP/FN/Precision/Recall/NDCG/MRR는 offline retrieval-quality lab vocabulary일 뿐 Judge runtime truth label이나 S3 final claim vocabulary가 아니다.
- `qualityGate.gate`는 S5 answer quality gate다. `rejected`는 conflict/score/fallback quality rejection이지 “취약점 존재” 또는 “컴포넌트 안전/불안전”에 대한 S3 final truth가 아니며, `accepted_with_caveats`도 소비자가 caveat/diagnostics를 함께 읽어야 한다.
- `answer.status`의 non-complete 값(`degraded_quality`, `requires_requery`, `insufficient_input`)은 추가 context/re-query/quality follow-up 신호이며 no-hit, safe, not-affected, 또는 negative evidence로 승격하면 안 된다.
- `answer.uncertaintyPolicy`는 `requiredInputs`와 `followUpAffordances`의 vocabulary/owner lane/field shape/validator issue catalog를 고정해, S3/S4가 `component.version`, Source KG enrichment, source diff/vendored patch check 같은 후속 조치를 수행하도록 안내한다. `validate_judge_answer()`는 누락된 uncertainty 필수 필드, unknown/non-complete answer의 비어 있는 reason, 잘못된 `evidenceGaps`/`conflicts` shape, non-dict top-level contract containers(`cacheTrace`, `queryContext`, `evidence`, `evidence.sourceCodeKg`, `appliedControls`), 미등록 required input, malformed follow-up affordance, 미등록 request kind/owner lane, 누락된 follow-up reason을 계약 품질 위반으로 보고하며, 이는 negative evidence가 아니다.
- `answer.answerFieldPolicy`는 top-level container shape policy와 `JUDGE_ANSWER_FIELD_INVALID` issue catalog를 노출한다. `cacheTrace`, `queryContext`, `evidence`, `evidence.sourceCodeKg`, `appliedControls`는 present이면 dict이어야 하며, present `cacheTrace` dict는 `cacheScope`, `cacheScopeHash`, `cacheRevisionHash`를 갖춰야 한다. 이 validator issue들은 contract quality failure이며 negative evidence가 아니다.
- `answer.answerFieldPolicy.malformedPacketRobustnessPolicy`는 broad malformed answer packet container regression을 기계 판독 가능하게 노출하고, contract path count/catalog가 runtime regression의 `mutation_paths`와 drift되지 않도록 테스트된다. Judge answer validator는 top-level serving fields, quality gate, applied controls, query context, uncertainty/follow-up fields, Source KG containers, Threat Retrieval containers, and malformed evidence list entries 때문에 예외를 던져서는 안 된다. 대표 예시는 `forbiddenInferences`, `appliedControls.accepted.exclude`, `evidence.sourceCodeKg.contextResolution`, `sourceArtifacts`, `graphNodes`, `evidence.suppressedAffectedness`, `evidence.suppressedAffectedness[].riskSignals`, `evidence.threatRetrieval.candidateEvidence[]`, `equivalentAdvisories[]`, `riskSignals[]`, `retrievalTrace.candidatePoolPreview[]`, `evidence.sourceCodeKg.richIrArtifacts[]`, `evidenceSnippets[]`이다.
- `answer.controlEffectsPolicy`는 caller controls가 응답 scope를 좁힐 수는 있어도 negative evidence를 만들 수 없다고 고정한다. 특히 `exclude`로 suppress된 affectedness는 `evidence.suppressedAffectedness`와 `controlEffects` trace로 남아야 하며, `controlEffects`의 `suppressedAdvisoryIds`/`suppressedExternalIds`는 suppressed affectedness의 `advisoryId`/`advisoryExternalId` union과 정확히 일치해야 하고, 각 suppressed affectedness item은 `advisoryId`, `advisoryExternalId`, `riskSignals[].payload.cve`, `riskSignals[].payload.cveID` 중 하나로부터 정규화된 key가 `appliedControls.accepted.exclude`에 포함되어야 설명된다. threat-retrieval-only suppressed candidates의 trace ownership은 `answer.threatRetrievalPolicies.suppressedCandidateResponseBudget`가 담당한다. 남은 affectedness가 없으면 re-query가 필요한 `unknown`이다. `validatorIssueCatalog`는 모든 `CONTROL_EFFECT*` validator issue code, 허용 control, 필수 field를 노출하고, `validate_judge_answer()`는 malformed controlEffects, affectedness suppression trace 누락, trace/evidence ID mismatch, accepted-control/suppression mismatch, suppressed-all clean-pass를 계약 위반으로 보고한다.
- `answer.fallbackTracePolicy`는 fallback이 항상 non-silent이어야 하며, Source KG context fallback과 control validation fallback을 S3/S4가 후속 입력·scope 보정 신호로 소비해야 함을 고정한다. `validatorIssueCatalog`는 모든 `FALLBACK_TRACE_*` validator issue code를 기계적으로 노출하고, `validate_judge_answer()`는 non-list trace, non-object entry, 누락된 `stage`/`fallback`/`silent`, 미등록 stage/fallback, `partial_context_resolution`의 non-empty `diagnostics[]` 누락, `unsupported_controls_rejected`의 non-empty `rejected[]` 누락, `silent=true`를 계약 위반으로 보고한다.
- `answer.reasoningPathPolicy`는 S5 내부 판단 흐름을 설명하는 trace vocabulary이며, `stepCatalog`는 response마다 모두 등장해야 하는 필수 sequence가 아니라 허용 vocabulary이며 cache hit 응답은 cached fragment가 affectedness 결과를 공급하므로 affectedness step을 생략할 수 있다. `validatorIssueCatalog`는 모든 `REASONING_PATH_*` validator issue code를 기계적으로 노출하고, `validate_judge_answer()`는 누락/non-list reasoning path, non-object entry, 누락된 `step`/`status`, 미등록 step을 계약 위반으로 보고한다. 각 step/status를 S3 final security verdict나 negative evidence로 해석하면 안 된다.
- `servingLedger.recorded=true`인 응답은 replay/debugging/golden-set promotion을 위한 S5 serving row를 가리킨다.
- Judge query timeout semantics are pre-start-only for durable serving writes: 408 means no Judge worker started and no serving-ledger row was written. If the worker has already started, S5 must wait for completion and return the recorded answer rather than timing out the HTTP task while the worker thread continues writing in the background.
- Source KG context가 요청되면 resolve 여부가 `evidence.sourceCodeKg.resolved` 및 fallback trace로 명시되어야 한다.
- Source KG context가 redacted/truncated projection diagnostics를 포함하면 Judge는 이를 silent success로 취급하지 않는다. `SOURCE_KG_CONTEXT_REDACTED`/`SOURCE_KG_CONTEXT_TRUNCATED` diagnostics는 `fallbackTrace`에 non-silent source context fallback을 만들고, otherwise-complete affected/not_affected answer도 `status=degraded_quality`, `qualityGate.gate=accepted_with_caveats`, `uncertainty.requiredInputs[]=complete_or_consistent_source_code_kg_context`로 노출한다.
- Judge answer validation rejects corrupted Source KG nested-object redaction projections with `SOURCE_KG_NESTED_OBJECT_REDACTION_INVALID` when an over-limit nested object is still present, redaction/truncation flags are missing, or byte-length/max-inline metadata is inconsistent.
- Judge answer validation rejects corrupted Source KG URL redaction projections with `SOURCE_KG_URL_REDACTION_INVALID` when credential-bearing `repositorySnapshot.repositoryUrl`, `sourceArtifacts[].artifactUri`, `richIrArtifacts[].uri`, or credential-bearing URL string values/keys inside validated nested Source KG object fields appear unredacted in Judge evidence; validator issue payload IDs are URL-redacted recursively before echo; small nested object string values/keys are redacted during Source KG serving projection before Judge evidence assembly; raw ledger URL values remain stored for replay but cannot leak through routine answer packets.
- Judge answer validation rejects corrupted compile-commands source artifact context with `SOURCE_KG_COMPILE_COMMANDS_ARTIFACT_CONTEXT_INVALID` when `buildContext.compileCommandsArtifactId` is not present in served `sourceArtifacts[]`, lacks `contextResolution.sourceArtifacts`, is not resolved there, is marked missing, or is malformed/non-string (`compile_commands_artifact_id_invalid`).
- Judge answer validation rejects corrupted Source KG context-resolution accounting with `SOURCE_KG_CONTEXT_RESOLUTION_INVALID` when served `repositorySnapshot`, `buildContext`, `analysisArtifactSet`, `sourceArtifacts`, `graphNodes`, `evidenceSnippets`, or `richIrArtifacts` IDs disagree with `contextResolution` resolved IDs; issues expose only safe IDs/reasons, not source URLs, snippets, payloads, or metadata.
- Judge context-resolution validation also rejects malformed `requestedId`/`requestedIds`/`resolvedId`/`resolvedIds`/`missingIds` shapes using the frozen reason taxonomy (`requested_id_invalid`, `requested_ids_invalid`, `resolved_id_invalid`, `resolved_ids_invalid`, `missing_ids_invalid`) so corrupted packets produce validator issues rather than silent acceptance or exceptions.
- Judge context-resolution validator issue payloads redact credential-bearing URL-like IDs before echoing `servedIds`/`resolvedIds`, so forged `contextResolution` strings cannot leak userinfo or sensitive query parameters through validation diagnostics.
- Judge Source KG validator diagnostics apply the same safe payload rule to rich-IR payload redaction, snippet truncation, URL redaction, compile-commands artifact validation, context-resolution integrity, and nested-object redaction issue families; strings inside dict/list diagnostic ID payloads are redacted recursively and oversized strings/containers are summarized before echo.
- Judge `sourceContext.graphNodeIds`, `sourceContext.evidenceSnippetIds`, and `sourceContext.richIrArtifactIds` use the same explicit selector count and 512-char value caps as direct Source KG context. Over-limit Judge requests are rejected before ledger lookup with `errorDetail.reason=explicit_selector_limit_exceeded` or `selector_value_too_long`, preventing large SQL placeholder expansion, huge missing-id echoes, and serving-ledger persistence of oversized selector material.
- 일부 Source KG ID만 resolve되면 `evidence.sourceCodeKg.contextResolution.partial=true`, `missingIds[]`, `SOURCE_KG_CONTEXT_PARTIAL` diagnostic, `fallbackTrace[].fallback=\"partial_context_resolution\"`이 함께 노출되어야 한다.
- Source KG context가 요청됐지만 unresolved/partial/inconsistent/truncated이면, affectedness evidence가 `affected` 또는 `not_affected` verdict를 지지하더라도 `status=complete`가 아니라 `status=degraded_quality`를 반환한다. 이때 `uncertainty.requiredInputs`는 `complete_or_consistent_source_code_kg_context`를 포함하고 `followUpAffordances[].requestKind=source_context_enrichment`를 노출한다.
- `controls.topK`는 Threat Retrieval `candidateEvidence` final returned count만 제한한다. S5 preserves the raw requested value in `appliedControls.requested.topK` and `retrievalTrace.topKPolicy.requestedTopK`, but the accepted/canonical control value is the final clamped topK (`acceptedControlTopK`, currently max 50). Therefore over-cap requests such as 999 and 1000 share the same canonical query/decision-fragment identity instead of fragmenting cache rows for equivalent final responses. Affectedness verdict, identity resolution, affectedness evidence, and S3 final authority are not changed by topK.
- Invalid or unsupported control values remain visible enough for debugging but are bounded. Oversized control strings, including invalid `controls.topK`, `exclude[]`, `prefer[]`, nested `forceContext` values/keys, `answerMode`, and unknown control names, are rejected/redacted in `appliedControls` and serving-ledger request/answer packets instead of echoing raw user input. Unsupported/unknown control values with many small list/object items or byte-heavy but item-count-compliant objects are summarized with `reason=control_object_too_large` instead of echoing all values.
- `controls.exclude` and `controls.prefer` each accept at most 128 items. Over-limit lists are rejected at request validation with `errorDetail.reason=control_list_too_long` before Judge ledger lookup or `serving_query_run` persistence, preventing cardinality-based response/cache-key/ledger bloat from many small values.
- `controls.forceContext` is also bounded against many-small-value bloat. Root object keys are capped at 128, recursive object/list items at 512, sanitized echo JSON bytes at 16384, and nesting depth at 8. Over-budget forceContext requests are rejected at request validation with `errorDetail.reason=control_object_too_large` before Judge ledger lookup or `serving_query_run` persistence. Large individual strings remain handled by the existing `control_value_too_long` redaction path so raw oversized values are not echoed.
- Threat Retrieval distinguishes the full usable candidate set from the bounded internal rerank pool. `retrievalTrace.candidateSetTotalCount`, `candidateSetSize`, `candidatePoolSize`, `candidatePoolTruncated`, and `candidatePoolTruncationReason=candidate_pool_k_cap` expose when more candidates existed than the deterministic internal pool could carry.
- Judge Threat Retrieval traces include the Phase-8 runtime trace parity fields expected by analysis consumers: `methodsSucceeded`, `filtersApplied`, `matchedTerms`, `relationMethods`, `embeddingScope`, `profileBoostsApplied`, `projectionState`, and `providerState`. Ledger-backed Judge Threat Retrieval uses `embeddingScope=none` and `projectionState/providerState={state:not_applicable,surface:ledger_threat_retrieval}` unless a future runtime projection/provider path is explicitly introduced.
- Threat Retrieval uses normalized component identifiers plus security-identifier canonical `questionTerms` (`CVE`, `GHSA`, `OSV`, `CWE`, `CAPEC`) as conservative keyword discovery terms. Free-form question words are not discovery terms. `keyword_match` candidates may enrich unknown/requery answers even without package/affectedness matches, but matching is fielded and exact: advisory/security IDs match advisory identifiers, aliases, CWE/CAPEC-style taxonomy fields, and package/component terms match package identity fields such as `packageName`, `packageIdentityId`, `purl`, `cpe`, or `repoUrl`. Raw payload JSON substring scans over summaries, descriptions, provenance, or collector notes are forbidden. Keyword matches remain `contextual_support_not_affectedness_proof`, set `keywordUsed=true`, and cannot become negative evidence or final affectedness proof.
- Missing-version grounded-unknown answers must not skip Threat Retrieval context assembly when normalized component identifiers or security-identifier question terms are available. They remain `verdict=unknown` with `component.version` in `requiredInputs`, but may include `evidence.threatRetrieval` keyword/package context for analyst navigation; this context has no affectedness authority.
- Threat Retrieval equivalent advisories are bounded both per candidate and per response. `retrievalTrace.equivalentAdvisoryResponseLimit=64`, `equivalentAdvisoryReturnedCount`, and `equivalentAdvisoryResponseTruncated` expose packet-level response budgeting so large topK requests cannot multiply equivalent advisory context without traceable truncation.
- Threat Retrieval risk signals are also response-budgeted. `retrievalTrace.riskSignalResponseLimit=32`, `riskSignalTotalCount`, `riskSignalReturnedCount`, and `riskSignalResponseTruncated` expose when prioritization signals were capped, preserving machine-readable uncertainty instead of silently omitting or dumping unbounded signal context.
- Exclude-heavy Threat Retrieval responses bound `suppressedCandidateEvidence` too. `retrievalTrace.suppressedCandidateResponseLimit=16`, `suppressedCandidateTotalCount`, `suppressedCandidateReturnedCount`, and `suppressedCandidateResponseTruncated` expose when suppressed rows were capped without letting excluded advisory context dominate the Judge packet.
- Threat Retrieval semantic expansions are bounded independently. `retrievalTrace.weaknessSemanticResponseLimit=32` and `attackSemanticResponseLimit=32`, with total/returned/truncated metadata for each, prevent `weaknessSemantics[]` and `attackSemantics[]` from expanding Judge packets without visible truncation.
- Decision-fragment cache entries are ledger- and revision-scoped. `cacheTrace.cacheScope=ledger`, `cacheScopeHash`, and `cacheRevisionHash` prevent in-process cached affectedness from crossing SQLite ledgers or surviving same-ledger KB revisions when the canonical `decisionFragmentKey` matches. `cacheRevisionHash` is computed from compact table revision summaries (`rowCount`, max timestamps/rowid) for the advertised revision tables rather than full table payload serialization, so Judge latency is not proportional to total KB row payload size. Missing-input grounded-unknown answers are not stored, but still expose the same ledger scope/revision trace fields for replay/debugging.
- relevant open relation/affectedness conflicts are visible in `uncertainty.conflicts` and mirrored into `qualityGate.diagnostics`; hard conflicts reject the Judge quality gate, soft conflicts caveat it. Conflict records are never negative evidence and never S3 final verdict authority.
- routine answer는 Source KG snippets/hash/line range/artifact id 중심으로 노출하며, full source artifact dump가 아니다.
- 위험 추론 금지: final security verdict, clean pass, accepted S3 claim, exploitability judgment, complete project safety.


#### 계약 버전

| 필드 | 값 |
|---|---|
| `knowledgeCoverageContractVersion` | `knowledge-coverage-v1` |
| `acquisitionReadinessContractVersion` | `acquisition-readiness-v1` |

#### Runtime / Offline / S3 final claim vocabulary 분리

| Layer | Owner | 허용 vocabulary | 금지/주의 |
|---|---|---|---|
| Runtime S5 acquisition | S5 | `candidate_returned`, `no_candidate_returned`, `candidate_count`, `method_used`/`methodsUsed`, `confidence`/`score`, `consumerPolicy`, `projectionState`, `providerState`, `retrievalTrace` | TP/FP/FN/Recall/Precision/NDCG/MRR를 runtime response truth로 쓰지 않는다 |
| Offline S5 quality evaluation | S5 test/harness | `true_positive`, `false_positive`, `false_negative`, `recall`, `precision`, `NDCG`, `MRR`, `Precision@k`, `Recall@k`, `NDCG@k` | runtime acquisition envelope와 혼동 금지 |
| Final claim quality | S3 | accepted/rejected/inconclusive/clean-pass/final evidence admissibility | S5는 final vulnerability/security verdict, clean pass, exploitability judgment를 제공하지 않는다 |

#### Provided / not-provided surface

S5 coverage contract는 최소 다음 surface를 제공 대상으로 선언한다:

- `weaknessTaxonomy`, `attackPatternMapping`, `mitigationKnowledge`
- `publicVulnerabilityKnowledge`, `cveCandidateEvaluation`, `cveDiscovery`, `versionRangeEvaluation`
- `semanticThreatRetrieval`, `semanticCodeRetrieval`, `structuralCodeProjection`, `dangerousCallerTraversal`
- `projectMemoryContext`, `providerFreshness`, `cacheFreshness`, `projectionState`

명시적 `not_provided` surface:

- `finalSecurityVerdict`
- `cleanPass`
- `runtimeBehavior`
- `exploitabilityJudgment`
- `completeProjectSafety`

#### Target-scoped readiness schema

각 readiness surface는 최소 다음 필드를 가져야 한다:

```text
scope
requiredInputs[]
missingInputs[]
providerState
projectionState
methodsRequiredForNoHit[]
methodsAttempted[]
methodsSucceeded[]
fallbackPolicy
retryGuidance
diagnostics[]
```

#### EvidenceCatalog-safe consumer policy mapping

| `consumerPolicy` | S3 evidence role | Claim support 가능 여부 | Negative evidence 가능 여부 |
|---|---|---|---|
| `s3_may_derive_local_support_if_refs_validate` | derived-local candidate only | S3가 source local refs를 검증한 뒤에만 가능 | false |
| `contextual_only` | knowledge context only | false | false |
| `scoped_no_hit_record_only` | scoped acquisition record only | false | scoped no-hit record일 뿐 clean pass/안전 증거 아님 |
| `diagnostic_only` | operational diagnostic only | false | false |
| `do_not_use` | invalid for evidence | false | false |
| `do_not_use_as_negative_evidence` | diagnostic or contextual only | false | false |

#### CVE candidate evaluation vs discovery split

| Surface | 질문 | 핵심 rule |
|---|---|---|
| `cveCandidateEvaluation` | 특정 candidate CVE가 이 library/version/scope에 해당하는가? | `version_match=false`는 해당 candidate CVE의 scoped range-out일 뿐 library safety가 아니다 |
| `cveDiscovery` | 이 library/version/scope에 public vulnerability candidate가 존재하는가? | candidate range-out과 다른 CVE discovery hit는 공존 가능하다 |

2026-05-11 G008부터 target-scoped runtime endpoint가 split을 구현한다.

```http
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve-candidate-evaluation
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve-discovery
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve   # compatibility; surface remains "cve"
```

Candidate evaluation request accepts `candidateCveId`/`candidateCve`/`cveId` plus one explicit `library` or exactly one library resolved from the target context. Candidate range-out (`version_match=false`) may produce `completed_no_hit` only when the candidate CVE is explicitly returned and range-evaluated under precise methods; it includes forbidden inferences (`library_safe`, `no_other_cves`, `target_clean`, `complete_project_safety`) so S3 cannot treat it as library safety. Candidate-not-returned, keyword-only miss, `version_match=null`, timeout/error/stale cache, and conflicting version evidence remain diagnostic/incomplete and cannot become negative evidence.

Discovery asks for public vulnerability candidates for the library/version/scope. Discovery may return `completed_hit` even when the original candidate was range-out; this lets S3 reject the specific candidate while preserving other public vulnerability context.

Method completeness is conservative: `repoUrl+commit` may require `osv_commit+nvd_cpe`, `repoUrl` may require `nvd_cpe`, and name/version-only `nvd_keyword` is observation-only and forbidden as a no-hit basis. Candidate-scoped no-hit additionally requires `exact_id_match` and `provider_range_eval`. Candidate/discovery/compatibility target-scoped calls persist linked `acquisition_run`, `acquisition_item`, and `provider_observation` rows in the S5 SQLite ledger when a ledger repository is available.

#### Typed GraphRAG retrievalTrace v1 (G009)

G009 adds typed retrieval controls and trace metadata to threat/code GraphRAG surfaces. Fields are additive and existing callers may omit them.

Additive request fields:

| Field aliases | Type | Default | Meaning |
|---|---|---|---|
| `queryIntent` / `query_intent` | string | `weakness_context` for threat search; `code_context` for code search | Typed retrieval intent. `domain_profile_context` is normalized to `profile_context`; `consumer_policy_example` remains fixture/report-compatible. |
| `corpusPartitions` / `corpus_partitions` | string[] | intent defaults | Canonical corpus partitions such as `weakness_taxonomy`, `public_vulnerability`, `tool_rule`, `package_identity`, `specialization_profile`, `code_graph`, `contract_policy`. |
| `profiles` | string[] | `[]` | Context-only specialization/profile boosts. |
| `allowGlobalEmbedding` / `allow_global_embedding` | boolean | `false` for typed/constrained calls; compatibility global fallback only when no typed partition/source filter is supplied | Whether global embedding search may run. Global embedding is visible and low-trust; it is never a no-hit basis. |

`retrievalTrace` response schema:

```json
{
  "queryIntent": "weakness_context",
  "corpusPartitionsSearched": ["weakness_taxonomy"],
  "candidateSetSize": 7,
  "candidatePoolSize": 24,
  "returnedCount": 5,
  "candidatePoolPolicy": {"name": "s5-candidate-pool-policy-v1", "candidatePoolK": 24},
  "topKPolicy": {"name": "s5-top-k-policy-v1", "finalTopK": 5, "topKMeans": "final_returned_count"},
  "rerankerPolicy": {"name": "s5-deterministic-method-aware-reranker", "modelBacked": false, "negativeEvidenceAllowed": false},
  "modelPolicy": {"name": "s5-default-model-policy-v1", "mandatoryNewDependency": false},
  "methodsUsed": ["exact_id_match", "graph_expansion"],
  "methodsAttempted": ["exact_id_match", "graph_expansion", "constrained_embedding_rerank"],
  "methodsSucceeded": ["exact_id_match", "graph_expansion"],
  "filtersApplied": [{"field": "corpusPartition", "values": ["weakness_taxonomy"]}],
  "rerankersApplied": ["method_trust", "rrf"],
  "embeddingUsed": true,
  "embeddingScope": "constrained",
  "keywordUsed": false,
  "matchedTerms": ["CWE-78"],
  "lexicalSignals": [],
  "relationMethods": ["exact_id_match", "graph_expansion"],
  "profileBoostsApplied": [],
  "projectionState": {"state": "ready"},
  "providerState": {"state": "not_applicable"},
  "fallbackTrace": [],
  "topK": 5,
  "minScore": 0.35,
  "graphDepth": 2,
  "thresholds": {"minScore": 0.35, "topK": 5, "candidatePoolK": 24},
  "globalEmbeddingPolicy": {"allowed": false, "trust": "low", "negativeEvidenceAllowed": false}
}
```


RetrievalPolicy v1 additions:

| Field | Meaning | Consumer rule |
|---|---|---|
| `candidatePoolSize` | Internal candidate breadth before final truncation | Larger than `topK` by design; not returned-hit count. |
| `candidatePoolPolicy` | Policy/reason for internal pool sizing | Use for diagnostics and reproducibility. |
| `topKPolicy` | Clarifies `topK` as final returned count | Do not infer search exhaustiveness from `topK`. |
| `rerankerPolicy` | Deterministic/model-backed reranker disclosure | Current default is deterministic and not model-backed. Judge ordering includes an `affectedness_evidence` tier above contextual package/risk evidence. |
| `modelPolicy` | Embedding/reranker default and migration disclosure | Current default adds no mandatory dependency/re-index. |
| `lexicalSignals` | Weak C/C++ lexical/context signals | Candidate/ranking context only; miss is not no-hit proof. |
| `hits[].scoreBreakdown` / `hits[].ranking.scoreBreakdown` | Base score, method weight, lexical/profile boosts, final rerank score | Debug ranking; not vulnerability truth. |

Corpus partition canonical names and aliases:

| queryIntent | canonical partition | accepted aliases | legacy fallback |
|---|---|---|---|
| `weakness_context` | `weakness_taxonomy` | `weakness` | `source=CWE` |
| `attack_pattern_context` | `attack_pattern` | `capec_attack`, `attack` | `source=CAPEC/ATT&CK` |
| `mitigation_context` | `mitigation_knowledge` | `mitigation` | source fallback only if payload has mitigation source |
| `tool_rule_mapping` | `tool_rule` | `tool_rule_mapping` | tool-rule payload/source |
| `package_identity_resolution` | `package_identity` | `package` | package payload/source |
| `candidate_cve_evaluation`, `cve_discovery` | `public_vulnerability` | `public_vulnerability_knowledge`, `cve` | `source=CVE` |
| `profile_context` | `specialization_profile` | `domain_profile_context`, `profile` | profile payload/source |
| `code_context` | `code_graph` | `structural_code_projection` | code graph service |
| `consumer_policy_example` | `contract_policy` | `evidence_policy` | fixture/report only |

Runtime search traces must not expose offline quality vocabulary as result truth. Offline metrics remain under Golden Set `qualityGate` only.

#### Completed no-hit guard

`completed_no_hit`는 다음 조건이 모두 성립할 때만 유효하다:

1. target context가 resolve됨;
2. 명시적이고 안정적인 `scope`가 있음;
3. `methodsRequiredForNoHit[]`가 비어 있지 않음;
4. required methods가 모두 attempted/succeeded;
5. provider state가 timeout/error/unavailable/stale-cache-only가 아님;
6. projection state가 failed/stale/debt/partial이 아님;
7. keyword-only 또는 embedding-only no-result가 근거가 아님;
8. `consumerPolicy=scoped_no_hit_record_only`.

이 조건을 만족하지 못한 `completed_no_hit`는 runtime에서 `incomplete_acquisition` + `do_not_use_as_negative_evidence`로 downgraded되어야 한다.


### 2026-05-11 Analyst Brief v1 — S5 human-readable advisory layer

S5는 acquisition envelope와 Judge answer packet을 그대로 던지는 것만으로는 S3/S4가 안전하게 소비하기 어렵다는 문제를 줄이기 위해 deterministic analyst brief를 제공한다.

```http
POST /v1/analyst-brief
GET /v1/contracts/analyst-brief
```

이 endpoint는 live GraphRAG 검색, CVE provider 조회, code graph 적재를 수행하지 않는다. 입력 artifact를 사람이 읽을 수 있는 S3용 해석/행동 가이드로 변환하는 순수 contract helper다. `schemaVersion=s5-judge-answer-v1` artifact도 허용하며, Judge의 `affected/not_affected/unknown` verdict를 S3 final security verdict가 아니라 `judge_verdict_context_only` 소비 정책으로 번역한다. `GET /v1/contracts/analyst-brief`는 이 소비 정책을 기계 판독 가능하게 노출한다.

#### 요청

```json
{
  "artifact": {
    "schemaVersion": "acquisition-envelope-v1",
    "surface": "threat-search",
    "acquisitionStatus": "completed_hit",
    "acquisitionQualityGate": "accepted",
    "consumerPolicy": "contextual_only"
  },
  "audience": "s3",
  "language": "ko"
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---:|---:|---|
| `artifact` | object | 필수 | `AcquisitionEnvelopeV1`, target-scoped acquisition response, 또는 `s5-judge-answer-v1` Judge answer packet. malformed/empty artifact는 `blocked` brief로 변환된다. |
| `audience` | string | 선택 | 현재 v1은 `s3`만 허용한다. selector length is capped at 32 chars; unsupported/oversized values are rejected without echoing raw input. |
| `language` | string | 선택 | `ko` 또는 `en`. 기본값은 `ko`. selector length is capped at 32 chars; unsupported/oversized values are rejected without echoing raw input. |

#### 응답

```json
{
  "schemaVersion": "s5-analyst-brief-v1",
  "audience": "s3",
  "language": "ko",
  "stance": "contextual",
  "headline": "S5는 관련 지식 맥락을 찾았지만, 이것은 S3의 최종 증거 판정이 아닙니다.",
  "plainLanguageSummary": "이 결과는 S3가 분석 설명을 풍부하게 만드는 데 쓸 수 있는 지식 맥락입니다.",
  "readinessNarrative": "acquisitionStatus=completed_hit, consumerPolicy=contextual_only",
  "whatS5Knows": [],
  "whatS5DoesNotKnow": [],
  "whyThisMattersForS3": [],
  "allowedUses": [],
  "forbiddenInferences": [],
  "nextActions": [],
  "qualityWarnings": [],
  "humanQuestions": [],
  "evidencePlacement": {
    "recommendedRole": "knowledge_context",
    "consumerPolicy": "contextual_only",
    "acquisitionStatus": "completed_hit",
    "acquisitionQualityGate": "accepted",
    "sourceEvidenceRefs": [],
    "derivedFromEvidenceRefs": [],
    "diagnosticCodes": []
  },
  "contractRefs": ["acquisition-envelope-v1", "knowledge-coverage-v1", "acquisition-readiness-v1"]
}
```

#### `stance` mapping

| `stance` | 의미 | S3 소비 규칙 |
|---|---|---|
| `contextual` | S5가 관련 지식/검색 맥락을 찾았다 | 지식 맥락으로만 사용. accepted claim 또는 final verdict로 승격 금지 |
| `local_support_candidate` | S5 결과가 local evidence 후보가 될 수 있다 | S3가 source/local refs를 검증한 뒤에만 derived local support로 승격 가능 |
| `scoped_negative_record` | 명시 scope에서 required methods를 완료한 no-hit 기록 | 해당 scope의 acquisition record일 뿐 clean pass/library safe/project safe가 아님 |
| `diagnostic` | provider/projection/timeout/stale/conflict/trace 문제로 소비가 제한된다 | retry/input/projection 복구 가이드로만 사용. 부재/안전 증거 아님 |
| `blocked` | artifact 또는 target input이 부족하다 | S5는 global/default fallback을 만들지 않는다. 부족한 입력을 보강해야 한다 |

모든 brief는 baseline forbidden inference를 포함한다: S5 final security verdict, clean pass, accepted claim, exploitability judgment, complete project safety.

Acquisition envelope artifact가 입력되면 Analyst Brief는 `GET /v1/contracts/analyst-brief`의 `acquisitionArtifactPolicy`에 맞춰 diagnostic/missing-input echo를 제한한다. `diagnostics[].code` echo는 64개, code당 128 chars, warning preview 8개로 제한되며 `<redacted-acquisition-diagnostic-code:original_length>`, `qualityWarnings[]=acquisition_diagnostic_code_value_redacted`, `qualityWarnings[]=acquisition_diagnostic_codes_truncated`, `evidencePlacement.diagnosticCodeTotalCount/ReturnedCount/Truncated`로 redaction/truncation을 표시한다. `readiness.missingInputs`/`results.missingFields` echo는 16개, 입력당 128 chars로 제한되며 `<redacted-acquisition-required-input:original_length>`, `qualityWarnings[]=acquisition_required_input_value_redacted`, `qualityWarnings[]=acquisition_required_inputs_truncated`, `evidencePlacement.requiredInputTotalCount/ReturnedCount/Truncated`로 표시한다. `sourceEvidenceRefs`와 `derivedFromEvidenceRefs`도 각 field별 64개, ref당 512 chars로 제한되며 `<redacted-acquisition-evidence-ref:original_length>`, `qualityWarnings[]=acquisition_evidence_ref_value_redacted`, `qualityWarnings[]=acquisition_source_evidence_refs_truncated`, `qualityWarnings[]=acquisition_derived_evidence_refs_truncated`, source/derived total/returned/truncated count metadata를 노출한다. Top-level identity echoes(`surface`, `targetKnowledgeId`, `acquisitionStatus`, `acquisitionQualityGate`, `consumerPolicy`) are capped at 128 chars with `<redacted-acquisition-identity:original_length>` and `qualityWarnings[]=acquisition_identity_value_redacted`. Provider/projection state echoes(`providerState.state`, `projectionState.state`) are capped at 128 chars with `<redacted-acquisition-state:original_length>` and `qualityWarnings[]=acquisition_state_value_redacted`; method-list echoes(`methodsSucceeded`, `methodsRequiredForNoHit`) are capped at 32 entries and 128 chars per method with `<redacted-acquisition-method:original_length>`, `qualityWarnings[]=acquisition_method_value_redacted`, and `qualityWarnings[]=acquisition_methods_truncated`. Scope-provided forbidden inference echoes(`scope.forbiddenInferences`) are capped at 32 entries and 128 chars per entry with `<redacted-acquisition-scope-forbidden-inference:original_length>`, `qualityWarnings[]=acquisition_scope_forbidden_inference_value_redacted`, and `qualityWarnings[]=acquisition_scope_forbidden_inferences_truncated`; baseline S5 forbidden inferences remain always present. 이 제한은 generic acquisition artifact가 S3-facing brief를 비대화하거나 raw selector/secret-like 값을 누출하는 것을 막는다.

Judge answer artifact가 입력되면 Analyst Brief는 다음을 추가로 보장하며, 같은 내용은 `GET /v1/contracts/analyst-brief`의 `judgeAnswerArtifactPolicy`에도 노출된다:

- `evidencePlacement.consumerPolicy=judge_verdict_context_only`로 고정한다.
- `contractRefs`에 `s5-judge-answer-v1` 및 `s5-judge-contract-v1`을 포함한다.
- `notFinalSecurityVerdict=true`와 `verdictAuthority=s5_evidence_grounded_knowledge_verdict_not_s3_final_security_verdict`가 없으면 `blocked`/`do_not_use`로 번역하고 `send_valid_judge_answer` action을 낸다.
- `verdict=affected` + `status=complete` + accepted gate도 `contextual` knowledge context일 뿐 accepted claim/final verdict가 아니다.
- `verdict=not_affected`도 `s5_clean_pass`, `target_safe`, `complete_project_safety`로 승격할 수 없다.
- `status=requires_requery|degraded_quality|unknown`, missing `status`, `verdict=unknown`, unsupported/reserved verdict vocabulary such as `conflicting`, unsupported status/quality-gate vocabulary, required inputs, follow-up affordances, conflicts, or caveated/rejected quality gate는 `diagnostic`으로 번역하고 missing-input/requery/follow-up action을 노출한다. `verdict=unknown`은 `absence_of_vulnerability`와 `negative_absence_claim`도 금지한다.
- Judge scalar echoes(`verdict`, `status`, `qualityGate.gate`) are capped at 128 chars with `<redacted-judge-answer-scalar:original_length>` and `qualityWarnings[]=judge_answer_scalar_value_redacted`; redacted or otherwise unsupported scalar vocabulary cannot produce contextual authority and instead yields static unsupported warnings such as `unsupported_judge_verdict`, `unsupported_judge_status`, or `unsupported_judge_quality_gate`.
- Source KG refs가 포함되면 `validate_source_evidence_refs` action과 `evidencePlacement.sourceEvidenceRefs`를 통해 S3가 local/source refs를 직접 검증하도록 요구한다. Source artifact refs include canonical `sourceRepositoryArtifactId` as well as legacy/derived artifact id aliases. `sourceEvidenceRefs` echo is capped at 64 refs and each ref echo is capped at 512 chars with `<redacted-source-ref:original_length>` redaction after raw-ref dedupe/counting, so same-length oversized refs do not collapse before total/returned/truncated accounting; truncation is visible through `qualityWarnings[]=source_evidence_refs_truncated`, `evidencePlacement.sourceEvidenceRefTotalCount`, `sourceEvidenceRefReturnedCount`, and `sourceEvidenceRefsTruncated`, and the validation action remains present.
- Diagnostic code echo is capped at 64 codes and 128 chars per code, and the human-readable diagnostic warning previews only 8 returned codes, with `<redacted-diagnostic-code:original_length>`, `qualityWarnings[]=diagnostic_code_value_redacted`, `qualityWarnings[]=diagnostic_codes_truncated`, and `evidencePlacement.diagnosticCodeTotalCount/ReturnedCount/Truncated` counters. Judge required-input echoes are capped at 16 inputs and 128 chars per input with `<redacted-required-input:original_length>`, `qualityWarnings[]=required_input_value_redacted`, `qualityWarnings[]=required_inputs_truncated`, and `evidencePlacement.requiredInputTotalCount/ReturnedCount/Truncated` counters, so malformed Judge diagnostics/required inputs cannot bloat or leak through Analyst Brief.
- Judge `followUpAffordances[]` child fields are presence-only in Analyst Brief: raw `requestKind`, `ownerLane`, and `reason` values are not echoed into `nextActions`, `qualityWarnings`, `humanQuestions`, or `evidencePlacement`. Presence still yields `actionType=follow_judge_affordance` and the static warning `Judge follow-up affordances are present and should be routed before promotion.`; `GET /v1/contracts/analyst-brief` exposes this as `followUpEchoPolicy.rawFieldsEchoed=false` and `presenceOnly=true`. Judge `uncertainty.conflicts[]` child fields are also presence-only/non-echoed; contract exposes `conflictEchoPolicy.rawFieldsEchoed=false` and `presenceOnly=true` with the static conflict warning.
- Contract drift guard: `judgeAnswerArtifactPolicy.requiredBoundary`, `boundaryFailure`, `verdictMapping`, `diagnosticTriggers`, `scalarEchoPolicy`, `diagnosticCodeEchoPolicy` including `warningPreviewCount=8`, `requiredInputEchoPolicy`, `followUpEchoPolicy`, `conflictEchoPolicy`, `sourceRefExtraction` including `maxEchoRefs=64`, `maxRefEchoChars=512`, `oversizedRefRedaction=<redacted-source-ref:original_length>`, `truncationWarning=source_evidence_refs_truncated`, `valueRedactionWarning=source_evidence_ref_value_redacted`, count fields for total/returned/truncated refs, `baselineForbiddenInferences`, `negativeEvidenceAllowed=false`, `s3FinalAuthorityBoundary=true` are frozen by `tests/test_analyst_brief_v1.py`.

`contractRefs`는 API/source evidence가 아니라 이 brief를 해석할 때 적용된 S5 contract vocabulary다. 실제 증적 연결은 `evidencePlacement.sourceEvidenceRefs`와 `evidencePlacement.derivedFromEvidenceRefs`만 사용한다.

Analyst Brief selector validation is non-echoing: unsupported or oversized `audience`/`language` values return the standard S5 error envelope with a bounded message/reason and do not include raw selector text.

### 2026-04-04 / 2026-04-14 마이그레이션 노트

- threat search는 더 이상 Neo4j 없는 degraded vector-only 경로를 지원하지 않는다. `POST /v1/search`, `POST /v1/search/batch`, `GET /v1/ready`는 모두 Neo4j availability와 정렬된다.
- code graph / project memory provenance 필드(`buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId`)는 **additive seam**이다. 기존 caller는 그대로 동작하고, provenance-aware caller만 선택적으로 사용하면 된다.
- `POST /v1/code-graph/{project_id}/ingest`는 Quick-stage caller가 직접 재호출할 수 있는 **repeatable replace surface**다. 응답의 `operation` + `status` + `readiness`가 overwrite/partial/ready semantics의 authoritative contract다.
- 2026-04-14부터 모든 `X-Timeout-Ms` 적용 POST 경로는 실제 남은 데드라인을 강제한다. 헤더는 더 이상 형식 검사용이 아니며, stage/activation 중 데드라인을 넘기면 `408 TIMEOUT`을 반환한다.
- 2026-04-14부터 code graph ingest는 **staged commit**으로 동작한다. Neo4j/Qdrant에 임시 project scope로 staging 후 둘 다 준비되면 활성 project로 승격하며, timeout/activation 실패 시 기존 active graph/vector를 복원하거나 이전 상태가 없으면 partial write를 제거한다.
- 2026-04-14부터 code GraphRAG bootstrap은 `threat_knowledge` 컬렉션 존재 여부와 분리된다. 위협 search는 `threat_knowledge` + Neo4j를 요구하지만, code GraphRAG는 동일 Qdrant client의 `code_functions` 컬렉션만으로 초기화될 수 있다.


### 2026-05-08 Health-control v2 current-state boundary

이 절은 `health-control-signal-rollout-v2` 후속 WR에 대한 **S5 계획/계약 정리**다. 현재 S5 구현은 아직 durable async ownership/status/result/cancel surface를 제공하지 않는다. 따라서 이 절은 “v2 구현 완료”가 아니라, 현재 finite HTTP 계약과 향후 v2 vocabulary를 소비자가 오해하지 않도록 분리하는 compatibility contract다.

현재 공통 경계:

- `GET /v1/health`는 liveness-only다. `requestSummary`, `activeRequestCount`, `localAckState`를 아직 반환하지 않는다.
- `GET /v1/ready`는 전역 readiness다. 특정 ingest/search/CVE 요청의 ownership 상태가 아니다. Global ready requires Qdrant, Neo4j, and the S5 SQLite ledger injected for Source KG/Judge surfaces; if the ledger repository is unavailable, `/ready` returns `503 KB_NOT_READY` rather than letting callers proceed into Source KG/Judge 503s.
- `X-Timeout-Ms` 적용 POST는 finite request/response 모델이다. S5가 지정 데드라인을 넘기면 `408 TIMEOUT`을 반환하며, 이는 “지식/취약점/코드 경로가 없다”는 뜻이 아니다.
- `KB_NOT_READY`는 운영 readiness 실패다. 특히 threat search는 Qdrant와 Neo4j가 모두 필요하며, Neo4j 없는 vector-only degraded success로 폴백하지 않는다.
- 현재 S5는 `degraded=true`, `localAckState=phase-advancing|transport-only|ack-break`를 wire response로 내보내지 않는다. 아래 vocabulary의 `degraded`/ack fields는 v2 target semantics다.
- `POST /v1/code-graph/{project_id}/ingest`만 현재 장기 작업에 가까운 staged replace semantics를 갖는다. 이 endpoint도 durable status/result retrieval은 없지만, 응답의 `status`와 `readiness`가 완료 판정의 authoritative contract다.

#### Long-running operation mapping

| Surface | 현재 모델 | 장기 실행 위험 | 현재 not-ready / timeout / partial 의미 | v2 target requestSummary mapping | 결과/복구 seam | S2/S3 소비자 규칙 |
|---|---|---|---|---|---|---|
| `POST /v1/search` | finite response-owned threat GraphRAG search | Neo4j graph expansion + vector search가 커질 수 있음 | `503 KB_NOT_READY`는 Qdrant/Neo4j/assembler 미준비. `408 TIMEOUT`은 획득 실패. 성공한 `hits=[]`만 “해당 query에서 반환 hit 없음” | future: `running + phase-advancing` for vector/graph stages, `running + transport-only` when owned but progress proof unavailable, `failed + ack-break` for true local failure | 현재는 retained result 없음. 미래에는 requestId status/result 또는 명시적 response-owned retry model 필요 | `KB_NOT_READY`/`TIMEOUT` 때문에 knowledge가 없으면 `inconclusive`/diagnostic으로 기록한다. 이를 CWE/CAPEC/ATT&CK 부재 증거로 쓰지 않는다. |
| `POST /v1/search/batch` | finite response-owned batch search | 다중 query, graph expansion, dedup 비용 증가 | 일부 query별 partial success를 현재 별도 wire 상태로 표현하지 않는다. timeout은 batch 획득 실패 | future: batch item progress counters may be compact progress; terminal failure must identify unavailable batch result | 현재는 caller retry. 미래에는 batch requestId + item summary 또는 response-owned retry rule | batch timeout은 전체/일부 knowledge 미획득이다. “전체 query에 관련 지식 없음”으로 승격하지 않는다. |
| `POST /v1/code-graph/{project_id}/ingest` | staged commit + repeatable replace; response-owned | 대규모 함수 수, Neo4j staging, Qdrant vector ingest/activation | `408 TIMEOUT` 시 staging cleanup + 가능한 rollback. `status=ready`만 GraphRAG ready. `partial`은 Neo4j graph는 있으나 vector/GraphRAG 미완료. `empty`는 활성 함수 graph가 0개 | future: request-aware ingest summary should expose stage (`neo4j-stage`, `vector-stage`, `activate`, `cleanup`), `phase-advancing` on stage transition, `transport-only` while owned but no finer progress, `ack-break` on rollback/activation failure | 현재는 repeatable replace 재호출이 recovery seam. 미래에는 status/result retrieval 또는 resumable/durable ingest ownership 필요 | `partial`/timeout은 code GraphRAG 미획득 또는 불완전 맥락이다. `empty`도 caller가 비어 있지 않은 함수를 기대했다면 S4 extraction/input diagnostic이지 “위험 호출자 없음” 증거가 아니다. |
| `POST /v1/code-graph/{project_id}/search` | finite response-owned code GraphRAG search | vector + name exact + call chain expansion 비용 증가 | search service 미초기화는 503. timeout은 code context 획득 실패 | future: `phase-advancing` for exact/vector/graph expansion stages; `transport-only` only for owned long search without progress proof | 현재 retained result 없음; caller retry | timeout/503/partial index에서 missing code hit은 accepted claim 반증이 아니다. local source/SAST evidence와 분리해 diagnostic으로 둔다. |
| `POST /v1/code-graph/{project_id}/dangerous-callers` | finite response-owned graph query | 대형 call graph BFS/위험 API 목록 증가 | timeout은 caller-chain 획득 실패 | future: graph traversal progress counters may be compact progress; true traversal failure `ack-break` | 현재 retained result 없음; caller retry | timeout 결과를 “dangerous caller 없음”으로 해석하지 않는다. 성공 응답의 `results=[]`만 해당 입력 graph/query 기준 no result다. |
| `GET /v1/code-graph/{project_id}/stats`, `callers`, `callees`, `DELETE`, `GET /v1/code-graph` | finite simple graph operations | 현재는 일반적으로 짧음. 대형 graph에서는 callers/callees가 길어질 수 있음 | 현재 `X-Timeout-Ms` 대상 아님. service 미준비/404는 기존 HTTP error | future: 필요 시 request-aware summary 또는 pagination/status seam | 현재 response-owned | 실패/미준비는 operational diagnostic. 성공한 빈 list만 no result. |
| `POST /v1/cve/batch-lookup` | finite async lookup against OSV/NVD/EPSS/KEV with cache | 외부 API 지연, 20개 library batch, enrichment 비용 | `408 TIMEOUT`은 CVE enrichment 미획득. NVD client 미초기화는 503. `version_match=null`은 판정 불가 | future: item-level progress/degrade reasons (`external-api-slow`, `cache-only`, `version-unknown`), `transport-only` while owned external wait continues, `ack-break` for terminal client/config failure | 현재 cache + caller retry. 미래에는 requestId result retrieval or documented cache-only degraded result | timeout/503은 “CVE 없음”이 아니다. `version_match=false`만 범위 밖 신호이며, `null`은 안전 판정이 아니다. |
| `GET /v1/ready` | global readiness | readiness check itself is short | `503 KB_NOT_READY` means global S5 dependency not ready, not a request terminal state | future request-aware health should be separate or `GET /v1/health?requestId=...`; `/ready` remains coarse readiness | not a result channel | S2/S3 may gate calls on readiness, but should not use readiness failure as negative security evidence. |

#### Health-control vocabulary for S5 consumers

| Signal | Current S5 wire status | Meaning | Consumer interpretation |
|---|---:|---|---|
| `KB_NOT_READY` | live | Required S5 component is not initialized/connected for the requested surface. Retryable operational failure. | Record dependency diagnostic; do not infer no relevant KB/CVE/code evidence. |
| `TIMEOUT` | live | Caller-provided finite deadline elapsed before S5 completed the operation or stage. | Treat as acquisition timeout/inconclusive context. Retry or continue with explicit caveat; do not turn missing hits into negative evidence. |
| `status="ready"` on code ingest | live | Neo4j graph and vector index are complete enough for code GraphRAG. | Caller may proceed to GraphRAG-dependent stage. |
| `status="partial"` on code ingest | live | Active Neo4j graph exists but vector/GraphRAG readiness is incomplete. | Use only as degraded structural diagnostic if explicitly allowed; not full code GraphRAG readiness. |
| `status="empty"` on code ingest | live | Accepted ingest resulted in zero active functions. | If caller expected functions, treat as upstream extraction/input diagnostic. It is not by itself proof of no dangerous code path. |
| `degraded=true` | target only | Work may continue with reduced/partial capability. Degraded alone is not abort. | Continue/poll if no `ack-break`/`blockedReason`; mark output caveated. |
| `localAckState="phase-advancing"` | target only | S5 observed real local stage progress. | Continue waiting. |
| `localAckState="transport-only"` | target only | S5 still owns the request but cannot prove stronger progress. | Continue waiting unless blocked/failed/cancelled; do not mark success. |
| `localAckState="ack-break"` | target only | S5 observed a terminal local break in the operation. | Abort/chain failure as operational diagnostic; do not convert missing knowledge into clean/security-negative result. |

#### Minimum future v2 implementation seam

When S5 implements health-control v2 behavior, it should add either durable ownership or a clearly documented response-owned model for each long-running surface.

Minimum durable option:

- accept/correlate `X-Request-Id` or an S5-owned `requestId`;
- expose `GET /v1/health?requestId=...` with `activeRequestCount` and compact `requestSummary` fields from the v2 vocabulary;
- expose terminal status/result retrieval for operations whose original HTTP response may be interrupted; and
- expose explicit terminal failure/cancel/expiry semantics.

Minimum response-owned option:

- document that the original HTTP response is the only result channel;
- classify transport loss as terminal or retryable with a deterministic retry rule;
- ensure `/health` is only a suspicion/control side-channel and not a hidden result channel.

Until one of those options is implemented, S5 callers must treat the finite HTTP response as the only completion channel and must classify timeout/not-ready/degraded knowledge absence as operational diagnostic evidence, not security evidence.


### 에러 응답

모든 엔드포인트는 observability.md 준수 에러 포맷을 반환합니다.

```json
{
  "success": false,
  "error": "에러 요약 메시지",
  "errorDetail": {
    "code": "KB_NOT_READY",
    "message": "상세 설명",
    "requestId": "req-xxxx",
    "retryable": true
  }
}
```

| 에러 코드 | HTTP | 설명 |
|-----------|------|------|
| `KB_NOT_READY` | 503 | KB 또는 Neo4j 미초기화 |
| `NOT_FOUND` | 404 | 요청한 리소스 없음 |
| `BAD_REQUEST` | 400 | 필수 헤더 누락 (X-Timeout-Ms 등) |
| `INVALID_INPUT` | 422 | 요청 스키마 불일치 |
| `TIMEOUT` | 408 | 클라이언트 지정 데드라인 초과 |
| `CONFLICT` | 409 | 충돌 (중복, 한도 초과 등) |

### X-Timeout-Ms 권장값

아래 테이블에 나열된 POST 엔드포인트에서 `X-Timeout-Ms` 헤더가 필수입니다. 프로젝트 메모리 `POST /v1/project-memory/*`는 단순 Neo4j 쓰기이므로 적용 대상이 아닙니다. 서버는 실제 실행 경로에서 남은 데드라인을 강제하며, stage/activation 사이를 포함한 체크포인트에서 초과 시 408을 반환합니다.

| 엔드포인트 | 소규모 | 대규모 (~3,000함수/20쿼리) |
|-----------|--------|--------------------------|
| `POST /v1/search` | 10,000 | 10,000 |
| `POST /v1/search/batch` | 10,000 | 30,000 |
| `POST /v1/code-graph/*/ingest` | 15,000 | 90,000 |
| `POST /v1/code-graph/*/search` | 10,000 | 10,000 |
| `POST /v1/code-graph/*/dangerous-callers` | 10,000 | 10,000 |
| `POST /v1/cve/batch-lookup` | 30,000 | 30,000 |

---

## 위협 지식 검색

### POST /v1/search

하이브리드 검색: ID 직접 조회(Neo4j) + 그래프 이웃 확장 + 벡터 시맨틱 검색(Qdrant).

#### 요청

```json
{
  "query": "CWE-78 command injection popen",
  "top_k": 5,
  "min_score": 0.35,
  "graph_depth": 2,
  "source_filter": ["CWE"]
}
```

| 필드 | 타입 | 기본값 | 범위 | 설명 |
|------|------|--------|------|------|
| `query` | string | (필수) | - | 검색 쿼리. CWE-ID/CVE-ID/CAPEC-ID/ATT&CK ID 포함 시 자동 추출하여 정확 매칭 |
| `top_k` | int | 5 | 1~20 | 최대 반환 건수 (실제로는 top_k*2까지 반환 가능) |
| `min_score` | float | 0.35 | 0.0~1.0 | 벡터 검색 최소 유사도 |
| `graph_depth` | int | 2 | 0~5 | 그래프 이웃 탐색 깊이 |
| `exclude_ids` | array[string] | [] | 최대 100개 | 결과에서 제외할 노드 ID 목록 |
| `source_filter` | array[string]? | null | - | 소스 필터. `["CWE"]`, `["ATT&CK"]`, `["CAPEC"]` 등. null이면 전체 |

#### 응답 (정상)

```json
{
  "query": "CWE-78 command injection popen",
  "hits": [
    {
      "id": "CWE-78",
      "source": "CWE",
      "title": "Improper Neutralization of Special Elements used in an OS Command",
      "score": 1.0,
      "threat_category": "Injection",
      "match_type": "id_exact",
      "scoreBreakdown": {"baseScore": 1.0, "methodWeight": 100, "lexicalBoost": 0.0, "profileBoost": 0.0, "finalRerankScore": 101.0},
      "graph_relations": {
        "cve": ["CVE-2021-28372"],
        "capec": ["CAPEC-88"],
        "attack": ["T0807"]
      }
    },
    {
      "id": "CAPEC-88",
      "source": "CAPEC",
      "title": "OS Command Injection",
      "score": 0.8,
      "threat_category": "Injection",
      "match_type": "graph_neighbor",
      "graph_relations": {
        "cwe": ["CWE-78"]
      }
    },
    {
      "id": "CWE-77",
      "source": "CWE",
      "title": "Command Injection",
      "score": 0.72,
      "threat_category": "Injection",
      "match_type": "vector_semantic"
    }
  ],
  "total": 3,
  "extracted_ids": ["CWE-78"],
  "related_cwe": ["CWE-77", "CWE-78"],
  "related_cve": ["CVE-2021-28372"],
  "related_attack": ["T0807"],
  "retrievalTrace": {
    "topK": 5,
    "candidatePoolSize": 24,
    "topKPolicy": {"topKMeans": "final_returned_count"},
    "rerankerPolicy": {"modelBacked": false}
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `query` | string | 원본 쿼리 |
| `hits` | array | 검색 결과 목록 (점수 내림차순) |
| `hits[].id` | string | 위협 DB ID (CWE-78, CVE-2021-28372 등) |
| `hits[].source` | string | 소스: `"CWE"`, `"CVE"`, `"ATT&CK"`, `"CAPEC"` |
| `hits[].title` | string | 제목 |
| `hits[].score` | float | 점수. RRF 융합 점수 (기본) 또는 raw 점수 (RRF 비활성 시) |
| `hits[].threat_category` | string | 위협 분류 |
| `hits[].match_type` | string | `"id_exact"`, `"graph_neighbor"`, `"vector_semantic"` |
| `hits[].graph_relations` | object? | 그래프 관계 (있는 경우만). 키: `"cwe"`, `"cve"`, `"attack"`, `"capec"` |
| `total` | int | 총 hit 수 |
| `extracted_ids` | array[string] | 쿼리에서 추출된 ID 목록 |
| `related_cwe` | array[string] | 전체 hit에서 수집된 관련 CWE (정렬됨) |
| `related_cve` | array[string] | 전체 hit에서 수집된 관련 CVE (정렬됨) |
| `related_attack` | array[string] | 전체 hit에서 수집된 관련 ATT&CK (정렬됨) |
| `match_type_counts` | object | 매칭 타입별 건수 |
| `match_type_counts.id_exact` | int | ID 정확 매칭 건수 |
| `match_type_counts.graph_neighbor` | int | 그래프 이웃 건수 |
| `match_type_counts.vector_semantic` | int | 벡터 시맨틱 건수 |
| `retrievalTrace` | object | Typed retrieval/candidate-pool/model/reranker/lexical trace metadata |
| `hits[].scoreBreakdown` | object | Ranking score components |

#### 에러

| HTTP | 조건 | 응답 |
|------|------|------|
| 503 | Qdrant 또는 Neo4j 미초기화 | `{success: false, error: "Knowledge base not initialized", errorDetail: {code: "KB_NOT_READY", retryable: true}}` |

---

### POST /v1/search/batch

여러 검색 쿼리를 한 번에 실행. 쿼리 간 결과 중복을 자동 제거 (global dedup).

#### 요청

```json
{
  "queries": [
    {"query": "CWE-78", "top_k": 3, "min_score": 0.35},
    {"query": "CWE-120", "top_k": 3, "source_filter": ["CWE"]},
    {"query": "CWE-676", "top_k": 3}
  ]
}
```

| 필드 | 타입 | 기본값 | 범위 | 설명 |
|------|------|--------|------|------|
| `queries` | array | (필수) | 1~20개 | 배치 검색 쿼리 목록 |
| `queries[].query` | string | (필수) | - | 검색 쿼리 |
| `queries[].top_k` | int | 5 | 1~20 | 최대 반환 건수 |
| `queries[].min_score` | float | 0.35 | 0.0~1.0 | 최소 유사도 |
| `queries[].graph_depth` | int | 2 | 0~5 | 그래프 이웃 깊이 |
| `queries[].source_filter` | array[string]? | null | - | 소스 필터 |

#### 응답

```json
{
  "results": [
    {
      "query": "CWE-78",
      "hits": [...],
      "total": 5,
      "extracted_ids": ["CWE-78"],
      "related_cwe": [...],
      "related_cve": [...],
      "related_attack": [...],
      "match_type_counts": {"id_exact": 1, "graph_neighbor": 2, "vector_semantic": 2}
    },
    ...
  ],
  "global_stats": {
    "total_queries": 3,
    "total_hits": 12,
    "unique_ids": 12
  },
  "latency_ms": 2500
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `results` | array | 쿼리별 검색 결과 (각 항목은 `/v1/search` 응답과 동일 구조) |
| `global_stats.total_queries` | int | 쿼리 수 |
| `global_stats.total_hits` | int | 전체 hit 수 (중복 제거 후) |
| `global_stats.unique_ids` | int | 유니크 노드 ID 수 |
| `latency_ms` | int | 총 소요 시간 (ms) |

**중복 제거**: 이전 쿼리에서 반환된 노드 ID는 이후 쿼리 결과에서 자동 제외됨.

---

### GET /v1/graph/stats

위협 그래프 통계.

#### 응답 (정상)

```json
{
  "nodeCount": 2196,
  "edgeCount": 9298,
  "sources": {
    "CWE": 944,
    "CVE": 0,
    "Attack": 694,
    "CAPEC": 558
  },
  "edgeTypes": {
    "RELATED_CAPEC": 3210,
    "RELATED_ATTACK": 2845,
    "RELATED_CWE": 3243
  },
  "topConnected": [
    {
      "id": "CWE-119",
      "title": "Improper Restriction of Operations within the Bounds of a Memory Buffer",
      "label": "CWE",
      "degree": 142
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `nodeCount` | int | 위협 노드 총 수 (CWE+CVE+Attack+CAPEC) |
| `edgeCount` | int | 관계 총 수 |
| `sources` | object | 레이블별 노드 수. 키: `"CWE"`, `"CVE"`, `"Attack"`, `"CAPEC"` |
| `edgeTypes` | object | 관계 타입별 건수. 키: `"RELATED_CAPEC"`, `"RELATED_ATTACK"`, `"RELATED_CWE"` 등 |
| `topConnected` | array | degree 기준 상위 20개 노드 |
| `topConnected[].id` | string | 노드 ID |
| `topConnected[].title` | string | 제목 |
| `topConnected[].label` | string | 노드 레이블 |
| `topConnected[].degree` | int | 연결 수 |

#### 에러

| HTTP | 조건 | 응답 |
|------|------|------|
| 503 | Neo4j 미초기화 | `{success: false, error: "Graph not initialized", errorDetail: {code: "KB_NOT_READY", retryable: true}}` |

---

### GET /v1/graph/neighbors/{node_id}

특정 노드의 이웃 탐색.

#### 파라미터

| 이름 | 위치 | 타입 | 기본값 | 범위 | 설명 |
|------|------|------|--------|------|------|
| `node_id` | path | string | (필수) | - | 노드 ID (예: `CWE-78`) |
| `depth` | query | int | 2 | 1~5 | 탐색 깊이 |

#### 응답 (정상)

```json
{
  "nodeId": "CWE-78",
  "nodeInfo": {
    "id": "CWE-78",
    "title": "OS Command Injection",
    "source": "CWE",
    "threat_category": "Injection"
  },
  "neighbors": [
    {
      "id": "CVE-2021-28372",
      "title": "...",
      "source": "CVE"
    }
  ],
  "related": {
    "cve": ["CVE-2021-28372"],
    "capec": ["CAPEC-88"]
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `nodeId` | string | 요청한 노드 ID |
| `nodeInfo` | object | 노드 속성 |
| `neighbors` | array | 이웃 노드 목록 (최대 50건) |
| `related` | object | 관계 타입별 ID 목록. 키: `"cwe"`, `"cve"`, `"attack"`, `"capec"` |

#### 에러

| HTTP | 조건 | 응답 |
|------|------|------|
| 503 | Neo4j 미초기화 | `{success: false, error: "Graph not initialized", errorDetail: {code: "KB_NOT_READY", retryable: true}}` |
| 404 | `node_id`에 해당하는 노드 없음 | `{success: false, error: "Node 'XXX' not found", errorDetail: {code: "NOT_FOUND", retryable: false}}` |

---

## 코드 그래프

**공통 에러**: 모든 `/v1/code-graph/*` 엔드포인트는 Neo4j 미연결 시 **HTTP 503**을 반환합니다.

> **Provenance seam (2026-04-04)**: code graph는 선택적으로 `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId` 메타데이터를 수용한다. 현재는 **프로젝트당 활성 그래프 1개**를 유지하며 ingest 시 기존 project_id 그래프를 재생성한다. 즉 provenance는 현재 단계에서 **projection/filter seam**이며, 동일 프로젝트 내 다중 snapshot 동시 보존을 보장하지는 않는다.

```json
{
  "success": false,
  "error": "Code graph service not initialized",
  "errorDetail": {
    "code": "KB_NOT_READY",
    "message": "Code graph service not initialized",
    "requestId": "req-xxxx",
    "retryable": true
  }
}
```

### POST /v1/code-graph/{project_id}/ingest

SAST Runner의 함수 추출 결과를 받아 Neo4j에 코드 호출 그래프를 구축한다. **호출자가 repeatable replace를 요청하면, S5는 먼저 Neo4j/Qdrant staging scope에 새 graph를 적재하고 두 저장소가 모두 준비된 뒤에만 active project graph를 교체한다.** timeout/activation 실패 시 기존 active graph/vector를 복원하거나, 기존 상태가 없으면 partial write를 제거한다.

#### Quick-stage caller contract

- **Canonical ingest surface**: `POST /v1/code-graph/{project_id}/ingest`
- **최소 요청 shape**: `project_id` path + `functions[]` body + `X-Timeout-Ms` 헤더. `functions[]`의 각 항목은 최소 `name`, `file`, `line`, `calls[]`를 전달하는 것을 권장한다.
- **반복 호출 의미**: 같은 `project_id`로 재호출하면 기존 활성 그래프를 덮어쓴다. 응답의 `operation.replacedExistingGraph`가 실제 overwrite 여부를 알려준다. 내부적으로는 staging project scope를 거친 뒤 활성 graph/vector를 승격한다.
- **권위 있는 완료 판정**: 호출자는 ingest 응답에서 `status == "ready"` 그리고 `readiness.graphRag == true`를 확인했을 때만 다음 Quick-stage GraphRAG 단계를 "graph ready"로 취급해야 한다.
- **부분 성공 / 미준비 판정**: `status == "partial"`이면 Neo4j 그래프는 만들어졌지만 vector/GraphRAG 단계가 미완료다. `status == "empty"`이면 활성 함수 그래프가 비어 있으므로 다음 단계 ready로 취급하면 안 된다.

#### 요청

```json
{
  "functions": [
    {
      "name": "postJson",
      "file": "src/http_client.cpp",
      "line": 8,
      "calls": ["popen", "fgets"]
    },
    {
      "name": "curl_exec",
      "file": "third-party/libcurl/curl_exec.c",
      "line": 42,
      "calls": ["curl_multi_perform"],
      "origin": "modified-third-party",
      "originalLib": "libcurl",
      "originalVersion": "7.68.0"
    }
  ],
  "provenance": {
    "buildSnapshotId": "snap-re100-20260404",
    "buildUnitId": "re100-gateway",
    "sourceBuildAttemptId": "attempt-42"
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `functions` | array | (필수) 함수 목록 |
| `functions[].name` | string | 함수명 |
| `functions[].file` | string | 소스 파일 경로 |
| `functions[].line` | int | 정의 줄 번호 |
| `functions[].calls` | array[string] | 호출하는 함수명 목록 |
| `functions[].origin` | string? | 출처: `"third-party"` (원본), `"modified-third-party"` (수정됨). 없으면 프로젝트 코드 |
| `functions[].originalLib` | string? | 원본 라이브러리명. camelCase/snake_case 모두 수용 |
| `functions[].originalVersion` | string? | 원본 라이브러리 버전 |
| `provenance` | object? | 선택적 build snapshot provenance 메타데이터 |
| `provenance.buildSnapshotId` | string? | build snapshot ID |
| `provenance.buildUnitId` | string? | stable build unit ID |
| `provenance.sourceBuildAttemptId` | string? | source build attempt ID |

#### 응답

```json
{
  "project_id": "re100",
  "replaceMode": "replace_project_graph",
  "replacedExistingGraph": true,
  "nodeCount": 121,
  "edgeCount": 242,
  "files": ["src/http_client.cpp", "src/main.cpp"],
  "vectorCount": 121,
  "operation": {
    "mode": "replace_project_graph",
    "repeatable": true,
    "replacedExistingGraph": true
  },
  "readiness": {
    "neo4jGraph": true,
    "vectorIndex": true,
    "graphRag": true
  },
  "status": "ready",
  "provenance": {
    "buildSnapshotId": "snap-re100-20260404",
    "buildUnitId": "re100-gateway",
    "sourceBuildAttemptId": "attempt-42"
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `replaceMode` | string | 현재는 항상 `"replace_project_graph"`. 프로젝트당 활성 그래프 1개를 유지하는 replace semantics를 의미하며, 내부적으로는 staging 후 승격한다 |
| `replacedExistingGraph` | bool | ingest 직전에 같은 `project_id` 활성 그래프가 존재했는지 여부 |
| `vectorCount` | int | Qdrant에 벡터로 적재된 함수 수. 벡터 검색 미초기화 또는 벡터 적재 실패 시 `0` |
| `operation` | object | caller semantics 요약. `mode`, `repeatable`, `replacedExistingGraph`를 포함 |
| `readiness` | object | `neo4jGraph`, `vectorIndex`, `graphRag` 준비 상태 |
| `status` | string | `"ready"`, `"partial"`, `"empty"` 중 하나. Quick-stage caller는 `"ready"`만 다음 단계 완료로 취급 |
| `warnings` | array[string]? | 부분 성공/미준비 사유. 현재 `VECTOR_INDEX_INCOMPLETE`를 반환할 수 있음 |
| `provenance` | object? | ingest에 전달된 provenance projection |

---

### POST /v1/code-graph/{project_id}/search

코드 함수를 시맨틱 검색한다. 함수명 정확 매칭 + 벡터 유사도 + 호출 그래프 확장을 결합한 하이브리드 검색.

#### 요청

```json
{
  "query": "시스템 명령을 실행하는 네트워크 핸들러",
  "top_k": 10,
  "min_score": 0.3,
  "graph_depth": 2,
  "include_call_chain": true,
  "buildSnapshotId": "snap-re100-20260404"
}
```

| 필드 | 타입 | 기본값 | 범위 | 설명 |
|------|------|--------|------|------|
| `query` | string | (필수) | - | 자연어 검색 쿼리 또는 함수명 |
| `top_k` | int | 10 | 1~50 | 최대 반환 건수 |
| `min_score` | float | 0.3 | 0.0~1.0 | 최소 유사도 |
| `graph_depth` | int | 2 | 0~5 | 호출 체인 탐색 깊이 |
| `include_call_chain` | bool | true | - | 결과에 callers/callees 포함 |
| `buildSnapshotId` | string? | null | - | 선택적 snapshot provenance 필터 |

#### 응답

```json
{
  "query": "시스템 명령을 실행하는 네트워크 핸들러",
  "hits": [
    {
      "name": "postJson",
      "file": "src/http_client.cpp",
      "line": 8,
      "calls": ["popen", "fgets"],
      "origin": null,
      "original_lib": null,
      "original_version": null,
      "provenance": {
        "buildSnapshotId": "snap-re100-20260404",
        "buildUnitId": "re100-gateway",
        "sourceBuildAttemptId": "attempt-42"
      },
      "score": 0.032787,
      "match_type": "vector_semantic",
      "call_chain": {
        "callers": [{"name": "main", "file": "src/main.cpp", "line": 1}],
        "callees": [{"name": "popen", "file": null, "line": null}]
      }
    }
  ],
  "total": 3,
  "match_type_counts": {
    "name_exact": 0,
    "vector_semantic": 2,
    "graph_neighbor": 1
  },
  "provenance": {
    "buildSnapshotId": "snap-re100-20260404"
  },
  "latency_ms": 45
}
```

| `match_type` | 의미 |
|-------------|------|
| `name_exact` | 쿼리에 포함된 함수명이 Neo4j에서 정확 매칭 |
| `vector_semantic` | Qdrant 벡터 유사도 검색 |
| `graph_neighbor` | 매칭된 함수의 호출 체인에서 발견 |
| `hits[].provenance` | object? | 함수/호출 체인 메타데이터의 provenance projection |
| `provenance` | object? | 요청에 적용된 snapshot filter projection |

#### 에러

| HTTP | 조건 |
|------|------|
| 503 | Neo4j 또는 벡터 검색 미초기화 |

---

### GET /v1/code-graph/{project_id}/stats

프로젝트 코드 그래프 통계.

#### 응답

```json
{
  "nodeCount": 121,
  "edgeCount": 242,
  "files": ["src/http_client.cpp", "src/main.cpp"],
  "provenance": {"buildSnapshotId": "snap-re100-20260404"}
}
```

#### 파라미터

| 이름 | 위치 | 타입 | 기본값 | 범위 |
|------|------|------|--------|------|
| `buildSnapshotId` | query | string? | null | - |

---

### GET /v1/code-graph/{project_id}/callers/{function_name}

특정 함수를 호출하는 함수 체인 (역방향 BFS).

#### 파라미터

| 이름 | 위치 | 타입 | 기본값 | 범위 |
|------|------|------|--------|------|
| `project_id` | path | string | (필수) | - |
| `function_name` | path | string | (필수) | - |
| `depth` | query | int | 2 | 1~10 |
| `buildSnapshotId` | query | string? | null | - |

#### 응답

```json
{
  "function": "popen",
  "depth": 2,
  "callers": [
    {"name": "curl_exec", "file": "third-party/libcurl/curl_exec.c", "line": 42, "origin": "modified-third-party", "original_lib": "libcurl", "original_version": "7.68.0", "provenance": {"buildSnapshotId": "snap-re100-20260404"}},
    {"name": "postJson", "file": "src/http_client.cpp", "line": 8, "origin": null, "original_lib": null, "original_version": null, "provenance": {"buildSnapshotId": "snap-re100-20260404"}},
    {"name": "main", "file": "src/main.cpp", "line": 1, "origin": null, "original_lib": null, "original_version": null, "provenance": {"buildSnapshotId": "snap-re100-20260404"}}
  ]
}
```

`origin`/`original_lib`/`original_version`은 서드파티 함수에만 값이 있고, 프로젝트 코드 함수는 `null`.

---

### GET /v1/code-graph/{project_id}/callees/{function_name}

특정 함수가 호출하는 함수 목록.

#### 파라미터

| 이름 | 위치 | 타입 | 기본값 | 범위 |
|------|------|------|--------|------|
| `buildSnapshotId` | query | string? | null | - |

#### 응답

```json
{
  "function": "postJson",
  "callees": [
    {"name": "popen", "file": null, "line": null, "origin": null, "original_lib": null, "original_version": null, "provenance": {"buildSnapshotId": "snap-re100-20260404"}},
    {"name": "fgets", "file": null, "line": null, "origin": null, "original_lib": null, "original_version": null, "provenance": {"buildSnapshotId": "snap-re100-20260404"}}
  ]
}
```

---

### POST /v1/code-graph/{project_id}/dangerous-callers

위험 함수(system, popen 등)를 호출하는 사용자 코드 함수를 식별.

#### 요청

```json
{
  "dangerous_functions": ["popen", "system", "memcpy", "strcpy"],
  "buildSnapshotId": "snap-re100-20260404"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `dangerous_functions` | array[string] | (필수) 위험 함수 이름 목록 |
| `buildSnapshotId` | string? | 선택적 snapshot provenance 필터 |

#### 응답

```json
{
  "results": [
    {
      "name": "curl_exec",
      "file": "third-party/libcurl/curl_exec.c",
      "line": 42,
      "dangerous_calls": ["popen"],
      "origin": "modified-third-party",
      "original_lib": "libcurl",
      "original_version": "7.68.0",
      "provenance": {"buildSnapshotId": "snap-re100-20260404"}
    }
  ]
}
```

---

### DELETE /v1/code-graph/{project_id}

프로젝트 코드 그래프 삭제.

#### 응답

```json
{"deleted": true, "project_id": "re100"}
```

#### 에러

| HTTP | 조건 |
|------|------|
| 404 | 해당 프로젝트 없음 |
| 503 | Neo4j 미연결 |

---

### GET /v1/code-graph

등록된 프로젝트 목록.

#### 응답

```json
{"projects": ["re100", "sample-ecu"]}
```

---


## Source Code KG ingest v1 (ledger-only)

> 2026-05-12 추가. 이 surface는 S5-owned Source Code KG의 durable ledger 적재 계약이다. 기존 `/v1/code-graph/{project_id}/ingest`가 Neo4j/Qdrant code graph projection을 다루는 반면, 이 endpoint는 SQLite ledger에 repository snapshot, build context, analysis artifact set, source graph facts, evidence snippets, rich IR artifacts, and full/source artifact references를 보존한다.

```http
POST /v1/source-code-kg/ingest
```

### Contract boundary

- `X-Timeout-Ms` 필수. 누락 또는 0 이하이면 `400`.
- `X-Request-Id`는 선택이며 응답 헤더로 echo된다.
- 이 endpoint는 **ledger-only**다: 응답은 항상 `ledgerOnly=true`, `productionWrites={"neo4j": false, "qdrant": false}`를 선언해야 한다.
- 이 endpoint는 production Neo4j/Qdrant projection을 수행하지 않는다. Projection은 별도 quality-gated 단계다.
- S5가 producer contract를 소유한다. S3/S4는 이후 repository/build/source facts producer가 될 수 있으나, 이 contract 자체는 S5-owned API다.
- 같은 contract는 `GET /v1/contracts/source-code-kg`에서도 machine-readable snapshot으로 확인할 수 있다.
- S5는 이 endpoint의 결과를 Evidence-Grounded Judge가 Source KG facts by stable ID로 resolve할 수 있도록 저장한다.

### Request schema

```json
{
  "schemaVersion": "s5-source-code-kg-ingest-request-v1",
  "repositorySnapshot": {
    "repositoryUrl": "https://github.com/org/project.git",
    "repositoryId": "project-fixture-or-internal-id",
    "commitHash": "abcdef1234567890",
    "treeHash": "tree-hash-optional",
    "submoduleHashes": {"submodule/path": "submodule-commit"},
    "metadata": {},
    "provenance": {}
  },
  "sourceArtifacts": [
    {
      "artifactUri": "file:///fixtures/source.tar.zst",
      "mediaType": "application/zstd",
      "checksumSha256": "sha256:...",
      "storageMode": "content_addressed",
      "metadata": {},
      "provenance": {}
    }
  ],
  "buildContext": {
    "projectId": "re100",
    "targetId": "re100:gateway",
    "buildTarget": "gateway",
    "toolchain": {"compiler": "gcc", "targetArch": "armv7"},
    "compileCommandsArtifactId": null,
    "dependencyGraph": {"libraries": [{"name": "curl", "version": "8.0.0"}]},
    "buildMetadata": {"defines": []},
    "provenance": {}
  },
  "analysisArtifactSet": {
    "analyzerName": "s4-static-fixture",
    "analyzerVersion": "1.0",
    "analysisConfig": {"enabled": ["callgraph", "taint"]},
    "artifactHashes": {"callgraph": "sha256:..."},
    "producedAt": "2026-05-12T00:00:00Z",
    "provenance": {}
  },
  "evidenceSnippets": [
    {
      "evidenceSnippetId": "snippet-1",
      "filePath": "src/http_client.cpp",
      "lineStart": 42,
      "lineEnd": 44,
      "language": "cpp",
      "snippetText": "curl_easy_perform(handle);",
      "checksumSha256": "sha256:optional",
      "provenance": {}
    }
  ],
  "graphNodes": [
    {
      "nodeKind": "function",
      "stableId": "func:perform_request",
      "displayName": "perform_request",
      "filePath": "src/http_client.cpp",
      "lineStart": 40,
      "lineEnd": 50,
      "symbol": {"name": "perform_request"},
      "metadata": {"component": "curl", "reachable": true},
      "evidenceSnippetId": "snippet-1"
    }
  ],
  "graphEdges": [
    {
      "edgeKind": "calls",
      "sourceStableId": "func:caller",
      "targetStableId": "func:callee",
      "evidence": {},
      "metadata": {}
    }
  ],
  "richIrArtifacts": [
    {
      "artifactKind": "symbol_table",
      "mediaType": "application/json",
      "uri": "file:///fixtures/symbols.json",
      "checksumSha256": "sha256:...",
      "payload": {},
      "provenance": {}
    }
  ]
}
```

### Response schema

```json
{
  "schemaVersion": "s5-source-code-kg-ingest-result-v1",
  "ledgerOnly": true,
  "productionWrites": {"neo4j": false, "qdrant": false},
  "repositorySnapshotId": "src-snapshot-...",
  "buildContextId": "src-build-...",
  "analysisArtifactSetId": "src-analysis-...",
  "counts": {
    "sourceArtifacts": 1,
    "evidenceSnippets": 1,
    "graphNodes": 2,
    "graphEdges": 1,
    "richIrArtifacts": 1
  },
  "ids": {
    "sourceArtifactIds": [],
    "evidenceSnippetIds": [],
    "sourceGraphNodeIds": [],
    "sourceGraphEdgeIds": [],
    "richIrArtifactIds": []
  }
}
```

### Persistence semantics

- Primary source version root: `repositorySnapshot` (`repositoryUrl`/`repositoryId`, `commitHash`, `treeHash`, `submoduleHashes`).
- `buildContext` and `analysisArtifactSet` are derivations under the repository snapshot. Different build flags/analyzer config must not create a new source version root.
- Ingest is idempotent for identical input; stable IDs are regenerated deterministically when caller omits IDs.
- Source evidence is stored for replay/golden-set construction and is not a final S3 security verdict.

### Errors

`GET /v1/contracts/source-code-kg` exposes endpoint-specific error vocabularies. Do not merge ingest and direct-context errors: `no_context_selector` is valid only for `/context`, while graph/reference validation is valid only for `/ingest`. Runtime 422 S5 error envelopes expose the stable taxonomy item in `errorDetail.reason` (for example `request_schema_invalid`, `graph_node_references_unknown_evidence_snippet`, `graph_edge_references_unknown_node`, or `no_context_selector`) while keeping `errorDetail.code="INVALID_INPUT"`.

#### `POST /v1/source-code-kg/ingest`

| HTTP | 조건 |
|---|---|
| 400 | `X-Timeout-Ms` missing/invalid |
| 422 | request schema invalid, ingest collection limit exceeded, ingest value too large including nested JSON object per-field/aggregate budget overflow, duplicate identities, same-lineage explicit ID content conflict, lineage rebind, graph node references unknown evidence snippet, or graph edge references unknown node |
| 503 | SQLite ledger repository not initialized |
| 408 | caller deadline expires before ledger ingest completes |

#### `POST /v1/source-code-kg/context`

| HTTP | 조건 |
|---|---|
| 400 | `X-Timeout-Ms` missing/invalid |
| 422 | request schema invalid, no context selector, explicit selector count limit, or selector scalar/item value over 512 chars |
| 503 | SQLite ledger repository not initialized |
| 408 | caller deadline expires before context resolution completes |

## Evidence-Grounded Judge serving contract v1

2026-05-13 implementation promotes the Judge from an internal S5 module to a bounded HTTP serving surface:

```http
POST /v1/judge/query
GET /v1/contracts/judge
```

This is still an S5 evidence-grounded knowledge verdict surface, not an S3 final security verdict or accepted-claim authority.

Required output fields:

- `schemaVersion="s5-judge-answer-v1"`
- `verdictAuthority="s5_evidence_grounded_knowledge_verdict_not_s3_final_security_verdict"`
- `verdict`: emitted values are `affected | not_affected | unknown`; `conflicting` is reserved runtime vocabulary and is represented through `uncertainty.conflicts` plus `qualityGate.gate=rejected`, not as an emitted verdict.
- `status`: emitted values are `complete | requires_requery | insufficient_input | degraded_quality`; `stale_cache` and `policy_blocked` are reserved runtime vocabulary, not currently emitted answer statuses.
- `queryContext.sourceContext` echoing Source KG IDs
- `evidence.identityResolution` with package/product/source identity candidates and hard affectedness eligibility
- `evidence.threatRetrieval` with Threat KB contextual evidence, retrieval trace, weakness/attack/risk context, and explicit non-affectedness authority
- `evidence.sourceCodeKg` resolving repository snapshot/build context/analysis artifact set/graph nodes/evidence snippets/rich IR artifacts by stable ID
- `evidence.sourceCodeKg.contextResolution` with requested/resolved/missing Source KG IDs; partial resolution must be visible in fallback/diagnostics
- `appliedControls` and `controlEffects`, including visible `exclude` suppression
- `qualityGate`, `scoreVector`, `reasoningPath`, `uncertainty`, and `followUpAffordances`
- `uncertainty.conflicts`: relevant open relation/affectedness conflicts summarized with `schemaVersion=s5-judge-conflict-summary-v1`, `conflictRecordId`, `conflictKind`, `issueCode`, `severity`, `status`, `involvedLedgerRefs`, bounded `conflictingValues`, `conflictingValueCount`, `conflictingValuesTruncated`, and `consumerPolicy=conflicting_evidence_not_negative_evidence`
- `servingLedger`: durable SQLite serving-run reference for replay/debugging
- `forbiddenInferences`: S5 final security verdict, clean pass, S5 accepted claim, exploitability judgment, complete project safety. `forbiddenInferencePolicy` declares `coverage=all_baseline_s5_forbidden_inferences`, source `app.analyst.brief.BASELINE_FORBIDDEN_INFERENCES`, count 5, and `s3FinalAuthorityBoundary=true`; contract tests assert exact equality with the Analyst Brief baseline.

#### Source KG Context Resolution v1 additions

Judge responses, `POST /v1/source-code-kg/context`, and ledger `get_source_kg_context(...)` expose Source KG serving resolution explicitly:

```json
{
  "evidence": {
    "sourceCodeKg": {
      "resolved": true,
      "contextResolution": {
        "schemaVersion": "s5-source-kg-context-resolution-v1",
        "complete": false,
        "partial": true,
        "graphNodes": {
          "requestedIds": ["source-node-1", "missing-node"],
          "resolvedIds": ["source-node-1"],
          "missingIds": ["missing-node"]
        },
        "evidenceSnippets": {"requestedIds": [], "resolvedIds": [], "missingIds": []},
        "richIrArtifacts": {"requestedIds": [], "resolvedIds": [], "missingIds": []},
        "diagnostics": [
          {"code": "SOURCE_KG_CONTEXT_PARTIAL", "field": "graphNodeIds", "missingIds": ["missing-node"]}
        ]
      }
    }
  },
  "fallbackTrace": [
    {
      "stage": "source_code_kg_context",
      "fallback": "partial_context_resolution",
      "silent": false,
      "diagnostics": [
        {"code": "SOURCE_KG_CONTEXT_PARTIAL", "field": "graphNodeIds", "missingIds": ["missing-node"]}
      ]
    }
  ]
}
```

Rules:

- `resolved=true` means at least one requested/root Source KG object resolved; it does not imply every requested ID resolved.
- `contextResolution.complete=false` + `partial=true` means the answer used available Source KG context but omitted requested IDs that were not present in the S5 ledger.
- Partial context does not change affectedness verdict authority. It adds `SOURCE_KG_CONTEXT_PARTIAL` diagnostics and may reduce source coverage/answerability score, but affectedness remains governed by deterministic identity and affectedness records.
- `SOURCE_KG_CONTEXT_INCONSISTENT` means requested repository/build/analysis selectors or explicit collection IDs resolved but do not belong to one lineage; treat the context as incomplete/chimera and do not infer a coherent source graph.
- `SOURCE_KG_CONTEXT_TRUNCATED` means whole-analysis context exceeded response caps; inspect total/returned/max counts and re-query with explicit selectors for more context.
- Explicit collection selector order is stable: returned `graphNodes`, `evidenceSnippets`, `richIrArtifacts`, and `contextResolution.*.resolvedIds` preserve caller order.
- Explicit graph-node context returns only the requested-node induced subgraph edges; unrelated whole-analysis edges are excluded from Source KG context and Judge packets.
- Silent dropping of requested Source KG IDs is forbidden.


#### Score Policy v1 additions

Loop 3 adds runtime-configurable scoring policy metadata to Judge answer packets. Every answer packet must expose the score vector and the policy evaluation used to interpret it.

`scoreVector` fields are always present:

```text
retrievalRelevance
identityConfidence
affectednessConfidence
versionRangeConfidence
evidenceStrength
sourceReliability
freshness
coverageScore
conflictPenalty
controlCompliance
overallAnswerability
```

`qualityGate.scorePolicy` shape:

```json
{
  "schemaVersion": "s5-score-policy-evaluation-v1",
  "phase": "serving",
  "requestedProfile": null,
  "appliedProfile": "balanced",
  "rejectedProfiles": [],
  "policyId": "s5-default-scoring-policy",
  "policyVersion": "v1",
  "policyHash": "sha256:...",
  "policySource": "config/scoring-policy-v1.json",
  "policyPath": "config/scoring-policy-v1.json",
  "failedThresholds": [],
  "thresholds": {
    "overallAnswerability": 0.5,
    "conflictPenaltyMax": 0.25,
    "controlCompliance": 1.0
  }
}
```

Runtime loading:

- default policy path: `config/scoring-policy-v1.json`
- override: `AEGIS_KB_SCORING_POLICY_PATH`
- default profile: `balanced`
- override: `AEGIS_KB_DEFAULT_SCORING_PROFILE`
- profiles: `strict`, `balanced`, `exploratory`
- phases: `serving`, `etl_projection`

The policy hash is computed from canonical policy JSON and changes when the policy file changes. `controlCompliance` and `conflictPenalty` are hard blockers. Other threshold failures may produce `accepted_with_caveats` depending on profile policy. Score policy diagnostics are evidence/debuggability signals, not S3 final claim authority.

Grounded `unknown` is allowed only with explicit reason, evidence gaps, required inputs, and follow-up affordances. When the unknown reason is missing library version, source diff, or vendored patch uncertainty, S5 should expose S4-facing follow-up hints so S3 can route the clarification.

#### Identity Resolution v1 additions

Loop 6 adds deterministic identity resolution before affectedness. Judge answers include:

```json
{
  "evidence": {
    "identityResolution": {
      "schemaVersion": "s5-identity-resolution-v1",
      "input": {
        "packageIdentityId": null,
        "purl": "pkg:generic/curl@8.0.0",
        "name": "curl",
        "version": "8.0.0",
        "cpe": null,
        "repoUrl": null,
        "sourceComponentId": null
      },
      "matches": [],
      "hardAffectednessPackageIds": ["pkg:generic/curl"],
      "ambiguous": false,
      "status": "resolved",
      "diagnostics": []
    }
  }
}
```

Allowed `status` values are `resolved`, `ambiguous`, `unresolved`, `product_only`, and `source_only`.

Hard affectedness is intentionally narrow. Only direct package identity evidence may populate `hardAffectednessPackageIds`: exact `packageIdentityId`, exact PURL, canonical package name/alias, or relation semantics `PACKAGE_IDENTITY` / package `NATIVE_ID`. The following are explicitly **not** affectedness proof by themselves: `RELATED_PRODUCT_IDENTITY`, `RELATED_SOURCE_COMPONENT`, `AFFECTS_CPE_MATCH`, package-table CPE columns, risk signals, product/CPE-only matches, source-component-only matches, and vector/retrieval hits.

`canonicalQuery.normalized.component` includes `cpe`, `repoUrl`, and `sourceComponentId`, and these fields affect `decisionFragmentKey`. CPE-only and source-component-only Judge requests are identity-bearing inputs; they should return grounded `unknown` with `product_only` / `source_only` diagnostics rather than being blocked as missing identity or overclaimed as affected.

## Target Context Acquisition (S3 canonical v1)

> 2026-05-11 추가: S3 target-aware flow의 canonical one-track 계약이다. 기존 `/v1/search`, `/v1/code-graph/*`, `/v1/cve/batch-lookup` compatibility surface는 남아 있을 수 있지만, S3의 canonical target-aware 호출은 target context를 먼저 적재한 뒤 target-scoped acquisition endpoint를 사용한다.

### POST /v1/target-contexts

S3가 deterministic Phase-1 material을 `TargetContextBundleV1`로 전달하면 S5는 durable target knowledge로 저장하고 ingest 자체를 `AcquisitionEnvelopeV1`로 반환한다.

#### 요청 핵심 필드

| 필드 | 설명 |
|---|---|
| `schemaVersion` | `target-context-v1` |
| `projectId` | 프로젝트 식별자. S3 target-aware flow에서 필수 |
| `target.targetId` | target identity. 없으면 project + path/name으로 결정 가능해야 함 |
| `provenance.buildSnapshotId` / `buildUnitId` | 둘 중 하나 이상 필요. 부족하면 `input_insufficient` |
| `buildProfile` | compiler/SDK/arch/OS/domain/exposed surface hints |
| `libraries[]` | S4 enriched SCA evidence. verdict가 아니라 acquisition evidence/hints |
| `sastAnchors[]` | bounded local attachment hints/evidence refs |
| `codeGraph` | `embedded-normalized-functions` 또는 transitional `existing-project-ref` |
| `evidenceRefs[]` | S3 evidence ledger reattachment hints |

#### 응답 핵심 필드

| 필드 | 설명 |
|---|---|
| `schemaVersion` | `acquisition-envelope-v1` |
| `targetKnowledgeId` | durable target context id |
| `targetContextVersion` | versioned context number |
| `acquisitionId` | ingest/acquisition id |
| `results.targetContextInputHash` | normalized bundle hash. idempotency key |
| `results.reused` | same project/target/build snapshot/hash re-submit 여부 |
| `itemAcquisitions[]` | embedded codeGraph 등 하위 적재 결과 |

Insufficient identity must return `acquisitionStatus="input_insufficient"` and must not silently use global/default answers.

### Target-scoped acquisition endpoints

S3 canonical target-aware calls use target-scoped paths. Every response is an `AcquisitionEnvelopeV1`.

```http
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve-candidate-evaluation
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve-discovery
POST /v1/target-contexts/{targetKnowledgeId}/acquire/threat-search
POST /v1/target-contexts/{targetKnowledgeId}/acquire/code-search
POST /v1/target-contexts/{targetKnowledgeId}/acquire/dangerous-callers
```

### AcquisitionEnvelopeV1 vocabulary

| Field | Values / meaning |
|---|---|
| `acquisitionStatus` | `completed_hit`, `completed_no_hit`, `partial_hit`, `incomplete_acquisition`, `input_insufficient`, `stale_cache_only`, `conflicting_evidence`, `timeout`, `not_ready`, `error` |
| `acquisitionQualityGate` | `accepted`, `accepted_with_caveats`, `inconclusive`, `rejected` — acquisition usability only, not S3 final quality outcome |
| `consumerPolicy` | `s3_may_derive_local_support_if_refs_validate`, `contextual_only`, `scoped_no_hit_record_only`, `diagnostic_only`, `do_not_use`, `do_not_use_as_negative_evidence` |
| `fallbackTrace[]` | 모든 fallback must be visible. Silent fallback is forbidden |
| `itemAcquisitions[]` | Batch/mixed outcome calls must be consumed item-by-item |

### Completed no-hit rule

`completed_no_hit` is valid only for the explicit envelope/item `scope` after the required method set completed. It must not be emitted for truncation, timeout, provider error, stale cache only, partial source failure, missing precision input, or insufficient target identity.

### Deadline/provider/mixed-status semantics

S3 canonical target-aware calls must receive an `AcquisitionEnvelopeV1` for acquisition diagnostics whenever S5 can resolve the target context, including provider timeout/error paths.

- Target-context ingest with embedded `codeGraph.functions` must pass the caller deadline through graph/vector projection. If projection exceeds `X-Timeout-Ms`, the ingest response remains an envelope and reports `acquisitionStatus="timeout"` with `TARGET_CONTEXT_GRAPH_PROJECTION_TIMEOUT`; it must not report projection readiness.
- Target-scoped CVE provider deadline failures return top-level and per-item `acquisitionStatus="timeout"` plus `consumerPolicy="do_not_use_as_negative_evidence"`, not a bare HTTP 408 with no envelope.
- Target-scoped CVE provider exceptions return top-level and per-item `acquisitionStatus="error"` plus `consumerPolicy="do_not_use_as_negative_evidence"`, not a bare HTTP 500 with no envelope.
- Aggregate `partial_hit` requires at least one real item `completed_hit`. `completed_no_hit` never counts as a hit.
- `completed_no_hit + timeout/error/not_ready/input_insufficient/stale_cache_only/conflicting_evidence` aggregates to a non-hit inconclusive status such as `incomplete_acquisition`.

### S3/S5 authority boundary

S5 may rate acquisition usability, but S5 must not emit final vulnerability/security verdicts. S3 remains the final owner of evidence class, claim support, accepted claims, clean pass, and vulnerability verdicts.

See: `wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md`.

---

## 실시간 CVE 조회

### POST /v1/cve/batch-lookup

프로젝트 의존성(라이브러리명+버전)으로 CVE를 실시간 조회한다. 3단계 전략:

1. **OSV.dev commit 기반** (commit + repo_url 필요) — 가장 정밀, `version_match`=항상 `true`
2. **NVD CPE 기반** (repo_url에서 vendor 추론) — 정밀
3. **NVD keywordSearch 폴백** — 넓은 검색

#### 요청

```json
{
  "libraries": [
    {
      "name": "mosquitto",
      "version": "2.0.22",
      "repo_url": "https://github.com/eclipse/mosquitto.git",
      "commit": "28f914788f6a22c8aee5e25eb5a5cc2d82a8a3a2"
    },
    {
      "name": "libcurl",
      "version": "7.68.0",
      "repo_url": "https://github.com/curl/curl.git"
    }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `libraries` | array | 필수 | 라이브러리 목록 (1~20개) |
| `libraries[].name` | string | 필수 | 라이브러리 이름 (S4 `/v1/libraries` 응답의 `name`) |
| `libraries[].version` | string | 필수 | 버전 문자열 |
| `libraries[].repo_url` (또는 `repoUrl`) | string? | 선택 | upstream git URL. 있으면 vendor 추론하여 CPE 정밀 조회. camelCase/snake_case 모두 수용 |
| `libraries[].commit` | string? | 선택 | git commit hash. repo_url과 함께 제공 시 OSV.dev 정밀 조회 |

#### 응답

```json
{
  "results": [
    {
      "library": "mosquitto",
      "version": "2.0.22",
      "cves": [
        {
          "id": "CVE-2021-28825",
          "title": "...",
          "description": "...",
          "severity": 8.8,
          "attack_vector": "NETWORK",
          "affected_versions": "<= 1.3.0",
          "version_match": false,
          "risk_score": 0.582,
          "epss_score": 0.42,
          "epss_percentile": 0.78,
          "kev": false,
          "related_cwe": ["CWE-863"],
          "related_attack": [],
          "kb_context": {
            "threat_categories": ["Authentication/Authorization"],
            "attack_surfaces": ["ECU/게이트웨이"],
            "max_automotive_relevance": 0.35
          }
        }
      ],
      "total": 26,
      "cached": false
    }
  ],
  "latency_ms": 2175
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `results` | array | 라이브러리별 CVE 조회 결과 |
| `results[].library` | string | 라이브러리 이름 |
| `results[].version` | string | 조회한 버전 |
| `results[].cves` | array | CVE 목록 (`risk_score` 내림차순, 동점 시 `severity` 내림차순) |
| `results[].cves[].id` | string | CVE ID |
| `results[].cves[].severity` | float? | CVSS 점수 |
| `results[].cves[].attack_vector` | string? | 공격 벡터 |
| `results[].cves[].affected_versions` | string | 영향 버전 범위 (사람 읽기용) |
| `results[].cves[].version_match` | bool? | **핵심 필드** — `true`: 범위 안(유효), `false`: 범위 밖(해당 없음), `null`: 판정 불가 |
| `results[].cves[].epss_score` | float? | EPSS 악용 확률 (0.0~1.0). 30일 내 실제 악용 가능성. `null`=데이터 없음 |
| `results[].cves[].epss_percentile` | float? | EPSS 백분위 (0.0~1.0). `null`=데이터 없음 |
| `results[].cves[].kev` | bool | CISA KEV 등록 여부. `true`=실제 악용 확인된 CVE |
| `results[].cves[].risk_score` | float | 복합 위험 점수 (0.0~1.0). CVSS 40% + EPSS 30% + KEV 20% + 도메인 관련성 10% 가중 합산 |
| `results[].cves[].related_cwe` | array[string] | 관련 CWE |
| `results[].cves[].related_attack` | array[string] | Neo4j 그래프 보강된 ATT&CK 기법 |
| `results[].cves[].kb_context` | object | KB 위협 지식 보강 맥락 |
| `results[].cves[].kb_context.threat_categories` | array[string] | CWE에서 도출된 위협 카테고리 (예: "Memory Corruption") |
| `results[].cves[].kb_context.attack_surfaces` | array[string] | CWE에서 도출된 공격 표면 태그 (예: "ECU/게이트웨이") |
| `results[].cves[].kb_context.max_automotive_relevance` | float | 관련 CWE 중 최대 도메인 관련성 점수 (0.0~1.0) |
| `results[].cves[].source` | string | 조회 소스: `"osv"` (commit 기반) 또는 `"nvd"` (CPE/keyword) |
| `results[].total` | int | CVE 건수 |
| `results[].cached` | bool | 캐시 히트 여부 |
| `latency_ms` | int | 총 소요 시간 (ms) |

#### 캐시 및 성능

- TTL: 24시간 (인메모리 + 파일 영속화 `data/cve-cache.json`, 최대 1,000건)
- 동일 `name:version` 재조회 시 0ms 응답
- 서비스 재시작 시 파일에서 캐시 복원 (TTL 유효분만)
- **병렬 조회**: `asyncio.gather` + 세마포어(5) 기반. 20개 라이브러리 기준 기존 ~20초 → ~4~7초
- **EPSS 보강**: FIRST.org API로 CVE별 악용 확률 배치 조회 (100건/요청)
- **KEV 보강**: CISA KEV 카탈로그 lazy-load (TTL 1시간), 실제 악용 확인 CVE 플래그

#### 에러

| HTTP | 조건 |
|------|------|
| 503 | NVD 클라이언트 미초기화 |
| 422 | 요청 스키마 불일치 (라이브러리 0개 또는 21개 이상) |

#### 호출 흐름 (S3 Agent Phase 1)

```
S3 → S4 POST /v1/libraries → [{name, version, repoUrl, commit}]
S3 → S5 POST /v1/cve/batch-lookup → [{cves: [..., version_match, epss_score, kev]}]
S3: version_match == true + epss_score/kev 기반 필터 → Phase 2 프롬프트에 주입
```

---

## 프로젝트 메모리

**공통 에러**: 모든 `/v1/project-memory/*` 엔드포인트는 Neo4j 미연결 시 **HTTP 503**을 반환합니다.

### GET /v1/project-memory/{project_id}

프로젝트의 에이전트 메모리 목록을 조회한다. 이전 분석 이력, false positive, 수정 확인, 사용자 선호를 기억하여 분석 품질을 높인다.

#### 파라미터

| 이름 | 위치 | 타입 | 기본값 | 설명 |
|------|------|------|--------|------|
| `project_id` | path | string | (필수) | 프로젝트 ID |
| `type` | query | string? | null | 메모리 타입 필터: `analysis_history`, `false_positive`, `resolved`, `preference` |
| `buildSnapshotId` | query | string? | null | snapshot provenance 필터 |
| `buildUnitId` | query | string? | null | build unit provenance 필터 |
| `sourceBuildAttemptId` | query | string? | null | build attempt provenance 필터 |

#### 응답

```json
{
  "projectId": "re100-gateway",
  "memories": [
    {
      "id": "mem-a1b2c3d4",
      "type": "analysis_history",
      "data": {
        "date": "2026-03-23",
        "claimCount": 4,
        "severity": "critical",
        "confidence": 0.865
      },
      "createdAt": "2026-03-23T15:00:00+00:00",
      "provenance": {
        "buildSnapshotId": "snap-re100-20260404",
        "buildUnitId": "re100-gateway",
        "sourceBuildAttemptId": "attempt-42"
      }
    },
    {
      "id": "mem-e5f6g7h8",
      "type": "false_positive",
      "data": {
        "pattern": "readlink TOCTOU in fs.cpp",
        "cwe": "CWE-362",
        "reason": "사용자 기각: readlink는 /proc/self/exe에만 사용"
      },
      "createdAt": "2026-03-23T16:00:00+00:00"
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `projectId` | string | 프로젝트 ID |
| `memories` | array | 메모리 목록 (생성일 내림차순) |
| `memories[].id` | string | 메모리 ID (`mem-{hex8}`) |
| `memories[].type` | string | 메모리 타입 |
| `memories[].data` | object | 자유 형식 데이터 |
| `memories[].createdAt` | string | ISO 8601 생성 시각 |
| `memories[].expiresAt` | string? | (선택) TTL 설정 시 만료 시각. null이면 영구 보존 |
| `memories[].provenance` | object? | 선택적 build snapshot provenance projection |

---

### POST /v1/project-memory/{project_id}

프로젝트 메모리를 생성한다.

#### 요청

```json
{
  "type": "false_positive",
  "data": {
    "pattern": "readlink TOCTOU in fs.cpp",
    "cwe": "CWE-362",
    "reason": "사용자 기각: readlink는 /proc/self/exe에만 사용"
  },
  "provenance": {
    "buildSnapshotId": "snap-re100-20260404",
    "buildUnitId": "re100-gateway",
    "sourceBuildAttemptId": "attempt-42"
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `type` | string | (필수) `analysis_history`, `false_positive`, `resolved`, `preference` 중 하나 |
| `data` | object | (필수) 자유 형식 JSON 데이터 |
| `ttl_seconds` | int? | (선택) TTL (초, 최소 60). null이면 영구 보존 |
| `provenance` | object? | 선택적 build snapshot provenance 메타데이터 |

#### 응답

```json
{
  "id": "mem-a1b2c3d4",
  "type": "false_positive",
  "createdAt": "2026-03-24T10:00:00+00:00",
  "expiresAt": "2026-03-25T10:00:00+00:00",
  "deduplicated": false,
  "provenance": {
    "buildSnapshotId": "snap-re100-20260404",
    "buildUnitId": "re100-gateway",
    "sourceBuildAttemptId": "attempt-42"
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 메모리 ID |
| `type` | string | 메모리 타입 |
| `createdAt` | string | ISO 8601 생성 시각 |
| `expiresAt` | string? | (선택) TTL 설정 시 만료 시각. null이면 영구 보존 |
| `deduplicated` | bool? | (선택) `true`이면 동일 패턴 메모리가 이미 존재하여 기존 항목을 반환 |
| `provenance` | object? | 선택적 build snapshot provenance projection |

#### 에러

| HTTP | 조건 |
|------|------|
| 409 | 메모리 한도 초과 (`MEMORY_LIMIT_EXCEEDED`) |
| 422 | 유효하지 않은 메모리 타입 |
| 503 | Neo4j 미연결 |

---

### DELETE /v1/project-memory/{project_id}/{memory_id}

프로젝트 메모리를 삭제한다.

#### 응답

```json
{"deleted": true, "projectId": "re100-gateway", "memoryId": "mem-a1b2c3d4"}
```

#### 에러

| HTTP | 조건 |
|------|------|
| 404 | 해당 메모리 없음 |
| 503 | Neo4j 미연결 |

---

### 메모리 타입

| type | 설명 | 생성 주체 |
|------|------|----------|
| `analysis_history` | 분석 세션 결과 요약 | S3 (분석 완료 후) |
| `false_positive` | 사용자가 기각한 claim | S2 (사용자 피드백 시) |
| `resolved` | 수정 확인된 취약점 | S2/S3 |
| `preference` | 사용자 분석 선호 설정 | S2 (사용자 설정 시) |

---

## 헬스체크

### GET /v1/health

Liveness 전용. 프로세스가 살아 있으면 200을 반환한다.

#### 응답

```json
{
  "service": "aegis-knowledge-base",
  "status": "ok",
  "version": "0.2.0"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `service` | string | 항상 `"aegis-knowledge-base"` |
| `status` | string | 항상 `"ok"` |
| `version` | string | 서비스 버전 |

---

### GET /v1/ready

Readiness 체크. 모든 하위 컴포넌트 상태를 포함한다.

#### 응답 (정상 — HTTP 200)

```json
{
  "service": "aegis-knowledge-base",
  "ready": true,
  "components": {
    "qdrant": {"initialized": true},
    "neo4j": {"connected": true, "nodeCount": 2196, "edgeCount": 9298}
  },
  "ontology": {
    "build_timestamp": "2026-03-26T09:32:43.633585+00:00",
    "cwe_version": "4.19.1",
    "attack_ics_version": "18.1",
    "attack_enterprise_version": "18.1",
    "capec_version": "3.9",
    "total_records": 2011,
    "seed_timestamp": "2026-03-26T10:15:22.000000+00:00"
  }
}
```

#### 응답 (미준비 — HTTP 503)

Qdrant 또는 Neo4j 미초기화 시 observability 에러 포맷 반환:

```json
{
  "success": false,
  "error": "Service not fully initialized",
  "errorDetail": {
    "code": "KB_NOT_READY",
    "message": "Service not fully initialized",
    "requestId": "req-xxxx",
    "retryable": true
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `service` | string | 항상 `"aegis-knowledge-base"` |
| `ready` | bool | `true` (모든 컴포넌트 정상). 503 시에는 위 에러 포맷 반환 |
| `components` | object | 하위 컴포넌트 상태 |
| `components.qdrant` | object | Qdrant 상태 |
| `components.qdrant.initialized` | bool | Qdrant 초기화 여부 |
| `components.sourceKgLedger` | object | Source KG ledger repository injection/readiness 상태 |
| `components.sourceKgLedger.initialized` | bool | Source KG ledger repository 사용 가능 여부 |
| `components.judgeLedger` | object | Judge ledger repository injection/readiness 상태 |
| `components.judgeLedger.initialized` | bool | Judge ledger repository 사용 가능 여부 |
| `components.neo4j` | object | Neo4j 상태 |
| `components.neo4j.connected` | bool | Neo4j 연결 여부 |
| `components.neo4j.nodeCount` | int? | 위협 노드 수 (연결 시) |
| `components.neo4j.edgeCount` | int? | 관계 수 (연결 시) |
| `ontology` | object? | KBMeta 노드 내용. Neo4j 정상 + KBMeta 존재 시에만 포함 |
| `ontology.build_timestamp` | string | ETL 빌드 시각 (ISO 8601) |
| `ontology.cwe_version` | string | CWE 버전 |
| `ontology.attack_ics_version` | string | ATT&CK ICS 버전 |
| `ontology.attack_enterprise_version` | string | ATT&CK Enterprise 버전 |
| `ontology.capec_version` | string | CAPEC 버전 |
| `ontology.total_records` | int | ETL 총 레코드 수 |
| `ontology.seed_timestamp` | string? | Neo4j 시드 시각 (ISO 8601) |

---

## 서비스 상태별 동작 요약

| Qdrant | Neo4j | 검색 | 그래프 | 코드 그래프 | CVE 조회 |
|--------|-------|------|--------|------------|---------|
| OK | OK | 정상 (3경로 하이브리드) | 정상 | 정상 | 정상 (그래프 보강 포함) |
| OK | 실패 | 503 | 503 | 503 | 정상 (그래프 보강 없음) |
| 실패 | OK | 503 | 정상 | 정상 | 정상 (그래프 보강 포함) |
| 실패 | 실패 | 503 | 503 | 503 | 정상 (그래프 보강 없음) |


#### Serving / Re-query Contract v1 additions

Loop 4 adds canonical query and decision-fragment metadata to Judge answer packets so S3/S4 can re-query deterministically and debug cache/fallback behavior.

Every Judge answer packet includes:

```json
{
  "canonicalQuery": {
    "schemaVersion": "s5-canonical-query-v1",
    "canonicalQueryId": "canonical-query-...",
    "decisionFragmentKey": "decision-fragment-...",
    "normalized": {
      "component": {},
      "sourceContext": {},
      "controls": {},
      "questionTerms": [],
      "answerMode": "evidence_grounded"
    },
    "controlSummary": {
      "requested": {},
      "accepted": {},
      "rejected": [],
      "ignored": []
    }
  },
  "decisionFragmentKey": "decision-fragment-...",
  "cacheTrace": {
    "schemaVersion": "s5-decision-cache-trace-v1",
    "hit": false,
    "miss": true,
    "stored": true,
    "reason": "decision_fragment_stored_after_miss",
    "cacheScope": "ledger",
    "cacheScopeHash": "sha256:...",
    "cacheRevisionHash": "sha256:..."
  },
  "fallbackTrace": []
}
```

Supported v1 controls:

- `exclude`: CVE/advisory IDs. Changes the decision fragment key and must suppress excluded advisories.
- `prefer`: `sourceCodeKg`, `localReachability`, `targetContext`, `threatKb`, `freshEvidence`.
- `forceContext`: source/target context pins echoed into the canonical query when within the forceContext budget (`rootKeys<=128`, `recursiveItems<=512`, `sanitizedEchoBytes<=16384`, `depth<=8`); over-budget objects are rejected before serving-ledger writes with `control_object_too_large`.
- `answerMode`: `evidence_grounded`, `alternatives_without_excluded`, `strict_target_context`, `exploratory_context`.
- `topK`: positive integer final cap for `evidence.threatRetrieval.candidateEvidence`. It is included in normalized accepted controls and the decision-fragment key when valid. Invalid values are visible in `appliedControls.rejected`/`fallbackTrace` and fall back to S5 default retrieval sizing.

Control identifiers such as CVE/advisory excludes are whitespace/case normalized before keying and suppression, so `cve-2026-0001`, ` CVE-2026-0001 `, `CVE-2026-0001`, and internal advisory IDs such as `advisory:NVD_CVE:CVE-2026-0001` refer to suppressible advisory evidence. Unsupported known values and unknown control keys are returned under `appliedControls.rejected` and are also visible in `fallbackTrace`; silent fallback is forbidden. Cache keys are decision-fragment keys, not raw prompt text, and include normalized component identity, normalized source context IDs, accepted controls including `topK`, and answer mode. Runtime decision-fragment cache storage is additionally scoped by ledger identity (`cacheScope=ledger`, `cacheScopeHash`) and ledger content revision (`cacheRevisionHash`) so separate SQLite ledgers cannot share affectedness fragments and same-ledger affectedness/identity/advisory/risk-signal/relation/conflict changes miss stale fragments. Conflict records are detected/recorded before revision-scoped cache lookup and unchanged conflict upserts must not update `updated_at`, so repeated identical conflict-bearing Judge queries can hit cache and the returned `cacheRevisionHash` represents the post-conflict-recording ledger state used for the answer. Score policy is evaluated freshly in the final packet and is not treated as a stale cached final quality gate.

#### Durable Serving Ledger v1 additions

Loop 5 records every internal Judge answer into SQLite table `serving_query_run`. This remains an internal S5 storage/replay contract, not a new public S3/S4 endpoint.

Every returned answer includes:

```json
{
  "servingLedger": {
    "schemaVersion": "s5-serving-ledger-ref-v1",
    "recorded": true,
    "servingRunId": "serving-run-...",
    "createdAt": "2026-05-12T00:00:00+00:00"
  }
}
```

`serving_query_run` extracts indexable fields and also stores the full request/answer packet:

| column | purpose |
|---|---|
| `serving_run_id` | unique durable serving run ID |
| `canonical_query_id` | canonical query key from Loop 4 |
| `decision_fragment_key` | decision-fragment/cache key from Loop 4 |
| `answer_schema_version` | Judge answer schema version |
| `verdict`, `status`, `quality_gate` | fast inspection fields |
| `component_json`, `source_context_json` | normalized query context |
| `request_json`, `canonical_query_json`, `answer_json` | replay/debug packet evidence |
| `applied_controls_json`, `control_effects_json` | requested/accepted/rejected/ignored controls and effects |
| `fallback_trace_json`, `cache_trace_json` | non-silent fallback and cache evidence |
| `score_vector_json`, `score_policy_json` | serving-time score and active policy evidence |
| `created_at` | durable run timestamp |

Repeated canonical queries create separate `serving_run_id` rows while sharing canonical/decision keys. This lets S5 preserve cache-hit/miss transitions, re-query decisions, score policy state, and grounded-unknown evidence as future golden/negative-set material.

#### Threat Retrieval Evidence v1 additions

Loop 7 adds Threat KB retrieval/context evidence to Judge packets:

```json
{
  "evidence": {
    "threatRetrieval": {
      "schemaVersion": "s5-threat-retrieval-evidence-v1",
      "queryTerms": ["curl", "pkg:generic/curl@8.0.0"],
      "candidateEvidence": [],
      "weaknessSemantics": [],
      "attackSemantics": [],
      "riskSignals": [],
      "retrievalTrace": {
        "queryIntent": "judge_threat_context",
        "candidateSetSize": 0,
        "candidatePoolSize": 0,
        "returnedCount": 0,
        "topK": 5,
        "topKPolicy": {"name": "s5-top-k-policy-v1", "topKMeans": "final_returned_count"},
        "candidatePoolPolicy": {"name": "s5-candidate-pool-policy-v1", "candidatePoolMeans": "internal_exact_vector_graph_rerank_pool"},
        "rerankerPolicy": {"name": "s5-deterministic-method-aware-reranker", "modelBacked": false, "negativeEvidenceAllowed": false},
        "rerankersApplied": ["method_trust", "risk_signal_score", "source_kind_tiebreaker"],
        "embeddingUsed": false,
        "negativeEvidenceAllowed": false
      },
      "methodsAttempted": ["direct_source_relation", "graph_expansion", "risk_signal_join"],
      "methodsUsed": [],
      "authority": "contextual_support_not_affectedness_proof",
      "diagnostics": [],
      "negativeEvidenceAllowed": false
    }
  }
}
```

`candidateEvidence[]` is deterministically ranked and may expose `rank`, `retrievalMethods`, `rerankScore`, and `scoreBreakdown` metadata for reproducibility. Judge retrieval uses an affectedness-first method tier: candidates used by the current affectedness verdict expose `retrievalMethods[0]="affectedness_evidence"` and outrank higher-risk same-package contextual advisories (`package_identity_context`) when `topK` is small. `controls.topK` caps this returned contextual candidate list only; `candidatePoolPolicy` and `topKPolicy` must make the internal candidate breadth vs final returned count distinction visible. To preserve multi-source context under small `topK`, selected candidates may include `equivalenceKey`, `equivalentSourceKinds`, `equivalentAdvisoryCount`, `equivalentAdvisoryLimit`, `equivalentAdvisoriesTruncated`, and bounded `equivalentAdvisories[]` for non-suppressed ledger advisories sharing normalized aliases such as a CVE ID, including alias-only advisories that are not otherwise package-matched or affectedness-used; validator checks count/limit/truncation, visible source-kind consistency, and equivalent authority. Judge answer validation rejects retrieval trace/ranking corruption such as rank sequence gaps, `returnedCount` mismatch, `topK` overflow, primary-method `methodWeight` mismatch, rerank-order inversion, or inconsistent `finalRerankScore`/`rerankScore`. `retrievalTrace.candidatePoolPreview[]` exposes a bounded rerank-ordered preview of the usable candidate pool with `candidatePoolRank`, `returned`, `unreturnedReason="outside_final_top_k"`, retrieval methods, score breakdown, and rerank score, so small `topK` decisions can still explain higher-risk contextual candidates that were not returned. Preview metadata is bounded by `candidatePoolPreviewLimit`, counted by `candidatePoolPreviewCount`, and flagged by `candidatePoolPreviewTruncated`; Judge validation checks preview count/limit/truncation, returned flags, returned IDs, method weights, score math, and preview rerank order. `GET /v1/contracts/judge` advertises this under `answer.threatRetrievalPolicies.candidatePoolPreview` so API consumers can discover the bounded preview contract without relying on examples alone. Ranking/capping must not resurrect excluded advisories by external ID, alias/CVE, or internal advisory ID, and must not let excluded high-rank advisories starve lower-ranked valid alternatives: usable candidate pool construction filters suppressed rows before final capping. Excluded IDs may appear only under `suppressedCandidateEvidence`, and derived `weaknessSemantics`, `attackSemantics`, and `riskSignals` are joined from non-suppressed returned advisory IDs only.

`fixtures/retrieval-quality-lab-v1/manifest.json` includes Judge-specific golden cases for `rq-judge-affectedness-first-topk` and `rq-judge-multisource-alias-fusion`. These offline lab cases lock the affectedness-first topK behavior and multi-source alias-fusion expectations without leaking offline metric vocabulary into runtime packets. S5 test/evaluation code now also extracts `s5-retrieval-quality-lab-live-judge-observation-v1` packets from real `build_judge_answer()` outputs and validates those observations against the same Judge golden cases, so the lab is not merely a static fixture: affectedness-first topK and multi-source alias fusion must remain true in live Judge retrieval.

This field is for evidence navigation, weakness/attack semantics, advisory context, and prioritization signals. It does **not** decide `verdict`. Retrieval no-hit, keyword-only, embedding-only, graph-neighbor-only, or risk-signal-only evidence cannot produce `affected`, `not_affected`, or S3 final authority. Affectedness remains governed by deterministic identity and affectedness records. `GET /v1/contracts/judge` exposes `answer.threatRetrievalPolicies.runtimeDiagnostics` for runtime Threat Retrieval diagnostics under `evidence.threatRetrieval.diagnostics`; `THREAT_RETRIEVAL_NO_CONTEXT` means no candidate advisory/context rows were discovered for the normalized component and security question terms, has `verdictAuthority=unknown_only`, carries `negativeEvidenceAllowed=false`, and must be consumed as an inconclusive context gap rather than component-safe/no-vulnerability evidence. `runtimeDiagnostics.diagnosticCodeCoverage` reports `coverage=all_known_threat_retrieval_runtime_diagnostic_codes` with one known code, and contract tests compare runtime diagnostic literals from the Threat Retrieval evidence module against the exposed `diagnosticCodes` catalog so new runtime diagnostics cannot silently remain undocumented.

Judge validation now enforces the Threat Retrieval authority boundary as part of `GET /v1/contracts/judge` under `answer.threatRetrievalPolicies.authorityBoundaryValidation`: `evidence.threatRetrieval.authority`, `retrievalTrace.authority`, `candidateEvidence[].authority`, `suppressedCandidateEvidence[].authority`, `retrievalTrace.candidatePoolPreview[].authority`, `candidateEvidence[].equivalentAdvisories[].authority`, `weaknessSemantics[].authority`, and `attackSemantics[].authority` must remain `contextual_support_not_affectedness_proof`; top-level and trace `negativeEvidenceAllowed` must remain `false`; and `riskSignals[].authority` must remain `prioritization_signal_not_affectedness_proof`. The contract exposes `validatedContextAuthorityFields`, `validatedRiskSignalAuthorityFields`, and issue codes `THREAT_RETRIEVAL_AUTHORITY_INVALID`, `THREAT_RETRIEVAL_EQUIVALENT_AUTHORITY_INVALID`, `THREAT_RETRIEVAL_NEGATIVE_EVIDENCE_ALLOWED`, and `THREAT_RETRIEVAL_RISK_SIGNAL_AUTHORITY_INVALID`, with `credentialBearingAuthorityRedaction=true` and `credentialBearingDiagnosticMetadataRedaction=true` so forged URL-like authority values and diagnostic metadata IDs cannot leak userinfo or sensitive query tokens in validator issue payloads. These checks prevent forged Threat KB/risk-signal fields from escalating into affectedness proof or negative evidence. `answer.threatRetrievalPolicies.validatorDiagnosticMetadataRedaction` also advertises credential-bearing ID redaction for validator issue metadata fields `externalId`, `expectedExternalId`, `actualExternalId`, `previousExternalId`, `currentExternalId`, `riskSignalId`, and `advisoryId`, so non-authority diagnostics such as rank/preview mismatches cannot echo forged credential-bearing URL-like IDs. `answer.threatRetrievalPolicies.validatorIssueFieldPathPolicy` declares that Threat Retrieval validator issues must expose a machine-readable `field` and normalizes explicit relative fields such as `methodsSucceeded`, `weaknessSemantics`, and `attackSemantics` into full `evidence.threatRetrieval...` paths; it exposes the full known `issueFieldsByCode` catalog plus `dynamicFieldIssueCodes` for runtime-field families such as trace-field missing, semantic response budget, authority, and negative-evidence issues; `issueCodeCoverage` reports `coverage=all_known_threat_retrieval_validator_issue_codes` with 43 known codes, 37 static field mappings, and 6 dynamic mappings, and contract tests use a Python AST string-literal scan to compare emitted `THREAT_RETRIEVAL_*` validator issue codes against the exposed static+dynamic catalog so new issue families cannot silently lose S3-readable field/source metadata even if issue-code literals use different Python quote styles; representative mappings include `THREAT_RETRIEVAL_RETURNED_COUNT_MISMATCH -> evidence.threatRetrieval.retrievalTrace.returnedCount`, `THREAT_RETRIEVAL_RANK_SEQUENCE_INVALID -> evidence.threatRetrieval.candidateEvidence[].rank`, and `THREAT_RETRIEVAL_CANDIDATE_POOL_PREVIEW_RETURNED_MISMATCH -> evidence.threatRetrieval.retrievalTrace.candidatePoolPreview[].returned`.

### Internal ETL Source Coverage Report v1

Loop 8 does not add a new public S3/S4 HTTP endpoint. It adds an internal report field returned by `ingest_fixture_corpus(...)` for S5 ETL validation and handoff evidence:

```json
{
  "sourceCoverage": {
    "schemaVersion": "s5-source-coverage-evaluation-v1",
    "coverageGate": {
      "kind": "source_coverage_quality_gate_not_service_health",
      "status": "accepted_with_caveats",
      "hardFail": false,
      "reasons": []
    },
    "domainScope": {"firstClass": ["native", "system", "embedded", "ics_ot"]},
    "languageScope": {"firstClass": ["c", "cpp"]},
    "roles": [],
    "liveDownloadPolicy": {"default": "disabled", "networkAccess": "not_attempted"}
  }
}
```

Contract notes:

- `coverageGate` is a source/data-quality gate only. It is not `/v1/ready`, service health, S3 final security verdict authority, or Neo4j/Qdrant projection freshness.
- First-class scope is C/C++ native/system/embedded/ICS. Non-native-only coverage cannot satisfy the S5 source coverage gate.
- Risk signals are axis C/prioritization only; CVSS is derived from `NVD_CVE` in v1 rather than a standalone source kind.
- Source Code KG is represented as an explicitly deferred fixture-corpus role because runtime Source KG ingest is covered by the internal Source KG/Judge contract.
- Cached/manual artifact verification is local-only and must not dereference `sourceUrl` or artifact `uri`.

### Internal Relation Conflict Report v1

Loop 9 adds an internal relation/affectedness conflict report and projection-visible conflict evidence. This is not a new public S3/S4 endpoint.

```json
{
  "schemaVersion": "s5-relation-conflict-report-v1",
  "conflictCount": 1,
  "newlyRecordedConflictCount": 1,
  "qualityImpact": "reject",
  "conflictKinds": ["relation_predicate_conflict"],
  "conflicts": [
    {
      "conflictRecordId": "conflict:relation_predicate_conflict:...",
      "conflictKind": "relation_predicate_conflict",
      "issueCode": "RELATION_PREDICATE_CONFLICT",
      "severity": "hard",
      "status": "open"
    }
  ]
}
```

Quality reports expose conflict metrics: `conflictRecordCount`, `newlyRecordedConflictCount`, `openConflictCount`, and `conflictKinds`. Conflict projection records use `consumerPolicy=conflicting_evidence_not_negative_evidence` and `negativeEvidenceAllowed=false`.

Judge relation conflict visibility v1 is active in serving packets:

```json
{
  "uncertainty": {
    "conflicts": [
      {
        "schemaVersion": "s5-judge-conflict-summary-v1",
        "conflictRecordId": "conflict:affectedness_status_conflict:...",
        "conflictKind": "affectedness_status_conflict",
        "issueCode": "AFFECTEDNESS_STATUS_CONFLICT",
        "severity": "hard",
        "status": "open",
        "consumerPolicy": "conflicting_evidence_not_negative_evidence",
        "negativeEvidenceAllowed": false,
        "involvedLedgerRefs": [{"ledgerTable": "affectedness_record", "ledgerId": "..."}],
        "conflictingValueCount": 2,
        "conflictingValues": [
          {
            "ledgerTable": "affectedness_record",
            "ledgerId": "affectedness:...",
            "value": {"affectednessStatus": "affected", "rangeTuple": ["0", "8.1.0", "", "[]"]},
            "provenance": {"sourceRefs": []}
          }
        ],
        "conflictingValuesTruncated": false
      }
    ]
  },
  "qualityGate": {
    "gate": "rejected",
    "diagnostics": [
      {
        "code": "AFFECTEDNESS_STATUS_CONFLICT",
        "conflictRecordId": "conflict:affectedness_status_conflict:...",
        "consumerPolicy": "conflicting_evidence_not_negative_evidence",
        "negativeEvidenceAllowed": false
      }
    ]
  }
}
```

Relevant open conflicts are selected by exact component/package/source identity references from the current Judge request, affectedness evidence, and Threat Retrieval context. Same-advisory conflicts for unrelated package-prefix matches must not leak into the answer. `conflictingValues` is bounded (`maxConflictingValues=8`) and carries ledger table/id, value, provenance, plus `conflictingValueCount`/`conflictingValuesTruncated` metadata so consumers know whether additional ledger inspection is needed. Judge validation rejects over-limit summaries and inconsistent count/truncation metadata. Hard conflicts reject the Judge quality gate; soft conflicts produce `accepted_with_caveats` when the base gate would otherwise be accepted. Conflict visibility must not change `/v1/health`, `/v1/ready`, projection readiness semantics, S3 final verdict authority, or clean-pass authority.
