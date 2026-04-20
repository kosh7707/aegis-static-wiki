---
title: "S1-QA → S1 (v2 · deep-audit): 이전 WR 재판정 + Activity feed/Attention card 마크업 누락 보완"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card"
last_verified: "2026-04-20"
service_tags: ["frontend"]
decision_tags: ["design-mock-adherence", "deep-audit", "wr-supplement", "single-cycle-v2"]
related_pages: ["wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/design-mock-review-workflow.md", "wiki/canon/handoff/s1-qa/session-2026-04-20-mock-adherence-qa-v2.md"]
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-20T05:20:31.326Z","note":"v2 deep-audit WR 처리 완료. Dashboard activity feed를 /api/projects/:id/activity + WS state 기반으로 보강하고, AttentionProjectCard affordance/foot meta를 복구했으며, severity token proxy를 compat.css 단일 source로 정리했다. 검증: targeted vitest, typecheck, full test, build all green."}]
registered_at: "2026-04-20T04:46:43.205Z"
completed_at: "2026-04-20T05:20:31.326Z"
---

# S1-QA → S1 (v2 · deep-audit): 이전 WR 재판정 + Activity feed/Attention card 마크업 누락 보완

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1-QA → S1 (v2 · deep-audit) 보완 WR

## 맥락
- 이전 WR `s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds` 송부 직후, 검수자가 **소스 일부만 읽고 렌더 결과 기반으로 판정한 점**을 사용자가 지적.
- 이번엔 `services/frontend/src/**` 전수 + `handoff/**/*.css` 18+3 파일 diff + API/hooks/contexts/layouts/utils/constants 포함 약 80+ 파일을 Read + Grep + Explore sub-agent ×3으로 점검.
- 이전 WR은 이미 S1이 처리 착수 — 수정/철회하지 않고 **본 보완 WR로 재판정과 신규 항목만 전달**. 회신은 이전 WR에 reply해도 좋고, 본 WR에 별도 reply해도 됨.
- 산출물: `/home/kosh/AEGIS/.omc/autopilot/findings-v2.md` (증거 경로·라인 명시)
- `complete_wr`는 수신측(S1) 권한 — 검수자가 호출하지 않음.

## 재판정 요약 (이전 WR 17 항)

### 유지 (13) — 소스 근거 확인, 원안대로 처리 권장
- **P1-1** Dashboard KPI sub 교체 (`DashboardPage.tsx:52-57`)
- **P1-2** 프로젝트 테이블 `승인대기` + `담당` 컬럼 누락 (`ProjectExplorer.tsx`)
- **P1-3** Activity footer live-signal 누락 (`RecentActivitySection.tsx:21`) — WS는 `NotificationContext.tsx:79-134`에서 구독하나 Dashboard activity로 안 흐름
- **P1-4** Activity event type 단조 (`useDashboardActivityFeed.ts:37-49`, `ActivityEventCard.tsx:11`) — **확정 강화**, 아래 [N-1] 참조
- **P1-5** Attention card 서술 축약 (`AttentionProjectCard.tsx:39`) — **확정 강화**, 아래 [N-2] 참조
- **P1-6** 미해결 -1건 음수 렌더 (`AttentionProjectCard.tsx:39` 방어코드 부재)
- **P1-7** CTA/섹션 라벨 drift (우선 확인/프로젝트 탐색기/프로젝트 추가)
- **P1-8** CTA 중복 (`DashboardPage.tsx:62` + `ProjectExplorer`)
- **P1-10** 승인(녹)/거부(빨) 버튼 severity 오용 (`ApprovalDecisionDialog.tsx:60-61`, `button.tsx:5-16`)
- **P2-1** Sidebar DESIGN.md 미문서화 (`Sidebar.tsx:50-90`)
- **P2-2** Paperlogy 미적용 — **확정**: `handoff/fonts.css`에 @font-face 선언 있으나 `index.css:113,559` `--cds-font-sans: 'Geist Variable', …`가 body font-family를 덮음. compat.css에도 font-family 매핑 없음
- **P2-4** Card vs Panel 이중 구조
- **P2-6** DangerZone severity-red icon (§3.4 충돌)
- **P2-7** Heartbeat 정적 — **확정**: `LoginPage.tsx:8` 모듈 레벨 상수 + `Line 45` `hb-num="4"` 하드코딩

