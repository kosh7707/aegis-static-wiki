---
title: "S1 → S2: Signup · Organization verify · password-reset API 계약 신설 요청 (auth surface 확장)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-s1-s2-signup-organization-verify-password-reset-api-auth-surface"
last_verified: "2026-04-20"
service_tags: ["frontend", "backend", "auth"]
decision_tags: ["contract-delta", "auth-surface-extension", "signup-flow", "cross-service"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/handoff/s2/readme.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-s1-s2-signup-organization-verify-password-reset-api-auth-surface"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-20T07:47:05.390Z","note":"Completed on 2026-04-20. S2 implemented the requested lifecycle-first auth/member-management v1 slice, updated canonical contracts/docs, removed invite semantics from v1 by clarified decision, added rememberMe/password-reset/org-code registration surfaces, and posted a canonical reply WR back to S1 with integration guidance."}]
registered_at: "2026-04-20T05:53:53.594Z"
completed_at: "2026-04-20T07:47:05.390Z"
---

# S1 → S2: Signup · Organization verify · password-reset API 계약 신설 요청 (auth surface 확장)

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1 → S2: Signup · Organization verify · password-reset API 계약 신설 요청

## 배경
- 디자이너가 인수한 auth console mock(`wiki/canon/design-system/mocks/Signup.html` — aegis-static-wiki repo)과 S1이 구현한 `services/frontend/src/pages/SignupPage/**`, `LoginPage/**` (AEGIS repo) 를 감사한 결과:
  - **Login** : `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` 세 엔드포인트 그대로 호출하며 `shared-models.md §3.12` Auth surface와 **100% 정합**. 이 WR에서는 다루지 않음.
  - **Signup** : 현재 계약에 존재하지 않는 플로우(회원가입 제출 + 조직 코드 검증 + 초대/승인/이메일 인증)를 UI가 이미 완성해 둔 상태로 렌더링되고, `useSignupForm` 이 API 호출 없이 setTimeout stub으로만 작동. 즉 "UI는 실물급, 서버 계약은 0".
- 조직 코드 lookup, 가입 요청 제출, 관리자 승인, 초대 메일 등은 **S2(Core) 책임 도메인**으로 판단 — 때문에 S1이 frontend 쪽 API client를 붙이기 전에 S2가 먼저 계약 설계·확정이 필요.
- `Login` 플로우 내 `"잊으셨나요?"` 와 `rememberMe` 도 서버 계약 없는 상태로 발견되어 같은 WR에 범위에 포함 (별도 세부).

## 현재 상태 증거 (frontend 근거)

| 위치 | 현상 | 증거 |
|---|---|---|
| `src/pages/SignupPage/hooks/useSignupForm.ts:61-67` | handleSubmit 이 `setTimeout(150ms)` 후 `submitted=true` 만 호출, **API 0건** | 파일 라인 |
| `src/pages/SignupPage/hooks/useSignupForm.ts:69-96` | verifyOrg 가 `setTimeout(450ms)` 후 입력값 무관 하드코딩 응답 반환 (`승인 대기 조직 / internal / 승인 후 공개`) | 파일 라인 |
| `src/pages/SignupPage/components/SignupFormCard.tsx:86-100` | 제출 성공 UI는 "request submitted · awaiting approval" 렌더, 사용자는 실제 제출된 것처럼 인지하지만 서버는 수신하지 않음 | 파일 라인 |
| `src/pages/LoginPage/components/LoginFormCard.tsx:68` | "잊으셨나요?" 버튼 `aria-label="비밀번호 찾기 (mock)"` 명시, onClick 은 `event.preventDefault()` | 파일 라인 |
| `src/pages/LoginPage/components/LoginFormCard.tsx:89-93`, `hooks/useLoginForm.ts:13` | `rememberMe` 체크박스 로컬 state 만 존재, `api/auth.ts:login()` 호출 시 전달하지 않음 | 파일 라인 |

- QA 세션 기록: `wiki/canon/handoff/s1-qa/session-2026-04-20-mock-adherence-qa-v2.md`
- 관련 findings 문서: `wiki/canon/handoff/s1-qa/artifacts/2026-04-20/findings-v2.md` (aegis-static-wiki repo; N-2/N-4 와 별개 신규 이슈)

## S2에 요청하는 작업

### 1. 회원가입 제출 엔드포인트 신설
`POST /api/auth/register` (auth-exempt middleware — login 전 호출)

Request:
```ts
interface RegisterRequest {
  fullName: string;          // SignupFormCard 이름 필드
  email: string;             // 업무용 이메일 (placeholder 'analyst@company.com')
  password: string;          // 서버측 최소 요구(8자 / 대·소문자 / 숫자 / 특수문자) 재검증 필수
  orgCode: string;           // Organization.code (아래 §2 verify 엔드포인트 입력과 동일 문자열)
  termsAcceptedAt: string;   // ISO 8601, 클라이언트 제출 시각
  auditAcceptedAt: string;   // ISO 8601, "계정 활동 감사 기록 동의" 체크 시각
}
```

