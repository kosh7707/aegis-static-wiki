---
title: "Canonicalize SdkProfile typed export from @aegis/shared so S1 can drop unknown[] defensive narrowing"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-canonicalize-sdkprofile-typed-export-from-aegis-shared-so-s1-can-drop-unknown-de"
last_verified: "2026-05-08"
service_tags: ["s1", "s2"]
decision_tags: ["sdk-profile-canonicalization", "shared-types-export", "frontend-narrowing"]
related_pages: ["wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s1/s2-api-coverage-audit-20260508.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-canonicalize-sdkprofile-typed-export-from-aegis-shared-so-s1-can-drop-unknown-de"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-08T07:09:15.841Z","note":"S2 completed. SdkProfile remains exported from @aegis/shared via models/index; @aegis/shared now exports SdkProfileListResponse and SdkProfileResponse; SDK profile endpoint envelopes are documented and contract tests assert current profile/defaults shape. Critic verification PASS."}]
registered_at: "2026-05-08T06:43:29.141Z"
completed_at: "2026-05-08T07:09:15.841Z"
---

# Canonicalize SdkProfile typed export from @aegis/shared so S1 can drop unknown[] defensive narrowing

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 배경

S2 API contract (`wiki/canon/handoff/s2/api-endpoints.md`) 의 `GET /api/sdk-profiles` / `GET /api/sdk-profiles/:id` endpoint은 응답 shape이 canonical doc에 명세되어 있지 않다. S1은 2026-05-08 cycle 에서 missing endpoint 16개를 모두 wire-up 했지만, SdkProfile 타입을 `@aegis/shared` 에서 export 받지 못해 `Promise<unknown[]>` / `Promise<unknown>` defensive narrowing으로 처리했다.

## 현재 S1 상태

`services/frontend/src/common/api/sdk.ts:fetchSdkProfiles` → returns `Promise<unknown[]>` with TODO comment.
`services/frontend/src/common/api/sdk.ts:fetchSdkProfile` → returns `Promise<unknown>`.
`services/frontend/src/pages/ProjectSettingsPage/components/SdkProfilesPanel/SdkProfilesPanel.tsx` → defensive narrowing via `getStringField(item, "id")` + `getStringField(item, "name")` 만 시도, 다른 fields는 silent drop. UI는 `정보 없음` placeholder fallback.

## 요청

다음 사항을 확정해 `@aegis/shared` 에 typed export로 노출해주세요:

1. `SdkProfile` interface 정식 export — at minimum `id: string`, `name: string`, plus 백엔드가 노출하는 모든 메타데이터 (e.g., `description?`, `defaults?`, `version?`, `archCompat?`, …).
2. `GET /api/sdk-profiles` response envelope 명시 — 현재 추측: `{success: boolean; data: SdkProfile[]}`. 확정 필요.
3. `GET /api/sdk-profiles/:id` response envelope 명시 — 현재 추측: `{success: boolean; data: SdkProfile}`. 확정 필요.
4. `wiki/canon/handoff/s2/api-endpoints.md` 의 SDK 프로파일 섹션에 응답 shape 추가.
5. (선택) `wiki/canon/api/shared-models.md` 에 `SdkProfile` type definition 캐노니컬 명시.

## S1 후속

S2 reply 후 frontend cycle 에서 `unknown` → `SdkProfile[]` / `SdkProfile` narrow + defensive `getStringField` helper 제거 + `SdkProfilesPanel` 강화된 UI rendering (모든 필드 노출).

## Acceptance criteria

- `@aegis/shared` 가 `SdkProfile` 정식 export
- canonical doc에 응답 shape 명시
- S1 가 import 만으로 narrow 가능 상태

## 관련 파일

- `services/frontend/src/common/api/sdk.ts` (S1)
- `services/frontend/src/pages/ProjectSettingsPage/components/SdkProfilesPanel/SdkProfilesPanel.tsx` (S1)
- `services/shared/src/index.ts` 또는 동등 (S2)
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/api/shared-models.md`

## 우선순위

P1 — UX 시나리오 직결, defensive narrowing은 임시 조치.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
