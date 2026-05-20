---
title: "Knowledge Base 명세서"
page_type: "canonical-spec"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/specs/knowledge-base.md"
original_path: "docs/specs/knowledge-base.md"
last_verified: "2026-05-20"
service_tags: ["s5"]
decision_tags: ["health-control-v2", "timeout-policy", "ack-liveness", "long-running-ownership", "current-state-boundary"]
related_pages:
  - "wiki/canon/specs/health-control-signal-rollout-v2.md"
  - "wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
migration_status: "canonicalized"
---


# Knowledge Base 명세서


## Current implementation refresh — 2026-05-20

The current S5 implementation state is summarized in [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]]. Older sections of this spec remain valid as subsystem background, but active TraceAudit/e2e smoke work must use the 2026-05-20 overlay below.

Current active subsystems:

- Threat KB / GraphRAG retrieval and static corpus/index serving.
- Source Code KG ingest/context and Code KB readiness.
- Judge, Threat Retrieval, Analyst Brief, and target-context acquisition contracts.
- S5 Paper Context API as a bounded S3-facing projection over Source Code KG and Threat KB internals.
- S5_FREEZE_GATE for producer/exported-fixture obligations.
- Canonical JSONL observability and `log-analyzer` requestId traceability.

Current paper/e2e status:

```text
S5 producer freeze gate: pass
S3 consumer execution status: pending_s3_owned_validation
S5 e2e-smoke producer readiness: ready
Open S5 WRs at refresh: none
```

Current verification evidence:

```text
53 passed — paper/freeze/observability focused suite
pass — scripts/paper-freeze-gate.py
765 passed — full S5 service-root suite
18 passed in 37.47s — paper observability/API focused after live log proof
PASS — canonical JSONL/log-analyzer traceability proof
```

> **소유자**: S5
> **최종 업데이트**: 2026-05-20 (S5 Paper Context API, S5_FREEZE_GATE pass, paper-path observability, canonical JSONL/log-analyzer traceability, e2e-smoke S5 producer readiness overlay 반영)

---

## 1. 서비스 개요

AEGIS 플랫폼의 **위협 지식 그래프 + 코드 구조 그래프 + 실시간 CVE 조회**를 관리하는 서비스.

- **위협 지식**: CWE, CVE/NVD, ATT&CK ICS, CAPEC 데이터를 Neo4j 관계 그래프 + Qdrant 벡터 DB로 이중 관리
- **코드 그래프**: SAST Runner가 추출한 함수 호출 관계를 Neo4j에 적재, 호출자 체인·위험 함수 식별 제공
- **Dual GraphRAG 공존**: `threat_knowledge`(위협 ontology)와 `code_functions`(업로드 소스 함수) 컬렉션/그래프가 한 서비스 안에 공존하지만, 부트스트랩 가용성은 분리한다
- **하이브리드 검색**: ID 정확 매칭 + 그래프 이웃 확장 + 벡터 시맨틱 검색을 RRF 점수 융합으로 병합
- **프로젝트 메모리**: 에이전트 분석 이력, false positive, 수정 확인, 사용자 선호를 Neo4j에 저장
- **Threat search readiness**: 위협 검색은 이제 **Qdrant + Neo4j 모두 필요**하며, Neo4j 부재 시 degraded vector-only 검색으로 폴백하지 않음
- **Provenance seam**: code graph / project memory는 optional `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId`를 수용하지만, 현재 code graph는 여전히 **프로젝트당 활성 그래프 1개** 모델
- **Quick-stage ingest contract**: `POST /v1/code-graph/{project_id}/ingest`는 repeatable replace surface이며, 응답의 `status`(`ready`/`partial`/`empty`)와 `readiness.graphRag`가 caller의 다음 단계 진행 가능 여부를 판정하는 authoritative contract
- **Staged commit ingest**: code graph ingest는 staging project scope에 Neo4j/Qdrant를 먼저 적재하고, 두 저장소가 모두 준비된 뒤에만 active project graph/vector를 승격한다. timeout/activation 실패 시 이전 active state를 복원하거나 빈 상태로 롤백한다



### 1.1 Knowledge Coverage / Acquisition Readiness Contract v1

2026-05-11 G001 기준 S5는 `GET /v1/contracts/acquisition`와 `app/contracts/acquisition.py`를 통해 다음 계약을 코드-문서 공통 source로 고정한다.

- `Knowledge Coverage Contract v1`: S5가 제공하는 coverage surface와 명시적 `not_provided` final-claim surface를 구분한다.
- `Acquisition Readiness Contract v1`: target-scoped readiness, provider/projection state, fallback, retry guidance, no-hit guard를 기계 판독 가능하게 제공한다.
- Runtime S5 acquisition vocabulary는 offline Golden Set quality metrics 및 S3 final claim quality와 분리된다.
- Existing target-context `AcquisitionEnvelopeV1` 응답은 additive metadata(`coverageContractVersion`, `readinessContractVersion`, `runtimeSemantics`, `readiness`, `providerState`, `projectionState`)를 포함한다.
- Unsafe `completed_no_hit`는 validator에 의해 `incomplete_acquisition` + `do_not_use_as_negative_evidence`로 downgraded된다.

이 절은 ledger/Golden Set/GraphRAG 알고리즘 구현 완료를 뜻하지 않는다. 해당 구현은 S5 one-track modernization의 후속 goals에서 수행한다.


### 1.2 Golden Set v1 / Gate Harness Skeleton

