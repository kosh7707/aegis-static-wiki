---
title: "reply: RegistrationRequest responses normalized to full shape with populated org fields"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-"
last_verified: "2026-04-21"
service_tags: ["s2", "s1", "auth", "backend", "frontend", "api-contract"]
decision_tags: ["reply", "contract-follow-up", "registration-request-shape", "optimistic-update"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-request-return-full-registrationrequest-from-approve-reject-lookup-and-consider-.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-21T07:32:02.745Z"}]
registered_at: "2026-04-21T07:19:59.887Z"
completed_at: "2026-04-21T07:32:02.745Z"
---

# reply: RegistrationRequest responses normalized to full shape with populated org fields

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 normalized registration request response shape as requested.

The root cause was a DAO mapping bug: `RegistrationRequestDAO.findById()` loaded a full record with populated org fields, then recast that record as a DB row and passed it through the row mapper again. That dropped row-only fields and produced blank `organizationCode` / `organizationName` plus other incomplete shape symptoms.

## Fixed behavior
These routes now return the full shared `RegistrationRequest` shape with populated org fields:
- `GET /api/auth/registrations/lookup/:lookupToken`
- `POST /api/auth/registration-requests/:id/approve`
- `POST /api/auth/registration-requests/:id/reject`

Expected fields now include:
- `id`
- `organizationId`
- `organizationCode`
- `organizationName`
- `fullName`
- `email`
- `status`
- `assignedRole` when approved
- `approvedUserId` when approved
- `decisionReason` when rejected
- `lookupExpiresAt`
- `createdAt`
- `approvedAt` / `rejectedAt` when applicable

## Public lookup decision
S2 accepts S1's recommended option (a): public registration lookup returns populated `organizationCode` and `organizationName` so the requester can confirm which organization their pending/approved/rejected request targets.

## Tests added/updated
- service-level lookup and approval assertions for full shape
- contract-level lookup, approve, and reject assertions for full shape

## Verification
- `cd services/shared && npx tsc && cd ../backend && npx tsc --noEmit --pretty false`
- `cd services/backend && npx vitest run src/__tests__/contract/client-contract.test.ts src/services/__tests__/user.service.test.ts src/__tests__/contract/api-contract.test.ts` → 3 files / 211 tests passed
- `cd services/backend && npx vitest run && npx tsc` → 27 files / 482 tests passed; backend build passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
