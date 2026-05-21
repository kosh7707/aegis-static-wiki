---
title: "S7. LLM Gateway + LLM Engine 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s7-handoff/README.md"
last_verified: "2026-05-21"
service_tags: ["s7"]
decision_tags: []
related_pages: []
---

# S7. LLM Gateway + LLM Engine 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.** 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다.
> 이 문서는 S7(LLM Gateway + LLM Engine 관리) 개발을 이어받는 다음 세션을 위한 인수인계서다.
> 이것만 읽으면 현재 상태를 파악하고 바로 작업을 이어갈 수 있어야 한다.
> **마지막 업데이트: 2026-05-21**

---

## 0. Fresh-session bootstrap checklist (2026-05-21)

다음 S7 세션은 아래 순서대로 읽으면 된다. 이 섹션이 현재 S7 bootstrap의 압축 진입점이다.

1. Local bootstrap:
   - AEGIS repo: `docs/AEGIS.md`
   - AEGIS repo: `docs/mcp.md`
2. Canonical wiki:
   - `wiki/system/index.md`
   - `wiki/canon/charter/aegis.md`
   - 이 문서: `wiki/canon/handoff/s7/readme.md`
3. Current S7 contract pages:
   - `wiki/canon/api/llm-gateway-api.md` — current public contract, including `X-AEGIS-Paper-Controls`.
   - `wiki/canon/handoff/s7/session-omx-1779269184895-8gprdc.md` — latest completed S7 implementation session.
   - `wiki/canon/work-requests/s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path.md` — notice sent to S3 with the implemented contract.
   - `wiki/canon/handoff/s7/llm-engine-ops.md` — DGX Spark / OpenVPN proxy / SSH runbook.
4. Before editing code:
   - Run `git status --short`.
   - Restrict S7 edits to `services/llm-gateway/**` unless the user explicitly changes lane/scope.
   - Treat current non-S7 worktree modifications under S3/S4/S5 paths as other-lane state; do not revert or “clean up” them from an S7 session.
5. S7 verification baseline:
   - Use a venv if needed; previous verification used `/tmp/aegis-s7-venv`.
   - Canonical command: `cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests`.
   - Latest recorded result: **328 passed in 6.61s**.
6. Open WR triage:
   - Use `aegis-static-wiki.list_my_open_wrs(lane="s7", include_to_all=true)`.
   - As of this refresh, S7 completed the S3 paper-controls ITERATE WR and the S3 async/observability unblock WR. The remaining S5 notice is informational/RCA follow-up, not evidence of S5 failure.

## Current handoff headline

S7 has implemented the phase-scoped TraceAudit paper-controls contract requested by S3. S3 should now use `X-AEGIS-Paper-Controls: true` and send all Qwen controls explicitly. S7 remains value-agnostic: it validates, preserves, forwards, observes, and fails loudly; S3 owns concrete hyperparameter values.

## 1. 프로젝트 전체 그림

### AEGIS 8세션 운영에서 S7의 위치

```
                  S1 / S1-QA (Frontend :5173)
                          |
                     S2 (AEGIS Core :3000)  <- 플랫폼 오케스트레이터
                    /     |     \      \
                 S3       S4     S5      S6
               Agent    SAST     KB    동적분석
              :8001    :9000   :8002    :4000
                |
           S7 Gateway (:8000)  <- LLM 단일 관문
                |
           LLM Engine
            (DGX Spark)
```

### S7 소유 서비스

| 서비스 | 포트/위치 | 역할 |
|--------|-----------|------|
| **LLM Gateway** | :8000 | 5개 taskType + `/v1/chat` 프록시 + `/v1/async-chat-requests` + opt-in strict JSON + opt-in paper-controls 계약 (LLM 단일 관문) |
| **LLM Engine** | 10.126.37.19:8000 (DGX Spark) | `Qwen/Qwen3.6-27B`, vLLM 0.20.0 + MTP=1 서빙 |

### S7의 정체성

