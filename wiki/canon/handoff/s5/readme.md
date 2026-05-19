---
title: "S5. Knowledge Base 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s5-handoff/README.md"
original_path: "docs/s5-handoff/README.md"
last_verified: "2026-05-19"
service_tags: ["s5"]
decision_tags: ["judge-question-credential-url-redaction-v1", "judge-control-credential-url-redaction-v1", "judge-serving-ledger-source-context-request-redaction-v1", "judge-source-context-query-echo-redaction-v1", "source-kg-partial-resolution-selector-redaction-v1", "judge-source-kg-validator-diagnostic-payload-budget-v1", "judge-source-kg-validator-diagnostic-payload-redaction-v1", "judge-source-kg-nested-url-redaction-validator-v1", "health-control-v2", "timeout-policy", "ack-liveness", "long-running-ownership", "current-state-boundary", "judge-threat-retrieval-validator-dynamic-field-catalog-v1", "judge-threat-retrieval-validator-issue-code-coverage-v1", "judge-threat-retrieval-validator-issue-code-ast-guard-v1", "judge-threat-retrieval-runtime-diagnostic-contract-v1", "judge-threat-retrieval-runtime-diagnostic-coverage-v1", "judge-source-kg-issue-diagnostic-catalog-v1", "source-kg-serving-diagnostic-coverage-v1", "judge-source-kg-serving-diagnostic-catalog-v1", "judge-relation-conflict-issue-code-catalog-v1", "judge-forbidden-inference-policy-v1", "judge-runtime-vocabulary-policy-v1", "judge-quality-gate-policy-v1", "judge-answer-status-policy-v1", "judge-verdict-policy-v1", "judge-uncertainty-followup-policy-v1", "judge-control-effects-policy-v1", "judge-fallback-trace-policy-v1", "judge-reasoning-path-policy-v1", "judge-reasoning-path-validator-v1", "judge-reasoning-path-sequence-semantics-v1", "judge-reasoning-path-validator-case-coverage-v1", "judge-reasoning-path-validator-issue-catalog-v1", "judge-fallback-trace-validator-v1", "judge-fallback-trace-validator-issue-catalog-v1", "judge-control-effects-validator-v1", "judge-control-effects-trace-scope-v1", "judge-control-effects-trace-alignment-v1", "judge-control-effects-accepted-control-alignment-v1", "judge-control-effects-risk-signal-key-contract-v1", "judge-fallback-trace-payload-validator-v1", "judge-uncertainty-followup-validator-v1", "judge-fallback-trace-payload-cardinality-v1", "judge-uncertainty-field-shape-validator-v1"]
related_pages:
  - "wiki/canon/specs/health-control-signal-rollout-v2.md"
  - "wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md"
migration_status: "canonicalized"
---

# S5. Knowledge Base 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.** 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다.
> 이 문서는 S5(Knowledge Base) 개발을 이어받는 다음 세션을 위한 인수인계서다.
> 이것만 읽으면 현재 상태를 파악하고 바로 작업을 이어갈 수 있어야 한다.
> **마지막 업데이트: 2026-05-19 (Judge question credential URL redaction, Judge control credential URL redaction, Judge serving ledger sourceContext request redaction, Judge sourceContext query echo redaction, Source KG partial resolution selector redaction, Judge Source KG validator diagnostic payload budget, Judge Source KG validator diagnostic payload redaction, Judge Source KG nested URL redaction validator, Threat KB/Source Code KG hardening, Judge uncertainty field shape validator, Judge fallback trace payload cardinality, Judge uncertainty/follow-up validator, Judge fallback trace payload validator, Judge control effects risk-signal key contract, Judge control effects accepted-control alignment, Judge control effects trace alignment, Judge control effects trace scope, Judge control effects validator, fallback trace validator issue catalog/validator, reasoning path validator issue catalog/case coverage/sequence semantics/validator/policy, uncertainty/follow-up, verdict/status/quality gate/runtime vocabulary policy, forbidden inference, Threat Retrieval validator/runtime diagnostic 계약 반영)**

