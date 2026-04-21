---
title: "S2. AEGIS Core (Backend) 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s2-handoff/README.md"
last_verified: "2026-04-20"
service_tags: ["s2"]
decision_tags: []
related_pages: ["wiki/context/project/end-to-end-scenarios.md"]
---

# S2. AEGIS Core (Backend) 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.** 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다.
> 이 문서는 S2(AEGIS Core/Backend) 개발을 이어받는 다음 세션을 위한 진입점이다.
> 상세 정보는 같은 디렉토리의 분할 문서를 참조한다.
> **마지막 업데이트: 2026-04-20**
> 빠른 cross-service 흐름 복기가 필요하면 [[wiki/context/project/end-to-end-scenarios|AEGIS 대표 시나리오별 통신 흐름]]을 먼저 본다.

---

## 문서 구조

| 문서 | 내용 |
|------|------|
| **이 파일 (README.md)** | 역할, 경계, 현재 상태, 관리 문서, 참조 |
| [architecture.md](architecture.md) | 구현 현황, DB 스키마, 핵심 로직, 의존성, 실행 방법, Observability |
| [api-endpoints.md](api-endpoints.md) | API 엔드포인트 전체 목록 (현재 라우터 구현 반영) |
| [roadmap.md](roadmap.md) | 다음 작업, 후순위, 인프라 계획 |
| session-{N}.md / session-omx-*.md | 세션별 작업 로그 (legacy numbered sessions + deterministic omx sessions) |

---

## 1. 프로젝트 전체 그림

```
                  S1 / S1-QA (Frontend :5173)
                          │
                     S2 (AEGIS Core :3000)  ← 플랫폼 오케스트레이터
                    ╱     │     ╲      ╲
                 S3       S4     S5      S6
               Agent    SAST     KB    동적분석
              :8001    :9000   :8002    :4000
                │
           S7 Gateway (:8000)  ← LLM 단일 관문
                │
           LLM Engine (DGX Spark)
           Qwen3.5-122B-A10B-GPTQ-Int4
```

**S2가 전체 오케스트레이터.** S1에게 API를 제공하고, S3/S4/S5/S6/S7를 호출하는 중추.
- 운영 상으로는 **S1-QA가 S1과 별도 세션**으로 프론트엔드 QA를 담당한다. 서비스 토폴로지는 동일하고, S2 입장에서는 QA 이슈/피드백의 별도 발신자라고 보면 된다.

### 보안 검증 구조

```
사용자: 소스코드 업로드 + SDK 업로드
  → [Build 준비] S2 → S3 Build Agent → S4 compile_commands.json 준비
  → [Quick] 사용자가 명시적으로 요청한 1회성 S4 호출 + S5 GraphRAG 형성 (~30초)
  → [Deep]  사용자가 명시적으로 요청한 S3 Agent 심층 분석 (~3분)
```

---

## 2. 너의 역할과 경계

### 너는

- **AEGIS Core 개발자 + 플랫폼 오케스트레이터 + 인프라 스크립트 담당**
- `services/backend/` 하위 코드를 소유
- `services/shared/` 공유 타입 패키지를 **단독 소유**
- `scripts/start.sh`, `scripts/stop.sh` 통합 기동/종료 스크립트 소유
- S1에게 API를 제공하고, S3/S4/S5/S6/S7를 호출하는 전체 오케스트레이터

### API 계약 소통 원칙 (필수)

- **다른 서비스의 코드를 절대 읽지 않는다** — API 계약서(`wiki/canon/api/`)로만 소통
- **S2는 `wiki/canon/api/shared-models.md`의 단독 소유자** — 코드 변경 시 계약서 동기화 필수
- 공유 모델 변경 시 영향받는 서비스에 work-request로 고지

### 작업 요청

- **새 canonical WR 경로**: `wiki/canon/work-requests/`
- **legacy archive 경로**: `docs/work-requests/`
- 세션 시작 시:
  1. **active canonical WR**는 `wiki/canon/work-requests/`를 기준으로 확인
  2. `docs/work-requests/`는 historical archive/reference로만 취급