2026-05-11 G002 기준 S5는 `app/evaluation/golden_set.py`와 `fixtures/golden-set-v1/manifest.json`로 offline-only Golden Set v1 skeleton을 제공한다.

- Golden Set family: `cve-package`, `etl-transform`, `threat-graphrag-retrieval`, `code-graph`, `s3-evidence-slot`.
- Gate model은 `systemStability`, `evidenceReadiness`, `qualityGate`를 분리한다.
- Runtime `runtimeObservation`에는 TP/FP/FN/Recall/Precision/NDCG/MRR 같은 offline quality metric을 넣지 않는다.
- Quality Gate는 fixture의 `expectedCandidateIds` / `retrievedCandidateIds`를 통해 `Precision@k`, `Recall@k`, `NDCG@k`, `MRR`, hit-rate, false-positive/false-negative, method/queryIntent/corpus/profile breakdown만 계산한다.
- Evidence Readiness Gate는 `contextual_only`, `diagnostic_only`, `scoped_no_hit_record_only`, `s3_may_derive_local_support_if_refs_validate` 소비 정책을 S3가 구분할 수 있게 한다.
- G002는 harness/fixture skeleton이며, 실제 ledger ingest, source expansion, projection rebuild, typed GraphRAG reranker 구현 완료를 뜻하지 않는다.


### 1.3 Knowledge Corpus v1 Taxonomy/Profile Assets

2026-05-11 G003 기준 S5는 `app/corpus/knowledge_corpus.py`와 `fixtures/knowledge-corpus-v1/manifest.json`로 Knowledge Corpus v1 asset skeleton을 고정한다.

- Core taxonomy는 C/C++ native/system vulnerability primitive이며 `memory_safety`, `command_execution`, `input_validation`, `path_file_access`, `crypto_tls`, `authn_authz`, `network_protocol`, `parser_serialization`, `concurrency`, `resource_lifecycle`, `credential_secret_exposure`, `information_exposure_logging`, `third_party_component`, `build_supply_chain`, `firmware_boot_update`, `os_kernel_driver`, `rtos_embedded`, `privilege_boundary`를 포함한다.
- `automotive-specialization`은 primary/default specialization profile이며 core vulnerability taxonomy가 아니다.
- `embedded-system-specialization`, `ics-ot-specialization`도 additive/context-only profile로 고정된다.
- Relation method enum은 `exact_id_match`, `curated_mapping`, `direct_source_relation`, `provider_range_eval`, `graph_expansion`, `keyword_match`, `embedding_similarity`, `constrained_embedding_rerank`, `global_embedding_search`, `profile_signal`을 구분한다.
- Weak signal method(`keyword_match`, `embedding_similarity`, `constrained_embedding_rerank`, `global_embedding_search`)는 no-hit/negative evidence 또는 vulnerability truth를 만들 수 없다.
- `profile_signal`은 specialization/profile context 전용이며 no-hit, negative evidence, vulnerability truth를 만들 수 없다.
- Legacy `threat_category`, `attack_surfaces`, `automotive_relevance`는 compatibility field이며 ledger/projection source-of-truth가 아니다.

이 절은 corpus asset freeze이며 ledger schema, source ingestion, transform-decision persistence, projection rebuild, typed retrieval runtime 구현 완료를 뜻하지 않는다.


### 1.4 SQLite LedgerRepository Foundation

2026-05-11 G004 기준 S5는 `app/ledger/repository.py`와 `app/ledger/migrations/0001_init.sql`로 SQLite-backed S5 ledger foundation을 제공한다.

- Alpha URL: `AEGIS_KB_LEDGER_URL=sqlite:///data/s5-ledger.sqlite`.
- SQLite ledger는 G004 이후 생성되는 target-context/acquisition/provider/projection write의 authoritative S5 source of truth다.
- `data/target-contexts.json`은 compatibility mirror 및 migration import/export surface일 뿐, ledger failure 시 authoritative fallback이 아니다.
- Ledger write/init failure는 target-context durable success로 조용히 승격되지 않는다.
- Schema v1은 `ledger_meta`, target-context/version, acquisition run/item, provider observation, projection state/job, normalized knowledge/relation/transform scaffolding table을 포함한다.
- JSON mirror write failure는 authoritative ledger success를 무효화하지 않으며 explicit compatibility diagnostic으로만 노출된다.

이 절은 ledger foundation이며 source ETL ingestion, transform-decision population, Neo4j/Qdrant projection rebuild, CVE split runtime, typed GraphRAG runtime 구현 완료를 뜻하지 않는다.


### 1.5 Corpus Source Manifests / First Ledger Ingestion

2026-05-11 G005 기준 S5는 `app/ingestion/corpus_ingestion.py`와 `fixtures/corpus-ingestion-v1/source-manifest.json`로 fixture-backed first ledger ingestion slice를 제공한다.

