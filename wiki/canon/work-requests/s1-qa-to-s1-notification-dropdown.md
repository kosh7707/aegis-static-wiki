---
title: "알림 드롭다운(notification-dropdown) 디자인 전면 개선"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-notification-dropdown"
last_verified: "2026-04-07"
service_tags: ["frontend"]
decision_tags: ["design", "ux"]
related_pages: []
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-notification-dropdown"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T13:29:03.016Z","note":"알림 드롭다운 전면 리디자인 완료. P1-1: width 380px, max-height 440px 스크롤 구조. P1-2: 벨 기준 bottom-end 앵커 + CSS caret 화살표 + slide-up 애니메이션. P1-3: 0건일 때 '모두 읽음' 버튼 숨김 (hasUnread 가드). P1-4: empty state에 Bell 아이콘(muted) + '새 알림이 없습니다' + 보조 설명 추가. P1-5: X 닫기 버튼 추가 + 바깥 클릭 닫기(mousedown) + slide-up 애니메이션. P1-6: surface-2 배경 + border-strong + shadow-xl 강화. Build 0 errors, 392 tests pass."}]
registered_at: "2026-04-07T13:27:20.841Z"
completed_at: "2026-04-07T13:29:03.016Z"
---

# 알림 드롭다운(notification-dropdown) 디자인 전면 개선

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# 알림 드롭다운(notification-dropdown) 디자인 전면 개선

## 발견 환경
- URL: `/#/projects/{id}/overview` → 푸터 알림 벨 클릭
- 스크린샷: `qa-notification-dropdown.png`

## 이슈 목록

### P1-1: 드롭다운 크기 너무 작음
- "알림" 헤더 + "알림이 없습니다" 한 줄이 전부인데도 빡빡하게 들어차 있음
- 알림이 실제로 쌓였을 때 스크롤 영역이 충분한지 의문
- **요청**: 최소 width 320px, max-height 설정 후 내부 스크롤 구조로 변경

### P1-2: 위치/앵커링 어색
- 푸터 바로 위에서 올라오면서 SDK 카드 위를 덮는 어중간한 위치
- 벨 아이콘 기준 앵커링이 아니라 그냥 우하단에 떠있는 느낌
- **요청**: 벨 아이콘 기준 bottom-end 또는 top-end 앵커, 화살표(caret) 추가로 소속감 부여

### P1-3: "모두 읽음" 0건일 때 활성화
- 알림 0건인데 "모두 읽음" 버튼이 클릭 가능 상태
- **요청**: 알림 0건이면 버튼 disabled 또는 숨김 처리

### P1-4: empty state 부실
- "알림이 없습니다" 텍스트 한 줄이 전부
- **요청**: 벨 아이콘(muted) + "새 알림이 없습니다" + 보조 설명("분석 완료, 승인 요청 등의 알림이 여기에 표시됩니다") 추가

### P1-5: 닫기 UX 불명확
- X 버튼 없음, 바깥 클릭으로 닫히는지 시각적 힌트 없음
- **요청**: 우상단 X 닫기 버튼 추가 또는 바깥 클릭 닫기 + 애니메이션(fade/slide)으로 드롭다운임을 명시

### P1-6: 시각적 분리 부족
- 다크 배경과 드롭다운 배경의 명도 차이가 미미, 경계가 불명확
- **요청**: box-shadow 강화 또는 border 1px solid --surface-3, 또는 배경 명도를 한 단계 밝게

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
