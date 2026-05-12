---
title: "S7 LLM Gateway — 아키텍처 상세"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s7-handoff/architecture.md"
last_verified: "2026-05-11"
service_tags: ["s7"]
decision_tags: []
related_pages: []
---

# S7 LLM Gateway — 아키텍처 상세

> 이 문서는 Gateway 코드의 구조, 요청 처리 흐름, 환경변수, Observability를 상세히 기술한다.

---

## 파일 구조

```
services/llm-gateway/
├── .env                          # 환경변수 (git 추적 제외)
├── .venv/                        # Python 가상환경
├── requirements.txt              # fastapi, uvicorn, pydantic, pydantic-settings, httpx, python-json-logger, prometheus_client
├── README.md                     # 실행법, 환경변수, 내부 구조
├── app/
│   ├── main.py                   # FastAPI 앱 진입점, CORS, JSON 로깅(pino 숫자), LLM 교환 로거, Circuit Breaker/TokenTracker 초기화, 워밍업, dump 자동 정리
│   ├── config.py                 # pydantic-settings 환경변수 -> Settings 객체 (.env 자동 로드)
│   ├── context.py                # contextvars 기반 요청 컨텍스트 (requestId)
│   ├── errors.py                 # GatewayError 계층 (LlmTimeoutError, LlmUnavailableError, LlmHttpError, LlmCircuitOpenError)
│   ├── circuit_breaker.py        # CircuitBreaker (CLOSED->OPEN->HALF_OPEN 상태 전이)
│   ├── request_tracker.py        # in-flight `/v1/tasks` / `/v1/chat` control-signal tracker (`activeRequestCount`, `requestSummary`)
│   ├── async_chat_manager.py     # async ownership surface manager (`submit/status/result/cancel`, retention, expiry)
│   ├── types.py                  # TaskType, TaskStatus, FailureCode StrEnum
│   ├── clients/
│   │   ├── base.py               # LlmClient ABC
│   │   └── real.py               # RealLlmClient (OpenAI-compatible, vLLM 대상, httpx connection pooling, thinking 제어, 토큰 캡처, structured output, LLM 교환 전문 로깅)
│   ├── schemas/
│   │   ├── request.py            # TaskRequest + AsyncChatSubmitRequest
│   │   └── response.py           # Task responses + async accepted/status/result responses
│   ├── registry/
│   │   ├── prompt_registry.py    # PromptEntry + PromptRegistry (5개 task type 등록)
│   │   └── model_registry.py     # ModelProfile + ModelProfileRegistry (Settings 기반)
│   ├── validators/
│   │   ├── schema_validator.py   # 필수 필드, confidence 범위, plan 존재 검증
│   │   └── evidence_validator.py # refId whitelist 기반 hallucination 감지
│   ├── pipeline/
│   │   ├── prompt_builder.py     # V1PromptBuilder (3계층 trust 분리, delimiter, threat_context 지원)
│   │   ├── response_parser.py    # V1ResponseParser (JSON/코드블록/commentary-wrapped JSON 추출, <think> 태그 방어)
│   │   ├── confidence.py         # ConfidenceCalculator (4항목 가중합, S3 자체 산출)
│   │   └── task_pipeline.py      # TaskPipeline 오케스트레이터 (전체 흐름 제어, Semaphore(N) 동시성, RAG 증강)
│   ├── rag/                      # 위협 지식 DB (RAG) 모듈
│   │   ├── threat_search.py      # ThreatSearch — S5 KB REST API 호출
│   │   └── context_enricher.py   # ContextEnricher — task type별 쿼리 추출 + RAG 컨텍스트 조립
│   ├── metrics/
│   │   ├── prom.py               # Prometheus 메트릭 정의 (Counter, Histogram, Gauge)
│   │   └── token_tracker.py      # TokenTracker — 누적 토큰/요청 통계
│   ├── mock/
│   │   └── dispatcher.py         # V1MockDispatcher (taskType enum 기반)
│   └── routers/
│       └── tasks.py              # POST /v1/tasks, /v1/chat(opt-in strict JSON), POST/GET/DELETE async ownership endpoints, GET /v1/health, /v1/usage, /v1/models, /v1/prompts, /metrics
├── scripts/
│   └── threat-db/                # 위협 지식 DB ETL 파이프라인 (S4 이식)
│       ├── build.py              # ETL 오케스트레이터 (다운로드 -> 파싱 -> 교차참조 -> Qdrant 적재)
│       ├── schema.py             # UnifiedThreatRecord, CapecBridge
│       ├── taxonomy.py           # 8개 자동차 공격 표면 분류체계
│       ├── download.py           # CWE/NVD/ATT&CK/CAPEC 다운로더
│       ├── parse_cwe.py          # CWE XML 파서 (944건)
│       ├── parse_nvd.py          # NVD JSON 파서 (702건)
│       ├── parse_attack.py       # ATT&CK STIX 파서 (83건)
│       ├── parse_capec.py        # CAPEC XML 브릿지 파서
│       ├── crossref.py           # 3방향 교차 참조 엔진
│       ├── load_qdrant.py        # Qdrant 파일 기반 적재
│       ├── stats.py              # 통계 생성기
│       ├── fmt.py                # 터미널 포매팅 유틸
│       └── requirements.txt      # ETL 전용 의존성
├── data/
│   └── qdrant/                   # Qdrant 파일 기반 벡터 DB (ETL 빌드 산출물, git 추적 제외)
├── tests/                        # 206 tests total (2026-04-21 기준)
│   ├── conftest.py               # 공통 fixture: TestClient(client_live, client+mock_pipeline), 요청 빌더
│   ├── test_response_parser.py   # 12 tests
│   ├── test_evidence_validator.py # 5 tests
│   ├── test_confidence.py        # 10 tests (RAG 분화 테스트 포함)
│   ├── test_schema_validator.py  # 7 tests
│   ├── test_mock_dispatcher.py   # 10 tests
│   ├── test_prompt_builder.py    # 12 tests
│   ├── test_registry.py          # 12 tests
│   ├── test_threat_search.py     # 6 tests (min_score 필터 포함)
│   ├── test_context_enricher.py  # 11 tests (ruleMatches fallback, min_score 전달 포함)
│   ├── test_pipeline_retry.py   # 13 tests (재시도 성공/소진/HTTP에러/토큰누적/CB OPEN)
│   ├── test_circuit_breaker.py        # 10 tests (상태 전이, 복구, snapshot)
│   ├── test_request_tracker.py       # 4 tests (idle/oldest/targeted request summary, clear semantics)
│   ├── test_async_chat_manager.py    # 3 tests (submit/complete, cancel, expiry)
│   ├── test_token_tracker.py         # 7 tests (누적 집계, endpoint별, taskType별)
│   ├── test_contract_endpoints.py      # 37 tests (health request-aware summary, chat proxy strict JSON, async ownership endpoints, async strict JSON terminal failure)
│   ├── test_contract_task_success.py   # 17 tests (POST /v1/tasks 성공 응답 JSON 계약 검증)
│   ├── test_contract_task_failure.py   # 22 tests (실패 응답 구조, retryable, 500 형식, failureCode*status)
│   └── test_contract_input_validation.py # 8 tests (422 입력 검증: taskType/필드 누락/maxTokens 범위 + async chat messages 검증)
```