### 범위조정 (3)
- **P1-9 severity-low 색상** — 원인 재특정: 토큰 정의(`tokens.css:55`)는 mock §3.4와 **일치**. 문제는 `index.css:70`에 `--aegis-severity-low: #00539a` 하드 정의 + `compat.css:52` 프록시 **동시 존재**로 CSS load order에 따라 경합. Report 페이지 녹색 바는 `--success`(tokens.css:100) 사용 추정으로 **severity 오용이 아닐 가능성 있음**. 수정 포커스 = 토큰 이중 정의 제거 (아래 N-3).
- **P1-11 mock handler 미처리** — 경로 확정: `api/source.ts:132` `GET /api/files/${fileId}/content` 호출, `mock-handler.ts:156-157`은 `/api/projects/:id/source/file*` 만 라우팅. 프로젝트 scope 밖 endpoint는 mock 미지원.
- **P2-5 running indicator** — 원인 재특정: status enum은 분리됐으나(`pipeline.status: running` vs `target.status: ready|building`), **Attention card 마크업에서 `.att-progress` laser bar/dot pulse 요소 자체가 없음** (`AttentionProjectCard.tsx:30-45` 전수). 데이터 이슈 아니라 **컴포넌트 마크업 누락**.

### 철회 (3)
- **P1-12 title flash** — SPA 공통 `index.html` 초기 title→useEffect 교체 패턴. 각 페이지 hook 일관. 과도 지적, 철회.
- **P2-3 token 3-way 병존** — `compat.css:1-63` 전수 확인 결과 `--cds-*` → handoff `--primary / --severity-* / --background` 로 **1-way 프록시**. shadcn 쪽도 `index.css:417 @theme inline`이 handoff 토큰 참조. **사실상 handoff 일원화** — 원 주장 철회.
- **P2-8 title flash 중복** — P1-12와 동일. 철회.

## 신규 Findings (소스 근거 100%)

### P1

**[N-1 IMPL-BUG · /dashboard]** Activity feed가 백엔드 `ACTIVITIES[]` 완전 무시
- `mock-handler.ts:202` → `/api/projects/:id/activity` → `data.ACTIVITIES` 반환
- `useDashboardActivityFeed.ts:30-49` → projects를 map하여 **자체 event 재생성**, `/activity` endpoint 한 번도 호출 안 함
- `ActivityEventCard.tsx:11` → `<span className="activity-icon success"><Check /></span>` — `event.type` 필드 사용 지점 0
- 결과: WS/REST 어느 쪽이든 실제 activity stream이 UI에 연결되지 않음. 이전 **P1-3 + P1-4**의 근본 원인
- 기대: (a) `/api/projects/:id/activity` 호출하여 서버 payload 사용, (b) ActivityEvent 타입에 `type: "success"|"critical"|"primary"|"muted"` + `icon: "check"|"alert"|"play"|"user"|"branch"|"clock"` 필드 확장 (mock Dashboard.html:388-399 참조), (c) `ActivityEventCard` 에서 type→className, icon→lucide component mapping

**[N-2 PATTERN-DRIFT · /dashboard]** AttentionProjectCard에 mock의 3대 affordance 전부 누락
- `AttentionProjectCard.tsx:30-45` 마크업 전수 검토 결과 아래 요소 없음:
  - `.att-progress` (running 상태의 laser bar, mock `Dashboard.html:189` `<div class="att-progress">`)
  - `.att-foot .arrow` 우측 arrow SVG (클릭 affordance)
  - `.att-foot .left > span + .sep + span` 이벤트 맥락 ("3분 전 완료 · 승인 2건 대기"류)
- 현재 att-foot은 `<div class="left"><span>{recentProjectUpdate(project)}</span></div>` 하나만
- 기대: mock Dashboard.html:131-250 Card1~Card3 구조 재현 — `sev-critical/high/medium` class, gate chip, att-headline 서술, att-progress (running 시), att-chips, att-foot(left meta + arrow)