> S7은 AEGIS 플랫폼의 **LLM 단일 관문(Gateway)** 이자 **LLM Engine 운영자**다.
> 모든 LLM 호출은 S7(Gateway)을 경유한다. LLM Engine을 직접 호출하지 않는다.

---

## 2. 역할과 경계

### 소유 코드

- `services/llm-gateway/` — Gateway 서버 (Task API + `/v1/chat` 프록시)

### 관리 문서

| 문서 | 경로 |
|------|------|
| 이 인수인계서 | `wiki/canon/handoff/s7/` |
| LLM Gateway 기능 명세 | `wiki/canon/specs/llm-gateway.md` |
| LLM Engine 명세 | `wiki/canon/specs/llm-engine.md` |
| S2/S3 <-> S7 API 계약서 | `wiki/canon/api/llm-gateway-api.md` |
| S7 <-> LLM Engine 계약 | `wiki/canon/api/llm-engine-api.md` |

### API 계약 소통 원칙 (필수)

- **다른 서비스의 동작은 반드시 API 계약서(`wiki/canon/api/`)로만 파악한다**
- **다른 서비스의 코드를 절대 읽지 않는다**
- 계약서에 없는 필드/엔드포인트는 "존재하지 않는다"고 간주한다
- **공유 모델(`shared-models.md`) 또는 API 계약서 변경 시, 영향받는 상대에게 work-request로 고지**

### 작업 요청

- **경로**: `wiki/canon/work-requests/`
- **관리**: `aegis-static-wiki` MCP (`list_my_open_wrs`, `register_wr`, `complete_wr`)
- **파일명**: `{보내는쪽}-to-{받는쪽}-{주제}.md`
- **작업 완료 후 삭제** (받는 쪽이 처리 후 수행, `to-all`은 발신자가 삭제)

### Codex / OMX 운영 메모

- 하드 가드레일 재확인:
  - S7은 **다른 서비스 코드를 읽지 않는다**.
  - 다른 서비스와의 소통은 **WR로만** 한다.
  - 연동 판단은 API 계약서만 보고, 계약이 비었거나 낡았으면 담당자에게 WR을 보낸다.
  - **커밋은 하지 않는다**. 커밋은 S2 세션만 한다.
  - S7 세션은 `services/llm-gateway/**`만 수정한다. 현재 worktree에 S3/S4/S5 파일 변경이 보여도 다른 lane state로 취급하고 revert하지 않는다.
  - `scripts/start*.sh`, `scripts/stop*.sh`, 서비스 기동 명령은 **사용자 허락 없이 실행하지 않는다**.
  - 로그/장애 분석은 `log-analyzer` MCP를 우선 사용한다.
- 장기 S7 작업 메모와 후속 세션 인계는 `$note`와 `.omx` 메모리를 사용한다.
- 단, `docs/AEGIS.md`(2026-04-04) 기준으로 공용 `.omx/notepad.md`, `.omx/project-memory.json`은 **전역 durable 정보만** 남긴다. S7 전용 장문 작업 메모, 중간 추론, 세부 TODO는 `wiki/canon/handoff/s7/` 또는 `.omx/state/sessions/{session-id}/...`로 남긴다.
- **`$ralph`**: Gateway 정책, prompt/profile 조정, DGX 연동 안정화처럼 단일 lane 완주가 필요한 작업에 우선 사용한다.
- **`$team`**: S2/S3/S5와 계약·RAG·모델 소비 경계를 동시에 맞춰야 하거나, Gateway/Engine 운영과 호출자 검증을 병렬로 돌릴 때 우선 사용한다.
- **`$trace`**: 이전 Codex/OMX 세션의 장애 대응, 호출 흐름, 프롬프트/모델 판단 경로 복기에 사용한다.
- skill을 써도 **LLM 호출 단일 관문 원칙, API 계약, work-request 규칙은 그대로 유지한다**.

---

## 3. API

### LLM Gateway (:8000)

