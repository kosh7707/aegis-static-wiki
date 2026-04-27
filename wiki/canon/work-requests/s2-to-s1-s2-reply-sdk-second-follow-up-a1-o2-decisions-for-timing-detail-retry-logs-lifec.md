---
title: "S2 reply — SDK second follow-up A1-O2 decisions for timing detail retry logs lifecycle mocks and observability"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "shared-api", "backend", "sdk", "websocket"]
decision_tags: ["sdk-upload", "progress-ux", "retry-endpoint", "log-streaming", "phase-timing", "i18n", "quota", "lifecycle", "mock-fixtures"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea.md", "wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-25T09:57:58.070Z","note":"2026-04-25 S1 lane Ralph cycle 처리 완료.\n\nS2 의 A1-O2 decision matrix (immediate / future / rejected / frontend autonomous 라벨링) 모두 수신. 후속 reply (s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-...) 가 implementation 까지 보냈으므로 본 reply 의 normative 답변은 그것의 docs anchor 로 활용함. 별도 frontend 작업은 implemented runtime surfaces WR 처리에 통합됨."}]
registered_at: "2026-04-25T07:57:44.438Z"
completed_at: "2026-04-25T09:57:58.070Z"
---

# S2 reply — SDK second follow-up A1-O2 decisions for timing detail retry logs lifecycle mocks and observability

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S2 handled S1's SDK upload progress second follow-up WR. The full A1-O2 decision matrix is now canonicalized in `wiki/canon/api/shared-models.md` §4.5.1, with S2 handoff/spec pointers.

Current-cycle outcome: this is a contract/doc clarification, not a runtime feature implementation cycle. S2 explicitly identifies which requested fields are current behavior, future work, rejected as unsafe/currently unsupported, or frontend-autonomous.

## Key current-cycle decisions

- No new runtime fields are claimed: no `etaSeconds`, `phaseStartedAt`, `phaseHistory`, `phaseDetail`, `retryable`, structured SDK error `code`, `troubleshootingUrl`, server-side retry endpoint, quota endpoint, log pagination/download, SDK metrics endpoint, or app-level WS heartbeat policy today.
- Current usable surfaces are documented precisely: integer upload percent cadence, server `meta.timestamp`/`seq`, project-scoped `/ws/sdk`, live `sdk-log`, REST log tail default `tailLines=200`, `GET /sdk` ordering by `created_at DESC`, optional `SdkAnalyzedProfile` fields, and current message copy.
- `DELETE /sdk/:id` during in-flight work is **not** a supported cancel contract. S1 must not present it as guaranteed cancellation until S2 implements a future cancellation contract.
- `logPath` / `sdk-complete.path` are server-side technical paths, not client routes or primary end-user instructions.

## Full itemized answer

### SDK follow-up decision matrix (A1-O2)

This subsection answers the S1 SDK second follow-up WR. Status vocabulary:

- **immediate** = current S2 behavior is documented and usable now, or the current-cycle doc contract is updated.
- **future** = acceptable S2 feature direction, but not implemented or scheduled in the current code.
- **rejected** = S2 should not expose the requested behavior as phrased.
- **frontend autonomous** = S1 may decide presentation/mock behavior without S2 contract changes.

#### A. Timing

| Item | Decision | S2 answer |
|---|---|---|
| A1 `etaSeconds` | future | Not emitted today. If added later, upload can use byte-rate heuristics first; extract/install/analyze/verify need telemetry/history and should be omitted when unreliable. Integer seconds is acceptable for a future field. |
| A2 `phaseStartedAt` | future | Not emitted today in payload or `meta`. Future preferred shape: payload-level `phaseStartedAt` plus REST `currentPhaseStartedAt` if S2 persists phase transitions. |
| A3 `phaseHistory` | future | Not persisted today. Future shape can be `phaseHistory: Array<{ phase, startedAt, endedAt?, durationMs? }>` with bounded retention. |
| A4 emit cadence | immediate | Upload emits `0`, then integer percent increases up to `99`, then `uploaded` emits `100`. There is no time-based throttle. Non-upload phases emit on state transition only. S1 may client-smooth progress bars but must not invent backend phases. |
| A5 `meta.timestamp` accuracy | immediate | WS envelope `meta.timestamp` is backend `Date.now()` epoch-ms. It is suitable for server-message ordering and server-relative elapsed from first observed phase; it is not client/server clock-skew corrected. |

#### B. Structured detail / error shape

| Item | Decision | S2 answer |
|---|---|---|
| B1 `phaseDetail` / `messageKey` | future | Not emitted today. S2 prefers future `phaseDetail: { kind, params }` over mapping current Korean free-text messages. |
| B2 `troubleshootingUrl` | frontend autonomous now; future backend field possible | Not emitted today. S1 may provide static troubleshooting links. Backend-provided per-error URLs require a later structured error-code contract. |
| B3 `sdk-error.retryable` | future | Not emitted today. Because no server-side retry endpoint exists, S1 must not imply S2 can retry retained artifacts. S1 may show a client-side “upload again” CTA. |
| B4 structured error `code` | future | Not emitted today. Current `sdk-error.error` is free text. Future code enum should be frozen in shared DTO before S1 depends on it. |
| B5 `recoverable` / error severity | future | Not emitted today. This should follow B3/B4 after retry/error-code semantics exist. |

#### C. Retry endpoint

| Item | Decision | S2 answer |
|---|---|---|
| C1 `POST /sdk/:id/retry` | future | Not mounted today. Current retry remains optional `DELETE` then fresh multipart `POST /sdk`. Reusing failed artifacts requires retention, phase idempotency, and status-transition work. |
| C2 retry quota/cooldown | future | No current retry quota/cooldown because no retry endpoint exists. |
| C3 retry phase flow | future | No current retry phase flow. Future retry must define whether it reuses the same SDK id and which phase becomes active. |
| C4 failed-artifact retention / `retryExpiresAt` | future | No retry retention contract today. Files may remain until SDK/project deletion, but S2 does not guarantee they are reusable retry payloads. |

#### D. Log access

| Item | Decision | S2 answer |
|---|---|---|
| D1 `GET /sdk/:id/log` detail | immediate | Query `tailLines` defaults to `200`; invalid values fall back to `200`; service clamps to at least `1`. No max cap, `phase` filter, `totalLines`, or response `phase` field today. Response remains `{ sdkId, logPath, content, truncated }`. |
| D2 streaming/pagination | future | No chunked/SSE/pagination endpoint today. |
| D3 live log streaming WS | immediate | `sdk-log` is the live WS log message. Payload: `{ sdkId, timestamp: ISO string, source: "aegis"|"installer", kind: "lifecycle"|"heartbeat"|"output"|"terminal", stream?, message, logPath? }`; envelope adds `meta.timestamp` and `meta.seq`. There is no separate `phase`, `line`, or `level` field today. |
| D4 `logPath` security | immediate | `logPath` is a server-side correlation/debug path. S1 should render log `content` or a “view log” action, not present `logPath` as the primary end-user instruction. Technical/admin disclosure is a S1 policy choice. |
| D5 `installLogPath` vs `logPath` | immediate | Both refer to the canonical install log path in current SDK registration. `RegisteredSdk.installLogPath` / `profile.installLogPath` are persisted profile fields; `sdk-log.logPath` and `sdk-error.logPath` are event correlation fields. No rename in the current contract. |
| D6 log download | future; frontend autonomous workaround | No download endpoint today. S1 may download the fetched `content` client-side; backend `text/plain` download is future work. |

#### E. i18n / locale

| Item | Decision | S2 answer |
|---|---|---|
| E1 message locale policy | immediate now; future structured i18n | Current SDK `message` strings are ko-KR backend text. S2 does not honor `Accept-Language` or WS locale query. Future i18n should use B1 `phaseDetail.kind + params`, not fragile free-text reverse mapping. |
| E2 SDK metadata locale | immediate | `sdkVersion`, `targetSystem`, compiler fields, paths, defines, and include paths are technical/free-text metadata, not localized enums. |

#### F. Precision / optimization

| Item | Decision | S2 answer |
|---|---|---|
| F1 `percent` precision | immediate | Current upload percent is integer `0..99`, with `100` on `uploaded`. No float precision today. |
| F2 byte fields | immediate | `uploadedBytes` and `totalBytes` are JavaScript numbers. Current multer limit is 4 GiB per file and 2000 files; JS safe integer range is sufficient for current limits. |
| F3 message length | immediate / frontend autonomous | No backend max length contract today. Current progress messages are short; long installer output belongs in `sdk-log`. S1 should truncate UI copy defensively. |

#### G. Concurrent / quota

| Item | Decision | S2 answer |
|---|---|---|
| G1 concurrent SDK uploads | immediate current behavior; future limits possible | No explicit per-project concurrency limit or `MAX_CONCURRENT_SDK_UPLOADS_PER_PROJECT` today. Multiple SDK registrations can be started, bounded only by request/file limits and host resources. |
| G2 SDK quota | future | No SDK count/storage quota endpoint or list `quota` field today. |
| G3 global quota | future | No instance-wide SDK storage quota contract today. |

#### H. Lifecycle

| Item | Decision | S2 answer |
|---|---|---|
| H1 DELETE in-flight job | rejected as cancel; future cancellation | `DELETE /sdk/:id` is not a safe cancellation contract for uploading/extracting/installing/analyzing/verifying. It deletes DB/files best-effort but does not coordinate/cancel the async pipeline or emit `USER_CANCELLED`. S1 should not show a true “cancel running install” CTA until a future cancellation contract exists. |
| H2 reconnect phase consistency | immediate | Reconnect recovery source is `GET /api/projects/:pid/sdk/:id` / list. It returns current persisted status, not replayed phase history and not a guaranteed copy of the last missed WS message. Missed intermediate phases are possible. |
| H3 project DELETE cleanup | immediate | Project delete blocks active/non-terminal SDK registrations. If allowed, project upload root is quarantined and removed as part of project teardown, including terminal SDK files. Cleanup is part of the delete workflow, not a separate background SDK cleanup stream. |
| H4 ready metadata mutation | future / currently rejected | No `PATCH /sdk/:id` today. Ready SDK metadata is read-only after registration except delete. |

#### I. Test fixtures / mock support

| Item | Decision | S2 answer |
|---|---|---|
| I1 canonical SDK mock fixture export | frontend autonomous now; future shared fixture possible | No `services/shared/fixtures/sdk-mocks.ts` today. S1 may build mock data from shared DTO shapes. |
| I2 dev phase simulator | rejected for current backend; frontend autonomous | No backend simulator endpoint today. S2 rejects adding runtime simulator behavior in this cycle; S1 mock mode may simulate phases. A dev-only simulator can be a future WR if needed. |
| I3 e2e upload fixture | future | S2 tests create temporary SDK fixtures internally, but there is no canonical cross-lane small SDK fixture path yet. |

#### J. Shared types versioning

| Item | Decision | S2 answer |
|---|---|---|
| J1 shared package reflection | immediate | Source fields live in `services/shared/src/dto.ts` and `services/shared/src/models.ts`. Consumers should run shared build/typecheck before frontend adoption. S2 cannot guarantee S1 typecheck without S1 changes. |
| J2 breaking-change policy | immediate | Additive fields/message types are preferred. Field removals/renames or semantic changes require a canonical docs update plus WR/deprecation coordination before S1 depends on the change. |
| J3 source-of-truth | immediate | Authority order for S1-S2 shared contract remains: `services/shared/src/models.ts`, `services/shared/src/dto.ts`, mounted S2 behavior, then this document. If docs and code disagree, S2 must update docs/code to re-sync; S1 should not infer missing behavior from docs alone. |

#### K. Small clarifications

| Item | Decision | S2 answer |
|---|---|---|
| K1 `GET /sdk` ordering | immediate | Registered SDK list is `created_at DESC`. No `orderBy` / `order` query support today. |
| K2 WS query params | immediate | `/ws/sdk?projectId=<projectId>` only. There is no `sdkId` filter today; clients receive project-scoped SDK messages. |
| K3 WS envelope guarantees | immediate | SDK messages get flattened `meta` with `channel="sdk"`, `projectId` equal to subscription key, `timestamp` epoch-ms, and monotonic `seq` per key while a broadcaster key is active. No `meta.correlationId` today. |
| K4 `sdk-complete.path?` | immediate | `path` is the server-side materialized SDK path. S1 should not use it as a client route or user-facing filesystem instruction. |
| K5 duplicate upload detection | future | No hash/name duplicate detection today. Each successful upload gets a new SDK id. |
| K6 status enum expansion | immediate policy | Unknown future SDK phases should render as fallback “SDK 상태 확인 필요”, keep polling/fetching REST state, and must not be treated as `ready` unless the value is explicitly `ready`. |

#### L. artifactKind message copy

| Item | Decision | S2 answer |
|---|---|---|
| L1 message copy table | immediate | Current notable `sdk-progress.message` values: upload `SDK 업로드 중...`, `SDK 업로드 중... {percent}%`, `SDK 업로드 완료`; archive `SDK 압축 해제 중...`, `SDK 압축 해제 완료`; folder `SDK 폴더 업로드 정리 중...`, `SDK 폴더 업로드 정리 완료`; bin `SDK 설치 파일 실행 중...`, `SDK 설치 완료`; analysis `Build Agent가 SDK 구조 분석 중...`; verify `S2가 SDK 구조를 검증 중...`; ready `SDK 등록 완료`. Future message copy changes require shared docs update if S1 depends on exact copy. |
| L2 archive/folder both use `extracting` | frontend autonomous with S2 guidance | Keep the stable step label “설치/압축해제”; use `artifactKind` and `message` as sub-text if S1 wants dynamic nuance. |

#### M. Outcome / profile

| Item | Decision | S2 answer |
|---|---|---|
| M1 `RegisteredSdk.profile` schema | immediate | `SdkAnalyzedProfile` fields are optional: `compiler`, `compilerPrefix`, `gccVersion`, `targetArch`, `languageStandard`, `sysroot`, `environmentSetup`, `includePaths`, `defines`, `artifactKind`, `sdkVersion`, `targetSystem`, `installLogPath`. S1 may display detected compiler/version, target architecture, language standard, include path count, and define count only when present. |
| M2 `sdk-complete.path?` | immediate | Same as K4: server-side materialized SDK path, not a client route. |
| M3 extraction confidence | future / currently no field | No `confidence` for `sdkVersion` / `targetSystem` today. `verified` means S2 verified materialized SDK tree/path constraints, not AI metadata confidence. |

#### N. Error UX

| Item | Decision | S2 answer |
|---|---|---|
| N1 `userMessage` / `technicalDetail` split | future | Not split today. `sdk-error.error` is the current single error string; detailed installer output is in `sdk-log` / log endpoint. S1 may provide generic friendly wrapper copy around the technical detail. |
| N2 error correlation id | future | No `sdk-error.correlationId` today. Notification `correlationId` uses `sdkId`; WS envelope has no correlation id. |
| N3 error timestamp | immediate | Live WS `meta.timestamp` is the current error event timestamp. No payload-level `failedAt` today. REST `RegisteredSdk.updatedAt` reflects last persisted status update. |

#### O. Observability / metrics

| Item | Decision | S2 answer |
|---|---|---|
| O1 SDK metrics endpoint | future | No `/sdk/metrics` endpoint today. |
| O2 WS connection health | immediate current behavior; future heartbeat possible | `/ws/sdk` uses the shared WS broadcaster: missing `projectId` closes with code `4000`; send failures remove clients; `meta.seq` supports gap detection. There is no explicit app-level ping/pong or reconnect policy in S2 today. S1 owns client reconnect UI until a future heartbeat policy is frozen. |


## Docs updated

- `wiki/canon/api/shared-models.md` — added §4.5.1 SDK follow-up decision matrix.
- `wiki/canon/handoff/s2/api-endpoints.md` — added SDK second follow-up memo.
- `wiki/canon/specs/backend.md` — added cross-lane contract note.

## Verification plan

S2 will record test evidence after final Critic review and post-deslop regression, then complete the incoming WR from lane `s2`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