**[N-3 DS-VIOLATION · tokens 이중 정의]** `index.css:70-72,312-313` `--aegis-severity-low: #00539a` 하드 정의 vs `compat.css:52-54` `var(--severity-low)` 프록시가 **동시 존재**
- 같은 토큰을 두 파일이 경쟁적으로 정의. handoff가 source of truth여야 하는 설계와 모순
- 같은 패턴이 `--aegis-severity-critical/high/medium-*`, `--aegis-severity-info-*`에도 있을 가능성 → grep 권장
- 기대: `index.css`의 `--aegis-severity-*` 직접 정의 블록(L60-L75, L305-L315) 삭제, `compat.css` 프록시로 일원화. (주의: 기존 팔레트가 `#da1e28`, `#ff832b`, `#f1c21b` 등 Carbon palette인 반면 handoff는 oklch 값 — 브랜드 톤 재확인 필요)

### P2

**[N-4 COPY/PATTERN · /dashboard]** `activity-foot` 정적 라벨 "최근 흐름 요약 · project-derived"
- mock 원본: `Dashboard.html:315-319` `<div class="activity-foot"><span class="live-dot"></span> WS 연결됨 · 실시간 스트림</div>`
- 기대: copy 교체 + N-1 완료 후 실제 WS 연결 상태 반영 (disconnected/retrying/connected 3-state)

## 신규 OK 확인 (참고용)
- **CSS 복제 품질**: mock 18개 CSS 중 16개가 handoff에 **바이트 단위 동일**. `fonts.css`는 CDN→로컬 경로 전환(의도적 adaptation), `dashboard.css`는 S1 UI 확장 3개 규칙 추가. 기타 컴포넌트 11개 + 페이지 login/signup CSS 전부 동일.
- **compat 레이어**: `compat.css`가 Carbon `--cds-*` 토큰을 handoff로 1-way 프록시. 디자인 토큰 통일 품질 양호. v1 P2-3 비판은 잘못된 지적.
- **Handoff-only 확장**: `app-shell.css`, `page-surfaces.css` 는 mock 자산에 없지만 디자이너 design system 규칙과 정합적 (chip-sev/panel/page layout 확장).
- **API 라우팅 커버리지**: `mock-handler.ts` 40+ endpoint 핸들됨. WS(`/ws/analysis`, `/ws/notifications`) 미 mock인 것은 VITE_MOCK 환경 한계 — 별도 이슈 아님.

## 기대 완료 동작
1. 유지 13개는 기존 WR `s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds` 의 처리 맥락 유지.
2. 범위조정 3개(P1-9, P1-11, P2-5)는 위 재특정 포인트로 **수정 타겟 재정렬** 권장.
3. 철회 3개(P1-12, P2-3, P2-8)는 fix 대상에서 제외해 주세요.
4. 신규 N-1 ~ N-4는 이번 cycle에 함께 처리하거나, scope 초과면 reply로 후속 cycle 합의 회신.
5. reply는 `wr_kind=reply`로 이 WR 또는 이전 WR 중 편한 쪽에 돌려주면 검수자가 확인 후 정리.

## 범위 밖 (본 WR에서 다루지 않음)
- 디자이너 mock 자체 수정 (mock-layer 규칙상 검수자 대리 요청 금지)
- 백엔드 API contract / WebSocket payload / 성능
- Carbon Design System 완전 제거 로드맵 (별도 논의 가능)
- 이전 visual baseline 24건 regression (별도 QA 사이클)

## 증거 아티팩트
- 본 WR findings: `/home/kosh/AEGIS/.omc/autopilot/findings-v2.md`
- v1 findings (참고): `/home/kosh/AEGIS/.omc/autopilot/findings.md`
- 스크린샷 16장: `/home/kosh/AEGIS/.omc/autopilot/qa-screenshots/qa-*.png`
- Session history: `wiki/canon/handoff/s1-qa/session-2026-04-20-mock-adherence-qa-v2.md`

## QA 쓰기 검증
- `services/frontend/**` 쓰기 0건 (Edit/Write/NotebookEdit 미사용)
- git 조작 0건
- `wiki/**` 직접 쓰기 0건 (aegis-static-wiki MCP만)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
