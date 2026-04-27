---
title: "SDK 업로드 진행 표면 — 2026-04-25 reply 후속: ETA / phase timing / structured detail / retry endpoint / log streaming / locale / quota / lifecycle / mock fixtures 보강 일괄 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "websocket", "shared-api"]
decision_tags: ["sdk-upload", "websocket-contract", "progress-ux", "retry-endpoint", "log-streaming", "i18n", "phase-timing", "concurrent-upload", "lifecycle", "mock-fixtures", "completion-quality"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics.md", "wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/design-system.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-25T09:02:15.549Z","note":"S2 re-read the WR after S1 clarification, implemented the previously missing SDK runtime surfaces in shared/backend code, updated canonical docs/runbook, registered reply `wiki/canon/work-requests/s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification.md`, and verified shared build, backend typecheck/build, targeted SDK/WS/contract tests, and full backend tests."}]
registered_at: "2026-04-25T07:34:28.244Z"
completed_at: "2026-04-25T09:02:15.549Z"
---

# SDK 업로드 진행 표면 — 2026-04-25 reply 후속: ETA / phase timing / structured detail / retry endpoint / log streaming / locale / quota / lifecycle / mock fixtures 보강 일괄 요청

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

2026-04-25 S2 가 `s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a` 로 우리 8 항목 명시 요청에 normative 답을 줬다. S1 은 그 답을 기반으로 ProjectSettings SdkManagementSection 의 데이터 활용도 보강 작업을 진행할 수 있다.

다만 S2 가 reply 끝에 "future S2 feature 가능 영역" 5 개 (etaSeconds / phaseStartedAt / phaseDetail / troubleshootingUrl / true retry endpoint) 를 친절히 명시했고, 그 외에도 mock v2 의 풍부한 정보 표시 + 사용자 워크플로우 완성도 + 일반적 SDK 업로드 UX 베스트 프랙티스 관점에서 추가 발견된 사소한 항목들이 있다.

본 WR 은 그 모든 후속 항목을 하나로 묶어 일괄 요청한다. 항목 수가 많지만, **각 항목은 독립적으로 결정 가능**하다 — S2 는 항목별로 "구현 / 향후 / 거부 / 자유결정" 중 하나로 답하면 된다. 항목 sub-bullet 까지 모두 명시 답변을 받으면 S1 은 추정 매핑 없이 정확한 spec 으로 한 번에 데이터 활용 보강 사이클 진입 가능.

## 이미 받은 normative 부분 (재참조)

S2 reply 2026-04-25 에서 확정된 것 (변경 요청 없음):
- 9 phase → 5-step stepper grouping S1 추정 매핑 승인
- artifactKind 별 phase flow 표 (archive/bin/folder)
- `message` 가 human-readable status text — 그대로 render
- `fileName` 의 phase-dependent 의미 + basename / truncation S1 책임
- `meta.timestamp` 가 live elapsed 측정 기준점
- `GET /api/projects/:pid/sdk/:id/log?tailLines=<n>` 신규 endpoint + response shape
- retry = (DELETE) + 새 등록 흐름 (현재)
- ETA / phaseStartedAt / phaseDetail / troubleshootingUrl 모두 현재 미제공

## 후속 명시 요청 — 카테고리별

### 그룹 A. 시간 정보 (Timing)

**A1. `etaSeconds` 추가**
- `sdk-progress.payload.etaSeconds?: number`
- 필요한 정확도: heuristic 또는 historical phase duration 평균 기반. ±50% 범위 hint 면 충분
- precision: integer second
- 미정확 시 `undefined` / `null` 로 미포함 OK
- 어느 phase 부터 적용 가능한지 명시: uploading 의 byte 기반 ETA 만 가능한지, extracting/analyzing/verifying 도 가능한지

**A2. `phaseStartedAt` epoch-ms 추가**
- 옵션 1: `sdk-progress.payload.phaseStartedAt: number` (현재 phase 의 시작 epoch-ms)
- 옵션 2: `meta.phaseStartedAt` (envelope 레벨)
- 재진입 시 `GET /sdk/:id` 응답에 `currentPhaseStartedAt: number` 포함 — 정확한 elapsed 표시 가능

**A3. `phaseHistory` 영속**
- `GET /sdk/:id` 응답에 `phaseHistory: Array<{ phase, startedAt, endedAt?, durationMs? }>` 옵션
- 재진입 후 stepper 의 done / active / pending 정확히 표시
- 영속 비용이 부담스러우면: 마지막 N (예: 10) phase 만 유지 또는 ready 도달 후 GC

**A4. WS `sdk-progress` emit cadence**
- `percent` 변화 emit 빈도 명시 (예: percent 1% 마다 또는 100ms 간격 throttle)
- 큰 파일 업로드 시 jumpy progress bar 회피 위한 frontend 보간 가이드라인
- 너무 잦으면 client throttle 정책 명시

**A5. `meta.timestamp` 의 정확도 / 동기화**
- backend 시계의 `Date.now()` epoch-ms — drift 가능성?
- frontend 가 그대로 사용해도 OK 인지 vs server-client clock skew 보정 필요한지

### 그룹 B. 구조화 정보 (Structured Detail)

**B1. `phaseDetail` structured field**
- 현재 `message` 는 자유 텍스트 (한국어 직접 박힘) — i18n 한계
- 옵션 1: `sdk-progress.phaseDetail?: { kind: string; params?: Record<string, string|number> }` — frontend 가 kind 로 i18n 매핑
- 옵션 2: `sdk-progress.messageKey?: string` — 단순 i18n 키
- 예시: `phaseDetail: { kind: 'analyzing-file', params: { path: '/opt/yocto/...' } }`
- analyzing 시 frontend 가 "분석 중: {path}" 또는 "Analyzing: {path}" 등 locale 매핑

**B2. `troubleshootingUrl` 동적 링크**
- `sdk-error.troubleshootingUrl?: string`
- error code 별로 다른 doc URL 흘려주는 것 가능?
- frontend 의 "문제 해결 가이드" CTA 가 정적 fallback (S1 hardcoded) + 동적 (backend) 둘 다 지원

**B3. `retryable: boolean` 추가**
- `sdk-error.retryable?: boolean`
- `verify_failed` 는 같은 SDK 로 retry 가능, `install_failed` 의 일부는 client 가 다른 .bin 제공해야 하는 등 차이
- frontend 가 "재시도" CTA 노출 / 비노출 결정

**B4. error code structuring**
- 현재 `sdk-error.error: string` 자유 텍스트
- structured `sdk-error.code: string` enum 추가 (예: `EXTRACT_CHECKSUM_MISMATCH`, `INSTALL_ETXTBSY`, `INSTALL_NOT_BIN`, `VERIFY_HEADER_NOT_FOUND`, `ANALYZE_TIMEOUT`)
- frontend 가 error 별 차별화 처리 + i18n 가능
- enum 정식 목록 + 향후 확장 정책 명시

**B5. `recoverable: boolean` 또는 `severity: 'fatal' | 'recoverable'`**
- error 가 fatal (사용자 액션 외에 복구 불가) vs recoverable (자동 retry 가능 / cooldown 후) 구분
- frontend UX 차별화

### 그룹 C. Retry Endpoint

**C1. server-side retry endpoint**
- `POST /api/projects/:pid/sdk/:id/retry` — 실패한 SDK artifact 재사용해 retry
- backend 가 failed SDK uploaded bytes 보유 (별도 cleanup 까지 retain TTL)
- request body: 비어있거나 `{ fromPhase?: 'extracting' | 'installing' | 'analyzing' | 'verifying' }` (특정 phase 부터 재시도)
- response: 새 SDK ID 부여 vs 기존 SDK ID 재사용 둘 중 결정
- 영향: client 가 큰 .bin 다시 업로드 안 해도 됨

**C2. retry 정책**
- 동일 SDK retry 횟수 제한 (예: max 3)
- retry cooldown (예: 직전 실패 후 30초)
- 제한 초과 시 error code (예: `RETRY_QUOTA_EXCEEDED`)
- frontend 가 disabled state + 사용자 메시지

**C3. retry 시 phase 흐름**
- retry 가 어느 phase 부터 시작하는지 명시 (default 는 `fromPhase` 직전 done phase 의 다음)
- progress UI 가 어디서부터 active 표시할지 결정

**C4. failed SDK artifact retention**
- failed SDK 의 uploaded bytes 가 retention 기간 명시 (예: 24h, 또는 다음 ready SDK 등록까지)
- TTL 만료 후 retry 시도하면 어떤 error
- frontend 가 "이 SDK 의 retry 가능 시간 이 끝났습니다" 표시 위해 `RegisteredSdk.retryExpiresAt?: number` 추가 검토

### 그룹 D. Log Access 보강

**D1. `GET /sdk/:id/log` 정밀 명세**
- `tailLines` default value 명시 (현재 미명시)
- `tailLines` max value 제한 (예: 10000)
- request param 추가: `phase?: 'install' | 'verify' | 'analyze' | 'all'` — phase 별 로그 분리 가능?
- response: 현재 `{ sdkId, logPath, content, truncated }`
- 추가 필드: `totalLines: number` (전체 로그 라인 수), `phase: string` (해당 로그가 어느 phase 의 결과인지)

**D2. log streaming / pagination**
- 큰 로그 시 chunk streaming (`Transfer-Encoding: chunked` 또는 SSE)
- 또는 pagination: `?offset=<line>&limit=<n>`
- 응답에 `nextOffset?: number`

**D3. 라이브 로그 streaming WS message?**
- 현재 in-flight phase 의 라이브 로그 stream 있는지
- reply 에서 "installer/lifecycle sub-detail은 `sdk-log` messages" 라고 했음 — 이게 별도 WS 메시지 type 인가?
- 그렇다면 message type / payload schema 정식 명시
  - 예: `sdk-log: { sdkId, phase, line: string, timestamp: number, level?: 'info'|'warn'|'error' }`
- frontend 가 active 상태 SDK 의 라이브 log tail 가능

**D4. `logPath` field 보안**
- 현재 `sdk-error.logPath` + `RegisteredSdk.installLogPath` server-side path
- end-user 노출 OK 인가, 또는 admin debug 만 — frontend 가 보여줘야 하나?
- 옵션: server-side path 는 backend 내부용, frontend 에는 `logUrl: '/api/projects/:pid/sdk/:id/log'` 같은 client-resolvable URL 만 흘림

**D5. `installLogPath` vs `logPath` 통합**
- `RegisteredSdk.installLogPath` + `sdk-error.logPath` 두 field 가 같은 의미인가, 다른가?
- 통합 또는 명확한 분리 명시
- 통합한다면 한 이름으로

**D6. log download**
- `GET /sdk/:id/log?download=true` 또는 별도 endpoint `/sdk/:id/log/download`
- response: text/plain, Content-Disposition: attachment
- frontend 의 "로그 다운로드" CTA

### 그룹 E. i18n / Locale

**E1. `message` 의 locale 정책**
- 현재 한국어 직접 emit
- frontend 가 다른 locale 표시 원하는 경우 옵션:
  - 옵션 1: backend 가 `Accept-Language` 헤더 / WS query param 으로 locale 전송 받아 해당 언어로 emit
  - 옵션 2: backend 는 항상 ko-KR, frontend 가 message 를 i18n 매핑 (어렵다 — 한국어 자유 텍스트라 mapping table 만들기 부담)
  - 옵션 3: B1 의 `phaseDetail.kind` + `params` 로 frontend i18n
- S2 가 권장 옵션 명시

**E2. SDK metadata locale**
- `RegisteredSdk.sdkVersion`, `targetSystem` 이 free text 인지 enum 인지
- ko/en 표시 차이가 있다면 명시

### 그룹 F. Precision / 최적화

**F1. `percent` precision**
- integer (0-100) vs float (0.0-100.0)?
- progress bar smoothness 위해 float 권장

**F2. byte field precision**
- `uploadedBytes`, `totalBytes` 가 number (JS) vs bigint?
- JS number 는 2^53-1 (~9PB) 까지 안전 — 충분하지만 명시
- 5GB+ SDK 를 위한 보장

**F3. message length 제한**
- `message` field 최대 길이 (예: 200 chars)
- 더 긴 detail 은 `phaseDetail` 또는 log 로

### 그룹 G. Concurrent / Quota

**G1. 동시 SDK 업로드**
- 한 project 에 동시 N 개 SDK 업로드 가능?
- 동시성 제한 있다면 `MAX_CONCURRENT_SDK_UPLOADS_PER_PROJECT` 명시
- 초과 시 error (예: `CONCURRENT_LIMIT_EXCEEDED`)

**G2. SDK quota**
- max SDK count per project
- max storage per project (예: 50GB)
- frontend 가 quota usage 표시 위해 `GET /api/projects/:pid/sdk/quota` endpoint 또는 list response 에 `quota: { used, max }` 포함

**G3. global SDK quota**
- AEGIS 인스턴스 전체의 storage quota?
- multi-tenant scenario 위한 정책

### 그룹 H. 라이프사이클 (Lifecycle)

**H1. DELETE in-flight job**
- `uploading` / `extracting` / `installing` 중 `DELETE /sdk/:id` 호출 시 동작
- 옵션 A: 즉시 200 응답 + background job cancellation + 잔여 file cleanup
- 옵션 B: job 정리 후 200 응답 (동기)
- WS 에 `sdk-error: { phase, error: 'cancelled', code: 'USER_CANCELLED' }` emit?
- frontend 가 "취소" CTA 노출 가능 여부

**H2. WS reconnect 시 phase 일관성 보장**
- reconnect 후 `GET /sdk/:id` 가 마지막 emit 한 `sdk-progress.phase` 와 일치 보장?
- 또는 reconnect 가 중간에 일어나면 missed phase 가능?
- frontend 가 "lost progress" 처리 필요한지

**H3. project DELETE 시 SDK cleanup**
- project 삭제하면 등록된 SDK + in-flight upload 모두 cleanup?
- 응답 시간 영향 (큰 SDK 정리 비동기?)

**H4. SDK ready 후 변경 가능?**
- `ready` 상태 SDK 의 metadata (name, description) 갱신 endpoint?
- `PATCH /api/projects/:pid/sdk/:id`?
- 또는 read-only after ready

### 그룹 I. Test fixtures / Mock support

**I1. SDK 변형 mock fixture (frontend dev 지원)**
- frontend 의 `services/frontend/src/api/mock-handler.ts` (`VITE_MOCK=true`) 가 active/failed 변형 SDK 시뮬레이션 지원하려면 backend canonical mock data shape 필요
- backend 가 `services/shared/fixtures/sdk-mocks.ts` 같은 canonical mock fixture export?
- 또는 frontend 가 자체 mock 만들어도 OK (S1 자율)?

**I2. dev 모드 phase transition simulator**
- backend dev mode 에서 sample SDK 가 자동으로 phase transition 시뮬레이션 (예: 매 3초마다 phase 전환) endpoint
- frontend 가 stepper / progress / failed UI 시각 검증 위해 사용
- 또는 S2 가 reject 하면 frontend 자체 mock 이 보강

**I3. e2e test SDK upload fixture**
- e2e 테스트에서 작은 fake SDK 업로드 가능한 fixture (small archive / bin)
- canonical 위치 + 사용 가이드

### 그룹 J. Shared Types Versioning

**J1. shared package 갱신 전파**
- `services/shared/src/dto.ts` / `models.ts` 갱신 시 frontend `@aegis/shared` 가 어떻게 reflect?
- monorepo 내 symlink 자동인가, build 필요한가?
- 갱신 후 frontend 가 `npm run typecheck` 통과 보장?

**J2. breaking change 정책**
- field 제거 / rename 시 deprecation 기간
- WS message type 추가 / 변경 시 backwards-compat 정책

**J3. shared dto / models 의 source-of-truth**
- canonical doc (`wiki/canon/api/shared-models.md`) 와 코드 (`services/shared/src/`) 중 어느 게 우선?
- 충돌 시 처리

### 그룹 K. 작은 명확화

**K1. `GET /sdk` ordering**
- registered SDK list 의 default ordering (createdAt desc?)
- `?orderBy=name|createdAt|status&order=asc|desc` query param 지원?
- frontend 가 sortable 컬럼 노출 위해

**K2. WS query param 확장**
- 현재 `/ws/sdk?projectId=X` 만
- 특정 SDK 한 개만 구독: `?sdkId=Y`?
- 또는 모든 SDK 자동 broadcast (현재) 유지

**K3. WS envelope 보장**
- `meta.timestamp`, `meta.seq`, `meta.correlationId` 등이 모든 sdk-* 메시지에 보장?
- envelope schema 정식 명시

**K4. `sdk-complete.path?` field**
- field 가 무엇인가? server-side artifact path? client-side 라우팅 path?
- frontend 가 어떻게 사용?
- 미사용이면 제거 또는 명확한 의도 명시

**K5. 동일 파일 재업로드 detection**
- 동일 hash / 동일 파일명 재업로드 시 backend 동작
- 새 SDK ID 부여 (default 추정)
- duplicate detection 응답 (`{ duplicate: true, existingId: '...' }`) ?

**K6. SDK status enum 확장 정책**
- 현재 9 phase + 4 error family
- 향후 추가 가능성 (예: `pausing`, `paused`, `cancelled`, `ready_with_warnings`)
- frontend 가 unknown phase 만나면 어떻게 처리해야 하는지 default 가이드

### 그룹 L. artifactKind 별 message 카피

**L1. archive / folder / bin 의 message 차이**
- archive `extracting`: "SDK 압축 해제 중..."
- folder `extracting`: "SDK 폴더 업로드 정리 중..."
- bin `installing`: "SDK 설치 파일 실행 중..."
- 정식 카피 표 명시 (현재 reply 에 일부만)
- 향후 추가될 새 message 카피의 등록 절차

**L2. archive 와 folder 둘 다 `extracting` phase 사용**
- 의미가 다른데 phase 가 같음 — frontend 가 stepper 라벨을 동적으로 바꿔야 하는지
- 권장 frontend 처리: 기본 라벨 "설치/압축해제" + `artifactKind` 별 sub-text

### 그룹 M. Outcome / Profile

**M1. `RegisteredSdk.profile` schema**
- 현재 `SdkAnalyzedProfile` shared type — 정식 schema 가 무엇?
- frontend 가 ready 시 표시 가능 항목:
  - 감지된 컴파일러 (이름 + 버전)
  - target architecture
  - language standard
  - header language
  - includePaths count
  - defines count
- 각 항목이 항상 채워지는가, optional 인가

**M2. `sdk-complete.path?`**
- 위 K4 와 같음 (중복 명확화)

**M3. `sdkVersion` / `targetSystem` 의 추출 신뢰도**
- AI 분석 으로 추출 — 신뢰도 표시?
- `confidence?: number` (0-1) 또는 `verified: boolean` 추가?

### 그룹 N. Error UX 보강

**N1. error 시 user-facing copy + technical detail 분리**
- 현재 `sdk-error.error: string` 한 field
- 분리 제안:
  - `sdk-error.userMessage: string` (사용자 표시용 — 한국어, 친절)
  - `sdk-error.technicalDetail?: string` (개발자 디버깅용 — 영어 stack trace 등)
- frontend 가 expandable "기술 상세" 섹션 노출 가능

**N2. error correlation ID**
- `sdk-error.correlationId?: string` — server log 와 매칭 위한 ID
- frontend 가 사용자에게 표시해 support 요청 시 사용

**N3. error timestamp**
- `sdk-error.failedAt?: number` (epoch-ms)
- 현재 message envelope `meta.timestamp` 가 충분?

### 그룹 O. Observability / Metrics

**O1. SDK 업로드 telemetry endpoint**
- `GET /api/projects/:pid/sdk/metrics` — 평균 phase duration, 성공률, 일반 실패 원인 등
- frontend 가 admin panel / project health view 표시

**O2. WS connection health**
- `/ws/sdk` 의 keep-alive ping/pong 정책
- 끊긴 연결 자동 reconnect 정책
- frontend 가 connection state 표시 (현재 useSdkProgress 가 ConnectionState 노출 — backend 측 정책 명시 필요)

## Acceptance criteria

S2 측에서:
- [ ] 위 모든 항목 (A1-A5, B1-B5, C1-C4, D1-D6, E1-E2, F1-F3, G1-G3, H1-H4, I1-I3, J1-J3, K1-K6, L1-L2, M1-M3, N1-N3, O1-O2) 에 대해 항목별 명시 답변:
  - **immediate** (이번 cycle 에 구현)
  - **planned** (다음 sprint / 명시 일정)
  - **future** (가능하지만 우선순위 낮음)
  - **rejected** (구현 안 함, 사유 포함)
  - **frontend autonomous** (S2 영역 아님, S1 자율 결정 OK)
- [ ] `immediate` / `planned` 항목은 canonical doc (`wiki/canon/api/shared-models.md`, `wiki/canon/handoff/s2/api-endpoints.md`, `wiki/canon/specs/backend.md`) 갱신 후 reply WR 발행
- [ ] `rejected` 항목은 reply WR 본문에 사유 명시 — S1 이 자가 판단으로 우회 안 하도록

S1 측에서:
- [ ] S2 reply 후 항목별 backend 결정에 따라 SdkManagementSection 데이터 활용 보강 사이클 진행
- [ ] `frontend autonomous` 항목은 S1 이 자율 결정 (예: troubleshooting URL 정적 fallback hardcode)
- [ ] `rejected` 항목은 mock layout 에서 해당 UI 요소 미표시 처리

## Constraints

- 본 WR 항목 수가 많지만 **항목별 독립 결정 가능** — S2 가 부담 시 핵심 항목 (A1, A2, B1, B3, B4, C1, D3) 우선 처리, 나머지는 follow-up reply 분리 가능
- 다른 lane 코드 미열람 (S1 lane 경계). 모든 답변은 canonical doc 갱신으로 받음
- mock v2 는 "레이아웃 참고용" — 본 WR 의 데이터 갭은 동작/계약 보강이지 mock 의 시각 토큰 흡수 의미 아님
- S2 의 2026-04-25 reply 의 normative 부분 (8 항목 답변) 은 그대로 유지 — 본 WR 은 그 위에 후속만

## 우선순위 신호 (S1 관점)

S1 의 SDK section UX 완성도에 가장 영향이 큰 순서:

1. **HIGH** — A1 (etaSeconds), A2 (phaseStartedAt), B1 (phaseDetail), B3 (retryable), B4 (error code), C1 (retry endpoint), D3 (live log streaming)
2. **MEDIUM** — A3 (phaseHistory), A4 (cadence), C2-C4 (retry policy), D1-D2 (log api), D5 (logPath 통합), G1-G2 (concurrent/quota), H1 (DELETE in-flight)
3. **LOW** — E1-E2 (i18n), F1-F3 (precision), I1-I3 (mock fixtures), J1-J3 (versioning), K1-K6 (작은 명확화), L1-L2 (artifactKind 카피), M1-M3 (profile), N1-N3 (error UX), O1-O2 (observability)

S2 가 우선순위에 따라 단계별 처리해도 OK — 본 WR 은 일괄 명시이지만 implementation 은 단계별 가능.

## 참고 — mock v2 정보 풍부도 매핑

```
mock v2 line 850-867 의 stepper + progress + analyzing detail:
  "13초 경과 · ETA ~45초"   → 그룹 A (etaSeconds + phaseStartedAt)
  "분석 중: /opt/yocto/..."  → 그룹 B1 (phaseDetail.params.path) + fileName 명확화
  "Static 분석 64%"          → 그룹 F1 (percent precision)

mock v2 line 882 의 failed 카드:
  "[재시도] [삭제]"          → 그룹 C (retry endpoint) + 그룹 B3 (retryable)

mock v2 line 897-903 의 err-block:
  "테스트 프로그램 컴파일 실패: 'stdio.h' not found in sysroot"  → 그룹 N1 (userMessage + technicalDetail)
  "로그: /var/log/aegis/sdk/.../install-...log"                → 그룹 D5 (logPath 통합) + 그룹 D4 (보안)
  "[로그 보기]"                                                → 그룹 D1-D2 (log API)
  "[문제 해결 가이드]"                                         → 그룹 B2 (troubleshootingUrl)
```

## Completion expectation

- 본 WR 처리는 S2 가 항목별 명시 답변 후 `complete_wr lane=s2` 로 마감
- S1 은 그 답변에 따라 별도 사이클 (`s1-to-s1-sdk-management-data-utilization-after-s2-2nd-clarification` 등) 으로 데이터 활용 보강 진행
- canonical doc 갱신이 동반된 항목은 `git log` 또는 `wiki/system/log.md` recent changes 로 verify

## Notes

- 본 WR 은 doctrine §3.2 (자가 판단 금지) + §7.2.2 (DESIGN.md 위반 의심 시 stop) 의 정공법 두 번째 적용
- 사용자가 "사소한 것 까지 하나하나 지시해줘" 명시한 결과 — 항목 수가 많은 것은 의도적
- S2 reply 의 친절한 "future feature 가능 영역" 5 개 명시가 본 WR 의 출발점이며, 그 friendliness 가 본 WR 의 항목별 결정 협상을 가능하게 만들었다 — 감사

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
