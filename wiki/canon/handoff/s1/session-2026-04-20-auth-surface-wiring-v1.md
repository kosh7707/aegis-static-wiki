---
title: "Session history — s1 / 2026-04-20-auth-surface-wiring-v1"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/frontend/src/api/auth.ts"
  - "services/frontend/src/contexts/AuthContext.tsx"
  - "services/frontend/src/pages/LoginPage/hooks/useLoginForm.ts"
  - "services/frontend/src/pages/SignupPage/hooks/useSignupForm.ts"
  - "services/frontend/src/pages/SignupPage/SignupPage.tsx"
  - "services/frontend/src/pages/SignupPage/components/SignupFormCard.tsx"
  - "services/frontend/src/api/mock-handler.ts"
  - "services/frontend/e2e/fixtures/mock-data.ts"
original_path: "mcp://record_session_history/s1/2026-04-20-auth-surface-wiring-v1"
last_verified: "2026-04-20"
service_tags: ["s1"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
---

# Session history — s1 / 2026-04-20-auth-surface-wiring-v1

## Session
- Lane: s1
- Session ID: 2026-04-20-auth-surface-wiring-v1
- Status: completed
- Started at: 2026-04-20T07:55:00Z
- Updated at: 2026-04-20T08:15:00Z

## Summary
S2 auth/member-management v1 reply WR 수신 → S1 프론트엔드 배선 착수. 구현 항목:

- `services/frontend/src/api/auth.ts`:
  - `login(username, password, rememberMe?)` 시그니처 확장. 응답 `expiresAt` 를 `localStorage[aegis:sessionExpiresAt]` 에 저장
  - 신규 함수: `verifyOrgCode(code)`, `register(body)`, `lookupRegistration(token)`, `getSessionExpiresAt()`
  - `confirmPasswordReset` 성공 시에도 session expiry 저장
- `services/frontend/src/contexts/AuthContext.tsx`: login 시그니처에 rememberMe 추가
- `services/frontend/src/pages/LoginPage/hooks/useLoginForm.ts`: rememberMe 상태를 login 호출에 전달
- `services/frontend/src/pages/SignupPage/hooks/useSignupForm.ts`: 전체 재작성. verify는 실제 API 호출로 org preview를 받고, submit은 `register()` 호출 → registrationId/lookupToken/lookupExpiresAt receipt 저장. canSubmit은 `orgVerification.status === "ok"` 요구
- `services/frontend/src/pages/SignupPage/SignupPage.tsx`: submitError/receipt props 전달. onboarding step 3 텍스트를 "승인 즉시 최초 로그인 가능 · 별도 초대 링크 없음" 으로 변경
- `services/frontend/src/pages/SignupPage/components/SignupFormCard.tsx`: submitError/receipt props 수용. 제출 완료 화면에 registrationId/lookupToken/lookupExpiresAt 표시. 본문 notice에서 "invite/" 언급 제거
- `services/frontend/src/api/mock-handler.ts`: `/api/auth/orgs/:code/verify`, `/api/auth/register`, `/api/auth/registrations/lookup/:token` 라우트 추가. password-reset/request 응답을 `{accepted: true}` 로 보정
- `services/frontend/e2e/fixtures/mock-data.ts`: LOGIN_RESPONSE에 `expiresAt` 필드 추가. ORG_VERIFY_PREVIEW, REGISTRATION_CREATED, REGISTRATION_LOOKUP fixture 추가
- `services/frontend/src/pages/LoginPage/LoginPage.test.tsx`, `SignupPage/SignupPage.test.tsx`: 새 contract에 맞춰 assertion 및 API mock 재작성

검증:
- tsc noEmit clean, vitest 594/594 pass
- Playwright에서 실제 dev server(localhost:5173) 기동 중인 상태로 4개 플로우 종단 테스트:
  - POST /api/auth/login with `rememberMe: true` 송신 확인 (400 Bad Request 응답, 에러 UI 렌더링 OK)
  - POST /api/auth/password-reset/request with `{email}` → 202 Accepted, 성공 UI 렌더링
  - POST /api/auth/password-reset/confirm with `{token, newPassword}` → 404, 에러 UI 렌더링 (invalid-token-for-test)
  - GET /api/auth/orgs/AEGIS-DEMO/verify → 404 "Organization code not found", 에러 상태 렌더링 (`data-state="bad"`)
- Register 해피 패스는 백엔드 Organization seed 부재로 종단 미검증. curl 직접 호출 응답이 정확히 NOT_FOUND로 400되는 것까지 확인 (contract shape 매칭 검증)

## Related pages
- [[wiki/canon/work-requests/s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration.md]]
- [[wiki/canon/api/shared-models.md]]
- [[wiki/canon/handoff/s2/api-endpoints.md]]
- [[wiki/canon/specs/backend.md]]
- [[wiki/canon/handoff/s1/readme.md]]

## Test evidence

### 2026-04-20T08:13:40.958Z — passed
- Command: `npx tsc --noEmit --pretty false && npx vitest run`
- Log ref: services/frontend · local vitest run
- tsc noEmit: no diagnostics
- vitest: Test Files 106 passed (106), Tests 594 passed (594)
- Playwright: signup verify(404 bad UI) · forgot-password(202 accepted UI) · reset-password(404 error UI) · login(rememberMe:true wire confirmed)
