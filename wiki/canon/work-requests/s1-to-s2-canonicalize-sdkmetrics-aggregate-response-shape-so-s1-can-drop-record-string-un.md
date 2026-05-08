---
title: "Canonicalize SdkMetrics aggregate response shape so S1 can drop Record<string, unknown> defensive rendering"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-canonicalize-sdkmetrics-aggregate-response-shape-so-s1-can-drop-record-string-un"
last_verified: "2026-05-08"
service_tags: ["s1", "s2"]
decision_tags: ["sdk-metrics-canonicalization", "shared-types-export", "frontend-narrowing"]
related_pages: ["wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s1/s2-api-coverage-audit-20260508.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-canonicalize-sdkmetrics-aggregate-response-shape-so-s1-can-drop-record-string-un"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-08T07:09:11.763Z","note":"S2 completed. @aegis/shared now exports SdkMetricsPhaseKey, SdkMetrics, and SdkMetricsResponse; GET /api/projects/:pid/sdk/metrics now returns totalRegistered plus sdkCount compatibility alias; tests and canonical docs updated. Critic verification PASS."}]
registered_at: "2026-05-08T06:43:29.292Z"
completed_at: "2026-05-08T07:09:11.763Z"
---

# Canonicalize SdkMetrics aggregate response shape so S1 can drop Record<string, unknown> defensive rendering

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 배경

S2 API contract `GET /api/projects/:pid/sdk/metrics` endpoint은 "SDK 등록/phase duration aggregate metrics 조회" 로 명세돼 있으나 응답 shape은 canonical doc에 명시되지 않았다. S1은 2026-05-08 cycle에서 wire-up 후 `Record<string, unknown>` 으로 타입을 약화했고, `SdkMetricsPanel` 은 defensive numeric narrowing (`Number.isFinite`) 으로만 KPI 카드를 렌더한다.

## 현재 S1 상태

`services/frontend/src/common/api/sdk.ts:SdkMetrics = Record<string, unknown>` (TODO 코멘트).
`services/frontend/src/common/api/sdk.ts:fetchSdkMetrics(projectId)` returns `Promise<SdkMetrics>`.
`services/frontend/src/pages/ProjectSettingsPage/components/SdkMetricsPanel/SdkMetricsPanel.tsx` — `Object.entries(metrics)` 순회, numeric value만 KPI로 렌더, non-numeric key silently drop.

## 요청

다음을 canonical doc + typed export 로 확정:

1. `SdkMetrics` interface — at minimum `totalRegistered: number`, plus 실제 백엔드 reporter가 노출하는 모든 aggregate 필드 (e.g., `phaseDurations?: Record<PhaseKey, number>`, `successRate?`, `averageInstallSeconds?`, `failureCount?`, etc.).
2. `PhaseKey` enum 또는 union literal — `"uploading" | "extracting" | "installing" | "analyzing" | "verifying"` 등 backend canonical phases.
3. `GET /api/projects/:pid/sdk/metrics` response envelope 확정 (현재 추측: `{success: true, data: SdkMetrics}`).
4. `wiki/canon/handoff/s2/api-endpoints.md` SDK metrics row에 응답 shape 추가.
5. `@aegis/shared` 에 정식 export.

## S1 후속

S2 reply 후 frontend cycle 에서 `Record<string, unknown>` → `SdkMetrics` narrow + structured KPI 렌더 (예: phase별 평균 duration ms, success rate %, etc.) 강화.

## Acceptance criteria

- `@aegis/shared` 가 `SdkMetrics` 정식 export
- canonical doc에 응답 shape 명시
- S1 SdkMetricsPanel 이 `Object.entries` 대신 typed property access 가능 상태

## 관련 파일

- `services/frontend/src/common/api/sdk.ts` (S1)
- `services/frontend/src/pages/ProjectSettingsPage/components/SdkMetricsPanel/SdkMetricsPanel.tsx` (S1)
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/api/shared-models.md`

## 우선순위

P1 — UX 시나리오 직결, KPI 패널 정보 가치 향상 위해 typed shape 필수.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
