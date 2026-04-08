---
title: "프로젝트 목록 페이지 — Carbon 이식 미완 + 폰트 폴백 버그 + 레이아웃 개선"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-carbon"
last_verified: "2026-04-08"
service_tags: ["frontend"]
decision_tags: ["design", "bug", "css"]
related_pages: []
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-carbon"
wr_kind: "request"
status: "open"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-08T03:46:46.594Z"
---

# 프로젝트 목록 페이지 — Carbon 이식 미완 + 폰트 폴백 버그 + 레이아웃 개선

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# 프로젝트 목록 페이지 — Carbon 이식 미완 + 폰트 폴백 버그

## Playwright 진단 결과

### P0: 폰트 전역 로딩 실패
- `document.documentElement`의 computed fontFamily = **"Times New Roman"**
- heading(`h2`)에는 "IBM Plex Sans" 600이 적용되어 있으나, body/일반 텍스트는 Times New Roman 폴백
- **원인 추정**: `@font-face` 선언이 heading class에만 적용되거나, 전역 `body { font-family }` 선언 누락
- **요청**: `body, * { font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif; }` 전역 선언 확인. `@font-face` src 경로가 실제 폰트 파일 위치와 일치하는지 확인

### P1-1: 사이드바와 본문 영역 구분 없음
- 사이드바 bg = `rgb(22,22,22)` = body bg = `rgb(22,22,22)` → 완전 동일
- Carbon 기준: 사이드바는 **Gray 100 (`#161616`)**, 본문 영역은 **Gray 90 (`#262626`)** 또는 그 반대로 한 단계 차이 필요
- **요청**: 사이드바를 `#161616`(현행), 메인 콘텐츠 영역을 `#262626`으로 분리. 또는 사이드바에 우측 보더 `1px solid #393939` 추가

### P1-2: 프로젝트 카드 디자인 단조
- 현재: `#262626` bg + `1px solid #393939` border + `2px` radius
- Carbon 토큰은 맞지만 **시각적으로 "박스 2개 나열"에 불과**
- **요청**:
  - 카드에 hover 시 elevation 변화 (Carbon Level 2: `0 2px 6px rgba(0,0,0,0.3)`)
  - RE100 카드의 severity 바에 범례 추가 (CRITICAL 빨강 몇 건, HIGH 노랑 몇 건 등)
  - 카드 간 간격 확보 (최소 16px gap)
  - 프로젝트 아이콘/아바타를 좀 더 시각적으로 구분되게

### P1-3: 빈 영역 처리 없음
- 프로젝트 2개 아래가 완전히 비어있음
- **요청**: 프로젝트가 적을 때 하단에 "프로젝트를 추가하여 보안 분석을 시작하세요" 같은 가이드 또는 empty area 패턴 적용

### P1-4: "새 프로젝트" 버튼 스타일
- 현재: 회색 계열 ghost 버튼
- Carbon 기준: Primary 버튼은 `#0f62fe`(Blue 60) bg + white text
- **요청**: "새 프로젝트"를 Carbon Primary Button 스타일로 변경 (`#0f62fe`, white text, 8px padding)

### P2-1: severity 바 개선
- RE100 카드에 빨강+노랑 바가 표시되지만 범례 없음
- "C:1 H:5 M:3" 같은 텍스트가 사라지고 바만 남으면 정보 전달력 감소
- **요청**: 바 아래 또는 옆에 severity 카운트 텍스트 병기 (바 + 숫자)

## 스크린샷
`qa-after-carbon-projects.png`

## 총평
Carbon 색상 토큰(Gray 100/90/80)은 적용되었으나 폰트 로딩 실패가 치명적이고, 레이아웃/컴포넌트 수준의 Carbon 패턴 적용은 아직 미진. "토큰 교체"는 시작이지 완성이 아님 — **컴포넌트 스타일링(Phase 3)과 레이아웃(Phase 4)** 작업이 필요.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
