---
title: "Temperature Policy Audit — S3 후속 WR (2026-05-03)"
page_type: "context-decision"
canonical: false
source_repo: "AEGIS"
source_refs:
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s3-summary.md"
  - "services/analysis-agent/app/agent_runtime/llm/caller.py"
  - "services/analysis-agent/app/schemas/request.py"
  - "services/build-agent/app/schemas/request.py"
  - "services/llm-gateway/app/schemas/request.py"
last_verified: "2026-05-03"
service_tags: ["s3"]
decision_tags: ["llm-temperature", "sampling", "schema-mismatch", "caller-migration", "regression-gate", "s3-lane", "followup"]
related_pages:
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s3-summary.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s2-summary.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s7-summary.md"
---

# S3 후속 WR — Step 1 진행 점검 + 신규 발견 (2026-05-03)

> **선행 문서**: [S3 lane 발췌 (2026-04-28)](temperature-policy-analysis-20260428-s3-summary.md) — S3가 받은 1차 work item.
> **상태**: S3 Step 1 부분 진행 (commit `4ea1306 Preserve integrated frontend restructure and S3 LLM hardening` 시점). 본 후속 WR은 5일 후 점검 + 신규 발견 사항.
> **수신자**: S3 (Analysis Agent + Build Agent)

---

## 0. 한 줄

S3 Step 1이 대부분 마무리 (schema + P11/P17/P6 처리 완료). **잔여 2건**(P10 `tool_choice="required"` / P16 prompt injection) + **신규 발견 2건**(P18 topK schema 불일치 / P19 caller transitional 종료 milestone 부재) + **regression-gate 도입 권장**.

---

## 1. 5일 점검 — Step 1 진행 상태

### 1.1 ✅ 처리 완료

| 항목 | 위치 | 비고 |
|---|---|---|
| analysis-agent `Constraints` schema sampling 6개 + enableThinking 추가 | `services/analysis-agent/app/schemas/request.py:24-36` | Optional + Field 범위 검증 + `extra="forbid"` |
| build-agent `Constraints` schema sampling 6개 + enableThinking 추가 | `services/build-agent/app/schemas/request.py:15-27` | 동일 패턴 |
| `maxTokens.le=32768` 통일 | 두 schema 모두 | P9 cross-lane 통합 완료 |
| `timeoutMs.le=900000` (15분) | 두 schema 모두 | 분석 task 길이 반영 |
| **P11 TimeoutDefaults import** | `analysis-agent/app/config.py:7` import + `:22, 41, 47-50` 7곳 사용 | S7 `generation_policy.TimeoutDefaults` 미러 |
| **P17 tool call argument validation** | `analysis-agent/app/agent_runtime/tools/router_core.py:98 validate_tool_arguments()` + `:99-115` 위반 시 차단/재시도 hint | CRITICAL 1건 해소 |
| **P6 eval_runner 운영 미러** | `eval/eval_runner.py:119`에서 `THINKING_GENERAL.to_gateway_fields()` 사용 | hard-code 0.3 제거 완료 |

### 1.2 🔶 진행 중 (transitional)

| 항목 | 위치 | 상태 |
|---|---|---|
| `LlmCaller.call()` 시그니처 sampling 6개 plumb | `analysis-agent/app/agent_runtime/llm/caller.py:101-112` (시그니처) + `:117-119` (transitional comment) | **transitional**: `GenerationControls \| None = None` (line 109) + scalar `temperature: float \| None = None` (line 110) 둘 다 받음. 호출처 갱신 진행 중 |
| LlmCaller body builder | `:122-127` | `controls.to_gateway_fields()` unpack로 sampling 6개 송신 ✅ |

### 1.3 ❓ 미해결 (실제로 grep에서 확인된 잔여)

5일 점검 후 **실제로 미해결인 항목 2개만 남음**:

- **§3.4 P10 tool_choice 정책** — `analysis-agent/app/agent_runtime/llm/caller.py:106`에 `tool_choice: str = "auto"` default 그대로. Phase 2 첫 턴 `"required"` 강제 검토 진행 안 됨. `grep '"required"'` 0건.
- **§4.1 P16 prompt injection 방어** — `EvidenceRefSanitizer`(출력 측) 외에 input sanitization 0건 상태. instruction-shaped 패턴 마스킹 / trust boundary XML 태그 미도입.

§3.5 P11 / §3.6 eval / §4.2 P17은 §1.1로 이동(이미 해결).

---

## 2. 신규 결함 — 2026-05-03 grep으로 발견

### 2.1 P18 (신규): S3 ↔ S7 schema `topK` 범위 불일치

**문제**: 같은 sampling 의미인 `topK`가 lane 사이 범위 검증이 다르다.

**증거**:
- S7: `services/llm-gateway/app/schemas/request.py:29` — `topK: int = Field(ge=-1)` (vLLM `top_k=-1` = 무제한 허용)
- S3 analysis-agent: `services/analysis-agent/app/schemas/request.py:33` — `topK: int | None = Field(default=None, ge=1)` (1 이상만 허용)
- S3 build-agent: `services/build-agent/app/schemas/request.py:24` — 동일 `ge=1`

**의미**:
- S2(또는 다른 caller)가 `topK=-1` 보내면 **S7은 통과 / S3는 422 reject**.
- vLLM 공식 의미는 `top_k=-1`이 무제한 sampling pool (top-k 비활성화) — Qwen3.6 권장값(`top_k=20`)과 별개의 escape hatch.
- cross-lane 정합 책임자는 S2 (`shared-models.md` 단독 소유자)지만, **schema 자체는 S3/S7이 소유**하므로 S3가 결정에 동의해야 함.

**선택지**:
1. **(a) S3 schema를 `ge=-1`로 정합** — S7과 일치. vLLM 무제한 의미 보존.
2. **(b) S7 schema를 `ge=1`로 정합** — vLLM 무제한 사용 차단. caller가 항상 양수 보내야 함.
3. **(c) shared-models.md에 정책 명시 + 한쪽 schema만 변경** — 결정 결과를 계약서에 박음.

**권장**: (a). vLLM 의미와 일관 + 운영 권장값 `top_k=20`은 양수라 실효 영향 없음. 단 S3가 향후 `top_k=-1`을 explicit하게 거절하고 싶다면 (b)도 합리적 — 그 경우 S7도 정렬 필요.

**중요도**: **MAJOR**. cross-lane schema mismatch는 단일 caller(S2)가 양쪽 호출하는 시나리오에서 silent regression 가능.

→ S2 발췌 §4 동봉 / S7도 동일 사실 인지 필요.

### 2.2 P19 (신규): caller transitional 마무리 시점 명시 필요

**문제**: `LlmCaller.call()` 시그니처가 `GenerationControls | None = None` + `temperature: float | None = None` 둘 다 받음 (`caller.py:107-110`). 코멘트에 "Transitional compatibility for existing call sites that still pass a scalar temperature. Later call-site wiring should use named presets." 명시 (line 117-119).

**의미**:
- transitional은 좋은 엔지니어링 — call site 마이그레이션을 점진 진행 가능.
- 그러나 **transitional 종료 시점이 코드/문서 어디에도 명시 안 됨**. 영원히 transitional로 남으면 의도 흐려짐.
- scalar `temperature` 호환성을 영구히 두면, 미래 변경자가 GenerationControls 안 쓰고 scalar 박는 것이 valid path가 됨 — 정책 약화.

**제안**:
1. transitional 종료 조건 명시 — "call site N개 모두 GenerationControls preset 사용 후 scalar temperature 인자 deprecate" 같은 deprecation milestone.
2. 코드 inline comment에 이 milestone 박음 (line 117 주석 확장).
3. 또는 `temperature` 인자에 `DeprecationWarning` 박아 사용 감지.
4. AST regression-gate(아래 §3)에서 scalar `temperature` 인자 전달 detect → fail.

**중요도**: **MINOR** (운영 위험 적음). 단 향후 회귀 방지 위해 명문화 권장.

→ `wiki/canon/handoff/s3/readme.md`에 transitional 종료 milestone 명시 권장.