- Source manifest schema는 source/raw artifact 단위로 `sourceId`, `sourceKind`, `family`, `sourceVersion`, `sourceUrl`, `coverageStatus`, `completedCoverage`, `providerState`, `rawArtifacts[]`, `rawArtifactId`, `fixturePath`, `contentHash`, `retrievedAt`, `artifactKind`, `transformVersion`를 고정한다.
- Completed fixture-backed families: `knowledge-corpus-v1`, `golden-set-v1`, `CWE`, `CAPEC`, `ATTACK_ICS`, `ATTACK_ENTERPRISE`, `semgrep`, `cppcheck`, `clang-tidy`, `gcc-fanalyzer`, `scan-build`, `flawfinder`, `package-identity`, `OSV`, `NVD_CVE`, `GHSA`, `CISA_KEV`, `FIRST_EPSS`.
- `CAPEC`, `ATTACK_ICS`, `ATTACK_ENTERPRISE`는 2026-05-11 modernization에서 manifest-only가 아니라 sample fixture completed coverage로 승격되었다. 이는 CAPEC-88, ATT&CK ICS T0807, ATT&CK Enterprise T1059 샘플 coverage이며 production-scale full ingestion 완료를 뜻하지 않는다.
- OSV/NVD/GHSA fixtures create advisory and affected-range truth rows with provenance/freshness/diagnostics.
- CISA KEV and FIRST EPSS fixtures create provider observations and contextual enrichment relations only; they do not create standalone vulnerability advisory or affected-range truth.
- Ingestion is deterministic and idempotent; no live network calls and no Neo4j/Qdrant projection writes occur in G005.

이 절은 fixture ingestion이며 broad production ingestion, Neo4j/Qdrant projection rebuild, CVE runtime split 전체 완료를 뜻하지 않는다.

### 1.6 Transform Decision / Taxonomy Signal Model v1

2026-05-11 G006 기준 S5는 `app/signals/taxonomy_signals.py`, `fixtures/transform-signals-v1/manifest.json`, and ledger `transform_decision` rows로 keyword/semantic/graph/profile signal을 auditable decision으로 고정한다.

- `transform_decision`은 input/output id, method, confidence, source refs, matched terms/evidence spans, taxonomy/profile context, consumer policy, diagnostics를 저장한다.
- Corpus ingestion now records transform decisions for normalized records and relation/enrichment rows; source/raw/normalized/advisory rows remain ledger truth, while decisions explain how they were produced.
- `keyword_match`, `embedding_similarity`, `constrained_embedding_rerank`, `global_embedding_search` hits are candidate/context/ranking signals only.
- Keyword/embedding misses may report `no_candidate_returned` as a runtime observation, but cannot become `completed_no_hit`, clean pass, vulnerability truth, or negative evidence.
- `graph_expansion` rows are explicitly marked as graph-derived and are distinguishable from `direct_source_relation`, `curated_mapping`, and `provider_range_eval`.
- `profile_signal` is formalized as context-only specialization/profile enrichment; automotive profile boosts do not create vulnerability truth.
- The signal fixture forbids offline quality vocabulary inside runtime observations; TP/FP/FN/Recall/Precision/NDCG/MRR remain Golden Set-only language.

이 절은 transform-decision/signal persistence이며 Neo4j/Qdrant projection rebuild, runtime CVE split, typed GraphRAG planner/reranker 구현 완료를 뜻하지 않는다.


### 1.7 Ledger-derived Neo4j/Qdrant Projections v1

2026-05-11 G007 기준 S5는 `app/projections/ledger_projection.py` and `scripts/neo4j-seed.py`로 projection source-of-truth 방향을 ledger-first로 전환한다.

- `build_projection_bundle()` builds Neo4j threat records and Qdrant vector payloads from SQLite ledger rows (`weakness`, `vulnerability_advisory`, `tool_rule`, `package_identity`, `relation_record`, `transform_decision`).
- Projection payloads include `ledgerId`, `projectionVersion=ledger-projection-v1`, `sourceHash`, `corpusPartition`, and provenance/method metadata where available.
- `LedgerProjectionRebuilder` records `projection_job` and `projection_state` rows for `neo4j-threat` and `qdrant-threat`. Missing adapters become explicit `debt`; adapter exceptions become `failed`; successful writes become `ready`.
- `scripts/neo4j-seed.py` default path is now `--ledger-url sqlite:///data/s5-ledger.sqlite`; it no longer scrolls Qdrant metadata as Neo4j truth.
- Projection-dependent no-hit semantics remain protected by `apply_no_hit_safety`: debt/failed/stale/partial/timeout/error projection state downgrades `completed_no_hit` to `incomplete_acquisition` + `do_not_use_as_negative_evidence`.
- Neo4j and Qdrant remain projections. Synced projection state is operational readiness, not S3 claim support or quality proof.

이 절은 ledger-derived projection seam and debt reporting이며 runtime CVE split, typed GraphRAG planner/reranker/top-k tuning 구현 완료를 뜻하지 않는다.

### 1.8 CVE Candidate Evaluation / Discovery Split v1

2026-05-11 G008 기준 S5는 target-scoped CVE runtime acquisition을 candidate evaluation과 discovery로 분리한다.

- `POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve-candidate-evaluation` returns `surface="cveCandidateEvaluation"` and evaluates one explicit candidate CVE against one library/version/scope.
- `POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve-discovery` returns `surface="cveDiscovery"` and discovers public vulnerability candidates for the library/version/scope.
- `POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve` remains compatibility discovery/batch surface and keeps `surface="cve"`.
- Candidate `version_match=false` may become `completed_no_hit` only for the specific candidate CVE when exact id match, provider range evaluation, and precise provider method completeness are all satisfied. It is not library safety, not target clean, and not proof that no other CVEs exist.
- Candidate-not-returned, keyword-only miss, unknown `version_match`, stale cache, timeout, error, and conflicting version evidence are diagnostic/incomplete and use `do_not_use_as_negative_evidence`.
- Candidate range-out and discovery hit can coexist: the candidate endpoint exposes other CVEs as contextual discovery companion data, while discovery returns those CVEs as `completed_hit`.
- The SQLite ledger stores linked `acquisition_run`, `acquisition_item`, and `provider_observation` rows for candidate/discovery/compatibility calls. Observation provider names are `target_context_cve_candidate`, `target_context_cve_discovery`, and `target_context_cve_compat`.
- `app/cve/acquisition_split.py` owns the conservative method-completeness helper. Runtime CVE envelopes/tests exclude offline quality vocabulary entirely; `runtimeSemantics` exposes only `offlineQualityVocabularyPolicy=forbidden_not_enumerated_in_runtime_envelopes` plus a source-reference pointer to the canonical contract snapshot, not the offline metric terms themselves.

