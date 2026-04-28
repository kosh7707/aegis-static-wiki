---
title: "S7. LLM Engine 기능 명세"
page_type: "canonical-spec"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/specs/llm-engine.md"
original_path: "docs/specs/llm-engine.md"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
---

# S7. LLM Engine 기능 명세

> **Current serving default (verified 2026-04-28): `Qwen/Qwen3.6-27B`.**
> This is the original dense 27B checkpoint, not `Qwen/Qwen3.6-27B-FP8`, and S7 does not pass any model-quantization override to vLLM.
> Cutover evidence: `wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md` and `wiki/canon/handoff/s7/session-s7-qwen27-s3-wr-20260424.md`.

LLM Engine은 S7이 관리하는 LLM 추론 모델 서빙 계층이다. S7(LLM Gateway)이 유일한 AEGIS 호출자이며, OpenAI-compatible API(`/v1/chat/completions`)를 제공한다.

---

## 1. 역할

### 책임

- `Qwen/Qwen3.6-27B` 원본 dense 모델 로딩 및 추론 수행
- OpenAI-compatible REST API 제공 (`/v1/chat/completions`)
- Thinking 모드 제어 (`chat_template_kwargs.enable_thinking`, `--reasoning-parser qwen3`)
- Tool calling 지원 (`--enable-auto-tool-choice --tool-call-parser qwen3_coder`)
- GPU 메모리 관리 및 추론 최적화 (PagedAttention/vLLM KV cache/prefix caching/torch compile cache)

### 비책임

- 프롬프트 구성 및 템플릿 관리 → S7 Gateway
- strict JSON 검증/정규화 → S7 Gateway
- 입력 신뢰도 관리 → S7 Gateway
- 비즈니스 로직 → S2
- 사용자 인터페이스 → S1

---

## 2. 하드웨어

### DGX Spark

| 항목 | 사양 |
|------|------|
| Host/IP | `spark-be83` / `10.126.37.19` |
| GPU | NVIDIA GB10 (Blackwell), Compute Capability 12.1 |
| 드라이버/CUDA | 580.126.09 / CUDA 13.0 계열 |
| 메모리 | 128GB LPDDR5x unified (GPU/CPU 공유, 가용 약 119.7GiB) |
| 디스크 | 3.7TB NVMe |
| 아키텍처 | aarch64 (ARM64) |
| OS | NVIDIA DGX Spark Version 7.4.0 |
| Docker | 29.1.3 + NVIDIA Container Runtime 1.18.2 |

### 현재 모델/자원 상태

| 항목 | 값 |
|------|------|
| Serving model | `Qwen/Qwen3.6-27B` |
| HF cache | `~/.cache/huggingface/hub/models--Qwen--Qwen3.6-27B` (~52GiB) |
| vLLM image | `qwen36-vllm:hf-fresh` |
| vLLM version | 0.20.0 |
| Model load memory evidence | 약 50.22GiB |
| Available KV cache memory evidence | 약 54.35GiB |
| GPU KV cache capacity evidence | 221,872 tokens |
| Max concurrency estimate | 6.64x @ 131072 tokens/request |
| Disk cleanup status | 2026-04-28 기준 old model caches / stale Docker images / detour build files / remote IDE caches 정리 완료 |

---

## 3. 모델: `Qwen/Qwen3.6-27B`

| 항목 | 값 |
|------|------|
| 아키텍처 | Dense |
| Served model id/root | `Qwen/Qwen3.6-27B` |
| Context | `max_model_len=131072` (live vLLM `/v1/models` 기준) |
| Quantization | **없음**. `Qwen/Qwen3.6-27B-FP8` 아님, `--quantization` 미사용 |
| Runtime dtype | vLLM default/auto path. S7은 dtype/quantization override를 지정하지 않는다 |
| Text mode | `--language-model-only` |
| Thinking parser | `--reasoning-parser qwen3` |
| Tool parser | `--enable-auto-tool-choice --tool-call-parser qwen3_coder` |

### 중요한 구분: 27B 원본 vs 27B-FP8

현재 운영 모델은 `Qwen/Qwen3.6-27B` 원본 checkpoint이다. 과거 테스트 중 `Qwen/Qwen3.6-27B-FP8` cache/checkpoint가 잠깐 사용되며 혼선이 있었지만, 해당 cache는 2026-04-25 정리되었고 현재 DGX에는 `models--Qwen--Qwen3.6-27B`만 남아 있다.