---

## 1. S5의 역할

AEGIS 플랫폼의 **위협 지식 그래프 + 코드 구조 그래프 + 실시간 CVE 조회**를 관리한다.

```
                     S2 (AEGIS Core :3000)
                    ╱     │     ╲      ╲       ╲
                 S3       S4     S5      S6      S7
               Agent    SAST    ★KB★   동적분석  Gateway
              :8001    :9000   :8002    :4000   :8000
```

### 소유

| 항목 | 경로/위치 |
|------|----------|
| 코드 | `services/knowledge-base/` |
| 포트 | :8002 |
| Neo4j | ~/neo4j-community-5.26.3 (localhost:7687/7474) |
| Qdrant | `services/knowledge-base/data/qdrant/` (파일 기반) |
| ETL 캐시 | `services/knowledge-base/data/threat-db-raw/` |

### 호출자

| 호출자 | 용도 |
|--------|------|
| **S3 Analysis Agent** | Phase 1: 코드 그래프 적재 + CVE 배치 조회 + 프로젝트 메모리, Phase 2: `knowledge.search` 도구 호출 |
| **S2 Backend** | 프로젝트 메모리 CRUD, Finding 상세에서 CWE/CVE 관계 조회 |

### Codex / OMX 운영 메모

- 하드 가드레일 재확인:
  - S5는 **다른 서비스 코드를 읽지 않는다**.
  - 다른 서비스와의 소통은 **WR로만** 한다.
  - 연동 판단은 API 계약서만 보고, 계약이 비었거나 낡았으면 담당자에게 WR을 보낸다.
  - **커밋은 하지 않는다**. 커밋은 S2 세션만 한다.
  - `scripts/start*.sh`, `scripts/stop*.sh`, 서비스 기동 명령은 **사용자 허락 없이 실행하지 않는다**.
  - 로그/장애 분석은 `log-analyzer` MCP를 우선 사용한다.
- 장기 S5 작업 메모와 후속 세션 인계는 `$note`, `wiki/canon/handoff/s5/`, session log를 우선 사용한다.
- 공용 `.omx/notepad.md`, `.omx/project-memory.json`은 **여러 lane이 공유하는 전역 durable 메모리**로 간주한다.
  - 여기에 남기는 내용은 **전역 규칙, cross-lane에 실제 필요한 장기 사실, 공통 검증 결과**로 제한한다.
  - **S5 전용 작업 메모, 중간 추론, 세부 TODO, 세션 한정 장문 기록**은 공용 `.omx` 대신 `wiki/canon/handoff/s5/`, `wiki/canon/work-requests/`, `.omx/state/sessions/{session-id}/...`에 남긴다.
  - 공용 `.omx`에 기록할 때는 가능하면 **날짜 + S5 + 메모 성격(전역 규칙/장기 사실/검증 결과)**를 명시한다.
- **`$ralph`**: ETL, search readiness, provenance seam, 검색 품질, CVE enrichment처럼 한 축을 끝까지 파고드는 작업에 우선 사용한다.
- **`$team`**: S3(GraphRAG 호출), S4(SCA/CVE 입력), S7(LLM 소비), S2(프로젝트 메모리/API 계약)와 병렬로 맞춰야 할 때 우선 사용한다.
- **`$trace`**: 이전 Codex/OMX 세션의 데이터 품질 점검, 장애 분석, 판단 흐름 복기에 사용한다.
- WR 런타임 확인은 `list_my_open_wrs(lane="S5", include_to_all=true)`와 `wiki/canon/work-requests/**`를 기준으로 한다. `docs/work-requests/**`는 archive-only이며 WR MCP 런타임 대상이 아니다.
- 2026-05-08 S3→S5 health-control v2 follow-up 처리 메모:
  - WR: `wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md`
  - 처리 성격: **plan/current-state compatibility delivered**, runtime v2 implementation은 아직 아님.
  - 반영 문서: `wiki/canon/api/knowledge-base-api.md`의 health-control v2 current-state boundary, `wiki/canon/specs/knowledge-base.md`의 long-running ownership/readiness plan.
  - 현재 S5 `/v1/health`는 liveness-only이고 `/v1/ready`는 global readiness-only다. `requestSummary`/durable result retrieval/cancel은 future implementation seam이다.
  - S3/S2 소비자 규칙: `KB_NOT_READY`, `TIMEOUT`, future degraded/transport-only, code graph `partial`/unexpected `empty`는 operational diagnostic 또는 inconclusive context이며 negative security evidence가 아니다.
  - 향후 구현 WR이 열리면 code graph ingest를 1순위 durable/request-aware 후보로 보고, search/CVE는 latency 증가 시 response-owned retry 또는 retained-result 모델 중 하나를 명시한다.
