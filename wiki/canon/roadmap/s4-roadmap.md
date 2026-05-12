---
title: "S4 SAST Runner — 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s4-handoff/roadmap.md"
original_path: "docs/s4-handoff/roadmap.md"
last_verified: "2026-05-11"
service_tags: ["s4"]
decision_tags: []
related_pages: ["wiki/canon/handoff/s4/readme.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md"]
migration_status: "canonicalized"
---

# S4 SAST Runner — 로드맵

> 다음 작업 + 후순위 계획. README.md에서 분리.
> **마지막 업데이트: 2026-05-11**

---

## 즉시 다음

현재 미처리 WR 없음. (`list_my_open_wrs(lane="s4", include_to_all=true)` 2026-05-11 처리 후 재확인)

후속 후보:
- Additional S3 EvidenceCatalog sample payloads only if S3 requests more consumer-specific cases beyond the current consumer canaries.
- downstream(S2/S3) build-path adaptation feedback 수신 시 contract drift 보정
- analysis path inversion 필요 여부는 별도 논의
- `discover-targets` identity-hint를 upstream durable `buildUnitId` 매핑으로 연결할지 재검토

---

## 최근 완료

- ~~Benchmark Slice Report v1 + governance benchmarkSliceCoverage gate~~ — **완료** (2026-05-11)
  - pinned historical artifacts `v0.6.0-full.json` and `v0.7.0-all-variants.json` only
  - variant-01 recall/precision/FP and all-variant recall/noise/noisePerFile kept source-scoped
  - report is offline quality evidence only, not runtime qualityEvaluation or tool-change decision
  - Full S4 pytest: `503 passed in 13.93s`

- ~~Tool Output Compatibility v1 + governance parserCompatibility gate~~ — **완료** (2026-05-11)
  - Semgrep SARIF, Cppcheck XML, Flawfinder CSV, clang-tidy text, scan-build plist, gcc-fanalyzer text parser fixtures 추가
  - `benchmark/tool_output_compat.py` report를 Tool Portfolio Governance v1 `parserCompatibility` gate에 연결
  - 외부 도구 실행, 네트워크, 새 SAST 도구, API v2 분리 없음
  - Full S4 pytest: `496 passed in 13.08s`

- ~~staticEvidenceContract consumer canary harness~~ — **완료** (2026-05-11)
  - precomputed full-response JSON fixtures로 top-level 및 nested `scan.staticEvidenceContract` consumption을 고정
  - clean/degraded failed-tool/missing metadata/policy failure/allowed skip/absent/malformed/poisoned raw execution cases 추가
  - helper는 S4 app import 없이 `gates`, `coverage`, `claimBoundaries`, `toolEvidenceMatrix`만 소비
  - Full S4 pytest: `490 passed in 13.35s`

- ~~per-tool anomaly gate propagation hardening~~ — **완료** (2026-05-11)
  - 성공 응답 안의 tool `failed`/`partial`/degraded/blocking-skip/missing/unknown metadata를 `systemStability=degraded`로 전파
  - `coverage.staticToolExecution=partial`, `TOOL_EXECUTION_PARTIAL`, `anomalyReasonCodes[]`로 S3-consumable readiness semantics 제공
  - 단일 tool failure는 policy failure가 없는 한 artifact `fail`이 아니라 successful-but-degraded artifact로 고정
  - `/v1/scan` 및 `/v1/build-and-analyze` endpoint propagation tests 추가
  - Full S4 pytest: `481 passed in 13.28s`

- ~~S3-consumable staticEvidenceContract hardening~~ — **완료** (2026-05-11)
  - 기존 `s4-static-evidence-contract-v1` schemaVersion을 유지한 채 additive `toolEvidenceMatrix`를 추가
  - matrix는 current six tools stable order, role/uniqueContribution/overlap/limitations, execution status, findingsCount, skip/degrade metadata, consumerPolicy를 제공
  - Golden Corpus v1 evidence bundles를 structural graph, SCA diff partial, degraded execution, policy failure로 확장
  - vulnerability-family canaries를 CWE-120 / CWE-190 / CWE-416으로 확장
  - non-registered SDK gcc-fanalyzer rescue 회귀 테스트 추가
  - Full S4 pytest: `471 passed in 13.33s`

- ~~S3 wait-while-alive follow-up WR: build/build-and-analyze health coverage + localAckState mapping~~ — **완료** (2026-04-14)
  - `/v1/health` request-summary coverage를 `/v1/scan` + `/v1/build` + `/v1/build-and-analyze`로 확장
  - additive `localAckState` (`phase-advancing` / `transport-only` / `ack-break`) 노출
  - build/build-and-analyze 장시간 컴파일 구간은 `build-subprocess-alive` 기반 `transport-only`로 표면화하고, build failure 경로는 `ack-break`로 정렬
  - S3 회신 WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md`
- ~~S3 follow-up WR: live `/v1/health` request-summary drift clarification~~ — **완료** (2026-04-14)
  - canonical code/docs와 live runtime이 어긋난 원인을 runtime/deploy lag 또는 stale transient instance로 정리
  - 현재 worktree는 request-summary fields를 포함하지만 live `localhost:9000` 는 재기동 전 coarse-only shape 또는 no-listener 상태일 수 있음을 명시
  - S3 회신 WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m.md`