| 메서드 | 경로 | 용도 |
|--------|------|------|
| POST | `/v1/tasks` | Task 기반 AI 분석 요청 (5개 taskType) |
| POST | `/v1/chat` | OpenAI-compatible chat completion 프록시 (finite sync, strict JSON/paper-controls smoke 지원) |
| POST | `/v1/async-chat-requests` | reconnect-safe async ownership submit; TraceAudit paper long-running route |
| GET | `/v1/async-chat-requests/{requestId}` | async ownership status |
| GET | `/v1/async-chat-requests/{requestId}/result` | async ownership result fetch |
| DELETE | `/v1/async-chat-requests/{requestId}` | best-effort cancel |
| GET | `/v1/health` | 서비스 상태 + active request control-signal summary |
| GET | `/v1/usage` | 누적 토큰/요청 통계 |
| GET | `/v1/models` | 등록된 model profile 목록 |
| GET | `/v1/prompts` | 등록된 prompt template 목록 |
| GET | `/metrics` | Prometheus 메트릭 |

### Task Type Allowlist

| Task Type | 용도 |
|-----------|------|
| `static-explain` | 정적 분석 finding 심층 설명 |
| `static-cluster` | 유사 finding 그룹핑 |
| `dynamic-annotate` | 동적 분석 이벤트 해석 |
| `test-plan-propose` | 테스트 시나리오 제안 |
| `report-draft` | 보고서 초안 생성 |

### `/v1/chat` 프록시

OpenAI-compatible chat completion 프록시. S3 Agent가 멀티턴 LLM 호출 시 사용.
- 요청 body의 `model` 필드를 실제 운영 모델로 자동 오버라이드
- `X-Timeout-Seconds` 헤더로 호출자 주도 타임아웃 (기본 1800초)
- Circuit Breaker OPEN이면 즉시 503
- 기본 모드는 LLM Engine 응답을 그대로 반환 (모든 응답에 `X-Request-Id` 포함)
- `X-AEGIS-Strict-JSON: true`로 opt-in strict JSON mode 활성화 가능
- strict mode에서는 `response_format=json_object`, caller-supplied `enable_thinking` 보존, `message.content` JSON object 검증/정규화, caller-facing `reasoning` scrub, 계약 위반 시 502 실패
- `/v1/health?requestId=...`로 active `/v1/chat`/`/v1/tasks` request의 compact summary를 조회할 수 있다
- 상세: `wiki/canon/api/llm-gateway-api.md`

### async ownership surface

phase-2 no-result-loss semantics용 별도 surface.
- `/v1/chat`는 그대로 finite/synchronous
- async surface는 durable `requestId`를 발급
- 상태 조회 / 결과 회수 / cancel / expiry를 명시적으로 제공
- final result는 current `/v1/chat` success payload를 `response` 아래에 최대한 그대로 감싼다

---

## 4. 현재 상태

| 항목 | 상태 |
|------|------|
| 테스트 | **328 passed** (`cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests`, 2026-05-20 검증) |
| LLM 모드 | `real` (DGX Spark vLLM) |
| 모델 | `Qwen/Qwen3.6-27B` 원본 dense (`Qwen/Qwen3.6-27B-default`, contextLimit 131072, FP8/quantized 아님) |
| Circuit Breaker | 구현 완료 (CLOSED/OPEN/HALF_OPEN) |
| RAG (S5 KB) | 통합 완료. 2026-04-28 MTP 벤치마크는 분리 측정을 위해 `AEGIS_RAG_ENABLED=false`로 수행 |
| Prometheus 메트릭 | `/metrics` 제공 중 |
| Request-aware health | **구현 완료** (`activeRequestCount`, `requestSummary`, `requestId` query targeting) |
| Phase-2 방향 | **Option C — `/v1/chat`는 finite compatibility surface로 두고, stronger no-result-loss semantics는 새 async surface로 분리** |
| Async ownership surface | **구현 완료** (`submit/status/result/cancel`, 15분 retention, `traceRequestId` echo, explicit expiry) |
| 미완료 항목 | S7 paper-controls contract 구현 완료. 남은 항목은 S3가 새 계약으로 TraceAudit live smoke를 재실행하고, 필요 시 S7이 RCA/운영 로그를 보강하는 것 |

