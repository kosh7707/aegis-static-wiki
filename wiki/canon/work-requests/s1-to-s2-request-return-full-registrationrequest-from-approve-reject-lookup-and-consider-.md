---
title: "request: return full RegistrationRequest from approve/reject/lookup (and consider populated org fields on public lookup)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-request-return-full-registrationrequest-from-approve-reject-lookup-and-consider-"
last_verified: "2026-04-21"
service_tags: ["s1", "s2", "auth", "backend", "frontend"]
decision_tags: ["request", "contract-follow-up", "registration-request-shape", "optimistic-update"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md", "wiki/canon/work-requests/s1-to-s2-reply-auth-happy-path-qa-green-signup-approve-rememberme-password-reset-via-dev-.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-request-return-full-registrationrequest-from-approve-reject-lookup-and-consider-"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-21T07:20:06.104Z","note":"Implemented response shape normalization. approve/reject/public lookup now return full RegistrationRequest with populated organizationCode/organizationName. Reply WR sent: s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-."}]
registered_at: "2026-04-20T10:20:07.447Z"
completed_at: "2026-04-21T07:20:06.104Z"
---

# request: return full RegistrationRequest from approve/reject/lookup (and consider populated org fields on public lookup)

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S1이 admin registration review UI (`/admin/registrations`) 를 방금 올렸습니다. 승인/반려 행을 in-place 업데이트 하다가 backend 응답이 full `RegistrationRequest` 가 아니어서 "Invalid Date" / 필드 누락이 관찰되었고, 현재는 action 후 `refresh()` 로 전체 목록을 재조회해 회피 중입니다. 옵티미스틱 업데이트로 UX를 가볍게 만들려면 S2 응답 shape 정규화가 필요합니다.

## Observed shape vs expected
### 1) `POST /api/auth/registration-requests/:id/approve`
관찰 (오늘, localhost):
```json
{
  "success": true,
  "data": {
    "id": "reg-58b64490",
    "organizationCode": "",
    "organizationName": "",
    "email": "qa-member-...@acme.kr",
    "status": "approved"
  }
}
```
기대 (공유 DTO `RegistrationRequest` 전체):
- 누락되어 S1이 필요로 함: `fullName`, `organizationId`, `assignedRole`, `approvedAt`, `createdAt`, `lookupExpiresAt`
- 추가로 `organizationCode` / `organizationName` 이 빈 문자열이 아니라 실제 값이어야 UI 재렌더링이 일관됩니다

### 2) `POST /api/auth/registration-requests/:id/reject`
관찰:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "organizationCode": "",
    "organizationName": "",
    "email": "...",
    "status": "rejected"
  }
}
```
기대: `fullName`, `organizationId`, `decisionReason`, `rejectedAt`, `createdAt`, `lookupExpiresAt`, 채워진 `organizationCode`/`organizationName` 포함 → UI 가 반려 사유/시각을 즉시 렌더링할 수 있습니다.

### 3) `GET /api/auth/registrations/lookup/:lookupToken` (공개)
관찰:
```json
{
  "success": true,
  "data": {
    "id": "reg-58b64490",
    "organizationCode": "",
    "organizationName": "",
    "email": "qa-member-...@acme.kr",
    "status": "pending_admin_review"
  }
}
```
이건 공개 엔드포인트라 의도가 섞여 있을 수 있어 세 가지 시나리오 중 하나를 골라 주시면 됩니다:
- (a) `organizationCode` / `organizationName` 을 채워 반환하고, S1이 공개 lookup UI에서 "요청하신 조직: ACME Corp · Security Team · ACME-KR-SEC" 를 표시
- (b) 정보 비공개 의도라면 문서에 명시 + `organizationCode:""` 를 의도된 sentinel 로 유지. 이 경우 S1은 해당 필드를 렌더하지 않는 UI 로 유지합니다
- (c) 필드를 아예 optional 로 빼버리고 공개 lookup 용 축소 DTO 를 정의 (`RegistrationLookupSummary` 같은)

권장: (a) — 가입 신청자가 상태 폴링 시 자신이 어떤 조직에 요청했는지 확인할 수 있는 것이 UX 상 유리.

## Why S1 needs full shape on approve/reject
- 지금: action 후 `refresh()` 호출 → 목록 전체 재조회 → 네트워크 왕복 하나 추가
- full shape 반환 시: S1이 반환된 row 로 setState 해서 옵티미스틱 업데이트 가능 → 응답 즉시 UI 갱신, 대량 리스트에서도 저렴
- `assignedRole` 과 `approvedAt` / `rejectedAt` / `decisionReason` 은 admin UI 에서 감사 목적으로 즉시 보여줘야 하는 값이라 누락되면 stale 렌더 발생

## Suggested contract (정규화)
`POST /approve` / `POST /reject` 양쪽 모두 아래와 같이 반환:
```ts
{
  success: true,
  data: RegistrationRequest   // shared/src/models.ts 에 정의된 전체 shape
}
```
즉 현재 `RegistrationLookupResponse.data` 와 완전히 동일한 형태 (그쪽은 이미 full shape 정의되어 있음).

## Scope boundary
- 이 요청은 **response shape 정규화만** 다룹니다. endpoint/URL/권한 의미는 변경 없음.
- 요청 바디 (`{role}`, `{reason}`) 는 기존 그대로.

## What S1 will do after S2 lands this
1. `approveRegistrationRequest` / `rejectRegistrationRequest` 의 반환값으로 in-place setState 로 전환
2. action 후 `refresh()` 호출 제거 → 네트워크 왕복 1 감축
3. lookup 공개 필드 결정(a/b/c) 따라 lookup UI 연결 (현재 S1에는 공개 lookup 화면 없음 — 이 WR 이후 필요 시 별도 WR 로 착수)

## Acceptance check (S2 landing 시 S1 검증 방법)
```
curl -sS -X POST -H "Authorization: Bearer $ADMIN" -H "Content-Type: application/json" \
  -d '{"role":"analyst"}' \
  "http://localhost:5173/api/auth/registration-requests/<REG_ID>/approve"
```
응답 `data` 에 `fullName`, `organizationId`, `organizationCode`(non-empty), `organizationName`(non-empty), `assignedRole`, `approvedAt`, `createdAt`, `lookupExpiresAt` 가 모두 포함되는지.

## Completion expectation
- 수신 측(S2)에서 `complete_wr` 로 종결.
- 구현 끝나면 narrow reply WR 으로 "normalized" 를 알려주세요. S1이 UI optimistic update 전환 커밋을 올리고 해당 reply 를 complete_wr 로 닫겠습니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
