---
title: "Temperature Policy Audit — S2 lane 발췌 요약 (2026-04-28, S2 발행 2026-05-03)"
page_type: "context-decision"
canonical: false
source_repo: "AEGIS"
source_refs:
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s7-summary.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s3-summary.md"
last_verified: "2026-05-03"
service_tags: ["s2"]
decision_tags: ["llm-temperature", "sampling", "shared-models", "task-request-contract", "s2-lane"]
related_pages:
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
  - "wiki/canon/handoff/s2/readme.md"
  - "wiki/canon/api/shared-models.md"
  - "wiki/canon/api/analysis-agent-api.md"
  - "wiki/canon/api/llm-gateway-api.md"
---

# Temperature Policy Audit — S2 lane 발췌 요약

> **이 문서는 요약본**이다. 모든 file:line 인용·외부 근거·반론 대응은 원본에 있다.
> **원본**: [`wiki/context/decisions/temperature-policy-analysis-20260428.md`](temperature-policy-analysis-20260428.md) (50KB+, critic 7-round APPROVE)
> **자매 문서**: [S7 lane 발췌](temperature-policy-analysis-20260428-s7-summary.md) (Step 0 완료 + AST regression-gate), [S3 lane 발췌](temperature-policy-analysis-20260428-s3-summary.md) (Step 1 진행 중)
> **수신자**: S2 (AEGIS Core Backend + 공유 타입 단독 소유자)
> **상태**: 마이그레이션 Step 2 진입용. S3 Step 1 마무리 후 본격 진행.

---

## 0. S2가 받는 판정 한 줄

S2는 본 audit 7개 결함 영역 중 **단독 1차 책임자는 적지만**, **공유 계약(shared-models.md, `@aegis/shared` TypeScript 타입, LlmTaskClient)의 단독 소유자**로서 cross-lane 정합을 담당. S7이 schema required로 잠그고 S3가 자체 schema 갱신 중인 상태에서, **S2가 sampling 6개 + enableThinking을 caller 입장에서 송신하지 않으면 S2 → S7 task 호출 / S2 → S3 분석 위임 호출이 schema 검증 실패**.

→ 원본 `§0` (TL;DR + 7 영역 매핑) / `§7` 마이그레이션 Step 2

---

## 1. S2가 책임자인 결함 (P-넘버 → 원본 위치)

| P# | 한 줄 | 중요도 | 원본 위치 |
|---|---|---|---|
| **P5** (S2 측) | `wiki/canon/api/shared-models.md` 단독 소유. TaskRequest.constraints 신규 필드 갱신 | MAJOR | §5.P5 |
| **P9** (S2 협업) | max_tokens cap 통합 협의 — gateway 32768 / S3 32768(통합 완료) — S2가 양쪽 호출 시 정합성 확인 | MAJOR | §5.P9 |
| **P14** (S2 일부) | RAG 결합 활성/비활성 task type 정책 — S2가 어떤 task에 RAG 활성으로 보낼지 결정 | MAJOR | §5.P14 |
| **P11** (S2 측) | S2 backend가 S7/S3 호출 시 `X-Timeout-Seconds` 정책 통일 | MAJOR | §5.P11 |

S7/S3 1차 책임이지만 S2가 caller로서 영향: P1 (sampling 송신), P10 (tool_choice 정책 합의).

---

## 2. S2가 단독 소유한 surface — 갱신 필수

### 2.1 `wiki/canon/api/shared-models.md` (S2 단독 소유)

**현재 결함**: TaskRequest.constraints에 신규 필드(`temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`, `enableThinking`) 미반영. S7과 S3가 schema에 박았지만 **계약서가 미동기**.

**작업**:
1. `Constraints` 타입 정의 갱신 — 7개 신규 필드 + Field 범위 검증 명시
2. caller-required 정책 명시 (S7 측은 `Constraints` 7개 모두 default 없는 required)
3. S3 측은 7개 모두 `Optional[default=None]` (caller가 보내면 그대로 전달, 안 보내면 S3 내부 default) — **S7과 S3의 정책 차이를 계약서에 명시**
4. 모델 pin 주석 — Qwen3.6-27B HF 모델 카드 retrieved 2026-04-28 references 명시

→ 원본 `§5.P5`, `§7` Step 2

### 2.2 `@aegis/shared` TypeScript 타입 (S2 단독 소유)

**위치 후보**: `services/shared/src/dto.ts` 또는 신규 `services/shared/src/llm-sampling.ts`.

**TypeScript 타입 정의 권장 (S7 generation_policy.py 미러)**:

```typescript
// services/shared/src/llm-sampling.ts (신규 권장)
export interface SamplingPreset {
  temperature: number;
  topP: number;
  topK: number;
  minP: number;
  presencePenalty: number;
  repetitionPenalty: number;
  enableThinking: boolean;
}

// Qwen3.6-27B presets (mirror of S7 generation_policy.SamplingDefaults).
// Validated against Qwen/Qwen3.6-27B HF model card retrieved 2026-04-28.
export const SAMPLING_DEFAULTS = {
  THINKING_GENERAL: {
    temperature: 1.0, topP: 0.95, topK: 20, minP: 0.0,
    presencePenalty: 0.0, repetitionPenalty: 1.0, enableThinking: true,
  },
  THINKING_CODING: {
    temperature: 0.6, topP: 0.95, topK: 20, minP: 0.0,
    presencePenalty: 0.0, repetitionPenalty: 1.0, enableThinking: true,
  },
  INSTRUCT: {
    temperature: 0.7, topP: 0.80, topK: 20, minP: 0.0,
    presencePenalty: 1.5, repetitionPenalty: 1.0, enableThinking: false,
  },
} satisfies Record<string, SamplingPreset>;
```

**Constraints 타입 갱신** (`@aegis/shared` 안 기존 LLM constraints 타입):
```typescript
export interface LlmConstraints {
  maxTokens: number;
  timeoutMs: number;
  outputSchema?: string;
  // 신규 필드 (S7 required / S3 Optional 정책 차이 주의)
  enableThinking: boolean;
  temperature: number;
  topP: number;
  topK: number;
  minP: number;
  presencePenalty: number;
  repetitionPenalty: number;
}
```

→ 원본 `§6.1` SamplingDefaults paragraph

### 2.3 `services/backend/src/services/llm-task-client.ts` 갱신

**현재** (`llm-task-client.ts:46-57, 130-139`):
- `constraints?` 자체가 **optional**
- `constraints` 안에 sampling 8개 필드 (`enableThinking, maxTokens, temperature, topP, topK, minP, presencePenalty, repetitionPenalty, timeoutMs, outputSchema`)는 **이미 각각 optional로 정의됨**
- `DEFAULT_GENERATION_CONSTRAINTS` 상수 이미 박힘 (`enableThinking=true, maxTokens=16384, temperature=0.6, topP=0.95, topK=20, minP=0.0, presencePenalty=0.0, repetitionPenalty=1.0`) — Qwen3.6 **thinking-coding** preset.

→ "sampling 0건"이 아니라 **타입 정의 + lane-local default preset이 이미 존재**하나 **공유 타입 부재 + optional 정책**이 핵심 결함.

**권장 작업**:

1. `@aegis/shared`로 타입 추출 — `LlmConstraints` 공유 타입 + `SAMPLING_DEFAULTS` preset 모음 (§2.2 신규 파일)
2. `constraints?` → `constraints` (optional → required) 전환
3. 내부 7개 필드(`enableThinking ~ repetitionPenalty`) optional → required 전환 (S7 schema와 정합)
4. `DEFAULT_GENERATION_CONSTRAINTS`(thinking-coding 0.6) 외에 `THINKING_GENERAL`(1.0) preset도 추가해 호출 자리별 선택 가능하게 함
5. `maxTokens=16384` → 운영 default 32768로 상향 검토 (S3/S7 schema le=32768과 정합)

```typescript
import { SAMPLING_DEFAULTS } from "@aegis/shared";

// caller 자리에서:
const constraints: LlmConstraints = {
  maxTokens: 32768,
  timeoutMs: 1800000,
  ...SAMPLING_DEFAULTS.THINKING_GENERAL,  // 또는 THINKING_CODING
};
```

→ 원본 `§7` Step 2

---

## 3. cap / timeout 통합 결정 (S2 책임)

### 3.1 max_tokens cap (P9)

| Schema | maxTokens.le | 처리 |
|---|---|---|
| `services/llm-gateway/app/schemas/request.py:26` | **32768** | ✅ S7 처리 |
| `services/analysis-agent/app/schemas/request.py:27` | **32768** | ✅ S3 처리 (Step 1) |
| `services/build-agent/app/schemas/request.py:18` | **32768** | ✅ S3 처리 (Step 1) |

3 schema 모두 코드 레벨 32768로 통일 완료. **단 `wiki/canon/api/shared-models.md`(S2 단독 소유) 미갱신** — 계약서 레벨 미완. S2가 shared-models.md에 32768로 박고, `LlmConstraints` 공유 타입 default도 32768로 정렬해야 P9 완전 종료.