- **2026-04-06 기준 메모**
  - WR-only wiki MCP hardening 완료
  - runtime WR semantics는 **new canonical WR only**
  - archived `docs/work-requests/**`는 **runtime out-of-scope**
  - canonical WR 디렉토리는 비어 있을 수 있으며, 이는 정상 상태다

### Codex / OMX 운영 메모

- 하드 가드레일 재확인:
  - S2도 **다른 서비스 코드를 읽지 않는다**. 연동은 API 계약서만 본다.
  - 다른 서비스와의 소통은 **WR로만** 한다.
  - 계약이 비어 있거나 낡았으면 추측하지 말고 담당자에게 WR을 보낸다.
  - **커밋은 S2 세션만** 한다. 다른 lane 대신 커밋해주는 통합자 역할도 S2가 맡는다.
  - `scripts/start.sh`, `scripts/stop.sh`, `scripts/start-*.sh` 등 서비스 기동/종료 스크립트는 **사용자 허락 없이 실행하지 않는다**.
  - 로그/장애 분석은 `log-analyzer` MCP를 우선 사용한다.
- 장기 S2 작업 메모와 후속 세션 인계는 `$note`와 `.omx` 메모리를 사용한다.
- **`$ralph`**: 한 세션이 백엔드/공유타입/문서/테스트까지 끈질기게 몰아쳐야 하는 단일 lane 작업에 우선 사용한다.
- **`$team`**: S2가 S1/S1-QA/S3/S4/S5/S6/S7과 병렬 협업을 조직해야 할 때 우선 사용한다.
- **`$trace`**: 이전 Codex/OMX 세션의 판단 흐름과 작업 이력을 복기할 때 사용한다.
- skill을 써도 **소유권과 API 계약 규칙은 그대로** 유지한다.

---

## 3. 현재 상태 (2026-04-20)

| 항목 | 값 |
|------|---|
| TypeScript 에러 | **0개** |
| 테스트 | **479개 통과** (vitest, 2026-04-20 mock-to-real auth bridge 추가 후 재검증) |
| DB 테이블 | **35개** (SQLite, WAL) — 기존 26개 활성 표면 + execution/persistence seam 9개 포함 |
| API 엔드포인트 | `api-endpoints.md`에 현행 라우터 기준 목록 정리 (`/pipeline/prepare*`, `/analysis/quick`, `/analysis/deep`) |
| WebSocket 채널 | **7개 mounted** (`dynamic-analysis`, `dynamic-test`, `analysis`, `upload`, `pipeline`, `notification`, `sdk`) |
| 에러 클래스 | 20개 (AppError 계층, 23개 에러코드 — `FORBIDDEN`, `RATE_LIMITED` 포함) |
| 외부 클라이언트 | SastClient(S4), AgentClient(S3), BuildAgentClient(S3:8003), KbClient(S5), AdapterClient(S6), LlmTaskClient(S7) |

### 3-0. auth/member-management v1 메모 (2026-04-20)

현재 S2는 기존 prototype auth (`login/logout/me/users`) 위에 **lifecycle-first 회원 관리 v1** 를 올린 상태다.

canonical v1 lifecycle:
- org creation / first org-admin bootstrap 은 public product scope 밖이다 (seed / migration / import only)
- 사용자는 기존 org code 기반으로 가입 요청을 만든다
- org-admin 이 same-org request 를 review 하며 role 을 배정하고 approve / reject 한다
- password 는 registration 시점에 이미 수집된다
- `Invite` 는 v1 에서 제거됐다
- approval 즉시 account 가 login-capable 상태가 된다

