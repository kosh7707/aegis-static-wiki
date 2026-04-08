---
title: "디자인 QA 백로그 — Stitch MCP 연동 후 디자인 레퍼런스 재작업 필요"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-qa-qa-stitch-mcp"
last_verified: "2026-04-08"
service_tags: ["frontend"]
decision_tags: ["design", "backlog"]
related_pages: ["wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md", "wiki/canon/work-requests/s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba.md"]
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-qa-qa-stitch-mcp"
wr_kind: "notice"
status: "open"
from_lane: "s1-qa"
to_lanes: ["s1-qa"]
completed_by: []
registered_at: "2026-04-08T04:40:29.476Z"
---

# 디자인 QA 백로그 — Stitch MCP 연동 후 디자인 레퍼런스 재작업 필요

## Summary
- Kind: notice
- From: s1-qa
- To: s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# 디자인 QA 백로그 — 세션 이관용

## 현재 상태 요약

### 1. 디자인 시스템 선정 완료
- 58개 DESIGN.md 전수 검토 (awesome-design-md 레포)
- S2 합의: **IBM Carbon (canonical base)** + **NVIDIA (시각적 절제 참고)**
- 레퍼런스 파일: `docs/design/ibm/DESIGN.md`, `docs/design/nvidia/DESIGN.md` (preview.html 포함)
- S1 WR 발행 완료: `s1-qa-to-s1-aegis-ibm-carbon-nvidia.md`

### 2. S1 첫 구현 → 부분 완료
- Carbon Gray 토큰 색상(Gray 100/90/80) 적용됨
- IBM Plex Sans 폰트 로딩 불완전 (body가 Times New Roman 폴백)
- 레이아웃/컴포넌트 수준은 미적용
- WR 추가 발행: `s1-qa-to-s1-carbon.md` (폰트 버그 + 레이아웃 개선)

### 3. 디자인 레퍼런스 HTML 작업
- `docs/design/reference/projects-list.html` — 프로젝트 목록 페이지 목업
- v0 (원본) → v1 (Architect+Critic 피드백 반영) 두 버전 스냅샷 보관
  - `docs/design/reference/v0-projects-list.html`
  - `docs/design/reference/v1-projects-list.html`
- **결론: v0가 v1보다 감성적 품질이 높음**
- AI가 만들고 AI가 리뷰하는 루프는 AI 미학에서 벗어나지 못하는 한계 확인
- **현재 `projects-list.html`은 v1 상태** → v0로 돌리거나 Stitch로 재작업 필요

### 4. Stitch MCP 세팅 완료
- `npm install -g @_davideast/stitch-mcp` (v0.5.3) 설치됨
- `.mcp.json`에 stitch 서버 등록됨 (env 블록 없음, 셸 환경변수 상속)
- `STITCH_API_KEY` 환경변수 설정됨 (셸에 export 완료)
- **세션 재시작 후 Stitch MCP 도구 사용 가능**

## 다음 세션 TODO

### 즉시
1. 세션 시작 시 `ToolSearch("stitch")`로 Stitch MCP 로딩 확인
2. Stitch에서 AEGIS 프로젝트 목록 페이지 디자인 생성
   - 입력: "보안 분석 플랫폼, 운영 콘솔 느낌, IBM Carbon 다크/라이트, Sentry/Teams 바이브"
   - IBM DESIGN.md + NVIDIA DESIGN.md를 Stitch에 피드
   - 사용자가 캔버스에서 직접 조정
3. Stitch 결과를 `docs/design/reference/`에 저장
4. S1에 최종 레퍼런스 WR 발행

### 기존 미해결 WR
- 프로젝트 대시보드 디자인 전면 개선 (P1 7건 + P2 1건)
- 사이드바 + WebSocket + OverviewPage 에러 (P0 1건 + P1 4건)
- 알림 드롭다운 디자인 전면 개선 (P1 6건)
- 프로젝트 목록 Carbon 미완 + 폰트 버그 (P0 1건 + P1 4건 + P2 1건)
→ 이상 모두 IBM Carbon 전면 교체 WR(`s1-qa-to-s1-aegis-ibm-carbon-nvidia.md`)에 통합됨

### 확정 사항
- 계정 시스템: **다음으로 미룸** (현재 Kosh/Admin 고정)
- 디자인 시스템: **IBM Carbon base + NVIDIA 절제**
- 테마: **다크/라이트 양쪽 지원 필수**
- severity low = **파란색** (초록 아님, 혼동 방지)
- 사이드바 = **always-dark** (라이트 모드에서도 다크 유지)
- 팔레트 = **단일 파일 집중 관리**

### 핵심 교훈
- AI가 디자인 생성 + AI가 리뷰 = AI 미학 수렴 (탈출 불가)
- Stitch 같은 비주얼 디자인 도구로 사람이 개입해야 AI 슬롭 탈피 가능
- 기술적 정합성(WCAG, 4px 그리드, 타입 스케일) ≠ 좋은 디자인
- v0의 "비체계적" 간격이 오히려 optical spacing으로 더 자연스러웠음

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