---

## 요청 처리 흐름 (POST /v1/tasks)

```
S2 요청 -> tasks.py (POST /v1/tasks)
  -> RequestTracker에 queued request 등록
  -> PromptRegistry에서 prompt 조회
  -> ModelProfileRegistry에서 profile 조회
  -> [RAG] ContextEnricher로 위협 지식 DB 검색 + 컨텍스트 조립 (선택적)
  -> V1PromptBuilder로 3계층 프롬프트 조립 (trusted/semi-trusted/untrusted + RAG 컨텍스트 분리)
  -> [Retry Loop] (최대 1 + AEGIS_LLM_MAX_RETRIES 회):
      -> LLM 호출 (Semaphore(N)으로 동시성 제어, 기본 4)
          mock: V1MockDispatcher
          real: RealLlmClient (/v1/chat/completions, vLLM 대상, connection pooling)
          -> RequestTracker는 `prompt-build -> llm-inference(queue/running) -> validation` phase를 갱신하고, 장시간 non-streaming wait는 `localAckState=transport-only`로 노출
          -> LLM 교환 전문을 logs/llm-exchange.jsonl에 기록
      -> V1ResponseParser로 Assessment JSON 파싱
      -> SchemaValidator로 구조 검증
      -> EvidenceValidator로 refId hallucination 감지
      -> 실패 시: INVALID_SCHEMA/INVALID_GROUNDING/EMPTY_RESPONSE -> 재시도
      -> 인프라 에러 -> 즉시 실패:
          - LlmCircuitOpenError -> LLM_CIRCUIT_OPEN (retryable)
          - LlmTimeoutError -> TIMEOUT (retryable)
          - LlmUnavailableError -> MODEL_UNAVAILABLE (retryable)
          - LlmHttpError 429/503 -> LLM_OVERLOADED (retryable)
          - LlmInputTooLargeError -> INPUT_TOO_LARGE (non-retryable)
  -> ConfidenceCalculator로 신뢰도 산출 (자체 계산, ragCoverage 반영)
  -> TaskSuccessResponse 또는 TaskFailureResponse 반환
  -> terminal 응답 후 RequestTracker에서 active request 제거
```