이 절은 runtime CVE split and readiness semantics이며 typed GraphRAG planner/reranker/top-k tuning 구현 완료를 뜻하지 않는다.

### 1.9 Typed GraphRAG Retrieval Trace / Planner v1

2026-05-11 G009 기준 S5 GraphRAG retrieval은 typed query intent, corpus partition, method provenance, and retrievalTrace를 additive runtime metadata로 제공한다.

- Threat retrieval defaults to `queryIntent=weakness_context` unless caller supplies a more specific intent. Code retrieval defaults to `code_context`.
- Canonical corpus partitions are `weakness_taxonomy`, `attack_pattern`, `mitigation_knowledge`, `tool_rule`, `package_identity`, `public_vulnerability`, `specialization_profile`, `code_graph`, and `contract_policy`; legacy aliases are normalized and recorded in trace.
- Qdrant filtering prefers projected `corpusPartition` payloads and records fallback to legacy source filters when necessary.
- Runtime method labels are canonical relation methods from the acquisition/corpus contract. Code-only match types remain on hits for compatibility but map to canonical methods in `relationMethods`.
- `global_embedding_search` is explicit, low-trust, and not eligible as negative evidence or no-hit basis.
- Target-context `threat-search` and `code-search` copy retrievalTrace into acquisition envelope results/scope so S3 can interpret no-hit readiness safely.
- Golden Set metrics remain offline-only and are reported under `qualityGate`; runtime traces do not emit TP/FP/FN/Recall/Precision/NDCG/MRR as truth language.

이 절은 typed retrieval trace/planner/reranker seam이며 live provider expansion or S3 final claim quality 구현 완료를 뜻하지 않는다.



### 1.10 RetrievalPolicy / Lexical Signal / Quality Lab v1

2026-05-11 modernization 기준 S5는 `app/graphrag/retrieval_policy.py`, `app/graphrag/lexical_signals.py`, `app/graphrag/model_registry.py`, `app/evaluation/retrieval_quality_lab.py`를 통해 typed GraphRAG runtime을 실제 적용한다.

- `top_k`는 최종 반환 건수이며, `candidate_pool_k`는 exact/vector/graph/lexical/rerank 내부 후보 풀이다.
- Threat/code GraphRAG 모두 `candidatePoolSize`, `candidatePoolPolicy`, `topKPolicy`, `rerankerPolicy`, `modelPolicy`, `lexicalSignals`, per-hit `scoreBreakdown`을 trace/hit metadata로 노출한다.
- Lexical Signal Enhancer v1은 C/C++ identifier, namespace, path, macro, dangerous API, package/CVE alias, embedded/ICS terms를 정규화한다. `keyword_match`는 candidate/ranking signal일 뿐 no-hit/negative evidence가 아니다.
- Runtime default embedding은 기존 `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`를 유지한다. Qwen3, BGE-M3, BGE reranker, Jina v4, Codestral Embed, Voyage, Cohere, OpenAI embedding candidates는 model registry에 dated research candidate로 기록한다.
- Runtime reranker는 deterministic method-aware policy이며 model-backed reranker가 아니다. Model-backed reranking/re-index는 별도 migration goal이 필요하다.
- Retrieval Quality Lab v1은 `fixtures/retrieval-quality-lab-v1/manifest.json`과 `.omx/reports/s5-retrieval-quality-lab-20260511.json`로 offline-only Precision/Recall/NDCG/MRR breakdown을 제공한다. Runtime response는 offline metric vocabulary를 truth로 노출하지 않는다.

이 절은 deterministic local retrieval modernization 적용이며 hosted/model-backed dependency migration이나 production-scale full CAPEC/ATT&CK ingestion 완료를 뜻하지 않는다.


---

## 2. 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 언어 | Python | 3.12 |
| 프레임워크 | FastAPI | 0.115.0 |
| ASGI 서버 | uvicorn | 0.30.0 |
| 그래프 DB | Neo4j Community | 5.26.3 |
| 벡터 DB | Qdrant (파일 기반) | >= 1.12.0 |
| 임베딩 | fastembed (sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) | >= 0.4.0 |
| Neo4j 드라이버 | neo4j-python | >= 5.20.0 |
| 설정 | pydantic-settings | 2.5.0 |

---

## 3. 아키텍처

### 3.1 하이브리드 GraphRAG

```
쿼리: "CWE-78 command injection popen"
  │
  ├─ 경로 1: ID 직접 조회 (Neo4j)
  │  정규식으로 "CWE-78" 추출 → 노드 속성 + 관계 조회 (score=1.0)
  │  → 이웃 노드 depth=2 확장 (score=0.8)
  │
  ├─ 경로 2: 벡터 시맨틱 검색 (Qdrant)
  │  fastembed 임베딩 → 코사인 유사도 (score=가변)
  │
  └─ 병합 + 중복 제거 + 점수 내림차순 정렬 → 응답
```

### 3.2 소스코드 GraphRAG

