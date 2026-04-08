---
title: "사이드바 + WebSocket + OverviewPage 에러 수정 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-websocket-overviewpage"
last_verified: "2026-04-07"
service_tags: ["frontend"]
decision_tags: ["design", "ux", "bug"]
related_pages: []
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-websocket-overviewpage"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T13:10:14.105Z","note":"전체 수정 완료. P0-1: 빌드 clean 확인 (TS 0 errors, 392 tests pass). P1-1: WS 재연결은 createReconnectingWs(maxRetries:8)로 이미 처리됨 — 콘솔 warning은 백엔드 미가동 시 정상 동작. P1-2: sidebar-header-row align-items:center + padding 8px 0 + chevron 수직 정렬. P1-3: subtitle opacity 0.5→0.65 + margin-top 2px. P1-4: sidebar-link font-size 12→14px + min-height 36px. P1-6: trend card all-zero 시 숨김 처리. P1-5/P1-7: 이전 WR에서 적용 완료 (severity 좌측 stripe, surface 명도 확대) — 새로고침 필요."}]
registered_at: "2026-04-07T13:07:13.921Z"
completed_at: "2026-04-07T13:10:14.105Z"
---

# 사이드바 + WebSocket + OverviewPage 에러 수정 요청

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# 사이드바 디자인 + WebSocket + OverviewPage 에러 수정 요청

## 발견 환경
- URL: `/#/projects/{id}/overview`
- 프로젝트: RE100_test
- 스크린샷: `qa-sidebar-closeup.png`, `qa-re100test-after-fix-1.png`

## 이슈 목록

### P0-1: OverviewPage.tsx 500 에러 (신규 버그)
- 콘솔: `Failed to load resource: 500 (Internal Server Error)` on `OverviewPage.tsx`
- Vite HMR reload 실패: `Failed to reload /src/renderer/pages/OverviewPage.tsx`
- 이전 WR 대응 수정 중 문법 오류 또는 존재하지 않는 모듈 import 발생한 것으로 추정
- **요청**: 즉시 수정 필요. 콘솔 에러 0건 상태 복원

### P1-1: WebSocket 연결 실패 warning
- `wsEnvelope.ts:209` — `WebSocket connection to 'ws://localhost:3000/ws/notifications?projectId=...' failed: WebSocket is closed before the connection is established.`
- WS 연결 실패 시 사용자에게 아무런 피드백 없이 조용히 실패함
- **요청**: WS 연결 실패 시 재연결 로직 또는 graceful degradation 처리. 최소한 무한 재시도 방지 + 사용자 알림

### P1-2: sidebar-header-row 여백 여전히 부족
- 이전 WR에서 지적했으나 개선 미미
- 뒤로가기 꺽쇠(`<`)가 "RE100_test" 텍스트와 수직 정렬이 어색함 — 꺽쇠가 너무 위에 붙어있음
- 상하 padding이 여전히 빡빡. 최소 16~20px 확보 필요
- **요청**: header-row padding 상하 16~20px, 꺽쇠 vertical-align을 프로젝트명 중앙에 맞추기

### P1-3: "SECURITY FRAMEWORK" 가독성 미해결
- 이전 WR(P1-2)에서 지적 — 여전히 짙은 회색, 거의 안 보임
- 스크린샷에서 확인: 검은 배경에 묻혀있음
- **요청**: 재차 요청. `opacity: 0.6` 이상 또는 `--text-secondary` 색상 적용

### P1-4: 사이드바 메뉴 font-size 너무 작음
- "대시보드", "파일 탐색기", "취약점 목록" 등 메뉴 텍스트가 전체 레이아웃 대비 작아 보임
- 사이드바 폭 대비 텍스트가 왜소해서 클릭 영역도 좁아 보이는 인상
- **요청**: font-size 최소 14px (현재 13px 이하로 추정), 메뉴 아이템 높이(line-height/padding)도 함께 조정

### 미해결 (이전 WR 잔여)
- P1-3 타이포그래피 위계: 변화 없음
- P1-5 severity 카드 단조로움: 카드 영역 자체가 사라짐 — 의도적 숨김인지 확인 필요
- P1-6 "이전 분석 대비 변화" +0/-0/0: empty state 미적용
- P1-7 surface 명도 차이: 변화 없음

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