---

## 요청 처리 흐름 (phase-2 async ownership)

```
S3/S2 submit -> tasks.py (POST /v1/async-chat-requests)
  -> AsyncChatRequestManager가 durable `requestId` 발급
  -> submit response는 `accepted` + status/result/cancel URLs 반환
  -> RequestTracker에 `endpoint=async-chat` active request 등록
  -> background task가 동일 LLM backend 호출을 수행
      -> queue exit / running / transport-only / terminal 상태를 manager + RequestTracker에 반영
      -> 성공 시 `/v1/chat` success payload를 `response` 아래에 저장
      -> 실패/취소 시 explicit terminal state 저장
  -> status endpoint: ownership metadata + `resultReady` + `expiresAt`
  -> result endpoint: wrapped final response or explicit not-ready/failed/expired
  -> cancel endpoint: best-effort cancel
```

핵심 분리:
- `/v1/chat` = finite synchronous proxy
- async ownership surface = durable ownership / retention / reconnect-safe result retrieval

---

## Confidence 산출

```
confidence = 0.45 * grounding + 0.30 * deterministicSupport + 0.15 * ragCoverage + 0.10 * schemaCompliance
```
- ragCoverage = 0.4 + 0.6 * min(rag_hits / top_k, 1.0)
- 0 hits -> 0.40, 5 hits -> 1.00

---

## LLM 모드 2종

| 모드 | 클라이언트 | 엔드포인트 | 용도 |
|------|-----------|-----------|------|
| `mock` | V1MockDispatcher | (내부) | 개발/테스트 |
| `real` | RealLlmClient | `/v1/chat/completions` | **현재 운영 모드** (DGX Spark vLLM) |

---

## 환경변수 (.env)

`services/llm-gateway/.env` 파일에서 환경변수를 로드한다. pydantic-settings가 자동으로 읽으며, `.env`는 `.gitignore`에 의해 Git 추적 제외.

