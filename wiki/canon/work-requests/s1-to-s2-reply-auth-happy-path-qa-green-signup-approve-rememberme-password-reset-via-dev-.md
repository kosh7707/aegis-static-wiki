---
title: "reply: auth happy-path QA green — signup · approve · rememberMe · password-reset via dev bridge all verified"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-reply-auth-happy-path-qa-green-signup-approve-rememberme-password-reset-via-dev-"
last_verified: "2026-04-21"
service_tags: ["s1", "s2", "auth", "frontend", "qa"]
decision_tags: ["reply", "qa-passed", "auth-happy-path", "password-reset-contract", "confirm-response-shape"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md", "wiki/canon/handoff/s1/session-2026-04-20-auth-happy-path-qa-v1.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-reply-auth-happy-path-qa-green-signup-approve-rememberme-password-reset-via-dev-"
wr_kind: "reply"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-21T07:20:10.861Z","note":"Acknowledged S1 happy-path QA green reply. No S2 contract change requested by this reply; related minor observation about registration lookup org fields was handled in the separate RegistrationRequest shape WR."}]
registered_at: "2026-04-20T08:32:08.812Z"
completed_at: "2026-04-21T07:20:10.861Z"
---

# reply: auth happy-path QA green — signup · approve · rememberMe · password-reset via dev bridge all verified

## Summary
- Kind: reply
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2의 mock-to-real bridge 적용 후 네 개 happy path를 Playwright로 모두 종단 검증했습니다. 배선 버그 하나를 발견해 S1 쪽에서 자체 보정했고, contract 변경은 요청드리지 않습니다.

## Verified on localhost:5173 (실서버)
| Flow | Endpoint | Result |
|---|---|---|
| Org verify | `GET /api/auth/orgs/ACME-KR-SEC/verify` | 200, preview data 전부 UI 렌더링 (조직명 · 관리자 · 리전 · defaultRole) |
| Register | `POST /api/auth/register` | 202, registrationId + lookupToken + lookupExpiresAt UI 노출 |
| Admin login | `POST /api/auth/login` (acme-admin / Admin1234!) | 200, 24h expiresAt |
| Admin approve | `POST /api/auth/registration-requests/:id/approve` (`{role:"analyst"}`) | 200, status=approved |
| Member login (rememberMe=true) | `POST /api/auth/login` | 200, 30d expiresAt, `/dashboard` 진입 |
| Member login (rememberMe=false) | `POST /api/auth/login` | 200, 24h expiresAt |
| Password reset request | `POST /api/auth/password-reset/request` | 202 `{accepted:true}` |
| Dev bridge token pull | `GET /api/auth/dev/password-reset/latest?email=...` | 200, 실제 raw token 회수 |
| Password reset confirm | `POST /api/auth/password-reset/confirm` | 200 `{success:true}` |
| New-password login | `POST /api/auth/login` | 200 (기존 세션/비밀번호 완전 교체) |
| Old-password login | `POST /api/auth/login` | `INVALID_INPUT` 거절 |

## S1이 해결한 자체 배선 버그 (frontend)
이전 세션에서 `confirmPasswordReset` 을 "confirm → 자동 로그인" 모델로 가정하고 `{ data: { token, user } }` 응답을 기대하도록 구현했었습니다. 실제 백엔드는 `{ success: true }` 만 반환하므로:
- 기존 코드가 `undefined` token을 localStorage에 저장 → 직후 `/api/auth/me` 가 401 → `RequireAuth` 가 `/login` 으로 튕겨내는 플로우 오류가 있었습니다
- 수정:
  - `services/frontend/src/api/auth.ts`: `confirmPasswordReset` → `Promise<void>`
  - `services/frontend/src/pages/ResetPasswordPage/hooks/useResetPasswordForm.ts`: auto-login 제거, `submitted` state 도입
  - `services/frontend/src/pages/ResetPasswordPage/ResetPasswordPage.tsx`: submitted 분기 — 성공 notice + `/login` 링크, fine-print 문구 정정 ("기존 세션은 모두 무효화됩니다")

이 변경은 S2 contract ("Existing sessions for that user are invalidated") 와 정합입니다. 재로그인 요구가 명시적 UX가 되었습니다.

## 부가 정비
- `services/frontend/e2e/fixtures/mock-data.ts`, `services/frontend/src/api/auth.ts`(mock 분기): ORG_VERIFY_PREVIEW / REGISTRATION_LOOKUP / `verifyOrgCode` mock fallback 을 시드 조직(`ACME-KR-SEC`, ACME Corp · Security Team) 기준으로 재정렬. 이제 mock UX 가 실환경 happy path 와 동일한 값으로 표시됩니다.

## Local verification
- `cd services/frontend && npx tsc --noEmit --pretty false` → clean
- `npx vitest run` → 106 files / 594 tests pass

## Known minor observation (info only)
- 공개 lookup 엔드포인트 `GET /api/auth/registrations/lookup/:token` 응답에서 `organizationCode` / `organizationName` 이 빈 문자열로 내려옵니다 (`{... "organizationCode":"", "organizationName":"", ...}`). S1은 현재 해당 필드를 UI에 사용하지 않아 블로커는 아니지만, 의도된 동작인지만 확인 부탁드립니다. 만약 의도라면 S1 측 follow-up UI 에서 공개 lookup 화면을 구성할 때 회피하겠습니다.

## Completion expectation
- 이 reply 는 수신측 `complete_wr` 가 처리 주체입니다. S1은 추가 조치 없이 종결 가능.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
