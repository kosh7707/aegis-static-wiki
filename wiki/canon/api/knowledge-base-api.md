---
title: "Knowledge Base API 계약서"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/api/knowledge-base-api.md"
original_path: "docs/api/knowledge-base-api.md"
last_verified: "2026-05-11"
service_tags: ["s5"]
decision_tags: ["health-control-v2", "timeout-policy", "ack-liveness", "long-running-ownership", "current-state-boundary", "target-context-bundle-v1", "acquisition-envelope-v1", "non-silent-fallback", "knowledge-coverage-contract-v1", "acquisition-readiness-contract-v1", "runtime-vs-offline-evaluation", "analyst-brief-v1"]
related_pages:
  - "wiki/canon/specs/health-control-signal-rollout-v2.md"
  - "wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md"
  - "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md"
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md"
migration_status: "canonicalized"
---

# Knowledge Base API 계약서

> **소유자**: S5 (Knowledge Base)
> **포트**: 8002
> **호출자**: S2 (Backend), S3 (Analysis Agent)
> **최종 업데이트**: 2026-05-11 (Knowledge Coverage/Acquisition Readiness Contract v1 + target context acquisition v1 + G008 CVE candidate/discovery split + Analyst Brief v1 + RetrievalPolicy/Quality Lab v1)

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
| `rerankerPolicy` | Deterministic/model-backed reranker disclosure | Current default is deterministic and not model-backed. |
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

S5는 acquisition envelope를 그대로 던지는 것만으로는 S3/S4가 안전하게 소비하기 어렵다는 문제를 줄이기 위해 deterministic analyst brief를 제공한다.

```http
POST /v1/analyst-brief
```

이 endpoint는 live GraphRAG 검색, CVE provider 조회, code graph 적재를 수행하지 않는다. 입력 artifact를 사람이 읽을 수 있는 S3용 해석/행동 가이드로 변환하는 순수 contract helper다.

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
| `artifact` | object | 필수 | `AcquisitionEnvelopeV1` 또는 target-scoped acquisition response. malformed/empty artifact는 `blocked` brief로 변환된다. |
| `audience` | string | 선택 | 현재 v1은 `s3`만 허용한다. |
| `language` | string | 선택 | `ko` 또는 `en`. 기본값은 `ko`. |

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

`contractRefs`는 API/source evidence가 아니라 이 brief를 해석할 때 적용된 S5 contract vocabulary다. 실제 증적 연결은 `evidencePlacement.sourceEvidenceRefs`와 `evidencePlacement.derivedFromEvidenceRefs`만 사용한다.

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
- `GET /v1/ready`는 전역 readiness다. 특정 ingest/search/CVE 요청의 ownership 상태가 아니다.
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
