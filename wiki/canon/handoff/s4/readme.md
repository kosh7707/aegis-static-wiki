---
title: "S4. SAST Runner 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s4-handoff/README.md"
last_verified: "2026-05-12"
service_tags: ["s4"]
decision_tags: []
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md"]
---

# S4. SAST Runner 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.** 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다.
> 이 문서는 S4(SAST Runner) 개발을 이어받는 다음 세션을 위한 진입점이다.
> **마지막 업데이트: 2026-05-12**

---

## 1. 역할과 경계

### 너는

- **SAST Runner 전담 개발자** (`services/sast-runner/`)
- `wiki/canon/api/sast-runner-api.md` API 계약서 소유
- `wiki/canon/specs/sast-runner.md` 명세서 소유
- `scripts/start-sast-runner.sh` + `services/sast-runner/.env` 소유
- 12개 엔드포인트 관리: scan (동기+NDJSON 스트리밍+durable ownership), functions, includes, metadata, libraries, build, build-and-analyze, discover-targets, health, request status, request result, request cancel
- build path는 execution-only. SDK/toolchain/build-command 해석은 하지 않음
- `metadata.cweId` 표준화 — 전 도구에서 CWE 식별자를 `cweId` 필드로 제공 (S2 Finding 매핑용)
- `metadata.evidenceResolution` + enriched `scan.sca.libraries[]` — SAST/SCA evidence 해상도를 높이는 deterministic projection (보안 판정/CVE 조회 아님)
- `staticEvidenceContract` v1 구현 — `wiki/canon/specs/sast-runner-static-evidence-contract.md`가 canonical Coverage/Readiness/Claim-boundary/toolEvidenceMatrix contract이며, `/v1/scan` 및 `/v1/build-and-analyze`에 additive로 부착된다. Per-tool anomaly는 `systemStability=degraded`와 `coverage.staticToolExecution=partial/anomalyReasonCodes[]`로 전파된다.
- Golden Corpus v1 / Tool Portfolio Governance v1 — `services/sast-runner/tests/fixtures/golden_corpus_v1/manifest.json`, `benchmark/static_evidence_report.py`, `benchmark/tool_portfolio_governance.py`, `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`가 validation/report/governance baseline이다. 현재 decision은 `keep-current-six-tools`다. Golden Corpus v1은 structural graph, SCA diff partial, degraded execution, policy failure, CWE-120, CWE-190, CWE-416 canary를 포함한다.
- Static Evidence consumer canaries — `benchmark/static_evidence_consumer_canary.py`와 `tests/fixtures/static_evidence_contract/consumer_canaries/*.json`은 S3-facing JSON contract 소비 semantics를 S4 내부 app import 없이 검증한다.
- Claim Support Readiness — `app/scanner/claim_support_gate.py`와 `tests/fixtures/claim_support_gate_v1/manifest.json`은 Quality Gate가 concrete SAST tool identity가 아니라 normalized evidence + claim boundaries만으로 bounded claim support를 판정하도록 잠근다. Runtime `qualityEvaluation`은 여전히 `not_evaluated`다.
- Tool Output Compatibility v1 — `benchmark/tool_output_compat.py`와 `tests/fixtures/tool_output_compat_v1/manifest.json`은 현재 6개 도구 raw output parser 호환성을 외부 도구 실행 없이 잠근다. Governance `parserCompatibility` gate가 이 report를 소비한다.
- Benchmark Slice Report v1 — `benchmark/benchmark_slice_report.py`는 pinned historical Juliet baseline JSON만 읽어 variant-01 precision/FP와 all-variant noise evidence를 source-scoped로 제공한다. Governance `benchmarkSliceCoverage` gate가 이 evidence를 소비한다.

### 너는 하지 않는다

- DGX Spark / LLM Engine 관리 -> **S7**
- CVE 조회 -> **S5** (`POST /v1/cve/batch-lookup`으로 이관 완료)
- 프롬프트 작성, LLM 응답 파싱 -> S3
- 지식 그래프, 벡터 검색 -> S5
- UI -> S1
- `scripts/start.sh` / `scripts/stop.sh` 직접 수정 금지 -> S2에 work-request

### Codex / OMX 운영 메모

