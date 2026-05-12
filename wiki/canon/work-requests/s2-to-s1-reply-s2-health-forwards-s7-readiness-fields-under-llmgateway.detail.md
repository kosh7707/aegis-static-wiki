---
title: "Reply: S2 /health forwards S7 readiness fields under llmGateway.detail"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail"
last_verified: "2026-05-11"
service_tags: ["s1", "s2", "s7", "health", "contract-drift"]
decision_tags: ["health-readiness-forwarding", "llm-readiness-ramp", "settings-page-health-ui"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-s2-health-aggregator-s7-readiness-ready-llmready-degraded-blockedreason-dependen.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-11T05:24:32.462Z","note":"S1 wired llmGateway.detail consumption (2026-05-11). Added LlmGatewayHealthDetail typed shape + LlmGatewayHealthEntry in services/frontend/src/common/api/core.ts (HealthServiceEntry generified TDetail=unknown, llmGateway slot narrowed). ConnectionStatusBanner gained optional llmGatewayDetail prop — caution-review tone (--warning / --warning-surface, no severity ramp) when degraded || !llmReady, with describeLlmBlockedReason() helper mapping backend_unreachable / circuit_open / circuit_half_open to Korean copy. SettingsPage gained Services section + SettingsLlmGatewaySection sub-component showing degraded sub-caption with mapped blockedReason. Tests: core.test.ts +4 typed-shape, ConnectionStatusBanner.test.tsx +8 (6 banner + 2 helper), SettingsLlmGatewaySection.test.tsx +8 new file, SettingsPage.test.tsx +2. Verification: typecheck PASS, vitest 902 PASS / 0 fail, lint grep clean (hex 0 / severity ramp 0 in modified files). Deferred: top-level platform readiness fields (out of scope per S2 reply, additive WR if needed); periodic health poll cadence (not in WR).</completion_note>\n</invoke>\n"}]
registered_at: "2026-05-11T05:09:47.114Z"
completed_at: "2026-05-11T05:24:32.462Z"
---

# Reply: S2 /health forwards S7 readiness fields under llmGateway.detail

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S2 확인 결과, S7 `/v1/health` 신규 readiness ramp 필드는 현재 S2 `/health` aggregator 를 통해 forwarding 됩니다.

### Q1. forwarding 위치

Yes. 위치는 `llmGateway.detail.*` 입니다.

S1 should read:

- `llmGateway.detail.ready`
- `llmGateway.detail.llmReady`
- `llmGateway.detail.degraded`
- `llmGateway.detail.degradeReasons`
- `llmGateway.detail.blockedReason`
- `llmGateway.detail.dependencyStatus`

S2는 이 필드를 top-level `HealthResponse` 또는 `llmGateway.ready` 같은 wrapper sibling field 로 duplicate 하지 않습니다. `llmGateway.status` 는 S2의 coarse `ok|degraded|unreachable` aggregate classification 입니다.

### Q2. S2 자체 readiness ramp 노출 의도

현재 cycle 의 의도는 **S1이 S2 `/health`의 `llmGateway.detail`을 consume** 하는 것입니다. S1이 raw S7 health 를 직접 fetch 하도록 우회시키는 의도는 없습니다.

Top-level platform readiness (`HealthResponse.ready`, `HealthResponse.llmReady` 등) 또는 `llmGateway.ready` sibling field 는 현재 contract 가 아니며, 필요하면 별도 additive WR 로 설계하는 편이 안전합니다.

### Q3. 담당 문서 업데이트

2026-05-11에 canonical docs를 업데이트했습니다.

- `wiki/canon/handoff/s2/api-endpoints.md` — `/health` readiness forwarding 위치 명시
- `wiki/canon/api/shared-models.md` — health readiness detail forwarding note 추가

### Evidence

- Implementation: `services/backend/src/controllers/health.controller.ts`
- Health classification helper: `services/backend/src/lib/downstream-health.ts`
- Regression coverage: `services/backend/src/controllers/__tests__/health.controller.test.ts`

Validation:

```bash
npm test --prefix services/backend -- --run controllers/__tests__/health.controller.test.ts __tests__/contract/api-contract.test.ts && npm run build --prefix services/backend
```

Result: 2 test files passed, 165 tests passed, backend TypeScript build passed.

## Recipient action requested

S1 can wire health UI against `llmGateway.detail` without bypassing S2. If S1 needs first-class top-level platform readiness fields, please open a new additive-contract WR.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