현재 확인된 vLLM process:

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

`--quantization`, FP8 checkpoint path, FP8 served model name은 없다. `--speculative-config`는 MTP=1 backend 최적화이며 API 계약을 바꾸지 않는다.

### 모델 행동 특성

- **Thinking 모드**: `enable_thinking=true`인 hard reasoning에서는 긴 사고 토큰을 사용할 수 있어 latency가 길다.
- **Strict JSON**: S7 Gateway strict mode는 `enable_thinking=false`와 `response_format=json_object`를 강제하고 content를 JSON object로 검증한다.
- **Tool calling**: OpenAI-compatible `message.tool_calls[]`로 분리된다. Final strict JSON call은 tool-less로 보내는 것이 S3 계약이다.
- **멀티모달**: 현재 AEGIS/S7은 text-only workload만 사용한다. Engine도 `--language-model-only`로 기동한다.

---

## 4. 추론 서버: vLLM (spark-vllm-docker)

### 선정 근거

| 기준 | 근거 |
|------|------|
| GB10 GPU 지원 | CUDA 13 / Blackwell 경로에서 vLLM 0.20.0 HF fresh container 검증 |
| OpenAI 호환성 | `/v1/chat/completions`, `/v1/models`, `/health` 제공 |
| Thinking 제어 | `--reasoning-parser qwen3` + request `chat_template_kwargs.enable_thinking` |
| Tool calling | `--enable-auto-tool-choice --tool-call-parser qwen3_coder` |
| S7 text-only 최적화 | `--language-model-only` |

### 배포 구조

```text
DGX Spark 10.126.37.19
  └── Docker container: vllm_node
        └── image: qwen36-vllm:hf-fresh
              └── vLLM 0.20.0
                    └── Qwen/Qwen3.6-27B original dense checkpoint
                          ├── no FP8 model checkpoint
                          ├── no --quantization override
                          ├── reasoning parser: qwen3
                          └── tool parser: qwen3_coder
```

### 서버 기동

```bash
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 \
  'source $HOME/.local/bin/env && cd ~/spark-vllm-docker && \
   nohup ./run-recipe.sh qwen3.6-27b-origin --solo --tensor-parallel 1 --port 8000 \
   > /tmp/vllm-launch.log 2>&1 &'
```

현재 recipe가 만드는 핵심 command는 위 `vllm serve Qwen/Qwen3.6-27B ...` 형태다.

### 주요 vLLM 파라미터

| 파라미터 | 현재 값 | 설명 |
|----------|------|------|
| `--port` | 8000 | API 포트 |
| `--host` | 0.0.0.0 | 외부 접근 허용 |
| `--max-model-len` | 131072 | live deployment 총 context 한도 |
| `--max-num-batched-tokens` | 8192 | batching budget |
| `--gpu-memory-utilization` | 0.9 | vLLM 메모리 사용 목표 |
| `--language-model-only` | enabled | text-only serving |
| `--reasoning-parser` | qwen3 | Thinking field/content 분리 지원 |
| `--enable-auto-tool-choice` | enabled | Tool calling 자동 선택 |
| `--tool-call-parser` | qwen3_coder | Qwen tool-call parser |
| `--speculative-config` | `{"method":"mtp","num_speculative_tokens":1}` | MTP speculative decoding; API schema 변화 없음 |
| `-tp` | 1 | Tensor parallelism |
| `--quantization` | **미사용** | 모델 양자화 없음 |
| FP8 checkpoint | **미사용** | `Qwen/Qwen3.6-27B-FP8` 아님 |

---

## Operational control script

DGX Spark에는 현재 Qwen27 serving lifecycle 전용 script가 있다.

```text
/home/accslab/aegis-llm-engine/bin/qwen27-vllm
/home/accslab/qwen27-vllm -> /home/accslab/aegis-llm-engine/bin/qwen27-vllm
```

지원 action: `start`, `stop`, `restart`, `status`, `health`, `models`, `logs`, `ps`.

이 script는 `qwen3.6-27b-origin` recipe, `Qwen/Qwen3.6-27B`, `max_model_len=131072`, no-quantization identity를 검증 대상으로 삼는다. 다른 모델을 기동하려면 S7 문서와 control script를 함께 갱신해야 한다.

---

## 5. API 인터페이스

상세 스키마는 [API 명세서](../api/llm-engine-api.md)를 참조한다.

