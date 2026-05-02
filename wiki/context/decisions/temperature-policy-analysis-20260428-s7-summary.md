---
title: "Temperature Policy Audit — S7 lane 요약 (2026-04-28)"
page_type: "context-decision"
canonical: false
source_repo: "AEGIS"
source_refs:
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: ["llm-temperature", "sampling", "qwen3.6", "vllm-mtp", "gateway-design", "s7-lane"]
related_pages:
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
  - "wiki/canon/handoff/s7/readme.md"
  - "wiki/canon/specs/llm-gateway.md"
  - "wiki/canon/api/llm-gateway-api.md"
---

# Temperature Policy Audit — S7 lane 발췌 요약

> **이 문서는 요약본**이다. 모든 file:line 인용·외부 근거·반론 대응은 원본에 있다.
> **원본**: [`wiki/context/decisions/temperature-policy-analysis-20260428.md`](temperature-policy-analysis-20260428.md) (50KB, critic 7-round APPROVE)
> **수신자**: S7 (LLM Gateway + LLM Engine)
> **상태**: NOT READY 판정 7개 결함 영역 중 **S7이 1차 책임자인 영역만** 추출.

---

## 1. S7이 받는 판정 한 줄

운영 LLM 호출 인프라(S7 Gateway + Engine)가 **production-grade 표준 미달**. 운영 코드는 Qwen3.6 권장 sampling 패밀리(6개)의 **2개만 정합**, sampling 정책을 caller가 정할 schema 표면 부재, sampling 파라미터 범위 검증 0건, exchange log에 sampling 0건 기록, single-profile + circuit breaker만 있는 게이트웨이는 2026 production gateway 표준에 미달.

→ 원본 `§0` (TL;DR + 7 영역 매핑 표) / `§10` (판정 + 반론 대응)

---

## 2. S7이 1차 책임자인 결함 (P-넘버 → 원본 위치)

| P# | 한 줄 | 중요도 | 원본 위치 |
|---|---|---|---|
| **P1** | Qwen sampling 6개 패밀리 미적용 (top_p, top_k 정합 아님 / 우연 일치 3개) | CRITICAL | §5.P1 |
| **P3** | Qwen3.6 thinking 권장(1.0)과 운영(0.3)의 큰 괴리 | MAJOR | §5.P3 |
| **P4** | vLLM 0.20.0 + MTP=1 sampling 버그 (temp>0에서 draft greedy) | MAJOR | §5.P4 |
| **P5** | task_pipeline.py:372 hard-code + TaskRequest schema에 temperature 필드 자체 부재 | MAJOR | §5.P5 |
| **P8** | sampling 파라미터 sanity bound (Pydantic Field 범위) 0건 | MAJOR | §5.P8 |
| **P9** | max_tokens cap: gateway `le=8192` (Qwen3.6 권장 32768의 1/4) | MAJOR | §5.P9 |
| **P10** | `tool_choice="auto"` default가 schema-conformance 권장과 충돌 | MAJOR | §5.P10 |
| **P11** | X-Timeout-Seconds 분산(1800/600/120) — 정책 부재 | MAJOR | §5.P11 |
| **P12** | `_log_llm_exchange()`에 sampling 6개 파라미터 0건 기록 | MAJOR | §5.P12 |
| **P13** | single-profile 운영 + multi-model fallback 0건 | MAJOR | §5.P13 |
| **P14** | RAG 결합(`rag_top_k`, `min_score=0.0`) 정책 문서화 부재 | MAJOR | §5.P14 |

S3 1차 책임 (S7도 schema 측 협업): P2, P6, P7, P15, P16, P17 — 본 요약에서 제외, 원본 §5 참조.

---

## 3. S7 즉시 작업 (원본 §6.1 미러)

### 3.1 코드 갱신

**`services/llm-gateway/app/clients/real.py:71-75`** — request body 빌드 자리.
- `temperature` 외 sampling 5개(`top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`) 추가.
- `RealLlmClient.generate()` 시그니처(line 61)에 5개 파라미터 매개. 기존 `temperature: float = 0.7` signature default는 제거(P5 dead default 청소).

