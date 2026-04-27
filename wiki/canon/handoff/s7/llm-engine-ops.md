---
title: "S7 LLM Engine — 운영 정보"
page_type: "canonical-handoff"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s7-handoff/llm-engine-ops.md"
original_path: "docs/s7-handoff/llm-engine-ops.md"
last_verified: "2026-04-25"
service_tags: ["s7"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
---

# S7 LLM Engine — 운영 정보

> DGX Spark에서 구동되는 S7 LLM Engine(vLLM)의 접속, 기동, 성능, 트러블슈팅 정보.
> 현재 운영 모델은 **`Qwen/Qwen3.6-27B` 원본 dense checkpoint**이며, **`Qwen/Qwen3.6-27B-FP8`가 아니다**.

---

## DGX Spark 접속

| 항목 | 값 |
|------|------|
| IP | `10.126.37.19` |
| 사용자 | `accslab` |
| 호스트명 | `spark-be83` |
| 아키텍처 | aarch64 (ARM64) |
| OS | NVIDIA DGX Spark Version 7.4.0 |

```bash
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 'hostname && docker ps | grep vllm_node'
```

---

## 하드웨어 / 현재 디스크 상태

| 항목 | 사양/상태 |
|------|-----------|
| GPU | NVIDIA GB10 (Blackwell), CC 12.1 |
| 드라이버/CUDA | 580.126.09 / CUDA 13.0 계열 |
| 메모리 | 128GB LPDDR5x unified (가용 약 119.7GB) |
| 디스크 | 3.7TB NVMe |
| Docker | 29.1.3 + NVIDIA Container Runtime 1.18.2 |
| 2026-04-25 cleanup 후 디스크 | 약 118GB used / 3.4TB available |

현재 유지해야 하는 큰 항목:

| 항목 | 크기/이유 |
|------|-----------|
| `~/.cache/huggingface/hub/models--Qwen--Qwen3.6-27B` | 약 52GiB, 현재 serving model |
| `vllm-node:official-0.19.1-cu130` | 약 28.9GB, active Docker image |
| `~/.cache/vllm` | 약 1.5GiB, torch compile cache |
| `~/spark-vllm-docker` | 약 1GiB, serving recipe/tooling |

삭제 완료된 항목: old Qwen3.6-35B-A3B cache, old Qwen3.5-122B cache, Qwen3.6-27B-FP8 cache, ollama, local `vllm-env`, remote IDE caches, Joern, `.nv`, `.triton`.

---

## 현재 vLLM 기동 상태

실제 process command:

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
  --language-model-only \
  -tp 1
```

중요:

```text
served model: Qwen/Qwen3.6-27B
not: Qwen/Qwen3.6-27B-FP8
quantization override: none
--quantization: not used
max_model_len: 131072
```

---

## Qwen27 vLLM control script

집/개인 작업 등으로 DGX Spark의 GPU/RAM을 비워야 할 때는 직접 `docker stop/rm`을 외우지 말고 아래 control script를 사용한다.

| 항목 | 값 |
|------|-----|
| Script | `/home/accslab/aegis-llm-engine/bin/qwen27-vllm` |
| Convenience symlink | `/home/accslab/qwen27-vllm` |
| Container | `vllm_node` |
| Model | `Qwen/Qwen3.6-27B` original dense, not FP8 |
| Recipe | `qwen3.6-27b-origin` |
| Endpoint | `http://127.0.0.1:8000` on DGX / `http://10.126.37.19:8000` from AEGIS host |
| Log | `/tmp/vllm-launch.log` |

사용법:

```bash
# 상태 확인
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm status'

# 집/개인 작업 전에 Qwen serving 중지
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm stop'

# AEGIS/S7 작업 재개 전에 다시 기동
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm start'

# stop 후 start를 한 번에 검증
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm restart'

# 로그/모델/프로세스
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm logs'
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm models'
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 '~/qwen27-vllm ps'
```

`start`는 다음을 자동 수행한다.

1. stale `vllm_node` container가 있으면 제거한다.
2. `~/spark-vllm-docker/run-recipe.sh qwen3.6-27b-origin --solo --tensor-parallel 1 --port 8000 --max-model-len 131072 --gpu-memory-utilization 0.90 -d`를 실행한다.
3. `/health`와 `/v1/models`를 최대 600초 기다린다.
4. `/v1/models`의 `id/root`가 `Qwen/Qwen3.6-27B`인지 검증한다.

검증 이력:

- 2026-04-25: script 생성 후 `restart` 실검증 완료. Stop/remove 후 재기동했고 `/health=200`, `/v1/models id=root=Qwen/Qwen3.6-27B`, `max_model_len=131072` 확인.

주의:

- `stop` 상태에서는 S7 Gateway의 real LLM 호출이 실패한다. AEGIS 작업 전에는 반드시 `~/qwen27-vllm start` 또는 `restart` 후 Gateway `/v1/health`를 확인한다.
- 이 script는 현재 모델 identity를 `Qwen/Qwen3.6-27B`로 고정 검증한다. FP8 checkpoint나 다른 모델을 실험하려면 별도 script/recipe로 분리하고 S7 wiki를 갱신해야 한다.

---

## vLLM 중지/재기동

중지:

```bash
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 \
  'docker stop vllm_node && docker rm vllm_node'
```

현재 27B 원본 recipe 재기동:

```bash
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 \
  'source $HOME/.local/bin/env && cd ~/spark-vllm-docker && \
   nohup ./run-recipe.sh qwen3.6-27b-origin --solo --tensor-parallel 1 --port 8000 \
   > /tmp/vllm-launch.log 2>&1 &'
```

기동 후 확인:

```bash
curl http://10.126.37.19:8000/health
curl http://10.126.37.19:8000/v1/models | python3 -m json.tool
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 'docker logs vllm_node --tail 80'
```

기대값:

```text
/health -> 200
/v1/models -> id/root Qwen/Qwen3.6-27B, max_model_len 131072
```

---

## 운영 smoke tests

Strict JSON through Gateway:

```bash
curl -sS http://localhost:8000/v1/chat \
  -H 'Content-Type: application/json' \
  -H 'X-AEGIS-Strict-JSON: true' \
  -d '{
    "model":"ignored-by-gateway",
    "messages":[{"role":"user","content":"Return {\"ok\":true} as JSON only."}],
    "max_tokens":64,
    "temperature":0
  }'
```

Direct Engine smoke:

```bash
curl -sS http://10.126.37.19:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model":"Qwen/Qwen3.6-27B",
    "messages":[{"role":"user","content":"Say OK only."}],
    "max_tokens":8,
    "temperature":0,
    "chat_template_kwargs":{"enable_thinking":false}
  }'
```

---

## 성능/자원 메모

| 항목 | 값 |
|------|----|
| hard benchmark qualityScore | 0.74 |
| hard benchmark passRate | 0.70 |
| hard benchmark mean completion tok/s | 4.65 |
| hard benchmark p50/p95 latency | 약 660.6s / 1244.8s |
| strict JSON smoke | 약 4.975s |
| tool-call smoke | 약 6.274s |
| model load memory evidence | 약 50.22GiB |
| available KV cache memory evidence | 약 54.35GiB |

---

## 트러블슈팅

| 증상 | 원인 | 조치 |
|------|------|------|
| `/health` 연결 실패 | 컨테이너 미기동/포트 문제 | `docker ps`, `docker logs vllm_node --tail 80` 확인 후 재기동 |
| `/v1/models`가 FP8/다른 모델을 반환 | 잘못된 recipe/process | `docker exec vllm_node ps -eo pid,cmd` 확인 후 `qwen3.6-27b-origin`으로 재기동 |
| strict JSON에 자연어/think 섞임 | Gateway strict header 미사용 또는 thinking enabled | `X-AEGIS-Strict-JSON: true` 사용, Gateway strict path 확인 |
| 첫 요청 지연 | torch compile/warmup | 워밍업 요청 후 재시도 |
| 디스크 부족 | 모델 cache/Docker image 누적 | 현재는 27B cache만 유지. 다른 모델 cache는 다시 받기 전까지 없음 |

---

## 로그 확인

```bash
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 'tail -120 /tmp/vllm-launch.log'
ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 'docker logs vllm_node --tail 120'
```

---

## 기술 전환 이력

| 시기 | 변경 | 상태 |
|------|------|------|
| Phase 1 | ollama + Qwen3 32B | 폐기, `~/ollama` 삭제됨 |
| Phase 2 | vLLM + Qwen3.5/3.6 후보 비교 | 완료 |
| 2026-04-23~24 | clean-lifecycle benchmark | 27B 품질 우선 결정 |
| **현재** | **vLLM 0.19.1 + `Qwen/Qwen3.6-27B` 원본 dense** | **운영 기본값** |