- 하드 가드레일 재확인:
  - S4는 **다른 서비스 코드를 읽지 않는다**.
  - 다른 서비스와의 소통은 **WR로만** 한다.
  - 연동 판단은 `wiki/canon/api/` 계약서만 보고, 부족하면 담당자에게 WR을 보낸다.
  - **커밋은 하지 않는다**. 커밋은 S2 세션만 한다.
  - `scripts/start*.sh`, `scripts/stop*.sh`, 서비스 기동 명령은 **사용자 허락 없이 실행하지 않는다**.
  - 로그/장애 분석은 `log-analyzer` MCP를 우선 사용한다.
- lane 전용 작업 메모와 후속 세션 인계는 `wiki/canon/handoff/s4/`와 `.omx/state/sessions/{session-id}/...`를 우선 사용한다.
- 공용 `.omx/notepad.md`, `.omx/project-memory.json`에는 전역 durable 정보·공통 운영 규칙·cross-lane에 실제 필요한 사실만 짧게 남긴다.
- **`$ralph`**: 스캐너 안정화, 빌드 파이프라인 복구, 벤치마크 개선처럼 한 lane이 끝까지 파고들어야 하는 작업에 우선 사용한다.
- **`$team`**: S2 계약 조정, S5 CVE/KB 연동, S7 모델/프롬프트 영향 점검처럼 여러 lane이 동시에 얽히는 작업에 우선 사용한다.
- **`$trace`**: 이전 Codex/OMX 세션의 검증 흐름, 실패 원인, 반복 실험을 복기할 때 사용한다.
- skill을 써도 **소유권, API 계약, work-request 규칙은 변하지 않는다**.

---

## 2. 서비스 현황

| 항목 | 값 |
|------|-----|
| 위치 | `services/sast-runner/` (monorepo 내, WSL2 로컬) |
| 스택 | Python 3.12 + FastAPI + Uvicorn |
| 포트 | 9000 |
| 버전 | **v0.11.2** |
| 테스트 | **642개 통과** (2026-05-12 staticEvidenceContract / Golden Corpus / governance / S3-consumable toolEvidenceMatrix / per-tool anomaly propagation / consumer canary / Tool Output Compatibility v1 / Benchmark Slice Report v1 / claimSupportReadiness / required-tool system-stability / local Quality Gate threshold-oracle hardening 후 전체 pytest 재확인); latest full gate **642 passed in 25.57s** |
| 도구 생존성 | **current six all alive** (2026-05-12 `ScanOrchestrator.check_tools(force=True)`): `policyStatus="ok"`, `unavailableTools=[]` |
| 품질 Gate | **not decision-grade / local fail**: S4 harness fixture report는 `qualityGate.status="not_decision_grade"`, `qualityGate.localQualityAssessment.status="fail"`; `validation`/`test` fail, `canary` pass |
| 벤치마크 | Juliet 12 CWE, Overall Recall **83.7%** |
| 통합테스트 | **통과** (e2e-1774920375, S4 에러 0건) |