현재 mounted auth/member surface:
- public
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/orgs/:code/verify`
  - `POST /api/auth/register`
  - `GET /api/auth/registrations/lookup/:lookupToken`
  - `POST /api/auth/password-reset/request`
  - `GET /api/auth/dev/password-reset/latest?email=` (non-production mock bridge)
  - `POST /api/auth/password-reset/confirm`
- authenticated
  - `GET /api/auth/me`
- admin-only
  - `GET /api/auth/users`
  - `GET /api/auth/registration-requests`
  - `GET /api/auth/registration-requests/:id`
  - `POST /api/auth/registration-requests/:id/approve`
  - `POST /api/auth/registration-requests/:id/reject`

현재 hardening 상태:
- login identifier 는 request field 이름을 `username` 으로 유지하되, backend 는 exact `username` 후 normalized `email` 순으로 해석한다
- session token 은 bearer raw token 을 클라이언트에만 반환하고, DB `sessions` 에는 SHA-256 hash 만 저장한다
- legacy plaintext session row 는 DB init 시 best-effort migration 된다
- public auth rate limit 은 SQLite `auth_rate_limit_events` 에 영속화되어, 같은 DB 를 쓰는 현재 배포에서는 process restart 후에도 유지된다
- login throttle HTTP contract (`429 RATE_LIMITED`) regression test 가 추가됐다
- password reset request 는 account existence 를 노출하지 않고 `202 { accepted: true }` 를 반환한다
- new reset token 발급 시 기존 active reset token 들을 revoke 하고, successful reset 시 남은 reset token 과 active sessions 를 함께 revoke 한다
- non-production mock-to-real bridge:
  - startup 시 fixture org/admin 이 자동 보장된다 (`AEGIS_AUTH_DEV_FIXTURES=true` 또는 `NODE_ENV=development|test`; 현재 로컬 `.env` 는 true)
  - fixture org/admin pairs: `ACME-KR-SEC`/`acme-admin`, `HYUNDAI-AVSEC`/`hyundai-admin`, `LG-EV-SECOPS`/`lges-admin`
  - fixture org-admin password default = `Admin1234!` (`AEGIS_AUTH_DEV_ADMIN_PASSWORD` override 가능)
  - `GET /api/auth/dev/password-reset/latest?email=` 가 SQLite `dev_password_reset_deliveries` 에서 최신 active token 을 노출해 SMTP 없이 mock/E2E reset flow 를 이어준다

- registration approve/reject/lookup 응답은 full `RegistrationRequest` shape 으로 정규화되며 `organizationCode` / `organizationName` 은 populated 값이다
- `BuildTarget.sdkChoiceState` 는 Quick preflight canonical field 이다 (`sdk-unresolved` 면 Quick disabled)
- S3 `structured_finalizer` policy flag 는 보존하고, S3 `validation_failed` / `INVALID_SCHEMA` 는 Deep failure 로 처리한다
- S4 native/custom scan 호출 시 S2 는 local `buildProfile.sdkId="custom"` sentinel 을 제거하고 `sdkId` 를 생략한다

현재 남은 follow-up risk (non-blocking):
- rate limit durability 는 shared SQLite 범위까지다. future multi-node deployment 에서는 shared store 로 옮겨야 한다
- login 성공도 현재는 throttle budget 을 소모한다
- auth error DTO (`429` 포함) 를 shared layer 에 더 풍부하게 모델링하는 후속 polish 여지는 있다

### 3-0. explicit-step migration 메모 (2026-04-13)

현재 S2는 새 canonical 분석 여정으로 단계적으로 이동 중이다.

목표 user journey:
- 소스 업로드
- SDK 업로드
- 명시적 build-preparation
- 명시적 Quick
- Quick 중 S5 GraphRAG / code-graph 형성
- 명시적 Deep

현재 canonical runtime surface:
- `POST /api/projects/:pid/pipeline/prepare`
- `POST /api/projects/:pid/pipeline/prepare/:targetId`
- `POST /api/analysis/quick`
- `POST /api/analysis/deep`

현재 additive WS/progress semantics:
- `/ws/analysis`
  - 현재 payload는 additive하게 `buildTargetId`, `executionId`를 포함할 수 있고, `analysisId`는 WS subscription / progress correlation key로 유지된다.
  - `quick_sast`
  - `quick_graphing`
  - `quick_complete`
  - `deep_submitting`
  - `deep_analyzing`
  - `deep_retrying`
  - `deep_complete`

현재 구현 메모:
- BuildTarget-scoped Quick는 **prepared `compile_commands`가 있어야** 진행된다.
- Quick에서 S5 GraphRAG readiness가 확보되지 않으면 다음 단계로 넘기지 않는다.
- Deep는 prior Quick execution + KB graph stats를 바탕으로 명시적으로 시작한다.
  - 2026-04-14 기준 BuildTarget-scoped Quick execution을 참조할 때는 KB scope를 `projectId:targetName` 으로 해석한다.
  - executionId만 전달되어도 `{executionId}-{targetName}` 형태의 단일 BuildTarget-scoped static result가 역해석 가능하면 그 concrete execution result를 사용한다.
- `POST /api/analysis/quick`는 BuildTarget-only Quick surface다 (`buildTargetId` 필수).
- `POST /api/analysis/deep`는 BuildTarget-only Deep surface다 (`buildTargetId + executionId` 필수).
- `GET /api/analysis/status*` 는 active progress와 함께 `buildTargetId`, `executionId`를 반환해 current AnalysisExecution traceability를 유지한다.
- `/api/analysis/run`는 더 이상 mounted되지 않는다.

### 3-0a. timeout-policy redesign 사전 영향분석 메모 (2026-04-13)

S3 notice 기준 현재 승인된 첫 rollout은 **`/health` 전용 + polling semantics** 다.
이 단계에서는 S2가 새 primary endpoint를 추가하지 않고, downstream `/health` 를 polling 하며
progress-capable / blocked / ack-break 요약 상태를 해석하는 방향으로 준비해야 한다.

현재 S2 영향 포인트:
- `services/backend/src/controllers/health.controller.ts`
  - **2026-04-14 구현 완료**: `?requestId=` pass-through + normalized child `control.pollDecision`
  - child `/health` raw detail은 유지하고, frozen `requestSummary`가 있으면 `state/localAckState/blockedReason` 해석 결과를 additive `control` block으로 승격한다.
- `AgentClient`, `BuildAgentClient`, `SastClient`, `KbClient`, `LlmTaskClient`
  - **2026-04-14 구현 완료**: `checkHealth(requestId?)` 지원
  - caller가 특정 request-aware summary를 조회할 수 있다.
- `AnalysisOrchestrator`, `PipelineOrchestrator`
  - 현재는 request retry / abort signal 중심이고,
    timeout-shaped transport failure 뒤의 polling-based continuation/chained-abort loop는 아직 후속 작업이다.

현재 결론:
- **이 문단은 pre-freeze historical note** 다.
- 실제 구현은 freeze 후 2026-04-14에 `/health` polling interpreter surface부터 반영됐다.

### 3-0b. timeout-policy redesign freeze 후속 메모 (2026-04-14)

S3가 first-rollout `/health` control-signal vocabulary를 freeze 했고,
현재 S2에는 아래 follow-up WR이 **open** 상태다.

- `s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout`

현재 freeze된 caller interpretation 핵심:
- S2가 `/health` 에서 해석해야 할 additive field
  - `activeRequestCount`
  - `requestSummary.requestId`
  - `requestSummary.endpoint`
  - `requestSummary.state`
  - `requestSummary.localAckState`
  - `requestSummary.degraded`
  - `requestSummary.degradeReasons`
  - `requestSummary.lastAckAt`
  - `requestSummary.lastAckSource`
  - `requestSummary.blockedReason`
- canonical state naming
  - `state`: `idle | queued | running | failed`
  - `localAckState`: `phase-advancing | transport-only | ack-break`
- mandatory chained-abort trigger
  - `localAckState = ack-break`
  - `state = failed`
  - `blockedReason != null`

현재 세션 종료 시점 기준 판단:
- freeze 전 notice 처리(영향분석)는 완료
- freeze 후 `/health` consumer surface 구현도 완료
  - child `/v1/health?requestId=...` pass-through
  - normalized `control.pollDecision`
  - legacy S4 `ackStatus=broken` → `ack-break` mapping
- 남은 gap:
  - `AnalysisOrchestrator`, `PipelineOrchestrator`가 timeout-shaped transport failure 뒤에 lower `/health` 를 polling 하며
    continuation / chained-abort 를 수행하는 execution loop는 아직 미구현
  - 현재는 implementation-lag transport outcomes inventory만 정리된 상태다

### 3-0c. S5 runtime semantics notice 처리 메모 (2026-04-14)

S5 notice `s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready`
처리 결과:

- `KbClient`는 code-graph ingest 요청에 여전히 `X-Timeout-Ms`를 명시적으로 보내며,
  2026-04-14 기준 테스트로 header 고정을 다시 확인했다.
- S5 `408 TIMEOUT`은 이제 실제 caller-visible outcome으로 취급한다.
  - S2 `KbClient`는 `HTTP 408 (TIMEOUT)` 정보를 보존해 상위 레이어에 전달한다.
- S5 `503`은 old overload 가정 대신 `KB_NOT_READY` semantics로 해석하도록 정리했다.
  - S2는 더 이상 KB `503`을 \"overloaded\"로 로깅하지 않는다.
- `PipelineOrchestrator`는 더 이상 `/v1/ready` 결과로 code-graph ingest 자체를 pre-gate 하지 않는다.
  - code GraphRAG readiness의 authoritative signal은 계속 `POST /v1/code-graph/{project_id}/ingest` 응답의 `status + readiness.graphRag` 다.
- `/v1/graph/stats` mixed-graph totals 드리프트는 현재 S2 runtime path에서 직접 사용하지 않는다.

### 3-1. 프로젝트 CRUD hardening 메모 (2026-04-09)

- `PUT /api/projects/:id`
  - `name`이 빈 문자열/공백만 들어오면 `400 { success: false, error: "name is required" }`
  - 유효한 `name`/`description`은 trim 후 저장
- `DELETE /api/projects/:id`
  - 더 이상 raw project row delete가 아니다.
  - 현재 delete 순서:
    1. blocker check
    2. `uploads/{projectId}` quarantine
    3. project-scoped DB row 정리
    4. DB 실패 시 uploads root restore
    5. 성공 시 quarantined root final remove
- delete blocker는 현재 아래 authoritative surface만 사용한다.
  - active analysis
  - connected adapters
  - dynamic-analysis sessions (`connected|monitoring`)
  - running dynamic-test
  - non-terminal SDK states
  - active pipeline targets
- conflict 응답은 `409`이며, `errorDetail.blockers`에 구조화된 blocker 정보를 포함한다.

### 3-2. Progress / completion UX 계약 메모 (2026-04-07)

현재 S2는 WebSocket을 단순 transport가 아니라 **비동기 작업의 진행/완료 인지 표면**으로 본다.

- **foreground progress 채널**
  - `/ws/upload`
  - `/ws/sdk`
  - `/ws/analysis`
  - 현재 payload는 additive하게 `buildTargetId`, `executionId`를 포함할 수 있고, `analysisId`는 WS subscription / progress correlation key로 유지된다.
  - `/ws/pipeline`
- **background completion awareness 채널**
  - `/ws/notifications`

Recovery / re-entry 원칙:

- 사용자가 화면을 이동하거나 재연결한 뒤에는 **WS replay를 기대하지 않는다**.
- 대신 채널별 authoritative recovery path를 사용한다.
  - upload → `/api/projects/:pid/source/upload-status/:uploadId`
  - sdk → `/api/projects/:pid/sdk` / `/:id`
  - analysis → `/api/analysis/status/:analysisId`, `/api/analysis/results/:analysisId`
  - pipeline → `/api/projects/:pid/pipeline/status`
  - notifications → `/api/projects/:pid/notifications`

S1 handoff 원칙:

- API/WS 계약은 **normative**
- 화면별 활용 방식은 **advisory**
- 즉 S2는 exact contract를 주고, S1은 그 위에 UX를 설계한다

### 3-3. 최근 계약 회귀 잠금 메모 (2026-04-04)

- S1↔S2 canonical contract 재작성 후, S2 backend 테스트 하네스는 다음 semantics를 **회귀 테스트로 고정**했다.
  - `POST /api/projects/:pid/targets/discover` → `data: { discovered, created, targets, elapsedMs }`
  - `POST /api/projects/:pid/pipeline/run/:targetId` → `data: { targetId, status: "running" }`
  - `GET /api/projects/:pid/pipeline/status` → canonical `PipelineStatus`
  - `GET/POST /api/projects/:pid/sdk` → `RegisteredSdk` / `{ builtIn, registered }`
- build-target update는 현재도 `includedPaths` 변경을 지원하지 않으며, backend는 이를 **명시적 에러**로 거부한다.
- SDK analyzed profile 연동에서 canonical 필드명은 `environmentSetup`이며, S2 로컬 SDK 검증도 해당 이름을 기준으로 경로 존재/경계 검증을 수행한다.

### 3-4. 테스트/문서 동기화 메모 (2026-04-04)

- backend contract test harness (`services/backend/src/test/create-test-app.ts`) 는 이제 다음 surface를 직접 검증 가능하게 맞춰져 있다.
  - `/api/projects/:pid/targets/discover`
  - `/api/projects/:pid/sdk`
  - `/api/projects/:pid/pipeline/run/:targetId`
- contract lockdown 관련 S2 기준 검증 결과:
  - `src/__tests__/contract/api-contract.test.ts` → **79 passed**
  - `cd services/backend && npx vitest run` → **21 files / 356 tests passed**
  - `services/backend` / `services/shared` `tsc --noEmit` 통과
- 문서 동기화 완료 범위:
  - `wiki/canon/api/shared-models.md`
  - `wiki/canon/specs/backend.md`
  - `wiki/canon/handoff/s2/readme.md`
  - `wiki/canon/handoff/s2/roadmap.md`
  - `wiki/canon/handoff/s2/architecture.md`
  - `wiki/canon/handoff/s2/session-omx-*.md`

### 3-5. WR / handoff 운영 메모 (2026-04-06)

- canonical WR runtime model은 `wiki/canon/work-requests/` 기준으로만 동작한다.
- archived `docs/work-requests/`는 historical reference만 남는 경로이며, `list_my_open_wrs` / `register_wr` / `complete_wr`의 입력이 아니다.
- WR semantics를 다시 바꿀 때는 최소한 아래 3곳을 함께 점검해야 한다.
  - `wiki/system/work-request-policy.md`
  - `wiki/system/migration-map.md`
  - `wiki/system/index.md`

### 3-6. DB / uploads reset 운영 메모 (2026-04-10)

- `scripts/backend/reset-db.sh`
  - `aegis.db`, `aegis.db-wal`, `aegis.db-shm` 만 삭제한다.
  - **`uploads/` 는 건드리지 않는다.**
- `scripts/backend/reset-runtime-state.sh`
  - DB 파일 + `uploads/` 내부 전체를 함께 비운다.
  - 통합테스트 전 완전 초기 기준선이 필요할 때 이 스크립트를 사용한다.
- `scripts/backend/backup-db.sh`
  - `sqlite3 .backup` 기반 백업을 만든다.
- `scripts/backend/db-stats.sh`
  - 핵심 21개 테이블 통계와 전체 테이블 수(기대값 30)를 함께 출력한다.
- reset 계열 스크립트는 모두 **실행 중 서비스/DB 점유가 없는 상태**를 전제로 사용한다.

### Durable (투자, 유지)

| 영역 | 핵심 파일 |
|------|---------|
| BuildTarget-only Quick/Deep 오케스트레이션 | `analysis-orchestrator.ts`, `analysis.controller.ts` |
| 서브 프로젝트 파이프라인 | `pipeline-orchestrator.ts`, `pipeline.controller.ts` |
| 소스코드 업로드/관리 | `project-source.service.ts`, `project-source.controller.ts` |
| 빌드 타겟 관리 | `build-target.service.ts`, `build-target.controller.ts` |
| 코어 도메인 | Run, Finding(7-state), EvidenceRef, QG, Approval, Report |
| ResultNormalizer | `normalizeAnalysisResult()` + `normalizeAgentResult()` |
| 알림 시스템 | notification.dao.ts, notification.service.ts, notification.controller.ts |
| 사용자/인증 | user.dao.ts, user.service.ts, auth.middleware.ts, auth.controller.ts |
| Gate 프로필 | gate-profiles.ts (3 프리셋: default/strict/relaxed) |

### 세션 13에서 제거 완료된 레거시

- `rules` DB 테이블 + `IRuleDAO` 인터페이스 + `Rule` 공유 타입 — 룰 엔진 완전 제거
- `LlmV1Adapter` (v0→v1 호환 레이어) — `LlmTaskClient`에 concurrency 통합, 서비스 직접 사용
- `MockEcu` — 인터페이스를 `adapter-client.ts`로 이동, 클래스 삭제

---

## 4. S2가 관리하는 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| **공통 제약 사항** | `docs/AEGIS.md` | 프로젝트 전체 거버넌스. **S2가 관리** |
| 기능 명세서 | `wiki/canon/specs/backend.md` | S2의 모든 API + 아키텍처 상세 |
| 전체 기술 개요 | `wiki/canon/specs/technical-overview.md` | 전체 시스템 구조 (**S2 주도**) |
| Observability 규약 | `wiki/canon/specs/observability.md` | MSA 공통 규약 |
| 공유 모델 명세 | `wiki/canon/api/shared-models.md` | 전 서비스 공유 타입. **S2 단독 관리** |
| 서비스 관리 스크립트 | `scripts/start.sh`, `scripts/stop.sh` | 전체 서비스 기동/종료 |

**중요**: 구현을 바꾸면 `wiki/canon/specs/backend.md`와 `wiki/canon/api/shared-models.md`도 반드시 같이 업데이트할 것.

---

## 5. 참고할 문서들

| 문서 | 경로 | 왜 봐야 하는지 |
|------|------|--------------|
| 공통 제약 사항 | `docs/AEGIS.md` | **필독** — 역할, 소유권, 소통 규칙 전부 |
| S2 기능 명세 | `wiki/canon/specs/backend.md` | 네가 관리하는 계약서 |
| S3 Agent API | `wiki/canon/api/analysis-agent-api.md` | S2↔S3 deep-analyze 호출 스펙 |
| S7 API 명세 | `wiki/canon/api/llm-gateway-api.md` | S2↔S7, S3↔S7 호출 스펙 |
| SAST Runner API | `wiki/canon/api/sast-runner-api.md` | S2↔S4 직접 호출 스펙 |
| KB API | `wiki/canon/api/knowledge-base-api.md` | S5 호출 스펙 |
| 공유 모델 | `wiki/canon/api/shared-models.md` | 전 서비스 공유 타입 |


### 3-5. WebSocket progress/completion contract 메모 (2026-04-07)

- progress/completion UX 관점의 우선 채널은 `upload`, `sdk`, `analysis`, `pipeline`, `notifications` 다.
- `notifications` 는 단순 부가 알림이 아니라 **background completion surface** 로 취급한다.
- recovery source of truth는 flow별로 다르다:
  - upload → `GET /api/projects/:pid/source/upload-status/:uploadId`
  - sdk → `GET /api/projects/:pid/sdk/:id`
  - analysis → `GET /api/analysis/status/:analysisId`, terminal은 `GET /api/analysis/results/:analysisId`
  - pipeline → `GET /api/projects/:pid/pipeline/status`
- S2는 exact contract/docs/tests를 owning하고, S1에는 advisory UX handoff를 WR로 넘긴다.