```
POST /v1/code-graph/{project_id}/ingest
  │ (SAST Runner /v1/functions 결과, repeatable replace)
  ├─ staging project scope 에 Neo4j/Qdrant 적재
  ├─ timeout/실패 시 이전 active graph/vector 복원 또는 partial write 제거
  ▼
Neo4j (:Function)-[:CALLS]->(:Function)  +  Qdrant code_functions (벡터 임베딩)
  │
  ├─ search (신규)     → 하이브리드: 함수명 exact + 벡터 시맨틱 + 그래프 확장 + RRF
  ├─ callers/{func}    → 역방향 BFS (호출자 체인)
  ├─ callees/{func}    → 순방향 1-hop (피호출 함수)
  └─ dangerous-callers → 위험 API(popen, system 등) 호출자 식별
```

### 3.3 모듈 구조

```
app/
├── main.py                       # FastAPI 앱, lifespan (Qdrant/Neo4j/Assembler 조립)
├── errors.py                     # observability.md 에러 포맷 헬퍼
├── config.py                     # Settings (env_prefix: AEGIS_KB_)
├── context.py                    # X-Request-Id ContextVar
├── observability.py              # JSON structured logging
├── timeout.py                    # X-Timeout-Ms 헤더 파싱 + 데드라인 체크
├── graphrag/
│   ├── knowledge_assembler.py    # 위협 하이브리드 검색 + RRF + 배치
│   ├── neo4j_graph.py            # Neo4j 위협 지식 그래프
│   ├── code_graph_service.py     # 프로젝트별 코드 호출 그래프 + origin
│   ├── code_vector_search.py     # 코드 함수 Qdrant 벡터 적재/검색 (code_functions 컬렉션)
│   ├── code_graph_assembler.py   # 코드 그래프 하이브리드 검색 (name_exact + vector + graph + RRF)
│   ├── project_memory_service.py # 프로젝트별 에이전트 메모리
│   └── vector_search.py          # 위협 Qdrant 래퍼 + source_filter
├── rag/
│   └── threat_search.py          # Qdrant 클라이언트 (search + scroll)
└── routers/
    ├── api.py                    # /v1/search, /v1/search/batch, /v1/graph/*, /v1/health, /v1/ready
    ├── cve_api.py                # /v1/cve/batch-lookup
    ├── code_graph_api.py         # /v1/code-graph/*
    └── project_memory_api.py     # /v1/project-memory/*
```

---

## 4. 데이터 모델

### 4.1 Neo4j 그래프 스키마

**노드 레이블:**

| 레이블 | 주요 속성 | 용도 |
|--------|----------|------|
| `:CWE` | id, title, source, threat_category, severity, attack_surfaces, automotive_relevance | CWE 취약점 |
| `:Attack` | id, title, source, threat_category, kill_chain_phase, automotive_relevance | ATT&CK 기법 (ICS + Enterprise) |
| `:CAPEC` | id, title, source, threat_category, severity, automotive_relevance | CAPEC 공격 패턴 (풀 노드) |
| `:Function` | name, file, line, project_id, origin?, original_lib?, original_version?, build_snapshot_id?, build_unit_id?, source_build_attempt_id? | 코드 함수 (프로젝트별, provenance seam 포함) |
| `:Project` | id | 프로젝트 (메모리 루트) |
| `:Memory` | id, type, data, createdAt, content_hash, expiresAt?, build_snapshot_id?, build_unit_id?, source_build_attempt_id? | 에이전트 메모리 (analysis_history, false_positive, resolved, preference + provenance seam) |
| `:KBMeta` | id, build_timestamp, cwe_version, attack_ics_version, attack_enterprise_version, capec_version, total_records, seed_timestamp | Ontology 버전 추적 |

**관계 타입:**

| 관계 | 소스 → 대상 | 용도 |
|------|------------|------|
| `RELATED_ATTACK` | CWE → Attack | ATT&CK 기법 연결 |
| `RELATED_CAPEC` | CWE → CAPEC | CAPEC 공격 패턴 |
| `RELATED_CWE` | CAPEC → CWE | CAPEC→CWE 매핑 |
| `RELATED_ATTACK` | CAPEC → Attack | CAPEC→ATT&CK 매핑 |
| `CALLS` | Function → Function | 함수 호출 관계 |
| `HAS_MEMORY` | Project → Memory | 프로젝트 메모리 |

**인덱스:**

```cypher
CREATE INDEX FOR (n:CWE) ON (n.id);
CREATE INDEX FOR (n:CVE) ON (n.id);
CREATE INDEX FOR (n:Attack) ON (n.id);
CREATE INDEX FOR (n:CAPEC) ON (n.id);
CREATE INDEX FOR (n:Function) ON (n.project_id, n.name);
CREATE INDEX FOR (n:Project) ON (n.id);
CREATE INDEX FOR (n:Memory) ON (n.id);
CREATE INDEX FOR (n:KBMeta) ON (n.id);
CREATE INDEX FOR (n:Memory) ON (n.content_hash);
```

### 4.2 Qdrant 벡터 DB

| 컬렉션 | 임베딩 모델 | 차원 | 내용 | 생명주기 |
|--------|------------|------|------|---------|
| `threat_knowledge` | paraphrase-multilingual-MiniLM-L12-v2 | 384 | CWE/ATT&CK/CAPEC (2,011건) | 정적 (ETL) |
| `code_functions` | (동일 모델 공유) | 384 | 프로젝트별 함수 메타데이터 | 프로젝트 ingest/delete 시 동적 |