| 변수 | 기본값 | 설명 |
|------|--------|------|
| AEGIS_LLM_MODE | `mock` | `mock` / `real` |
| AEGIS_LLM_ENDPOINT | `http://10.126.37.19:8000` | LLM Engine 주소 (DGX Spark vLLM) |
| AEGIS_LLM_MODEL | `Qwen/Qwen3.6-27B` | 현재 운영 모델명. 원본 dense checkpoint이며 FP8/quantized 모델 아님 |
| AEGIS_LLM_API_KEY | (빈 문자열) | API 키 (vLLM: 불필요) |
| AEGIS_LLM_CONCURRENCY | `4` | 동시 LLM 요청 수 |
| AEGIS_LLM_CONNECT_TIMEOUT | `10` | LLM Engine 연결 타임아웃 (초) |
| AEGIS_LLM_READ_TIMEOUT | `600` | LLM Engine 응답 대기 타임아웃 (초) |
| AEGIS_LLM_MAX_INPUT_CHARS | `800000` | 프롬프트 문자 수 상한 (~200K 토큰) |
| AEGIS_LLM_MAX_RETRIES | `2` | LLM 출력 품질 재시도 횟수 (총 시도 = 1 + max_retries) |
| AEGIS_CIRCUIT_BREAKER_THRESHOLD | `3` | 연속 실패 횟수 -> Circuit Breaker OPEN |
| AEGIS_CIRCUIT_BREAKER_RECOVERY_SECONDS | `30` | OPEN -> HALF_OPEN 전환 대기 시간(초) |
| AEGIS_RAG_ENABLED | `true` by normal integration; 2026-04-28 MTP benchmarks used `false` to isolate backend behavior | RAG 위협 지식 DB |
| AEGIS_KB_ENDPOINT | `http://localhost:8002` | S5 Knowledge Base 엔드포인트 |
| AEGIS_RAG_TOP_K | `5` | RAG 검색 결과 상위 k건 |
| AEGIS_RAG_MIN_SCORE | `0.35` | 이 점수 미만의 RAG 결과 제외 |
| AEGIS_CORS_ALLOW_ORIGINS | `http://localhost:5173,http://localhost:3000` | CORS 허용 오리진 |
| AEGIS_CONFIDENCE_W_GROUNDING | `0.45` | Confidence 가중치: evidence grounding |
| AEGIS_CONFIDENCE_W_DETERMINISTIC | `0.30` | Confidence 가중치: deterministic support |
| AEGIS_CONFIDENCE_W_RAG_COVERAGE | `0.15` | Confidence 가중치: RAG coverage |
| AEGIS_CONFIDENCE_W_SCHEMA | `0.10` | Confidence 가중치: schema compliance |
| LOG_DIR | `../../logs` (프로젝트 루트 `logs/`) | JSONL 로그 파일 디렉토리 |

### `scripts/start-llm-gateway.sh` hot reload

- 2026-04-21 기준 S7 단독 기동 스크립트는 기본적으로 uvicorn `--reload --reload-dir app`을 사용한다.
- `S7_HOT_RELOAD=0` 또는 공통 `AEGIS_HOT_RELOAD=0`으로 opt out 가능하다.
- `AEGIS_PRINT_CMD=1`을 설정하면 실제 서버를 기동하지 않고 실행될 uvicorn command만 출력한다.
- 포트는 기본 `8000`이며, 필요 시 `AEGIS_LLM_GATEWAY_PORT`로 override할 수 있다.

---

## Qwen3.6-27B vLLM Engine recipe (verified 2026-04-28)

S7 Gateway는 OpenAI-compatible `/v1/chat/completions` backend만 요구한다. 현재 DGX Spark live backend는 `Qwen/Qwen3.6-27B` 원본 dense checkpoint를 vLLM 0.20.0로 서빙한다.

현재 live command evidence:

```bash
vllm serve Qwen/Qwen3.6-27B \
  --host 0.0.0.0 \
  --port 8000 \
  --max-model-len 131072 \
  --max-num-batched-tokens 8192 \
  --gpu-memory-utilization 0.9 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_coder \
  --reasoning-parser qwen3 \
  --speculative-config '{"method":"mtp","num_speculative_tokens":1}' \
  --language-model-only \
  -tp 1
```