### 최근 변경 (2026-04-14)

- phase-2 async ownership surface 구현:
  - `POST /v1/async-chat-requests`
  - `GET /v1/async-chat-requests/{requestId}`
  - `GET /v1/async-chat-requests/{requestId}/result`
  - `DELETE /v1/async-chat-requests/{requestId}`
  - stable status state set: `queued | running | completed | failed | cancelled | expired`
  - submit response에만 `status: accepted`
  - `traceRequestId`, `resultReady`, `expiresAt`, wrapped final `response` shape 반영
- phase-2 architectural decision 정리:
  - stronger recoverable wait-while-alive는 `/v1/chat` 위에 additive ownership을 얹기보다 **새 canonical async surface**로 분리하는 쪽을 S7 기본 방향으로 채택
  - 이유: `/v1/chat`는 OpenAI-compatible synchronous proxy/compatibility surface로 남기는 편이 경계가 명확하고, active lifetime / terminal retention / result fetch 규칙도 async surface에서 더 명확하게 소유 가능
- `/v1/health` request-aware control-signal summary 구현:
  - additive `activeRequestCount` + `requestSummary` block 도입
  - `requestId` query targeting 지원
  - `state`, `localAckState`, `lastAckAt`, `lastAckSource`, `blockedReason`, `phase`, `elapsedMs` 노출
  - 장시간 `llm-inference` 구간은 `localAckState="transport-only"`로 표현
- `/v1/chat` opt-in strict JSON mode 구현:
  - 요청 헤더 `X-AEGIS-Strict-JSON: true`로 활성화
  - Gateway가 `response_format={"type":"json_object"}`를 적용하되 caller-supplied `chat_template_kwargs.enable_thinking`은 변경하지 않음
  - strict mode 성공 응답에서 `choices[0].message.content`를 compact JSON 문자열로 정규화하고 `message.reasoning`을 `null`로 scrub
  - strict mode 계약 위반 시 backend payload를 그대로 통과시키지 않고 **502**로 명확히 실패
- S3 structured finalizer 의존성 보강(2026-04-21):
  - async ownership strict JSON 실패를 `completed`로 저장하지 않고 `failed` terminal state로 고정
  - status/result 응답에 `blockedReason=strict_json_contract_violation`, `errorDetail`, `retryable=true`를 additive하게 노출
- 계약/문서 갱신:
  - `wiki/canon/api/llm-gateway-api.md`
  - `wiki/canon/specs/llm-gateway.md`
  - 이 handoff/architecture/roadmap 문서
- 검증:
  - `tests/test_contract_endpoints.py` **36 passed**
  - `tests/test_async_chat_manager.py` **3 passed**
  - `tests/test_request_tracker.py` **4 passed**
  - `tests/test_contract_input_validation.py` **8 passed**
  - 전체 S7 테스트 **206 passed**
- 운영 주의:
  - 2026-04-14 기준 이미 떠 있는 localhost:8000 프로세스는 재시작 전 코드로 보일 수 있으므로, live smoke로 strict JSON header / request-aware health / async ownership surface를 함께 재확인 필요
  - 다음 세션은 **runtime restart/rollout 후 live strict JSON + `/v1/health?requestId=` + async submit/status/result smoke 재확인**이 우선

### 이전 변경 (2026-04-03~04)

- Gateway 안정화 패치:
  - schema-invalid 응답이 성공 처리되던 버그 수정
  - commentary-wrapped JSON object 파싱 보강
- 회귀 테스트 2건 추가 후 전체 S7 테스트 **185 passed** 재검증
- 공용 `.omx` 메모 운영 규칙 반영:
  - 전역 durable 정보만 공용 `.omx`에 유지
  - S7 전용 장문 메모는 `wiki/canon/handoff/s7/`와 session state로 이관

### 이전 변경 (2026-03-31)