현재 `/v1` 계약의 핵심:
- build / scan / build-and-analyze가 nested `provenance` 입력을 받음
- `/v1/build`는 structured `buildEvidence` + `readiness` + `failureDetail` 반환
- build preparation의 canonical ready 조건은 `readiness.compileCommandsReady=true` + `buildEvidence.userEntries>0` + `buildEvidence.exitCode==0`
- analysis path SDK contract는 `none`, `non-registered`, S4-local `{sdkId}` 세 가지다. `sdkResolutionMode="none"`은 registry lookup 금지, `sdkResolutionMode="non-registered"`는 caller-resolved `sdkDescriptor.sdkRootPath` 필수다. legacy `sdkId="custom"` sentinel은 더 이상 허용하지 않는다. 알 수 없는 bare sdkId는 `SDK_NOT_FOUND` 400으로 실패하고 source-only fallback으로 계속 돌지 않는다
- `/v1/scan` NDJSON heartbeat와 final execution은 degraded-aware metadata를 포함
- `/v1/scan` findings는 `metadata.evidenceResolution` 아래에 deterministic CWE/location/dataflow/origin diagnostics를 포함한다. verdict-like fields(`vulnerable`, `safe`, `affected`, `clean`, `riskScore`, `securityVerdict`)는 금지다
- `/v1/scan` projectPath SCA projection은 enriched `sca.libraries[]` shape를 제공한다: legacy `name/version/path/repoUrl` + `source/commit/branch/tag/nearestTag/versionStatus/versionEvidence/diagnostics/diffAvailable/modificationStatus/provenance.libraryPath` 등. `/v1/build-and-analyze` top-level `libraries[]`는 nested `scan.sca.libraries[]`와 같은 shape다
- explicit Quick는 `/v1/build` ready 이후 `compileCommands` 를 포함한 `/v1/scan` one-shot 호출로 취급하며, Deep 자동 연쇄를 전제하지 않음
- `/v1/scan` / `/v1/build-and-analyze`에는 **허용된 skip만 성공 가능한 omission policy gate** 가 있음
- 성공 응답이어도 current tool `partial`/`failed`/degraded/blocking skip/missing/unknown metadata가 있으면 `staticEvidenceContract.gates.systemStability.status="degraded"`, `coverage.staticToolExecution.status="partial"`로 소비자에게 명시함
- S3-facing consumer canary는 raw `execution.toolResults` 대신 contract block만 읽어 `localStaticEvidenceReady`를 판정하며, 이제 `claimSupportReadiness=pass`까지 요구한다. absent/malformed contract는 outer `success=true`와 무관하게 not-ready로 본다
- `/v1/health`는 기존 top-level `semgrep` 필드를 유지한 채 `tools`, `policyStatus`, `policyReasons`, `unavailableTools`, `allowedSkipReasons`, `defaultRulesets`, `activeRequestCount`, `requestSummary`를 노출하며, additive `localAckState`로 `phase-advancing` / `transport-only` / `ack-break`를 함께 제공
- `/v1/health?requestId=...` 로 `scan` / `build` / `build-and-analyze` 요청의 queued/running/degraded/ack-break equivalent를 polling-friendly summary로 조회 가능
- health-control v2 durable ownership mode가 추가됨: `Prefer: respond-async`를 보내면 `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`가 `202` + `statusUrl`/`resultUrl`을 반환하고, `/v1/requests/{requestId}` 및 `/v1/requests/{requestId}/result`로 terminal result/failure/cancelled를 회수한다
- `Prefer: respond-async`는 `Accept: application/x-ndjson`보다 우선한다. NDJSON은 compatibility stream이고, transport interruption 후 결과 회수가 필요한 production caller는 durable ownership mode를 사용해야 한다
- durable ownership에서 `X-Request-Id`는 operation key이기도 하다. 같은 endpoint 재시도는 idempotent reuse지만, 다른 endpoint가 같은 ID를 쓰면 `409 REQUEST_ID_CONFLICT`로 실패한다
- async ownership build path는 caller `X-Timeout-Ms`를 hard subprocess deadline으로 쓰지 않으며, `buildEvidence.timeoutMode="async-ownership-no-caller-deadline"`, `timeoutEnforced=false`로 노출한다
- `DELETE /v1/requests/{requestId}`는 best-effort cancel이다. queued/running이면 `202`, terminal `state="cancelled"`, `resultReady=true`, nested `errorDetail.code="REQUEST_CANCELLED"`, health `ackStatus="broken"`/`localAckState="ack-break"`/`lastAckSource="request-cancelled"`로 전환한다. 이미 terminal이면 `200` idempotent, unknown `404`, expired `410`이다
- **운영 메모 (2026-04-14):** canonical code/docs는 request-summary contract를 포함하지만, live `localhost:9000` 인스턴스는 재기동 전까지 coarse-only shape 또는 no-listener 상태일 수 있다. live rollout readiness 판단은 실제 프로세스 재기동 여부를 함께 확인해야 한다.
- `/v1/build-and-analyze`는 convenience / transitional surface로 유지
- S2 요청에 대한 reply WR 발송 완료: `wiki/canon/work-requests/s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4.md`
- S3 요청에 대한 reply WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md`
- S3 follow-up reply WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m.md`
- S3 wait-while-alive follow-up reply WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md`
- 최근 완료 WR: S3 unknown sdkId evidence suppression WR, S2 durable ownership cancel endpoint WR (2026-05-08). 회신 WR 등록 및 수신 WR S4 lane 완료 처리됨

### 6개 SAST 도구

| 도구 | profile | 핵심 특성 |
|------|:---:|------|
| Semgrep | -- | taint mode + sanitizer. C++에서 확장자 필터 (`--include *.c *.h`). 2026-05-12 probe: available, `1.156.0` |
| Cppcheck | **original** | `--check-level=exhaustive`. SDK 헤더 제외. 2026-05-12 probe: available, `2.13.0` |
| clang-tidy | **enriched** | CWE 매핑 24개. SDK 헤더 포함. 2026-05-12 probe: available, `18.1.3` |
| Flawfinder | -- | 텍스트 기반. 2026-05-12 probe: available, `2.0.19` |
| scan-build | **enriched** | CWE 매핑 15개. `-plist` 필수. 파일별 실행. `Semaphore(8)`. 2026-05-12 probe: available, `scan-build` |
| gcc-fanalyzer | **original** | CWE 매핑 16개. `-c` 필수. 파일별 실행. `Semaphore(8)`. GCC 10+. 2026-05-12 probe: available, GCC `13.3.0` |

현재 상태 해석:
- `policyStatus="ok"` / all alive는 **시스템 안정성** 신호다.
- local harness의 `qualityGate.localQualityAssessment.status="fail"`은 **품질 threshold** 신호다.
- 두 Gate는 독립이다. 도구가 모두 살아 있어도 validation/test 품질 threshold가 실패할 수 있다.

### 코드 구조

```text
services/sast-runner/
├── app/
│   ├── main.py              — FastAPI v0.11.2, JSON 로깅
│   ├── config.py            — pydantic-settings (SAST_ prefix)
│   ├── context.py           — contextvars requestId 전파
│   ├── errors.py            — 커스텀 도메인 에러 (`SDK_NOT_FOUND`, `SDK_PROFILE_INVALID` 등)
│   ├── routers/scan.py      — 9개 엔드포인트
│   ├── schemas/
│   │   ├── request.py       — provenance 포함 `ScanRequest` / `BuildRequest` / `BuildAndAnalyzeRequest`
│   │   └── response.py      — `BuildResponse`, `ScanResponse`, `ExecutionReport` 등 `/v1` 계약 스키마
│   └── scanner/
│       ├── orchestrator.py   — 6도구 병렬 + scope-early + 경계면 필터링
│       ├── evidence.py       — deterministic evidence-resolution projection
│       ├── static_evidence_contract.py — Coverage/Readiness/Claim-boundary contract builder
│       ├── semgrep_runner.py — taint + sanitizer, include_extensions 필터
│       ├── cppcheck_runner.py
│       ├── clangtidy_runner.py — CWE 매핑 24개
│       ├── flawfinder_runner.py
│       ├── scanbuild_runner.py — CWE 매핑 15개, Semaphore(8)
│       ├── gcc_analyzer_runner.py — CWE 매핑 16개, check_available(profile)
│       ├── sarif_parser.py
│       ├── ruleset_selector.py — semgrep_include_extensions()
│       ├── path_utils.py
│       ├── sca_service.py    — SCA 오케스트레이션 + CloneCache
│       ├── sdk_resolver.py   — analysis path용 내부 SDK 해석 유틸
│       ├── ast_dumper.py     — 함수 추출 + origin 태깅 + Semaphore(16)
│       ├── include_resolver.py
│       ├── build_metadata.py
│       ├── build_runner.py   — caller-materialized build 실행 + 타겟 탐색
│       ├── library_identifier.py
│       ├── library_differ.py — DiffResult 통일 shape + CloneCache
│       └── library_hasher.py
├── rules/automotive/        — 커스텀 Semgrep 룰 39개 (9 YAML)
├── benchmark/               — Juliet 벤치마크 러너 + 코드그래프 품질 평가
├── tests/                   — 503개 테스트 (2026-05-11 전체 pytest 통과) + evidence_oracles + SDK/cancel contract tests
└── requirements.txt
```

### 기동 / 환경

```bash
# 사용자 허락 없이 실행하지 말 것
./scripts/start-sast-runner.sh
tail -20 logs/s4-sast-runner.jsonl
```

- `scripts/start-sast-runner.sh`는 기본적으로 `uvicorn --reload --reload-dir app`로 실행된다.
- 핫 리로드를 끄고 단일 프로세스로 띄우려면 `SAST_HOT_RELOAD=0 ./scripts/start-sast-runner.sh`를 사용한다.

`.env` / 기본값 예시:
```env
SAST_PORT=9000
SAST_SCAN_TIMEOUT=120
SAST_MAX_CONCURRENT_SCANS=2
SAST_SDK_ROOT=/opt/sdks   # 예시값 — 환경별로 교체
```

**주의**: `list[str]` 타입 필드를 `.env`에 쓰면 pydantic-settings JSON 파싱 실패. `str` 타입 + `@property`로 우회 (config.py 참조).

### Observability

`wiki/canon/specs/observability.md` 준수.
- service 식별자: `s4-sast`
- 로그 파일: `logs/s4-sast-runner.jsonl`
- JSON structured, `time` epoch ms, `level` 숫자 (pino 표준)
- `X-Request-Id` 전파
- 고도화된 structured summary 로그:
  - `SAST Runner runtime configuration` — startup 설정, `hotReload`, port, concurrency, rulesets
  - `SAST Runner ready for traffic` — tool policy/availability probe 이후 traffic 수신 가능 상태
  - `Scan execution summary` — scanId/projectId, 도구별 findings/latency/status, filter counters, SDK/compileCommands/degraded 정보
  - `Build execution summary` — build readiness, compileCommandsReady/quickEligible, entries/userEntries/exitCode/failureCategory
  - `Request terminal summary` — `/v1/health` requestSummary와 같은 terminal state/ackStatus/localAckState/blockedReason

---

## 3. 핵심 설계 원칙

- **결정론적 처리 최대화, LLM 결정 표면 최소화**
- **도구별 profile 분리** — 컴파일 기반 도구만 SDK enriched, 나머지는 original
- **scope-early** — `thirdPartyPaths` 파일을 도구 실행 전에 제외 (OOM 방지)
- **경계면 분석** — SDK/라이브러리 경로 finding이라도 dataFlow에 사용자 코드 포함 시 유지 (`origin: "cross-boundary"`)
- **gcc-fanalyzer는 `-c`** (`-fsyntax-only`에서는 analyzer가 실행 안 됨)
- **scan-build는 `-plist`** (없으면 plist 파일 미생성)
- **파일별 개별 실행** (gcc-fanalyzer, scan-build — 동일 심볼 충돌 방지)
- **CWE는 전 도구에서 태깅** — scan-build/gcc-fanalyzer도 매핑 추가 완료
- **Semgrep taint + sanitizer** — source/sink 자동 추적 + 가드 패턴 제외

---

## 4. 내부 SDK 해석 데이터 (analysis path only)

```text
$SAST_SDK_ROOT/              <- .env 예시: SAST_SDK_ROOT=/opt/sdks (환경별로 교체)
  ├── sdk-registry.json       <- SDK 메타데이터 (외부 설정, 코드 밖)
  └── ti-am335x/              <- sdkId = 폴더명
