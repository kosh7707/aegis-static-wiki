---
title: "reply: auth/member-management v1 landed on 2026-04-20 — adopt org-code registration + no-invite lifecycle"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration"
last_verified: "2026-04-20"
service_tags: ["s2", "s1", "auth", "backend", "frontend"]
decision_tags: ["reply", "auth-surface-extension", "no-invite-v1", "remember-me", "password-reset", "org-code-registration"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/roadmap/s2-roadmap.md", "wiki/canon/work-requests/s1-to-s2-s1-s2-signup-organization-verify-password-reset-api-auth-surface.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration"
wr_kind: "reply"
status: "open"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-20T07:47:05.363Z"
---

# reply: auth/member-management v1 landed on 2026-04-20 — adopt org-code registration + no-invite lifecycle

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# reply: auth/member-management v1 landed on 2026-04-20 — adopt org-code registration + no-invite lifecycle

## Summary
S2 completed the requested auth/member-management v1 slice on **2026-04-20** and synchronized the canonical backend-owned docs.

This reply is the current source of truth for what S1 should wire next.

## What landed on S2
### Lifecycle / product semantics
- This slice is **lifecycle-first**, not a full RBAC/ACL redesign.
- **Organization creation / first org-admin bootstrap is out of scope** for the user-facing product flow and enters S2 only through seed/migration/import.
- Canonical member flow is now:
  1. org code verify
  2. registration request submission
  3. org-admin role assignment + approve/reject
  4. approved account becomes immediately login-capable
- **`Invite` is removed from v1.**
- Password is collected **at registration time**.

### Mounted auth surface
#### Public routes
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/orgs/:code/verify`
- `POST /api/auth/register`
- `GET /api/auth/registrations/lookup/:lookupToken`
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/confirm`

#### Authenticated route
- `GET /api/auth/me`

#### Admin-only routes
- `GET /api/auth/users`
- `GET /api/auth/registration-requests`
- `GET /api/auth/registration-requests/:id`
- `POST /api/auth/registration-requests/:id/approve`
- `POST /api/auth/registration-requests/:id/reject`

### Login / token semantics
- `POST /api/auth/login` request now supports `rememberMe?: boolean`.
- Response now includes `expiresAt`.
- The request field name remains `username` for brownfield compatibility, but S2 now interprets it as a **login identifier**:
  1. exact legacy `username`
  2. normalized `email`
- Opaque session transport remains in use.
- Session TTLs:
  - default: `24h`
  - remember-me: `30d`

### Registration semantics
#### `GET /api/auth/orgs/:code/verify`
Success preview shape:
```ts
{
  success: true,
  data: {
    orgId: string,
    code: string,
    name: string,
    admin: { displayName: string, email: string },
    region: string,
    defaultRole: "viewer" | "analyst" | "admin",
    emailDomainHint?: string,
  }
}
```

#### `POST /api/auth/register`
Request:
```ts
{
  fullName: string,
  email: string,
  password: string,
  orgCode: string,
  termsAcceptedAt: string,
  auditAcceptedAt: string,
}
```
Success (`202`):
```ts
{
  success: true,
  data: {
    registrationId: string,
    lookupToken: string,
    lookupExpiresAt: string,
    status: "pending_admin_review",
    createdAt: string,
  }
}
```

#### `GET /api/auth/registrations/lookup/:lookupToken`
- Public status lookup is now **lookup-token based**.
- Raw internal ids are **not** accepted as public lookup credentials.

### Password reset semantics
#### `POST /api/auth/password-reset/request`
Request:
```ts
{ email: string }
```
Response is intentionally non-enumerating:
```ts
{ success: true, data: { accepted: true } }
```
HTTP status: `202`

#### `POST /api/auth/password-reset/confirm`
Request:
```ts
{ token: string, newPassword: string }
```
- Successful reset rotates the password.
- Existing sessions for that user are invalidated.
- Issuing a new reset token revokes older active reset tokens.

### Security / hardening that also landed before this reply
- Durable auth throttling via SQLite `auth_rate_limit_events`
- Hashed-at-rest session storage in `sessions`
- Stored session hash cannot be replayed as a bearer token
- Contract coverage for login `429 RATE_LIMITED`
- `npm audit --omit=dev --audit-level=high` => `0 vulnerabilities`

## Canonical docs updated on S2 side
Use these docs, not older assumptions:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/roadmap/s2-roadmap.md`

## What S1 should change now
### 1. Signup flow
Replace the current stubbed signup behavior with:
- org preview → `GET /api/auth/orgs/:code/verify`
- registration submit → `POST /api/auth/register`
- status polling / resume → `GET /api/auth/registrations/lookup/:lookupToken`

### 2. Remove invite assumptions
- Remove any frontend expectation that approval triggers invite delivery, invite acceptance, or a post-approval activation link.
- The approved lifecycle is now **no-invite v1**.

### 3. Treat approval as the activation edge
- After S1 detects approved registration status, direct the user to the ordinary login flow.
- Because password was already collected at registration, there is no separate password-set step in this slice.

### 4. Login request / response
- Continue sending `username` + `password`, but S1 may now place the email value into the `username` field for newly registered users.
- Wire `rememberMe` through to `POST /api/auth/login`.
- Use `expiresAt` from login response for session-expiry-aware client behavior.

### 5. Password reset UX
- The old mock-only “forgot password” affordance can now be wired to:
  - `POST /api/auth/password-reset/request`
  - `POST /api/auth/password-reset/confirm`

## Notes for S1 integration
- `/api/auth/users` is no longer public. Do not assume anonymous availability.
- Admin review endpoints are not for ordinary signup users; they are for authenticated admin UX only.
- Same-org review semantics are enforced server-side. Transitional platform-admin bypass exists only for pre-provisioned legacy/system admins with `organizationId = null`.

## Verification snapshot on S2 side
- `cd services/shared && npx tsc && cd ../backend && npx tsc --noEmit --pretty false && npx vitest run && npm audit --omit=dev --audit-level=high`
- Result on **2026-04-20**:
  - `26` test files passed
  - `474` tests passed
  - `0` prod vulnerabilities
- Architect verification: approved
- Security verification: approved

## Completion expectation for S1
S1 can treat this reply as the backend contract handoff and begin wiring the real frontend flows against the canonical docs above.

If S1 finds any remaining consumer mismatch after wiring, reply with a narrower follow-up WR referencing the exact route/payload/UI mismatch rather than reopening invite semantics or org-bootstrap scope.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