- 최신 S2 회신 WR: `wiki/canon/work-requests/s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared.md`
- 최신 S3 회신 WR: `wiki/canon/work-requests/s5-to-s3-search-readiness-and-provenance-update.md`
- 최신 작업 세션 기록: `wiki/canon/handoff/s5/session-omx-1778663363090-gw9lq6.md` (Threat KB/Source Code KG/Judge 계약 hardening + full KB 670-pass 검증 + Critic ACCEPT 기록)
- 직전 마감 세션 기록: `wiki/canon/handoff/s5/session-omx-1776068998838-lap2tj.md` (Quick-stage code-graph / GraphRAG capability contract 구현 + 문서/검증 + closeout sync)
- skill을 써도 **다른 서비스 코드를 보는 대신 계약서와 work-request로 소통**한다.

---

## 2. 아키텍처 개요

### 프로젝트별 2개의 GraphRAG

- **중요**: S5는 `threat_knowledge` 기반 위협 GraphRAG와 `code_functions` 기반 code GraphRAG를 **동시에** 운영한다. 둘은 같은 서비스와 같은 Qdrant client를 공유하지만, 2026-04-14부터 code GraphRAG bootstrap은 `threat_knowledge` 컬렉션 존재 여부와 분리된다.

| GraphRAG | 내용 | Qdrant 컬렉션 | 생명주기 |
|----------|------|--------------|---------|
| **소스코드 GraphRAG** | Function 벡터 임베딩 + Neo4j CALLS 관계 | `code_functions` | 프로젝트 ingest/delete 시 동적 |
| **취약점 GraphRAG** | CWE ↔ ATT&CK ↔ CAPEC (정적) + CVE (실시간) | `threat_knowledge` | 정적=ETL, CVE=실시간 |

### 하이브리드 검색 (KnowledgeAssembler)

```
쿼리 → KnowledgeAssembler.assemble()
  ├─ _path_id_exact(): ID 정규식 추출 → Neo4j 직접 조회 + 이웃 확장
  ├─ _path_vector_semantic(): Qdrant 벡터 유사도 검색
  ├─ _enrich_with_graph(): 각 hit에 Neo4j 관계 보강
  └─ RRF 점수 융합 (k=60) + 중복 제거 → 응답
```

### 실시간 CVE 조회 (NvdClient)

NvdClient 3단계 전략:
1. **OSV.dev commit 기반** — 가장 정밀
2. **NVD CPE 기반** — 정밀
3. **NVD keywordSearch 폴백** — 넓은 검색

보강: KB 지식 보강(`kb_context`) + 복합 위험 점수(`risk_score`: CVSS 40%+EPSS 30%+KEV 20%+도메인 10%) + 캐시 영속화(`data/cve-cache.json`)

---

## 3. API 엔드포인트

### 위협 지식 검색

| 메서드 | 경로 | 용도 |
|--------|------|------|
| POST | `/v1/search` | 하이브리드 검색 |
| POST | `/v1/search/batch` | 배치 검색 (최대 20쿼리) |
| GET | `/v1/graph/stats` | 위협 그래프 통계 (edgeTypes 포함) |
| GET | `/v1/graph/neighbors/{node_id}` | CWE/ATT&CK/CAPEC 관계 탐색 |