**`services/llm-gateway/app/clients/base.py:9-16`** — `LlmClient` ABC 시그니처도 동일 갱신.

**`services/llm-gateway/app/pipeline/task_pipeline.py:369-372`** — hard-coded `temperature=0.3` 제거. task별로 받거나 task pipeline 단일 default 적용. 6개 sampling 모두 파이프라인 통과 확인.

**`services/llm-gateway/app/main.py:147`** — health probe(`temperature=0.0`, `max_tokens=8`) 유지. sampling 묶음 적용 면제 가능.

→ 원본 `§4.9` (자리별 잠정 권장값 표) / `§6.1` (단기 권장)

### 3.2 Schema 확장 + 범위 검증 (P5 + P8 동시 작업)

**`services/llm-gateway/app/schemas/request.py`**:

- `TaskRequest`(line 35-41) 또는 `Constraints`(line 24-27)에 sampling 6개 필드 신규 추가. **현재 `TaskRequest`에는 temperature 필드 자체가 없음**.
- `AsyncChatSubmitRequest`(line 44-50)는 이미 `temperature`만 가짐 → `top_p, top_k, min_p, presence_penalty, repetition_penalty` 5개 추가.
- 모든 신/기존 sampling 필드에 Pydantic `Field` 범위 검증 박음:

```python
temperature: float = Field(..., ge=0.0, le=2.0)
top_p: float = Field(default=0.95, ge=0.0, le=1.0)
top_k: int = Field(default=20, ge=-1)               # -1 = vLLM 무제한
min_p: float = Field(default=0.0, ge=0.0, le=1.0)
presence_penalty: float = Field(default=0.0, ge=-2.0, le=2.0)
repetition_penalty: float = Field(default=1.0, ge=0.0, le=2.0)
```

대조: `Constraints.maxTokens`는 이미 `Field(2048, ge=1, le=8192)`로 검증 박혀있음. **sampling만 0건이었다**.

→ 원본 `§5.P5` / `§5.P8`

### 3.3 max_tokens cap 상향 (P9)

- `services/llm-gateway/app/schemas/request.py:25` — gateway `le=8192` → **`le=32768`** (Qwen3.6 일반 권장 미러).
- `services/analysis-agent/app/schemas/request.py:25`도 `le=16384` → `le=32768` (S3와 협의 — 두 schema 통합 검토 가치).
- thinking-on default + reasoning chain 비용 고려 시 8192는 압박. `finish_reason=length` 빈도 추적 필수.

→ 원본 `§5.P9`

### 3.4 Tool calling 정책 (P10)

`services/analysis-agent/app/agent_runtime/llm/caller.py:106` (LlmCaller default)와 `services/llm-gateway/app/routers/tasks.py:122`의 처리:

- 현재: `tool_choice: str = "auto"` (caller default) / gateway는 caller가 안 보내면 `"none"`.
- 권장: Phase 2 첫 턴(증거 수집)에 `"required"` 강제 검토. 마지막 턴(claim 발화)은 `"auto"` 유지.
- vLLM 공식: "When schema conformance matters, prefer `tool_choice='required'` or named function calling over `'auto'`."

→ 원본 `§5.P10`

### 3.5 Timeout 정책 통일 (P11)

`TimeoutDefaults` 공유 상수 도입 (SamplingDefaults와 같은 layer):
- A/A' (Phase 2 멀티턴): 1800s
- B (PoC draft): 1800s
- C/D/E/F (narrowing/repair): 600s
- G (S7 task type): task별 차등 검토
- tool 호출 (`try_build` 등): 120s 유지

caller마다 1800/600/120s 분산은 정책이 아니라 누적이다.

→ 원본 `§5.P11` / `§6.1` (TimeoutDefaults paragraph)

### 3.6 Observability 확장 (P12) ★

**`services/llm-gateway/app/routers/tasks.py:94-122`** — `_log_llm_exchange()` 함수.

현재 기록: `model`, `toolChoice`(line 122), `taskType`, `taskId`, `requestId`, `responseId`, `finishReason`, `tokenUsage`, `circuitState`, `latencyMs`, `strictJson`.

