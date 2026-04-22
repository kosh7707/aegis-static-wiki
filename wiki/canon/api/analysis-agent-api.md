---
title: "Analysis Agent API 명세"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/analysis-agent-api.md"
last_verified: "2026-04-21"
service_tags: ["s3"]
decision_tags: ["structured-output", "api-contract", "deep-analyze", "http-status"]
related_pages: ["wiki/canon/specs/analysis-agent.md", "wiki/canon/handoff/s3/readme.md"]
---

# Analysis Agent API 명세

> **소유자**: S3
> **포트**: 8001
> **호출자**: S2
> **최종 업데이트**: 2026-04-21

Analysis Agent의 public contract 문서다. 2026-04-21부터 `deep-analyze` 최종 응답은 **명시적 structured finalization 단계**를 거쳐야 하며, 반복 non-JSON LLM 출력은 silent completed fallback으로 처리하지 않는다. 또한 `/v1/tasks`는 동기 처리 endpoint이므로 **terminal task failure를 HTTP 200으로 숨기지 않는다**.

---

## Base URL

```text
http://localhost:8001
```

## 공통 헤더

| 헤더 | 방향 | 설명 |
|---|---|---|
| `X-Request-Id` | request/response | 요청/응답 round-trip. S3는 이를 로그 및 S4/S5/S7 호출에 전파한다. |
| `X-AEGIS-Task-Status` | response | `/v1/tasks` 응답의 machine-readable task status. 예: `completed`, `validation_failed`, `model_error`. |
| `X-AEGIS-Task-Ok` | response | `/v1/tasks` task-level 성공 여부. `completed`면 `true`, 그 외 terminal failure면 `false`. |

---

## 엔드포인트 요약

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `deep-analyze`, `generate-poc` |
| GET | `/v1/health` | 상태 + prompt/version + LLM/KB 상태 |
| GET | `/v1/models` | model profiles |
| GET | `/v1/prompts` | prompt 목록 |

---

## POST /v1/tasks

### 지원 taskType

| taskType | 설명 |
|---|---|
| `deep-analyze` | 프로젝트 보안 심층 분석 (Phase 1/2 + structured finalization) |
| `generate-poc` | 특정 claim에 대한 PoC 생성 |

> 레거시 5개 taskType(`static-explain`, `static-cluster`, `dynamic-annotate`, `test-plan-propose`, `report-draft`)은 Analysis Agent가 직접 처리하지 않고 `UNKNOWN_TASK_TYPE`로 거절한다.

### HTTP / task 상태 의미

S3 `/v1/tasks`는 현재 동기 task endpoint다. 따라서 HTTP 2xx는 **task envelope 전달 성공**이 아니라 **task result 성공**까지 의미해야 한다.

| Task outcome | HTTP | body signal |
|---|---:|---|
| 성공 | `200` | `status="completed"`, `validation.valid=true`, `X-AEGIS-Task-Ok: true` |
| 입력/출력 schema 또는 evidence validation terminal failure | `422` | `status="validation_failed"` 등, `failureCode`, `X-AEGIS-Task-Ok: false` |
| token/input budget 초과 | `413` | `status="budget_exceeded"`, `failureCode`, `X-AEGIS-Task-Ok: false` |
| timeout | `504` | `status="timeout"`, `failureCode="TIMEOUT"`, `X-AEGIS-Task-Ok: false` |
| model/backend unavailable or overloaded | `503` | `status="model_error"`, `failureCode`, `X-AEGIS-Task-Ok: false` |
| unsupported task type | `400` | `errorDetail.code="UNKNOWN_TASK_TYPE"` |
| unexpected S3 exception | `500` | `errorDetail.code="INTERNAL_ERROR"` |

Consumer 규칙:
- HTTP status와 `status`를 모두 읽어야 한다.
- `status != "completed"`는 terminal failed task로 취급한다.
- `validation_failed`는 HTTP `422`가 정상 계약이다. `HTTP 200 + status=validation_failed`는 더 이상 S3 계약이 아니다.
- `X-AEGIS-Task-Ok`는 빠른 machine-readable guard이며, canonical result 판단은 body `status`/`failureCode`와 함께 수행한다.

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
| `buildPreparation` | object | X | Build Agent 산출물. PoC 실행 경로/바이너리 이름 추론에 사용 |

---

## Structured finalization contract (2026-04-21)

`deep-analyze`의 LLM 루프는 도구 사용과 분석 reasoning을 수행한 뒤 최종 Assessment JSON을 반환해야 한다. S3는 최종 content가 JSON이 아닐 때 다음 순서로 처리한다.

