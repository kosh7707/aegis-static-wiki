---
title: "S2 /health aggregator 가 S7 신규 readiness 필드 (ready/llmReady/degraded/blockedReason/dependencyStatus) forwarding 하나?"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-s2-health-aggregator-s7-readiness-ready-llmready-degraded-blockedreason-dependen"
last_verified: "2026-05-11"
service_tags: ["s1", "s2", "s7", "health", "contract-drift"]
decision_tags: ["health-readiness-forwarding", "llm-readiness-ramp", "settings-page-health-ui"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-s2-health-aggregator-s7-readiness-ready-llmready-degraded-blockedreason-dependen"
wr_kind: "question"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-11T05:09:51.989Z","note":"Answered by S2 reply WR wiki/canon/work-requests/s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail.md. Confirmed forwarding under llmGateway.detail.*, no wrapper/top-level duplicate in current contract, S1 should not bypass S2; canonical docs updated and regression/build validation passed."}]
registered_at: "2026-05-11T05:05:33.899Z"
completed_at: "2026-05-11T05:09:51.989Z"
---

# S2 /health aggregator 가 S7 신규 readiness 필드 (ready/llmReady/degraded/blockedReason/dependencyStatus) forwarding 하나?

## Summary
- Kind: question
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## 1. 배경

`wiki/canon/api/llm-gateway-api.md` (2026-05-08 갱신, commit `62eeb97`) 기준 S7 `/v1/health` 가 신규 readiness ramp 5 필드 도입:

```ts
{
  // 기존
  status: "ok" | "degraded" | "unhealthy",  // process liveness only — LLM ready 아님
  llmBackend?: { status, endpoint },
  circuitBreaker?: { state: "closed"|"open"|"half_open", ... },
  rag?: { enabled, status, ... },
  
  // 신규 (2026-05-08)
  ready: boolean,            // S7 가 LLM work 처리 가능 여부
  llmReady: boolean,         // LLM dependency readiness
  degraded: boolean,
  degradeReasons: string[],  // ["llm_backend_unreachable" | "llm_circuit_open" | "llm_circuit_half_open"]
  blockedReason: string|null,// "backend_unreachable" | "circuit_open" | "circuit_half_open" | null
  dependencyStatus: { llmBackend, circuitBreaker, rag }
}
```

핵심 의미 변화: **`status="ok"` ≠ LLM ready**. process liveness 만 보장. LLM 사용 가능 여부는 반드시 `ready` / `llmReady` / `degraded` / `blockedReason` 함께 읽어야 함.

## 2. 현재 S1 상태

`services/frontend/src/common/api/core.ts` 의 `HealthCheckResponse`:

```ts
interface HealthCheckResponse {
  status: "ok" | "degraded" | "unhealthy" | "disconnected" | "checking" | string;
  controlPolicyVersion?: string;
  requestIdQueried?: string;
  llmGateway?: HealthServiceEntry;
  analysisAgent?: HealthServiceEntry;
  sastRunner?: HealthServiceEntry;
  knowledgeBase?: HealthServiceEntry;
  buildAgent?: HealthServiceEntry;
}

interface HealthServiceEntry {
  status: "ok" | "degraded" | "unreachable";
  detail?: unknown;          // <-- S7 의 신규 readiness 필드 위치 미명시
  control?: HealthServiceControl;
}
```

S2 `/health` aggregator 가 S7 의 신규 readiness 필드를 어디에 매핑하는지 명시 없음 — `llmGateway.detail: unknown` 안에 숨어있을 가능성 / 별도 wrapping / 미forwarding 중 불명.

## 3. 질문 (acceptance criteria)

- [ ] **Q1**: S2 `/health` aggregator 가 S7 신규 필드 (`ready` / `llmReady` / `degraded` / `degradeReasons` / `blockedReason` / `dependencyStatus`) 를 현재 forwarding 하나?
  - 그렇다 → 어느 path 에 (예: `llmGateway.detail.ready` vs `llmGateway.ready` vs top-level)?
  - 안 하면 forwarding 추가 plan 있나?

- [ ] **Q2**: S2 자체적으로 `ready` / `llmReady` / `degraded` / `blockedReason` 같은 readiness ramp 를 노출할 의도 있나?
  - 예: `HealthResponse.ready` (전체 platform readiness) / `HealthResponse.llmGateway.ready` (LLM lane readiness)
  - 또는 S1 이 raw S7 health 직접 fetch 해야 하나? (S2 우회 → CORS / auth 우려 발생)

- [ ] **Q3**: S2 `wiki/canon/handoff/s2/api-endpoints.md` 에 health readiness ramp 갱신 plan / 시점?

## 4. 영향 (alpha test 직전 우선순위)

S1 SettingsPage 의 health 뱃지 + ConnectionStatusBanner 가 `status="ok"` 만 표시 → 사용자가 LLM unreadiness 모르고 Deep 분석 시도 → S2 `502 LLM_UNAVAILABLE` 회수 후 toast 만 노출. UX 마찰 + alpha test 실패 시나리오 가능.

S2 forwarding 명시되면 S1 측 wiring 진행 (`HealthCheckResponse` 확장 + UI):

```ts
interface HealthCheckResponse {
  // 기존 +
  ready?: boolean;
  llmReady?: boolean;
  degraded?: boolean;
  degradeReasons?: string[];
  blockedReason?: string | null;
  dependencyStatus?: {
    llmBackend?: { status, endpoint };
    circuitBreaker?: { state, consecutiveFailures, threshold, recoverySeconds };
    rag?: { enabled, status, kbEndpoint };
  };
}
```

UI: ConnectionStatusBanner 가 `degraded=true && llmReady=false` 시 caution-review tone (S1 review-tone palette §3 — 새 token 0).

## 5. 시점

alpha test 일정 직전 — Q1 회신 우선순위 높음. Q3 회신 후 S1 cycle wiring + WR complete.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
