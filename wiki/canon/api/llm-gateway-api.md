---
title: "S7. LLM Gateway API 명세"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/api/llm-gateway-api.md"
original_path: "docs/api/llm-gateway-api.md"
last_verified: "2026-04-29"
service_tags: ["s7"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
---

# S7. LLM Gateway API 명세

> **소유자**: S7 (LLM Gateway + LLM Engine)
> S2(Core), S3(Agent) 등이 S7을 호출할 때 참조하는 API 계약서.
> S7은 Python(FastAPI)으로 구현하며, 이 문서의 스펙에 맞춰 Pydantic 모델을 정의한다.

---

## Base URL

```
http://localhost:8000
```

## 공통 헤더

| 헤더 | 방향 | 설명 |
|------|------|------|
| `X-Request-Id` | 요청/응답 | 분산 추적용 요청 ID. 호출자가 전달하면 S7이 로그에 기록하고 LLM Engine에도 전파. **호출자가 미전달 시 Gateway가 `gw-` 접두사로 자동 생성.** 모든 응답에 포함. |
| `X-Timeout-Seconds` | 요청 | `/v1/chat` 전용. 호출자가 원하는 read timeout (초). Gateway가 LLM Engine 호출 시 이 값을 적용. 미전달 시 기본 1800초. 상한 1800초. |
| `X-Model` | 응답 | `/v1/chat` 전용. Gateway가 실제 사용한 모델명 (오버라이드 후). 호출자가 어떤 모델명을 보냈든 실제 적용된 모델을 확인할 수 있다. |
| `X-Gateway-Latency-Ms` | 응답 | `/v1/chat` 전용. Gateway 측정 지연시간 (밀리초). LLM Engine 호출 + 전후 처리 포함. |
| `X-AEGIS-Strict-JSON` | 요청/응답 | `/v1/chat` 및 `/v1/async-chat-requests` opt-in strict JSON 모드 헤더. 요청에서 `true`/`1`/`yes`/`on` 중 하나를 보내면 Gateway가 JSON object 응답 강제 제어를 적용한다. `/v1/chat` 동기 응답에는 `applied`를 돌려준다. async ownership 경로에서는 terminal status/result body에 strict JSON 실패 정보를 명시한다. |
| `X-AEGIS-Effective-Thinking` | 응답 | `/v1/chat` 전용. Gateway가 LLM Engine에 전달한 caller-supplied `chat_template_kwargs.enable_thinking` 값. 이 값은 필수 generation control이며 S7이 기본값을 주입하지 않는다. |

---

## API

### POST /v1/chat

LLM Engine 프록시 — OpenAI-compatible chat completion 요청을 LLM Engine(vLLM)에 전달한다. 기본 모드는 pass-through이며, opt-in strict JSON 모드에서는 Gateway가 JSON object 응답 계약을 더 강하게 강제한다.

S3 Agent의 멀티턴 에이전트 루프, 또는 향후 다른 서비스의 LLM 호출에 사용. **모든 LLM 호출은 이 엔드포인트를 경유한다.**

#### 요청

OpenAI chat completion 포맷을 그대로 수용한다:

```json
{
  "model": "Qwen/Qwen3.6-27B",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "max_tokens": 4096,
  "temperature": 1.0,
  "top_p": 0.95,
  "top_k": 20,
  "min_p": 0.0,
  "presence_penalty": 0.0,
  "repetition_penalty": 1.0,
  "chat_template_kwargs": {"enable_thinking": true},
  "tools": [...],
  "tool_choice": "auto",
  "response_format": {"type": "json_object"}
}
```

**모델 오버라이드**: 요청의 `model` 필드는 Gateway가 실제 운영 모델로 교체한다. 호출자는 어떤 모델명을 보내도 되며, Gateway가 현재 Engine에 배포된 모델로 자동 매핑한다. 그 외 필드는 기본적으로 LLM Engine에 그대로 전달된다.

#### Caller-owned generation controls (2026-04-29)

S7 Gateway는 `/v1/chat`, `/v1/async-chat-requests`, `/v1/tasks` 어디에서도 generation/sampling 값을 내부 기본값으로 결정하지 않는다. Caller가 모든 generation controls를 명시해야 하며, 누락 또는 `chat_template_kwargs.enable_thinking`의 non-boolean 값은 422로 거절한다.

- `/v1/chat`와 `/v1/async-chat-requests`는 OpenAI-compatible snake_case surface이며 다음 필드가 필수다: `max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `chat_template_kwargs.enable_thinking`.
- `/v1/tasks`는 camelCase `constraints.*` surface이며 다음 필드가 필수다: `enableThinking`, `maxTokens`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`.
- 동기 `/v1/chat` 성공 응답은 caller-supplied value를 반영한 `X-AEGIS-Effective-Thinking: true|false` 헤더를 포함한다.
- `logs/llm-exchange.jsonl`에는 forwarded request와 함께 `effectiveThinking` 및 전체 generation tuple을 기록한다.
- strict JSON도 thinking 값을 주입하거나 변경하지 않는다. Gateway는 `response_format={"type":"json_object"}`만 강제하고, `chat_template_kwargs.enable_thinking`은 caller가 보낸 boolean 값을 그대로 보존한다.
- thinking-on은 reasoning 토큰을 소비하므로 S3 hotN/hot20 같은 deep-analysis path는 충분한 `max_tokens`와 `X-Timeout-Seconds` 예산을 잡아야 한다. `finish_reason=length`와 빈 final content는 token budget 부족으로 취급한다.

`frequency_penalty` / `frequencyPenalty`는 Qwen3.6 권장 sampling family에 없으므로 S7 schema에 추가하지 않는다.

#### opt-in strict JSON 모드

요청 헤더 `X-AEGIS-Strict-JSON: true`(또는 `1`/`yes`/`on`)를 보내면 Gateway가 strict JSON 모드를 적용한다.

strict JSON 모드에서 Gateway는 다음을 보장하려고 시도한다:
- 요청 body에 `response_format={"type":"json_object"}`를 강제로 적용
- caller-supplied `chat_template_kwargs.enable_thinking` 값을 변경하지 않는다. 이 값이 없거나 boolean이 아니면 request validation에서 422로 거절한다.
- 성공 응답(200)에서 `choices[0].message.content`가 **JSON object 문자열**인지 검증
- 유효한 경우 `message.content`를 compact JSON 문자열로 정규화
- backend-specific `message.reasoning` 필드는 성공 응답에서 `null`로 scrub한다. 원본 response/reasoning은 exchange log에 기록된다.

strict JSON 모드에서 이 계약을 만족하지 못하면 Gateway는 backend payload를 그대로 통과시키지 않고 `502`로 명확히 실패시킨다.

#### 응답

기본 모드에서는 LLM Engine(vLLM)의 OpenAI-compatible 응답을 그대로 반환한다. strict JSON 모드에서는 동일한 envelope를 유지하되 `choices[0].message.content`를 검증/정규화하고 `reasoning`을 scrub한다:

```json
{
  "choices": [{
    "message": {
      "content": "...",
      "tool_calls": [...]
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 1500,
    "completion_tokens": 500
  }
}
```

#### 에러

| HTTP | 조건 | `retryable` |
|------|------|------------|
| 422 | 필수 generation controls 누락, 타입 오류, 또는 범위 초과 | `false` |
| 503 | LLM Engine 연결 실패 | `true` |
| 503 | Circuit Breaker OPEN (연속 장애로 회로 차단) | `true` |
| 504 | LLM Engine 응답 타임아웃 (`X-Timeout-Seconds` 기반, 기본 1800초) | `true` |
| 502 | strict JSON 모드에서 응답이 JSON object 계약을 만족하지 않음 | `true` |
| 4xx/5xx | LLM Engine 원본 에러 코드 그대로 전달 | 상황별 |

#### 비고

- Gateway가 동시성 제어(Semaphore)를 적용한다
- 교환 로그(`logs/llm-exchange.jsonl`)에 모든 호출이 기록된다
- Circuit Breaker가 연속 장애를 감지하면 즉시 503을 반환한다 (타임아웃 대기 없이 빠른 실패)
- `X-Request-Id` 헤더를 LLM Engine에 전파한다
- strict JSON이 필요하면 caller는 `X-AEGIS-Strict-JSON: true`를 보내고, 응답 body는 `choices[0].message.content`만 JSON으로 파싱해야 한다
- 장시간 요청의 현재 in-flight 상태는 additive `/v1/health?requestId=...` control-signal summary로 조회할 수 있다
- **중요**: 현재 `/v1/chat`의 `X-Timeout-Seconds` 기반 finite timeout은 여전히 canonical이다. transport timeout이 발생한 해당 HTTP 요청은 terminal failure로 간주하며, `/health`는 active request summary만 제공하고 완료/실패 history를 보존하지 않는다
- **Phase-2 direction (2026-04-14 decision)**: stronger no-result-loss / recoverable wait-while-alive semantics는 `/v1/chat`를 stretch해서 구현하지 않고, 별도 async request-ownership surface에서 다루는 것이 S7의 선호 방향이다. 따라서 `/v1/chat`는 장기적으로도 synchronous/finite compatibility surface로 유지하는 쪽을 기본 가정으로 둔다

---

### POST /v1/async-chat-requests

Long-lived inference ownership submit endpoint. This is the **phase-2 async surface** for stronger reconnect-safe / no-result-loss semantics. `/v1/chat` remains synchronous; this endpoint gives the caller a durable ownership `requestId`.

#### 요청

OpenAI-compatible chat completion body를 거의 그대로 받는다. `model`은 optional이며, Gateway가 실제 운영 모델로 오버라이드한다.

```json
{
  "model": "ignored-by-gateway",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "max_tokens": 4096,
  "temperature": 1.0,
  "top_p": 0.95,
  "top_k": 20,
  "min_p": 0.0,
  "presence_penalty": 0.0,
  "repetition_penalty": 1.0,
  "chat_template_kwargs": {"enable_thinking": true},
  "tools": [...],
  "tool_choice": "auto"
}
```

규칙:
- `messages`는 필수이며 비어 있으면 안 된다
- `max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `chat_template_kwargs.enable_thinking`은 모두 필수다. 누락 시 422이며 S7은 `SamplingDefaults` 또는 vLLM backend default로 보정하지 않는다.
- `X-Request-Id`는 원래 trace/correlation ID로 유지된다
- async surface의 durable ownership ID는 별도의 `requestId`다
- `X-AEGIS-Strict-JSON: true`를 보내면 async job도 `/v1/chat`과 동일하게 `response_format={"type":"json_object"}`를 강제한다. caller-supplied thinking 값은 보존되며 final response content가 JSON object가 아니면 completed로 처리하지 않는다

#### 응답

성공 시 `202 Accepted`:

```json
{
  "requestId": "acr_01abc...",
  "traceRequestId": "gw-trace-001",
  "status": "accepted",
  "statusUrl": "/v1/async-chat-requests/acr_01abc...",
  "resultUrl": "/v1/async-chat-requests/acr_01abc.../result",
  "cancelUrl": "/v1/async-chat-requests/acr_01abc...",
  "acceptedAt": "2026-04-14T03:30:00+00:00",
  "expiresAt": "2026-04-14T03:45:00+00:00"
}
```

중요:
- `accepted`는 **submit response에만** 나타난다
- status polling에서는 `accepted`를 long-lived state로 사용하지 않고 바로 `queued`/`running` 계열로 좁힌다
- `expiresAt`은 현재 S7이 알고 있는 ownership/retention expiry 시각이다. terminal 시점에 연장될 수 있다

### GET /v1/async-chat-requests/{requestId}

Durable ownership 상태 조회 엔드포인트.

```json
{
  "requestId": "acr_01abc...",
  "traceRequestId": "gw-trace-001",
  "state": "running",
  "localAckState": "transport-only",
  "phase": "llm-inference",
  "degraded": false,
  "degradeReasons": [],
  "lastAckAt": 1776151200000,
  "lastAckSource": "queue-exit",
  "blockedReason": null,
  "error": null,
  "errorDetail": null,
  "retryable": false,
  "resultReady": false,
  "acceptedAt": "2026-04-14T03:30:00+00:00",
  "startedAt": "2026-04-14T03:30:01+00:00",
  "endedAt": null,
  "expiresAt": "2026-04-14T03:45:00+00:00",
  "statusUrl": "/v1/async-chat-requests/acr_01abc...",
  "resultUrl": "/v1/async-chat-requests/acr_01abc.../result",
  "cancelUrl": "/v1/async-chat-requests/acr_01abc..."
}
```

`state` allowlist:
- `queued`
- `running`
- `completed`
- `failed`
- `cancelled`
- `expired`

`localAckState` guidance:
- `queued` / `running` → meaningful (`phase-advancing` or `transport-only`)
- `completed` → `null`
- `failed` / `cancelled` → `ack-break`
- `expired` → `null`

### GET /v1/async-chat-requests/{requestId}/result

Final result retrieval endpoint.

성공 시 `200 OK`:

```json
{
  "requestId": "acr_01abc...",
  "traceRequestId": "gw-trace-001",
  "state": "completed",
  "completedAt": "2026-04-14T03:30:42+00:00",
  "expiresAt": "2026-04-14T03:45:42+00:00",
  "response": {
    "choices": [...],
    "usage": {...}
  }
}
```

규칙:
- `response`는 가능한 한 current `/v1/chat` success payload shape를 유지한다
- result not ready → explicit non-ready response (`409`, `retryable: true`)
- failed/cancelled → explicit terminal non-success response (`409`)
- strict JSON contract violation → explicit terminal failure (`409`) with `error="Strict JSON contract violated"`, `blockedReason="strict_json_contract_violation"`, `errorDetail`, and `retryable: true`
- expired/not retained → explicit expired response (`410`)
- idle/empty ambiguity는 허용하지 않는다

### DELETE /v1/async-chat-requests/{requestId}

Best-effort cancel endpoint.

응답은 현재 ownership status shape를 돌려준다. 이미 terminal이면 그 terminal 상태를 그대로 돌려준다.

### async ownership semantics

- `/v1/chat`는 여전히 finite synchronous compatibility surface다
- stronger no-result-loss semantics는 이 async ownership surface에서만 제공한다
- `X-Timeout-Seconds`는 `/v1/chat`에는 canonical이지만, async ownership path에서는 **superseded** 된다
- terminal retention은 현재 최소 **15분**

---

### POST /v1/tasks

Task 기반 AI 분석 요청. S2가 task type, context, evidence refs를 전달하면 S7이 구조화된 assessment를 반환한다.

#### Task Type Allowlist

| Task Type | 서비스 | 목적 |
|-----------|--------|------|
| `static-explain` | LLM Gateway (:8000) | 정적 분석 finding 심층 설명 |
| `static-cluster` | LLM Gateway (:8000) | 유사 finding 그룹핑 제안 |
| `dynamic-annotate` | LLM Gateway (:8000) | 동적 분석 이벤트 해석 |
| `test-plan-propose` | LLM Gateway (:8000) | 테스트 시나리오 제안 |
| `report-draft` | LLM Gateway (:8000) | 보고서 초안 생성 |
| **`deep-analyze`** | **Analysis Agent (:8001)** | **프로젝트 전반 보안 분석 (Phase 1/2)** |

- LLM Gateway(:8000)의 allowlist 외 taskType → `422 Unprocessable Entity`
- `deep-analyze`는 **Analysis Agent(:8001)**로 직접 요청 (S2 → :8001)
- 요청/응답 형식은 동일 (`TaskRequest` → `TaskSuccessResponse | TaskFailureResponse`)

#### deep-analyze 추가 context 필드

`deep-analyze` 요청 시 `context.trusted`에 포함 가능한 추가 필드:

| 필드 | 타입 | 설명 |
|------|------|------|
| `objective` | string | 분석 목표 (자연어) |
| `projectId` | string | 프로젝트 식별자 |
| `projectPath` | string? | 파일시스템 프로젝트 경로 (있으면 SCA + projectPath 코드 그래프 활성화) |
| `buildProfile` | object? | 빌드 환경 (sdkId, compiler, targetArch, languageStandard, includePaths 등) |
| `files` | FileEntry[]? | 소스 파일 목록 [{path, content}]. projectPath 없을 때 사용 |

Phase 1이 자동으로 SAST + 코드 그래프 + SCA를 실행하므로, S2는 파일/프로젝트 정보만 전달하면 됩니다.

---

#### 공통 요청 스키마

```json
{
  "taskType": "static-explain",
  "taskId": "task-001",
  "context": {
    "trusted": {},
    "semiTrusted": {},
    "untrusted": {}
  },
  "evidenceRefs": [],
  "constraints": {
    "enableThinking": true,
    "maxTokens": 4096,
    "temperature": 1.0,
    "topP": 0.95,
    "topK": 20,
    "minP": 0.0,
    "presencePenalty": 0.0,
    "repetitionPenalty": 1.0,
    "timeoutMs": 15000,
    "outputSchema": "static-explain-v1"
  },
  "metadata": {
    "runId": "run-001",
    "requestedBy": "s2-analysis-service"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| taskType | string | O | V1 allowlist 내 task type |
| taskId | string | O | 요청 고유 ID (S2가 생성) |
| context | object | O | 입력 컨텍스트 (신뢰도 레벨별 분리) |
| context.trusted | object | O | S2가 정규화한 구조화 데이터 |
| context.trusted.buildProfile | object | X | 빌드 환경 정보 (static-explain). `languageStandard`, `targetArch`, `compiler` 포함. 프로젝트에 설정된 경우에만 전달 |
| context.semiTrusted | object | X | 파싱/정규화된 로그 등 |
| context.untrusted | object | X | raw logs, 사용자 입력 등 |
| evidenceRefs | EvidenceRef[] | O | 입력 evidence 식별자 목록 |
| constraints | object | O | 실행 제약 조건. `/v1/tasks`에서는 generation controls를 caller가 모두 명시해야 하며, 누락 시 422 |
| constraints.enableThinking | boolean | O | Qwen thinking mode 제어. task path에서는 caller가 per-request로 명시 |
| constraints.maxTokens | number | O | 최대 생성 토큰 수 (범위: 1~32768) |
| constraints.temperature | number | O | sampling temperature (범위: 0~2) |
| constraints.topP | number | O | nucleus sampling top-p (범위: 0~1) |
| constraints.topK | number | O | top-k sampling (범위: -1 이상, -1은 vLLM 무제한 의미) |
| constraints.minP | number | O | min-p sampling (범위: 0~1) |
| constraints.presencePenalty | number | O | presence penalty (범위: -2~2) |
| constraints.repetitionPenalty | number | O | repetition penalty (범위: 0~2) |
| constraints.timeoutMs | number | X | 타임아웃 ms (기본: 15000). generation required contract 대상은 아님 |
| constraints.outputSchema | string | X | 출력 스키마 ID. generation required contract 대상은 아님 |
| metadata | object | X | 추적용 메타데이터 |
| metadata.runId | string | X | 분석 실행 ID |
| metadata.requestedBy | string | X | 요청 주체 |

---

#### EvidenceRef 스키마

S2가 제공하는 안정적 식별자. S7은 이 ref를 인용만 할 수 있고, 새로 발명할 수 없다.

```json
{
  "refId": "eref-001",
  "artifactId": "art-456",
  "artifactType": "raw-source",
  "locatorType": "lineRange",
  "locator": {
    "file": "main.c",
    "fromLine": 1,
    "toLine": 50
  },
  "hash": "sha256:abc123...",
  "label": "main.c full source"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| refId | string | O | evidence 참조 ID |
| artifactId | string | O | 원본 아티팩트 ID |
| artifactType | string | O | `raw-source`, `raw-can-window`, `test-result`, `rule-match`, `parsed-log` 등 |
| locatorType | string | O | `lineRange`, `frameWindow`, `requestResponsePair`, `jsonPointer`, `logSpan`, `snippetRange` |
| locator | object | O | 위치 지정 (locatorType별 상이) |
| hash | string | X | 원본 해시 |
| label | string | X | 사람이 읽을 수 있는 라벨 |

---

#### Task별 context 예시

**static-explain:**

```json
{
  "taskType": "static-explain",
  "taskId": "task-se-001",
  "context": {
    "trusted": {
      "finding": {
        "ruleId": "RULE-001",
        "title": "Dangerous gets() usage",
        "severity": "critical",
        "location": "main.c:4"
      },
      "ruleMetadata": {
        "category": "memory-safety",
        "cweId": "CWE-120"
      },
      "buildProfile": {
        "languageStandard": "c99",
        "targetArch": "arm-cortex-m7",
        "compiler": "arm-none-eabi-gcc"
      }
    },
    "untrusted": {
      "sourceSnippet": "#include <stdio.h>\nint main() {\n    char buf[10];\n    gets(buf);\n    printf(\"%s\", buf);\n    return 0;\n}"
    }
  },
  "evidenceRefs": [
    {
      "refId": "eref-001",
      "artifactId": "art-src-main",
      "artifactType": "raw-source",
      "locatorType": "lineRange",
      "locator": { "file": "main.c", "fromLine": 1, "toLine": 7 },
      "label": "main.c source"
    }
  ]
}
```

**dynamic-annotate:**

```json
{
  "taskType": "dynamic-annotate",
  "taskId": "task-da-001",
  "context": {
    "trusted": {
      "ruleMatches": [
        {
          "ruleId": "DYN-001",
          "title": "High frequency on 0x7DF",
          "severity": "high",
          "location": "CAN ID: 0x7DF"
        }
      ]
    },
    "semiTrusted": {
      "parsedEvents": [
        { "ts": "14:30:01.123", "canId": "0x7DF", "dlc": 8, "data": "02 01 00 00 00 00 00 00" },
        { "ts": "14:30:01.124", "canId": "0x7DF", "dlc": 8, "data": "02 01 00 00 00 00 00 00" }
      ]
    },
    "untrusted": {
      "rawCanLog": "14:30:01.123 0x7DF [8] 02 01 00 00 00 00 00 00\n14:30:01.124 0x7DF [8] 02 01 00 00 00 00 00 00"
    }
  },
  "evidenceRefs": [
    {
      "refId": "eref-can-001",
      "artifactId": "art-can-session-1",
      "artifactType": "raw-can-window",
      "locatorType": "frameWindow",
      "locator": { "channel": "can0", "fromTs": "14:30:01.000", "toTs": "14:30:02.000" },
      "label": "burst window around alert"
    }
  ]
}
```

**test-plan-propose:**

```json
{
  "taskType": "test-plan-propose",
  "taskId": "task-tp-001",
  "context": {
    "trusted": {
      "objective": "SecurityAccess 서비스 lockout behavior 평가",
      "ecuCapability": {
        "supportedServices": ["0x10", "0x27", "0x31"],
        "interface": "CAN",
        "environment": "simulator"
      },
      "policyConstraints": {
        "maxAttempts": 10,
        "rateLimit": "1/sec",
        "simulatorOnly": true
      }
    }
  },
  "evidenceRefs": []
}
```

---

#### 공통 응답 스키마 (성공)

```json
{
  "taskId": "task-001",
  "taskType": "static-explain",
  "status": "completed",
  "modelProfile": "Qwen/Qwen3.6-27B-default",
  "promptVersion": "static-explain-v1",
  "schemaVersion": "static-explain-v1",
  "validation": {
    "valid": true,
    "errors": []
  },
  "result": {
    "summary": "...",
    "claims": [
      {
        "statement": "gets() 함수는 입력 길이를 제한하지 않아 스택 기반 버퍼 오버플로우가 발생한다.",
        "supportingEvidenceRefs": ["eref-001"],
        "location": "src/main.c:42"
      }
    ],
    "caveats": [
      "시뮬레이터 환경에서의 분석이므로 실 ECU 메모리 레이아웃에 따라 영향이 다를 수 있다."
    ],
    "usedEvidenceRefs": ["eref-001"],
    "suggestedSeverity": "critical",
    "confidence": 0.82,
    "confidenceBreakdown": {
      "grounding": 0.95,
      "deterministicSupport": 0.80,
      "ragCoverage": 0.76,
      "schemaCompliance": 1.0
    },
    "needsHumanReview": false,
    "recommendedNextSteps": [
      "fgets()로 교체 후 regression test 수행"
    ],
    "policyFlags": []
  },
  "audit": {
    "inputHash": "sha256:abc123...",
    "latencyMs": 1200,
    "tokenUsage": { "prompt": 1500, "completion": 800 },
    "retryCount": 0,
    "ragHits": 5,
    "createdAt": "2026-03-09T10:00:00Z"
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| taskId | string | 요청 시 전달한 task ID |
| taskType | string | task type |
| status | string | 처리 상태 (아래 표) |
| modelProfile | string | 사용된 model profile ID |
| promptVersion | string | 사용된 prompt 버전 |
| schemaVersion | string | 출력 스키마 버전 |
| validation | object | 스키마 검증 결과 |
| result | object | assessment 본문 (아래 상세) |
| audit | object | 감사/추적 메타데이터 |

**audit 필드 상세:**

| 필드 | 타입 | 설명 |
|------|------|------|
| inputHash | string | 입력 해시 (sha256 앞 16자리) |
| latencyMs | int | 처리 소요 시간 (ms) |
| tokenUsage | object | `{prompt, completion}` 토큰 사용량 |
| retryCount | int | LLM 출력 품질 재시도 횟수 (0이면 첫 시도 성공). 재시도 대상: INVALID_SCHEMA, INVALID_GROUNDING, EMPTY_RESPONSE |
| ragHits | int | RAG 위협 지식 DB 관련성 있는 검색 결과 수 (0이면 RAG 미사용 또는 관련 결과 없음). min_score 미만 결과는 제외되므로 0~top_k 범위의 가변값 |
| createdAt | string | 생성 시각 (ISO 8601) |

**result 필드 상세:**

| 필드 | 타입 | 설명 |
|------|------|------|
| summary | string | 분석 요약 |
| claims | Claim[] | 증거 기반 주장 |
| caveats | string[] | 한계, 불확실성 |
| usedEvidenceRefs | string[] | 사용된 evidence ref ID (입력의 subset) |
| suggestedSeverity | string? | 제안 심각도 (critical/high/medium/low/info, optional) |
| confidence | number | 0~1 운영용 신뢰 지표 |
| confidenceBreakdown | object | grounding, deterministicSupport, ragCoverage, schemaCompliance |
| needsHumanReview | boolean | 인간 검토 필요 여부 |
| recommendedNextSteps | string[] | 후속 조치 제안 |
| policyFlags | string[] | 정책 관련 플래그 |

**Claim 스키마:**

| 필드 | 타입 | 설명 |
|------|------|------|
| statement | string | 주장 문장 |
| supportingEvidenceRefs | string[] | 이 주장을 지지하는 evidence ref ID |
| location | string? | 코드 위치 (`"파일경로:라인번호"`, 예: `"src/main.c:42"`). 특정 불가 시 `null` |

---

#### 응답 스키마 (실패)

```json
{
  "taskId": "task-001",
  "taskType": "static-explain",
  "status": "validation_failed",
  "failureCode": "INVALID_GROUNDING",
  "failureDetail": "응답에 입력에 없는 evidenceRef 'eref-999'가 포함됨",
  "retryable": false,
  "audit": {
    "inputHash": "sha256:abc123...",
    "latencyMs": 800,
    "retryCount": 1,
    "ragHits": 0,
    "createdAt": "2026-03-09T10:00:00Z"
  }
}
```

**status 값:**

| status | 의미 |
|--------|------|
| `completed` | 정상 완료 |
| `validation_failed` | 출력 스키마/시맨틱 검증 실패 |
| `timeout` | 시간 초과 |
| `model_error` | LLM 호출 실패 |
| `budget_exceeded` | 토큰 예산 초과 |
| `unsafe_output` | 안전하지 않은 출력 감지 |
| `empty_result` | 빈 결과 |

**failureCode 예시:**

| failureCode | 설명 |
|-------------|------|
| `INVALID_SCHEMA` | JSON 파싱 실패, top-level JSON object 복구 실패, 또는 필수 필드/스키마 검증 실패 |
| `INVALID_GROUNDING` | 존재하지 않는 evidenceRef 참조 |
| `TIMEOUT` | 지정 시간 내 응답 미수신 |
| `MODEL_UNAVAILABLE` | LLM 서버 연결 불가 |
| `TOKEN_BUDGET_EXCEEDED` | 토큰 한도 초과 |
| `UNSAFE_CONTENT` | 금지된 출력 (실행 가능 코드 등) 감지 |
| `EMPTY_RESPONSE` | 모델이 빈 응답 반환 |
| `LLM_OVERLOADED` | LLM 백엔드 과부하 (429/503). `retryable: true` |
| `LLM_CIRCUIT_OPEN` | Circuit Breaker OPEN (연속 장애로 회로 차단). `retryable: true`. 일정 시간 후 자동 복구 시도 |
| `INPUT_TOO_LARGE` | 프롬프트가 입력 한도 초과 (status: `budget_exceeded`). 입력 크기를 줄여 재시도 필요. `retryable: false` |
| `UNKNOWN_TASK_TYPE` | 허용되지 않는 task type |

**retryable 필드:**

실패 응답에 `retryable: bool` 필드가 포함된다 (기본 `false`). `true`이면 S2가 재시도를 판단할 수 있다.
- `LLM_OVERLOADED` → `retryable: true`
- `LLM_CIRCUIT_OPEN` → `retryable: true`
- `TIMEOUT` → `retryable: true`
- `MODEL_UNAVAILABLE` → `retryable: true`
- 그 외 → `retryable: false`

**S7 내부 재시도 정책:**

S7은 LLM 출력 품질 문제(INVALID_SCHEMA, INVALID_GROUNDING, EMPTY_RESPONSE)에 대해 자동 재시도한다:
- 최대 시도 횟수: `1 + AEGIS_LLM_MAX_RETRIES` (기본 3회)
- 같은 프롬프트를 재사용. sampling 값은 `/v1/tasks.constraints.*` caller-owned required generation controls에서 오며, Gateway는 더 이상 `temperature=0.3` 같은 task-path 기본값을 주입하지 않는다.
- 인프라 에러(TIMEOUT, MODEL_UNAVAILABLE, LLM_OVERLOADED, LLM_CIRCUIT_OPEN, INPUT_TOO_LARGE)는 재시도하지 않고 즉시 실패
- 재시도 간 딜레이 없음 (rate limit이 아닌 출력 품질 문제이므로)
- `audit.retryCount`: 실제 재시도 횟수 (0이면 첫 시도 성공)
- `audit.tokenUsage`: 모든 시도의 토큰 사용량 누적

**confidenceBreakdown.ragCoverage:**

RAG 위협 지식 DB 검색 결과에 따른 분석 배경 충실도:
- `ragCoverage = 0.4 + 0.6 × min(rag_hits / top_k, 1.0)`
- 0 hits → 0.40 (LLM 사전학습 지식만으로 분석)
- 5 hits → 1.00 (위협 DB 근거 완비)
- 이전 `consistency` 필드를 대체 (기존에는 1.0 고정이었으므로 분별력 없었음)

---

#### test-plan-propose 전용 result 필드

test-plan-propose의 result는 공통 assessment 필드에 더해 plan 필드를 포함한다:

```json
{
  "result": {
    "summary": "...",
    "claims": [],
    "caveats": [],
    "usedEvidenceRefs": [],
    "confidence": 0.45,
    "confidenceBreakdown": {},
    "needsHumanReview": true,
    "recommendedNextSteps": [],
    "policyFlags": [],
    "plan": {
      "objective": "SecurityAccess lockout behavior 평가",
      "hypotheses": [
        "연속 실패 시 ECU가 정상적으로 lockout 상태로 전이하는가"
      ],
      "targetProtocol": "UDS",
      "targetServiceClass": "SecurityAccess (0x27)",
      "preconditions": [
        "DiagnosticSession Extended (0x10 0x03) 활성"
      ],
      "dataToCollect": [
        "NRC 코드 시퀀스",
        "응답 latency 변화",
        "lockout 해제까지 소요 시간"
      ],
      "stopConditions": [
        "ECU 비응답 발생",
        "maxAttempts 도달"
      ],
      "safetyConstraints": [
        "simulator-only",
        "rateLimit: 1/sec"
      ],
      "suggestedExecutorTemplateIds": [
        "uds-security-access-probe"
      ],
      "suggestedRiskLevel": "medium"
    }
  }
}
```

**금지**: plan에 실제 CAN frame 바이트열, shell command, ECU write payload, seed/key 계산 결과를 포함하면 안 된다.

---

### GET /v1/health

서비스 상태 확인. 기존 coarse service health를 유지하면서, 첫 rollout부터 **request-aware control-signal summary**를 additive하게 제공한다.

- query parameter: `requestId` (optional)
  - 지정 시 해당 active request의 summary를 우선 반환
  - 미지정 시 현재 active request 중 가장 오래된 request의 summary를 반환
  - active request가 없거나 지정한 requestId가 현재 active set에 없으면 idle summary를 반환

```json
{
  "service": "s7-gateway",
  "status": "ok",
  "version": "1.0.0",
  "llmMode": "real",
  "modelProfiles": ["Qwen/Qwen3.6-27B-default"],
  "activePromptVersions": {
    "static-explain": "v1",
    "dynamic-annotate": "v1",
    "test-plan-propose": "v1",
    "static-cluster": "v1",
    "report-draft": "v1"
  },
  "circuitBreaker": {
    "state": "closed",
    "consecutiveFailures": 0,
    "threshold": 3,
    "recoverySeconds": 30.0
  },
  "llmBackend": {
    "status": "ok",
    "endpoint": "http://10.126.37.19:8000"
  },
  "llmConcurrency": 4,
  "activeRequestCount": 1,
  "requestSummary": {
    "requestId": "acr_01abc...",
    "endpoint": "async-chat",
    "taskType": null,
    "state": "running",
    "localAckState": "transport-only",
    "degraded": false,
    "degradeReasons": [],
    "lastAckAt": 1776151200000,
    "lastAckSource": "queue-exit",
    "blockedReason": null,
    "phase": "llm-inference",
    "elapsedMs": 18432
  },
  "rag": {
    "enabled": true,
    "kbEndpoint": "http://localhost:8002",
    "status": "ok"
  }
}
```

- `circuitBreaker` 필드는 항상 포함. `state`는 `"closed"` (정상), `"open"` (장애 차단), `"half_open"` (복구 탐침 중).
- `real` 모드일 때 `llmBackend`, `llmConcurrency` 필드가 포함되며, vLLM 백엔드 연결 상태와 동시 처리 가능 수를 보고한다.
- `activeRequestCount`는 현재 `queued` 또는 `running` 상태 request 수다.
- `requestSummary`는 full request dump가 아니라 polling caller용 compact control signal이다.
- `requestSummary.localAckState`는 `phase-advancing | transport-only | ack-break | null(idle)` 중 하나다.
- async ownership surface가 활성일 때 `requestSummary.endpoint`는 `async-chat`이 될 수 있다.
- 장시간 비스트리밍 `llm-inference` 구간에서 S7은 보통 `localAckState="transport-only"`만 보고할 수 있다. 이는 **alive but progress-unproven** 을 의미하며, elapsed time alone으로 abort하면 안 된다.
- 반대로 현재 `/v1/chat` transport timeout이 실제로 발생하면 그 transport attempt는 terminal failure이며, S7은 해당 active request를 `/health` history로 유지하지 않는다.
- `rag` 필드는 항상 포함. `status`가 `"ok"`이면 RAG 활성 상태(S5 KB 연결 확인), `"disabled"`이면 비활성 (설정 off 또는 S5 미연결).
- `rag.topK`, `rag.minScore`, `rag.policy`는 현재 Gateway가 task-pipeline RAG를 어떤 정책으로 적용하는지 노출하는 low-cardinality control signal이다. S7은 RAG 결과를 자동으로 caller evidence catalog에 등록하지 않으며, RAG hit 수는 task audit의 `ragHits`로만 반영된다.
- S7 Gateway health 자체는 백엔드/RAG 장애와 무관하게 `"ok"`를 반환한다.

### GET /v1/usage

누적 토큰/요청 사용량 통계 조회. Gateway 프로세스 기동 이후 누적.

```json
{
  "startedAt": "2026-03-20T10:00:00+00:00",
  "totalRequests": 42,
  "totalErrors": 2,
  "tokens": {
    "prompt": 63000,
    "completion": 21000,
    "total": 84000
  },
  "byEndpoint": {
    "tasks": { "prompt": 45000, "completion": 15000, "count": 30, "errors": 1 },
    "chat": { "prompt": 18000, "completion": 6000, "count": 12, "errors": 1 },
    "async_chat": { "prompt": 9000, "completion": 3000, "count": 4, "errors": 0 }
  },
  "byTaskType": {
    "static-explain": { "prompt": 30000, "completion": 10000, "count": 20 },
    "static-cluster": { "prompt": 15000, "completion": 5000, "count": 10 }
  }
}
```

### GET /metrics

Prometheus 형식 메트릭. Prometheus scraper가 이 엔드포인트를 poll한다.

| 메트릭 | 타입 | 라벨 |
|--------|------|------|
| `aegis_llm_requests_total` | Counter | endpoint, status |
| `aegis_llm_request_duration_seconds` | Histogram | endpoint |
| `aegis_llm_tokens_total` | Counter | type (prompt/completion) |
| `aegis_llm_errors_total` | Counter | endpoint, error_type |
| `aegis_llm_circuit_breaker_state` | Gauge | — |
| `aegis_llm_concurrent_requests` | Gauge | — |
| `aegis_llm_temperature` | Histogram | endpoint, task_type |
| `aegis_llm_top_p` | Histogram | endpoint, task_type |
| `aegis_llm_top_k` | Histogram | endpoint, task_type |
| `aegis_llm_min_p` | Histogram | endpoint, task_type |
| `aegis_llm_presence_penalty` | Histogram | endpoint, task_type |
| `aegis_llm_repetition_penalty` | Histogram | endpoint, task_type |
| `aegis_llm_thinking_requests_total` | Counter | endpoint, task_type, enabled |
| `aegis_llm_thinking_token_count` | Histogram | endpoint, task_type |
| `aegis_llm_finish_reason_total` | Counter | endpoint, task_type, reason |
| `aegis_llm_tool_choice_total` | Counter | endpoint, choice (`auto|required|none|named`) |

생성 제어 메트릭은 `/v1/tasks` real-client path, `/v1/chat`, `/v1/async-chat-requests`의 exchange logging path에서 기록한다. `/v1/tasks`는 bounded task type label을 사용하고 chat/async는 `task_type="none"`을 사용한다. `aegis_llm_thinking_token_count`는 backend `usage`가 `reasoning_tokens`/`thinking_tokens`를 제공할 때만 관측된다.

응답 Content-Type: `text/plain; version=0.0.4; charset=utf-8`

### GET /v1/models

등록된 model profile 목록 조회.

```json
{
  "profiles": [
    {
      "profileId": "Qwen/Qwen3.6-27B-default",
      "modelName": "Qwen/Qwen3.6-27B",
      "contextLimit": 131072,
      "allowedTaskTypes": ["static-explain", "static-cluster", "dynamic-annotate", "test-plan-propose", "report-draft"],
      "status": "available"
    }
  ]
}
```

### GET /v1/prompts

등록된 prompt template 목록 조회.

```json
{
  "prompts": [
    {
      "promptId": "static-explain",
      "version": "v1",
      "taskType": "static-explain",
      "description": "정적 분석 finding 심층 설명"
    }
  ]
}
```

---

## 에러 처리

| HTTP Status | 상황 | 비고 |
|------------|------|------|
| 200 | 정상 (status 필드로 성공/실패 구분) | Task 레벨 실패도 HTTP 200 |
| 422 | 요청 본문 검증 실패 (unknown taskType, 필수 필드 누락, 타입 불일치, maxTokens 범위 초과 등) | Pydantic 검증 |
| 500 | 서버 내부 오류 | Observability 규약 형식 |
| 503 | `/v1/chat` 전용: LLM Engine 연결 불가 또는 Circuit Breaker OPEN | `/v1/tasks`는 200 + failureCode로 반환 |

### 에러 응답 형식 (Observability 규약 준수)

HTTP 500 에러 시 아래 형식으로 응답한다 (`docs/specs/observability.md` 준수):

```json
{
  "success": false,
  "error": "Internal server error",
  "errorDetail": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "requestId": "req-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "retryable": false
  }
}
```

**참고**: Task 레벨 실패 (LLM 파싱 오류, hallucination 등)는 HTTP 200 + `TaskFailureResponse`로 반환된다. HTTP 에러는 S7 내부 예외 상황에만 사용된다.

---

---

## S3 system-stability interpretation contract (2026-04-25)

This section answers S3's system-stability WRs for async lifecycle, timeout, strict JSON, and failure-boundary classification.

### Async lifecycle and deadline ownership

- `POST /v1/async-chat-requests` returns `202 Accepted` with durable `requestId` (`acr_*`) and caller trace `traceRequestId`.
- Status polling uses only: `queued`, `running`, `completed`, `failed`, `cancelled`, `expired`. `accepted` appears only in submit response and is not a long-lived state.
- `queued`/`running` expose `localAckState` (`phase-advancing` or `transport-only`). `transport-only` means S7 still has a live transport attempt but cannot prove internal model progress.
- Terminal states are retained for at least 15 minutes through `expiresAt`; after retention, result lookup returns explicit expired semantics (`410` on result).
- `/v1/chat` remains finite synchronous surface. `X-Timeout-Seconds` is honored there with default/max 1800 seconds. Async ownership supersedes that header; S3 should use its own bounded polling deadline and then cancel or classify according to S3 policy. S3's `llm_async_poll_deadline_ms=1740000` is compatible with S7's 1800s backend timeout envelope.

### Dependency/runtime failure vs live-runtime output deficiency

| S7 condition | Surface encoding | S3 interpretation guidance |
|---|---|---|
| Backend unreachable / connect failure | `/v1/chat` HTTP 503 `retryable=true`; async `failed`, `blockedReason=backend_unreachable`; task path `MODEL_UNAVAILABLE` | Dependency/runtime failure, not output deficiency |
| Circuit breaker open | `/v1/chat` HTTP 503 `retryable=true`; async `failed`, `blockedReason=circuit_open`; task path `LLM_CIRCUIT_OPEN` | Dependency/runtime failure, retryable |
| Backend overload / retryable backend HTTP | task path `LLM_OVERLOADED`; chat may pass through backend HTTP status | Dependency/runtime failure unless S3 has a valid completed envelope from another attempt |
| Gateway or backend hard timeout | `/v1/chat` HTTP 504 `retryable=true`; async `failed`, `blockedReason=backend_timeout`; task path `TIMEOUT` | Dependency/runtime deadline failure |
| Client cancel | async `cancelled`, `blockedReason=cancelled_by_client` | Caller/runtime cancellation, not output deficiency |
| Async retention expired | result endpoint `410`, state `expired` | Ownership/retention miss; treat as runtime/deadline failure |
| Input too large / token budget guard | task path `INPUT_TOO_LARGE`, status `budget_exceeded`, `retryable=false`; oversized chat may fail through Gateway/Engine validation | Caller shaping/budget failure, not model output deficiency |
| Strict JSON contract violation while backend answered | `/v1/chat` HTTP 502 body `error=Strict JSON contract violated`, `strictJson=true`; async `failed`, `blockedReason=strict_json_contract_violation`, `errorDetail`, `retryable=true` | Live-runtime output deficiency/recovery path if S3 can assemble an honest schema-valid result envelope |
| Malformed JSON / non-object content / missing choices under strict mode | Same strict JSON violation shape | Live-runtime output deficiency/recovery path |
| Empty completion or schema/grounding failure in `/v1/tasks` | `EMPTY_RESPONSE`, `INVALID_SCHEMA`, `INVALID_GROUNDING` after S7 retries | Live-runtime output deficiency/recovery path where caller can honestly report it |

Interpretation rule: if S7 is reachable and the failure proves the model produced unusable content, S3 may classify it as `output_deficient` instead of `unavailable`. If S7 cannot establish a live backend attempt, the request times out, ownership expires, or the caller supplied an oversized/invalid request, classify it as dependency/runtime/caller-shaping failure instead.

### Strict JSON stability

`X-AEGIS-Strict-JSON: true` is stable for current Qwen/vLLM OpenAI-compatible serving. Gateway forces `response_format={"type":"json_object"}` without changing caller-supplied `chat_template_kwargs.enable_thinking`, parses `choices[0].message.content` as a top-level JSON object, compact-normalizes successful content, and scrubs `message.reasoning` to `null`. Tool-call turns should remain separate from final strict JSON calls.

### Health, capacity, and traceability

- `/v1/health` exposes `llmMode`, `modelProfiles`, `llmBackend.status`, `llmBackend.endpoint`, `llmConcurrency`, `activeRequestCount`, `circuitBreaker`, `rag`, and compact `requestSummary`.
- `/v1/models` is the authoritative model identity/capability surface (`profileId`, `modelName`, `contextLimit`, task allowlist, availability).
- Current gap: no explicit `costTier`, `queueDepth`, or queue saturation percentage field exists. Consumers should use `modelProfiles`/`/v1/models` for identity and `activeRequestCount` + `llmConcurrency` + `circuitBreaker` + request status for readiness signals.
- `X-Request-Id` is propagated to the LLM Engine on sync `/v1/chat`; async stores it as `traceRequestId` across submit/status/result while using a separate durable async `requestId`.

## 관련 문서

- [전체 개요](../specs/technical-overview.md)
- [S7. LLM Gateway 기능 명세](../specs/llm-gateway.md)
- [S2. Core Service](../specs/backend.md)
- [Shared 데이터 구조](shared-models.md)


## Qwen3.6-27B live API contract note (2026-04-24)

The live S7 default is now `Qwen/Qwen3.6-27B` on DGX Spark vLLM `0.19.1`. This is the original dense checkpoint, not `Qwen/Qwen3.6-27B-FP8`, and S7 uses no model quantization override. The API contract is intentionally unchanged despite the model swap:

- `/v1/models` and `/v1/health.modelProfiles` are the authoritative Gateway audit surfaces. They expose `Qwen/Qwen3.6-27B-default`, `modelName=Qwen/Qwen3.6-27B`, and `contextLimit=131072`. Direct Engine `/v1/models` exposes `id/root=Qwen/Qwen3.6-27B` and `max_model_len=131072`.
- `/v1/chat` remains OpenAI-compatible pass-through with Gateway model override to the active model. The response header `X-Model` records the actual model.
- `X-AEGIS-Strict-JSON: true` semantics are unchanged: Gateway injects JSON-object response format without defaulting `chat_template_kwargs.enable_thinking`, validates `choices[0].message.content` as a top-level JSON object, compacts successful content, scrubs `message.reasoning` to `null`, and fails explicitly instead of returning mixed thinking/text content. S3 strict finalizer content must therefore be JSON-only; strict finalizer calls are still allowed to think, but callers must budget enough tokens for final content after reasoning.
- Async ownership endpoints are unchanged. Strict JSON async failures remain terminal `failed` with `blockedReason=strict_json_contract_violation`, `errorDetail`, and `retryable=true`; successful results wrap the normal `/v1/chat` response under `response`. Retention remains 15 minutes after terminal state.
- Tool-call serving uses vLLM `--enable-auto-tool-choice --tool-call-parser qwen3_coder`; Qwen reasoning parser is `--reasoning-parser qwen3`. Tool calls are returned as OpenAI-compatible `message.tool_calls[]` and should be kept separate from final tool-less strict JSON finalizer requests.
- Effective deployment context is `131072` total model tokens. `/v1/tasks.constraints.maxTokens` is caller-owned and required with range `1..32768`; the rest of the task generation tuple is also required under `constraints.*`. `/v1/chat` requires and forwards caller `max_tokens`, snake_case sampling controls, and `chat_template_kwargs.enable_thinking`; S7 does not backfill omitted controls or silently truncate oversized prompts. Exceeding Gateway char guard or Engine token/context limits fails explicitly.
- Timeout guidance for S3: strict finalizer `X-Timeout-Seconds=600` baseline, 900~1800 for large evidence/deep finalization; tool-call turns 600 baseline and up to 1800 for long reasoning. Live smoke on 2026-04-24: strict JSON 4.975s, tool-call 6.274s, async strict JSON completed in ~3.8s. Hard benchmark p50/p95 for quality-heavy prompts was ~660.6s/~1244.8s, so long prompts should use health/request-summary as alive control signal rather than elapsed-time-only aborts.
