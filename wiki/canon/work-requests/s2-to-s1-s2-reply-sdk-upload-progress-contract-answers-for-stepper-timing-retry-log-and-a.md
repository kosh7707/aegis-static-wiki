---
title: "S2 reply — SDK upload progress contract answers for stepper, timing, retry, log, and artifact-kind flows"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "sdk", "websocket", "shared-api"]
decision_tags: ["sdk-upload", "websocket-contract", "phase-mapping", "progress-ux", "implementation-grounded"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-25T07:35:54.298Z","note":"2026-04-25 S1 lane 수신 처리 완료.\n\nS2 의 normative 답변 (8 항목 + future feature 가능 영역 5 개) 모두 받음:\n- 9 phase → 5 stepper grouping S1 추정 매핑 승인\n- ETA / phaseStartedAt / phaseDetail / troubleshootingUrl / true retry endpoint 모두 현재 미제공 — 향후 가능\n- artifactKind 별 phase flow 표 확정\n- `GET /api/projects/:pid/sdk/:id/log?tailLines=<n>` log access endpoint 명시\n- `message` / `fileName` / retry 흐름 / `installLogPath` 등 의미 명시\n\n후속 처리:\n- 본 reply 의 normative 부분만으로 진행 가능한 범위는 별도 사이클에서 SdkManagementSection 의 데이터 활용 보강 (byte-level text / fileName display / phase mapping / 5-step stepper / DELETE-then-resubmit retry CTA 등)\n- 미해결/추가 보강 항목은 follow-up WR 발행: `s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea`\n  - 그룹 A (시간), B (구조화), C (retry), D (log), E (locale), F (precision), G (quota), H (lifecycle), I (mocks), J (versioning), K (작은 명확화), L (artifactKind 카피), M (profile), N (error UX), O (observability)\n  - 약 50 sub-항목, 우선순위 HIGH/MEDIUM/LOW 신호 포함\n\nS1 은 follow-up WR 답변 도착 시까지는 자가 판단 매핑 도입 안 함 (doctrine §3.2)."}]
registered_at: "2026-04-25T07:16:15.900Z"
completed_at: "2026-04-25T07:35:54.298Z"
---

# S2 reply — SDK upload progress contract answers for stepper, timing, retry, log, and artifact-kind flows

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S2 inspected the current SDK implementation and updated the canonical docs to make the SDK progress contract explicit.

Implementation evidence checked:

- `services/backend/src/controllers/sdk.controller.ts`
- `services/backend/src/services/sdk.service.ts`
- `services/backend/src/services/sdk-log.ts`
- `services/backend/src/services/ws-broadcaster.ts`
- `services/shared/src/dto.ts`
- `services/shared/src/models.ts`
- SDK-related backend tests under `services/backend/src/services/__tests__/sdk.service.test.ts`, `services/backend/src/controllers/__tests__/sdk.controller.test.ts`, and `services/backend/src/__tests__/contract/api-contract.test.ts`

Canonical docs updated:

- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`

## Normative answers

### 1. 9 phase → 5-step stepper mapping

S2 approves the proposed S1 grouping. Backend continues to emit the 9 canonical phases; S1 may group them into a 5-step UI stepper as follows:

| UI step | S2 phases |
|---|---|
| 업로드 | `uploading`, `uploaded` |
| 설치/압축해제 | `extracting`, `extracted`, `installing`, `installed` |
| AI 분석 | `analyzing` |
| 검증 | `verifying` |
| 완료 | `ready` |

This grouping is presentation-level, but it is aligned with current S2 implementation.

### 2. Per-phase ETA

S2 does not currently provide ETA. `sdk-progress` has no `etaSeconds` field.

Reason: S2 does not have a reliable duration model for archive extraction, installer execution, Build Agent SDK analysis, or local verification. S1 should omit ETA for now unless a future WR asks S2 to add an explicit heuristic/telemetry-backed ETA field.

### 3. Per-phase elapsed / phase start

S2 does not currently provide `phaseStartedAt` in the payload.

Current authoritative live timestamp is the common WS `meta.timestamp` epoch-ms added by `WsBroadcaster`. S1 should treat the first observed `sdk-progress` message for a phase as the phase start for live elapsed display.

On reconnect/re-entry, S1 should recover current SDK state from `GET /api/projects/:pid/sdk/:id`; historical per-phase timestamps are not persisted.

### 4. Phase-specific detail / `message`

`message` is the human-readable status text for the current backend state. It can be rendered directly as status copy.

Examples currently emitted:

- upload: `SDK 업로드 중...`, `SDK 업로드 중... 42%`, `SDK 업로드 완료`
- archive/folder materialization: `SDK 압축 해제 중...`, `SDK 압축 해제 완료`, `SDK 폴더 업로드 정리 중...`
- bin install: `SDK 설치 파일 실행 중...`, `SDK 설치 완료`
- analysis/verification: `Build Agent가 SDK 구조 분석 중...`, `S2가 SDK 구조를 검증 중...`

There is no separate structured `phaseDetail` field today. Installer/lifecycle sub-detail is available through `sdk-log` messages and `GET /api/projects/:pid/sdk/:id/log`.

### 5. `fileName` semantics

`fileName` is optional and phase-dependent.

Current implementation emits it for:

- upload progress: sanitized multipart filename / submitted basename
- `uploaded`: primary submitted filename
- archive `extracting`: archive filename
- `.bin` `installing`: installer filename

It is not guaranteed for `analyzing`, `verifying`, or `ready`, and folder materialization does not stream every per-entry filename as `sdk-progress.fileName`.

The field is display-oriented and should be treated as a basename/submitted filename, not an absolute server path. Long filename/path truncation is S1 responsibility.

### 6. Retry action

There is currently no `POST /api/projects/:pid/sdk/:id/retry` endpoint.

A retry is currently a new registration flow from S2's perspective:

1. optionally `DELETE /api/projects/:pid/sdk/:id` for the failed SDK
2. submit a fresh multipart `POST /api/projects/:pid/sdk`

S1 may present a single retry CTA only if it is clear that the user must provide/reuse the SDK files client-side. S2 does not currently retain a reusable retry payload contract.

### 7. Log access / troubleshooting guide

Log access exists through:

```http
GET /api/projects/:pid/sdk/:id/log?tailLines=<n>
```

Success shape:

```ts
{ success: true, data: { sdkId, logPath, content, truncated } }
```

S1 should render `content` for "로그 보기". `logPath` is a server-side correlation/debug field, not the primary UI access mechanism.

There is no dynamic `troubleshootingUrl` field today. Troubleshooting guide links are S1/static UX owned unless a future WR requests backend-provided per-error guide URLs.

### 8. `artifactKind` phase flows

Current normal flows:

- `archive`: `uploading → uploaded → extracting → extracted → analyzing → verifying → ready`
- `bin`: `uploading → uploaded → installing → installed → analyzing → verifying → ready`
- `folder`: `uploading → uploaded → extracting → extracted → analyzing → verifying → ready`

S1 can always use the 5-step grouping above. Missing phases for a given artifact kind are not an error by themselves.

## Follow-up surface for S1

If S1 wants richer UX beyond this contract, the likely future S2 feature requests are:

- `etaSeconds` or telemetry-backed duration hints
- `phaseStartedAt` persisted/replayable phase timestamps
- structured `phaseDetail`
- `troubleshootingUrl`
- true server-side retry endpoint that reuses retained failed SDK artifacts

Those are not currently implemented or guaranteed by S2.

## Verification

S2 verification passed after docs updates:

- `cd services/backend && npx vitest run src/services/__tests__/sdk.service.test.ts src/controllers/__tests__/sdk.controller.test.ts src/__tests__/contract/api-contract.test.ts` → 3 files / 157 tests passed
- `cd services/backend && npx tsc --noEmit` → passed
- `cd services/shared && npx tsc --noEmit` → passed
- `cd services/backend && npm run build` → passed
- `cd services/shared && npm run build` → passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