- chat proxy 로그 강화: `toolChoice`, `toolCount`, `finishReason` 필드 추가
- CB OPEN 503 응답에 `X-Gateway-Latency-Ms` 헤더 추가 (일관성)
- `LLM_CIRCUIT_OPEN → MODEL_ERROR` contract test 추가 (180 tests)
- `llm-engine.md`에 모델 행동 특성 섹션 추가 (tool_calls 선호, evidence 환각)
- 통합 테스트 2회 로그 분석 완료 — S7 에러 0건

---

## 5. 상세 문서

| 문서 | 내용 |
|------|------|
| [architecture.md](architecture.md) | 파일 구조, 요청 흐름, 환경변수, Observability, 동시성, Thinking 제어 |
| [llm-engine-ops.md](llm-engine-ops.md) | DGX Spark 접속, vLLM 기동/중지, 성능 실측, 트러블슈팅 |
| [roadmap.md](roadmap.md) | 다음 작업 + LoRA 파인튜닝 장기 계획 |
| session-*.md | 세션별 작업 로그 / OMX 세션 기록 |


## Qwen3.6-27B rollout status (2026-04-24)

- Status: **live cutover complete**. DGX Engine direct `/v1/models` returns `id/root=Qwen/Qwen3.6-27B`, `max_model_len=131072`; `/health` returns 200.
- Gateway restarted with `AEGIS_LLM_MODEL=Qwen/Qwen3.6-27B`; `/v1/models` returns `Qwen/Qwen3.6-27B-default`, `contextLimit=131072`; `/v1/health.modelProfiles` returns the same profile.
- Superseded 2026-04-28 by vLLM `0.20.0`, `qwen36-vllm:hf-fresh`, MTP=1. Previous recipe: vLLM `0.19.1`, `vllm-node:official-0.19.1-cu130`, `vllm serve Qwen/Qwen3.6-27B`, text-only `--language-model-only`, `--reasoning-parser qwen3`, `--enable-auto-tool-choice --tool-call-parser qwen3_coder`, TP=1, **no quantization override**. This is not `Qwen/Qwen3.6-27B-FP8`.
- S3-facing contract is updated by the 2026-04-29 caller-owned generation contract: strict JSON must return parseable JSON only; Gateway forces `response_format=json_object`, preserves caller-supplied `enable_thinking`, strips caller-facing `reasoning`, and fails instead of mixing thinking/tool-control text into final content.
- Tool-call smoke passed: Gateway returned `finish_reason=tool_calls`, `message.content=null`, and OpenAI-compatible `message.tool_calls[0].function.arguments` JSON string.
- Async strict JSON smoke passed: submit/status/result completed; wrapped response content parsed as JSON and `reasoning=null`; 15-minute result retention remains.
- Benchmark decision: quality-first default is `Qwen/Qwen3.6-27B`. 35B-A3B is faster but lower-quality on the chosen hard benchmark; 3.5-122B remains baseline/archive rollback only.
- Evidence/session artifact: `wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md`. S3 WR reply: canonical work request reply from S7 to S3 registered on 2026-04-24.


## DGX cleanup/model identity note (2026-04-25)

- Confirmed live vLLM process serves `Qwen/Qwen3.6-27B` directly; no `--quantization` flag and no FP8 checkpoint path.
- Removed stale DGX caches/tools not needed for current serving: old 35B-A3B cache, old Qwen3.5-122B cache, stale 27B-FP8 cache, ollama tree, local `vllm-env`, remote IDE caches, Joern, `.nv`, `.triton`.
- Preserved serving-critical state: `models--Qwen--Qwen3.6-27B`, current image `qwen36-vllm:hf-fresh`, `~/.cache/vllm`, `~/spark-vllm-docker`.
- Post-cleanup proof: `/health=200`; `/v1/models id/root=Qwen/Qwen3.6-27B`, `max_model_len=131072`.


## Qwen27 control script note (2026-04-25)