### 3.2 timeoutMs cap 분기 (P11)

| Schema | timeoutMs.le | 의도 |
|---|---|---|
| gateway | 300000 (5분) | sync chat / task |
| analysis-agent | 900000 (15분) | 분석 task 길이 |
| build-agent | 900000 (15분) | 동일 |

**의도적 차등** — S2가 어느 lane을 호출하느냐에 따라 다른 timeout. shared-models.md에 명시:
- S2 → S7 (`/v1/tasks` / `/v1/chat`): timeoutMs ≤ 300000
- S2 → S3 (`/v1/tasks` deep-analyze): timeoutMs ≤ 900000

→ 원본 `§5.P11`, S7 `generation_policy.py:72-79` `TimeoutDefaults`

---

## 4. cross-lane 정합 — S3 ↔ S7 `topK` 불일치 (S2 발견 사항, 2026-05-03)

**문제** (오늘 grep으로 새로 발견):
- S7 `services/llm-gateway/app/schemas/request.py:29` — `topK: int = Field(ge=-1)` — vLLM `top_k=-1` (무제한) 허용
- S3 `services/analysis-agent/app/schemas/request.py:33` — `topK: int | None = Field(default=None, ge=1)` — **무제한 거절**
- S3 `services/build-agent/app/schemas/request.py:24` — 동일 `ge=1`

**의미**: caller가 `topK=-1` (vLLM 무제한 의미)을 보내면 S3 schema에서 422 / S7 schema는 통과. **S2가 양쪽을 호출하는 입장이라 정합 책임자**.

**제안**:
- S3 schema를 `ge=-1`로 통일 (vLLM 의미와 일관)
- 또는 S7 schema를 `ge=1`로 정합 (단 vLLM 무제한 의미 포기)
- shared-models.md에서 `topK ≥ 1` (또는 `≥ -1`) 정책 단일화

→ S3에 후속 WR `temperature-policy-analysis-20260428-s3-followup-20260503.md` 동봉

---

## 5. S2 마이그레이션 순서 (원본 §7 — Step 2 진입 조건)

```
[Step 0] S7 갱신 (✅ 완료, 9221a55 + AST regression-gate)
   ↓
[Step 1] S3 두 에이전트 갱신 (⚠️ 진행 중, 4ea1306 commit)
   - 자체 schema sampling 추가: ✅ 완료
   - caller.py sampling plumb: 🔶 transitional (GenerationControls 객체 + scalar temperature 둘 다 받음)
   - 호출처 갱신: 🔶 진행 중
   ↓
[Step 2] S2 backend 갱신 ★ S2 작업
   - shared-models.md 갱신
   - @aegis/shared TypeScript 타입 추가
   - LlmTaskClient.constraints sampling 6개 + enableThinking 송신
   - SAMPLING_DEFAULTS preset 도입
   - timeoutMs 정책 lane별 분기 적용
   ↓
[Step 3] dead default 청소 (S3 transitional scalar temperature 제거 시점)
   ↓
[Step 4] hotN 베이스라인 재실행 → §6.2 측정 실험 진입
```

**Step 2 진입 조건**:
- S3 caller transitional 단계가 sampling 6개 모두 명시 송신으로 마무리됐는지 (현재 GenerationControls + scalar 호환)
- S3 ↔ S7 topK 불일치 합의 (§4 항목)
- shared-models.md 갱신 후 S3/S7 lane 모두 계약서 검토 OK

**Step 2 미완 시 위험**:
- S2 backend가 `LlmTaskClient`로 `/v1/tasks`에 sampling 안 보내고 호출 → S7 schema validation 422 → S2의 분석 오케스트레이션 통째로 실패.
- 단, **S7이 마이그레이션 순서 의도적 단계 분리**를 사용자가 지시했으므로 운영 재배포 전까지는 안전.

→ 원본 `§7`

---

## 6. 통합 테스트 (S2 책임)

S2가 S2 → S7 / S2 → S3 양쪽 호출하는 contract 테스트 추가:

| 테스트 | 검증 내용 |
|---|---|
| S2 → S7 task | LlmTaskClient가 sampling 6개 + enableThinking 명시 송신, S7 schema 통과 |
| S2 → S7 task (sampling 누락) | S7이 422 reject, errorDetail에 missing fields 명시 |
| S2 → S3 deep-analyze | AgentClient가 sampling 6개 명시 송신, S3 schema 통과. timeoutMs 900000까지 허용 |
| S2 → S3 build-resolve | BuildAgentClient 동일 검증 |
| topK=-1 cross-lane | S7 통과 / S3 422. **양쪽 정합 후** 동일 결과 보장하는 회귀 테스트 |
| max_tokens=32768 | 3 schema 모두 통과. 33000 같은 over-cap은 422 |

