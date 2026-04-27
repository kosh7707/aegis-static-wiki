---
title: "SDK 업로드 진행 표면 — stepper mapping / ETA / retry / phase-specific detail / fileName semantics 계약 명시 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "websocket"]
decision_tags: ["sdk-upload", "websocket-contract", "progress-ux", "phase-mapping", "design-mock-v2-alignment"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md", "wiki/canon/work-requests/s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t.md", "wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/design-system.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-25T07:22:38.807Z","note":"S2 inspected current SDK implementation and tests, updated canonical API/endpoint/spec docs, and registered reply WR to S1: wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a.md. Normative answers cover all 8 requested points: 5-step mapping, no ETA, elapsed via WS meta.timestamp first-seen, message/fileName semantics, no retry endpoint, log endpoint usage, no troubleshootingUrl, and artifactKind-specific phase flows. Verification passed: SDK/API tests 157 passed, backend/shared typecheck/build passed, architect re-review approved."}]
registered_at: "2026-04-25T07:06:29.434Z"
completed_at: "2026-04-25T07:22:38.807Z"
---

# SDK 업로드 진행 표면 — stepper mapping / ETA / retry / phase-specific detail / fileName semantics 계약 명시 요청

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

2026-04-25 autopilot Phase 2b' / 2b'' 사이클에서 ProjectSettingsPage 를 외부 디자이너 mock v2 (`Project Settings Mock v2.html` line 700-993) 의 layout 으로 전면 redesign 했다. SdkManagementSection 의 시각 layout (5단계 stepper / progress bar / err-block / ready/active/failed 변형 등) 은 mock 정합으로 99.7% 흡수했다.

그러나 reviewer 패스에서 **"layout 은 만들었지만 그것을 채울 데이터 매핑이 backend 의도와 정합하는지" 미검증** 갭이 발견됐다. S1 이 자가 판단으로 매핑 추정 후 코드를 채우면 doctrine §3.2 (디자인 자가 판단 금지) + §7.2.2 (DESIGN.md 위반 의심 시 stop 후 확인) 위반 위험. 동시에 사용자 의도 ("mock 이 바라는 정보 풍부도 = 우리가 보여줄 정보 풍부도") 와 정합하지 않을 수 있음.

따라서 S1 은 SdkManagementSection 의 데이터 활용도 보강 작업을 잠시 stop 하고, 다음 항목들에 대한 S2 계약 명시를 요청한다. S2 응답을 받으면 별도 사이클로 처리.

## 이미 명확한 것 (참고)

다음 4 WR 의 normative 부분에서 이미 확정된 것들:
- WS `/ws/sdk?projectId=<projectId>` 채널
- `sdk-progress { sdkId, phase, message, percent?, uploadedBytes?, totalBytes?, fileName? }`
- `sdk-complete { sdkId, profile, path? }`
- `sdk-error { sdkId, phase, error, logPath? }`
- 9-phase family: `uploading / uploaded / extracting / extracted / installing / installed / analyzing / verifying / ready`
- 4-error family: `upload_failed / extract_failed / install_failed / verify_failed`
- `RegisteredSdk` metadata: `artifactKind / sdkVersion / targetSystem / installLogPath / status / verifyError / path / profile`
- recovery: `GET /api/projects/:pid/sdk/:id`, `GET /api/projects/:pid/sdk`

이 부분은 그대로 유지된다. 본 WR 은 그 위에 남은 빈틈만 묻는다.

## 명시 요청 — 8 가지

### 1. 9 phase → mock 5단계 stepper 매핑의 정식 결정

mock v2 line 850-859 는 5단계 stepper 다:

```
업로드  →  설치/압축해제  →  AI 분석  →  검증  →  완료
```

S1 의 추정 매핑:

| Stepper 단계 | 해당 backend phase 추정 |
|---|---|
| 업로드 | `uploading`, `uploaded` |
| 설치/압축해제 | `extracting`, `extracted`, `installing`, `installed` |
| AI 분석 | `analyzing` |
| 검증 | `verifying` |
| 완료 | `ready` |

질문:
- 이 매핑이 backend 의도와 정합하는가?
- 또는 S2 가 "frontend 가 stepper 묶음 자유, backend 는 9 phase 그대로 송신" 이라고 선언하는가?
- 후자면 본 WR 의 다른 매핑 의문 항목도 동일 방식으로 자유 결정 가능?

### 2. Per-phase ETA — backend 가 흘려줄 수 있는가

mock v2 line 848 표현:

```
13초 경과 · ETA ~45초
```

질문:
- backend 가 통계/heuristic 기반 ETA 를 알 수 있는가?
- 알 수 있다면 `sdk-progress` payload 에 `etaSeconds?: number` 추가 의향?
- 알 수 없다면 frontend 는 ETA 표시를 미구현으로 둔다 (mock 의 ETA 는 정보 없으면 생략).

### 3. Per-phase elapsed — phase 변경 시점 신호

질문:
- 현재 `sdk-progress` 의 어느 field 가 phase 변경 시점을 명확히 신호하는가? (`phase` 값이 바뀌는 첫 메시지의 도착 시각이 client-side 측정 기준점인가?)
- backend 가 `phaseStartedAt?: number` (epoch ms) 를 흘려줄 의향이 있는가? — 이게 있으면 client 는 정확한 elapsed 표시 가능.
- 없으면 client 가 first-seen-of-phase 시각으로 측정 (정확도 약간 낮음).

### 4. Phase-specific detail — `message` field 의 용도

mock v2 line 193 표현:

```
Static 분석 64% · Agent · taint-flow heuristic
```

질문:
- 현재 `sdk-progress.message` field 가 위와 같은 phase-specific sub-detail 용도인가?
- 그렇다면 phase 별로 어떤 detail 카피가 송신되는지 (또는 송신될 수 있는지) 예시 1-2 개 제공 가능?
- 또는 `message` 는 일반 status text 이고 별도 `phaseDetail?: string` 같은 field 로 분리해야 하는가?

### 5. `fileName` semantics — phase 마다 의미가 다른가

질문:
- `uploading` 일 때 `fileName` = "업로드 중인 multipart 파일"
- `extracting` / `installing` 일 때 = "추출/설치 중인 entry"
- `analyzing` / `verifying` 일 때 = "분석/검증 대상 파일" — 이 해석이 정합?
- path 가 absolute (`/opt/yocto/...`) 인지 relative (`yocto/sysroots/...`) 인지? 어느 쪽이든 frontend display 시 ellipsis 처리 가능하지만 의도된 형식 명시 요청.
- 매우 긴 path 의 경우 backend 가 abbreviation 책임 가지는가, frontend 가 truncate 책임 가지는가?

### 6. Retry action — 실패 후 재시도 endpoint 가 있는가

mock v2 line 882 표현:

```
[재시도] [삭제]   ← failed 카드의 우측 액션
```

질문:
- 실패한 SDK 에 대한 재시도 endpoint 가 있는가? (예: `POST /api/projects/:pid/sdk/:id/retry`)
- 없다면 retry 흐름이 "이전 SDK 삭제 → 같은 파일 다시 등록" 인가?
- 후자면 frontend 가 그 흐름을 묶어서 단일 "재시도" 버튼으로 노출해도 되는가? (UX 결정은 S1 권한이지만 backend 부작용/quota 영향 확인 필요)

### 7. 문제 해결 가이드 / log 접근

mock v2 line 901-903:

```
[로그 보기] [문제 해결 가이드]
```

질문:
- `installLogPath` / `logPath` 는 server-side 경로인데, frontend 가 "로그 보기" 클릭 시 어떻게 접근하는가?
  - REST endpoint 로 log 내용 streaming/download? (예: `GET /api/projects/:pid/sdk/:id/install-log`)
  - 또는 path 만 표시 (admin 이 SSH 로 접근)?
- "문제 해결 가이드" 링크는 정적 (frontend 하드코딩) vs 동적 (backend 가 error 마다 다른 link 흘려줌)?
- error payload 에 `troubleshootingUrl?: string` 같은 field 추가 의향이 있는가?

### 8. `artifactKind` 별 phase 흐름 차이

질문:
- `archive` (tar.gz) → uploading → extracting → installing → analyzing → verifying → ready (정상 흐름)
- `bin` (ETXTBSY 안전화 버전) → uploading → installing → analyzing → verifying → ready (extracting 없음?)
- `folder` (multi-file directory upload) → uploading (multi-file) → installing? → analyzing → verifying → ready

세 kind 의 phase 흐름이 다른가? frontend stepper 가 이를 다르게 그려야 하는가? 아니면 9 phase 가 모두 등장 가능하고 frontend 는 항상 5 stepper 로 mapping 해도 되는가?

## Acceptance criteria

S1 측에서는:
- [ ] 본 WR 에 대해 S2 가 normative 답변을 정리하면, S1 이 별도 사이클로 SdkManagementSection 의 데이터 활용도 보강 (byte-level text / fileName display / phase-specific detail / retry action / log access / metadata row 등) 을 진행
- [ ] 본 WR 응답이 도착하기 전까지 S1 은 자가 판단 매핑으로 코드를 채우지 않음 (현재 layout 은 mock-shape 으로 만들어두고 데이터 비어있어도 hidden 처리)

S2 측에서는:
- [ ] 위 8 항목에 대해 normative answer 또는 "frontend 자율 결정 OK" 결정
- [ ] 필요한 경우 `wiki/canon/api/shared-models.md`, `wiki/canon/handoff/s2/api-endpoints.md` 갱신
- [ ] 새 endpoint 도입이 필요한 항목 (retry / log access 등) 은 별도 reply WR 또는 동 페이지 갱신으로 명시

## Constraints

- S1 은 다른 lane 코드 미열람 — 본 WR 응답은 canonical 문서 갱신으로 받는 게 자연스러움
- mock v2 는 "레이아웃 참고용" 이고 토큰·폰트 권위는 canonical (`wiki/canon/design-system/DESIGN.md`) — 본 WR 의 데이터 갭은 전부 실제 동작/계약 보강 영역이며 mock 의 시각 토큰을 흡수하자는 의미가 아님

## Notes

- 본 WR 은 doctrine §7.2.2 ("DESIGN.md 위반 의심 시 stop 후 확인") + §3.2 ("자가 판단 금지") 의 정공법 적용 사례. autopilot scope 안에서 자가 판단 매핑을 시도하지 않고 lane 경계를 지키며 backend 정의를 기다리는 것.
- 이미 발행된 4건의 S2→S1 SDK 업로드 UX WR 들의 후속 협상 표면이며, 그 WR 들의 acceptance 를 약화시키지 않는다 — 오히려 그 acceptance 를 정확히 충족하기 위한 빈틈 명시.

## Completion expectation

- 본 WR 처리는 S2 가 normative 답변 후 `complete_wr lane=s2` 로 마감
- S1 은 그 답변에 따라 별도 사이클 (`s1-to-s1-sdk-management-data-utilization-after-s2-clarification` 등) 발행 후 진행

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
