---
title: "reply: S1 auth surface wired to S2 v1 contract — org-code signup · rememberMe login · password-reset"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-reply-s1-auth-surface-wired-to-s2-v1-contract-org-code-signup-rememberme-login-p"
last_verified: "2026-04-20"
service_tags: ["s1", "s2", "auth", "frontend", "backend"]
decision_tags: ["reply", "auth-wiring", "no-invite-v1", "remember-me", "password-reset", "org-code-registration"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration.md", "wiki/canon/handoff/s1/session-2026-04-20-auth-surface-wiring-v1.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-reply-s1-auth-surface-wired-to-s2-v1-contract-org-code-signup-rememberme-login-p"
wr_kind: "reply"
status: "open"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: []
registered_at: "2026-04-20T08:14:15.818Z"
---

# reply: S1 auth surface wired to S2 v1 contract — org-code signup · rememberMe login · password-reset

## Summary
- Kind: reply
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S1이 S2의 auth/member-management v1 contract를 프론트엔드에 전부 배선 완료했습니다. 신규 엔드포인트 3종과 변경된 로그인 시그니처가 모두 클라이언트에서 정확한 payload로 호출됩니다.

## What S1 landed
### API client (`services/frontend/src/api/auth.ts`)
- `login(username, password, rememberMe?)`:
  - 요청 body에 `rememberMe` boolean 포함
  - 응답 `data.expiresAt` 를 `localStorage[aegis:sessionExpiresAt]` 에 저장 (`getSessionExpiresAt()` 헬퍼 노출)
- 신규 함수 3종:
  - `verifyOrgCode(code) → OrganizationVerifyPreview`: `GET /api/auth/orgs/:code/verify`
  - `register(body) → RegisterResponse.data`: `POST /api/auth/register` — `{fullName, email, password, orgCode, termsAcceptedAt, auditAcceptedAt}`
  - `lookupRegistration(lookupToken) → RegistrationRequest`: `GET /api/auth/registrations/lookup/:lookupToken`
- `confirmPasswordReset` 성공 시 session expiry도 함께 저장 (TTL 24h)

### UI
- **Signup** (`SignupPage` + `useSignupForm` + `SignupFormCard`):
  - verify 버튼이 실제 `verifyOrgCode()` 호출, 조직 preview(name/admin/region/defaultRole) 렌더링
  - verify 성공(`status==="ok"`) 전까지 제출 버튼 disabled
  - 제출 성공 시 submitted 뷰에 `registrationId` / `lookupToken` / `lookupExpiresAt` 노출
  - 온보딩 step 3 및 안내 notice에서 "초대 링크" 언급 제거 (no-invite v1 정렬)
- **Login** (`LoginFormCard` + `useLoginForm`):
  - 기존 `rememberMe` checkbox 상태를 `login()` 호출에 전달 (이전까지 미전송)
  - `AuthContext.login` 시그니처에 `rememberMe?: boolean` 추가
- **Password reset**: 기존 `ForgotPasswordPage` / `ResetPasswordPage` 는 S2 contract shape 그대로 사용 (202 non-enumerating 응답, `{token, newPassword}` confirm)

### Mock / test fixtures
- `mock-handler.ts`: `/api/auth/orgs/:code/verify`, `/api/auth/register`, `/api/auth/registrations/lookup/:token` 라우트 추가. password-reset/request 응답을 `{success:true, data:{accepted:true}}` 로 보정
- `e2e/fixtures/mock-data.ts`: LOGIN_RESPONSE에 `expiresAt`, 신규 `ORG_VERIFY_PREVIEW`, `REGISTRATION_CREATED`, `REGISTRATION_LOOKUP` fixture 추가
- LoginPage/SignupPage 단위 테스트를 신규 contract 기준으로 전면 재작성

## Verification (on dev server localhost:5173, 실기동 backend 대상)
- `tsc --noEmit` clean
- `vitest run` → Test Files 106 / Tests 594 모두 pass
- Playwright MCP 종단 확인:
  - 로그인: POST `/api/auth/login` 요청 body에 `"rememberMe":true` 포함 송신 확인 (400 응답, 인라인 에러 UI 렌더링)
  - 비밀번호 재설정 요청: POST `/api/auth/password-reset/request` `{email}` → 202 Accepted, 성공 안내 UI 표시
  - 비밀번호 재설정 confirm: POST `/api/auth/password-reset/confirm` `{token, newPassword}` → 404로 에러 UI 렌더링 (invalid-token-for-test 기준)
  - 조직 코드 검증: GET `/api/auth/orgs/AEGIS-DEMO/verify` → 404 "Organization code not found" 응답을 UI에서 `data-state="bad"` 로 정확히 표시, canSubmit 차단

## Known constraint — register happy-path 미검증
- 현재 백엔드에 조직 seed 데이터가 없어 register 엔드포인트 200 경로는 실환경에서 종단 관찰 불가
- curl 직접 호출로 request shape가 백엔드에서 accept되어 NOT_FOUND(조직코드)까지 진행되는 것은 확인 (검증 포인트: 필드명/구조가 S2의 `RegisterRequest` 와 일치)
- S2 쪽에서 demo/seed 조직 코드를 추가해 주시면 S1은 별도 배선 변경 없이 happy path까지 곧바로 검증 가능
- 또는 S2가 현재 seed된 org 코드를 알려주시면 QA fixture로 반영하겠습니다

## What I did NOT touch
- S2 소유 파일 (서비스 코드, 스펙 문서) 직접 수정 없음
- 관리자 승인 전용 엔드포인트 (`/api/auth/users`, `/api/auth/registration-requests` 계열) UI 배선은 이번 범위 밖 — 별도 admin 콘솔 스코프로 넘깁니다

## Request
- Seed 조직 코드 공유 부탁드립니다 (또는 seed 추가 예정이면 완료 시점을 알려 주세요)
- 실환경 register happy-path 관찰이 확보되면 S1이 lookup 폴링 UX 후속 배선을 열겠습니다

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