### 실시간 CVE 조회

| 메서드 | 경로 | 용도 |
|--------|------|------|
| POST | `/v1/cve/batch-lookup` | NVD CVE 실시간 조회 (version_match + risk_score) |

### 코드 그래프

| 메서드 | 경로 | 용도 |
|--------|------|------|
| POST | `/v1/code-graph/{project_id}/ingest` | 함수 목록 → Neo4j + Qdrant 동시 적재 (repeatable replace + readiness/status 반환) |
| POST | `/v1/code-graph/{project_id}/search` | 하이브리드 시맨틱 검색 |
| GET | `/v1/code-graph/{project_id}/callers/{func}` | 호출자 체인 |
| GET | `/v1/code-graph/{project_id}/callees/{func}` | 피호출 함수 |
| POST | `/v1/code-graph/{project_id}/dangerous-callers` | 위험 함수 호출자 |
| GET | `/v1/code-graph/{project_id}/stats` | 그래프 통계 |
| DELETE | `/v1/code-graph/{project_id}` | 프로젝트 그래프 삭제 |
| GET | `/v1/code-graph` | 등록된 프로젝트 목록 |

### 프로젝트 메모리

| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/v1/project-memory/{project_id}` | 메모리 조회 (타입 필터) |
| POST | `/v1/project-memory/{project_id}` | 메모리 생성 |
| DELETE | `/v1/project-memory/{project_id}/{memory_id}` | 메모리 삭제 |

### 기타

| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/v1/health` | liveness probe |
| GET | `/v1/ready` | readiness probe — Qdrant+Neo4j 상태 + ontology 메타 |

---

## 4. 현재 데이터 규모

| 지표 | 값 |
|------|-----|
| Neo4j 위협 노드 | 2,196 (CWE 944 + ATT&CK 694 + CAPEC 558) |
| Neo4j 위협 관계 | 9,298 |
| Qdrant 레코드 | 2,011 (CWE 944 + ATT&CK 509 + CAPEC 558) |
| ATT&CK→CWE 교차 참조 | 118건/509건 (23%) |

> Neo4j(2,196)와 Qdrant(2,011)의 차이는 시드 시 교차 참조 대상이 추가 노드로 생성되기 때문.

---

## 5. 인프라

### Neo4j

| 항목 | 값 |
|------|-----|
| 버전 | Neo4j Community 5.26.3 |
| Bolt | localhost:7687 |
| 인증 | neo4j / aegis-kb |

### Qdrant

| 항목 | 값 |
|------|-----|
| 타입 | 파일 기반 (서버 프로세스 없음) |
| 임베딩 모델 | `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (384차원) |

---

## 6. 실행

```bash
# 기동 스크립트 (Neo4j 자동 기동 포함)
scripts/start-knowledge-base.sh

# 확인
curl http://localhost:8002/v1/health
```

---

## 7. 테스트

```bash
.venv/bin/python -m pytest tests/ -q  # 710 passed (2026-05-19)
```

2026-05-19 KST 현재 S5 full suite 기준은 **712 passed in 464.57s**이며, 최신 focused S5/Judge/Source KG suite는 다음 범위로 **276 passed in 292.72s**를 기록했다:

```bash
.venv/bin/python -m pytest \
  tests/test_threat_retrieval_evidence_v1.py \
  tests/test_source_code_kg_v1.py \
  tests/test_source_code_kg_contract_v1.py \
  tests/test_judge_answer_contract_v1.py \
  tests/test_judge_api_contract_v1.py \
  tests/test_relation_conflict_model_v1.py \
  tests/test_analyst_brief_v1.py \
  tests/test_target_context_api.py -q
