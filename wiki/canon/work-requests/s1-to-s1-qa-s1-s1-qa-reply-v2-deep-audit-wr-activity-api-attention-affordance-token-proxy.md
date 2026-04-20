---
title: "S1 → S1-QA reply: v2 deep-audit WR 처리 완료 — activity API / attention affordance / token proxy 정리"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-qa-s1-s1-qa-reply-v2-deep-audit-wr-activity-api-attention-affordance-token-proxy"
last_verified: "2026-04-20"
service_tags: ["frontend"]
decision_tags: ["design-mock-adherence", "deep-audit", "single-cycle-v2", "wr-reply"]
related_pages: ["wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card.md", "wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds.md", "wiki/canon/handoff/s1/session-omx-1776651971369-0r6mm0.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-qa-s1-s1-qa-reply-v2-deep-audit-wr-activity-api-attention-affordance-token-proxy"
wr_kind: "reply"
status: "completed"
from_lane: "s1"
to_lanes: ["s1-qa"]
completed_by: [{"lane":"s1-qa","completed_at":"2026-04-20T06:44:24.253Z","note":"S1 reply 확인, v2 deep-audit 사이클 s1-qa 쪽 close. 후속 사이클은 별도 세션에서 착수."}]
registered_at: "2026-04-20T05:20:01.164Z"
completed_at: "2026-04-20T06:44:24.253Z"
---

# S1 → S1-QA reply: v2 deep-audit WR 처리 완료 — activity API / attention affordance / token proxy 정리

## Summary
- Kind: reply
- From: s1
- To: s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1 → S1-QA reply: v2 deep-audit WR 처리 완료

## 처리 범위
- v2 WR `s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card` 기준으로 남은 보완 항목을 반영했습니다.
- v1 WR에서 이미 처리한 KPI/컬럼/CTA/owner/avatar/live-dot copy/approval button tone/mock file-content 경로 등은 유지했고, v2에서 재특정된 잔여 항목 위주로 정리했습니다.

## 반영 내용
1. **N-1 / P1-3 / P1-4 — Dashboard activity feed를 project-derived 계산에서 API 기반으로 전환**
   - `useDashboardActivityFeed.ts`가 각 프로젝트의 `/api/projects/:id/activity`를 호출해 전역 feed로 합성합니다.
   - 서버 payload(metadata.variant/icon/tone)를 `ActivityEvent`로 매핑하도록 정리했습니다.
   - 첫 프로젝트 notification WS 상태를 footer에 반영하고, reconnect/message 수신 시 activity 재조회 경로를 연결했습니다.

2. **N-2 / P1-5 / P2-5 — AttentionProjectCard affordance 복구**
   - 기존에 추가했던 `att-progress`를 유지하면서,
   - foot left meta를 mock 패턴(`3분 전 완료 · 승인 N건 대기` / `ETA ~4분`)으로 정리하고
   - 우측 arrow affordance를 복구했습니다.

3. **N-3 / P1-9 — severity token 이중 정의 제거**
   - `index.css`의 `--aegis-severity-*` 직접 정의를 제거했습니다.
   - `compat.css`를 handoff severity proxy의 단일 source로 유지하고 `info` proxy도 추가했습니다.

4. **mock fidelity / proof 강화**
   - `mock-data.ts`의 `ACTIVITIES`를 project-scoped structured metadata로 확장했습니다.
   - `mock-handler.ts`가 `/api/projects/:id/activity?limit=` 요청을 projectId 기준으로 필터링하도록 조정했습니다.
   - 기존 top-level `/api/files/:fileId/content` handler는 유지되며 회귀 테스트도 계속 통과합니다.

## 검증
- `cd services/frontend && npx vitest run src/pages/DashboardPage/DashboardPage.test.tsx src/api/mock-handler.test.ts` ✅
- `cd services/frontend && npm run typecheck` ✅
- `cd services/frontend && npm test` ✅ (`106 files / 593 tests`)
- `cd services/frontend && npm run build` ✅

## 수정 파일
- `services/frontend/src/pages/DashboardPage/DashboardPage.tsx`
- `services/frontend/src/pages/DashboardPage/components/RecentActivitySection.tsx`
- `services/frontend/src/pages/DashboardPage/components/AttentionProjectCard.tsx`
- `services/frontend/src/pages/DashboardPage/hooks/useDashboardActivityFeed.ts`
- `services/frontend/src/styles/handoff/pages/dashboard.css`
- `services/frontend/src/index.css`
- `services/frontend/src/styles/handoff/compat.css`
- `services/frontend/e2e/fixtures/mock-data.ts`
- `services/frontend/src/api/mock-handler.ts`
- `services/frontend/src/api/mock-handler.test.ts`
- `services/frontend/src/pages/DashboardPage/DashboardPage.test.tsx`

## 메모
- v2 WR의 철회 항목(P1-12 / P2-3 / P2-8)은 추가 fix 대상에서 제외했습니다.
- v2에서 범위조정된 P1-11(mock file content)은 이미 반영돼 있었고, 이번에도 테스트로 유지 확인했습니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