| 메서드 | 경로 | 포트 | 용도 |
|--------|------|------|------|
| POST | `/v1/chat/completions` | 8000 | 추론 요청 (OpenAI 호환) |
| GET | `/v1/models` | 8000 | served model 목록/`max_model_len` 확인 |
| GET | `/health` | 8000 | 헬스체크 |

### Thinking 모드 제어

- 비활성화: `"chat_template_kwargs": {"enable_thinking": false}` → final content 직접 응답
- 활성화: `"enable_thinking": true` 또는 기본 경로 → reasoning parser가 reasoning/content 분리를 시도

S7 strict JSON 경로에서는 Gateway가 thinking을 강제로 비활성화한다.

---

## 6. S7 Gateway↔LLM Engine 연동

```text
S7 Gateway (LLM Gateway, :8000)
  │ POST /v1/chat/completions
  │ httpx connect 10s / read 600s(task client) or caller X-Timeout-Seconds(/v1/chat)
  ▼
LLM Engine (DGX Spark, :8000)
  │ vLLM Qwen/Qwen3.6-27B inference
  ▼
GPU/Unified memory (GB10)
```

S7 Gateway 환경변수:

```env
AEGIS_LLM_MODE=real
AEGIS_LLM_ENDPOINT=http://10.126.37.19:8000
AEGIS_LLM_MODEL=Qwen/Qwen3.6-27B
AEGIS_LLM_API_KEY=
```

### 모델명 규칙

vLLM의 현재 운영 모델명은 HuggingFace 형식 `Qwen/Qwen3.6-27B`이다. `Qwen/Qwen3.6-27B-FP8`, ollama-style `qwen3:*`, 또는 이전 `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4`로 표기하지 않는다.

### 연동 확인 절차

```bash
curl http://10.126.37.19:8000/health
curl http://10.126.37.19:8000/v1/models | python3 -m json.tool
curl http://localhost:8000/v1/models | python3 -m json.tool
curl http://localhost:8000/v1/health | python3 -m json.tool
```

기대값:

```text
Engine /v1/models: id=root=Qwen/Qwen3.6-27B, max_model_len=131072
Gateway /v1/models: Qwen/Qwen3.6-27B-default, contextLimit=131072
```

---

## 7. 성능 가이드라인

### Qwen3.6-27B hard benchmark / smoke evidence

| 항목 | 값 | 비고 |
|------|----|------|
| hard qualityScore | 0.74 | sequential clean-lifecycle benchmark |
| hard passRate | 0.70 | decisive quality fixtures |
| hard p50 latency | 약 660.6s | thinking-heavy prompts |
| hard p95 latency | 약 1244.8s | thinking-heavy prompts |
| mean completion throughput | 4.65 tok/s | hard benchmark 평균 |
| strict JSON smoke | 4.975s | Gateway strict JSON, thinking off |
| tool-call smoke | 6.274s | OpenAI-compatible tool call separated |
| async strict JSON smoke | ~3.8s | submit/status/result completed |

### 운영 팁

- 일반 control/tool turn은 non-thinking 또는 제한된 output budget을 사용한다.
- 품질 우선 deep reasoning만 thinking을 켠다.
- 최종 strict JSON finalizer는 반드시 `X-AEGIS-Strict-JSON: true`로 보내 Gateway 검증을 사용한다.
- 장문 요청은 `/v1/health?requestId=`의 `transport-only` 상태를 alive 신호로 해석하고 elapsed time만으로 중단하지 않는다.
- 첫 요청/재기동 후에는 torch compile/KV cache warmup이 지연될 수 있다.

---

## 8. 향후 확장

| 항목 | 설명 |
|------|------|
| 모델 업그레이드 | 새 모델은 clean lifecycle benchmark와 `/v1/models` proof 후 채택 |
| 다중 모델 | 현재는 자동 fallback 없음. 필요 시 별도 profile/라우팅 계약을 추가해야 함 |
| Tensor Parallelism | 현재 DGX 단일 GB10 기준 `-tp 1`; 다중 장비/다중 GPU 구성 시 재검토 |

---

## 9. 보안 고려사항

- LLM Engine은 내부 네트워크에서만 접근 가능 (외부 노출 금지)
- vLLM은 API key 없이 동작 — 내부망/S7 단일 호출자 전제
- LLM Engine에 도달하는 모든 입력은 S7 Gateway가 이미 정책적으로 통제한 상태여야 한다
- LLM Engine은 파일시스템, 네트워크, ECU에 직접 접근하지 않는다
- Docker 컨테이너 내부에서 실행되어 호스트와 격리된다