```

최신 Judge 계약 검증은 `GET /v1/contracts/judge`의 Judge reasoning path policy(`reasoningPath` step/status required fields, fixed runtime step catalog, catalog is allowed vocabulary not mandatory per-response sequence, cache hits may omit affectedness steps, trace is explainability not security verdict)와 Judge answer validator issue catalog/enforcement(all known `REASONING_PATH_*` issue codes, missing/non-list path, non-object entry, missing `step`/`status`, unknown step 값을 계약 위반으로 보고), Judge fallback trace policy/validator issue catalog(non-silent `fallbackTrace`, known source-context/control-validation fallback vocabulary, payload requirements for non-empty `partial_context_resolution.diagnostics[]` and non-empty `unsupported_controls_rejected.rejected[]`, all known `FALLBACK_TRACE_*` issue codes, rejects malformed/silent/unknown/payload-incomplete fallback trace entries, not negative evidence), Judge control effects policy/validator(`appliedControls`/`controlEffects` locations, `exclude` suppression locations, `controlEffects` trace required for `evidence.suppressedAffectedness`, exact trace alignment between suppressed affectedness `advisoryId`/`advisoryExternalId` and control-effect `suppressedAdvisoryIds`/`suppressedExternalIds`, accepted-control alignment requiring each suppressed affectedness item to be explained by `appliedControls.accepted.exclude` through `advisoryId`/`advisoryExternalId` or risk-signal `payload.cve`/`payload.cveID`, threat-retrieval-only suppression trace owned by `answer.threatRetrievalPolicies.suppressedCandidateResponseBudget`, malformed control effects rejected, suppressed-all affectedness becomes `unknown`/`requires_requery`, suppression is not negative evidence), Judge uncertainty/follow-up policy(`uncertainty` required fields and fieldShapePolicy, required-input vocabulary, follow-up request kinds/owner lanes, validator issue catalog with all known `UNCERTAINTY_*`/`FOLLOW_UP_*` issue codes, rejects missing uncertainty fields, empty required reason for unknown/non-complete answers, invalid evidenceGaps/conflicts shapes, non-dict uncertainty containers, malformed uncertainty/follow-up/conflict child containers and entries without crashing later validation paths, Source KG degraded answers missing source-context evidence gaps, unknown requiredInputs, malformed follow-up affordances, unknown requestKind/ownerLane, missing reason, not negative evidence), Judge answer field policy(top-level container shape policy, malformedPacketRobustnessPolicy, and all known `JUDGE_ANSWER_*` issue codes, rejects non-dict `cacheTrace`/`queryContext`/`evidence`/`evidence.sourceCodeKg`/`appliedControls`, requires present cacheTrace dict scope/revision fields, exposes representative broad malformed answer packet coverage with contract/test drift guards, and tolerates Threat Retrieval/Source KG evidence list entries plus core answer containers without validator exceptions, not negative evidence), Analyst Brief acquisition artifact echo budget(generic acquisition diagnostics capped at 64 with warning preview 8, missing inputs capped at 16, source/derived evidence refs capped at 64 each with count metadata, identity/state echoes capped at 128 chars, method-list echoes capped at 32 entries/128 chars, and scope forbidden-inference echoes capped at 32 entries/128 chars with redaction/truncation warnings) and Judge question echo exposes `questionEchoPolicy.credentialBearingUrlRedaction=true`, Judge control echo exposes `credentialBearingUrlRedaction=true` and redacts credential-bearing URL values/keys across response and serving-ledger `requestPacket`/`answerPacket` packets plus unsupported control echo bytes capped at 16384 for many-small-value objects, and Judge answer consumption guard and contract(`s5-judge-answer-v1` artifacts are translated to `judge_verdict_context_only`, `/v1/contracts/analyst-brief` freezes the policy and drift guards, `affected` remains context not final verdict, `not_affected` remains not clean pass, unknown/unsupported-verdict/unsupported-status/unsupported-quality-gate/missing-status/requery/degraded/caveated answers become diagnostics and unknown forbids absence claims with missing-input/requery/follow-up actions, missing final-verdict authority boundary blocks use, Judge scalar verdict/status/gate echoes are capped at 128 chars, canonical `sourceRepositoryArtifactId` refs trigger S3 validation, Source KG ref echoes are capped at 64 with truncation warning plus total/returned/truncated counters, individual ref echoes over 512 chars are redacted after raw-ref dedupe/counting, oversized Judge diagnostic codes and required inputs are redacted plus cardinality-bounded (diagnostic codes 64 with warning preview 8, required inputs 16) with count/truncation metadata, and follow-up affordance plus uncertainty conflict child fields are presence-only/non-echoed), Judge verdict policy(allowed verdicts `affected`/`not_affected`/`unknown`, reserved `conflicting`, conflict is represented by `uncertainty.conflicts` + rejected quality gate, `not_affected` is not clean pass), Judge answer status policy(allowed statuses `complete`/`degraded_quality`/`requires_requery`/`insufficient_input`, reserved `stale_cache`/`policy_blocked`, non-complete statuses are not negative evidence), Judge quality gate policy(allowed gates `accepted`/`accepted_with_caveats`/`rejected`, merge precedence `rejected > accepted_with_caveats > accepted`, S5 runtime quality not S3 final verdict), Judge runtime vocabulary policy(`runtimeVocabularyCount` parity, offline quality metric vocabulary forbidden, runtime terms are not S3 final-claim labels), Judge forbidden inference policy(5 baseline forbidden S3 final inferences), Judge relation conflict issue-code catalog(4 conflict issue codes), Judge Source KG serving diagnostic catalog(mirrors 5 ledger SOURCE_KG_CONTEXT_* codes), Source KG nested URL values/keys redacted in served small nested objects, `servingContextResolution.partialResolutionEchoPolicy` exposes partial resolution requested/missing selector ID redaction, `answer.sourceCodeKgContextResolution.queryContextSourceContextEchoPolicy` redacts credential-bearing Source KG selector values from Judge `queryContext.sourceContext`, `canonicalQuery.normalized.sourceContext`, and `servingLedger.requestPacket.sourceContext` echoes, and Judge validation rejects corrupted nested URL values/keys with safe recursively redacted and size-bounded Source KG validator issue payload IDs, Source KG serving diagnostic coverage(5 ledger SOURCE_KG_CONTEXT_* codes), Source KG issue/diagnostic catalog(12 known Judge SOURCE_KG_* codes, non-negative-evidence policy), Threat Retrieval runtime diagnostics(`THREAT_RETRIEVAL_NO_CONTEXT` is inconclusive, not negative evidence, with diagnosticCodeCoverage drift guard), validator field path policy, dynamic field issue catalog, 그리고 `issueCodeCoverage`(43 known = 37 static + 6 dynamic)를 포함한다. 새 `THREAT_RETRIEVAL_*` validator issue code가 추가되면 `issueFieldsByCode ∪ dynamicFieldIssueCodes` 계약 catalog에 반영되어야 하며, `tests/test_judge_api_contract_v1.py::test_judge_contract_covers_every_threat_retrieval_validator_issue_code`가 이 drift를 막고, helper regression은 AST string-literal scan으로 single/double quote style 모두를 포착한다.

| 테스트 파일 | 건수 | 대상 |
|------------|------|------|
| test_neo4j_graph.py | 7 | Neo4jGraph mock (edgeTypes 포함) |
| test_code_graph_service.py | 18 | CodeGraphService mock + overwrite semantics + origin + provenance seam + optional provenance warning 회귀 |
| test_code_vector_search.py | 12 | CodeVectorSearch + provenance metadata/filter |
| test_code_graph_assembler.py | 10 | CodeGraphAssembler + buildSnapshotId filter 전달 |
| test_knowledge_assembler.py | 15 | 위협 하이브리드 검색 + RRF |
| test_nvd_client.py | 37 | CVE 조회 + EPSS/KEV/risk_score |
| test_project_memory_service.py | 23 | 메모리 CRUD + lifecycle + 센티넬 + provenance seam + optional provenance warning 회귀 |
| test_api_error_responses.py | 15 | 에러 포맷 + health/ready + threat-search readiness hardening |
| test_api_contract.py | 69 | 성공 응답 contract + Quick-stage ingest ready/partial/empty/repeatable replace semantics |
| test_qdrant_modes.py | 5 | Qdrant file/server 듀얼 모드 초기화 |
| test_benchmark_metrics.py | 15 | 벤치마크 메트릭 (P@k, R@k, NDCG, MRR) |
| test_benchmark_artifacts.py | 7 | validation set shape/coverage + sweep summary + graph compare/oracle summary |

벤치마크 validation set은 현재 **45 queries**이며:
- `scripts/benchmark/sweep.py`는 CSV와 JSON 요약 출력을 지원한다.
- `scripts/benchmark/run_benchmark.py --compare-neo4j`는 **Qdrant-only vs Neo4j-enabled** 비교와 query uplift 요약을 지원한다.
- 2026-04-04 비교 실행 기준, **Qdrant-only → Neo4j-enabled**에서 `ndcg_5` **0.4048 → 0.6111**, `mrr` **0.4636 → 0.7399**, `hit_rate` **0.7442 → 0.9070**로 상승했고, `ndcg_5` 기준 개선된 쿼리는 **14/43개**였다.
- 같은 날 수행한 **Neo4j-enabled 36조합 sweep**(`min_score 0.25~0.4`, `neighbor_score 0.7~0.9`, `rrf_k 30/60/100`)도 전 구간에서 동일한 `ndcg_5=0.6111`, `mrr=0.7399`를 보여, 현재 병목은 파라미터보다 validation set 구분력 쪽에 더 가깝다.
- validation set에는 이제 일부 exact/graph query에 대해 `required_match_types` oracle이 들어가며, compare 실행 기준 **Qdrant-only oracle full-pass 0.0000 → Neo4j-enabled 1.0000**로 graph path 존재 여부를 직접 검증할 수 있다.
- threat search는 이제 **Neo4j 필수**다. Neo4j가 없으면 `/v1/search`, `/v1/search/batch`, `/v1/ready` 모두 `503 KB_NOT_READY`.
- code graph / project memory는 선택적으로 `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId` provenance를 수용한다.
- 2026-04-07 기준, legacy `Function`/`Memory` 노드에 provenance property가 아예 없는 경우에도 `properties(node)['...']` map access로 조회해 Neo4j `01N52 property key does not exist` warning을 줄였다. **계약 변화는 없고 lane-local 수정**이다.
- 현재 code graph는 **프로젝트당 활성 그래프 1개** 모델이며, provenance는 지금 단계에서 multi-snapshot 동시 보존이 아니라 **projection/filter seam**이다.
- 2026-04-13 기준 Quick-stage caller contract는 `POST /v1/code-graph/{project_id}/ingest` 응답의 `operation`, `status`(`ready`/`partial`/`empty`), `readiness.graphRag`를 authoritative completion signal로 사용한다. S2는 `status == "ready"` 그리고 `readiness.graphRag == true`일 때만 다음 단계로 진행해야 한다.

---

## 8. 관련 문서

| 문서 | 경로 |
|------|------|
| 공통 제약 사항 | `wiki/canon/charter/aegis.md` |
| KB API 계약서 | `wiki/canon/api/knowledge-base-api.md` |
| KB 명세서 | `wiki/canon/specs/knowledge-base.md` |
| **아키텍처 상세** | `wiki/canon/handoff/s5/architecture.md` |
| 최신 작업 세션 | `wiki/canon/handoff/s5/session-omx-1778663363090-gw9lq6.md` |
| 직전 마감 세션 | `wiki/canon/handoff/s5/session-omx-1776068998838-lap2tj.md` |
| S2 회신 WR | `wiki/canon/work-requests/s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared.md` |
| S3 회신 WR | `wiki/canon/work-requests/s5-to-s3-search-readiness-and-provenance-update.md` |
| **로드맵** | `wiki/canon/roadmap/s5-roadmap.md` |
| **세션 로그** | `wiki/canon/handoff/s5/session-{1~20}.md` |