- DGX Spark에 `/home/accslab/aegis-llm-engine/bin/qwen27-vllm`를 설치했다. Convenience symlink는 `/home/accslab/qwen27-vllm`.
- 사용: `~/qwen27-vllm status|start|stop|restart|health|models|logs|ps`.
- 목적: 집/개인 작업으로 DGX GPU/RAM을 비울 때 `stop`, AEGIS/S7 작업 재개 전 `start`를 안전하게 수행.
- `restart` 실검증 완료: stop/remove 후 `qwen3.6-27b-origin` recipe로 재기동, `/health=200`, `/v1/models id/root=Qwen/Qwen3.6-27B`, `max_model_len=131072`.


## Qwen3.6-27B vLLM 0.20.0 / MTP 운영 업데이트 (2026-04-28)

- Status: **MTP=1 운영 반영 완료**. DGX Engine `/health`는 HTTP 200, `/v1/models`는 `id/root=Qwen/Qwen3.6-27B`, `max_model_len=131072`를 반환한다. Gateway `/v1/models`는 `Qwen/Qwen3.6-27B-default`, `modelName=Qwen/Qwen3.6-27B`, `contextLimit=131072`를 반환한다.
- Active backend: DGX Spark `10.126.37.19:8000`, container `vllm_node`, image `qwen36-vllm:hf-fresh`, recipe `/home/accslab/spark-vllm-docker/recipes/qwen3.6-27b-origin.yaml`, vLLM `0.20.0`, original dense `Qwen/Qwen3.6-27B`, TP=1, no FP8/quantization override.
- Active command adds speculative decoding/MTP:
  `--speculative-config {"method":"mtp","num_speculative_tokens":1}` with `--enable-auto-tool-choice --tool-call-parser qwen3_coder --reasoning-parser qwen3 --language-model-only`. In YAML recipe strings, escape braces as `--speculative-config '{{"method":"mtp","num_speculative_tokens":1}}'`.
- vLLM log evidence: `speculative_config: {'method': 'mtp', 'num_speculative_tokens': 1}`, `Resolved architecture: Qwen3_5MTP`, and `Detected MTP model. Sharing target model embedding weights...`. Expected warning: `min_p and logit_bias parameters won't work with speculative decoding.`
- Strict bwrap-backed Gateway A/B benchmark: no-MTP 8/8 aggregate completion throughput `7.638 tok/s`, MTP=1 8/8 `15.132 tok/s` (**+98.1%**). Tool-call workload throughput `4.471 -> 7.492 tok/s` (+67.6%), latency `9396.5 -> 5606.5 ms`. Tiny short-output latency is noisy and should not be used as a stable MTP decision point.
- BFCL v4 Gateway smoke remained **24/25 accuracy** before/after MTP. The single miss was `parallel_multiple_4` argument expression formatting (`x^2` vs expected `x**2`/lambda), not an MTP-specific tool-call regression.
- DGX cleanup after restore: removed old `vllm-node:*` tags and stale detour/build files; kept `qwen36-vllm:hf-fresh`, current recipe, HF cache `models--Qwen--Qwen3.6-27B`, and vLLM cache. Keyword scan for embarrassing/restoration detour markers in `spark-vllm-docker` returned none.
- DGX Korean runbook: `/home/accslab/spark-vllm-docker/docs/QWEN36_VLLM_RUNBOOK_20260428.md`. Wiki evidence: `session-s7-vllm-image-restore-20260428.md`, `session-s7-gateway-perf-benchmark-20260428.md`, `session-s7-bfcl-tool-benchmark-20260428.md`, `session-s7-qwen36-mtp-benchmark-20260428.md`.


## Caller-owned generation contract update (2026-04-29)