**누락**: `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `enable_thinking`. 6개 sampling + thinking 모드 모두 추가.

**Prometheus histogram 신설** (현재 `prom.CONCURRENT_REQUESTS` 정도만):
- `aegis_llm_temperature` (histogram by task_type)
- `aegis_llm_top_p`, `aegis_llm_top_k`
- `aegis_llm_thinking_token_count` — thinking chain 길이 추적 (P9 cap 압박 진단용)
- `aegis_llm_finish_reason_total` (counter by reason)

**중요**: 본 항목 미해결 시 sampling 정책 변경 후 회귀를 운영 로그에서 추적 불가. 단기 작업의 안전망 역할.

→ 원본 `§5.P12`

### 3.7 모델 pin 주석 (P3 / P13 watch 메커니즘)

운영 코드 sampling 값 정의 직상에 다음 주석 박음:
```python
# Validated against Qwen3.6-27B (HF model card retrieved 2026-04-28).
# Re-validate on model family change or model card revision.
```

위치:
- `services/llm-gateway/app/pipeline/task_pipeline.py:369-372` (task pipeline default)
- `services/analysis-agent/app/agent_runtime/llm/caller.py:108` (S3 LlmCaller default)

→ 원본 `§6.3` 불변 원칙 #4

---

## 4. S7 마이그레이션 순서 (원본 §7 — S7 부분)

S7은 **Step 2/3의 핵심 작업자**. Step 1(S3 선행)이 끝난 다음 진입.

```
[Step 1] S3 두 에이전트 코드 갱신 (S3 작업) — 먼저
   ↓
[Step 2] S7 게이트웨이 코드 갱신 — schema 확장 + 범위 검증 + sampling 6개 plumb
   ↓
[Step 3] S7 API에서 sampling required 전환
   ↓
[Step 4] S2 /v1/tasks 호출 갱신 (S2 작업) — required 전환 후 S2가 6개 보내야 함
   ↓