저장 방식: 파일 기반 (서버 프로세스 없음). 단일 QdrantClient 인스턴스가 두 컬렉션을 모두 관리하지만, code GraphRAG bootstrap은 `threat_knowledge` 컬렉션 존재 여부와 분리되어 `code_functions`만으로도 초기화될 수 있다.

### 4.3 현재 데이터 규모

| 지표 | 값 |
|------|-----|
| 위협 노드 | 2,196 (CWE 944 + ATT&CK 694 + CAPEC 558) |
| 위협 관계 | 9,298 |
| CVE | ETL에서 제거됨 — `POST /v1/cve/batch-lookup`으로 실시간 조회 |

> **참고**: G007 이전 역사적 Neo4j 위협 노드와 Qdrant 레코드 수 차이는 projection 방식 차이에서 비롯되었다. G007 이후 신규 Neo4j/Qdrant projection truth는 SQLite ledger의 source hash/projection version으로 추적한다.

---

## 5. ETL 파이프라인

### 데이터 소스

| 소스 | 형식 | URL | 건수 |
|------|------|-----|------|
| CWE | XML (ZIP) | cwe.mitre.org | 944건 |
| ATT&CK | STIX 2.1 JSON | github.com/mitre-attack | 509건 (ICS 83 + Enterprise 426) |
| CAPEC | XML | capec.mitre.org | 558건 (풀 노드) |
| ~~CVE/NVD~~ | — | — | ETL에서 제거. `POST /v1/cve/batch-lookup`으로 실시간 조회 |

### 실행 절차

```bash
cd services/knowledge-base
source .venv/bin/activate

# 1. Qdrant 적재 (ETL)
python scripts/threat-db/build.py --qdrant-path data/qdrant

# 2. Neo4j 시드 (Ledger → Neo4j)
python scripts/neo4j-seed.py --ledger-url sqlite:///data/s5-ledger.sqlite --clear
```

### 자동차 관련성 분류

ETL에서 11개 공격 표면으로 분류 (`scripts/threat-db/taxonomy.py`):
- 자동차 8개: CAN Bus, IVI/헤드유닛, V2X/텔레매틱스, OTA/펌웨어, ECU/게이트웨이, 키/인증, ADAS, 충전 인프라
- 임베디드/시스템 3개: 임베디드/RTOS, 시스템 라이브러리, 산업제어/ICS

---

## 6. 인프라

### Neo4j

| 항목 | 값 |
|------|-----|
| 버전 | Neo4j Community 5.26.3 |
| Bolt | localhost:7687 |
| HTTP (Browser) | localhost:7474 |
| 인증 | neo4j / aegis-kb |

### Qdrant

| 항목 | 값 |
|------|-----|
| 타입 | 파일 기반 (동시 접근 불가) |
| 경로 | `services/knowledge-base/data/qdrant/` |

**제약**: 파일 기반 Qdrant는 단일 프로세스만 접근 가능. KB 서비스가 독점하며, 다른 서비스는 KB REST API를 통해 검색 기능을 사용한다.

---

## 7. 설정

환경변수 prefix: `AEGIS_KB_`

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `AEGIS_KB_QDRANT_PATH` | `data/qdrant` | Qdrant 파일 스토리지 경로 (file 모드) |
| `AEGIS_KB_QDRANT_URL` | (없음) | Qdrant 서버 URL (server 모드). 설정 시 path 대신 사용 |
| `AEGIS_KB_QDRANT_API_KEY` | (없음) | Qdrant 서버 인증 키 (server 모드) |
| `AEGIS_KB_RAG_TOP_K` | 5 | 검색 기본 반환 건수 |
| `AEGIS_KB_RAG_MIN_SCORE` | 0.35 | 벡터 검색 최소 유사도 |
| `AEGIS_KB_GRAPH_DEPTH` | 2 | 그래프 이웃 탐색 기본 깊이 |
| `AEGIS_KB_NEO4J_URI` | `bolt://localhost:7687` | Neo4j Bolt URI |
| `AEGIS_KB_NEO4J_USER` | `neo4j` | Neo4j 사용자 |
| `AEGIS_KB_NEO4J_PASSWORD` | `aegis-kb` | Neo4j 비밀번호 |
| `AEGIS_KB_NVD_API_KEY` | (없음) | NVD API 키 (실시간 CVE 조회용) |
| `AEGIS_KB_NVD_CACHE_TTL` | 86400 | CVE 캐시 TTL (초) |
| `AEGIS_KB_NVD_CACHE_FILE` | `data/cve-cache.json` | CVE 캐시 영속화 파일 경로 |
| `AEGIS_KB_NVD_BATCH_CONCURRENCY` | 5 | CVE 배치 병렬 조회 동시 실행 수 |
| `AEGIS_KB_EPSS_ENABLED` | true | EPSS 악용 확률 보강 on/off |
| `AEGIS_KB_KEV_TTL` | 3600 | CISA KEV 카탈로그 캐시 TTL (초) |
| `AEGIS_KB_RRF_K` | 60 | RRF 상수 (0=비활성) |
| `AEGIS_KB_MEMORY_LIMIT_PER_PROJECT` | 1000 | 프로젝트당 메모리 한도 |
| `AEGIS_KB_LEDGER_URL` | `sqlite:///data/s5-ledger.sqlite` | S5 authoritative SQLite ledger URL (G004+) |
| `AEGIS_KB_TARGET_CONTEXT_STORE_FILE` | `data/target-contexts.json` | Non-authoritative target-context compatibility mirror / migration surface |

