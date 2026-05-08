---
title: "S2 reply: FindingsSummary, SdkMetrics, and SdkProfile shared contracts completed for S1 typed UI cleanup"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-reply-findingssummary-sdkmetrics-and-sdkprofile-shared-contracts-completed-fo"
last_verified: "2026-05-08"
service_tags: ["s1", "s2"]
decision_tags: ["s1-aggregate-types"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-canonicalize-findingssummary-aggregate-response-shape-so-s1-can-drop-record-stri.md", "wiki/canon/work-requests/s1-to-s2-canonicalize-sdkmetrics-aggregate-response-shape-so-s1-can-drop-record-string-un.md", "wiki/canon/work-requests/s1-to-s2-canonicalize-sdkprofile-typed-export-from-aegis-shared-so-s1-can-drop-unknown-de.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-reply-findingssummary-sdkmetrics-and-sdkprofile-shared-contracts-completed-fo"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-08T07:24:25.872Z","note":"S1 처리 완료. @aegis/shared의 typed export(FindingsSummary / SdkMetrics + SdkMetricsPhaseKey / SdkProfile / SdkMetricsResponse / SdkProfileListResponse / SdkProfileResponse / FindingSummaryResponse) 모두 frontend api 모듈에 wire — sdk.ts (fetchSdkProfiles/fetchSdkProfile/fetchSdkMetrics)와 analysis.ts (fetchFindingsSummary)에서 unknown[] / Record<string, unknown> 방어 narrowing 제거하고 typed import로 교체. 소비 panel 3종 강화 — SdkProfilesPanel은 getStringField helper 제거 + id/name/vendor/description + defaults 4 필드 chip 직접 렌더, SdkMetricsPanel은 Object.entries 폐기 + canonical KPI (TOTAL REGISTERED/sdkCount fallback/READY/FAILED/averagePhaseDurationMs) 직접 렌더, FindingsSummaryPanel은 typed total/bySeverity/byStatus 직접 액세스 + Phase 2 critic이 지적한 byStatus 행 추가 (review-tone STATUS_TONE 매핑, severity ramp 미사용). 검증: typecheck PASS, vitest 860 PASS / 121 files / 0 fail, CSS lint grep 모든 변경 파일 clean (oklch direct 0 / hex 0 / Pretendard·Geist Mono 직접 0). sdkCount는 S2 가이드대로 totalRegistered 우선 + 호환 fallback. 본 lane 외 docs (handoff §5/§6) 갱신은 사용자 명시 본 cycle 무관."}]
registered_at: "2026-05-08T07:09:30.387Z"
completed_at: "2026-05-08T07:24:25.872Z"
---

# S2 reply: FindingsSummary, SdkMetrics, and SdkProfile shared contracts completed for S1 typed UI cleanup

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S2 completed all three S1 aggregate/profile typing WRs.

## Implemented shared exports

- `FindingsSummary`
- `FindingSummaryResponse` now uses `FindingsSummary`
- `SdkMetricsPhaseKey`
- `SdkMetrics`
- `SdkMetricsResponse`
- `SdkProfileListResponse`
- `SdkProfileResponse`
- `SdkProfile` remains exported from `@aegis/shared` through the existing `models.ts` → `index.ts` barrel.

## Runtime/backend changes

- `GET /api/projects/:pid/findings/summary` runtime aggregate is typed as `FindingsSummary` and contains the implemented fields only: `total`, `bySeverity`, `byStatus`.
- `GET /api/projects/:pid/sdk/metrics` now returns `totalRegistered` plus the existing `sdkCount` compatibility alias; `sdkCount === totalRegistered`.
- `GET /api/sdk-profiles` and `GET /api/sdk-profiles/:id` envelopes are documented as `SdkProfileListResponse` / `SdkProfileResponse`.

## S1 integration guidance

S1 can now import these DTOs from `@aegis/shared` and remove local `Record<string, unknown>` / `unknown[]` defensive aggregate/profile narrowing for these three surfaces. Prefer `SdkMetrics.totalRegistered` in new UI; keep accepting `sdkCount` only as the compatibility alias.

## Validation

- `npm test --workspace @aegis/backend -- --run src/__tests__/contract/api-contract.test.ts src/services/__tests__/finding.service.test.ts` → 2 files passed, 204 tests passed.
- `npm run build --workspace @aegis/shared && npm run build --workspace @aegis/backend && npm test --workspace @aegis/backend -- --run` → shared/backend builds passed; backend 28 files passed, 528 tests passed.
- Critic sub-agent verification result: PASS; no blockers found.

## Docs updated

- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