[Step 5] dead default 청소 (clients/base.py:15, real.py:61의 0.7 signature default)
```

**순서 위반 위험**: Step 3을 Step 1/2 전에 하면 → S2 → S7 호출이 **422 에러**. Step 5를 Step 1-3 전에 하면 → mock/test 픽스처 깨짐.

→ 원본 `§7` 마이그레이션 순서

---

## 5. S7 방향성 결함 (사용자 직접 결정 필요)

### 5.1 Single-profile 운영 (P13)

`model_registry.get_default()` single profile만 사용. multi-model routing / fallback 0건. 2026 LLM Gateway 표준(Maxim/Portkey/Hadil)에서 **production-grade gateway가 아니라 single-model proxy**.

단기 액션 부재 (운영 환경상 불가피). **결함으로 명시 등록** — 향후 multi-region / cloud overflow 도입 시 재평가 보존.

→ 원본 `§5.P13`

### 5.2 RAG 결합 정책 부재 (P14)

`task_pipeline.py:131`에서 `top_k=settings.rag_top_k`, `min_score=0.0` 사용. 어떤 task에 RAG 적용 / 결과 신뢰도 / grounding gate 통합 — 정책 문서 부재.

단기 액션:
- RAG 활성/비활성 task type 명시화
- `min_score=0.0`은 **모든 hit 통과** — irrelevant context가 prompt 오염 가능. 임계 정당화 필요
- RAG hit를 evidence catalog에 자동 등록할지 / S3가 별도 등록할지 합의

→ 원본 `§5.P14`

### 5.3 vLLM MTP 버그 영향 측정 (P4)

운영 stack `vLLM 0.20.0 + MTP=1`이 `temperature>0`에서 draft token을 greedy로 샘플링하는 알려진 버그. **우리가 박는 sampling과 실효 분포 다를 수 있음**.

옵션:
1. MTP 끄고 측정 — vLLM 0.20.0 throughput 이득 +98.1% 포기
2. MTP 유지 + community fix 머지 대기
3. MTP off / on 양쪽 hotN 측정 → 차이가 정책 의사결정에 유의미한지 확인

→ 원본 `§5.P4` / `§8.2` 측정 실험 설계 (qwen3.6-no-mtp run 포함)

---

## 6. S7이 모니터링할 검증 메트릭

단기 작업 후 다음 메트릭으로 회귀 추적:

| 메트릭 | 정의 | 임계 |
|---|---|---|
| `groundingPassRate` | claim 중 EvidenceRef가 모두 valid한 비율 | baseline 대비 -5% 이상 회귀 금지 |
| `claimJaccardSimilarity` | run 간 accepted claim Jaccard 평균 | ≥0.8 (hotN 안정성) |
| `hallucinatedRefRate` | LLM 참조 ref 중 catalog에 없는 비율 | baseline +10% 이상 증가 금지 |
| `finishReasonLength` | `finish_reason=length` 비율 | baseline +10% 이상 증가 금지 |
| `meanThinkingTokens` | thinking chain 토큰 평균/p95 | observability 추적 |

→ 원본 `§8.3` 측정 메트릭

---

## 7. S7이 박지 않을 결정

- **특정 temperature 값**: 원본 §4.9 잠정값(A/A'=1.0, B=0.6, C/D/E/F=0.0, G=0.6)은 모델팀 권장 영역에 들어가도록 한 것이지 측정 검증값이 아님. **측정이 결정**.
- **MTP on/off 정책**: throughput vs sampling 정확도 trade-off는 별도 결정 사안. 본 보고서 범위 밖.
- **자리별 차등을 측정 없이 박는 것**: G의 5종 task별 차등도 단일 0.6에서 출발. 차등은 측정 정당화 후에만.

---

## 8. S7이 다른 lane과 협업할 항목

- **S3**: caller 측 LlmCaller 갱신(Step 1). schema 변경 통보. SamplingDefaults 공유 상수 위치 협의(`services/shared/llm-sampling.ts` + Python mirror `services/llm-gateway/app/sampling_defaults.py`).
- **S2**: `/v1/tasks` 호출 갱신(Step 4). `wiki/canon/api/shared-models.md` 업데이트 — 신규 sampling 필드 명시.
- **S5**: RAG 결합 정책(P14) 협의. KB readiness와 RAG min_score 임계.

→ 원본 `§7` 마이그레이션 순서 / `§6.1` SamplingDefaults paragraph

---

## 9. 한 줄

S7은 본 보고서 7개 결함 영역 중 **5개 영역의 1차 책임자** (sampling / token budget / tool calling / timeout / observability) + Gateway 방향성(P13/P14)의 결정자. **즉시 작업(§3.1-3.7)을 한 PR로 묶어 진행 가능**. 마이그레이션 순서(§4)만 어기지 않으면 안전.

---

## 10. 원본 cross-reference 한 페이지

| 원본 § | 내용 | S7 관련도 |
|---|---|---|
| `§0` | TL;DR + 7 defect-area 매핑 | 필독 |
| `§2.1` | 운영 LLM 호출 자리 10곳 | 참고 (자리 G/H가 S7 직접) |
| `§2.2` | 운영 vs bench sampling 비대칭 | 필독 (S7 bench 측정 신뢰도 영향) |
| `§3.1` | Qwen3.6 권장 6 sampling + 모드 차등 | 필독 |
| `§3.2` | vLLM MTP sampling 버그 | 필독 |
| `§3.3` | vLLM 구조화 디코딩 + temperature | 참고 |
| `§3.4` | thinking-on default 변경 영향 | 필독 (S7이 박은 정책의 후속 영향) |
| `§4.9` | 자리별 잠정 권장값 표 | 필독 (S7이 적용할 값) |
| `§5.P1, P3, P4, P5, P8, P9, P10, P11, P12, P13, P14` | S7 책임 결함 11개 | 필독 (본 요약 §2 표) |
| `§6.1` | 단기 권장 정책 + SamplingDefaults / TimeoutDefaults | 필독 (S7 작업 사양) |
| `§6.3` | 불변 원칙 (모델 pin 주석 포함) | 필독 |
| `§7` | 마이그레이션 순서 | 필독 (S7이 Step 2/3 핵심) |
| `§8` | 측정 실험 설계 | 참고 (S3와 협업) |
| `§10` | 판정 + 반론 대응 | 필독 |
| `§11` | 외부 인용 | 참고 (Qwen3.6, vLLM, Maxim, Portkey 등) |
