---
title: S2 API 계약서 vs S1 소비 적합도 감사 (2026-05-08)
type: audit-report
lane: s1
audit_date: 2026-05-08
scope: read-only — 명시적 코드 수정 없음
inputs:
  - wiki/canon/handoff/s2/api-endpoints.md
  - wiki/canon/handoff/s2/architecture.md
  - services/frontend/src/common/api/*.ts
  - services/frontend/src/common/utils/wsEnvelope.ts
  - services/frontend/src/common/hooks/* (WS consumers)
  - services/frontend/src/common/contexts/NotificationContext.tsx
  - services/frontend/src/pages/DynamicAnalysisPage/components/MonitoringView/MonitoringView.tsx
  - services/frontend/src/pages/DashboardPage/useDashboardActivityFeed.ts
methodology: 3 parallel Explore lanes (REST-A, REST-B, WS-deep) → 단일 보고서로 합본
---

# S2 API 계약서 vs S1 소비 적합도 감사

## TL;DR

| 영역 | ✅ OK | ❌ MISSING | ⚠️ DRIFT | ⚠️ DEAD/CALLERLESS |
|---|---|---|---|---|
| REST 그룹1 (auth/projects/source/sdk/pipeline) | 48 | 9 | 8 | 1 |
| REST 그룹2 (analysis/report/gate/approval/notifications/dynamic) | 34 | 7 | 3 | 5 |
| WebSocket (7 채널) | 7 URL/envelope/4000 close 모두 적합 | 0 CRITICAL | 9 항목 | 1 (createHeartbeat 미사용) |
| **합계** | 89 endpoint + 7 WS | **16 endpoint** | **20 항목** | **7 항목** |

**판정**:
- WS contract 위반 0 CRITICAL — infra 계층(`wsEnvelope.ts`)은 계약에 충실, broadcaster envelope/close 4000/heartbeat 모델 정확히 구현.
- 가장 큰 위험: WS 8 consumer 중 **3개가 seq gap-tracker 미사용**, **5개가 `onGiveUp` 미구현** → retry 소진 시 silent dead-channel.
- 가장 큰 누락: `POST /api/analysis/deep`, `POST /api/analysis/abort/:id`, `DELETE /api/analysis/results/:id`, `GET /api/projects/:pid/findings/summary`, `POST /api/projects/:pid/pipeline/prepare(/:targetId)`, `PUT /api/projects/:id`, `DELETE /api/projects/:pid/source`, `GET /api/sdk-profiles`, `GET /api/projects/:pid/sdk/metrics`, `GET /api/auth/registration-requests/:id`, `GET /api/approvals/:id`, `GET /api/projects/:pid/gates/runs/:runId` — 12개 contract endpoint가 S1 소비자 없음.
- 본 감사는 **read-only** — 코드 수정 0건. 각 항목별 수정 우선순위는 §6 권고 참고.

---

## 1. REST 그룹 1 — auth / projects / source / sdk / pipeline

### 1.1 Auth

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/auth/login` | POST | `auth.ts:login:110` | ✅ | |
| `/api/auth/logout` | POST | `auth.ts:logout:130` | ✅ | |
| `/api/auth/orgs/:code/verify` | GET | `auth.ts:verifyOrgCode:207` | ✅ | encodeURIComponent ✅ |
| `/api/auth/register` | POST | `auth.ts:register:231` | ✅ | |
| `/api/auth/registrations/lookup/:lookupToken` | GET | `auth.ts:lookupRegistration:264` | ✅ | |
| `/api/auth/password-reset/request` | POST | `auth.ts:requestPasswordReset:167` | ✅ | |
| `/api/auth/password-reset/confirm` | POST | `auth.ts:confirmPasswordReset:180` | ✅ | |
| `/api/auth/me` | GET | `auth.ts:fetchCurrentUser:147` | ✅ | |
| `/api/auth/users` | GET | `auth.ts:fetchUsers:157` | ✅ | |
| `/api/auth/registration-requests` | GET | `auth.ts:listRegistrationRequests:293` | ✅ | |
| `/api/auth/registration-requests/:id` | GET | — | ❌ | 단일 조회 함수 부재 |
| `/api/auth/registration-requests/:id/approve` | POST | `auth.ts:approveRegistrationRequest:321` | ✅ | |
| `/api/auth/registration-requests/:id/reject` | POST | `auth.ts:rejectRegistrationRequest:356` | ✅ | |
| `/api/auth/dev/password-reset/latest?email=` | GET | — | ❌ | 비-prod 브리지, 의도적 누락 가능 |

### 1.2 Projects

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects` | POST | `projects.ts:createProject:25` | ✅ | |
| `/api/projects` | GET | `projects.ts:fetchProjects:15` | ✅ | |
| `/api/projects/:id` | GET | `projects.ts:fetchProject:19` | ✅ | |
| `/api/projects/:id` | PUT | — | ❌ | 프로젝트 rename/update 함수 부재 (`updateProjectSettings`는 별개 endpoint) |
| `/api/projects/:id` | DELETE | `projects.ts:deleteProject:33` | ✅ | 409 `errorDetail.blockers` 미파싱 |
| `/api/projects/:id/overview` | GET | `projects.ts:fetchProjectOverview:55` | ⚠️ | 다른 함수와 달리 `res.data` unwrap 없이 raw return — type이 envelope 자체면 OK, 일관성 깨짐 |
| `/api/projects/:pid/settings` | GET | `projects.ts:fetchProjectSettings:40` | ✅ | |
| `/api/projects/:pid/settings` | PUT | `projects.ts:updateProjectSettings:45` | ✅ | |
| `/api/projects/:pid/activity` | GET | `projects.ts:fetchProjectActivity:71` | ✅ | |
| `/api/projects/:projectId/files` | GET | `source.ts:fetchProjectFiles:117` | ✅ | |
| `/api/files/:fileId/content` | GET | `source.ts:fetchFileContent:131` | ✅ | |
| `/api/files/:fileId/download` | GET | `source.ts:downloadFile:123` | ✅ | raw `fetch` + X-Request-Id |
| `/api/projects/:projectId/files/:fileId` | DELETE | `source.ts:deleteProjectFile:136` | ✅ | |

### 1.3 Source

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects/:pid/source/upload` | POST | `source.ts:uploadSource:73` | ✅ | |
| `/api/projects/:pid/source/upload-status/:uploadId` | GET | `source.ts:fetchUploadStatus:147` | ⚠️ | `UploadStatusSnapshot`에 `message`/`error` 필드 누락 |
| `/api/projects/:pid/source/clone` | POST | `source.ts:cloneSource:80` | ✅ | |
| `/api/projects/:pid/source/files` | GET | `source.ts:fetchSourceFiles:92`, `:99` | ✅ | `?filter=source` 미사용 |
| `/api/projects/:pid/source/file` | GET | `source.ts:fetchSourceFileContent:105` | ✅ | |
| `/api/projects/:pid/source` | DELETE | — | ❌ | `deleteSource` 함수 부재 |

### 1.4 SDK / Profile / Library

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/sdk-profiles` | GET | — | ❌ | SDK 프로파일 list 미연결 |
| `/api/sdk-profiles/:id` | GET | — | ❌ | SDK 프로파일 detail 미연결 |
| `/api/gate-profiles` | GET | `gate.ts:fetchGateProfiles:51` | ✅ | |
| `/api/gate-profiles/:id` | GET | `gate.ts:fetchGateProfile:58` | ✅ | |
| `/api/projects/:pid/sdk` | GET | `sdk.ts:fetchProjectSdks:69` | ✅ | |
| `/api/projects/:pid/sdk/:id` | GET | `sdk.ts:fetchSdkDetail:76` | ✅ | |
| `/api/projects/:pid/sdk/quota` | GET | `sdk.ts:fetchSdkQuota:172` | ✅ | |
| `/api/projects/:pid/sdk/metrics` | GET | — | ❌ | `fetchSdkMetrics` 부재 |
| `/api/projects/:pid/sdk/:id/log` | GET | `sdk.ts:fetchSdkLog:153` + `getSdkLogDownloadUrl:168` | ✅ | |
| `/api/projects/:pid/sdk/:id/retry` | POST | `sdk.ts:retrySdk:136` | ✅ | |
| `/api/projects/:pid/sdk` (multipart) | POST | `sdk.ts:registerSdkByUpload:101` | ✅ | |
| `/api/projects/:pid/sdk` (deprecated path) | POST | `sdk.ts:registerSdkByPath:84` | ⚠️ DEAD | `localPath` 필드는 현재 contract에 없음, `@deprecated` 표시 |
| `/api/projects/:pid/sdk/:id` | DELETE | `sdk.ts:deleteSdk:126` | ✅ | |
| `/api/projects/:pid/targets/:tid/libraries` | GET | `pipeline.ts:fetchTargetLibraries:103` | ✅ | |
| `/api/projects/:pid/targets/:tid/libraries` | PATCH | `pipeline.ts:updateTargetLibraries:113` | ✅ | |

### 1.5 Pipeline (BuildTarget)

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects/:pid/targets` | GET | `pipeline.ts:fetchBuildTargets:11` | ✅ | |
| `/api/projects/:pid/targets` | POST | `pipeline.ts:createBuildTarget:18` | ⚠️ | contract `buildSystem?` 옵션을 create body에서 안 보냄 (update 시에만) |
| `/api/projects/:pid/targets/:id` | PUT | `pipeline.ts:updateBuildTarget:39` | ⚠️ | `includedPaths`를 silently strip (line 62) — contract는 400 INVALID_INPUT, UI 게이팅 부재 |
| `/api/projects/:pid/targets/:id` | DELETE | `pipeline.ts:deleteBuildTarget:65` | ✅ | |
| `/api/projects/:pid/targets/:id/build-log` | GET | `pipeline.ts:fetchBuildLog:185` | ✅ | |
| `/api/projects/:pid/targets/discover` | POST | `pipeline.ts:discoverBuildTargets:72` | ⚠️ | `discovered`/`created`/`elapsedMs` 필드 silently 폐기 |
| `/api/projects/:pid/pipeline/prepare` | POST | — | ❌ | `preparePipeline` 함수 부재 |
| `/api/projects/:pid/pipeline/prepare/:targetId` | POST | — | ❌ | 단일 타깃 prepare 부재 |
| `/api/projects/:pid/pipeline/run` | POST | `pipeline.ts:runPipeline:130` | ✅ | |
| `/api/projects/:pid/pipeline/run/:targetId` | POST | `pipeline.ts:runPipelineTarget:143` | ⚠️ | response type에 `pipelineId` 빠짐 → 단일 타깃 retry의 WS 상관관계 잃음 |
| `/api/projects/:pid/pipeline/status` | GET | `pipeline.ts:fetchPipelineStatus:170` | ⚠️ | `PipelineStatusResponse` type에 `message`/`error`/`isRunning` 미선언, hook은 duck access (usePipelineProgress.ts:139–148) |

### 1.6 Health

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/health` | GET | `core.ts:healthFetch:90` / `healthCheck:173` | ⚠️ | `HealthCheckResponse`가 `controlPolicyVersion`, `requestIdQueried`, per-service `control.pollDecision` 등 풍부한 contract 필드를 미반영, `?requestId=` 쿼리 미전송 |

---

## 2. REST 그룹 2 — analysis / report / gate / approval / notifications / dynamic

### 2.1 Analysis (+ Runs / Findings)

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/analysis/quick` | POST | `analysis.ts:runAnalysis:51` | ✅ | |
| `/api/analysis/deep` | POST | — | ❌ | 실 함수 부재, mock-handler.ts:121만 처리 |
| `/api/analysis/status` | GET | `analysis.ts:fetchAllAnalysisStatuses:25` | ✅ | |
| `/api/analysis/status/:analysisId` | GET | `analysis.ts:fetchAnalysisStatus:32` | ✅ | |
| `/api/analysis/abort/:analysisId` | POST | — | ❌ | abort 함수 부재 |
| `/api/analysis/results` | GET | — | ❌ | list endpoint 미연결 |
| `/api/analysis/results/:analysisId` | GET | `analysis.ts:fetchAnalysisResults:39` | ✅ | |
| `/api/analysis/results/:analysisId` | DELETE | — | ❌ | delete 함수 부재 |
| `/api/analysis/summary` | GET | `analysis.ts:fetchStaticDashboardSummary:87` | ✅ | |
| `/api/analysis/poc` | POST | `analysis.ts:generatePoc:70` | ✅ | |
| `/api/projects/:pid/runs` | GET | `analysis.ts:fetchProjectRuns:99` | ✅ | |
| `/api/runs/:id` | GET | `analysis.ts:fetchRunDetail:104` | ✅ | |
| `/api/projects/:pid/findings` | GET | `analysis.ts:fetchProjectFindings:109` | ✅ | |
| `/api/projects/:pid/findings/summary` | GET | — | ❌ | aggregate endpoint 미연결 |
| `/api/projects/:pid/findings/groups` | GET | `analysis.ts:fetchFindingGroups:192` | ✅ | |
| `/api/findings/bulk-status` | PATCH | `analysis.ts:bulkUpdateFindingStatus:150` | ✅ | |
| `/api/findings/:id/history` | GET | `analysis.ts:fetchFindingHistory:176` | ✅ | |
| `/api/findings/:id` | GET | `analysis.ts:fetchFindingDetail:128` | ✅ | |
| `/api/findings/:id/status` | PATCH | `analysis.ts:updateFindingStatus:135` | ✅ | |

### 2.2 Report

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects/:pid/report` | GET | `report.ts:fetchProjectReport:29` | ✅ | |
| `/api/projects/:pid/report/static` | GET | `report.ts:fetchModuleReport(static):34` | ⚠️ DEAD | 함수 존재, 페이지 호출자 0 |
| `/api/projects/:pid/report/dynamic` | GET | `report.ts:fetchModuleReport(dynamic):34` | ⚠️ DEAD | 동상 |
| `/api/projects/:pid/report/test` | GET | `report.ts:fetchModuleReport(test):34` | ⚠️ DEAD | 동상 |
| `/api/projects/:pid/report/custom` | POST | `report.ts:generateCustomReport:49` | ✅ | |

### 2.3 Gate

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects/:pid/gates` | GET | `gate.ts:fetchProjectGates:23` | ✅ | |
| `/api/projects/:pid/gates/runs/:runId` | GET | — | ❌ | run-scoped 부재 |
| `/api/gates/:id` | GET | `gate.ts:fetchGateDetail:31` | ⚠️ DEAD | 페이지 호출자 0 |
| `/api/gates/:id/override` | POST | `gate.ts:overrideGate:37` | ✅ | |
| `/api/gate-profiles` | GET | `gate.ts:fetchGateProfiles:51` | ⚠️ DEAD | 페이지 호출자 0 |
| `/api/gate-profiles/:id` | GET | `gate.ts:fetchGateProfile:58` | ✅ | |

### 2.4 Approval

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects/:pid/approvals/count` | GET | `approval.ts:fetchApprovalCount:114` | ⚠️ | S1이 `total` 필드 추가 (contract 미정의) |
| `/api/projects/:pid/approvals` | GET | `approval.ts:fetchProjectApprovals:90` | ✅ | H4/H5 additive 필드 정상 |
| `/api/approvals/:id` | GET | — | ❌ | detail fetch 부재 |
| `/api/approvals/:id/decide` | POST | `approval.ts:decideApproval:97` | ✅ | |

### 2.5 Notifications

| Contract | Method | S1 consumer | 정합 | 비고 |
|---|---|---|---|---|
| `/api/projects/:pid/notifications/count` | GET | `notifications.ts:fetchNotificationCount:17` | ⚠️ | `apiFetch` 결과 unwrap 없이 raw return — envelope이면 runtime shape mismatch |
| `/api/projects/:pid/notifications/read-all` | PATCH | `notifications.ts:markAllNotificationsRead:29` | ✅ | |
| `/api/projects/:pid/notifications` | GET | `notifications.ts:fetchNotifications:4` | ✅ | |
| `/api/notifications/:id/read` | PATCH | `notifications.ts:markNotificationRead:25` | ✅ | |

### 2.6 Dynamic

13/13 endpoint 모두 `dynamic.ts`에서 정확히 소비 — `createDynamicSession`, `fetchDynamicSessions`, `fetchDynamicSessionDetail`, `startDynamicSession`, `stopDynamicSession`, `fetchScenarios`, `injectCanMessage`, `injectScenario`, `fetchInjections`, `runDynamicTest`, `getDynamicTestResults`, `getDynamicTestResult`, `deleteDynamicTestResult`. ✅ 완전 커버.

---

## 3. WebSocket — 핵심 영역 (사용자 강조)

### 3.1 Contract surface

| 경로 | subscription key | 채널 |
|---|---|---|
| `/ws/notifications?projectId=` | projectId | notification |
| `/ws/dynamic-analysis?sessionId=` | sessionId | dynamic-analysis (out-of-scope hardening) |
| `/ws/dynamic-test?testId=` | testId | dynamic-test |
| `/ws/analysis?analysisId=` | analysisId | analysis (snapshot-on-subscribe) |
| `/ws/upload?uploadId=` | uploadId | upload (snapshot-on-subscribe) |
| `/ws/pipeline?projectId=` | projectId | pipeline |
| `/ws/sdk?projectId=` | projectId | sdk |

- **Auth**: query-string subscription key 외 추가 인증 미정의. 빠지면 server `close(4000, "<paramName> required")`.
- **Envelope** (server→client): `{ type, ...payload-fields, meta: { channel, projectId, timestamp, seq } }` (flattened).
- **Close codes**: `4000` (subscription key 누락, permanent), 표준 `1000/1001/1006`. 그 외 application close code 미정의.
- **Heartbeat**: 30s 간격 server `{type:"heartbeat"}` envelope + WS protocol `ping()`. browser auto-pong. **client 측 application heartbeat 송신 불필요**.
- **Ordering**: per-key monotonic `meta.seq` from 1, gap detect 가능. snapshot-on-subscribe는 `/ws/upload`, `/ws/analysis` 한정. 기타 채널은 reconnect 시 REST 재조회 필수.
- **Reconnect**: contract 침묵 — S1 재량.

### 3.2 Per-consumer audit

| Hook / 파일 | URL ✅ | Envelope ✅ | seq 추적 | 토픽 ✅ | close 4000 | onGiveUp | REST fallback | Heartbeat |
|---|---|---|---|---|---|---|---|---|
| `useAnalysisWebSocket.ts` | ✅ :177 | ✅ :117 | ✅ :118 | ✅ progress/quick/deep/error | ✅ shared | ✅ :205 | ✅ :188 fetchAnalysisStatus | server-driven |
| `useUploadProgress.ts` | ✅ :54 | ✅ :55 | ✅ :61 | ✅ progress/complete/error | ✅ shared | ✅ :131 | ✅ :106 fetchUploadStatus | server-driven |
| `useSdkProgress.ts` | ✅ via sdk.ts:131 | ✅ :107 | ✅ :114 | ✅ progress/log/complete/error | ✅ shared | ❌ 부재 | ✅ :172 fetchProjectSdks | server-driven |
| `usePipelineProgress.ts` | ✅ :117 | ✅ :66 | ✅ :67 | ✅ status/complete/error | ✅ shared | ⚠️ :155 (UX 신호 약함) | ✅ :126 fetchPipelineStatus | server-driven |
| `useDynamicTest.ts` | ✅ :58 | ✅ :75 | ❌ 부재 | ⚠️ progress/finding/error 정상, complete 빈 case | ✅ shared | ❌ 부재 | ❌ 부재 | server-driven |
| `NotificationContext.tsx` | ✅ via notifications.ts:34 | ✅ :106 | ❌ 부재 | ✅ notification | ✅ shared | ❌ 부재 | ✅ :88 refresh | server-driven |
| `useDashboardActivityFeed.ts` | ✅ :119 | ❌ raw frame trigger (envelope 무시) | ❌ 부재 | ⚠️ heartbeat 포함 모든 frame을 refresh trigger로 오용 | ✅ shared | ❌ 부재 | ✅ activity revision bump | server-driven, 30s마다 불필요 REST 발생 |
| `MonitoringView.tsx` | ✅ :57 | ✅ :63 | ❌ 부재 | ✅ message/alert/status/injection-* | ✅ shared | ❌ 부재 | ❌ 부재 | server-driven |

### 3.3 WS findings (severity)

#### ❌ CRITICAL
없음. infra(`wsEnvelope.ts`, `ws-broadcaster` 모델 인지)는 contract 충실. 7 endpoint URL 정확, close 4000 중앙 처리, envelope decoding 정확.

#### ⚠️ DRIFT (9건)
1. **seq gap-tracker 미사용** — `NotificationContext.tsx`, `useDynamicTest.ts`, `MonitoringView.tsx`, `useDashboardActivityFeed.ts` 4개. broadcaster는 `meta.seq` 항상 발행.
2. **`useDashboardActivityFeed.ts:113`** — 모든 WS frame(heartbeat 포함)을 refresh trigger로 사용. 30s마다 불필요한 전체 활동 REST 재조회 발생.
3. **`meta.channel` 검증 0** — 모든 consumer가 `parseWsMessage` 결과를 channel 검증 없이 신뢰.
4. **`useUploadProgress.ts:8` `UploadPhase` type drift** — canonical `dto.ts:444`은 `received|extracting|indexing|complete|failed`. `uploading`은 frontend 사전-WS 상태(허용 가능, 의미 drift).
5. **`useDynamicTest.ts:90` `case "test-complete"` body 비움** — 종료가 HTTP POST 응답에 의존, WS 종단 frame과 race 시 취약.
6. **`onGiveUp` 미구현 5곳** — `useSdkProgress`, `useDynamicTest`, `NotificationContext`, `useDashboardActivityFeed`, `MonitoringView`. retry 소진 시 silent dead-channel.
7. **`useDynamicTest.ts:62` `maxRetries: 5`** — 다른 hook들(8–10) 대비 낮음, 근거 부재.
8. **`createHeartbeat()` (wsEnvelope.ts:248–304) 사용처 0** — client→server `{type:"ping"}/"pong"`은 contract에 없음. 잘못 wire될 시 서버가 모르는 트래픽 발생. Dead code.
9. **`wsReconnect.ts` 파일 부재** — 테스트만 존재, 실 구현은 `wsEnvelope.ts:126–232` (`createReconnectingWs`). layout 정합성 표기상 혼동.

#### ⚠️ MISSING TOPIC
없음. contract 정의 토픽 모두 적어도 1 consumer가 처리.

---

## 4. 종합 발견사항

### 4.1 ❌ MISSING (S1 소비자 부재 — 16 endpoint)

**Auth (2)**
- `GET /api/auth/registration-requests/:id` — 단일 가입 요청 상세
- `GET /api/auth/dev/password-reset/latest?email=` — 비-prod 브리지 (의도적 가능)

**Projects (2)**
- `PUT /api/projects/:id` — 프로젝트 rename/update
- `DELETE /api/projects/:pid/source` — 소스 일괄 삭제

**SDK (3)**
- `GET /api/sdk-profiles`
- `GET /api/sdk-profiles/:id`
- `GET /api/projects/:pid/sdk/metrics`

**Pipeline (2)**
- `POST /api/projects/:pid/pipeline/prepare`
- `POST /api/projects/:pid/pipeline/prepare/:targetId`

**Analysis (4)**
- `POST /api/analysis/deep`
- `POST /api/analysis/abort/:analysisId`
- `GET /api/analysis/results` (list)
- `DELETE /api/analysis/results/:analysisId`

**Findings (1)**
- `GET /api/projects/:pid/findings/summary`

**Gate (1)**
- `GET /api/projects/:pid/gates/runs/:runId`

**Approval (1)**
- `GET /api/approvals/:id`

### 4.2 ⚠️ DRIFT (shape/응답 정합 어긋남 — 11+9 = 20건)

**REST (11)**
1. `source.ts:143–145` `UploadStatusSnapshot`에 `message`/`error` 누락.
2. `projects.ts:56` `fetchProjectOverview` envelope unwrap 일관성 깨짐.
3. `pipeline.ts:62` PUT BuildTarget에서 `includedPaths` silently strip — UI gating 부재.
4. `pipeline.ts:146` `runPipelineTarget` response type에 `pipelineId` 누락.
5. `pipeline.ts:154–168` `PipelineStatusResponse` type 좁음, hook duck access.
6. `pipeline.ts:73–86` `discoverBuildTargets`에서 `discovered/created/elapsedMs` 폐기.
7. `pipeline.ts:18` `createBuildTarget`이 contract 옵션 `buildSystem?` 미전송.
8. `core.ts:6–13` `HealthCheckResponse`가 contract control aggregate 필드 미반영, `?requestId=` 미전송.
9. `sdk.ts:84–99` `registerSdkByPath`는 contract 미정의 `localPath` 사용 (`@deprecated`).
10. `notifications.ts:17–23` `fetchNotificationCount`이 `apiFetch` 결과 unwrap 없이 return.
11. `approval.ts:114–119` `fetchApprovalCount`에 contract 미정의 `total` 필드 추가.

**WebSocket (9)** — §3.3 참조.

### 4.3 ⚠️ DEAD / 호출자 부재 (7건)

1. `sdk.ts:84` `registerSdkByPath` — `localPath` deprecated.
2. `report.ts:34` `fetchModuleReport(static)` — 호출자 0.
3. 동상 (`dynamic`) — 호출자 0.
4. 동상 (`test`) — 호출자 0.
5. `gate.ts:31` `fetchGateDetail` — 호출자 0.
6. `gate.ts:51` `fetchGateProfiles` — 호출자 0.
7. `wsEnvelope.ts:248–304` `createHeartbeat` — 호출자 0, contract와 충돌하는 client ping/pong 형식.

### 4.4 ✅ OK 카운트

- REST 그룹1: 48 endpoint 깔끔히 커버
- REST 그룹2: 34 endpoint 깔끔히 커버
- WS infra: envelope/4000 close/seq tracker(4 hook)/REST-first recovery(5 hook) 모두 contract 충실
- Dynamic 도메인: REST 13/13 + WS dynamic-analysis/dynamic-test 모두 토픽 매칭

---

## 5. 핵심 메시지

1. **WS contract는 zero CRITICAL violation** — 인프라(`wsEnvelope.ts`)와 4000 close/envelope 모델 정확. 사용자가 강조한 영역에서 구조적 결함 없음.
2. 그러나 **WS consumer 간 디시플린 불균등** — 핵심 progress hook 4개(analysis/upload/sdk/pipeline)는 seq 추적·REST fallback 정착, 보조 hook 4개(dynamic-test/notification/activity-feed/monitoring)는 seq 추적·`onGiveUp` 누락. retry 소진 시 silent dead-channel UX 위험.
3. **REST에서 12 endpoint가 미연결** — `pipeline/prepare`, `analysis/deep`, `analysis/abort`, `findings/summary`, `approvals/:id` 등은 사용자 시나리오 직결. 특히 `prepare` endpoint 미연결은 BuildTarget 빌드-검증 분리 흐름 자체가 동작하지 않음을 의미.
4. **`useDashboardActivityFeed.ts`는 envelope을 무시하고 raw frame을 trigger로 사용** — heartbeat 30s마다 불필요한 REST refresh 발생. 트래픽 회귀 위험.
5. `createHeartbeat()`은 dead code이자 contract와 충돌하는 client ping/pong 형식 — 향후 누군가 wire하면 서버가 모르는 traffic을 발생시킴. 제거 권고 대상.

---

## 6. 권고 (다음 cycle, 본 보고서는 코드 수정 0건)

| 우선순위 | 항목 | 이유 |
|---|---|---|
| P0 | WS `onGiveUp` 누락 5곳 보강 (sdk/dynamic-test/notification/activity-feed/monitoring) | retry 소진 후 dead-channel UX 미고지 |
| P0 | `useDashboardActivityFeed.ts` envelope-aware refactor | heartbeat 30s마다 불필요 REST refresh 발생 |
| P0 | `pipeline/prepare(/:targetId)` consumer 추가 | BuildTarget 빌드-검증 분리 contract 핵심 흐름 미연결 |
| P1 | WS seq gap-tracker 4개 hook 추가 (notification/dynamic-test/monitoring/activity-feed) | 메시지 누락 무자각 |
| P1 | `analysis/deep`, `analysis/abort/:id`, `analysis/results DELETE`, `findings/summary` consumer 추가 | UX 시나리오 직결 |
| P1 | `pipeline.ts:62` PUT BuildTarget — silently strip 대신 UI gating | 사용자 의도와 다른 결과 |
| P2 | type drift 정리 — `UploadStatusSnapshot`, `PipelineStatusResponse`, `HealthCheckResponse`, `runPipelineTarget` response | 런타임 duck access 의존성 제거 |
| P2 | `notifications.ts:17` envelope unwrap 일관화 | 잠재 runtime shape mismatch |
| P2 | `createHeartbeat()` 제거 또는 contract-aligned로 명세화 | dead code + 잘못 wire 시 서버 미인식 traffic |
| P3 | dead caller 정리 (`fetchModuleReport`, `fetchGateDetail`, `fetchGateProfiles`, `registerSdkByPath`) | 코드 청결 |
| P3 | `?filter=source` 같은 contract optional param 활용 | UX 개선 여지 |
| P3 | `discoverBuildTargets` 응답에서 `discovered/created/elapsedMs` 활용 (토스트 등) | 사용자 가시성 |

---

## 7. 메타

- 본 감사는 **read-only**. 명시적 코드 수정 0건.
- WS 영역(`wsEnvelope.ts`, `dto.ts`)과 broadcaster는 S2/shared 영역이므로 **사용자 전달 후 다음 cycle WR로 분리** 권장 — 직접 수정 금지(memory: 타 서비스 코드 열람 금지).
- 본 cycle에 발생한 변경사항(`/scriptHintPath` 풀 포팅 + UI + critic 처리)은 별도 cycle 2로 이미 종결, 본 감사와 독립.
- 14 API 모듈 + 8 WS consumer 전수 검사 완료. contract 89 REST endpoint + 7 WS endpoint 중 총 96개 surface 점검.
