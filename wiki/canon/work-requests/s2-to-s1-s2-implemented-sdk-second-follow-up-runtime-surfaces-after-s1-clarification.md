---
title: "S2 implemented SDK second follow-up runtime surfaces after S1 clarification"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "sdk", "backend", "shared-api", "websocket"]
decision_tags: ["sdk-upload", "progress-ux", "retry-endpoint", "quota", "log-pagination", "app-heartbeat", "structured-errors"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea.md", "wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/troubleshooting/sdk.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-25T09:58:20.136Z","note":"2026-04-25 S1 lane Ralph cycle 처리 완료.\n\nS2 가 실제 구현한 runtime surfaces (etaSeconds / phaseStartedAt / phaseHistory / phaseDetail / structured SdkErrorCode / userMessage+technicalDetail+failedAt+correlationId+troubleshootingUrl / retryable+recoverable / POST /sdk/:id/retry / GET /sdk/quota / GET /sdk/:id/log 보강 / GET /sdk/metrics / app-level heartbeat) 모두 frontend 에 활용 적용 완료.\n\n적용 영역 (Ralph US-001~006):\n- services/frontend/src/api/sdk.ts — re-export + retrySdk + fetchSdkLog + getSdkLogDownloadUrl + fetchSdkQuota\n- services/frontend/src/hooks/useSdkProgress.ts — 새 payload 필드 + sdk-log + heartbeat 처리\n- services/frontend/src/pages/ProjectSettingsPage/components/SdkManagementSection.tsx + ProjectSettingsPage.css — byte-level / ETA / phase elapsed / retry CTA / error UX (userMessage + technicalDetail accordion + correlationId + failedAt + troubleshootingUrl) / log modal + pagination + download / quota indicator / SdkAnalyzedProfile metadata 표시\n\nreview tone palette (severity color non-severity UI 금지 doctrine §3.4 준수):\n- sdk-err-block 베이스 = neutral, --critical = --danger, --caution = --warning\n- sdk-status-badge--pending = --warning (caution-review tone)\n- 모두 canonical 토큰만, severity ramp 직접 사용 0\n\n검증:\n- typecheck PASS, 681/681 tests PASS, build clean (esbuild CSS warning 0)\n- code-reviewer round 2 APPROVE (CRITICAL 0, MAJOR 0)\n- qa-tester Playwright 5 surfaces × 3 viewports 시각 확인\n\nintentional 한계 (S2 명시) 보존:\n- ETA upload 한정 (extract/install/analyze/verify 시 hide)\n- retry 는 retained artifact + retention 미만료 + cooldown 충족 + retryCount 한도 미초과 만, fromPhase = analyzing|verifying 만\n- DELETE in-flight 는 cancel 아님 (frontend 에 \"취소\" CTA 노출 안 함)\n- log SSE streaming 은 future (현재 WS sdk-log + REST tail/pagination/download)\n\nbacklog (별도 WR 분리):\n- navbar `.nav-icon .badge` severity-critical (canonical handoff/components/nav.css 영역, 디자이너 WR 필요)\n- overview-gate-badge / quality-gate-badge / monitoring-row-flagged 등의 hardcoded rgb (pre-existing)\n- report-status-tone--{rejected,failed,fail,pending} severity-* (pre-existing)"}]
registered_at: "2026-04-25T09:02:01.389Z"
completed_at: "2026-04-25T09:58:20.136Z"
---

# S2 implemented SDK second follow-up runtime surfaces after S1 clarification

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S2 implemented SDK second follow-up runtime surfaces after S1 clarification

## Summary

S2 re-read S1's SDK second follow-up WR and corrected the previous docs-only interpretation. The previously listed "not provided" surfaces are now implemented in S2-owned code and canonicalized in the wiki.

## Implemented in this cycle

- `sdk-progress.payload.etaSeconds` for live upload byte-rate ETA.
- `sdk-progress.payload.phaseStartedAt` and REST `RegisteredSdk.currentPhaseStartedAt`.
- REST `RegisteredSdk.phaseHistory` persisted in `sdk_registry.phase_history`.
- `sdk-progress.payload.phaseDetail` with structured `{ kind, params? }` details.
- `RegisteredSdk.retryable`, `retryCount`, `retryExpiresAt` and `sdk-error.retryable` / `recoverable`.
- Structured SDK error `code` (`SdkErrorCode`) plus `userMessage`, `technicalDetail`, `failedAt`, and `correlationId`.
- `sdk-error.troubleshootingUrl` using wiki-canonical anchors under `wiki/canon/troubleshooting/sdk#...`.
- `POST /api/projects/:pid/sdk/:id/retry` for retained/materialized failed SDKs.
- `GET /api/projects/:pid/sdk/quota`.
- `GET /api/projects/:pid/sdk/:id/log` with `tailLines`, `offset`, `limit`, `totalLines`, `nextOffset`, and `download=true` text attachment.
- `GET /api/projects/:pid/sdk/metrics`.
- App-level `heartbeat` WS message plus transport ping/pong cleanup in the shared broadcaster.

## Intentional limits S1 must preserve

- `etaSeconds` is currently upload-only; S2 omits ETA for extract/install/analyze/verify until reliable phase duration data exists.
- Retry succeeds only when the failed SDK's retained/materialized `sdk.path` still exists, retry retention has not expired, cooldown has elapsed, and retry count is below the limit.
- Retry currently supports `fromPhase: "analyzing" | "verifying"`; extraction/install replay from raw upload bytes remains future work.
- In-flight `DELETE /sdk/:id` is still not a safe cancellation contract.
- Log chunked/SSE streaming remains future; current live logs are still WS `sdk-log`, and historical access is REST tail/pagination/download.
- No global instance-wide quota endpoint is implemented; project SDK quota is implemented.

## Canonical docs updated

- `wiki/canon/api/shared-models.md` §2.4, §4.5, §4.5.1.
- `wiki/canon/handoff/s2/api-endpoints.md` SDK endpoint table and progress memo.
- `wiki/canon/specs/backend.md` cross-lane SDK note.
- `wiki/canon/troubleshooting/sdk.md` runbook anchors for all current `SdkErrorCode` values.

## Verification evidence

- `cd services/shared && npm run build` — pass.
- `cd services/backend && npx tsc --noEmit` — pass.
- `cd services/backend && npx vitest run src/services/__tests__/sdk.service.test.ts src/controllers/__tests__/sdk.controller.test.ts src/services/__tests__/ws-broadcaster.test.ts src/__tests__/contract/api-contract.test.ts` — pass (`4` files, `169` tests).
- `cd services/backend && npm run build` — pass.
- `cd services/backend && npm test` — pass (`27` files, `487` tests).

## Critic follow-up

A Critic review identified stale docs, overbroad `retryable`, broken troubleshooting URL shape, transport-only heartbeat semantics, and insufficient tests. S2 addressed those before this reply: docs were updated to implementation status, retryability is now conservative, troubleshooting links are wiki-canonical and backed by a runbook, app-level heartbeat messages were added, and service/controller/contract/WS tests cover the new surfaces.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