---

## 8. Observability

- **로그**: `logs/aegis-knowledge-base.jsonl` (JSON structured, `docs/specs/observability.md` 준수)
- **service 식별자**: `s5-kb`
- **level**: 숫자 (pino 표준: 30=info, 40=warn, 50=error)
- **X-Request-Id**: 수신 시 ContextVar에 저장 → 로그에 포함 + 응답 헤더에 반환
- **Health/Ready**: `GET /v1/health` (liveness), `GET /v1/ready` (readiness + ontology 메타)

---

## 9. 테스트

```bash
cd services/knowledge-base
.venv/bin/python -m pytest tests/ -q  # 344 passed (2026-05-11 G007 debt guard fix 확인)
```

모든 테스트는 Neo4j 드라이버를 mock하여 실행 — Neo4j/Qdrant 미설치 환경에서도 통과.

| 테스트 파일 | 건수 | 대상 |
|------------|------|------|
| `test_neo4j_graph.py` | 7 | Neo4jGraph (노드/엣지 카운트, 이웃, 관계, 노드 조회, edgeTypes) |
| `test_code_graph_service.py` | 16 | CodeGraphService (적재, 호출자/피호출, 위험함수, 프로젝트 관리, origin, get_function, provenance seam) |
| `test_code_vector_search.py` | 12 | CodeVectorSearch (_build_document, ingest, search, delete, provenance metadata/filter) |
| `test_code_graph_assembler.py` | 10 | CodeGraphAssembler (빈 쿼리, name_exact, vector, RRF, call_chain, buildSnapshotId filter) |
| `test_knowledge_assembler.py` | 15 | 위협 하이브리드 검색, 중복 제거, 소스 필터링, 배치, RRF |
| `test_nvd_client.py` | 37 | 버전 매칭, 캐시, CPE 추론, 배치 병렬, EPSS, KEV, risk_score, KB 보강, 캐시 영속화 |
| `test_project_memory_service.py` | 22 | 메모리 CRUD, 타입 검증, JSON 손상 처리, lifecycle, 센티넬, 마이그레이션, provenance seam |
| `test_api_error_responses.py` | 15 | 에러 포맷, health/ready, threat-search readiness hardening |
| `test_qdrant_modes.py` | 5 | Qdrant file/server 듀얼 모드 초기화 |
| `test_benchmark_metrics.py` | 15 | 벤치마크 메트릭 (P@k, R@k, NDCG, MRR, hit rate) |
| `test_benchmark_artifacts.py` | 7 | validation set shape/coverage + sweep summary + compare/oracle summary |
| `test_golden_set_v1.py` | 10 | Golden Set v1 schema, S3 retrieval/CVE fixtures, gate separation, offline-only runtime guards |
| `test_knowledge_corpus_v1.py` | 10 | Knowledge Corpus v1 taxonomy/profile assets, weak-signal policy guards, provenance schema |
| `test_ledger_repository.py` | 7 | SQLite ledger schema/init, target-context idempotency, acquisition/provider/projection job/state/transform decision records |
| `test_target_context_ledger_integration.py` | 4 | Ledger-first target-context authority, JSON mirror failure, ledger failure no-silent-fallback |
| `test_corpus_ingestion_v1.py` | 11 | Corpus source manifest schema/hash validation, first ledger ingestion, KEV/EPSS enrichment-only semantics, transform-decision persistence |
| `test_transform_signal_model_v1.py` | 10 | Transform signal manifest, weak-signal no-hit guards, profile-signal context-only semantics, graph/direct provenance distinction |
| `test_ledger_projection_v1.py` | 7 | Ledger-derived Neo4j/Qdrant projection records, projection jobs/states/debt, Qdrant-to-Neo4j bridge removal guard |

### 벤치마크 비교 명령

```bash
cd services/knowledge-base
.venv/bin/python scripts/benchmark/run_benchmark.py --qdrant-path data/qdrant --compare-neo4j --output /tmp/s5-graph-compare.json
```

2026-04-04 기준 비교 결과:
- Qdrant-only: `ndcg_5=0.4048`, `mrr=0.4636`, `hit_rate=0.7442`
- Neo4j-enabled: `ndcg_5=0.6111`, `mrr=0.7399`, `hit_rate=0.9070`
- `ndcg_5` 기준 uplift가 확인된 query: **14 / 43**
- graph-aware oracle(`required_match_types`) 기준 full-pass는 **Qdrant-only 0/6** vs **Neo4j-enabled 6/6**

### readiness / provenance 메모

- threat search는 이제 **Qdrant + Neo4j 모두 필요**하다. Neo4j 없으면 `/v1/search`, `/v1/search/batch`, `/v1/ready`는 `503 KB_NOT_READY`.
- code GraphRAG는 동일 Qdrant client를 공유하지만, `threat_knowledge` 컬렉션 부재만으로는 초기화가 막히지 않는다. 즉 위협 GraphRAG 미준비와 code GraphRAG 미준비를 같은 의미로 취급하면 안 된다.
- code graph / project memory는 선택적으로 `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId`를 수용한다.
- 현재 code graph는 **프로젝트당 활성 그래프 1개**를 유지하며, provenance는 multi-snapshot 동시 보존이 아니라 future 확장을 위한 seam이다.

---


## 10. Health-control v2 long-running ownership/readiness plan

This section closes the S3→S5 health-control v2 follow-up as a **plan/current-state compatibility note**. It does not claim that request-aware ownership is implemented in S5 yet.