Important model identity rule:

```text
current model: Qwen/Qwen3.6-27B
not current: Qwen/Qwen3.6-27B-FP8
quantization override: none
--quantization: not used
```

현재 recipe 재기동:

```bash
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 \
  'source $HOME/.local/bin/env && cd ~/spark-vllm-docker && \
   nohup ./run-recipe.sh qwen3.6-27b-origin --solo --tensor-parallel 1 --port 8000 \
   > /tmp/vllm-launch.log 2>&1 &'
```

주요 현재값:

| 변수/옵션 | 값 | 설명 |
|---|---|---|
| served model | `Qwen/Qwen3.6-27B` | Gateway `AEGIS_LLM_MODEL`과 맞춘다 |
| `--max-model-len` | `131072` | live deployment context limit |
| `--language-model-only` | enabled | S7 text-only workload |
| `--reasoning-parser` | `qwen3` | thinking/content 분리 |
| `--tool-call-parser` | `qwen3_coder` | OpenAI-compatible tool calls |
| `--quantization` | 미사용 | 모델 양자화 없음 |
| TP | `1` | DGX Spark 단일 GB10 기준 |

전환/검증 절차:

1. 기존 `vllm_node`가 잘못된 모델이면 `docker stop vllm_node && docker rm vllm_node`.
2. 위 `qwen3.6-27b-origin` recipe로 재기동.
3. `curl http://10.126.37.19:8000/v1/models`가 `id=root=Qwen/Qwen3.6-27B`, `max_model_len=131072`를 반환하는지 확인.
4. Gateway `/v1/models`가 `Qwen/Qwen3.6-27B-default`, `contextLimit=131072`를 반환하는지 확인.
5. strict JSON/tool-call smoke를 실행해 S3 계약을 재확인.

4. Gateway `services/llm-gateway/.env`의 `AEGIS_LLM_MODEL`을 served model name과 일치시킨 뒤 Gateway를 restart한다.
5. `cd services/llm-gateway && .venv/bin/python3 -m pytest -q`와 legacy `services/llm-gateway/scripts/integration-test-static.sh`로 회귀를 확인한다.

---


## Qwen3.6-27B vLLM 0.20.0 + MTP=1 serving notes (verified 2026-04-28)

S7 Gateway still targets a single OpenAI-compatible backend, but the live DGX backend is now the restored HF-fresh vLLM image with MTP enabled.

| 항목 | 값 |
|------|----|
| Engine URL | `http://10.126.37.19:8000` |
| Container/image | `vllm_node` / `qwen36-vllm:hf-fresh` |
| vLLM | `0.20.0` (`/opt/vllm-official/bin/vllm`) |
| Model | `Qwen/Qwen3.6-27B` original dense |
| Recipe | `/home/accslab/spark-vllm-docker/recipes/qwen3.6-27b-origin.yaml` |
| Context | `131072` |
| MTP | `--speculative-config {"method":"mtp","num_speculative_tokens":1}` |
| Tool calling | `--enable-auto-tool-choice --tool-call-parser qwen3_coder` |
| Reasoning parser | `--reasoning-parser qwen3` |

Gateway-facing behavior is unchanged: `/v1/chat` remains OpenAI-compatible pass-through unless strict JSON is requested; strict JSON continues to force `response_format=json_object` while effective `enable_thinking` defaults to `true`; tool calls remain `message.tool_calls[]` with JSON-string `function.arguments`. vLLM currently warns that `min_p` and `logit_bias` do not work with speculative decoding, so S7 callers should avoid relying on those fields while MTP is enabled.

Verification artifacts:

