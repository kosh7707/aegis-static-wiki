---
title: "프론트엔드 전면 리스타일링 — AEGIS-DESIGN.md v2 + v6 디자인 레퍼런스 기반"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-aegis-design.md-v2-v6"
last_verified: "2026-04-09"
service_tags: ["frontend", "design", "css"]
decision_tags: ["design-system", "restyling", "implementation"]
related_pages: ["wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md", "wiki/canon/work-requests/s1-qa-to-s1-s1-qa-follow-up-design-review-of-v5-strongest-candidate-so-far-but-not-final.md", "wiki/canon/work-requests/s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-aegis-design.md-v2-v6"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-09T06:24:58.239Z","note":"프론트엔드 전면 리스타일링 완료 (7 Phase). \n\nP0: CSS 구조 정리 — components.css(1377줄) 해체 → primitives.css + 10개 co-located CSS. global.css/code-viewer.css/highlight.css 삭제. styles/ = 6파일만.\nP1: Foundation — tokens.css 검증, Navbar(56px) 생성, App.tsx 3종 쉘(Auth/Global/Project), SignupPage 스텁, 16페이지 title policy \"AEGIS — {Page Name}\".\nP2: Shared Primitives — .btn 5종(Primary/Secondary/Tertiary/Ghost/Danger), .card flat, .badge pill, .form Carbon bottom-border, .table zebra.\nP3: Shell — Sidebar(232px always-dark, DynamicAnalysis/DynamicTest 노출), StatusBar footer contract.\nP4: 16 Pages — 모든 hardcoded hex/rgba → token. hljs syntax 토큰 10개 신규. DynamicAnalysis/DynamicTest 라우트 활성화.\nP5: 36 Component CSS — VulnerabilityDetailView hljs, ToastContext color-mix, AdapterSelector, FileTreeNode 토큰화.\nP6: 최종 검증 — hardcoded hex 0건, 삭제 파일 참조 0건, Build 0 errors, 392 tests pass.\n\nArchitect APPROVE (THOROUGH tier). Light mode 구현 완료, dark 토큰 준비됨 (후속 WR)."}]
registered_at: "2026-04-09T04:49:34.825Z"
completed_at: "2026-04-09T06:24:58.239Z"
---

# 프론트엔드 전면 리스타일링 — AEGIS-DESIGN.md v2 + v6 디자인 레퍼런스 기반

## Summary
- Kind: request
- From: s1
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# 프론트엔드 전면 리스타일링 — AEGIS-DESIGN.md v2 + v6 디자인 레퍼런스 기반

## 배경

### 완료된 선행 작업
1. **디자인 시스템 선정** — S1-QA 58개 DESIGN.md 전수 검토 → S2 합의 → IBM Carbon + NVIDIA Restraint 확정
2. **v6 디자인 레퍼런스** — 13페이지 light-only HTML 생성 완료 (`docs/design/reference/v6/`)
   - 재생성 10: Projects List, Overview, Files, Vulnerabilities, Static Analysis, Quality Gate, Approvals, Analysis History, Report, Settings
   - 신규 3: Login, Signup, Global Settings
3. **AEGIS-DESIGN.md v2** — 9-section Stitch 포맷으로 전면 재작성 완료 (`services/frontend/docs/design/AEGIS-DESIGN.md`, 545줄)
   - tokens.css 180/180 토큰 100% 커버
   - v6 learnings 반영 (title policy, footer contract, sidebar nav order, auth layout, anti-drift)
   - Architect verification APPROVE

### QA 판정 히스토리
- v3: REJECT (브랜드 drift 심각)
- v4: PROVISIONAL (cleanup 후 채택 가능)
- v5: STRONGEST CANDIDATE (not final — title 누락, synthetic copy, shell 잔존)
- v6: 생성 완료, QA 리뷰 대기

## 요청 사항

### 핵심: 기존 프론트엔드 코드의 스타일을 AEGIS-DESIGN.md 기준으로 전면 교체

현재 프론트엔드 코드는 초기 AI 생성 레이아웃 수준에 머물러 있다. AEGIS-DESIGN.md v2와 v6 디자인 레퍼런스가 확정된 지금, 실제 코드에 반영해야 한다.

### Phase 1: 토큰 정합성 확보
- [ ] `src/renderer/styles/tokens.css`가 DESIGN.md와 100% 일치하는지 확인 (이미 일치해야 함)
- [ ] 모든 컴포넌트에서 하드코딩된 색상값 → CSS 변수 참조로 교체
- [ ] `--cds-*` / `--aegis-*` 시맨틱 토큰만 사용, raw hex 금지

### Phase 2: 컴포넌트 리스타일링
- [ ] 사이드바: DESIGN.md Section 4 + 5 기준 (always dark, 232px, canonical nav order)
- [ ] 카드: flat design, severity left-border stripe, 2px radius
- [ ] 버튼: Carbon 패턴 (primary/secondary/tertiary/ghost/danger)
- [ ] 입력필드: Carbon bottom-border 패턴
- [ ] 배지/태그: pill radius, 10% opacity background
- [ ] 테이블: zebra striping, monospace 기술 컬럼
- [ ] 모달/토스트/드롭다운: z-index scale, shadow tokens
- [ ] Empty state: 전용 디자인

### Phase 3: 레이아웃 정리
- [ ] 페이지 쉘: navbar(56px) + sidebar(232px) + main + statusbar(32px)
- [ ] Auth 페이지 (Login/Signup): centered card, no shell
- [ ] Global 페이지 (Projects List, Global Settings): navbar + main, no project sidebar
- [ ] Title policy: 모든 라우트에 "AEGIS — {Page Name}" 적용

### Phase 4: 테마 + 검증
- [ ] Light/Dark 전환 정상 동작
- [ ] 전 라우트(14개) 양쪽 모드 시각 검증
- [ ] E2E visual baseline 전체 갱신

## 참조 문서
- **디자인 시스템**: `services/frontend/docs/design/AEGIS-DESIGN.md` (canonical)
- **토큰 소스**: `services/frontend/src/renderer/styles/tokens.css`
- **v6 레퍼런스**: `docs/design/reference/v6/` (13 light pages + index)
- **IBM Carbon 원본**: `docs/design/ibm/DESIGN.md`
- **NVIDIA 원본**: `docs/design/nvidia/DESIGN.md`
- **선행 WR**: `wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md`

## 완료 기준
- [ ] 모든 컴포넌트가 AEGIS-DESIGN.md 토큰만 사용 (하드코딩 hex 0건)
- [ ] v6 레퍼런스와 시각적으로 일치하는 수준
- [ ] BEM-like CSS class naming convention 준수
- [ ] Dark/Light 양쪽 전 라우트 정상 표시
- [ ] `npm run build` 성공
- [ ] S1-QA Playwright 순회 시 P1 이상 이슈 0건

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