---

## 10. 로깅 및 관측성

| 로그 | 위치 | 작성자 | 내용 |
|------|------|--------|------|
| vLLM 서버 로그 | DGX Spark: `/tmp/vllm-launch.log` | vLLM | HTTP 요청 상태, 엔진 통계 |
| Docker 로그 | `docker logs vllm_node` | Docker/vLLM | container stdout/stderr |
| LLM 교환 로그 | `services/llm-gateway/logs/llm-exchange.jsonl` | S7 Gateway | 요청/응답, 레이턴시, 토큰 수 |

---

## 11. Historical baseline notes

이전 운영/비교 모델은 다음 이유로 현재 기본값에서 제외되었다.

| 모델 | 현재 상태 |
|------|-----------|
| `Qwen/Qwen3.6-27B-FP8` | 과거 혼선/오시도 cache. 현재 DGX cache 삭제됨. 운영 모델 아님 |
| `Qwen/Qwen3.6-35B-A3B` | 빠른/simple 후보였으나 품질 우선 benchmark에서 27B보다 낮아 cache 삭제됨 |
| `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4` | 이전 baseline/archive. cache 삭제됨 |
| ollama/Qwen3 32B | 폐기된 이전 경로. `~/ollama` 삭제됨 |


## 12. 2026-04-28 vLLM 0.20.0 HF fresh / MTP=1 운영 업데이트

### 현재 serving identity

| 항목 | 값 |
|------|----|
| Host/IP | `spark-be83` / `10.126.37.19` |
| Container | `vllm_node` |
| Image | `qwen36-vllm:hf-fresh` |
| vLLM | `0.20.0` HF fresh install path (`/opt/vllm-official`) |
| Model | `Qwen/Qwen3.6-27B` original dense checkpoint |
| Context | `max_model_len=131072` |
| Speculative decoding | MTP enabled, `num_speculative_tokens=1` |
| Recipe | `/home/accslab/spark-vllm-docker/recipes/qwen3.6-27b-origin.yaml` |
| Control script | `/home/accslab/qwen27-vllm status|start|stop|restart|health|models|logs|ps` |

Current command shape:

```bash
/opt/vllm-official/bin/vllm serve Qwen/Qwen3.6-27B \
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

Recipe YAML must double the braces because `run-recipe.sh`/format expansion otherwise consumes them:

```bash
--speculative-config '{{"method":"mtp","num_speculative_tokens":1}}' \
```

### MTP behavior and API contract

- MTP is a backend serving optimization, not a Gateway/API contract change. OpenAI-compatible `/v1/chat/completions`, `/v1/models`, tool-call format, and Gateway strict JSON semantics stay unchanged.
- vLLM logs should include `Resolved architecture: Qwen3_5MTP` and `Detected MTP model. Sharing target model embedding weights...`.
- vLLM warns that `min_p` and `logit_bias` do not work with speculative decoding; S7/Gateway callers should not depend on those parameters while MTP is enabled.
- BFCL v4 Gateway smoke was unchanged at 24/25 before/after MTP. The remaining miss is an expression-format mismatch in `parallel_multiple_4`, not a parser/tool-call regression.

### Benchmark evidence

| Run | Success | Aggregate completion tok/s | Mean latency | p50 | p95 |
|-----|---------|----------------------------|--------------|-----|-----|
| no-MTP baseline | 8/8 | 7.638 | 21004.5 ms | 19691 ms | 39523 ms |
| MTP=1 | 8/8 | 15.132 | 10243 ms | 11115 ms | 23735 ms |

Workload notes: code `+77.6% tok/s`, generation `+55.2% tok/s`, tool_call `+67.6% tok/s`; tiny short-output latency is noisy. Report artifact: `services/llm-gateway/bench/results/mtp-ab-qwen36-27b-strict-20260428T034632Z/s7-qwen36-mtp-benchmark-report.md`.

### DGX runbook / cleanup evidence

- Korean DGX runbook: `/home/accslab/spark-vllm-docker/docs/QWEN36_VLLM_RUNBOOK_20260428.md`.
- Removed old `vllm-node:*` images (`official-0.19.1-cu130`, `official-base-rebuilt`, `restore-base`) and stale detour/build files. Kept `qwen36-vllm:hf-fresh`.
- `~/qwen27-vllm status` after cleanup: `health_http=200`, `/v1/models id/root=Qwen/Qwen3.6-27B`, `max_model_len=131072`.
