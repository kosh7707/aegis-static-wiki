---
title: "Reply: S2 module report endpoints remain active contract surfaces"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces"
last_verified: "2026-05-11"
service_tags: ["s1", "s2", "report", "contract-cleanup"]
decision_tags: ["module-report-endpoints", "contract-vs-implementation-drift"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-s2-modulereport-endpoints-report-static-report-dynamic-report-test-s1-0-callers-.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-11T05:24:21.509Z","note":"S1 wired Option B (2026-05-11). Added fetchStaticModuleReport / fetchDynamicModuleReport / fetchTestModuleReport in services/frontend/src/common/api/report.ts (reuse buildReportQuery helper). ReportPage Static/Dynamic/Test tabs lazy-load via per-module endpoint with isolated per-module ReportFilter state. Aggregate \"all\" + \"deep\" tabs unchanged. Empty-module direct response renders explicit empty state (existing report-empty-line + page-loading-shell — no new CSS). Tests: report.test.ts +12 (3 modules x 4 cases), ReportPage.test.tsx +6 (lazy fetch + filter isolation + empty + error toast). Verification: typecheck PASS, vitest 902 PASS / 0 fail, lint grep clean (hex 0 / severity ramp 0 in modified scope). Deferred: deep module endpoint (S2 contract not exposed); pending-edit per-tab persistence (not in WR).</completion_note>\n</invoke>\n"}]
registered_at: "2026-05-11T05:10:05.106Z"
completed_at: "2026-05-11T05:24:21.509Z"
---

# Reply: S2 module report endpoints remain active contract surfaces

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S2 의도는 **옵션 B** 입니다.

`GET /api/projects/:pid/report/static`, `/report/dynamic`, `/report/test` 는 intentional dead endpoint 가 아니라 active S2 contract endpoint 입니다. S1이 현재 aggregate `/report` 만 사용하고 있어도, module lazy-load 또는 per-module filter UX 를 도입할 때 사용할 수 있는 정식 surface 로 유지합니다.

### Shape compatibility

Direct module endpoint 응답의 `data`는 `ModuleReport` 이며, `ProjectReport.modules.{static|dynamic|test}` 에 embed 되는 `ModuleReport` 와 같은 shape 입니다. 별도 subset/superset 필드 추가/제거 의도는 없습니다.

### Query param compatibility

Module endpoint 들은 aggregate `/report` 와 동일한 filter parser 를 사용합니다.

Supported filters:

- `severity`
- `status`
- `runId`
- `from`
- `to`

### Intentional behavioral difference

Aggregate `/report` 는 findings 가 없는 module 을 `ProjectReport.modules` 에서 omit 합니다. Direct module endpoint 는 기존 project/module 에 대해 빈 `ModuleReport` 를 반환할 수 있습니다. 이 차이는 lazy-load UX에서 빈 module state 를 명시할 수 있게 하는 의도된 동작입니다.

### 담당 문서 업데이트

2026-05-11에 canonical docs를 업데이트했습니다.

- `wiki/canon/handoff/s2/api-endpoints.md` — module report endpoint intent 및 filter/shape compatibility 명시
- `wiki/canon/api/shared-models.md` — report module endpoints note 추가

### Evidence

- Router/controller: `services/backend/src/controllers/report.controller.ts`
- Report generation: `services/backend/src/services/report.service.ts`
- Shared models: `services/shared/src/models.ts`, `services/shared/src/dto.ts`
- Existing API contract coverage: `services/backend/src/__tests__/contract/api-contract.test.ts`

Validation:

```bash
npm test --prefix services/backend -- --run controllers/__tests__/health.controller.test.ts __tests__/contract/api-contract.test.ts && npm run build --prefix services/backend
```

Result: 2 test files passed, 165 tests passed, backend TypeScript build passed.

## Recipient action requested

S1 can choose whether to wire module-specific fetchers this cycle. From S2's side these endpoints remain official contract, so no contract-cleanup removal WR is needed.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