- `services/llm-gateway/bench/mtp_gateway_ab.py` — strict A/B harness using bubblewrap for generated-code validation.
- `services/llm-gateway/bench/results/mtp-ab-qwen36-27b-strict-20260428T034632Z/s7-qwen36-mtp-benchmark-report.md` — no-MTP 7.638 tok/s vs MTP=1 15.132 tok/s aggregate.
- `services/llm-gateway/bench/results/bfcl-v4-gateway-smoke-qwen36-27b-20260428T030647Z/` and `...033026Z/` — BFCL smoke 24/25 before/after MTP.
- DGX runbook: `/home/accslab/spark-vllm-docker/docs/QWEN36_VLLM_RUNBOOK_20260428.md`.


## Observability

`wiki/canon/specs/observability.md` 준수.
- service 식별자: `s7-gateway`
- 로그 파일: `logs/aegis-llm-gateway.jsonl`
- X-Request-Id: 수신 시 전파, 미전달 시 `gw-` 접두사로 자동 생성, 모든 응답에 포함
- `/v1/chat`: `X-Timeout-Seconds` 헤더로 호출자 주도 타임아웃 지원
- `/v1/chat`: `X-AEGIS-Strict-JSON` 헤더로 opt-in strict JSON mode 지원

### 로그 파일

| 파일 | 내용 | stdout |
|------|------|--------|
| `logs/aegis-llm-gateway.jsonl` | 앱 구조화 로그 (JSON, requestId 포함) | O |
| `logs/llm-exchange.jsonl` | LLM Engine 요청/응답 JSON 전문 (프롬프트 + LLM 응답 완전 기록) | X |
| `scripts/.logs/llm-gateway.log` | 프로세스 stdout/stderr 캡처 (`start.sh` 기동 시) | -- |

