---
title: "Session history — s1 / 2026-04-20-auth-happy-path-qa-v1"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/frontend/src/api/auth.ts"
  - "services/frontend/src/pages/ResetPasswordPage/ResetPasswordPage.tsx"
  - "services/frontend/src/pages/ResetPasswordPage/hooks/useResetPasswordForm.ts"
  - "services/frontend/e2e/fixtures/mock-data.ts"
original_path: "mcp://record_session_history/s1/2026-04-20-auth-happy-path-qa-v1"
last_verified: "2026-04-20"
service_tags: ["s1"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md", "wiki/canon/handoff/s1/session-2026-04-20-auth-surface-wiring-v1.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
---

# Session history — s1 / 2026-04-20-auth-happy-path-qa-v1

## Session
- Lane: s1
- Session ID: 2026-04-20-auth-happy-path-qa-v1
- Status: completed
- Started at: 2026-04-20T08:20:00Z
- Updated at: 2026-04-20T08:32:00Z

## Summary
S2의 auth mock-to-real bridge 적용 후 happy-path QA 완료.

## 배선 보정
- `services/frontend/src/api/auth.ts`: `confirmPasswordReset` 반환 타입을 `Promise<void>` 로 수정. 백엔드가 `{success: true}` 만 반환하므로 token/user를 기대하던 기존 로직은 undefined 저장으로 이어져 401 연쇄 발생했음
- `services/frontend/src/pages/ResetPasswordPage/hooks/useResetPasswordForm.ts`: 성공 시 auto-login 시도를 제거하고 `submitted` state 도입, AuthContext 의존 해제
- `services/frontend/src/pages/ResetPasswordPage/ResetPasswordPage.tsx`: submitted 분기 추가(성공 notice + /login 링크), fine-print 문구를 새 UX에 맞춰 정정
- `services/frontend/e2e/fixtures/mock-data.ts`, `services/frontend/src/api/auth.ts`(mock 분기): ORG_VERIFY_PREVIEW/REGISTRATION_LOOKUP/verifyOrgCode mock fallback을 시드 조직(`ACME-KR-SEC`) 데이터로 재정렬해 mock UX와 실환경 drift 제거

## 검증 (Playwright, localhost:5173 실서버)
### 1) Signup happy path
- `GET /api/auth/orgs/ACME-KR-SEC/verify` 200 → 조직명 "ACME Corp · Security Team", 관리자 "ACME Security Admin · admin@acme.kr", 리전 kr-seoul-1, defaultRole analyst(분석가) 렌더링
- `POST /api/auth/register` 202 → 신규 registrationId (reg-58b64490 등) + lookupToken UI 노출

### 2) Admin approve + login
- `POST /api/auth/login` `{username: "acme-admin", password: "Admin1234!"}` → 토큰 + expiresAt(24h) 발급
- `GET /api/auth/registration-requests` 로 pending 목록 확인
- `POST /api/auth/registration-requests/:id/approve` `{role: "analyst"}` → status=approved 전환

### 3) 신규 멤버 login 경로
- 브라우저에서 승인된 계정으로 `rememberMe: true` 로그인 → `/dashboard` 자동 라우팅
- `aegis:sessionExpiresAt` = 30일 후 (2026-05-20) localStorage 저장 확인
- `rememberMe: false` 로그인은 24시간 TTL 확인 (2026-04-21)

### 4) Password reset happy path (dev bridge 사용)
- `POST /api/auth/password-reset/request` → 202 `{accepted: true}`
- `GET /api/auth/dev/password-reset/latest?email=...` 로 실제 토큰 획득 (non-prod bridge)
- 브라우저에서 `/reset-password?token=...` 진입 → 새 비밀번호 입력 → submitted 성공 UI 렌더링, /login 링크 제공
- 새 비밀번호로 재로그인 성공 → /dashboard 라우팅
- 구 비밀번호는 INVALID_INPUT 로 거절 (rotation 검증)

## 검증 명령
- `npx tsc --noEmit --pretty false` : clean
- `npx vitest run` : 106 files / 594 tests pass

## Related pages
- [[wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md]]
- [[wiki/canon/handoff/s1/session-2026-04-20-auth-surface-wiring-v1.md]]
- [[wiki/canon/api/shared-models.md]]
- [[wiki/canon/handoff/s2/api-endpoints.md]]

## Test evidence

### 2026-04-20T08:31:39.535Z — passed
- Command: `npx tsc --noEmit --pretty false && npx vitest run && Playwright MCP E2E`
- Log ref: services/frontend · local verification
- tsc noEmit: clean
- vitest: Test Files 106 passed (106), Tests 594 passed (594)
- Signup happy: verify ACME-KR-SEC → register 202 → receipt UI
- Admin approve: acme-admin login → approve reg-2b5a8ffa → status=approved
- Approved user login (rememberMe=true) → /dashboard, expiresAt 30d
- Password reset via dev bridge: request 202 → latest token → confirm 200 → submitted UI → new-password login 200, old-password rejected