1. **Structured retry**: 기존 대화 맥락을 유지하면서 순수 Assessment JSON만 다시 출력하도록 1회 요청한다.
2. **Strict finalizer**: retry 후에도 non-JSON이면, 도구를 비활성화하고 S7 strict JSON mode(`response_format=json_object`, async ownership 우선)를 사용해 별도 finalizer 호출을 수행한다.
3. **Strict schema repair**: JSON이더라도 required top-level fields 또는 claim-level fields가 누락/null/wrong type이면 strict schema repair를 1회 수행한다. Required fields는 `summary`, `claims`, `caveats`, `usedEvidenceRefs`, `suggestedSeverity`, `needsHumanReview`, `recommendedNextSteps`, `policyFlags`와 각 claim의 `statement`, `detail`, `supportingEvidenceRefs`, `location`이다. `generate-poc` repair는 S3가 먼저 deterministic Assessment scaffold를 만들고, LLM retry는 그 scaffold를 bounded refinement만 하도록 제한한다.
4. **Raw evidence validation**: unsupported/hallucinated evidence ref는 sanitizer가 성공 응답으로 숨기기 전에 `INVALID_GROUNDING`으로 실패한다. fuzzy correction과 fallback ref injection은 계약상 금지된다.
5. **Validation**: finalizer/repair 출력도 기존 `ResultAssembler`, `SchemaValidator`, `EvidenceValidator`를 반드시 통과해야 한다.
6. **Failure**: finalizer/repair까지 schema/evidence validation을 통과하지 못하면 `completed`가 아니라 `validation_failed` 또는 `model_error`를 반환한다. 이 terminal failure는 HTTP 200이 아니라 위 HTTP/status 표에 맞는 non-2xx로 반환된다.

중요한 의미:
- 반복 non-JSON, missing required fields, malformed claims, unsupported evidence를 S3가 deterministic fallback completed 또는 silent normalization으로 숨기지 않는다.
- finalizer/repair는 자연어 또는 invalid JSON을 그대로 통과시키는 파서가 아니라, S7에 **새로운 strict JSON 응답**을 요청하는 별도 최종화 단계다.
- finalizer/repair 성공 응답은 일반 `completed` 응답과 같은 top-level shape를 유지하되, `policyFlags`에 `structured_finalizer`가 포함될 수 있다.
- consumer는 `policyFlags`에 `structured_finalizer`가 있으면 최종 JSON은 유효하지만 structured-output repair path를 거쳤다는 점을 표시/로그/QA 기준에 반영해야 한다.

---

## 성공 응답

성공 시 HTTP `200` + `status: "completed"` + `X-AEGIS-Task-Ok: true`.

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
- `result.policyFlags[]`
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

실패 시 S3는 structured failure body를 유지하되, terminal failure를 HTTP 200으로 반환하지 않는다.

대표 status / code / HTTP:

| status | failureCode 예시 | HTTP |
|---|---|---:|
| `validation_failed` | `INVALID_SCHEMA`, `INVALID_GROUNDING` | `422` |
| `timeout` | `TIMEOUT` | `504` |
| `model_error` | `MODEL_UNAVAILABLE`, `LLM_OVERLOADED` | `503` |
| `budget_exceeded` | `TOKEN_BUDGET_EXCEEDED`, `MAX_STEPS_EXCEEDED` | `413` |
| `empty_result` | `EMPTY_RESPONSE` | `422` |

Failure body 핵심 필드:
- `taskId`, `taskType`, `status`
- `failureCode`
- `failureDetail`
- `retryable`
- `audit`

Structured finalization 이후에도 valid Assessment JSON을 만들지 못하면 `validation_failed / INVALID_SCHEMA` + HTTP `422`가 가능하다. Evidence ref가 unsupported/hallucinated 이거나 claim grounding이 비면 `validation_failed / INVALID_GROUNDING` + HTTP `422`가 가능하다. S2/S1은 이를 분석 실패로 표시해야 하며 `completed`로 해석하면 안 된다.

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

### 구현 메모
- elapsed wall-clock time alone은 S3 로컬 abort trigger가 아니다.
- 장시간 외부 대기 구간에서는 `localAckState="transport-only"`가 나타날 수 있다.
- 현재 대표 source 예시는 `llm-inference`, `structured-finalizer`, `s4-scan-wait`, `s4-build-and-analyze-wait`, `kb-lookup`다.
- tool-less LLM 호출은 S7의 async ownership surface를 우선 사용할 수 있다.

---

## 2026-04-21 구현 메모

- `deep-analyze` 반복 non-JSON에 대해 deterministic completed fallback을 제거하고 strict structured finalizer를 도입했다.
- `/v1/tasks` terminal task failure는 HTTP 200으로 반환하지 않는다. `validation_failed`는 HTTP 422이며, `X-AEGIS-Task-Ok: false`/`X-AEGIS-Task-Status` 헤더를 함께 반환한다.
- `deep-analyze`와 `generate-poc` 모두 missing required fields, wrong types, malformed claim objects를 silent normalize하지 않고 strict schema repair를 1회 시도한다. `generate-poc`는 retry 전에 deterministic scaffold로 required top-level fields와 claim `location`/`supportingEvidenceRefs`를 trusted input/evidence refs에서 복원하고, retry output이 같은 invalid shape를 반복해도 scaffold shape를 보존한다. repair 후에도 invalid이면 `validation_failed / INVALID_SCHEMA`로 실패한다.
- Evidence refs는 fuzzy correction 또는 fallback injection으로 권한 부여하지 않는다. unsupported/hallucinated ref가 포함된 output은 `INVALID_GROUNDING`으로 실패한다.
- `generate-poc` quality hardening은 command-injection side-effect detection guard처럼 `detail`/`caveats`만 보강하며, `supportingEvidenceRefs`나 `location`을 제조하지 않는다.
- public request/response top-level body shape는 유지하되, transport status는 task outcome과 정렬한다. `policyFlags=["structured_finalizer"]`가 새 의미 신호로 사용될 수 있다.
