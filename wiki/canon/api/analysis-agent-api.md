---
title: "Analysis Agent API 명세"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/analysis-agent-api.md"
last_verified: "2026-04-14"
service_tags: ["s3"]
decision_tags: []
related_pages: ["wiki/canon/specs/analysis-agent.md", "wiki/canon/handoff/s3/readme.md"]
---

# Analysis Agent API 명세

> **소유자**: S3
> **포트**: 8001
> **호출자**: S2
> **최종 업데이트**: 2026-04-14

Analysis Agent의 public contract 문서다. 내부 구현은 계속 정리되었지만, **이 문서의 public API 의미는 유지된다.**

---

## Base URL

```text
http://localhost:8001
```

## 공통 헤더

| 헤더 | 설명 |
|---|---|
| `X-Request-Id` | 요청/응답 round-trip. S3는 이를 로그 및 S4/S5/S7 호출에 전파한다. |

---

## 엔드포인트 요약

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `deep-analyze`, `generate-poc` |
| GET | `/v1/health` | 상태 + prompt/version + LLM/KB 상태 |
| GET | `/v1/models` | model profiles |
| GET | `/v1/prompts` | prompt 목록 |

> 2026-04-14 이후 S3는 S5/S7 최신 semantics를 **내부적으로** 더 많이 소비하지만, 이 변화는 Analysis Agent outward API shape를 추가로 바꾸지 않는다.

---

## POST /v1/tasks

### 지원 taskType

| taskType | 설명 |
|---|---|
| `deep-analyze` | 프로젝트 보안 심층 분석 (Phase 1/2 자동 실행) |
| `generate-poc` | 특정 claim에 대한 PoC 생성 |

> 레거시 5개 taskType(`static-explain`, `static-cluster`, `dynamic-annotate`, `test-plan-propose`, `report-draft`)은 Analysis Agent가 직접 처리하지 않고 `UNKNOWN_TASK_TYPE`로 거절한다.

### 핵심 요청 필드

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `taskType` | string | O | `deep-analyze` 또는 `generate-poc` |
| `taskId` | string | O | 호출자 추적용 ID |
| `context` | object | O | trusted/semiTrusted/untrusted 입력 컨텍스트 |
| `evidenceRefs` | array | X | S2가 제공한 증적 ref 목록 |
| `constraints.maxTokens` | int | X | 생성 토큰 제한 |
| `constraints.timeoutMs` | int | X | advisory downstream/tool budget 힌트. elapsed wall-clock time만으로 S3 agent loop를 hard-abort시키는 값은 아니다. |

### `deep-analyze`용 `context.trusted`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `objective` | string | O | 분석 목표 |
| `projectPath` | string | △ | 프로젝트 루트 절대 경로 |
| `targetPath` | string | X | `projectPath` 기준 상대 경로 |
| `files` | array | △ | fallback file-content 입력 |
| `projectId` | string | X | code-graph / memory용 프로젝트 식별자 |
| `buildCommand` | string | X | 있으면 Phase 1 build-and-analyze 경로 시도 |
| `buildEnvironment` | object | X | build path에 전달할 environment |
| `buildProfile` | object | X | S4 scan/profile 보강 입력 |
| `provenance` | object | X | `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId` 등 |
| `sastFindings` | array | X | precomputed findings 제공 시 Phase 1 일부 스킵 |
| `scaLibraries` | array | X | precomputed SCA 제공 시 해당 결과 사용 |
| `thirdPartyPaths` | string[] | X | S4 heavy analyzer 제외 대상 |
| `sastTools` | string[] \| null | X | S4 도구 subset 선택 |

### preferred explicit-step aliases

| 필드 | 타입 | 설명 |
|---|---|---|
| `buildPreparation` | object | Build Agent 성공 응답에서 전달받은 build bundle. `buildCommand`, `buildEnvironment`, `buildProfile`, `provenance` alias로 사용 |
| `quickContext` | object | Quick 단계 결과 bundle. `sastFindings`, `scaLibraries`, `thirdPartyPaths`, `sastTools`, `projectId`, `provenance` alias로 사용 |
| `graphContext` | object | graph/ready 상태 bundle. `projectId`, `provenance`, `revisionHint`, `commitSha` alias로 사용 |

규칙:
- `projectPath`와 `files` 중 최소 하나는 있어야 한다.
- `buildCommand`가 있으면 build-and-analyze를 시도하고, 없으면 individual tools로 fallback한다.
- nested alias는 preferred future path 이고, 기존 flat `buildCommand`/`buildEnvironment`/`buildProfile`/`provenance`/`sastFindings`/`scaLibraries` 필드는 compatibility를 위해 계속 읽는다.

