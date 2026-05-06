---
title: "S2 API 엔드포인트 전체 목록"
page_type: "canonical-handoff"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s2-handoff/api-endpoints.md"
original_path: "docs/s2-handoff/api-endpoints.md"
last_verified: "2026-05-02"
service_tags: ["s2"]
decision_tags: []
related_pages: ["wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
---

# S2 API 엔드포인트 전체 목록

> S2(AEGIS Core)가 S1에 제공하는 모든 REST API + WebSocket 엔드포인트
> 진입점: `README.md` → 필요 시 이 문서 참조
> 엔드투엔드 맥락이 먼저 필요하면 [[wiki/context/project/end-to-end-scenarios|AEGIS 대표 시나리오별 통신 흐름]]을 함께 본다.
> 2026-05-02 구현 감사: `router-setup.ts`와 mounted controllers 기준으로 재점검했고,
> SDK delete project-scope, upload/analysis WS subscribe-time snapshot, S7 caller-owned generation tuple 반영 상태를 보강했다.

---

## 5. API 엔드포인트 전체 목록

현재 `services/backend/src/router-setup.ts` 기준으로 활성 라우터만 정리했다.

### 공통 / 프로젝트 / 파일

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 헬스체크 (`?requestId=` optional). LLM Gateway, S3 Agent, S4 SAST Runner, S5 KB, Build Agent, Adapter 상태를 집계하고, downstream `requestSummary`가 있으면 normalized `control.pollDecision`을 함께 반환 |
| POST | `/api/projects` | 프로젝트 생성. 인증된 요청이면 생성자 프로필을 `owner`로 저장 |
| GET | `/api/projects` | 프로젝트 목록. `ProjectListItem.owner?` 포함 가능(미보유/migrated row는 omit) |
| GET | `/api/projects/:id` | 프로젝트 상세 |
| PUT | `/api/projects/:id` | 프로젝트 수정 (`name`이 공백만 오면 `400`) |
| DELETE | `/api/projects/:id` | 프로젝트 삭제 (`409` blocker / uploads quarantine / DB delete / DB 실패 시 restore) |
| GET | `/api/projects/:id/overview` | 프로젝트 개요/집계 |
| GET | `/api/projects/:projectId/files` | 프로젝트 파일 목록 |
| GET | `/api/files/:fileId/content` | 파일 내용 조회 |
| GET | `/api/files/:fileId/download` | 파일 다운로드 |
| DELETE | `/api/projects/:projectId/files/:fileId` | 프로젝트 파일 삭제 |

프로젝트 owner 메모 (2026-04-27):

- `ProjectListItem.owner?: ProjectOwnerSummary`가 추가됐다. `id`, `name`, `avatar?`, `kind?`를 포함한다.
- `POST /api/projects`는 `req.user`가 있는 경우 해당 사용자 프로필을 프로젝트 owner로 저장한다.
- 기존/migrated 프로젝트나 soft-auth unauthenticated 생성처럼 S2가 생성자 정보를 보유하지 못한 경우 `owner`를 omit한다.
- owner 변경, multi-owner, 이미지 avatar URL은 현 cycle 범위 밖이다.

프로젝트 CRUD 메모 (2026-04-09):

- `PUT /api/projects/:id`
  - `name`이 전달된 경우 trim 후 저장
  - trim 결과 빈 문자열이면 `400 { success: false, error: "name is required" }`
- `DELETE /api/projects/:id`
  - 단순 row delete가 아니라 safe teardown workflow다.
  - 현재 blocker authority:
    - active analysis
    - connected adapters
    - dynamic-analysis sessions (`connected|monitoring`)
    - running dynamic-test
    - non-terminal SDK states
    - active pipeline targets
  - blocker가 있으면 `409 CONFLICT` + `errorDetail.blockers`
  - success path는 `uploads/{projectId}` quarantine 후 project-scoped DB row delete를 수행하고, DB 실패 시 quarantined root를 restore한다.

Health control-signal 메모 (2026-04-14):

- `GET /health?requestId=<rid>`
  - S2는 child `/v1/health?requestId=<rid>` 를 호출한다.
  - 응답 top-level에는 `controlPolicyVersion: "health-control-signal-rollout-v1"` 와 `requestIdQueried` 가 additive하게 포함된다.
  - 각 child service entry(`llmGateway`, `analysisAgent`, `sastRunner`, `knowledgeBase`, `buildAgent`)는
    - coarse `status: ok | degraded | unreachable`
    - raw child payload `detail`
    - frozen request-aware 필드가 있을 때 normalized `control`
      (`state`, `localAckState`, `blockedReason`, `pollDecision`, `decisionReasons`)
    를 포함할 수 있다.
- S2 현재 normalize 규칙:
  - `queued` → `continue_waiting`
  - `running + phase-advancing` → `continue_waiting`
  - `running + transport-only` → `continue_waiting`
  - `blockedReason != null`, `state=failed`, `localAckState=ack-break` → `chain_abort`
  - legacy S4 `ackStatus=broken` → `localAckState=ack-break`

### 프로젝트 설정 / 활동 / 알림 / 인증

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/projects/:pid/adapters` | 프로젝트 어댑터 목록 |
| POST | `/api/projects/:pid/adapters` | 프로젝트 어댑터 등록 |
| PUT | `/api/projects/:pid/adapters/:id` | 프로젝트 어댑터 수정 |
| DELETE | `/api/projects/:pid/adapters/:id` | 프로젝트 어댑터 삭제 |
| POST | `/api/projects/:pid/adapters/:id/connect` | 프로젝트 어댑터 연결 |
| POST | `/api/projects/:pid/adapters/:id/disconnect` | 프로젝트 어댑터 해제 |
| GET | `/api/projects/:pid/settings` | 프로젝트 설정 조회 |
| PUT | `/api/projects/:pid/settings` | 프로젝트 설정 수정 |
| GET | `/api/projects/:pid/activity` | 최근 활동 타임라인 (`?limit=` 지원) |
| GET | `/api/projects/:pid/notifications/count` | 미읽음 알림 수 |
| PATCH | `/api/projects/:pid/notifications/read-all` | 프로젝트 알림 전체 읽음 처리 |
| GET | `/api/projects/:pid/notifications` | 프로젝트 알림 목록 (`?unread=true` 지원) |
| PATCH | `/api/notifications/:id/read` | 개별 알림 읽음 처리 |
| POST | `/api/auth/login` | 로그인 (`rememberMe?: boolean` 지원; `username` 필드는 v1에서 login identifier로 해석) |
| POST | `/api/auth/logout` | 로그아웃 (token optional, public route 유지) |
| GET | `/api/auth/orgs/:code/verify` | 조직 코드 preview 조회 (signup UX용 public route) |
| POST | `/api/auth/register` | org-code 기반 가입 요청 생성 (`202`, `lookupToken` 반환) |
| GET | `/api/auth/registrations/lookup/:lookupToken` | public registration status lookup (high-entropy lookup token only) |
| POST | `/api/auth/password-reset/request` | 비밀번호 재설정 요청 (`202`, 계정 존재 여부 비노출) |
| GET | `/api/auth/dev/password-reset/latest?email=` | 로컬/non-production mock bridge: 최신 active reset token 조회 |
| POST | `/api/auth/password-reset/confirm` | 비밀번호 재설정 확정 (`token`, `newPassword`) |
| GET | `/api/auth/me` | 현재 사용자 정보 (authenticated) |
| GET | `/api/auth/users` | 관리자용 사용자 목록 (org-admin = same-org only, platform-admin bypass 허용) |
| GET | `/api/auth/registration-requests` | 관리자용 가입 요청 목록 |
| GET | `/api/auth/registration-requests/:id` | 관리자용 가입 요청 상세 |
| POST | `/api/auth/registration-requests/:id/approve` | 관리자 승인 + 역할 배정; 승인 즉시 login 가능 |
| POST | `/api/auth/registration-requests/:id/reject` | 관리자 거절 (terminal rejection) |

Auth v1 메모 (2026-04-20):
- lifecycle는 `org verify → register(pending_admin_review) → org-admin approve/reject → approved 즉시 login 가능` 이다.
- `Invite`는 v1 범위에서 제거됐다.
- 비밀번호는 registration 시점에 수집하며, 승인 후 별도 invite/activation step 없이 바로 인증 가능하다.
- public route는 `/api/auth/login`, `/api/auth/logout`, `/api/auth/orgs/:code/verify`, `/api/auth/register`, `/api/auth/registrations/lookup/:lookupToken`, `/api/auth/password-reset/request`, `/api/auth/dev/password-reset/latest`, `/api/auth/password-reset/confirm` 로 명시적으로 제한된다. 단, `/api/auth/dev/password-reset/latest` 는 non-production bridge route 이다.
- auth public route rate limiting is persisted in SQLite `auth_rate_limit_events`, so limits survive process restarts on the same backend instance.
- remember-me session policy:
  - default TTL `24h`
  - remember-me TTL `30d`
- lookup token TTL `30d`, password reset token TTL `1h`
- local mock-to-real bridge defaults (non-production):
  - fixture organizations/admins seeded on startup when `AEGIS_AUTH_DEV_FIXTURES=true` (or when `NODE_ENV` is `development` / `test`)
  - fixture org-admin password defaults to `Admin1234!` unless `AEGIS_AUTH_DEV_ADMIN_PASSWORD` overrides it
  - seeded org/admin pairs: `ACME-KR-SEC`/`acme-admin`, `HYUNDAI-AVSEC`/`hyundai-admin`, `LG-EV-SECOPS`/`lges-admin`
  - password-reset dev bridge route is enabled when `AEGIS_AUTH_DEV_PASSWORD_RESET_BRIDGE=true` (or when `NODE_ENV` is `development` / `test`) and reads SQLite `dev_password_reset_deliveries`
- registration approve/reject/lookup returns the full `RegistrationRequest` shape with populated `organizationCode` / `organizationName`.
- BuildTarget Quick preflight uses canonical `BuildTarget.sdkChoiceState`; `sdk-unresolved` means Quick must be disabled until SDK choice is explicit.
- For S4 native/custom scans, S2 strips local `buildProfile.sdkId: "custom"` before calling S4; native scans omit `sdkId`.
- S3 `/v1/tasks` `status=completed` means the Analysis Agent returned a valid review envelope, not necessarily a clean Deep pass. S2 preserves additive `claimDiagnostics` / `evidenceDiagnostics`; `claims[]` remains accepted-final-only.
- S3 `/v1/tasks` `status=completed` means the Analysis Agent returned a valid review envelope, not necessarily a clean Deep pass. S2 persists `analysisOutcome` / `qualityOutcome` / `pocOutcome` / `recoveryTrace`; clean Deep pass requires `analysisOutcome=accepted_claims` and `qualityOutcome=accepted`. Non-clean but valid-input outcomes remain completed results with review/warning signals, while true task failures may return non-2xx and preserve `failureCode` / `failureDetail`.
- rate limits:
  - org verify `10/min/IP`
  - register `5/min/IP`, `3 active pending requests / 24h / email`
  - password reset request `5/min/IP`, `3/hour/email`

### 프로파일 / SDK 레지스트리 / 타겟 라이브러리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/sdk-profiles` | SDK 프로파일 목록 |
| GET | `/api/sdk-profiles/:id` | SDK 프로파일 상세 |
| GET | `/api/gate-profiles` | Gate 프로필 목록 |
| GET | `/api/gate-profiles/:id` | Gate 프로필 상세 |
| GET | `/api/projects/:pid/sdk` | 프로젝트 SDK 레지스트리 목록 |
| GET | `/api/projects/:pid/sdk/:id` | 등록 SDK 상세 (re-entry / reconnect recovery source; phase/retry metadata 포함) |
| GET | `/api/projects/:pid/sdk/quota` | 프로젝트 SDK storage quota/usage 조회 |
| GET | `/api/projects/:pid/sdk/metrics` | SDK 등록/phase duration aggregate metrics 조회 |
| GET | `/api/projects/:pid/sdk/:id/log` | SDK install log tail/pagination/download 조회 (`?tailLines=`, `?offset=&limit=`, `?download=true`) |
| POST | `/api/projects/:pid/sdk/:id/retry` | 실패 SDK 재시도 (`fromPhase?: analyzing|verifying`, retained/materialized artifact 필요) |
| POST | `/api/projects/:pid/sdk` | SDK 등록 (현재 mounted 경로는 multipart project-scoped upload; 단일 archive / 단일 `.bin` / multi-file folder upload 지원. 폴더 업로드는 클라이언트가 상대경로를 보존해서 보내야 함) |
| DELETE | `/api/projects/:pid/sdk/:id` | SDK 삭제 |

SDK delete project-scope 메모 (2026-05-02):

- `DELETE /api/projects/:pid/sdk/:id`는 route `:pid`와 SDK 소유 project가 일치할 때만 삭제한다.
- SDK id가 존재해도 다른 project 소속이면 `404 NOT_FOUND`로 응답하고 삭제하지 않는다.
| GET | `/api/projects/:pid/targets/:tid/libraries` | 타겟별 서드파티 라이브러리 목록 |
| PATCH | `/api/projects/:pid/targets/:tid/libraries` | 라이브러리 포함 여부 일괄 수정 |

### 소스 / 빌드 타겟 / 파이프라인 / 분석

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/projects/:pid/source/upload` | ZIP/tar.gz 소스 업로드 |
| GET | `/api/projects/:pid/source/upload-status/:uploadId` | 업로드 상태 폴링 폴백 + re-entry recovery (`UploadStatus`: `phase/message/fileCount?/projectPath?/error?`) |
| POST | `/api/projects/:pid/source/clone` | Git URL 클론 |
| GET | `/api/projects/:pid/source/files` | 소스 파일 트리 (`?filter=source` 지원, `composition/totalFiles/totalSize/targetMapping` 포함). file-explorer/source-list output에서는 managed SDK subtree `uploads/{projectId}/sdk/**` 제외 |
| GET | `/api/projects/:pid/source/file` | 파일 내용 읽기 (`?path=` 필수) |
| DELETE | `/api/projects/:pid/source` | 소스 삭제 |
| GET | `/api/projects/:pid/targets` | 빌드 타겟 목록 |
| POST | `/api/projects/:pid/targets` | 빌드 타겟 생성 `{ name, relativePath, buildProfile?, buildSystem?, includedPaths? }` |
| PUT | `/api/projects/:pid/targets/:id` | 빌드 타겟 수정 (`includedPaths` 변경은 현재 `400 InvalidInput`) |
| DELETE | `/api/projects/:pid/targets/:id` | 빌드 타겟 삭제 |
| GET | `/api/projects/:pid/targets/:id/build-log` | 타겟 빌드 로그 조회 |
| POST | `/api/projects/:pid/targets/discover` | 빌드 타겟 자동 탐색 (S4 호출) |
| POST | `/api/projects/:pid/pipeline/prepare` | 빌드 준비만 실행 (`202 { preparationId, status: "running" }`) |
| POST | `/api/projects/:pid/pipeline/prepare/:targetId` | 단일 타겟 빌드 준비만 실행 (`202 { preparationId, targetId, status: "running" }`) |
| POST | `/api/projects/:pid/pipeline/run` | 전체 파이프라인 실행 (`202 { pipelineId, status: "running" }`); 이후 WS/notifications correlation key는 `pipelineId` |
| POST | `/api/projects/:pid/pipeline/run/:targetId` | 단일 타겟 파이프라인 재실행 (`202 { pipelineId, targetId, status: "running" }`) |
| GET | `/api/projects/:pid/pipeline/status` | 프로젝트 파이프라인 상태 |
| POST | `/api/analysis/quick` | BuildTarget-only Quick 실행 (`202`, body: `{ analysisId, buildTargetId, executionId, status }`) |
| POST | `/api/analysis/deep` | BuildTarget-only Deep 실행 (`202`, body: `{ analysisId, buildTargetId, executionId, status }`) |
| GET | `/api/analysis/status` | 모든 진행 중 분석 |
| GET | `/api/analysis/status/:analysisId` | 단일 분석 진행률 (`buildTargetId`, `executionId` 포함; disconnect/re-entry recovery source while running) |
| POST | `/api/analysis/abort/:analysisId` | 분석 중단 |
| GET | `/api/analysis/results` | 결과 목록 (`?projectId=` 지원) |
| GET | `/api/analysis/results/:analysisId` | 결과 상세 |
| DELETE | `/api/analysis/results/:analysisId` | 결과 삭제 |
| GET | `/api/analysis/summary` | 대시보드 요약 (static+deep 합산, `?projectId=` 필수, `&period=` 선택) |
| POST | `/api/analysis/poc` | PoC 생성 `{ projectId, findingId }` → S3 generate-poc |

### 동적 분석 / 동적 테스트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/dynamic-analysis/sessions` | 동적 분석 세션 생성 |
| GET | `/api/dynamic-analysis/sessions` | 동적 분석 세션 목록 (`?projectId=` 지원) |
| GET | `/api/dynamic-analysis/sessions/:id` | 세션 상세 |
| POST | `/api/dynamic-analysis/sessions/:id/start` | 세션 시작 |
| DELETE | `/api/dynamic-analysis/sessions/:id` | 세션 종료 + 종합 분석 |
| GET | `/api/dynamic-analysis/scenarios` | 공격 시나리오 목록 |
| POST | `/api/dynamic-analysis/sessions/:id/inject` | 단일 CAN 메시지 주입 |
| POST | `/api/dynamic-analysis/sessions/:id/inject-scenario` | 시나리오 주입 |
| GET | `/api/dynamic-analysis/sessions/:id/injections` | 주입 이력 조회 |
| POST | `/api/dynamic-test/run` | 동적 테스트 실행 |
| GET | `/api/dynamic-test/results` | 테스트 결과 목록 (`?projectId=` 지원) |
| GET | `/api/dynamic-test/results/:testId` | 테스트 결과 상세 |
| DELETE | `/api/dynamic-test/results/:testId` | 테스트 결과 삭제 |

### Run / Finding / Gate / Approval / Report

QualityGate / Approvals mock-absorption contract memo (2026-04-26):

- `GateRuleResult` now includes optional backend-owned metric fields `current`, `threshold`, `unit`, and mirrored `meta`; S1 must not hardcode threshold maps.
- `GateResult` now includes optional `profileId`, `commit`, `branch`, `requestedBy`; automatic gate evaluation currently fills `profileId` and `requestedBy=system`, while `commit/branch` remain optional unless known to S2.
- `ApprovalRequest` now includes optional `impactSummary` and `targetSnapshot`; gate override requests are populated from the gate, and accepted-risk requests are populated from visible finding data when that path creates an approval.
- Contract details and TypeScript snippets live in `wiki/canon/api/shared-models.md` under “Gate / approval additive mock-absorption fields (S1 WR 2026-04-26)”.

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/projects/:pid/runs` | 프로젝트 Run 목록 |
| GET | `/api/runs/:id` | Run 상세 |
| GET | `/api/projects/:pid/findings` | Finding 목록 (`status`, `severity`, `module`, `sourceType`, `q`, `sort`, `order` 필터 지원) |
| GET | `/api/projects/:pid/findings/summary` | Finding 집계 |
| GET | `/api/projects/:pid/findings/groups` | Finding 그룹 조회 (`?groupBy=ruleId|location`) |
| PATCH | `/api/findings/bulk-status` | Finding 벌크 상태 변경 |
| GET | `/api/findings/:id/history` | Finding fingerprint 이력 |
| GET | `/api/findings/:id` | Finding 상세 |
| PATCH | `/api/findings/:id/status` | Finding 상태 변경 |
| GET | `/api/projects/:pid/gates` | 프로젝트 Gate 결과 목록 |
| GET | `/api/projects/:pid/gates/runs/:runId` | 특정 Run의 Gate 결과 |
| GET | `/api/gates/:id` | Gate 상세 |
| POST | `/api/gates/:id/override` | Gate override 요청 (Approval 생성) |
| GET | `/api/projects/:pid/approvals/count` | 프로젝트 승인 대기 수 |
| GET | `/api/projects/:pid/approvals` | 프로젝트 Approval 목록 |
| GET | `/api/approvals/:id` | Approval 상세 |
| POST | `/api/approvals/:id/decide` | Approval 승인/거부 |
| GET | `/api/projects/:pid/report` | 프로젝트 전체 보고서 |
| GET | `/api/projects/:pid/report/static` | 정적 분석 보고서 |
| GET | `/api/projects/:pid/report/dynamic` | 동적 분석 보고서 |
| GET | `/api/projects/:pid/report/test` | 동적 테스트 보고서 |
| POST | `/api/projects/:pid/report/custom` | 커스터마이징 보고서 |

### WebSocket 채널

| 메서드 | 경로 | 설명 | Recovery / source of truth |
|--------|------|------|----------------------------|
| WebSocket | `/ws/notifications?projectId=` | 프로젝트 알림 실시간 push (background completion awareness) | `GET /api/projects/:pid/notifications`, `GET /api/projects/:pid/notifications/count` |
| WebSocket | `/ws/dynamic-analysis?sessionId=` | 동적 분석 실시간 이벤트 | out-of-scope for current progress/completion hardening |
| WebSocket | `/ws/dynamic-test?testId=` | 동적 테스트 진행률 | out-of-scope for current progress/completion hardening |
| WebSocket | `/ws/analysis?analysisId=` | explicit Quick / explicit Deep 진행률 | `GET /api/analysis/status/:analysisId`, `GET /api/analysis/results/:analysisId` |
| WebSocket | `/ws/upload?uploadId=` | 소스 업로드 진행률 | `GET /api/projects/:pid/source/upload-status/:uploadId` |
| WebSocket | `/ws/pipeline?projectId=` | 파이프라인 타겟 상태 스트림 | `GET /api/projects/:pid/pipeline/status` |
| WebSocket | `/ws/sdk?projectId=` | SDK 업로드/설치/검증 진행률 (`uploading`,`uploaded`,`extracting`/`installing`,`extracted`/`installed`,`analyzing`,`verifying`,`ready`) + install-log stream (`sdk-log`) | `GET /api/projects/:pid/sdk`, `GET /api/projects/:pid/sdk/:id`, `GET /api/projects/:pid/sdk/:id/log` |

운영 의미론:

- `/ws/upload`, `/ws/sdk`, `/ws/analysis`, `/ws/pipeline` 는 **foreground progress** 채널이다.
- `/ws/notifications` 는 **background completion awareness** 채널이다.
- `/ws/upload?uploadId=` 와 `/ws/analysis?analysisId=` 는 새 구독자가 붙을 때 backend가 보유 중인 최신 snapshot을 즉시 1회 보낼 수 있다. 이는 durable replay가 아니라 편의 기능이며, REST recovery endpoint가 여전히 authoritative source다.
- 사용자가 화면을 이동하거나 재연결한 뒤에는 WS replay를 기대하지 말고, 위 표의 REST/status surface를 authoritative recovery path로 사용해야 한다.

Deep outcome / cleanPass UI contract memo (2026-04-25):

- `AnalysisResult.analysisOutcome`, `qualityOutcome`, `pocOutcome`, `recoveryTrace` are additive REST/shared fields for Deep results; old/non-Deep rows may omit them.
- `cleanPass` is currently a WebSocket convenience field on `analysis-deep-complete`, not a persisted REST field. REST consumers derive it from `status=completed && analysisOutcome=accepted_claims && qualityOutcome=accepted`.
- `analysis-deep-complete` success paths populate outcome fields + `cleanPass`; `recoveryTrace` is recovered through REST result detail, not the WS payload.
- `analysis-quick-complete` and `analysis-error` do not carry these outcome fields. True task failures are error surfaces, not synthesized `inconclusive` completed results.
- S1 display guidance, bilingual copy, cleanPass matrix, recoveryTrace schema, and forward-compat defaults are canonicalized in `wiki/canon/api/shared-models.md` §2.6.1.

SDK second follow-up implementation memo (2026-04-25):

- Full A1-O2 SDK follow-up implementation answers are canonicalized in `wiki/canon/api/shared-models.md` §4.5.1.
- Current-cycle S2 now implements additive SDK runtime fields and endpoints: upload `etaSeconds`, `phaseStartedAt`, persisted `phaseHistory`, `phaseDetail`, conservative `retryable` / `recoverable`, structured SDK error `code`, wiki-canonical `troubleshootingUrl`, server-side retry endpoint, quota endpoint, log pagination/download, SDK metrics endpoint, and app-level WS heartbeat messages.
- Current usable surfaces: integer upload percent cadence, server `meta.timestamp`/`seq`, project-scoped `/ws/sdk`, live `sdk-log`, REST log tail/pagination/download, `GET /sdk` ordering by `created_at DESC`, optional profile metadata, `GET /sdk/quota`, `GET /sdk/metrics`, and `POST /sdk/:id/retry` for retained/materialized failed SDKs.
- In-flight `DELETE /sdk/:id` is still not a supported cancellation contract; S1 must not show it as guaranteed cancel until a future S2 cancellation WR is implemented.
- 2026-05-02 감사 기준 `DELETE /api/projects/:pid/sdk/:id`는 project-scoped delete다. SDK id가 존재해도 route `:pid`와 소유 project가 다르면 `404 NOT_FOUND`로 응답하고 삭제하지 않는다.

S7 caller-owned generation-control 메모 (2026-05-02):

- S2 direct LLM calls through `LlmTaskClient` now send the full S7 `/v1/tasks.constraints` generation tuple required by `wiki/canon/api/llm-gateway-api.md`.
- Backfilled defaults for missing fields are `enableThinking=true`, `maxTokens=16384`, `temperature=0.6`, `topP=0.95`, `topK=20`, `minP=0.0`, `presencePenalty=0.0`, `repetitionPenalty=1.0`.
- Existing caller-provided `maxTokens`, `timeoutMs`, and `outputSchema` are preserved.

SDK 진행률 계약 메모 (2026-04-25 updated):

- S2의 canonical SDK state machine은 9 progress phases + 4 error phases다. S1이 5단계 stepper로 묶는 것은 허용되며, S2 승인 매핑은 `업로드=uploading/uploaded`, `설치/압축해제=extracting/extracted/installing/installed`, `AI 분석=analyzing`, `검증=verifying`, `완료=ready` 이다.
- artifact kind별 정상 흐름:
  - archive: `uploading → uploaded → extracting → extracted → analyzing → verifying → ready`
  - bin: `uploading → uploaded → installing → installed → analyzing → verifying → ready`
  - folder: `uploading → uploaded → extracting → extracted → analyzing → verifying → ready`
- `sdk-progress` payload는 업로드 중 `etaSeconds`, 각 phase의 `phaseStartedAt`, 구조화 `phaseDetail`을 포함할 수 있다. 비업로드 phase ETA는 신뢰 가능한 추정이 없으면 생략한다.
- `RegisteredSdk`는 `currentPhaseStartedAt`, `phaseHistory`, `retryCount`, `retryable`, `retryExpiresAt`을 포함할 수 있다.
- `message`는 현재 phase의 사람이 읽는 ko-KR status text다. 안정적인 분기/i18n에는 `phaseDetail.kind + params`를 우선 사용한다.
- `fileName`은 optional이며 upload/uploaded/archive extracting/bin installing에서 주로 들어간다. 값은 표시용 basename/제출 filename이며 absolute server path contract가 아니다. 긴 이름 축약은 frontend 책임이다.
- 실패 SDK retry는 `POST /api/projects/:pid/sdk/:id/retry`이며, retained/materialized artifact가 있고 quota/cooldown/retention을 통과할 때만 성공한다. `retryable=false`이면 재업로드 UX를 사용한다.
- 로그 보기는 `GET /api/projects/:pid/sdk/:id/log` 응답의 `content`를 사용한다. `offset/limit` pagination과 `download=true` text attachment를 지원한다. `logPath`는 server-side correlation/debug 필드다.
- `troubleshootingUrl`은 `wiki/canon/troubleshooting/sdk#<code>` 형태의 wiki-canonical anchor다.