- ~~S3 WR: `/health` request-summary mapping for local-ack control rollout~~ — **완료** (2026-04-13)
  - `/v1/health`에 `activeRequestCount` + `requestSummary` 추가
  - `requestId` query 기준으로 queued / running / degraded / ack-break equivalent를 최소 summary로 조회 가능하게 정렬
  - full per-request dump 없이 polling caller가 abort 판단 가능한 contract를 문서/코드/테스트에 반영
  - S3 회신 WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md`
- ~~S2 WR: explicit build-preparation + one-shot Quick contract 명시화~~ — **완료** (2026-04-13, session omx-1776068296251-abnt8x)
  - `/v1/build`에 `readiness` contract 추가 (`ready` / `partial` / `not-ready`)
  - `compile_commands.json` 가 존재해도 user-target entry가 없으면 `compile-commands-no-user-entries` 로 실패하도록 정렬
  - canonical docs/api/spec/readme를 explicit Quick (`/v1/build` ready → `/v1/scan`) 기준으로 refresh
  - S2 회신 WR 발송 완료: `wiki/canon/work-requests/s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4.md`
- ~~S4 소유 문서 전체 refresh~~ — **완료** (2026-04-09, session-omx-1775611621885-coij9e)
  - `readme`, `roadmap`, `spec`, `api`, `build-snapshot-consumer-seam`을 현재 코드/테스트 기준으로 재검토
  - 규칙 수(39/9 YAML), 테스트 수(376/23 files), `/v1/health` backward-compatible 필드, build path execution-only 경계 문구를 정렬
- ~~build path boundary inversion~~ — **완료** (2026-04-04, session-9)
  - build path에서 `sdkId` 제거
  - `buildCommand` 자동 감지 제거
  - `/v1/sdk-registry` public API 제거
  - build path를 caller-materialized execution-only로 재정의
- ~~S3 WR: Build Snapshot consumer seam + SDK exit127 + large scan degraded behavior~~ — **완료** (2026-04-04, session-8)
  - `/v1` contract rewrite 완료 (`provenance`, structured `buildEvidence`/`failureDetail`, degraded-aware heartbeat/execution metadata)
  - `/v1/build-and-analyze`는 convenience/transitional surface로 재정의
  - S4→S3 WR 응답 작성 완료
- ~~S3 WR: heartbeat 진행 지표 보강~~ — **완료** (2026-04-02, session-6). progress/status 필드, per-file progress, queued/running 상태, 동시성 기본값 2
- ~~S2 WR: cweId 메타데이터 표준화~~ — **완료** (2026-04-02, session-6). 전 도구 `metadata.cweId` 추가
- ~~version hygiene 정리~~ — **완료** (2026-04-03, session-7). `/v1/health` 버전 상수화, 활성 문서 버전 정렬
- ~~code graph 품질 평가 기준 수립~~ — **완료** (2026-03-31, session-4)
- ~~스트리밍 per-file 진행 이벤트~~ — **완료** (2026-04-02, session-6). gcc-fanalyzer/scan-build에서 파일별 progress 보고

---

## 잔여 고도화 (후순위)

- CWE-457 (56%) 추가 개선 — gcc-fanalyzer 한계, Semgrep 불가. 도구 자체 한계로 당장 개선 여지 적음
  - 6개 메트릭 정의 (Function Recall/Precision, Call Recall/Precision, Origin Accuracy, Parse Rate)
  - ground truth fixture + 평가 엔진 + 13개 통합 테스트
  - 현재 결과: 전 메트릭 100% (10함수, 20호출 edge, 5파일)
- `/v1/build-and-analyze`를 canonical orchestration surface에서 convenience surface로 단계적 축소

---

## 알려진 이슈

- live `localhost:9000` runtime이 v0.11.2 worktree로 재기동되지 않으면 `/v1/health` request-summary additive fields가 실제 surface에 반영되지 않을 수 있음 (2026-04-14 follow-up WR에서 runtime/deploy lag로 확인)
- tinydtls 버전: `libcoap/ext/tinydtls`에 configure.ac 없음 → 버전 미탐지
- wakaama 버전: 하위 tinydtls의 configure.ac를 잡아서 오탐
- clang-tidy + compile_commands.json: `-p` 연동 불안정
- `build-and-analyze`: caller가 제공한 `buildCommand` / `buildEnvironment`가 현재 S4 런타임에서 실제로 실행 가능해야 함
- caller가 잘못된 build command / build environment를 주면 build path에서 그대로 실패하며, `failureDetail`로 가시화됨
- 대형 프로젝트 heavy analyzer timeout-floor / vendor timeout은 여전히 발생 가능하지만, 이제 heartbeat/execution metadata로 degraded 상태가 노출됨

---

## 통합테스트 메모

### 2026-03-31 baseline

S3 Build Agent + Analysis Agent가 S4를 호출한 전체 흐름:

```
Build Phase (6m31s):
  S3-build → S4 /v1/build (3회) → 1-2회 실패(empty CC), 3회 부분실패(3 entries)
  → S3가 빌드 스크립트 자동 생성/수정, S4는 정상 실행

Analyze Phase (4m19s):
  S3-agent → S4 /v1/scan       → 107 findings (6도구, 6.0s)
  S3-agent → S4 /v1/functions  → 18 함수 (1.7s)
  S3-agent → S4 /v1/libraries  → 0 라이브러리 (1ms)
  S3-agent → S5 KB ingest      → 53 nodes, 54 edges
  S3-agent → S5 batch search   → CWE 11개 위협 조회
  S3-agent → S7 LLM (6턴)      → 4 claims (critical)
```

### 2026-04-04 live 관측

- `certificate-maker` SDK 적용 빌드 첫 시도에서 `exitCode=127`, SDK 제거 재시도 시 성공
- `gateway-webserver` 대형 scan에서 timeout-floor warning + `gcc -fanalyzer` vendor timeout 다수
- 위 2건 모두 S3 WR로 접수됐고, session-8에서 `/v1` runtime contract rewrite로 가시성/신호를 보강했다