### `generate-poc`용 `context.trusted`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `objective` | string | O | PoC 생성 목표 |
| `claim` | object | O | deep-analyze 결과 claim |
| `files` | array | O | 관련 소스 파일 내용 |

---

## 성공 응답

성공 시 HTTP `200` + `status: "completed"`.

핵심 필드:
- `taskId`, `taskType`, `status`
- `modelProfile`, `promptVersion`, `schemaVersion`
- `validation.valid`
- `result.summary`
- `result.claims[]`
- `result.caveats`
- `result.usedEvidenceRefs`
- `result.suggestedSeverity`
- `result.confidence`
- `result.needsHumanReview`
- `audit`

### `agentAudit` 핵심 필드
- `turn_count`
- `tool_call_count`
- `termination_reason`
- `model_name`
- `prompt_version`
- `total_prompt_tokens`
- `total_completion_tokens`
- `trace[]`

---

## 실패 응답

HTTP `200` + 실패 `status`.

대표 status / code:

| status | failureCode 예시 |
|---|---|
| `validation_failed` | `INVALID_SCHEMA`, `INVALID_GROUNDING`, `UNKNOWN_TASK_TYPE` |
| `timeout` | `TIMEOUT` |
| `model_error` | `MODEL_UNAVAILABLE`, `LLM_OVERLOADED` |
| `budget_exceeded` | `TOKEN_BUDGET_EXCEEDED`, `MAX_STEPS_EXCEEDED`, `ALL_TOOLS_EXHAUSTED` |
| `empty_result` | `EMPTY_RESPONSE` |

---

## GET /v1/health

`/v1/health`는 기존 coarse service health를 유지하면서, request-aware control-signal summary를 additive하게 제공한다.

- query parameter: `requestId` (optional)
  - 지정 시 해당 request의 summary를 우선 조회
  - 미지정 시 현재 active request 중 대표 summary(없으면 idle summary)를 반환
  - 완료된 request는 `/health` control surface에서 history로 노출하지 않고 idle summary로 접는다

### request-aware summary semantics

| 필드 | 타입 | 설명 |
|---|---|---|
| `activeRequestCount` | int | 현재 `queued` 또는 `running` 상태 request 수 |
| `requestSummary.requestId` | string \| null | 대표 request ID |
| `requestSummary.endpoint` | string | 현재는 `"tasks"` |
| `requestSummary.state` | string | `idle`, `queued`, `running`, `failed` |
| `requestSummary.localAckState` | string \| null | `phase-advancing`, `transport-only`, `ack-break`, idle일 때 `null` |
| `requestSummary.degraded` | bool | reduced/partial 조건 여부 |
| `requestSummary.degradeReasons` | string[] | degraded 이유 목록 |
| `requestSummary.lastAckAt` | int \| null | 마지막 유효 local ack 시각 (epoch ms) |
| `requestSummary.lastAckSource` | string \| null | 마지막 ack source |
| `requestSummary.blockedReason` | string \| null | abort-driving blocked reason |

### 구현 메모 (public contract 비변경)
- elapsed wall-clock time alone은 S3 로컬 abort trigger가 아니다.
- 장시간 외부 대기 구간에서는 `localAckState="transport-only"`가 나타날 수 있다.
- 현재 대표 source 예시는 `llm-inference`, `s4-scan-wait`, `s4-build-and-analyze-wait`, `kb-lookup`다.
- tool-less LLM 호출은 S7의 async ownership surface를 우선 사용할 수 있지만, 이 변화는 **internal consumer-side behavior**이며 outward `/v1/tasks` / `/v1/health` contract를 추가로 바꾸지 않는다.
- async surface가 runtime에 아직 없을 때 repeated 404/405/501 probing을 줄이기 위한 짧은 cooldown caching도 동일하게 **internal consumer-side behavior**다.

---

## 2026-04-14 구현 메모

내부 구현은 다음처럼 정리/확장되었지만 public contract는 동일하다.
- `tasks.py` → thin router
- `deep_analyze_handler.py`
- `generate_poc_handler.py`
- `phase_one.py` → compatibility surface
- `phase_one_executor.py`, `phase_one_flow.py`, `phase_one_types.py`, `phase_one_exec.py`, `phase_one_kb.py`, `phase_one_prompt.py`
- internal S5 readiness/timeouts 소비 강화
- internal S7 async ownership surface 소비 + cooldown hardening