Success:
- `202 { success, data: { registrationId: string, status: "pending_admin_review", createdAt: string } }`
- 이후 상태 전이: `pending_admin_review → approved_awaiting_email → activated` (또는 `rejected`)

Error:
- `400 INVALID_INPUT` — 필드 검증, 약한 비밀번호, ToS/audit 미동의
- `409 CONFLICT` — 이미 등록된 email
- `404 NOT_FOUND` — orgCode 미등록 (또는 §2가 실패해야 함, 설계 선택)
- rate-limit 고려: IP / email 기준 (후속 §7)

### 2. 조직 코드 검증 엔드포인트 신설
`GET /api/auth/orgs/:code/verify` (auth-exempt)

Signup UI는 submit 전에 조직 코드를 조회해서 **조직명 / 관리자 / 리전 / 배정 역할 미리보기**를 사용자에게 보여준 뒤 제출한다. 이 preview가 계약에 없어 현재는 하드코딩된 fake가 나감.

Request: path param `code` (대소문자 구분 — UI가 `CASE-SENSITIVE` 힌트 표시)

Success:
```ts
interface OrgVerifyResponse {
  orgId: string;
  code: string;
  name: string;                     // "ACME Corp · Security Team"
  admin: { displayName: string; email: string };
  region: string;                   // "kr-seoul-1" 등 AEGIS region 문자열
  defaultRole: "viewer" | "analyst" | "admin";  // 승인 시 배정될 역할
  emailDomainHint?: string;         // "acme.kr" 등, UI가 email placeholder 에 반영
}
```

Error:
- `404 NOT_FOUND` — 미등록 orgCode → UI는 "not found · 관리자에게 문의"
- `429` (rate limit 후속)

### 3. 가입 요청 상태 조회 (복귀/재방문 용)
`GET /api/auth/registrations/:id` (auth-exempt, `registrationId` 보유자만 조회 가능한 opaque id)

Success:
```ts
interface RegistrationStatusResponse {
  id: string;
  email: string;
  orgCode: string;
  status: "pending_admin_review" | "approved_awaiting_email" | "activated" | "rejected";
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  inviteExpiresAt?: string;   // 초대 링크 48h expiry (UI 문구 근거)
}
```
- UI onboarding step 01~04 표시에 사용.
- `GET` 만으로도 현재 단계 추적 가능. WS 알림은 선택(§5).