### 10.1 Current-state boundary

Current S5 runtime behavior remains finite HTTP request/response:

- `/v1/health` is liveness-only (`service`, `status`, `version`). It does not yet expose `activeRequestCount` or `requestSummary`.
- `/v1/ready` is coarse Qdrant+Neo4j readiness. It is not a per-request status endpoint.
- `X-Timeout-Ms` POST paths enforce the caller deadline and return `408 TIMEOUT` on expiry.
- `KB_NOT_READY` is operational readiness failure, not a semantic empty result.
- Code graph ingest is the only current long-operation-like path with staged commit/rollback and machine-readable `status`/`readiness` completion fields.
- No current S5 endpoint provides durable result retrieval after transport interruption.

### 10.2 Operation classes and target ownership model

| Operation class | Current implementation | Target v2 ownership direction | Recovery model decision |
|---|---|---|---|
| Threat search (`/search`, `/search/batch`) | finite response-owned query | Add request-aware health only if query latency grows beyond normal HTTP read windows; expose vector/graph stage progress | likely response-owned with deterministic retry unless future large batch search needs retained result |
| Code graph ingest | staged commit + repeatable replace | highest-priority durable/request-aware candidate; expose stage progress, cleanup/rollback, and terminal ready/partial/empty result | durable ownership preferred for large projects; repeatable replace remains fallback retry seam |
| Code graph search/dangerous-callers | finite response-owned graph/vector traversal | add request summary if traversal becomes long-running; expose traversal/vector stage and degraded index state | response-owned retry acceptable until retained result is required |
| CVE batch lookup | finite async external lookup with cache | expose per-library progress/degrade reasons if external API latency becomes long-running | cache-backed retry acceptable now; future retained result useful for slow external lookups |
| Project memory CRUD | finite Neo4j CRUD | out of primary v2 scope unless bulk memory operations are introduced | response-owned |
| `/ready` | global readiness | keep global; do not overload as request ownership | not a result channel |

### 10.3 S5 requestSummary target vocabulary

Future S5 request-aware health should use the shared v2 vocabulary without redefining meanings:

- `state=queued`: accepted but not executing yet;
- `state=running`: executing or externally waiting;
- `state=completed`: terminal result available or response completed;
- `state=failed`: terminal operational failure;
- `localAckState=phase-advancing`: stage transition or measurable local progress, such as `neo4j-stage`, `vector-stage`, `activate`, `cleanup`, batch item completed, or cache/enrichment stage advanced;
- `localAckState=transport-only`: S5 still owns the request but only transport/external wait liveness is known;
- `localAckState=ack-break`: rollback failure, storage activation failure, external client terminal failure, or other confirmed local break;
- `degraded=true`: partial but usable capability, such as Neo4j-only code ingest (`status=partial`) or cache-only CVE enrichment, when explicitly returned as such;
- `blockedReason`: non-null only for abort-driving operational failures.

### 10.4 Machine-actionable consumer rule

S5 consumers must separate **knowledge acquisition outcome** from **security evidence outcome**:

- `KB_NOT_READY`, `TIMEOUT`, future `degraded`, future `transport-only`, and `status=partial` are operational/diagnostic signals.
- They may justify `analysisOutcome=inconclusive`, caveats, retry, or reduced confidence.
- They must not be used as evidence that no relevant CWE/CVE/CAPEC/ATT&CK/code path exists.
- Successful empty payloads (`hits=[]`, `results=[]`, `cves=[]`) only mean no result for that completed query/input under the ready surface that answered.
- CVE `version_match=null` remains unknown, not safe; only `version_match=false` is a range-out signal for that specific CVE/version logic.
- Code graph `status=empty` is authoritative only for the accepted function input. If the upstream extraction was expected to produce functions, it is an extraction/input diagnostic rather than proof that no dangerous caller exists.

### 10.5 Future implementation acceptance gates

When S5 implements v2 request-aware ownership, acceptance should include:

1. Contract tests proving `GET /v1/health?requestId=...` or equivalent status surface emits only canonical `state`/`localAckState` values.
2. Tests that callers should continue on `queued`, `running + phase-advancing`, `running + transport-only`, and degraded-without-blocked.
3. Tests that callers should abort only on `ack-break`, `failed`, `blockedReason`, explicit cancel, or unrecoverable ownership loss.
4. Code graph ingest tests for long staged operations showing progress stage transitions, timeout/rollback semantics, and terminal `ready`/`partial`/`empty` result interpretation.
5. CVE/search tests proving timeout/not-ready/degraded absence is surfaced as diagnostic/inconclusive and not as negative security evidence.

### 10.6 Non-goals for this planning closeout

- This closeout does not add new S5 runtime endpoints.
- This closeout does not make `/v1/health` request-aware yet.
- This closeout does not remove current finite `X-Timeout-Ms` enforcement.
- This closeout does not introduce multi-snapshot code graph preservation; provenance remains a projection/filter seam.

## 11. 알려진 제약

| 제약 | 영향 | 비고 |
|------|------|------|
| Qdrant 파일 기반 동시 접근 불가 | KB 독점, 다른 서비스는 REST API 경유 | `AEGIS_KB_QDRANT_URL` 설정으로 서버 모드 전환 가능 |
| Neo4j Community (클러스터 불가) | 단일 인스턴스, HA 불가 | 현재 개발 환경에서는 문제 없음 |
| 코드 그래프 대규모 적재 미검증 | RE100(390노드, origin 포함)은 정상, 대규모 프로젝트 미테스트 | |