→ 원본 `§8.3` 측정 메트릭

---

## 7. S2가 박지 않을 결정

- **자리별 temperature 값**: §4.9 잠정값(A/A'=1.0, B=0.6, C-F=0.0)은 모델팀 권장 영역 미러일 뿐. S2는 **caller로서 SAMPLING_DEFAULTS preset을 import해서 자기가 호출하는 task에 맞는 preset 박는 책임**만. 측정으로 자리별 확정은 S3/S7 책임.
- **모델 family 변경**: S7 결정. S2는 shared-models.md에서 모델 pin 주석 동기화.
- **MTP on/off**: S7 결정.

---

## 8. S2가 다른 lane과 협업할 항목

- **S7**: schema required 정책 (Constraints 7개 default 없음) vs S3 Optional 정책 차이를 shared-models.md에 명문화. AsyncChatSubmitRequest도 S7이 required로 잠갔는데 caller가 sampling 안 보내면 422 — S2가 async surface 호출하는 path 있다면 S2 → S7 async 호출도 sampling 6개 송신.
- **S3**: caller transitional 마무리 시점 합의 (§4 후속 WR). topK 불일치 합의. AST regression-gate 도입 검토 cross-lane.
- **S5**: P14 RAG 결합 정책 — S2가 어떤 task에 RAG 활성으로 보낼지 합의. RAG min_score 임계.
- **S1**: 변경 없음. UI는 sampling 정책 노출 안 함.

→ 원본 `§5.P14`, `§7`

---

## 9. 한 줄

S2는 본 audit에서 **공유 계약 단독 소유자**로서 cross-lane 정합 책임. shared-models.md / `@aegis/shared` 타입 / LlmTaskClient 세 surface가 동기화되어야 Step 2 완료. S3 transitional 마무리 + topK 불일치 합의가 선행 조건. 코드 분량 자체는 작음 (TypeScript 타입 추가 + caller 호출 자리 패치).

---

## 10. 원본 cross-reference 한 페이지

| 원본 § | 내용 | S2 관련도 |
|---|---|---|
| `§0` | TL;DR + 7 defect-area 매핑 | 필독 |
| `§2.1` | 운영 LLM 호출 자리 — S2는 0건 (caller로서만 영향) | 참고 |
| `§2.3` | S2/S4/S5/S6/S8 LLM 직접 호출 0건 | 참고 (S2 confirm) |
| `§3.1` | Qwen3.6 권장 6 sampling + 모드 차등 | 필독 (TypeScript preset 미러용) |
| `§5.P5` | TaskRequest schema-level missing surface | 필독 (shared-models.md 갱신) |
| `§5.P9` | max_tokens cap 두 schema 분기 | 필독 (이제 3 schema 통일) |
| `§5.P11` | timeout 정책 분산 | 필독 (shared-models.md에 lane별 cap 명시) |
| `§5.P14` | RAG 결합 정책 부재 | 필독 (S5 협업) |
| `§6.1` | 단기 권장 + SamplingDefaults / TimeoutDefaults | 필독 (TypeScript 미러 정당화) |
| `§6.3` | 불변 원칙 (모델 pin 주석) | 필독 (shared-models.md 모델 pin) |
| `§7` | 마이그레이션 순서 (S2는 Step 2) | 필독 |
| `§10` | 판정 + 반론 대응 | 필독 |

---

## 11. S7/S3/S2 발췌 비교

| 항목 | S7 (완료) | S3 (진행 중) | S2 (대기) |
|---|---|---|---|
| 책임 결함 | 11개 (sampling/observability 등) | 10개 + CRITICAL 2건 (P16/P17) | 4개 (계약/cap/timeout/RAG) |
| 코드 자리 | gateway 단일 | analysis + build 두 lane | shared types + backend |
| 보안 영역 | 면제 | CRITICAL 단독 책임 | 면제 |
| 마이그레이션 단계 | Step 0 (완료) | Step 1 (진행 중) | Step 2 (대기) |
| AST regression-gate | 박음 | 도입 검토 권장 | 도입 검토 (TypeScript 측 lint rule 가능) |
| 분량 | ~9KB | ~16KB | ~9KB (본 문서) |
