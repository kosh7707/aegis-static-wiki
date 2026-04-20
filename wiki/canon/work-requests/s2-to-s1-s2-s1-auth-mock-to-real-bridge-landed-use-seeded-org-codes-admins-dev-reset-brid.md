---
title: "S2 → S1: auth mock-to-real bridge landed — use seeded org codes/admins + dev reset bridge for happy-path QA"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid"
last_verified: "2026-04-20"
service_tags: ["s2", "s1", "auth", "backend", "frontend", "qa"]
decision_tags: ["auth-mock-bridge", "org-code-registration", "password-reset", "non-production-bridge", "qa"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/specs/backend.md", "wiki/canon/roadmap/s2-roadmap.md", "wiki/canon/work-requests/s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-20T08:24:22.141Z","note":"S1 수신 확인. 시드 조직(ACME-KR-SEC 등) + dev password-reset bridge를 사용해 signup/approve/password-reset happy path를 Playwright로 종단 QA 진행. 상세 결과는 handoff/s1 세션 아티팩트로 기록."}]
registered_at: "2026-04-20T08:22:29.124Z"
completed_at: "2026-04-20T08:24:22.141Z"
---

# S2 → S1: auth mock-to-real bridge landed — use seeded org codes/admins + dev reset bridge for happy-path QA

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 landed the **mock-to-real auth bridge** that S1 was blocked on.

You can now run real signup / approval / password-reset happy paths against the backend without waiting for SMTP or ad-hoc manual org seeding.

## What changed on S2
### 1. Seeded org codes now exist for mock/E2E
Backend startup now guarantees these **non-production** org fixtures:

| Org code | Org admin username | Org admin email | Default password |
|---|---|---|---|
| `ACME-KR-SEC` | `acme-admin` | `admin@acme.kr` | `Admin1234!` |
| `HYUNDAI-AVSEC` | `hyundai-admin` | `av-sec@hmc.co.kr` | `Admin1234!` |
| `LG-EV-SECOPS` | `lges-admin` | `secops@lges.com` | `Admin1234!` |

Notes:
- These are controlled by `AEGIS_AUTH_DEV_FIXTURES=true`.
- Current local backend `.env` already enables the bridge.
- This is intended for **non-production implementation + QA only**.

### 2. Same-org admin approval is immediately testable
Use the org-specific admin above to exercise:
- `GET /api/auth/registration-requests`
- `GET /api/auth/registration-requests/:id`
- `POST /api/auth/registration-requests/:id/approve`
- `POST /api/auth/registration-requests/:id/reject`

Prefer the org-specific admins above over the legacy platform admin for frontend QA because the org-specific path matches the real same-org authorization model.

### 3. Password-reset mock bridge exists now
New **non-production** helper route:
- `GET /api/auth/dev/password-reset/latest?email=<user-email>`

Behavior:
- returns `{ success: true, data: { available: true, delivery } }` when an active reset token exists
- returns `{ success: true, data: { available: false } }` when none exists
- `delivery.token` is the raw reset token for frontend mock/E2E continuation

This route is backed by SQLite `dev_password_reset_deliveries` and is controlled by `AEGIS_AUTH_DEV_PASSWORD_RESET_BRIDGE=true`.

## Recommended S1 happy-path QA flow
### A. Signup / verify / registration lookup
1. Verify org code:
   - `GET /api/auth/orgs/:code/verify`
2. Submit registration:
   - `POST /api/auth/register`
3. Persist `lookupToken` from the `202` response
4. Poll / resume with:
   - `GET /api/auth/registrations/lookup/:lookupToken`

Suggested QA sample:
```ts
{
  fullName: "QA Member",
  email: "qa-member@acme.kr",
  password: "Passw0rd!",
  orgCode: "ACME-KR-SEC",
  termsAcceptedAt: new Date().toISOString(),
  auditAcceptedAt: new Date().toISOString(),
}
```

### B. Approval
1. Login as org admin:
   - `POST /api/auth/login`
   - `{ username: "acme-admin", password: "Admin1234!" }`
2. Find the pending request
3. Approve with role assignment:
   - `POST /api/auth/registration-requests/:id/approve`
   - `{ role: "analyst" }`
4. Confirm the newly approved member can login immediately

### C. Password reset
1. Request reset:
   - `POST /api/auth/password-reset/request`
   - `{ email: "qa-member@acme.kr" }`
2. Fetch latest dev token:
   - `GET /api/auth/dev/password-reset/latest?email=qa-member@acme.kr`
3. Confirm reset:
   - `POST /api/auth/password-reset/confirm`
   - `{ token, newPassword }`
4. Confirm old password fails and new password succeeds

## Important S1 implementation notes
- `Invite` remains out of scope for v1.
- `username` field in login still carries the login identifier; email-in-username is valid for newly registered users.
- `rememberMe` remains part of login contract.
- `/api/auth/dev/password-reset/latest` is **non-production only**. Do not build production UX that depends on it.
- If S1 keeps mock fixtures, align them to the seeded real org codes above so UI mock and backend happy path no longer drift.

## Canonical docs to follow
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/roadmap/s2-roadmap.md`

## Verification on S2 side
- shared/backend typecheck passed
- backend build passed
- backend vitest: **27 files / 479 tests passed**

## Requested action from S1
Please use the seeded org codes/admins + dev reset bridge above to:
1. complete real happy-path frontend wiring validation,
2. run signup / approval / password-reset QA end-to-end,
3. send back only narrow follow-up mismatches if any specific payload/UI seam still disagrees with the backend.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
