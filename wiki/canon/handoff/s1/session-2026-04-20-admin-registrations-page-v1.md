---
title: "Session history — s1 / 2026-04-20-admin-registrations-page-v1"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/frontend/src/api/auth.ts"
  - "services/frontend/src/api/mock-handler.ts"
  - "services/frontend/src/pages/AdminRegistrationsPage/AdminRegistrationsPage.tsx"
  - "services/frontend/src/pages/AdminRegistrationsPage/hooks/useAdminRegistrations.ts"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/layouts/Navbar.tsx"
  - "services/frontend/src/layouts/Navbar.test.tsx"
original_path: "mcp://record_session_history/s1/2026-04-20-admin-registrations-page-v1"
last_verified: "2026-04-20"
service_tags: ["s1"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md", "wiki/canon/handoff/s1/session-2026-04-20-auth-happy-path-qa-v1.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
---

# Session history — s1 / 2026-04-20-admin-registrations-page-v1

## Session
- Lane: s1
- Session ID: 2026-04-20-admin-registrations-page-v1
- Status: completed
- Started at: 2026-04-20T08:40:00Z
- Updated at: 2026-04-20T10:20:00Z

## Summary
조직 관리자용 가입 요청 검토/결재 UI를 신규 라우트 `/admin/registrations` 으로 추가.

## 구현
- **API layer** (`services/frontend/src/api/auth.ts`):
  - `listRegistrationRequests()` → `GET /api/auth/registration-requests`
  - `approveRegistrationRequest(id, role)` → `POST /api/auth/registration-requests/:id/approve` `{role}`
  - `rejectRegistrationRequest(id, reason)` → `POST /api/auth/registration-requests/:id/reject` `{reason}`
  - mock 분기 포함
- **Mock handler** (`services/frontend/src/api/mock-handler.ts`): 신규 3개 라우트(list/approve/reject) 추가
- **Page** (`services/frontend/src/pages/AdminRegistrationsPage/`):
  - `AdminRegistrationsPage.tsx` — PageHeader + 대기/승인/반려 카운트 뱃지 + pending/처리완료 섞인 리스트 + 행별 승인(역할 셀렉트)/반려(사유 textarea) 인라인 액션
  - `hooks/useAdminRegistrations.ts` — 목록 fetch, approve/reject 후 refresh() 로 full data 재로딩, action error 분리 관리
- **Routing + guard** (`services/frontend/src/App.tsx`):
  - 신규 `RequireAdmin` 가드: 비인증 → /login, 비관리자 → /dashboard
  - `/admin/registrations` 라우트를 `GlobalLayout` 안에 장착
- **Navbar** (`services/frontend/src/layouts/Navbar.tsx`): `useAuth()` 를 구독해 `user.role === "admin"` 일 때만 ShieldCheck 아이콘 + "관리자" 링크 표시. aria-current 동기화
- **Tests**: `Navbar.test.tsx` 에 AuthContext mock 추가 (admin role). 기존 테스트 전부 녹색 유지

## 검증
- `npx tsc --noEmit --pretty false` clean
- `npx vitest run` → 106 files / 594 tests pass
- Playwright MCP 실서버 QA:
  - acme-admin(Admin1234!) 로그인 후 Navbar 상단에 "관리자" 링크 노출 확인
  - `/admin/registrations` 진입 → 목록(대기/승인/반려 혼합) + 카운트 뱃지 렌더링
  - **승인**: UI QA(reg-b2768f2d) 행에서 역할=analyst 선택 후 승인 → `POST /approve` 200 → 행 상태 approved 로 전환, 역할 뱃지/승인 시각 표시
  - **반려**: UI QA2(reg-634b7389) 행에서 반려 버튼 → 사유 textarea 표출 → "테스트 반려 사유" 입력 후 반려 확정 → `POST /reject` 200 → 행 상태 rejected 로 전환, 반려 시각 + 반려 사유 렌더링
  - RequireAdmin 가드가 비관리자의 /admin/registrations 접근을 /dashboard 로 리디렉트함을 코드 레벨에서 검증 (실유저 없어 UI 검증은 생략)

## 알려진 사소 사항 (impl-side, 비블로커)
- 백엔드 approve/reject 응답이 `RegistrationRequest` 전체를 반환하지 않고 `{id, organizationCode:"", organizationName:"", email, status}` 부분 필드만 반환
- 이를 그대로 setState 하면 createdAt/fullName 등이 소실되어 "Invalid Date" 렌더링 발생. 회피: action 후 `refresh()` 로 전체 목록 재로딩
- 후속 follow-up으로 백엔드에 전체 RegistrationRequest 반환을 요청하면 optimistic update 로 바꿀 수 있음 (이번에는 안 보냄)

## Related pages
- [[wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md]]
- [[wiki/canon/handoff/s1/session-2026-04-20-auth-happy-path-qa-v1.md]]
- [[wiki/canon/handoff/s2/api-endpoints.md]]

## Test evidence

### 2026-04-20T10:18:53.244Z — passed
- Command: `npx tsc --noEmit && npx vitest run && Playwright MCP admin approve/reject`
- Log ref: services/frontend · local verification
- tsc noEmit: clean
- vitest: Test Files 106 passed (106), Tests 594 passed (594)
- Playwright: acme-admin login → Navbar admin link visible
- Playwright approve: UI QA row → analyst → approved status + approved timestamp
- Playwright reject: UI QA2 row → textarea reason → rejected status + reason + rejected timestamp