### 4. 관리자 승인 큐 엔드포인트 (admin/analyst role 용)
현재 `/api/auth/users` 와 같은 계층에 추가:

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/auth/registration-requests` | 승인 대기 목록 (`?status=pending` 기본) |
| GET | `/api/auth/registration-requests/:id` | 단건 상세 |
| POST | `/api/auth/registration-requests/:id/approve` | 승인 → 초대 링크 생성/발송 트리거 |
| POST | `/api/auth/registration-requests/:id/reject` | 거절 + `reason` |

- 권한: `admin` role, 또는 org-owner 제한(구현 선택)
- 승인 결과: `RegistrationStatus` 전이 + 알림 `type: "approval_pending"` 가 **대상 관리자**에게 생성 (현 notification 체계 재활용)

### 5. 초대 링크 / 이메일 인증
`POST /api/auth/invites/:token/accept` (auth-exempt)

- mock UI 문구: "승인 후 이메일로 초대 링크가 발송됩니다. 링크 만료 48시간."
- 수락 시 `User` 레코드 activation, temporary password 교체 또는 확정.

Request:
```ts
{ password?: string; confirmPassword?: string }  // 초대 시 비밀번호 재설정 선택 시
```

Success: `200 { success, data: { token, user: User } }` — 이후 바로 로그인된 상태로 이동 가능.

Error: `410 GONE` (만료), `404` (잘못된 token), `409` (이미 사용)

### 6. shared-models / handoff 문서 갱신

- `services/shared/src/models.ts` 에 신규 타입:
  - `RegistrationRequest`, `RegistrationStatus` (enum), `Organization`, `InviteToken` 등
  - `User.status: "pending" | "active" | "disabled"` 확장(기존 필드 보존)
- `wiki/canon/api/shared-models.md` §2 (Core shared models) 와 §3.12 Auth surface 에 위 §1~§5 반영
- `wiki/canon/handoff/s2/api-endpoints.md` 의 "프로젝트 설정 / 활동 / 알림 / 인증" 섹션에 신규 엔드포인트 라인 추가
- `wiki/context/project/end-to-end-scenarios.md` 에 가입 → 관리자 승인 → 초대 수락 → 로그인 E2E 흐름 한 페이지 추가

### 7. Auth middleware exemption 및 정책

- `/api/auth/register`, `/api/auth/orgs/:code/verify`, `/api/auth/registrations/:id`, `/api/auth/invites/:token/accept`, `/api/auth/password-reset/**` 전부 **auth-exempt**
- `/api/auth/registration-requests*` 는 `admin` role guard
- rate-limit: IP 기준 5회/분 + email 기준 일일 제한 권장
- 비밀번호 정책은 **서버측 최종 검증** (8자 / 대·소문자 / 숫자 / 특수문자 — frontend `useSignupForm.ts:22-29` 의 수준)

### 8. Login surface 연관 gap (부차 범위)

Login 메인 플로우는 정합이지만 아래 2개 항목이 **UI에는 있지만 서버 계약에 없음**:

(a) **비밀번호 재설정 — `잊으셨나요?` 링크**
- `POST /api/auth/password-reset/request { email }` → `202` + 이메일 전송
- `POST /api/auth/password-reset/confirm { token, newPassword }` → `200 { success, data: { user } }` (로그인된 상태 또는 redirect to login)
- 에러: `404`(unknown email — **또는 enumeration 방지를 위해 202 무응답 정책 선택 가능**, 설계 선택)

(b) **rememberMe 토큰 수명 정책**
- `POST /api/auth/login` 요청 schema 에 `rememberMe?: boolean` 선택 필드 추가
- 서버는 `true` 시 long-lived refresh token 또는 session 만료 30d vs default 24h 분리
- shared-models `LoginResponse` 에 `expiresAt: string` 추가 권장
- frontend는 이 값을 `localStorage` 만료 관리에 활용 (현재는 영구 저장)

이 (a)(b) 는 signup 만큼 블로킹이지는 않지만 같은 auth surface 확장 맥락이라 한 cycle에 묶어 처리 권장. 분리가 유리하면 S2 판단.

## 설계 결정 포인트 (S2 권한)

1. `orgCode` 검증 실패를 `/verify` 시점에 차단할지, `/register` 시점에만 차단할지 (2중 방어 권장)
2. 관리자 승인 → 초대 메일 발송 시 실제 메일 서버/SMTP 의존성 (현 인프라 보유 여부 확인 필요)
3. `RegistrationRequest` 보관 정책 (만료/정리 주기)
4. SSO (mock UI 상단에 `SSO OPTIONAL` 뱃지 표시) 는 **이번 스코프 밖**으로 둘지 여부 — 본 WR에서는 제외
5. `User.role` enum (viewer/analyst/admin) 에 `pending` 또는 `invited` 중간 상태를 추가할지, 별도 `User.status` 필드로 직교시킬지 — 후자 권장

## Signup UI 측 대응 (S1 책임, S2 계약 확정 후)

S2가 계약을 확정하면 S1은 다음 교체를 수행:
- `src/api/auth.ts` 에 `register`, `verifyOrg`, `fetchRegistrationStatus`, `acceptInvite`, `requestPasswordReset`, `confirmPasswordReset` 함수 추가
- `useSignupForm.handleSubmit` 의 setTimeout stub → `register()` 호출로 교체 + 에러 매핑
- `verifyOrg` 하드코딩 응답 → `verifyOrg()` API 호출
- `LoginFormCard` 의 "잊으셨나요?" → `/forgot-password` 라우트/다이얼로그 연결
- `useLoginForm` 에서 `rememberMe` 를 `login()` 호출 시 전달

이 WR은 **선행조건** 성격이며, 위 S1 작업은 별도 S1 내부 세션에서 진행. S2 회신(`wr_kind=reply`) 시 계약 확정 커밋 해시 또는 문서 경로 명시 요청.

## 범위 밖 (이 WR에서 다루지 않음)
- SSO / OIDC 연동
- 2단계 인증 (TOTP 등)
- Login surface 의 기존 3개 엔드포인트 (변경 요청 없음)
- 회원가입 E2E 테스트 fixture (계약 확정 후 mock-handler 업데이트는 S1 책임)
- Signup 화면 자체의 디자인/카피 변경 (별도 S1-QA v2 WR에서 이미 처리 중)

## 기대 완료 동작

1. S2 가 위 §1~§7 (필수) 계약 초안을 제안 또는 ratify → `shared-models.md` / `handoff/s2/api-endpoints.md` 갱신 PR/커밋
2. 실제 엔드포인트 구현 + `/api/auth/*` auth-exempt 설정 반영
3. §8 (a/b) 는 동일 cycle 포함 또는 별도 S2 follow-up 결정 회신
4. 회신은 `wr_kind=reply` 로 본 WR 에 돌려주면 S1 가 수신 확인 후 내부 작업 착수
5. 설계 결정 포인트(§"설계 결정 포인트") 항목은 각 S2 선택을 회신에 명시

## 연관 WR / 문서
- 이전 S1-QA → S1 WR: `wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds.md`
- S1-QA v2 deep audit WR: `wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card.md`
- S2 인수인계: `wiki/canon/handoff/s2/readme.md`
- 기존 auth surface 계약: `wiki/canon/api/shared-models.md` §3.12

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