- `/v1/chat`, `/v1/async-chat-requests`, `/v1/tasks` now use a **caller-owned generation contract**. S7 no longer chooses sampling/thinking values via hidden defaults such as `temperature=0.3` or `enable_thinking=true`.
- `/v1/tasks` public shape is camelCase under `constraints.*`. Required fields: `enableThinking`, `maxTokens`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`.
- `/v1/chat` and `/v1/async-chat-requests` keep OpenAI-compatible snake_case controls, but they are now required: `max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `chat_template_kwargs.enable_thinking`.
- Missing values intentionally return 422. S7 does not backfill from `SamplingDefaults`, Qwen recommended presets, or vLLM backend defaults.
- `constraints.maxTokens` / `max_tokens` range is `1..32768` for the S7 Gateway surfaces.
- Strict JSON only forces `response_format=json_object`; it does not inject or flip thinking. `/v1/chat` success responses expose `X-AEGIS-Effective-Thinking: true|false` from the caller-supplied boolean.
- `frequencyPenalty`/`frequency_penalty` remains unsupported because it is not in the Qwen3.6 recommended sampling family documented in the temperature-policy analysis.
- Downstream callers must update through WR. S7 does not directly edit S2/S3 code.
- Follow-up S7-owned readiness items from the temperature-policy analysis are now tracked separately from the API break: generation controls are recorded in exchange logs and Prometheus; `/v1/health.rag` exposes RAG `topK`, `minScore`, and policy; model fallback remains explicitly absent (single profile + circuit breaker); S3-owned tool-choice, timeout, prompt-injection, and tool-argument validation issues are WR-only for S7.


## TraceAudit paper-controls contract (2026-05-20/21)

Status: **implemented and verified on S7**.

Canonical contract:
- API spec: `wiki/canon/api/llm-gateway-api.md`
- Implementation session: `wiki/canon/handoff/s7/session-omx-1779269184895-8gprdc.md`
- S3 notice WR: `wiki/canon/work-requests/s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path.md`
- Original S3 ITERATE WR: `wiki/canon/work-requests/s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation.md` (completed by S7 on 2026-05-21)

### What S7 now enforces

Header: `X-AEGIS-Paper-Controls: true` on `/v1/async-chat-requests` or `/v1/chat`.

Common required fields in paper mode:
- `max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`
- `seed`
- `logprobs`
- `chat_template_kwargs.enable_thinking`
- `chat_template_kwargs.preserve_thinking`
- `tool_choice`

`logprobs=true` requires `top_logprobs` as a non-negative integer. `logprobs=false` requires `top_logprobs` to be omitted. Missing/invalid controls fail before vLLM with HTTP 422 `INVALID_GENERATION_CONTROLS` and field-specific `missingFields` / `invalidFields`.

### Phase split

| Phase | Shape S7 expects | Schema behavior |
|---|---|---|
| acquisition/tool-call | non-empty `tools`, `tool_choice="auto"`, no `response_format`, no `structured_outputs`, no `X-AEGIS-Strict-JSON` | schema/strict JSON is rejected for this phase |
| finalizer/schema | no tools, `tool_choice="none"`, `response_format={"type":"json_schema", "json_schema": {"schema": ...}}` | S7 preserves JSON schema and does not fall back to `json_object` |

`X-AEGIS-Strict-JSON: true` still works for non-paper JSON-object mode. In paper finalizer mode, if the strict header is also present, S7 preserves caller-supplied `json_schema`; in paper acquisition mode, strict JSON is rejected as phase-incompatible.

### Observability delivered

Paper-mode `llm_exchange` logs include prompt-redacted `controlObservability` with request IDs, async request ID, trace request ID, accepted/forwarded/observed controls, control diff, `schemaSnapshotHash`, `profileSnapshotHash`, request/control/response-summary hashes, and known-unverified fields. Paper-mode logs are tested not to contain raw prompt text, raw schema text, raw seed values, or raw response body content.

### Verification evidence

- Analyze artifact: `.omx/analysis/s7-paper-controls-analyze-20260520.md`
- Plan artifact: `.omx/plans/s7-paper-controls-implementation-plan-20260520.md`
- Tests: `328 passed in 6.61s`
- DGX vLLM direct probes:
  - seed/logprobs/top_logprobs/preserve_thinking request returned HTTP 200 with logprobs returned.
  - `response_format={"type":"json_schema",...}` finalizer returned HTTP 200 with schema-shaped JSON content and no reasoning.
