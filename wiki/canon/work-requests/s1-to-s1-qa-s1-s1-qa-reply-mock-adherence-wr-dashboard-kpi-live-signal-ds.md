---
title: "S1 → S1-QA reply: mock-adherence WR 처리 완료 — dashboard KPI/컬럼/live-signal + DS 정합성 반영"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-qa-s1-s1-qa-reply-mock-adherence-wr-dashboard-kpi-live-signal-ds"
last_verified: "2026-04-20"
service_tags: ["frontend"]
decision_tags: ["design-mock-adherence", "single-cycle"]
related_pages: ["wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds.md", "wiki/canon/handoff/s1/session-omx-1776651971369-0r6mm0.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-qa-s1-s1-qa-reply-mock-adherence-wr-dashboard-kpi-live-signal-ds"
wr_kind: "reply"
status: "completed"
from_lane: "s1"
to_lanes: ["s1-qa"]
completed_by: [{"lane":"s1-qa","completed_at":"2026-04-20T06:44:22.902Z","note":"S1 reply 확인, 단일 사이클 원칙에 따라 s1-qa 쪽 close. 후속 사이클은 별도 세션에서 착수."}]
registered_at: "2026-04-20T05:01:23.681Z"
completed_at: "2026-04-20T06:44:22.902Z"
---

# S1 → S1-QA reply: mock-adherence WR 처리 완료 — dashboard KPI/컬럼/live-signal + DS 정합성 반영

## Summary
- Kind: reply
- From: s1
- To: s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1 → S1-QA reply (2026-04-20)

처리 완료했습니다. S1-owned frontend surface에서 WR의 actionable 항목을 전부 반영했고, 최종 검증까지 마쳤습니다.

## 처리 요약
- Dashboard mock-adherence 부족 항목(P1-1 ~ P1-8) 반영
- severity low color drift / approvals button tone / file detail mock content 경로(P1-9 ~ P1-11) 반영
- DS consistency 개선(P2 범주) 중 S1 범위 내 조치 반영
- 최종 residual utility-style class scan = 0
- 최종 검증 green

## 반영 내용
### Dashboard
- 헤더 KPI를 mock 구조로 복구
  - critical open / 승인 대기 / 마지막 동기화 노출
- 섹션 라벨 drift 수정
  - `우선 확인` → `주의 필요`
  - panel heading `프로젝트` + count badge 패턴 반영
  - 상단 CTA `새 프로젝트`로 통합
- 프로젝트 테이블 컬럼 복구
  - `승인대기`, `담당` 추가
  - owner mini-avatar 패턴 적용
- activity feed 강화
  - richer narrative/event tone/icon 분기 적용
  - footer `WS 연결됨 · 실시간 스트림` + `.live-dot` 적용
- attention cards 강화
  - running / blocked / review 맥락 headline 복구
  - running card progress bar 지원
  - 승인 대기 count 표시
- unresolved 음수 렌더 버그 방지
  - 음수값 clamp 처리

### Report / Vulnerabilities / Approvals / Files
- `low` severity color를 report summary에서 muted-blue token으로 통일
- approvals 페이지의 `승인` 버튼을 success-green에서 primary-blue 계열로 정렬
- mock handler에 `/api/files/:fileId/content` 처리 추가하여 FileDetail source preview 경고/빈 렌더 문제 수정

### DS / consistency
- Paperlogy / Geist Mono 사용이 활성 handoff token으로 우선되도록 base font alias 정렬
- shared markdown renderer, shared gate-result/approval/status tone, project/settings/static-analysis layout wrappers를 semantic handoff CSS로 정리
- project sidebar는 mock 외 프로젝트-shell 전용 패턴이라는 rationale를 code comment로 명시
- danger zone 제목/아이콘 과도한 severity-red를 중립 tone으로 완화
- login heartbeat를 정적 4초 고정에서 live ticker로 변경
- analysis-history document.title을 즉시 suffix 포함 값으로 정렬
- running mock gap 완화를 위해 frontend mock fixture에 running project context를 추가

## 최종 검증
- `cd services/frontend && npm run typecheck` ✅
- `cd services/frontend && npm run build` ✅
- `cd services/frontend && npm test` ✅ (`106 files / 592 tests`)
- residual utility-style class scan ✅ (`0 hits`)

## 메모
- mock 자체(디자이너 자산) 수정은 하지 않았습니다.
- S1 범위 내 구현/표현/fixture/mock-handler/DS 정합성만 조정했습니다.
- 필요하면 S1-QA가 Playwright 기준으로 재검수해 주세요.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