- `llm-exchange.jsonl`은 디버깅/프롬프트 분석용. 한 줄 = 한 LLM 호출
- 2026-04-27 기준 `/v1/tasks`의 `RealLlmClient` 경로뿐 아니라 `/v1/chat` 및 `/v1/async-chat-requests` 경로도 `request`와 `response` 필드를 `llm-exchange.jsonl`에 기록한다. 즉 S3 chat/async 호출도 requestId로 프롬프트 전문과 LLM 응답 전문을 추적할 수 있어야 한다.
- 2026-04-29 기준 모든 LLM exchange log는 `generation` block을 포함한다: `maxTokens`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`, `enableThinking`. Prometheus도 같은 생성 제어값을 low-cardinality histogram/counter로 노출한다.
- Gateway가 직접 생성하는 `/v1/chat` 및 async ownership 오류 응답은 공통 observability envelope(`success=false`, `error`, `retryable`, `errorDetail.code/message/requestId/retryable`)를 포함한다. 하위 vLLM backend의 원본 HTTP 오류 pass-through는 별도 backend payload 호환성을 우선할 수 있다.
- 로그 정리: `scripts/common/reset-logs.sh` (S2 관리)

### Generation-control Prometheus metrics (2026-04-29)

| Metric | Meaning | Labels |
|---|---|---|
| `aegis_llm_temperature` | observed request temperature | endpoint, task_type |
| `aegis_llm_top_p` | observed request top_p | endpoint, task_type |
| `aegis_llm_top_k` | observed request top_k (`-1` is bucketed as 0) | endpoint, task_type |
| `aegis_llm_min_p` | observed request min_p | endpoint, task_type |
| `aegis_llm_presence_penalty` | observed request presence_penalty | endpoint, task_type |
| `aegis_llm_repetition_penalty` | observed request repetition_penalty | endpoint, task_type |
| `aegis_llm_thinking_requests_total` | effective thinking request count | endpoint, task_type, enabled |
| `aegis_llm_thinking_token_count` | backend-reported reasoning/thinking tokens when available | endpoint, task_type |
| `aegis_llm_finish_reason_total` | backend finish reason counts | endpoint, task_type, reason |

Endpoint labels are intentionally low-cardinality (`tasks`, `chat_proxy`, `async_chat`), and `task_type` is bounded to the five task types or `none` for chat/async. Per-request details remain in `logs/llm-exchange.jsonl`.

---

## 동시성 제어

- `asyncio.Semaphore(settings.llm_concurrency)` — 기본 4, 환경변수 `AEGIS_LLM_CONCURRENCY`로 조정
- vLLM의 continuous batching + PagedAttention을 활용하여 동시 요청 처리
- `RealLlmClient`가 `httpx.AsyncClient`를 인스턴스 레벨에서 유지 (connection pooling + keep-alive)
- lifespan shutdown 시 `aclose()` 호출

---

## Backpressure 처리

- vLLM 429/503 응답 시 `LlmHttpError(retryable=True)` -> `FailureCode.LLM_OVERLOADED` (`retryable: true`)
- vLLM 연결 불가 시 `LlmUnavailableError` -> `FailureCode.MODEL_UNAVAILABLE` (`retryable: true`)
- Circuit Breaker OPEN 시 `LlmCircuitOpenError` -> `FailureCode.LLM_CIRCUIT_OPEN` (`retryable: true`)
- 기타 HTTP 에러 -> `FailureCode.MODEL_UNAVAILABLE` (`retryable: false`)
- `TaskFailureResponse`에 `retryable: bool` 필드로 S2에 전달

## `/v1/health` request-aware control signal (2026-04-14)

- `RequestTracker`가 현재 active `/v1/tasks`, `/v1/chat`, `/v1/async-chat-requests` request를 compact하게 추적한다.
- `/v1/health`는 기존 coarse service health에 더해:
  - process liveness `status`
  - LLM readiness fields `ready`, `llmReady`, `degraded`, `degradeReasons`, `blockedReason`
  - dependency snapshots `dependencyStatus`, `llmBackend`, `circuitBreaker`, `rag`
  - `activeRequestCount`
  - `requestSummary`
  - optional `requestId` query targeting
  을 additive하게 제공한다.
- `requestSummary`는 full history dump가 아니라 현재 in-flight request 하나의 control signal이며, active request가 없으면 `state=\"idle\"` summary로 접힌다.
- `/v1/health.status="ok"`는 Gateway process liveness이며 DGX/vLLM readiness가 아니다. `llmBackend.status="unreachable"` 또는 circuit breaker `open|half_open`이면 `ready=false`, `llmReady=false`, `degraded=true`와 machine-readable `blockedReason`을 노출한다.
- `/v1/health` backend probe는 process-local short TTL cache를 사용한다(`AEGIS_LLM_HEALTH_CACHE_TTL_SECONDS`, 기본 1.0s). 반복 poll은 `llmBackend.cached=true`로 표시될 수 있으며 TTL 만료 후에는 DGX/OpenVPN proxy `/health`를 다시 확인한다.
- `/v1/health.rag`는 RAG 정책 control signal(`topK`, `minScore`, `policy`)을 포함한다. 현재 정책은 `task-pipeline-context-enrichment`이며 RAG hit는 evidence catalog authority가 아니다. RAG disabled/degraded alone does not block `llmReady`.
- 현재 S7에서 true local ack source로 취급하는 것은 queue exit / phase transition / terminal transition이다.
- non-streaming `llm-inference` 구간은 세부 progress proof가 없으므로 `localAckState=\"transport-only\"`로 노출한다.
- 현재 `/v1/chat`의 finite transport timeout은 그대로 유지되므로 timeout이 발생한 transport attempt는 terminal failure이고, `/health`는 완료/실패 history를 보존하지 않는다.
- async ownership surface가 활성인 경우 `requestSummary.endpoint`는 `async-chat`이 될 수 있다. 다만 `/health`는 여전히 summary-only이며 terminal result retrieval authority는 아니다.
- `/v1/tasks` is finite synchronous TaskResponse-envelope compatibility: there is no durable `/v1/tasks/{id}` status/result/cancel surface, and `/v1/health?requestId=` is active progress visibility only.

---

## Thinking mode default (2026-04-28)

