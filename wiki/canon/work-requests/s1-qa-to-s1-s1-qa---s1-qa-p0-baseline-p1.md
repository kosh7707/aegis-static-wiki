---
title: "S1-QA -> S1: 종합 QA 결과 — P0 승인버튼 복원 + baseline 갱신 + P1 수정 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-s1-qa---s1-qa-p0-baseline-p1"
last_verified: "2026-04-07"
service_tags: ["s1"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-s1-qa---s1-qa-p0-baseline-p1"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T00:54:54.463Z","note":"P0 approval 버튼 복원, P1 버전 통일, P1 줄 수 수정, baseline 23건 갱신 완료. E2E 180 PASS 달성."}]
registered_at: "2026-04-06T10:27:54.852Z"
completed_at: "2026-04-07T00:54:54.463Z"
---

# S1-QA -> S1: 종합 QA 결과 — P0 승인버튼 복원 + baseline 갱신 + P1 수정 요청

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1-QA -> S1: 종합 QA 결과

- 날짜: 2026-04-06
- 범주: Interaction bug / Visual drift / UX issues
- 실행 명령: `npx playwright test e2e/specs/interactions.spec.ts`, `npx playwright test e2e/specs/visual-qa.spec.ts` 외 6개 spec
- 환경: 1280x720 / dark+light / dev:mock (VITE_MOCK=true) + Playwright MCP
- 증거:
  - QA 리포트: `services/frontend/e2e/qa-captures/comprehensive-qa/REPORT.md`
  - 스크린샷: `services/frontend/e2e/qa-captures/comprehensive-qa/phase*.png`

## 요약

종합 QA 결과 **P0 1건, P1 5건, P2 3건** 발견. interactions.spec.ts **4 FAIL**, visual baseline **24 FAIL**.

## 긴급 수정 요청 (P0)

### P0-1: Approval 승인/거부 버튼 누락
- pending 상태 approval 카드에 "승인"/"거부" 액션 버튼이 렌더링되지 않음
- "Gate 보기" / "Finding 보기" 버튼만 존재
- Baseline 스크린샷(`e2e/__screenshots__/visual-qa.spec.ts-snapshots/approvals-chromium-linux.png`)에는 버튼이 명확히 존재
- interactions.spec.ts 2건 실패의 직접 원인
- 재현: `/projects/p-1/approvals` → "대기" 탭 → "Quality Gate 오버라이드" 카드 확인

## Baseline 갱신 요청 (23건)

Visual baseline 24 FAIL 중 23건은 v0.7.0 디자인 진화(light→dark 기본, 카드 리디자인, 정보 밀도 증가)로 인한 정상 변경. P0-1 수정 후 baseline 갱신(`--update-snapshots`) 요청.

대상 spec:
- `visual-qa.spec.ts` (12건)
- `visual-qa-dark.spec.ts` (6건)
- `responsive.spec.ts` (5건)

## P1 수정 요청 (핵심 3건)

1. **P1-3 버전 불일치**: 푸터 "AEGIS v0.7.0" vs 설정 페이지 "버전 v0.1.0" — 통일 필요
2. **P1-4 파일 상세 "0줄"**: gateway.c (27.6 KB)에 "0줄" 표시 — 실제 줄 수 표시 필요
3. **P1-1 사이드바 한/영 혼용**: "Quality Gate", "Approval Queue"만 영어 — 한국어 통일 검토

## P1 참고 사항 (리포트에만 기록)

- P1-2: 프로젝트 카드 severity 약어 "C:1 H:2" tooltip 없음
- P1-5: Quality Gate "오버라이드" 용어 무설명

## P2 참고 사항 (리포트에만 기록)

- P2-1: placeholder 라우트 사이드바 미노출
- P2-2: 키보드 단축키 힌트 극소
- P2-3: 알림 뱃지 동작 불명확

## 기대 동작

1. P0-1 수정 후 interactions.spec.ts `Approval Decision` 3건 PASS
2. Baseline 갱신 후 visual-qa/dark/responsive 23건 PASS
3. P1-3, P1-4 수정 후 해당 화면 정상 표시
4. 최종 목표: E2E 180건 전부 PASS

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