```

| sdkId | SDK | GCC 버전 | 비고 |
|-------|-----|:---:|------|
| `ti-am335x` | TI AM335x 08.02.00.24 | 9.2.1 | `-fanalyzer` 미지원 -> 호스트 gcc 폴백 또는 SDK gcc 재확인 |

**중요**: `/v1/sdk-registry` public API는 제거되었다.
이 데이터는 현재 analysis path 내부 해석에만 남아 있으며, build path는 더 이상 `sdkId`를 받지 않는다.

정식 S1/S2 SDK upload/registration 루트 밖에서 S3가 서비스를 단독 테스트할 때는 임의 `sdkId`나 `custom` sentinel을 보내지 말고, `sdkResolutionMode="non-registered"` + `sdkDescriptor.sdkRootPath`를 보내야 한다. S4는 이 descriptor에서 include/sysroot/compiler/setup 후보를 결정론적으로 산출하며 registry를 조회하지 않는다. SDK가 없음이 명확한 경우는 `sdkResolutionMode="none"`을 사용한다.

---

## 5. 관리하는 문서

| 문서 | 경로 |
|------|------|
| API 계약서 | `wiki/canon/api/sast-runner-api.md` |
| 기능 명세서 | `wiki/canon/specs/sast-runner.md` |
| 이 인수인계서 | `wiki/canon/handoff/s4/readme.md` |
| 로드맵 | `wiki/canon/roadmap/s4-roadmap.md` |
| Build Snapshot consumer seam 설계 메모 | `wiki/canon/handoff/s4/build-snapshot-consumer-seam.md` |
| 세션 로그 | `wiki/canon/handoff/s4/session-*.md` |

---

## 6. 다음 작업

`wiki/canon/roadmap/s4-roadmap.md` 참조.