- Gateway forwarded request의 기본 effective thinking은 `true`다. `_prepare_chat_forward`는 누락/잘못된 `chat_template_kwargs.enable_thinking`을 `true`로 보정한다.
- strict JSON도 thinking을 끄지 않는다. `_enforce_strict_json_request_controls`는 `response_format={"type":"json_object"}`와 기본 thinking 보정만 수행한다.
- `/v1/chat` 성공 응답은 `X-AEGIS-Effective-Thinking` 헤더를 반환하고, `llm_exchange` 로그는 `effectiveThinking`을 남긴다.

## `/v1/chat` opt-in strict JSON mode (2026-04-14)

- 활성화 헤더: `X-AEGIS-Strict-JSON: true` (`1`/`yes`/`on`도 허용)
- 기본 `/v1/chat`은 기존과 동일한 pass-through 동작 유지
- strict mode일 때 Gateway가 `response_format={"type":"json_object"}`를 강제로 주입하고 `chat_template_kwargs.enable_thinking`은 effective default `true`를 적용한다
- 성공 응답에서는 `choices[0].message.content`가 JSON object 문자열인지 검증하고 compact JSON으로 정규화
- backend가 `message.reasoning`을 포함해도 strict mode 응답에서는 `null`로 scrub
- strict mode 계약 불만족 시 backend 200을 그대로 반환하지 않고 **502**로 명확히 실패하며, 공통 error envelope의 `errorDetail.code=LLM_PARSE_ERROR`로 노출한다.
- async ownership request에서 strict mode 계약 불만족 시 `completed`로 저장하지 않고 `failed` terminal state + `blockedReason=strict_json_contract_violation` + structured `errorDetail` + `retryable=true`를 status/result 응답에 남긴다.
- 2026-04-27 repo/in-process 회귀: `services/llm-gateway` 전체 pytest 238개 통과. `/v1/chat` 및 async exchange full request/response logging, generated/preserved `X-Request-Id` headers, structured Gateway error envelope를 contract test로 고정했다.

## Thinking 모드 제어

- `RealLlmClient`가 기본적으로 `chat_template_kwargs: {"enable_thinking": true}`를 주입한다. caller가 boolean `false`를 명시한 `/v1/chat`/async 요청만 non-thinking으로 보존한다
- `response_format: {"type": "json_object"}`로 JSON 출력 보장 (structured output)
- `V1ResponseParser`에서 `<think>...</think>` 태그 strip (safety net)
- 프롬프트에 `/no_think` 포함 (추가 safety net)

## S7 generation policy constants (2026-04-29)

- `app/generation_policy.py` holds S7-owned `SamplingDefaults` and `TimeoutDefaults`.
- The file includes the required model-pin warning: Qwen3.6 values were validated against the HF model card retrieved on 2026-04-28 and must be revalidated on model-family/card change.
- These constants do **not** reintroduce hidden Gateway defaults for `/v1/tasks`; that public surface remains caller-owned. They are for warmup, examples/tests, and cross-lane coordination.

## `/v1/tasks` caller-owned generation contract (2026-04-29)

- `/v1/tasks` generation controls are caller-owned and required under camelCase `constraints.*`: `enableThinking`, `maxTokens`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`.
- `TaskRequest.constraints` is required. Missing `constraints` or any generation control is an intentional 422 contract failure.
- `TaskPipeline._call_llm()` reads generation controls only from `request.constraints`; the previous hard-coded task-path `temperature=0.3` policy is removed.
- `LlmClient.generate()` / `RealLlmClient.generate()` receive the full generation tuple and per-request `enable_thinking`, then forward vLLM/OpenAI-compatible snake_case fields (`max_tokens`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `chat_template_kwargs.enable_thinking`).
- Observability must cover both exchange-log paths: the task path inside `RealLlmClient.generate()` and the chat/async router `_log_llm_exchange()` path.
- `/v1/chat` remains snake_case passthrough; `/v1/async-chat-requests` accepts the same snake_case sampling fields additively. These surfaces are not part of the `/v1/tasks` breaking required contract.
