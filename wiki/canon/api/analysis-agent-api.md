---
title: "Analysis Agent API 명세"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/analysis-agent-api.md"
last_verified: "2026-04-09"
service_tags: ["s3"]
decision_tags: []
related_pages: ["wiki/canon/specs/analysis-agent.md", "wiki/canon/handoff/s3/readme.md"]
---

# Analysis Agent API 명세

> **소유자**: S3
> **포트**: 8001
> **호출자**: S2
> **최종 업데이트**: 2026-04-09

Analysis Agent의 public contract 문서다. 2026-04-09 기준 내부 구현은 크게 분리되었지만, **이 문서의 public API 의미는 변하지 않았다.**

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
| `constraints.timeoutMs` | int | X | 전체 시간 제한 |

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

규칙:
- `projectPath`와 `files` 중 최소 하나는 있어야 한다.
- `buildCommand`가 있으면 build-and-analyze를 시도하고, 없으면 individual tools로 fallback한다.

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

| 필드 | 설명 |
|---|---|
| `taskId`, `taskType`, `status` | top-level 실행 결과 |
| `modelProfile`, `promptVersion`, `schemaVersion` | 생성/스키마 메타데이터 |
| `validation.valid` | 구조/grounding 검증 결과 |
| `result.summary` | 분석 요약 |
| `result.claims[]` | claim 목록 |
| `result.caveats` | caveat 목록 |
| `result.usedEvidenceRefs` | 실제 사용한 ref |
| `result.suggestedSeverity` | `critical/high/medium/low/info` |
| `result.confidence` | S3 산출 confidence |
| `result.needsHumanReview` | 사람 검토 필요 여부 |
| `audit` | latency / tokenUsage / agentAudit |

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

2026-04-09 live 기준 예시:

```json
{
  "service": "s3-agent",
  "status": "ok",
  "version": "0.1.0",
  "llmMode": "real",
  "modelProfiles": ["Qwen/Qwen3.5-122B-A10B-GPTQ-Int4-default"],
  "activePromptVersions": {
    "deep-analyze": "agent-v1",
    "generate-poc": "v1"
  },
  "agentConfig": {
    "maxSteps": 12,
    "maxCompletionTokens": 20000,
    "toolBudget": {"cheap": 6, "medium": 4, "expensive": 1}
  },
  "llmBackend": {
    "status": "ok",
    "gateway": "http://localhost:8000"
  },
  "llmConcurrency": 4,
  "rag": {
    "enabled": true,
    "kbEndpoint": "http://localhost:8002",
    "status": "ok"
  }
}
```

보호 의미:
- `activePromptVersions` key 집합은 `{deep-analyze, generate-poc}` 유지
- health는 내부 파일 분할과 무관하게 동일 의미를 유지해야 함

---

## generate-poc 응답 메모

`generate-poc`도 동일한 top-level 응답 구조를 사용한다. 차이점은 `result.claims[0].detail`에 PoC 코드/실행 방법/예상 결과가 담긴다는 점이다.

---

## 2026-04-09 구현 메모

내부 구현은 다음처럼 바뀌었지만 public contract는 동일하다.
- `tasks.py` → thin router
- `deep_analyze_handler.py`
- `generate_poc_handler.py`
- `phase_one.py` → compatibility surface
- `phase_one_executor.py`, `phase_one_flow.py`, `phase_one_types.py`, `phase_one_exec.py`, `phase_one_kb.py`, `phase_one_prompt.py`