### 2.3 (참고, 결함 아님): build-agent caller도 동일 transitional

`services/build-agent/app/agent_runtime/llm/caller.py`에 verify 안 했지만 analysis-agent 패턴과 동일하리라 추정. S3 응답에서 build-agent 측 진행 상태도 함께 회신 필요.

---

## 3. AST regression-gate 도입 권장 (S7 패턴 미러)

S7이 `.omx/context/s7-hidden-default-zero-gate-20260429.py`로 박은 패턴을 S3도 도입 권장.

**S7 gate가 검사하는 것**:
- `Constraints` / `AsyncChatSubmitRequest` / `ChatTemplateKwargs` 모든 필드 default 없음
- `generate()` 호출자가 generation field 8개 모두 명시 송신
- 금지 함수 (`_apply_default_thinking_request_controls`) 부재

**S3 측 gate에서 검사할 만한 것**:
1. **`LlmCaller.call()` 호출 자리 (analysis-agent + build-agent 모든 자리)에서 sampling 6개 + `enable_thinking` 명시 송신** — scalar temperature path만 사용하면 fail
2. **`Constraints` schema 두 곳 (analysis-agent + build-agent)에 sampling 7개 필드 존재** + Field 범위 검증 박힘
3. **transitional `temperature` 인자가 deprecation 후 사라졌는지** (미래 milestone)
4. **`tool_choice="required"` 강제 자리 (Phase 2 첫 턴)에 호출되는지** — P10 정책

**위치 후보**: `.omx/context/s3-llm-readiness-gate-YYYYMMDD.py`. S7 패턴과 동일.

**S2/S7 lane과 cross-lane 합의**: S7 gate에 S3 caller 패턴 추가 vs S3 별도 gate. 후자가 lane 소유권 일관.

→ 원본 `§6.3` 불변 원칙 #4 (모델 pin 주석) — regression gate는 그 원칙의 자동화 형태.

---

## 4. 본 WR 처리 후 S3가 회신할 항목

| # | 항목 | 형태 |
|---|---|---|
| 1 | §1.3 P10 (`tool_choice="required"` 강제) 진행/계획 | text 또는 deadline |
| 2 | §1.3 P16 prompt injection 방어 진행/계획 | 단기 액션 (instruction 패턴 마스킹 / trust boundary XML) |
| 3 | P18 topK 불일치 — (a)/(b)/(c) 중 어느 옵션 | 결정 + 이유 |
| 4 | P19 transitional 종료 milestone | "call site N개 마이그레이션 후" 또는 deadline 형태 |
| 5 | AST regression-gate 도입 동의/거절 | 동의 시 도입 시점 |

→ 회신 후 cross-lane 정합 합의 → S2 Step 2 진입 가능.

---

## 5. cross-reference

| 문서 | 내용 |
|---|---|
| 원본 `§5.P5` | schema-level missing surface 본문 |
| 원본 `§7` | 마이그레이션 순서 |
| S3 발췌 §3.1-3.7 | 1차 work item |
| S3 발췌 §4.1-4.2 | CRITICAL 2건 (P16/P17) |
| S2 발췌 §4 | 동일 topK 불일치 사실, S2 측 정합 책임 명시 |
| S7 발췌 §3.5 | TimeoutDefaults 5개 상수 (S3 import 대상) |
| S7 `generation_policy.py:13-79` | SamplingDefaults / TimeoutDefaults 원본 |
| S7 `.omx/context/s7-hidden-default-zero-gate-20260429.py` | regression-gate 참조 패턴 |

---

## 6. 마무리

S3 Step 1 대부분 마무리. **잔여 4건**: 신규 P18(topK schema 불일치) / P19(transitional 종료 milestone) + 1차 발췌 잔여 P10(tool_choice="required") / P16(prompt injection 방어). P17(tool arg validation)은 `router_core.py:98`로 해소 확인. 잔여 4건 정리되면 S3 Step 1 완전 종료 + S2 Step 2 진입 가능. P16(CRITICAL)은 sampling 마이그레이션과 별개 트랙으로 진행.
