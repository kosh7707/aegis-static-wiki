---
title: "프로젝트 대시보드 디자인 전면 개선 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-untitled"
last_verified: "2026-04-07"
service_tags: ["frontend"]
decision_tags: ["design", "ux", "css"]
related_pages: []
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-untitled"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T13:03:40.785Z","note":"대시보드 디자인 8개 이슈 전부 수정 완료. P1-1: sidebar padding 확보, P1-2: subtitle contrast 개선 (sidebar-text-active, opacity 0.5), P1-3: severity 카드 좌측 컬러 스트라이프로 시각 위계 강화, P1-4: donut+modules 간격 압축, P1-5: StatCard에 --stat-accent CSS var로 severity별 좌측 바 적용, P1-6: 빈 프로젝트 전용 empty hero state (아이콘+안내+CTA), P1-7: dark theme surface 명도 차이 확대 (0→1→2→3 간격 3~5% 증가), P2-1: StatusBar에 '서버 가동:' 라벨 추가. Build 0 errors, 392 tests pass."}]
registered_at: "2026-04-07T13:00:14.900Z"
completed_at: "2026-04-07T13:03:40.785Z"
---

# 프로젝트 대시보드 디자인 전면 개선 요청

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# 프로젝트 대시보드 디자인 전면 개선 요청

## 발견 환경
- URL: `/#/projects/{id}/overview`
- 테스트 프로젝트: RE100_test (빈 프로젝트)
- 스크린샷: `qa-re100test-design-critique.png`

## 이슈 목록

### P1-1: sidebar-header-row 여백 부족
- 사이드바 최상단 "RE100_test" + "SECURITY FRAMEWORK" 영역의 상하 padding이 너무 좁음
- 뒤로가기 화살표, 프로젝트명, 부제가 답답하게 붙어있음
- **요청**: padding-top/bottom 최소 12~16px 확보

### P1-2: "SECURITY FRAMEWORK" 텍스트 가독성 제로
- 검은 배경(sidebar)에 짙은 회색 텍스트 → contrast ratio 심각하게 낮음
- WCAG AA 기준 미달 확실
- **요청**: 텍스트 색상을 `--text-secondary` 이상으로 밝게, 또는 opacity 0.6 이상으로 조정

### P1-3: 타이포그래피 위계 부재
- 제목, 숫자, 라벨이 전부 비슷한 크기/무게. 시각적 hierarchy가 없음
- "0 전체 Finding" 숫자가 눈에 안 꽂힘
- **요청**: 주요 숫자(finding count, severity count)에 font-size/font-weight 차별화

### P1-4: 도넛 차트 영역 허전
- 왼쪽 도넛 + 오른쪽 "정적 분석 / 심층 분석 미실행"이 넓은 빈 공간에 흩어져 있음
- **요청**: 레이아웃 압축 또는 분석 상태를 도넛 옆에 밀착 배치

### P1-5: severity 카드 5개 단조로움
- 파일 수 / CRITICAL / HIGH / MEDIUM / LOW 전부 동일 높이, 동일 배경, 동일 레이아웃
- severity별 시각적 차별화(좌측 accent stripe, 아이콘 강조 등) 없음
- **요청**: 각 severity 컬러를 카드 좌측 바 또는 배경 그라데이션으로 반영

### P1-6: empty state 디자인 미고려
- 데이터 없는 대시보드에서 "+0 신규 발견 / -0 해결됨 / 0 미해결" 무의미한 수치 나열
- 하단 링크 카드 6~7개가 전부 빈 내용 + 화살표만 표시
- 첫 사용자 입장에서 "이거 동작하는 거 맞아?" 느낌
- **요청**: 데이터 없을 때 전용 empty state (일러스트 + 안내 메시지 + CTA) 적용

### P1-7: surface 명도 차이 미미
- dark theme에서 surface-0 / surface-1 / surface-2 간 명도 차이가 너무 작아 카드 경계가 약함
- 깊이감(depth) 부족
- **요청**: surface 단계별 명도 차이를 최소 3~5% 더 벌리기

### P2-1: 푸터 "35분" 의미 불명
- "AEGIS v0.2.0 · 35분" — 가동시간? 마지막 통신? 맥락 없이 던져져 있음
- **요청**: "마지막 동기화: 35분 전" 등 라벨 명시

## 총평
현재 대시보드는 전반적으로 "AI가 생성한 기본 레이아웃" 느낌이 강함. 타이포그래피, 색상 팔레트, 카드 디자인, empty state 모두 의도적 디자인 결정이 보이지 않음. 보안 분석 도구의 신뢰감과 전문성을 줄 수 있는 디자인 방향 재정립 필요.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