- Critic validation: analyze APPROVE, plan ITERATE→APPROVE, implementation APPROVE.

### Next-session caution

Do not re-open hyperparameter value selection in S7. The user decided S3 owns values and should use official Qwen recommendations. S7 only owns the gateway contract and runtime evidence.

## Certificate-maker pre-first-byte disconnect follow-up (2026-05-21)

S3 reran certificate-maker after S7 added `stream-dispatch` and proxy TCP keepalive. The instrumentation worked, but the run still failed before first byte:

- Run root: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211`
- S3 root request: `e2e-certmaker-rerun-start-20260521-164211`
- S7 async request: `acr_a3c6de6e40bc42e8`
- S7 terminal status: `failed`, `blockedReason=backend_transport_disconnected`, `retryable=true`
- Last backend activity: `activitySource=stream-dispatch`, `streamChunkCount=0`, `responseBytes=0`, `approxCompletionChars=0`, elapsed/idle about 1060s
- Proxy evidence: the failing child wrote the request body to DGX (`8192 + 2249` bytes) and received zero response bytes before `read(...): Connection timed out` at `2026-05-21T08:00:24Z`; concurrent health probes still succeeded.

S7 conclusion for handoff: this is no longer an S7 async elapsed-read timeout. It is a backend/proxy pre-first-byte zero-byte transport-loss class. S7 cannot send an HTTP/SSE heartbeat before vLLM returns response headers. S7 now adds redacted level-40 `llm_exchange` failure records for async backend timeout/transport-disconnect/stream-parse failures so future S3/S7 RCA can prove which controls S3 sent without logging raw paper prompt/schema/seed/response.

S3-facing recommendation is contractual rather than another proxy-only fix: if the same paper unit repeats `stream-dispatch` + zero bytes + `backend_transport_disconnected` while S7 health is ready, S3 should split/reshape the LLM unit (narrower per-finding acquisition, fewer bundled evidence/tool choices, smaller acquisition `max_tokens`, explicit finalizer phase) instead of treating elapsed time alone as liveness. The canonical wording lives in `wiki/canon/api/llm-gateway-api.md` under “Pre-first-byte zero-byte failure contract for S3 paper callers”.

## S3/S2 계약 메모 (2026-05-08)

- `/v1/health.status` is process liveness only. Use `ready`, `llmReady`, `degraded`, `degradeReasons`, `blockedReason`, and `dependencyStatus` to distinguish DGX/vLLM readiness. Backend unreachable keeps HTTP 200 + `status="ok"` but reports `ready=false`, `llmReady=false`, `degraded=true`, `blockedReason="backend_unreachable"`.
- Circuit breaker `open`/`half_open` also makes readiness false. RAG disabled/degraded is exposed in `dependencyStatus.rag` but does not block LLM readiness.
- `/v1/tasks` remains finite synchronous TaskResponse-envelope compatibility for S2 direct `LlmTaskClient`; it has no durable status/result/cancel surface. `/v1/health?requestId=` is active progress/control visibility only and not task result recovery.
- `/v1/async-chat-requests` is durable ownership for OpenAI-compatible chat payloads, not a drop-in replacement for `/v1/tasks` envelopes. A future durable TaskResponse surface should be separate (e.g. `/v1/async-tasks`).

## S7 health readiness performance note (2026-05-11)

- `/v1/health` real-mode backend readiness probe now uses a short process-local TTL cache (`AEGIS_LLM_HEALTH_CACHE_TTL_SECONDS`, default 1.0s).
- Purpose: S2/S3/S1 readiness polling should not force every poll through the DGX OpenVPN proxy.
- `llmBackend.cached` and `llmBackend.cacheTtlMs` expose whether the backend snapshot came from the freshness window.
- `ready`/`llmReady` semantics are unchanged; stale OK or unreachable states are not reused beyond the TTL.
- Evaluator: `cd services/llm-gateway && .venv/bin/python scripts/perf_health_readiness.py --backend-delay-ms 200 --requests 8 --min-improvement-ratio 0.50`.
