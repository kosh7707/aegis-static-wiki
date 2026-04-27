---
title: "S3. Analysis Agent 기능 명세"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/analysis-agent.md"
last_verified: "2026-04-27"
service_tags: ["s3"]
decision_tags: ["structured-output", "analysis-agent", "contract", "http-status", "state-machine", "agent-v1.1"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/api/analysis-agent-api.md"]
---

# S3. Analysis Agent 기능 명세

> **소유자**: S3
> **최종 업데이트**: 2026-04-27

Analysis Agent는 자동차 임베디드 소프트웨어에 대해 **결정론적 Phase 1 + 구조화된 Phase 2 + strict structured finalization + state-machine outcome classification**을 수행하는 증거 기반 보안 심층 분석 서비스다.

2026-04-25 system-stability 기준으로, 이 문서의 이전 2026-04-21 "finalizer/repair failure는 terminal task failure" 표현은 valid-input/live-runtime S3-owned deficiency에 대해서는 폐기되었다. 현재 canonical rule은 `wiki/canon/api/analysis-agent-api.md` 및 state-machine API decision page가 우선한다: S3가 schema-valid honest envelope를 조립할 수 있으면 completed result-level outcome으로 반환한다.

---

## 1. 핵심 원칙

1. **결정론적 우선** — SAST / 코드그래프 / SCA / KB 보강은 가능한 한 LLM 없이 수행한다.
2. **Evidence-first** — claim은 supplied/allowed evidence ref 안에서만 성립한다.
3. **LLM 표면 최소화** — LLM은 해석과 후속 도구 선택을 담당하고, 최종 JSON은 별도 finalization 단계로 강제한다.
4. **S7 단일 관문** — 모든 LLM 호출은 S7 Gateway 경유다.
5. **non-JSON silent success 금지** — 반복 non-JSON 최종 출력은 strict finalizer/RecoveryTriage를 거치며, S3가 honest envelope를 조립할 수 있으면 completed negative/inconclusive outcome으로 반환한다. envelope 조립 자체가 불가능하거나 dependency/runtime이 unavailable이면 task failure다.
6. **HTTP/task outcome 정렬** — `/v1/tasks`는 동기 endpoint이므로 true terminal task failure를 HTTP 200으로 숨기지 않는다.
7. **public surface 안정성 우선** — `/v1/tasks`, `/v1/health`, `/v1/models`, `/v1/prompts` top-level 의미를 내부 리팩토링으로 깨지 않는다.

---

## 2. 공개 엔드포인트

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `deep-analyze`, `generate-poc` |
| GET | `/v1/health` | 서비스 상태 + prompt/version + KB/LLM 상태 + request-aware summary |
| GET | `/v1/models` | model profile 목록 |
| GET | `/v1/prompts` | prompt 목록 |

`/v1/tasks` task outcome과 HTTP status의 canonical 관계:

| outcome | HTTP | machine signal |
|---|---:|---|
| `completed` | `200` | `X-AEGIS-Task-Ok: true` |
| `validation_failed` / `empty_result` / unsafe output | `422` | `X-AEGIS-Task-Ok: false`, `failureCode` |
| `budget_exceeded` | `413` | `X-AEGIS-Task-Ok: false`, `failureCode` |
| `timeout` | `504` | `X-AEGIS-Task-Ok: false`, `failureCode` |
| `model_error` | `503` | `X-AEGIS-Task-Ok: false`, `failureCode` |

---

## 3. 공개적으로 보호되는 동작

다음은 S2-visible protected surface다.

1. `/v1/health.activePromptVersions`
   - `deep-analyze: agent-v1`
   - `generate-poc: v1`
2. `/v1/health.activeRequestCount` 와 `requestSummary`
   - additive control-signal block으로 제공
   - coarse health 필드를 대체하지 않는다
3. legacy taskType은 Analysis Agent가 직접 처리하지 않고 `UNKNOWN_TASK_TYPE`로 거절한다.
4. `deep-analyze`와 `generate-poc`의 top-level request/response body shape는 유지한다.
5. `/v1/tasks` terminal failure는 non-2xx HTTP status와 `X-AEGIS-Task-Ok: false`/`X-AEGIS-Task-Status` headers를 함께 반환한다.
6. analysis 결과는 구조화 JSON + audit 정보를 유지한다.
7. `schemaVersion=agent-v1.1`은 response schema/API contract label이며 promptVersion이 아니다. `/health.activePromptVersions`는 prompt identity를 유지한다.
8. `policyFlags`에 `structured_finalizer`가 있으면 최종 JSON은 strict finalizer repair path를 거쳤다는 의미다.

---

## 4. 현재 내부 아키텍처

### Router / Handler 레이아웃

| 역할 | 파일 |
|---|---|
| public router | `services/analysis-agent/app/routers/tasks.py` |
| deep-analyze handler | `services/analysis-agent/app/routers/deep_analyze_handler.py` |
| generate-poc handler | `services/analysis-agent/app/routers/generate_poc_handler.py` |

`tasks.py`는 얇은 public router이며, handler 모듈로 위임한다. 기존 테스트/호환성을 위해 `_handle_deep_analyze`, `_handle_generate_poc`, `_pipeline`, `_rebuild_pipeline` seam은 유지한다.

### Phase 1 레이아웃

| 역할 | 파일 |
|---|---|
| compatibility surface | `services/analysis-agent/app/core/phase_one.py` |
| executor façade | `services/analysis-agent/app/core/phase_one_executor.py` |
| orchestration flow | `services/analysis-agent/app/core/phase_one_flow.py` |
| shared types/constants | `services/analysis-agent/app/core/phase_one_types.py` |
| execution helpers | `services/analysis-agent/app/core/phase_one_exec.py` |
| KB/CVE/project-memory helpers | `services/analysis-agent/app/core/phase_one_kb.py` |
| prompt/render helpers | `services/analysis-agent/app/core/phase_one_prompt.py` |

### 기타 핵심 컴포넌트

| 역할 | 파일 |
|---|---|
| agent loop + strict finalizer | `services/analysis-agent/app/core/agent_loop.py` |
| result assembly | `services/analysis-agent/app/core/result_assembler.py` |
| service-local async-aware caller | `services/analysis-agent/app/agent_runtime/llm/caller.py` |
| legacy real client | `services/analysis-agent/app/clients/real.py` |
| direct eval helper | `services/analysis-agent/eval/eval_runner.py` |
| tool router | `services/analysis-agent/app/tools/router.py` |
| service-local router core | `services/analysis-agent/app/agent_runtime/tools/router_core.py` |


### Producer / Critic / Orchestrator boundary (2026-04-26)

S3는 Analysis Agent 내부를 다음 service-local 역할 표면으로 정렬한다.

| 역할 | 현재 표면 | 권한 경계 |
|---|---|---|
| Producer | `services/analysis-agent/app/producers/`, producer-safe portions of handlers/agent loop | candidate claim/PoC artifact 작성, producer diagnostics만 허용 |
| Critic / QualityGate | `services/analysis-agent/app/quality/` | deep/PoC quality classification과 repair-planning. Evidence fabrication 금지 |
| Orchestrator / State Machine | `services/analysis-agent/app/state_machine/`, final envelope assembly path | RecoveryTriage, completed-vs-task-failure boundary, final envelope authority |
| Service-local runtime | `services/analysis-agent/app/agent_runtime/` | former shared-runtime primitive helper의 local copy/specialization |

former shared-runtime package는 더 이상 Analysis Agent runtime/test dependency가 아니다.

---

## 5. Phase 1 의미

Phase 1은 아래를 결정론적으로 수행한다.

1. SAST 스캔
2. 코드 그래프 추출
3. SCA 라이브러리 식별
4. CVE batch lookup
5. KB threat query
6. dangerous-callers query
7. project-memory lookup
8. code-graph ingest

`buildCommand`가 있으면 `build-and-analyze` 경로를 우선 사용하고, 실패 시 individual tools로 fallback한다.

### explicit-step alias 입력
- preferred Deep 입력은 flat 필드 나열보다 `buildPreparation` / `quickContext` / `graphContext` 같은 explicit-step bundle이다.
- `buildPreparation`은 Build Agent 산출물을 Deep에 전달하는 명시적 alias다.
- `quickContext`는 Quick에서 이미 확보한 `sastFindings` / `scaLibraries` 등을 다시 전달해 Phase 1 재실행을 줄일 때 사용한다.
- 기존 flat `buildCommand`, `buildEnvironment`, `buildProfile`, `provenance`, `sastFindings`, `scaLibraries`는 compatibility surface로 유지한다.

### S5 소비 정렬
S3는 S5 runtime semantics를 정확히 소비한다.

- `408 TIMEOUT` 과 `503 KB_NOT_READY` 를 구분한다.
- code-graph ingest 응답의 `status` / `readiness` / `warnings`를 실제로 읽는다.
- `neo4jGraph=false`가 명시되면 `dangerous-callers`를 실행하지 않는다.
- GraphRAG/vector readiness가 명시적으로 false면 phase-2 `code_graph.search`를 LLM tool surface에서 제거한다.
- 이로 인해 S5 부재/timeout/partial readiness가 **negative evidence처럼 오해되지 않도록** prompt에 caveat가 들어간다.

---

## 6. Phase 2 의미

Phase 2는 Phase 1 결과를 프롬프트에 주입한 뒤 구조화된 LLM 루프를 수행한다.

사용 가능한 핵심 도구:
- `knowledge.search`
- `code_graph.callers`
- `code_graph.callees`
- `code_graph.search`
- `code.read_file`
- `build.metadata`

LLM 결과는 `ResultAssembler`와 evidence validation/sanitizer를 거친 뒤 응답으로 조립된다.

### Strict structured finalization (2026-04-21)

S3는 최종 Assessment JSON의 신뢰성을 prompt-only 규칙에 맡기지 않는다.

1. LLM content가 non-JSON이면 structured retry를 1회 수행한다.
2. retry 후에도 non-JSON이면, 도구를 제거한 별도 strict finalizer call을 실행한다.
3. valid JSON이어도 required top-level fields 또는 claim-level fields가 누락되거나 wrong type이면 strict schema repair를 1회 수행한다. Required fields에는 `summary`, `claims`, `caveats`, `usedEvidenceRefs`, `suggestedSeverity`, `needsHumanReview`, `recommendedNextSteps`, `policyFlags`와 각 claim의 `statement`, `detail`, `supportingEvidenceRefs`, `location`이 포함된다.
4. finalizer/repair call은 S7 strict JSON mode를 사용한다. `LlmCaller`는 tool-less 호출에서 `response_format={"type":"json_object"}`와 `X-AEGIS-Strict-JSON` 헤더를 사용한다.
5. finalizer/repair output은 일반 결과처럼 `ResultAssembler`, schema validator, evidence validator를 통과해야 한다.
6. unsupported/hallucinated evidence ref는 fuzzy correction 또는 fallback injection으로 권한 부여하지 않는다. raw evidence validation에서 실패하면 `INVALID_GROUNDING`으로 실패한다.
7. finalizer/repair도 실패하면 `completed`가 아니라 실패 응답을 반환하며, `/v1/tasks`는 해당 terminal failure를 non-2xx HTTP status로 반환한다.
8. finalizer/repair가 성공하면 `policyFlags`에 `structured_finalizer`가 포함될 수 있으며, consumer는 이를 repair-path 신호로 취급한다.

이 설계는 반복 non-JSON, missing required fields, malformed claims, unsupported evidence를 deterministic completed fallback이나 silent normalization으로 숨기지 않는다.

### S7 async ownership 소비
S3는 tool 없는 LLM 호출에서 S7의 async ownership surface를 우선 사용한다.

적용 범위:
- analysis-agent agent loop의 tool-less/final turns
- strict structured finalizer turns
- `generate-poc`
- analysis-agent legacy `RealLlmClient` / `TaskPipeline`
- analysis-agent `eval_runner`

동작 원칙:
- async ownership surface 사용 시 submit → status poll → result fetch로 처리
- async surface가 unavailable이면 sync `/v1/chat`로 fallback
- unsupported async surface(404/405/501)는 짧게 cooldown 캐시하여, 매 호출마다 같은 probe를 반복하지 않도록 한다

---

## 7. Generate-PoC 안정화

`generate-poc`는 2026-04-21 기준 다음 hardening을 적용한다.

- 누락된 required top-level 필드(`caveats`, `usedEvidenceRefs`, `policyFlags` 등)나 malformed claim 구조는 안전 기본값으로 normalize하지 않고 strict schema repair를 1회 수행한다. repair retry 전 S3가 deterministic Assessment scaffold를 만들며, `summary`/`claims[].statement`/`claims[].detail`은 보존하고 missing `location`/`supportingEvidenceRefs`/`usedEvidenceRefs`는 trusted input claim refs 또는 request evidence refs에서 복원한다.
- LLM repair output이 같은 invalid shape를 반복하더라도 S3 scaffold shape를 보존한 뒤 재검증한다. repair 후에도 required field/type/claim shape가 invalid이면 `validation_failed / INVALID_SCHEMA`로 실패한다.
- unsupported/hallucinated evidence ref는 fuzzy correction 또는 trusted fallback injection으로 보정하지 않는다. raw grounding validation에서 실패하면 `validation_failed / INVALID_GROUNDING`으로 실패한다.
- command-injection PoC에는 side-effect based detection, randomized canary, non-destructive marker, quote escape caveat를 deterministic quality guard로 보강하되, `supportingEvidenceRefs` 또는 `location`을 제조하지 않는다.

---

## 8. 현재 검증 기준 (2026-04-21)

### 핵심 테스트 축
- `test_skeleton_smoke.py`
- `test_phase_one.py`
- `test_generate_poc_handler.py`
- `test_agent_loop.py`
- `test_tasks_http_contract.py`
- `test_tool_router.py`
- `test_health_request_summary.py`
- `test_llm_caller.py`
- `test_real_llm_client.py`
- `test_eval_runner.py`
- `test_knowledge_tool.py`
- `test_codegraph_search_tool.py`
- `test_deep_analyze_handler.py`

### 최근 검증 결과
- analysis-agent full suite: **350 passed**
- focused generate-poc/strict-output suite: **60 passed**
- certificate-maker E2E spot check after generate-poc quality hardening: Build/S4/S5/Deep/PoC pass, PoC rubric 7/7

---

## 9. 운영 메모

- internal refactor를 해도 `/v1/tasks`와 `/v1/health` public 의미를 깨지 않는다.
- `/v1/tasks` response body shape는 유지하되, terminal failure HTTP status는 task outcome과 정렬한다.
- `phase_one.py`는 compatibility surface라는 점을 항상 기억한다.
- 다른 lane과의 의미 정렬은 API 계약서와 WR로만 수행한다.
- `/v1/health`는 coarse service health에 더해 request-aware control-signal summary를 additive하게 노출한다.
- S3는 local ack source를 직접 정의/소유하며, elapsed time alone으로 blocked를 판정하지 않는다.
- `constraints.timeoutMs`는 downstream phase/tool shaping에 쓰이는 advisory budget 힌트이며, `/health` control signal을 대체하지 않는다.

---

## 10. `agent-v1.1` system-stability additions

`agent-v1.1` is an additive response schema contract for the system-stability workstream. It may add `cleanPass`, `evaluationVerdict`, `contextualEvidenceRefs`, `evidenceDiagnostics`, `qualityGate`, and extended `recoveryTrace` fields. These fields let S2/S1/hot gates distinguish task completion from clean quality pass.

`constraints.timeoutMs` remains advisory unless a future explicit hard-deadline field/header is introduced. Enforced S3-owned deadlines are implementation configuration and must be surfaced through diagnostics/audit when they affect outcome classification.
