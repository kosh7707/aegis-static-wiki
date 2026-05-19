---
title: "S4 SAST Runner — 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s4-handoff/roadmap.md"
original_path: "docs/s4-handoff/roadmap.md"
last_verified: "2026-05-14"
service_tags: ["s4"]
decision_tags: []
related_pages: ["wiki/canon/handoff/s4/readme.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md", "wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md"]
migration_status: "canonicalized"
---

# S4 SAST Runner — 로드맵

> 다음 작업 + 후순위 계획. README.md에서 분리.
> **마지막 업데이트: 2026-05-14**

---

## 즉시 다음

현재 S4 수신 미처리 WR 없음. S4→S3 outbound alignment WR 발송 완료: `wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md`

후속 후보:
- Benchmark compare domain-schema validation evaluation: decide whether additional result-schema fields beyond current dereference/arithmetic needs should remain permissive or become explicit CLI validation contract.
- S3 response follow-up: Tool Portfolio offline report consumer contract를 S3가 `accepted-no-code-change`/`accepted-doc-only`/`code-change-needed`/`blocked` 중 어떤 상태로 받는지 확인하고, 필요한 sample payload나 contract clarification을 S4가 추가한다.
- Tool Portfolio Experiment v1 quality analysis: actual runner now produces low-threshold runner-integrity report over the 80-case Juliet/SARD cache, the JSON itself marks that report `not_decision_grade` via `thresholdProfile.intent="runner-integrity-only"`, and `qualityDiagnostics` decomposes low metrics into target outcomes, raw finding pressure, and candidate investigation lanes. Next step is **not** to claim sufficiency; it is to decompose low actual metrics (`validation recall=0.25 precision=0.0221`, `test recall=0.2 precision=0.0129`) by CWE/tool/match class and decide which parser/oracle/tool config issues are measurement defects versus true tool gaps.
- Quality Gate next step: local harness에서는 `validation`/`test`가 threshold fail이고 `canary`만 pass이므로, 다음 품질 개선은 도구 추가/업그레이드가 아니라 decision-grade corpus 확보 후 `full-current-six` primary config의 precision/FPR 실패 원인을 재현·분해하는 것이다.
- Additional S3 EvidenceCatalog sample payloads only if S3 requests more consumer-specific cases beyond the current consumer canaries.
- downstream(S2/S3) build-path adaptation feedback 수신 시 contract drift 보정
- analysis path inversion 필요 여부는 별도 논의
- `discover-targets` identity-hint를 upstream durable `buildUnitId` 매핑으로 연결할지 재검토

---

## 최근 완료

- ~~Tool Portfolio report consumer `runnerIntegrityOnly` unsafe-projection fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` now publishes the S3-facing `runnerIntegrityOnly` convenience boolean only when the sanitized runner-integrity signal is present and unsafe projection is absent
  - Unsafe summaries still expose sanitized threshold/reason context, but `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces the derived boolean classification to false
  - Verification: RED reproduced unsafe summaries keeping `runnerIntegrityOnly=true`; targeted runner-integrity tests `3 passed`; consumer canary tests `46 passed`; related Tool Portfolio report/actual/consumer tests `314 passed`; all Tool Portfolio tests `542 passed`; Full S4 pytest `1335 passed in 32.39s`; Critic implementation+docs review PASS

- ~~Tool Portfolio report consumer `toolPortfolioDecisionGradeUsable` completeness invariant~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` no longer treats positive system/corpus/local/final/threshold gates alone as sufficient for `toolPortfolioDecisionGradeUsable=true`
  - Decision-grade usable summaries now also require available diagnostic surfaces, current-six tool contribution row completeness, empty sanitized failure reasons, and empty required follow-ups; diagnostic candidate IDs remain advisory, and already non-decision-grade/failing reports do not gain unsafe solely from completeness gaps
  - Verification: RED reproduced otherwise-passing reports with missing diagnostics, missing/empty current-six contribution rows, pass+failure-reason, and pass+required-follow-up returning usable; targeted completeness tests `6 passed`; consumer canary tests `44 passed`; related Tool Portfolio report/actual/consumer tests `312 passed`; all Tool Portfolio tests `540 passed`; Full S4 pytest `1333 passed in 32.10s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer `localStaticEvidenceReady` completeness invariant~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py` no longer treats pass/ready/pass gates alone as sufficient for `localStaticEvidenceReady=true`
  - Ready summaries now also require projected local coverage surfaces, claim boundaries/statuses, and current-six tool matrix readiness; forged positive gates with missing projected evidence are marked unsafe and not ready, while already degraded/non-ready reports do not gain unsafe solely from completeness gaps
  - Verification: RED reproduced forged pass/ready/pass summaries with empty/missing projected evidence returning local-ready; targeted completeness tests `4 passed`; static evidence consumer canary tests `38 passed`; static evidence related tests `77 passed`; Full S4 pytest `1327 passed in 31.88s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer summary committed artifact and stale-artifact guard~~ — **완료** (2026-05-14)
  - `benchmark/results/static_evidence/s4-clean-ready-consumer-summary-v1.json` is now the canonical committed Static Evidence consumer summary sample for `clean_ready_top_level.json`
  - Tests exact-match the artifact against helper output and CLI stdout, and reject extra/drifted summary-schema artifacts under `benchmark/results/static_evidence/`
  - Verification: RED reproduced missing committed summary artifact; targeted artifact tests `4 passed`; static evidence consumer canary tests `36 passed`; static evidence related tests `75 passed`; Full S4 pytest `1325 passed in 32.47s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer canary malformed nested scan-container classification~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py::_locate_contract()` now classifies present non-object `scan` containers as malformed instead of absent while preserving absent/`None` compatibility
  - S3/operator diagnostics now receive `STATIC_EVIDENCE_CONTRACT_MALFORMED` for malformed present nested scan containers without raw value stringification
  - Verification: RED reproduced present non-object `scan` returning `contractLocation="missing"`; targeted nested-scan tests `2 passed`; static evidence consumer canary tests `32 passed`; static evidence related tests `71 passed`; Full S4 pytest `1321 passed in 32.37s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer canary CLI smoke gate and structured diagnostics~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py` now exposes `python -m benchmark.static_evidence_consumer_canary --response <path> [--require-local-static-ready]` for reproducible S3/operator smoke checks without importing app code or executing tools
  - Successful parses emit the exact versioned summary JSON; exit `2` means summary emitted but contract absent/malformed or required readiness failed; exit `1` emits fixed structured stderr for input/output failures without raw path/content/exception echo
  - Verification: RED reproduced missing CLI entrypoint; targeted CLI tests `7 passed`; static evidence consumer canary tests `30 passed`; static evidence related tests `69 passed`; Full S4 pytest `1319 passed in 33.16s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer canary summary schema version and exact-key lock~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py` now emits `summarySchemaVersion="s4-static-evidence-contract-consumer-summary-v1"` for present, absent, and malformed summaries
  - `tests/test_static_evidence_consumer_canaries.py` exact-locks the top-level S3-facing consumer summary key set, preventing accidental additive raw-field exposure or missing projection fields
  - Verification: RED reproduced missing schema version/key lock; targeted summary-schema test `1 passed`; static evidence consumer canary tests `23 passed`; static evidence related tests `62 passed`; Full S4 pytest `1312 passed in 32.51s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer canary duplicate matrix identity fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py` now treats duplicate `toolEvidenceMatrix[].toolId` and `claimBoundaryMatrix[].claimId` rows as unsafe projection while preserving first-observed S3-facing values
  - Later duplicates cannot overwrite `toolMatrixStatuses`, `toolConsumerPolicies`, `claimSupportStatuses`, or derived `unsupportedClaims`; canary-generated `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` is added only to system/evidence/claim reason arrays and `toolAnomalyReasonCodes` remains clean
  - Verification: RED reproduced duplicate tool/claim rows leaving local readiness true with no unsafe evidence; targeted duplicate tests `2 passed`; static evidence consumer canary tests `22 passed`; static evidence related tests `61 passed`; Full S4 pytest `1311 passed in 32.15s`; Critic implementation+docs review PASS

- ~~Static Evidence consumer canary map/container-shape fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py` now treats present non-object map/container projections for `gates`, `coverage`, `claimBoundaries`, `coverage.staticToolExecution`, and individual gate maps as unsafe projection while preserving absent/`None` compatibility
  - Malformed containers normalize to safe defaults without object stringification, add canary-generated `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` only to system/evidence/claim reason arrays, avoid `toolAnomalyReasonCodes` pollution, and force `localStaticEvidenceReady=false`
  - Verification: RED reproduced malformed `coverage`/`claimBoundaries` keeping local readiness true and malformed gates lacking unsafe evidence; targeted container tests `4 passed`; static evidence consumer canary tests `20 passed`; static evidence related tests `59 passed`; Full S4 pytest `1309 passed in 32.51s`; Critic implementation+docs review PASS

- ~~Tool Portfolio report consumer canary duplicate tool-contribution identity fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` now treats duplicate `toolContributionDiagnostics.tools[].toolId` rows as unsafe projection, even when IDs/classes are individually allowlisted
  - First observed tool contribution class is preserved, later duplicates cannot overwrite S3-facing `toolContributionClasses`, and canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces `toolPortfolioDecisionGradeUsable=false`
  - Verification: RED reproduced duplicate `semgrep` row overwriting the class with no unsafe evidence and decision-grade usability true; targeted duplicate test `1 passed`; consumer canary tests `38 passed`; related Tool Portfolio report/actual/consumer tests `306 passed`; all Tool Portfolio tests `534 passed`; Full S4 pytest `1305 passed in 32.80s`; Critic implementation+docs review PASS

- ~~Tool Portfolio report consumer canary boolean decision-field fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` now distinguishes absent boolean decision fields from malformed present non-bool values for `systemStabilityGate.qualityGateAllowed` and `corpusReadinessGate.decisionGradeReady`
  - Absent/`None` remains compatible, real booleans are preserved, integers/objects/strings are unsafe without coercion or stringification, and canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces `toolPortfolioDecisionGradeUsable=false`
  - Verification: RED reproduced malformed decision booleans normalizing false without unsafe evidence; targeted boolean tests `2 passed`; consumer canary tests `37 passed`; related Tool Portfolio report/actual/consumer tests `305 passed`; all Tool Portfolio tests `533 passed`; Full S4 pytest `1304 passed in 32.88s`; Critic implementation+docs review PASS

- ~~Tool Portfolio report consumer canary mapping/container-shape fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` now distinguishes absent object/map projections from malformed present non-object containers: absent/`None` remains compatible, but present malformed gate, quality, diagnostic, tool-contribution, and `decisionSupport` containers are unsafe projection
  - Malformed containers normalize to safe defaults without object stringification, add canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force `toolPortfolioDecisionGradeUsable=false`
  - Verification: RED reproduced missing unsafe evidence for malformed gate/quality containers and decision-grade usability staying true for malformed diagnostic/decision-support containers; targeted container tests `4 passed`; consumer canary tests `35 passed`; related Tool Portfolio report/actual/consumer tests `303 passed`; all Tool Portfolio tests `531 passed`; Full S4 pytest `1302 passed in 32.78s`; Critic implementation+docs review PASS

- ~~Tool Portfolio report consumer canary scalar fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` now distinguishes absent scalar projections from malformed present scalar values: absent/`None` remains compatible, but present non-string or blank status/intent scalars are unsafe projection
  - Malformed diagnostic-only and decision-predicate scalars normalize to safe defaults without object stringification, add canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force `toolPortfolioDecisionGradeUsable=false`
  - Verification: RED reproduced malformed diagnostic scalars leaving decision-grade usability true and malformed system status lacking unsafe reason evidence; targeted scalar tests `2 passed`; consumer canary tests `31 passed`; related Tool Portfolio report/actual/consumer tests `299 passed`; all Tool Portfolio tests `527 passed`; Full S4 pytest `1298 passed in 32.23s`; Critic implementation+docs review PASS

- ~~Tool Portfolio report consumer canary list-shape fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` now treats malformed `reasonCodes` and `decisionSupport.requiredFollowUps` containers/items as unsafe projection instead of silently dropping them
  - Absent/`None` optional lists remain non-unsafe, valid allowlisted entries in proper lists are preserved, malformed items are omitted without stringification, and canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces `toolPortfolioDecisionGradeUsable=false`
  - Verification: RED reproduced non-list containers and malformed list items leaving decision-grade usability true; targeted shape tests `2 passed`; consumer canary tests `29 passed`; related Tool Portfolio report/actual/consumer tests `297 passed`; all Tool Portfolio tests `525 passed`; Full S4 pytest `1296 passed in 32.58s`; Critic PASS

- ~~Tool Portfolio report consumer canary summary-only reason spoofing hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py` no longer treats canary-generated summary diagnostics (`TOOL_PORTFOLIO_REPORT_ABSENT`, `TOOL_PORTFOLIO_REPORT_MALFORMED`, `TOOL_PORTFOLIO_REPORT_SCHEMA_UNSUPPORTED`, `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`) as producer reason codes in present valid reports
  - Caller-provided summary-only reasons are omitted, converted into canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force `toolPortfolioDecisionGradeUsable=false`, while absent/malformed/wrong-schema fast paths remain unchanged
  - Verification: RED reproduced spoofed summary-only reasons leaving `toolPortfolioDecisionGradeUsable=true`; targeted spoofing test `1 passed`; consumer canary tests `27 passed`; related Tool Portfolio report/actual/consumer tests `295 passed`; all Tool Portfolio tests `523 passed`; Full S4 pytest `1294 passed in 32.77s`; Critic PASS

- ~~Static Evidence consumer canary projection sanitization~~ — **완료** (2026-05-14)
  - `benchmark/static_evidence_consumer_canary.py` now allowlists S3-facing projected statuses/generated reasons/surfaces/claims/tools/policies, preserves generated partial/degraded/unknown tool evidence as safe, and marks malformed projections or caller-spoofed summary-only diagnostics with canary-generated `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION`
  - Unsafe projection forces `localStaticEvidenceReady=false`, is added only to system/evidence/claim reason arrays, and never becomes a tool anomaly or routing/decision directive
  - Verification: RED reproduced unsafe value projection and object-key stringification; unsafe-projection tests `2 passed`; compatibility/fail-closed tests `3 passed`; spoofed-sentinel test `1 passed`; summary-only diagnostic spoofing test `1 passed`; consumer canary tests `16 passed`; static-evidence related tests `51 passed`; Full S4 pytest `1293 passed in 32.39s`; Critic PASS

- ~~Juliet benchmark CLI structured stderr diagnostics~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now emits compact JSON stderr for parser/selector/artifact/payload/output/handoff/run/report-build failures with exact keys `error`, `reasonCode`, and `stage`
  - Reason-code mapping covers input, output, `handoff`, and `run` stages while preserving existing fixed error substrings and exit `2`; broken stderr writes are best-effort and cannot leak raw `ValueError`
  - Verification: RED reproduced plain-text stderr plus broken-stderr `ValueError` escape; structured stderr tests `9 passed`; `test_juliet_runner.py` `58 passed`; benchmark/JULIET related tests `113 passed`; Full S4 pytest `1286 passed in 32.98s`; Critic PASS

- ~~Standalone benchmark compare CLI structured stderr diagnostics~~ — **완료** (2026-05-14)
  - `benchmark.compare.main()` now emits compact JSON stderr for parse, threshold, artifact, payload, and report-output failures with exact keys `error`, `reasonCode`, and `stage`
  - Reason-code mapping is fixed and machine-readable while preserving safe diagnostic substrings: `BENCHMARK_COMPARE_CLI_ARGUMENTS_INVALID`, `BENCHMARK_COMPARE_THRESHOLD_INVALID`, `BENCHMARK_COMPARE_ARTIFACT_INVALID`, `BENCHMARK_COMPARE_PAYLOAD_INVALID`, and `BENCHMARK_COMPARE_REPORT_FAILED`; broken stderr writes are best-effort and still exit `2`
  - Verification: RED reproduced plain-text stderr plus broken-stderr `ValueError` escape; structured stderr tests `6 passed`; `test_benchmark.py` `55 passed`; benchmark/JULIET related tests `112 passed`; Full S4 pytest `1285 passed in 32.57s`; Critic PASS

- ~~Tool Portfolio report consumer canary structured stderr diagnostics~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_report_consumer_canary.py::main()` failure stderr now emits exact 5-key JSON diagnostics: `error`, `reasonCode`, `reasonCodes`, `stage`, and `summaryEmitted`
  - Legacy `reasonCodes=[reasonCode]` and `summaryEmitted=false` remain for compatibility; input/output stages add fixed `input validation failed` and `summary output failed` machine-readable diagnostics without changing successful stdout summary schema
  - Verification: RED reproduced missing `error/reasonCode/stage`; targeted structured stderr tests `4 passed`; consumer canary tests `26 passed`; related Tool Portfolio CLI/report tests `415 passed`; Full S4 pytest `1284 passed in 32.04s`; Critic PASS

- ~~Blocked metric bucket direct-helper sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_system_gate.py::blocked_metric_bucket()` now allowlists split names and system-stability top-level reason codes before direct helper emission
  - Invalid split values become `<invalid>`; malformed/blank/non-string/non-allowlisted reason entries add `SYSTEM_STABILITY_GATE_INPUT_INVALID`; string containers are not expanded character-by-character and arbitrary reason objects are not stringified
  - Verification: RED reproduced raw secret split/reason/object leakage and string-container expansion; blocked-bucket tests `3 passed`; system-stability tests `60 passed`; related Tool Portfolio/readiness tests `393 passed`; Full S4 pytest `1284 passed in 32.23s`; Critic PASS

- ~~System Stability direct required-tools identity sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_system_gate.py::_normalize_required_tools()` no longer stringifies arbitrary required-tool entries; known current-six tools remain in canonical order
  - Unknown strings, blank strings, non-strings, and invalid containers collapse to one `<invalid>` sentinel in `requiredTools` and one `REQUIRED_TOOL_UNKNOWN` preflight failure, preserving fail-closed evidence without raw identity echo
  - Verification: RED reproduced raw unknown tool/object identity leakage; targeted required-tools tests `3 passed`; system-stability tests `57 passed`; related Tool Portfolio/readiness tests `390 passed`; Full S4 pytest `1281 passed in 32.69s`; Critic PASS

- ~~System Stability direct execution-completeness metadata sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_system_gate.py::build_system_stability_gate()` now sanitizes execution failure status, skip reason, degrade reasons, and timeout/failure counts before direct helper emission
  - Unknown/malformed status becomes `unknown`, raw skip reasons fall back to safe reason codes, degrade reasons are allowlisted without object stringification, and bad counts become `null`; allowlisted partial/timed-out/failed-file evidence remains preserved
  - Verification: RED reproduced raw skip reason/weird status/secret degrade/object/count echo; targeted execution tests `22 passed`; system-stability tests `56 passed`; related Tool Portfolio/readiness tests `389 passed`; Full S4 pytest `1280 passed in 32.06s`; Critic PASS

- ~~System Stability direct preflight metadata sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_system_gate.py::build_system_stability_gate()` now emits unavailable-tool preflight failures with status-only `versionStatus` and `expectedExecutablePathStatus` fields
  - `probeReason` is allowlisted with `runtime-tool-missing` fallback; raw version strings, expected executable paths, and arbitrary probe reasons are not emitted by the direct helper; report-side normalization accepts the status-only fields
  - Verification: RED reproduced raw secret probe reason/version/path leakage; targeted preflight tests `8 passed`; system-stability tests `54 passed`; related Tool Portfolio/readiness tests `387 passed`; Full S4 pytest `1278 passed in 32.85s`; Critic PASS

- ~~Quality Gate direct-helper reason-code sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_system_gate.py::build_quality_gate()` now allowlists system-stability and external corpus/readiness reason codes before propagating them into `qualityGate.reasonCodes`
  - Unknown, blank, non-string, numeric, and object reason entries are suppressed without `str()` conversion and signaled with `SYSTEM_STABILITY_GATE_INPUT_INVALID` or `CORPUS_READINESS_GATE_INPUT_INVALID`; generated known reason codes remain preserved
  - Verification: RED reproduced raw secret/object/number reason-code echo; reason-sanitization tests `3 passed`; quality-gate subset `21 passed`; system-stability tests `52 passed`; related Tool Portfolio/readiness tests `385 passed`; Full S4 pytest `1276 passed in 32.17s`; Critic PASS

- ~~Quality Gate eligibility invariant fail-closed hardening~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_system_gate.py::build_quality_gate()` now produces `eligible` only for explicit `systemStabilityGate.status="pass"` plus `qualityGateAllowed is True`
  - Absent system-gate evidence is `not_decision_grade`/`SYSTEM_STABILITY_GATE_NOT_RUN`; valid `not_run` harness evidence remains non-decision-grade; pass-without-allowance, malformed/unknown status, and non-pass-with-allowance block quality scoring with input-invalid or inconsistent system-gate reasons
  - Verification: RED reproduced fail-open `eligible` behavior for malformed/inconsistent/absent system gates; targeted invariant tests `15 passed`; system-stability tests `49 passed`; related Tool Portfolio tests `343 passed`; Full S4 pytest `1273 passed in 30.75s`; Critic PASS

- ~~Corpus Acquisition CLI structured stderr diagnostics~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_corpus_acquisition.py::main()` now emits compact JSON stderr for existing input/output failure boundaries with exact keys `error`, `reasonCode`, and `stage`
  - Fixed-message substrings remain present for compatibility; machine-readable reason codes distinguish input (`CORPUS_ACQUISITION_CLI_INPUT_INVALID`) and output (`CORPUS_ACQUISITION_CLI_OUTPUT_FAILED`) failures without raw corpus/path/exception echo
  - Verification: RED reproduced plain-text stderr not being parseable JSON; structured acquisition tests `4 passed`; targeted/compat acquisition CLI tests `8 passed`; related Tool Portfolio tests `329 passed`; Full S4 pytest `1258 passed in 29.80s`; Critic PASS

- ~~Actual Tool Portfolio runner structured CLI diagnostics~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_actual_runner.py::main()` now emits compact JSON stderr for failure boundaries with exact keys `error`, `reasonCode`, and `stage`
  - Existing fixed-message substrings remain present for compatibility; machine-readable stages distinguish input (`ACTUAL_RUN_CLI_INPUT_INVALID`), run/report-build (`ACTUAL_RUN_FAILED`), and output (`ACTUAL_RUN_OUTPUT_WRITE_FAILED`) failures without raw exception/path/object echo
  - Verification: RED reproduced plain-text stderr not being parseable JSON; structured input/run/output tests `4 passed`; targeted/compat actual-runner CLI tests `8 passed`; related Tool Portfolio tests `329 passed`; Full S4 pytest `1258 passed in 30.32s`; Critic PASS

- ~~Actual Tool Portfolio runner CLI report-build failure sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_actual_runner.py::main()` now wraps ordinary failures from `build_actual_tool_portfolio_report(...)` before output writing and maps them to fixed stderr `actual run failed` / exit `1`
  - Input loading remains `input validation failed`, output writing remains `output write failed`, and writer calls are skipped after report-build failure
  - Verification: RED reproduced raw `ValueError`, raw `RuntimeError`, and broken-stderr cascade leakage; report-build boundary tests `2 passed`; targeted/compat actual-runner CLI tests `7 passed`; related Tool Portfolio tests `329 passed`; Full S4 pytest `1258 passed in 31.32s`; Critic PASS

- ~~Actual Tool Portfolio runner CLI output-boundary sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_actual_runner.py::main()` now wraps `write_experiment_report(report, --output)` after report build and maps output write/serialization/path failures to fixed stderr `output write failed` / exit `1`
  - Stderr emission is best-effort, so a broken stderr path cannot reintroduce raw exception leakage; input validation remains fixed `input validation failed`, and successful write exits remain `0` for pass and `2` otherwise
  - Verification: RED reproduced raw `OSError`, raw `TypeError`, and broken-stderr cascade leakage; output-boundary tests `3 passed`; targeted/compat actual-runner CLI tests `5 passed`; related Tool Portfolio tests `327 passed`; Full S4 pytest `1256 passed in 30.66s`; Critic PASS

- ~~Juliet benchmark CLI argparse-boundary sanitization~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now routes raw argparse parse-shape failures through fixed `invalid Juliet arguments` with exit `2`, instead of raw usage/required/unrecognized/expected-one-argument diagnostics or caller token/path echo
  - Existing post-parse fixed diagnostics remain specific for selector, artifact, payload, output, markdown/stdout, compare, execution, and report-build failures
  - Verification: RED reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret flag/path echo; parser-boundary tests `3 passed`; targeted/compat Juliet tests `10 passed`; benchmark/JULIET related tests `111 passed`; Full S4 pytest `1253 passed in 30.99s`; Critic PASS

- ~~Standalone benchmark compare CLI argparse-boundary sanitization~~ — **완료** (2026-05-14)
  - `benchmark.compare.main()` now routes raw parser/arg-shape failures through fixed `invalid comparison arguments` with exit `2`, instead of raw argparse usage/required/unrecognized/expected-one-argument diagnostics
  - Existing fixed post-parse diagnostics remain specific: `invalid threshold selection`, `invalid comparison artifact`, `invalid comparison artifact payload`, and `comparison report failed`
  - Verification: RED reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret token/path echo; targeted/compat compare tests `8 passed`; benchmark/JULIET related tests `108 passed`; Full S4 pytest `1250 passed in 30.26s`; Critic PASS

- ~~Corpus Readiness CLI argparse/input-boundary sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_corpus_readiness.py::main()` now routes parser/arg-shape failures through the existing sanitized invalid-input JSON payload on stdout with exit `1`, rather than raw argparse stderr/`SystemExit`
  - Missing required `--corpus-manifest`, unknown arguments, and malformed repeated-option values fail before JSON file reads or readiness gate construction; post-parse invalid-input/output-write behavior is unchanged
  - Verification: RED reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret token echo; targeted/compat CLI tests `6 passed`; related Tool Portfolio tests `125 passed`; Full S4 pytest `1247 passed in 31.19s`; Critic PASS

- ~~Corpus Acquisition CLI output-boundary sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_corpus_acquisition.py::main()` now treats optional summary-output writes and stdout JSON emission as explicit fixed-diagnostic output boundaries
  - Summary-output failures return exit `1` with fixed `corpus acquisition output failed` before stdout emission; stdout serialization/write failures also return exit `1`; broken stderr is best-effort suppressed; acquisition failures remain outside this catch
  - Verification: RED reproduced raw `OSError`, raw `TypeError` with secret class names, stdout write leakage, and stderr cascade risk; targeted output/input tests `6 passed`; related Tool Portfolio tests `122 passed`; Full S4 pytest `1244 passed in 29.87s`; Critic PASS

- ~~Corpus Acquisition CLI argparse/input-boundary sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_corpus_acquisition.py::main()` now routes invalid `--corpus`, unknown arguments, and malformed option shapes through fixed stderr `input validation failed` / exit `1` before acquisition, network, or summary-output side effects
  - Valid repeated corpus selection remains order-preserving, keeps `--force`/`--output-root` handoff, and preserves blocked exit `2` plus JSON stdout/summary behavior
  - Verification: RED reproduced raw argparse `SystemExit`, usage, invalid-choice/unrecognized/expected-one-argument diagnostics, and secret token echo; targeted CLI tests `4 passed`; related Tool Portfolio tests `118 passed`; Full S4 pytest `1240 passed in 29.38s`; Critic PASS

- ~~Actual Tool Portfolio runner CLI argparse/scalar input sanitization~~ — **완료** (2026-05-14)
  - `benchmark/tool_portfolio_actual_runner.py::main()` now routes invalid `--timeout` and `--phase` argparse failures through fixed stderr `input validation failed` / exit `1`, before JSON file reads or output writes
  - `--timeout` is parsed as a positive decimal string with no new upper bound; valid timeout selection still reaches `build_actual_tool_portfolio_report()` unchanged
  - Verification: RED reproduced raw argparse `SystemExit`, usage, and secret timeout/phase echo; targeted/compat CLI tests `5 passed`; related Tool Portfolio tests `340 passed`; Full S4 pytest `1236 passed in 29.67s`; Critic PASS

- ~~Tool Portfolio report consumer canary CLI output-boundary sanitization~~ — **완료** (2026-05-14)
  - Offline Tool Portfolio consumer canary CLI now maps summary serialization/stdout write failures to fixed `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` stderr JSON with `summaryEmitted=false`, and stderr emission is best-effort to avoid cascading raw failures
  - Verification: RED regressions reproduced raw stdout `OSError` and summary serialization `TypeError`; targeted/compat CLI tests `5 passed`; related report/consumer tests `266 passed`; Full S4 pytest `1233 passed in 29.82s`; Critic PASS

- ~~Juliet benchmark CLI stdout JSON separator failure sanitization~~ — **완료** (2026-05-14)
  - No-output Juliet CLI now wraps the separator newline before stdout JSON inside `_emit_cli_stdout_json()`, mapping separator write failures to fixed `stdout JSON write failed` and skipping JSON markers plus baseline compare handoff
  - Verification: RED regression reproduced raw `OSError` after markdown output; targeted stdout tests `2 passed`; benchmark/JULIET related tests `105 passed`; Full S4 pytest `1231 passed in 30.44s`; Critic PASS

- ~~CLI artifact preflight filesystem-probe failure sanitization~~ — **완료** (2026-05-14)
  - Standalone compare and Juliet benchmark CLI artifact preflight now catches `Path.is_file()` / `Path.exists()` / `Path.is_dir()` `OSError`/`ValueError` and maps probe failures to existing fixed diagnostics before load/benchmark/write/report/compare side effects
  - Verification: RED regressions reproduced raw `OSError` leakage; targeted probe tests `4 passed`; benchmark/JULIET related tests `104 passed`; Full S4 pytest `1230 passed in 31.06s`; Critic PASS

- ~~Standalone compare CLI markdown report failure sanitization~~ — **완료** (2026-05-14)
  - `benchmark.compare.main()` now wraps comparison markdown rendering/output with fixed `comparison report failed` for expected render/write failures, preventing raw exception/path leakage and skipping regression evaluation after failed report emission
  - Programmatic `ComparisonReport.to_markdown()` and `compare_from_files()` remain unchanged
  - Verification: RED regression reproduced raw `ValueError` leakage from `report.to_markdown()`; targeted compare markdown tests `3 passed`; focused compare tests `23 passed`; benchmark/JULIET related tests `100 passed`; Full S4 pytest `1226 passed in 29.63s`; Critic PASS

- ~~Juliet benchmark CLI numeric selector conversion failure sanitization~~ — **완료** (2026-05-14)
  - Juliet CLI `--cwes`, `--variant-filter`, and `--timeout` now parse positive decimal selectors through one fixed-diagnostic helper that catches Python `int()` conversion failures such as oversized decimal digit-limit errors
  - Existing selector semantics are preserved with no new upper bounds: valid positive decimal inputs remain accepted, while conversion failures map to `invalid CWE/variant/timeout selection` without raw tracebacks or selector echo
  - Verification: RED regressions reproduced raw digit-limit `ValueError` tracebacks for all three selectors; targeted oversized+valid selector tests `6 passed`; focused selector tests `11 passed`; benchmark/JULIET related tests `99 passed`; Full S4 pytest `1225 passed in 30.01s`; Critic PASS

- ~~Comparison payload canonical CWE key validation~~ — **완료** (2026-05-14)
  - Shared CLI comparison payload preflight now requires `results` keys to match canonical `CWE-<positive integer>` format, preventing caller-controlled artifact keys from appearing in public comparison markdown
  - Empty `results: {}` and generated keys such as `CWE-78` remain valid; programmatic compare helpers remain permissive
  - Verification: RED regressions reproduced secret CWE-key echo in standalone compare markdown and Juliet baseline compare output; targeted key tests `3 passed`; focused payload/key/range tests `9 passed`; benchmark/JULIET related tests `96 passed`; Full S4 pytest `1222 passed in 29.55s`; Critic PASS

- ~~Comparison metric semantic range validation~~ — **완료** (2026-05-14)
  - Shared CLI comparison payload preflight now rejects semantically impossible metrics: `summary.overallRecall` and per-CWE `combined.recall` must be in `[0.0, 1.0]`, while optional noise density fields must be non-negative finite numbers
  - Empty `results: {}` and valid boundary values remain accepted, and programmatic compare helpers remain permissive
  - Verification: RED regressions reproduced out-of-range summary fail-open, negative recall/noise regression misclassification, and Juliet baseline side effects; targeted range tests `6 passed`; focused payload/range tests `8 passed`; benchmark/JULIET related tests `93 passed`; Full S4 pytest `1219 passed in 29.87s`; Critic PASS

- ~~Juliet benchmark CLI output-data construction failure sanitization~~ — **완료** (2026-05-14)
  - Juliet CLI report payload construction is now wrapped with fixed `benchmark report build failed` for `to_dict()` exceptions or non-mapping payloads before output/markdown/stdout/compare side effects
  - Successful output shape is preserved, while malformed internal benchmark result payloads no longer leak raw exception/type/object/path material
  - Verification: RED regressions reproduced raw `ValueError` and non-mapping `TypeError` failures; targeted output-data tests `3 passed`; focused CLI boundary tests `11 passed`; benchmark/JULIET related tests `87 passed`; Full S4 pytest `1213 passed in 29.65s`; Critic PASS

- ~~Juliet benchmark CLI markdown report failure sanitization~~ — **완료** (2026-05-14)
  - Juliet CLI markdown rendering/output is now wrapped with fixed `markdown report failed` for expected render/write failures, preventing raw traceback/exception/object/path leakage
  - Already-written `--output` benchmark JSON is preserved, while downstream stdout JSON and baseline compare handoff are skipped after markdown failure
  - Verification: RED regression reproduced raw `ValueError` leakage after output write; targeted markdown tests `2 passed`; focused CLI output-boundary tests `10 passed`; benchmark/JULIET related tests `85 passed`; Full S4 pytest `1211 passed in 30.16s`; Critic PASS

- ~~Juliet benchmark CLI benchmark execution/setup failure sanitization~~ — **완료** (2026-05-14)
  - Juliet CLI now wraps top-level benchmark execution and maps escaped setup/execution failures before `BenchmarkResult` to fixed `benchmark execution failed` instead of raw tracebacks
  - Missing `testcases/` and synthetic escaped benchmark exceptions no longer echo exception types/messages, Juliet roots, output paths, or stdout report/JSON markers; programmatic `run_benchmark()` and per-CWE scan-failure semantics remain unchanged
  - Verification: RED regressions reproduced raw FileNotFoundError/ValueError tracebacks with secret material; targeted benchmark-failure tests `2 passed`; focused Juliet boundary tests `8 passed`; benchmark/JULIET related tests `84 passed`; Full S4 pytest `1210 passed in 31.21s`; Critic PASS

- ~~Juliet benchmark CLI compare handoff failure sanitization~~ — **완료** (2026-05-14)
  - Juliet `--baseline` late compare handoff now exits with fixed `comparison handoff failed` for expected read/decode/type/schema helper failures instead of leaking raw exception text or baseline/output paths
  - Successful benchmark output artifacts are preserved when only the comparison step fails, and successful compare handoff arguments remain unchanged
  - Verification: RED regression reproduced raw `OSError` leakage after output/markdown; targeted compare-handoff tests `2 passed`; focused baseline/output/stdout tests `12 passed`; benchmark/JULIET related tests `82 passed`; Full S4 pytest `1208 passed in 32.00s`; Critic PASS

- ~~Comparison artifact required-schema validation~~ — **완료** (2026-05-14)
  - Standalone `benchmark.compare` CLI and Juliet `--baseline` preflight now require benchmark-result schema anchors before comparison: top-level `summary`/`results`, `summary.overallRecall`, per-CWE `combined`, and per-CWE `combined.recall`
  - Empty `results: {}` remains valid with proper summary, programmatic compare helpers remain permissive, and malformed CLI artifacts no longer silently default missing recall to `0.0`
  - Verification: RED regressions reproduced `{}` fail-open comparison, missing `combined.recall` regression misclassification, and Juliet baseline benchmark side effects; targeted tests `4 passed`; focused payload/baseline tests `9 passed`; benchmark/JULIET related tests `81 passed`; Full S4 pytest `1207 passed in 30.76s`; Critic PASS

- ~~Juliet benchmark CLI duplicate tool selector validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now rejects duplicate `--tools` selectors such as `semgrep,semgrep` with fixed `invalid tool selection` before benchmark execution or output writes
  - Valid unique current-six subsets still preserve caller order, and duplicates are not silently deduplicated into misleading report/execution metadata
  - Verification: RED regression reproduced duplicate selector fail-open benchmark execution; targeted duplicate+valid tests `2 passed`; focused tool-selector tests `4 passed`; benchmark/JULIET related tests `77 passed`; Full S4 pytest `1203 passed in 34.28s`; Critic PASS

- ~~Comparison payload nested-shape validation~~ — **완료** (2026-05-14)
  - Standalone `benchmark.compare` CLI and Juliet `--baseline` preflight now reject malformed nested comparison payloads before `compare()` / `compare_from_files()`
  - Centralized `is_comparison_payload_shape()` validates summary/results/combined structures, string result keys, and finite non-bool numeric metric fields; standalone compare maps invalid shape to `invalid comparison artifact payload`, Juliet maps it to `invalid baseline artifact payload`
  - Verification: RED regressions reproduced raw `AttributeError`/`TypeError`, NaN fail-open, and Juliet benchmark side effects; targeted regressions `4 passed`; focused compare/JULIET CLI tests `16 passed`; benchmark/JULIET related tests `85 passed`; Full S4 pytest `1202 passed in 39.34s`; Critic PASS

- ~~Juliet benchmark CLI stdout JSON serialization failure sanitization~~ — **완료** (2026-05-14)
  - No-output `juliet_runner.py::main()` now emits report JSON through `_emit_cli_stdout_json()`
  - Serialization/print failures exit `2` with fixed `stdout JSON write failed`, do not echo raw object/exception data, do not print JSON markers, and do not call `compare_from_files()`; file-output behavior is unchanged
  - Verification: RED regression reproduced raw `TypeError` leakage from a secret-named non-serializable result field; targeted regression `1 passed`; focused stdout/output/baseline tests `5 passed`; benchmark/JULIET related tests `81 passed`; Full S4 pytest `1198 passed in 31.31s`; Critic PASS

- ~~Juliet benchmark CLI output write failure sanitization~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now writes `--output` through `_write_cli_output_artifact()` after benchmark execution
  - Parent creation or file write failures exit `2` with fixed `output artifact write failed`, do not echo raw filesystem paths or exception text, do not print stdout JSON, and do not call `compare_from_files()`
  - Verification: RED regressions reproduced raw `OSError` leakage for parent mkdir and write failures; targeted regressions `2 passed`; focused Juliet baseline/output CLI tests `6 passed`; benchmark/JULIET related tests `80 passed`; Full S4 pytest `1197 passed in 30.80s`; Critic PASS

- ~~Juliet benchmark CLI baseline payload validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates caller-provided `--baseline` JSON payload after scalar/artifact preflight and before benchmark execution/output writes
  - Unreadable, malformed, or non-object baselines exit `2` with fixed `invalid baseline artifact payload` and do not echo raw artifact paths or payload content; valid baselines still pass the original `Path` to `compare_from_files()`
  - Verification: RED regressions reproduced benchmark side effects followed by raw `JSONDecodeError`/`AttributeError` path/content leakage; targeted regressions `3 passed`; baseline/output focused Juliet CLI tests `8 passed`; benchmark/JULIET related tests `78 passed`; Full S4 pytest `1195 passed in 31.65s`; Critic PASS

- ~~Benchmark compare CLI JSON payload validation~~ — **완료** (2026-05-14)
  - `benchmark.compare.main()` now loads baseline/current JSON through CLI-only `_load_cli_result()` after threshold and artifact preflight
  - Unreadable, malformed, or non-object artifacts exit `2` with fixed `invalid comparison artifact payload` and do not echo raw artifact paths or payload content; programmatic `_load_result()` / `compare_from_files()` behavior remains unchanged
  - Verification: RED regressions reproduced raw `JSONDecodeError` content leakage and non-object `AttributeError` path/content leakage; targeted payload regressions `2 passed`; compare CLI focused tests `11 passed`; benchmark/JULIET related tests `75 passed`; Full S4 pytest `1192 passed in 30.57s`; Critic PASS

- ~~Benchmark compare CLI threshold fail-closed validation~~ — **완료** (2026-05-14)
  - `benchmark.compare.main()` now parses `--threshold` via a fixed validator before artifact validation/loading
  - Blank/non-numeric/non-finite/non-positive/>1.0 values exit `2` with fixed `invalid threshold selection` and do not echo the submitted value; valid thresholds continue to control regression exit behavior
  - Verification: RED regressions reproduced raw argparse secret leakage, NaN fail-open, and out-of-range fail-open/wrong-exit behavior; targeted regressions `6 passed`; benchmark/JULIET related tests `73 passed`; Full S4 pytest `1190 passed in 30.40s`; Critic PASS

- ~~Benchmark compare CLI artifact preflight validation~~ — **완료** (2026-05-14)
  - `benchmark.compare.main()` now preflights `--baseline` and `--current` as regular files before reading comparison JSON
  - Missing baseline or directory current exits `2` with fixed `invalid comparison artifact` and does not echo raw caller paths; valid comparisons preserve sanitized markdown output
  - Verification: RED regressions reproduced raw `FileNotFoundError`/`IsADirectoryError` secret path leakage; targeted regressions `3 passed`; benchmark/JULIET related tests `67 passed`; Full S4 pytest `1184 passed in 30.45s`; Critic PASS

- ~~Juliet benchmark CLI output artifact preflight validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates `--output` before benchmark execution and output writes
  - Existing directory outputs or existing non-directory parents exit `2` with fixed `invalid output artifact`; missing parents and existing regular output files remain supported
  - Verification: RED regressions reproduced raw `IsADirectoryError`/`FileExistsError` secret path leakage after benchmark side effects; targeted regressions `3 passed`; benchmark/JULIET related tests `64 passed`; Full S4 pytest `1181 passed in 30.56s`; Critic PASS

- ~~Juliet benchmark CLI baseline artifact preflight validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates `--baseline` with `Path.is_file()` before benchmark execution and output writes
  - Missing or directory baselines exit `2` with fixed `invalid baseline artifact`; valid baselines preserve the real `Path` handoff to compare logic
  - Verification: RED regressions reproduced raw `FileNotFoundError`/`IsADirectoryError` secret path leakage after benchmark side effects; targeted regressions `3 passed`; benchmark/JULIET related tests `61 passed`; Full S4 pytest `1178 passed in 30.16s`; Critic PASS

- ~~Juliet benchmark CLI timeout selector fail-closed validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates `--timeout` before benchmark execution and output writes instead of relying on argparse raw `int` conversion
  - Blank/non-decimal/signed/decimal/non-positive values exit `2` with fixed `invalid timeout selection`; valid/default positive integer seconds are preserved
  - Verification: RED regressions reproduced raw `invalid int value` secret leakage and non-positive timeout fail-open execution; targeted regressions `4 passed`; benchmark/JULIET related tests `58 passed`; Full S4 pytest `1175 passed in 30.36s`; Critic PASS

- ~~Juliet benchmark CLI variant selector fail-closed validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates and normalizes `--variant-filter` before benchmark execution and report JSON serialization
  - `all` maps to execution `None`/report `all`; positive decimal IDs preserve trimmed text; blank/non-decimal/non-positive values exit `2` with fixed `invalid variant selection` before side effects
  - Verification: RED regressions reproduced invalid/blank selector fail-open execution and raw whitespace report labels; targeted regressions `4 passed`; benchmark/JULIET related tests `54 passed`; Full S4 pytest `1171 passed in 29.63s`; Critic PASS

- ~~Juliet benchmark CLI CWE selector fail-closed validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates `--cwes` before benchmark execution and output writes
  - Blank/non-decimal/signed/decimal/non-positive segments exit `2` with fixed `invalid CWE selection`; arbitrary positive integer CWE IDs remain supported
  - Verification: RED regressions reproduced raw `ValueError` leakage for secret/blank selectors; targeted regressions `3 passed`; benchmark/JULIET related tests `50 passed`; Full S4 pytest `1167 passed in 30.43s`; Critic PASS

- ~~Juliet benchmark CLI tool selector fail-closed validation~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` now validates `--tools` against the current-six allowlist before benchmark execution
  - Unknown or blank selectors exit `2` with fixed `invalid tool selection`, do not run the benchmark, and do not write output files; valid current-six subsets preserve caller order
  - Verification: RED regressions reproduced unknown/blank selector fail-open execution and blank selector report leakage; targeted regressions `3 passed`; benchmark/JULIET related tests `47 passed`; Full S4 pytest `1164 passed in 30.90s`; Critic PASS

- ~~Juliet benchmark CLI report/log path redaction~~ — **완료** (2026-05-14)
  - `juliet_runner.py::main()` no longer serializes caller-provided `--juliet-path` into public report JSON; reports use the historical `<JULIET_ROOT>/C` placeholder
  - Save logs no longer echo caller-provided `--output` paths; the real Juliet path still reaches benchmark execution and the requested output file is still written
  - Verification: RED regressions reproduced secret Juliet root leakage in stdout/written JSON and secret output-path leakage in save logs; targeted regressions `2 passed`; benchmark/JULIET related tests `44 passed`; Full S4 pytest `1161 passed in 30.48s`; Critic PASS

- ~~Benchmark compare markdown path-label redaction~~ — **완료** (2026-05-14)
  - `ComparisonReport.to_markdown()` no longer echoes caller-provided baseline/current path labels; public markdown uses fixed `baseline artifact` / `current artifact` labels
  - Internal `ComparisonReport.baseline_path/current_path`, scoring, regression detection, and `(current run)` convenience label are preserved
  - Verification: RED regression reproduced secret baseline/current path leakage; targeted regression `1 passed`; benchmark/JULIET related tests `42 passed`; Full S4 pytest `1159 passed in 30.30s`; Critic PASS

- ~~Juliet benchmark start-log variant filter redaction~~ — **완료** (2026-05-14)
  - `run_benchmark(..., variant_filter=...)` start logs no longer echo caller-provided variant values; logs retain `variantSelection=all|filtered`
  - Actual discovery input, benchmark scoring, and report semantics are unchanged
  - Verification: RED regression reproduced secret variant filter leakage; targeted regression `1 passed`; benchmark/JULIET related tests `41 passed`; Full S4 pytest `1158 passed in 30.13s`; Critic PASS

- ~~Juliet benchmark start-log tool selector redaction~~ — **완료** (2026-05-14)
  - `run_benchmark(..., tools=[...])` start logs no longer echo caller-provided tool selector values; logs retain `toolSelection=all|custom` and `toolCount`
  - Actual tool-selection behavior and benchmark scoring/report semantics are unchanged
  - Verification: RED regression reproduced secret tool selector leakage; targeted regression `1 passed`; benchmark/JULIET related tests `40 passed`; Full S4 pytest `1157 passed in 30.79s`; Critic PASS

- ~~Benchmark report `cweName` serialization sanitization~~ — **완료** (2026-05-14)
  - Generated benchmark JSON no longer echoes corpus-derived `CWEMetrics.cwe_name`; known tracked Juliet CWEs serialize through a deterministic safe display-name allowlist and unknown CWEs fall back to the stable CWE id
  - Scoring metrics, result keys, and internal `CWEMetrics.cwe_name` remain unchanged; this is a public serialization boundary hardening
  - Verification: RED regressions reproduced secret `cwe_name` leakage for known and unknown CWE rows; targeted regressions `2 passed`; benchmark/JULIET related tests `39 passed`; Full S4 pytest `1156 passed in 30.63s`; Critic PASS

- ~~Juliet benchmark suite progress log redaction~~ — **완료** (2026-05-14)
  - Per-suite Juliet benchmark progress logs no longer echo corpus-derived `suite.cwe_name` directory suffixes; logs retain stable `CWE-*` key and file count
  - Benchmark discovery, fake/real orchestrator flow, metrics population, and result shape are unchanged
  - Verification: RED regression reproduced secret CWE directory suffix leakage; targeted regression `1 passed`; Juliet/benchmark related tests `37 passed`; Full S4 pytest `1154 passed in 30.49s`; Critic PASS

- ~~Juliet benchmark custom-rules setting restoration~~ — **완료** (2026-05-14)
  - `run_benchmark(custom_rules=false)` now restores global `settings.custom_rules_dir` through `try/finally`, including no-suite early return and missing-`testcases` discovery exceptions
  - This prevents one offline benchmark run from contaminating later S4 Semgrep/custom-rules state in the same process
  - Verification: RED regressions reproduced stale `None` after both no-suite return and discovery exception; targeted regressions `2 passed`; Juliet/benchmark related tests `36 passed`; Full S4 pytest `1153 passed in 30.80s`; Critic PASS

- ~~Juliet benchmark no-suite log path redaction~~ — **완료** (2026-05-14)
  - Offline Juliet benchmark empty-selection diagnostics no longer echo host-local `juliet_root`, requested CWE list, variant filter, or source paths when `testcases/` exists but no matching suite is found
  - Behavior remains unchanged: empty suite selection returns empty `BenchmarkResult()` and does not execute the orchestrator
  - Verification: RED regression reproduced secret root leakage; targeted regression `1 passed`; Juliet/benchmark related tests `34 passed`; Full S4 pytest `1151 passed in 30.34s`; Critic PASS

- ~~Durable ownership request-id conflict error-envelope standardization~~ — **완료** (2026-05-14)
  - Cross-endpoint reuse of an active durable `X-Request-Id` now preserves HTTP 409 plus existing `error`/`requestId`/endpoint/status/result routing fields while adding `success=false` and `errorDetail{code="REQUEST_ID_CONFLICT",message,requestId,retryable=false}`
  - Same-endpoint idempotent retry remains on the existing reused status path and does not start a duplicate task
  - Verification: RED regression reproduced missing `success`/`errorDetail`; targeted regression `1 passed`; request ownership + scan endpoint tests `113 passed`; Full S4 pytest `1150 passed in 30.49s`; Critic PASS

- ~~Durable ownership missing/expired error-envelope standardization~~ — **완료** (2026-05-14)
  - `/v1/requests/{requestId}`, `/result`, and cancel missing/expired branches now keep top-level `error`/`requestId` and HTTP 404/410, while adding `success=false` and standard `errorDetail` metadata
  - `REQUEST_NOT_FOUND` maps to `request not found`; `REQUEST_EXPIRED` maps to `request expired`; both are `retryable=false` and preserve request-id contract material
  - Verification: RED regressions reproduced missing envelope fields on missing/expired durable ownership errors; targeted regressions `2 passed`; request ownership + scan endpoint tests `113 passed`; Full S4 pytest `1150 passed in 30.32s`; Critic PASS

- ~~Direct preflight 400 error-shape standardization~~ — **완료** (2026-05-14)
  - `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` direct validation branches now keep legacy `error` strings but also return `success=false` and standard `errorDetail` metadata
  - Stable direct preflight codes: `PROJECT_PATH_REQUIRED`, `PROJECT_PATH_NOT_FOUND`, `BUILD_COMMAND_REQUIRED`; `errorDetail.requestId` uses the endpoint's `X-Request-Id`/generated request id and `retryable=false`
  - Verification: RED regressions reproduced missing `success`/`errorDetail` on representative branches; targeted regressions `6 passed`; scan endpoint suite `103 passed`; Full S4 pytest `1150 passed in 30.61s`; Critic PASS

- ~~Request-validation `loc` context-aware map-key redaction~~ — **완료** (2026-05-14)
  - 422 location sanitization now uses raw previous loc parts to detect mapping fields and redacts the following string segment as `<field>` even when the key equals an allowlisted schema name
  - Direct `buildEnvironment.environment` and nested `buildProfile.defines.compiler` caller keys no longer leak through `validationErrors[].loc`; known schema fields and integer indices remain useful elsewhere
  - Verification: RED regressions reproduced both safe-looking dynamic map-key leaks; targeted regressions `4 passed`; related scan endpoint/startup tests `105 passed`; Full S4 pytest `1150 passed in 30.06s`; Critic PASS

- ~~Request-validation `loc` dynamic-key redaction~~ — **완료** (2026-05-14)
  - Sanitized 422 `validationErrors[].loc` now preserves known schema/transport field names and integer indices, but replaces caller-controlled mapping keys with `<field>`
  - Dynamic `buildEnvironment`/similar map keys no longer leak through structural validation metadata while useful paths like `["body", "files", 0, "content"]` remain available
  - Verification: RED regression reproduced secret dynamic environment key leakage through `validationErrors[0].loc`; targeted regressions `2 passed`; related scan endpoint/startup tests `103 passed`; Full S4 pytest `1148 passed in 30.36s`; Critic PASS

- ~~FastAPI/Pydantic 422 request-validation error redaction~~ — **완료** (2026-05-14)
  - Pre-router `RequestValidationError` no longer returns FastAPI default `detail[].input` values, closing raw request-body echo before S4 router/domain handlers run
  - Malformed request bodies keep HTTP 422 but now use fixed `REQUEST_VALIDATION_FAILED` / `request validation failed`, sanitized `validationErrors[]`, and request-id propagation in both header and `errorDetail.requestId`
  - Verification: RED regression reproduced nested secret object leakage via default `detail[0].input`; targeted regression `1 passed`; related scan endpoint/router logging/startup tests `103 passed`; Full S4 pytest `1147 passed in 30.79s`; Critic PASS

- ~~Public `SCAN_TOOL_INVALID` unknown tool-id redaction~~ — **완료** (2026-05-14)
  - Unsupported `options.tools[]` still fails early with `SCAN_TOOL_INVALID` / HTTP 400 / `retryable=false`, but public response/log/request-summary surfaces no longer echo the submitted unknown tool identifier
  - Sync `/v1/scan`, NDJSON validation JSON, and `/v1/build-and-analyze` pre-build validation keep safe current-six allowed-tool guidance and stop before build/tool execution
  - Verification: RED regressions reproduced raw secret tool-id leakage in response/log surfaces; targeted regressions `3 passed`; related scan endpoint/sdk/orchestrator tests `185 passed`; Full S4 pytest `1146 passed in 30.61s`; Critic PASS

- ~~Public `SDK_NOT_FOUND` sdkId redaction~~ — **완료** (2026-05-14)
  - Unknown bare `sdkId` still fails early with `SDK_NOT_FOUND` / HTTP 400 / `retryable=false`, but public response/log/request-summary surfaces no longer echo the submitted SDK identifier
  - Sync `/v1/scan`, NDJSON validation JSON, and `/v1/build-and-analyze` pre-build validation keep actionable fixed guidance for registered SDK, `non-registered` descriptor, or `none` mode
  - Verification: RED regressions reproduced raw secret sdkId leakage in response/log surfaces; targeted regressions `5 passed`; related scan endpoint/sdk/orchestrator tests `184 passed`; Full S4 pytest `1145 passed in 29.57s`; Critic PASS

- ~~Router structured-log SDK identity redaction~~ — **완료** (2026-05-14)
  - `Scan started` and `Scan execution summary` structured logs no longer emit raw `sdkId`; they expose value-free `sdkIdProvided` / `executionSdkIdProvided` booleans instead
  - Static router logging guard now forbids literal `sdkId` logger extra keys alongside raw path/command keys
  - Verification: RED static guard found `scan.py` `sdkId` offenders; targeted regressions `2 passed`; related scan router/endpoint/sdk/orchestrator tests `185 passed`; Full S4 pytest `1145 passed in 28.32s`; Critic PASS

- ~~Public finding/dataFlow external absolute path redaction~~ — **완료** (2026-05-14)
  - Retained cross-boundary findings no longer expose raw external SDK/system roots in `location.file`, `dataFlow[].file`, or `metadata.evidenceResolution.location.file`
  - Internal parser output and `_filter_user_code_findings()` still use raw paths until filtering completes, preserving SDK/system-noise removal and cross-boundary classification; public projection then emits scan-root-relative paths or `<external>/<basename>`/`<external>/<unknown>`
  - Verification: RED regressions added for retained cross-boundary secret path leakage; targeted regressions `2 passed`; related orchestrator/parser/endpoint/static-evidence tests `268 passed`; Full S4 pytest `1144 passed in 28.47s`; Critic PASS

- ~~`/v1/includes` dependency path public evidence redaction~~ — **완료** (2026-05-14)
  - Include dependency lists now preserve response shape but never expose absolute host/SDK paths; project-local absolute dependencies become scan-root-relative, external absolute dependencies become `<external>/<basename>` or `<external>/<unknown>`
  - Source-file exclusion, relative dependency evidence, and resolver execution behavior are preserved
  - Verification: RED regressions reproduced raw `/tmp/SECRET_INCLUDE_ROOT/...` dependency leakage; targeted regressions `12 passed`; related include/scan endpoint/static-evidence tests `143 passed`; Full S4 pytest `1142 passed in 28.74s`; Critic PASS

- ~~SDK execution-report root-path public evidence redaction~~ — **완료** (2026-05-14)
  - `/v1/scan` `execution.sdk` no longer exposes raw `sdkDescriptor.sdkRootPath`; public wire JSON omits/nulls `sdkRootPath` and emits `sdkRootPathStatus="configured"|"not-configured"` as status-only evidence
  - Internal non-registered SDK resolution, include path enrichment, and tool execution still consume the caller-provided descriptor path; this is a public evidence redaction only
  - Verification: RED regressions reproduced non-registered SDK root leakage in producer and endpoint response; targeted regressions `2 passed`; related orchestrator/sdk contract/scan endpoint/sdk resolver/static-evidence tests `254 passed`; Full S4 pytest `1136 passed in 28.63s`; Critic PASS

- ~~Nested SCA diff repository URL evidence sanitization~~ — **완료** (2026-05-14)
  - Public `diffSummary.repoUrl` and `/v1/libraries` nested `entry.diff.repoUrl` mappings now strip URL userinfo, query, and fragment even when a caller/test-double supplies raw diff mappings
  - Diff mappings are shallow-copied before sanitization; raw top-level repo URLs still flow into internal differ calls
  - Verification: RED regressions reproduced nested diff URL credential leakage; targeted regressions `2 passed`; related repository/SCA/evidence/differ/scan endpoint tests `153 passed`; Full S4 pytest `1135 passed in 28.55s`; Critic PASS

- ~~SCA repository URL public evidence credential sanitization~~ — **완료** (2026-05-14)
  - Public SCA `repoUrl`/`remoteUrl` evidence now strips URL userinfo, query, and fragment while preserving safe scheme/host/port/path repository identity
  - Raw repository URLs remain available internally for clone/fetch/diff operations; schema fields are unchanged
  - Verification: RED target exposed missing helper/raw projection coverage; targeted regressions `9 passed`; related repository/library/differ/SCA/evidence/scan endpoint tests `165 passed`; Full S4 pytest `1133 passed in 28.46s`; Critic PASS

- ~~BuildMetadata public compiler identity path sanitization~~ — **완료** (2026-05-14)
  - `/v1/metadata` / nested build metadata `compiler` evidence now emits compiler executable identity plus version, never host-local SDK compiler paths
  - Subprocess execution and version probing still use the real compiler path internally; macro parsing and `targetInfo` behavior are unchanged
  - Verification: RED regressions reproduced POSIX and Windows-like compiler path leakage in success/fail-soft metadata; targeted regressions `2 passed`; related build-metadata + scan endpoint tests `121 passed`; Full S4 pytest `1124 passed in 28.73s`; Critic PASS

- ~~LibraryDiffer CloneCache repo URL log sanitization~~ — **완료** (2026-05-14)
  - `CloneCache.get_or_clone()` debug HIT/MISS logs now emit category/age/freshness only, without raw repository URLs, tokens, hosts, or repo paths
  - Clone/fetch URL usage, cache keying, returned cache paths, and diff/API evidence behavior are unchanged
  - Verification: RED regressions reproduced repo URL/token/host leakage in cache HIT/MISS logs; targeted regressions `2 passed`; related library/SCA/scan endpoint tests `131 passed`; Full S4 pytest `1122 passed in 28.48s`; Critic PASS

- ~~SDK registry/enrichment log identity/path sanitization~~ — **완료** (2026-05-14)
  - `register_sdk()`/`unregister_sdk()` and `ScanOrchestrator._enrich_profile_with_sdk()` logs now emit category/count-only messages without raw sdkId, SDK install paths, or include paths
  - Registry storage, SDK include/compiler resolution, and public API/evidence fields are unchanged; this is a log-only system-stability hardening
  - Verification: RED regressions reproduced SDK id/path leakage in three log surfaces; targeted regressions `3 passed`; SDK resolver + orchestrator tests `116 passed`; Full S4 pytest `1120 passed in 28.44s`; Critic PASS

- ~~Startup runtime logDir structured-log redaction~~ — **완료** (2026-05-14)
  - `SAST Runner runtime configuration` startup logs now expose `logDirConfigured` and `logDirSource` instead of raw log directory paths
  - `_setup_logging()` still uses the actual path internally, so file logging behavior is unchanged
  - Verification: RED regression reproduced secret `settings.log_dir` exposure/missing status; startup logging tests `2 passed`; related startup+scan endpoint tests `98 passed`; Full S4 pytest `1117 passed in 28.54s`; Critic PASS

- ~~Runtime expectedExecutablePath redaction~~ — **완료** (2026-05-14)
  - `ScanOrchestrator.check_tools()` producer output, `/v1/health`, startup degraded-tool logs, and required-tool preflight failure metadata/logs now expose only `expectedExecutablePathStatus=configured|not-configured`, never raw executable paths
  - Availability/version/probeReason/policy behavior is preserved; offline Tool Portfolio report validation remains out of scope
  - Verification: RED regressions reproduced raw path exposure or missing status in producer, health, startup, and preflight surfaces; targeted regressions `4 passed`; related orchestrator/scan endpoint/startup tests `173 passed`; Full S4 pytest `1116 passed in 28.41s`; Critic PASS

- ~~LibraryDiffer `_compute_diff()` path sanitization~~ — **완료** (2026-05-14)
  - SCA diff evidence from `diff --brief` now emits only resolved library-relative source paths in `modifications[].file` and additive `addedFilesList[]`; raw `Only in ...` lines, host-local roots, upstream/cache paths, and outside-root modified rows are not echoed
  - `addedFiles` remains the filtered integer count and equals `len(addedFilesList)` after filtering
  - Verification: RED regressions reproduced missing sanitized added-file evidence and outside modified-row raw fallback; targeted regressions `2 passed`; LibraryDiffer tests `24 passed`; related library/SCA/scan endpoint tests `141 passed`; Full S4 pytest `1113 passed in 28.45s`; Critic PASS

- ~~Unknown internal exception surface sanitization~~ — **완료** (2026-05-14)
  - Unexpected non-domain exceptions across sync `/v1/scan`, NDJSON scan, direct `_error_response()` endpoints, `/v1/build`/`/v1/build-and-analyze` generic summaries, durable ownership results, health request summaries, and logs now surface fixed `"internal error"` / `INTERNAL_ERROR` only
  - Known domain `SastRunnerError` and `PolicyViolationError` messages remain unchanged; logs retain safe `exceptionType` metadata but no raw exception text or traceback
  - Verification: RED regressions reproduced build/NDJSON/sync-scan/durable async secret exception leakage; targeted regressions `4 passed`; scan endpoint + request ownership tests `105 passed`; Full S4 pytest `1111 passed in 28.84s`; Critic PASS

- ~~BuildRunner API evidence output/excerpt sanitization~~ — **완료** (2026-05-14)
  - `/v1/build`/nested build result `buildEvidence.buildOutput` no longer echoes raw stdout/stderr; nonblank output is fixed `"build output omitted"`, absent output remains `null`
  - BuildRunner `failureDetail.matchedExcerpt` remains schema-present but nullable and no longer echoes raw shared-library, exit127, or generic build failure lines; category/summary/hint/retryable remain the consumer evidence
  - Verification: RED regressions reproduced success stdout/stderr, compile-commands failure stdout/stderr, shared-library loader-line, and exit127 stderr leakage; targeted regressions `4 passed`; BuildRunner tests `21 passed`; related build/scan/request-ownership tests `123 passed`; Full S4 pytest `1108 passed in 25.48s`; Critic PASS

- ~~Drive-qualified relative files[] path hardening~~ — **완료** (2026-05-14)
  - `_validate_path()` now rejects Windows drive-qualified relative forms like `C:foo.c` / `z:foo.c` with stable `Absolute path not allowed`, while preserving arbitrary colon filenames such as `src:main.c`
  - Verification: RED helper regressions reproduced two drive-qualified relative bypasses; targeted path validation `9 passed`; scan endpoint + path validation `102 passed`; related scan/request-ownership/sdk/static-evidence tests `152 passed`; Full S4 pytest `1104 passed in 25.20s`; Critic PASS

- ~~gcc/scan-build per-file source log sanitization~~ — **완료** (2026-05-14)
  - gcc-fanalyzer and scan-build per-file failure/timeout warning logs no longer emit source file identifiers; logs keep category plus safe timeout seconds while preserving findings, progress callbacks, runtime counters, and API responses
  - Verification: RED caplog regressions reproduced secret source filename leakage in four failure/timeout surfaces; targeted regressions `4 passed`; affected gcc/scan-build runner tests `31 passed`; related gcc/scan-build/orchestrator/scan endpoint tests `199 passed`; Full S4 pytest `1101 passed in 25.21s`; Critic PASS

- ~~gcc-fanalyzer compiler path log sanitization~~ — **완료** (2026-05-14)
  - `GccAnalyzerRunner.run()` and unsupported SDK fallback logs no longer emit raw compiler executable paths; logs keep category plus count/boolean metadata while preserving execution/finding behavior
  - Verification: RED caplog regressions reproduced secret compiler path leakage in start and fallback logs; targeted regressions `2 passed`; gcc-analyzer tests `18 passed`; related gcc/orchestrator/scan endpoint tests `186 passed`; Full S4 pytest `1099 passed in 25.40s`; Critic PASS

- ~~files[] Windows/backslash path validation hardening~~ — **완료** (2026-05-14)
  - `_validate_path()` now rejects backslash-normalized traversal, Windows drive absolute paths, and UNC/backslash-root paths with value-free fixed messages while preserving safe POSIX relative paths and safe `src\main.c` compatibility
  - Verification: RED helper regressions reproduced four unsafe path-shape bypasses; targeted path validation `6 passed`; scan endpoint + path validation `99 passed`; related scan/request-ownership/sdk/static-evidence tests `149 passed`; Full S4 pytest `1097 passed in 25.26s`; Critic PASS

- ~~BuildRunner log surface sanitization~~ — **완료** (2026-05-14)
  - `BuildRunner.discover_targets()` and `BuildRunner.build()` start logs no longer emit raw project paths or caller build commands; logs keep category plus count/boolean metadata only while preserving API/evidence response fields
  - Verification: RED caplog regressions reproduced secret project path and build command leakage; targeted regressions `2 passed`; BuildRunner tests `17 passed`; related build/scan/request-ownership tests `119 passed`; Full S4 pytest `1091 passed in 25.53s`; Critic PASS

- ~~Simple runner command-start log sanitization~~ — **완료** (2026-05-14)
  - Semgrep, Cppcheck, and Flawfinder command-start logs no longer emit joined CLI commands, scan directories, rules/include paths, or command flags; logs keep stable category plus count/boolean metadata only
  - Verification: RED caplog regressions reproduced full command/secret path leakage in all three runners; targeted regressions `3 passed`; affected runner tests `46 passed`; related runner/orchestrator/scan endpoint tests `214 passed`; Full S4 pytest `1089 passed in 25.99s`; Critic PASS

- ~~Router structured-log raw path/command extra sanitization~~ — **완료** (2026-05-14)
  - `scan.py` router-level logger `extra={...}` fields no longer emit raw `projectPath`, `buildCommand`, `requestedBuildCommand`, `effectiveBuildCommand`, or `compileCommandsPath`; value surfaces are replaced with presence booleans while preserving request/status/count/timing signals
  - Verification: RED static AST gate found 14 forbidden logger extra offenders; targeted AST gate `1 passed`; scan endpoint + static gate `94 passed`; related scan/request-ownership/sdk/static-evidence tests `144 passed`; Full S4 pytest `1086 passed in 25.32s`; Critic PASS

- ~~files[] path validation raw-echo sanitization~~ — **완료** (2026-05-14)
  - `_validate_path()` absolute/traversal failures now return fixed `Absolute path not allowed` / `Path traversal not allowed` messages without caller-provided `files[].path` echo across `/v1/scan`, `/v1/functions`, and `/v1/includes` validation surfaces
  - Verification: RED reproduced secret file-path echo in four endpoint/error-shape regressions; targeted regressions `4 passed`; scan endpoint tests `93 passed`; related scan/request-ownership/sdk/static-evidence tests `143 passed`; Full S4 pytest `1085 passed in 25.66s`; Critic PASS

- ~~NoFilesError projectPath-not-found API response sanitization~~ — **완료** (2026-05-14)
  - `_prepare_scan_dir()`-based `/v1/scan`, `/v1/functions`, `/v1/includes`, plus `/v1/libraries`, now return fixed `projectPath not found` errors without caller-provided path echo while preserving 400 response shape
  - Verification: RED reproduced secret projectPath echo in four NoFilesError-based endpoints; targeted regressions `4 passed`; scan endpoint tests `91 passed`; related scan/request-ownership/sdk/static-evidence tests `141 passed`; Full S4 pytest `1083 passed in 25.05s`; Critic PASS

- ~~Direct projectPath-not-found API response sanitization~~ — **완료** (2026-05-14)
  - `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` now return fixed `projectPath not found` errors without caller-provided project paths while preserving status codes and response shape
  - Verification: RED reproduced secret projectPath echo in all three direct-return endpoints; targeted regressions `3 passed`; scan endpoint tests `87 passed`; related scan/request-ownership/sdk/static-evidence tests `137 passed`; Full S4 pytest `1079 passed in 25.59s`; Critic PASS

- ~~SCA library identity path-log sanitization~~ — **완료** (2026-05-14)
  - `LibraryIdentifier.identify()` and permission-denied scanning logs now keep count/category-only messages without project root, child directory, or permission exception detail, while preserving returned library metadata
  - Verification: RED reproduced secret project root and permission child path leakage in SCA identity logs; targeted regressions `2 passed`; library identifier tests `13 passed`; related library/SCA/static-evidence/scan endpoint tests `155 passed`; Full S4 pytest `1078 passed in 25.64s`; Critic PASS

- ~~SCA diff failure log sanitization~~ — **완료** (2026-05-14)
  - `analyze_libraries()` now keeps SCA diff failures fail-soft with `diff=None`, but logs only fixed `lib_differ.diff failed` without project-derived library names or raw diff exceptions
  - Verification: RED reproduced secret library name and exception leakage in SCA diff warning logs; targeted regression `1 passed`; SCA service tests `9 passed`; related SCA/scan/static-evidence/quality tests `143 passed`; Full S4 pytest `1076 passed in 24.89s`; Critic PASS

- ~~Orchestrator tool exception surface sanitization~~ — **완료** (2026-05-14)
  - `ScanOrchestrator.run()` now records per-tool task exceptions as category-only `tool-execution-failed` skip reasons and logs fixed `Tool <tool> failed` without raw exception text, preserving fail-soft execution reports
  - Verification: RED reproduced raw tool exception leakage in warning logs and `execution.toolResults[].skipReason`; targeted regression `1 passed`; orchestrator tests `75 passed`; related orchestrator/scan endpoint/static-evidence/quality tests `209 passed`; Full S4 pytest `1076 passed in 24.97s`; Critic PASS

- ~~SDK validation error-surface sanitization~~ — **완료** (2026-05-14)
  - `validate_sdk()` now returns value-free category strings for missing SDK path, sysroot, environment setup script, and compiler checks, preserving error list shape and validation flow without host path/prefix echo
  - Verification: RED reproduced host path/sysroot/setup/prefix leakage in four validation error strings; targeted regressions `4 passed`; SDK resolver tests `37 passed`; related SDK/build/scan endpoint tests `152 passed`; Full S4 pytest `1075 passed in 25.47s`; Critic PASS

- ~~SDK include-path resolution log sanitization~~ — **완료** (2026-05-14)
  - `resolve_sdk_paths()` and `_resolve_from_registry()` keep include-path results unchanged, but success/missing-directory/missing-sysroot logs now omit caller sdkId, SDK root/base paths, and sysroot paths
  - Verification: RED reproduced sdkId/root/base/sysroot leakage in three SDK resolution logs; targeted regressions `3 passed`; SDK resolver tests `37 passed`; related SDK/build/scan endpoint tests `152 passed`; Full S4 pytest `1075 passed in 24.79s`; Critic PASS

- ~~SDK registry load failure log sanitization~~ — **완료** (2026-05-14)
  - `_load_sdk_registry()` still fail-softs missing/malformed SDK registry inputs to `{}`, but warning/error logs now use fixed categories without SDK root paths, registry filenames, or JSON/OSError detail
  - Verification: RED reproduced secret SDK root path and JSON parser-detail leakage; targeted regressions `2 passed`; SDK resolver tests `34 passed`; related SDK/build/scan endpoint tests `149 passed`; Full S4 pytest `1072 passed in 25.29s`; Critic PASS

- ~~AST dump failure log sanitization~~ — **완료** (2026-05-14)
  - `AstDumper._dump_single()` still fail-softs advisory AST/codegraph extraction failures to `None`, but warning logs now use fixed `AST dump failed` without source filenames or raw tool/parser exception text
  - Verification: RED reproduced secret source filename and exception-text leakage in AST dump failure logs; targeted regression `1 passed`; AST dumper tests `14 passed`; related codegraph/static-evidence/scan endpoint tests `161 passed`; Full S4 pytest `1070 passed in 25.00s`; Critic PASS

- ~~Build metadata macro extraction failure log sanitization~~ — **완료** (2026-05-14)
  - `BuildMetadataExtractor.extract()` still fail-softs advisory macro collection failures, but warning logs now use fixed `gcc macro extraction failed` without raw `FileNotFoundError`/timeout exception text
  - Verification: RED reproduced secret exception text leakage in macro-extraction failure logs; targeted regression `1 passed`; build metadata tests `23 passed`; related scanner/orchestrator/endpoint+runner tests `262 passed`; Full S4 pytest `1069 passed in 25.33s`; Critic PASS

- ~~Scan-build plist parse failure log sanitization~~ — **완료** (2026-05-14)
  - `_parse_plist_results()` remains fail-soft across malformed plist files, but malformed plist warnings now use a fixed category without plist filenames or parser exception text
  - Verification: RED reproduced secret plist filename and parser-detail leakage while valid plist parsing continued; targeted regression `1 passed`; scan-build runner tests `11 passed`; related scanner/orchestrator/endpoint tests `187 passed`; Full S4 pytest `1068 passed in 25.55s`; Critic PASS

- ~~Compile-analyzer per-file failure log sanitization~~ — **완료** (2026-05-14)
  - gcc-fanalyzer and scan-build per-file exception aggregation logs now keep stable file-level failure categories without echoing raw exception text, while preserving failed-file counts and partial behavior
  - Verification: RED reproduced raw exception text in both runner logs; targeted regressions `2 passed`; gcc/scan-build runner tests `26 passed`; related scanner/orchestrator/endpoint tests `186 passed`; Full S4 pytest `1067 passed in 26.83s`; Critic PASS

- ~~Semgrep runner raw stdout/stderr log sanitization~~ — **완료** (2026-05-14)
  - Semgrep empty-stdout stderr and non-JSON stdout/stderr paths now log fixed categories only, while preserving empty-SARIF fallback and `ToolOutputInvalidError` behavior
  - Verification: RED reproduced raw Semgrep stderr/stdout leakage in logs; targeted regressions `2 passed`; Semgrep runner tests `22 passed`; related scanner/parser/orchestrator/endpoint tests `198 passed`; Full S4 pytest `1065 passed in 24.84s`; Critic PASS

- ~~Juliet manifest missing-testcases path sanitization~~ — **완료** (2026-05-14)
  - `discover_cwe_suites()` still fails immediately when `testcases/` is absent, but the diagnostic is now stable `Juliet testcases directory not found` without echoing host-local Juliet root paths
  - Verification: RED reproduced secret root path leakage; targeted regression `1 passed`; benchmark/JULIET related tests `33 passed`; Full S4 pytest `1063 passed in 24.95s`; Critic PASS

- ~~Juliet benchmark scan-failure log sanitization~~ — **완료** (2026-05-14)
  - `_benchmark_cwe()` still marks all suite cases FN on orchestrator/tool failure, but benchmark logs now keep only stable `Scan failed for <CWE>` categories and no longer echo raw exception text
  - Verification: RED reproduced secret exception text in benchmark log; targeted regression `1 passed`; benchmark/JULIET related tests `32 passed`; Full S4 pytest `1062 passed in 25.23s`; Critic PASS

- ~~SARIF parser malformed-output sanitization~~ — **완료** (2026-05-14)
  - `parse_sarif()` now converts malformed parser-shape failures, including non-mapping wrappers, into stable `SarifParseError("Failed to parse SARIF output")` without parser detail or chained causes
  - Verification: RED reproduced parser-detail leakage and raw `AttributeError` escape; targeted regressions `2 passed`; SARIF parser tests `16 passed`; related parser/scan/tool-output tests `114 passed`; Full S4 pytest `1061 passed in 25.25s`; Critic PASS

- ~~Tool Output Compatibility fixture input error-surface sanitization~~ — **완료** (2026-05-14)
  - `tool_output_compat._parse_findings()` now resolves `inputFixture` through a safe relative fixture-root boundary and uses value-free read/JSON helpers so missing fixtures, malformed SARIF JSON, and traversal attempts do not echo paths/content/parser details
  - Verification: RED reproduced raw missing-fixture path, malformed SARIF parser diagnostic, and traversal path leakage; targeted regressions `3 passed`; tool-output compatibility tests `12 passed`; related offline evidence/report tests `88 passed`; Full S4 pytest `1059 passed in 25.33s`; Critic PASS

- ~~Tool Output Compatibility manifest/parserKind error-surface sanitization~~ — **완료** (2026-05-14)
  - `tool_output_compat.load_manifest()` now fail-closes unreadable, malformed, and non-object manifests with value-free diagnostics, and unsupported `parserKind` no longer echoes caller-controlled values
  - Verification: RED reproduced raw missing-path, JSON parser, non-object accept, and parserKind value leakage; targeted regressions `4 passed`; tool-output compatibility tests `9 passed`; related offline evidence/report tests `85 passed`; Full S4 pytest `1056 passed in 25.01s`; Critic PASS

- ~~Benchmark Slice artifact loader error-surface sanitization~~ — **완료** (2026-05-14)
  - `benchmark_slice_report._load_artifact()` now wraps read/parse failures as value-free `ValueError`s with suppressed causes and removes raw path echo from non-object artifact diagnostics
  - Verification: RED reproduced raw missing-path, JSON parser, and non-object path leakage; targeted regressions `3 passed`; benchmark slice report tests `9 passed`; related offline evidence/report tests `81 passed`; Full S4 pytest `1052 passed in 25.38s`; Critic PASS

- ~~Actual runner path-boundary exception-chain suppression~~ — **완료** (2026-05-14)
  - `stage_case_only_corpus()` source-root escape and `_resolve_acquisition_root()` relative-base escape failures now keep value-free category diagnostics while suppressing `Path.relative_to()` exception chains that can contain host-local paths
  - Verification: RED reproduced source/base escape chained `Path.relative_to()` errors with secret absolute paths; targeted regressions `2 passed`; actual runner tests `20 passed`; related Tool Portfolio tests `425 passed`; Full S4 pytest `1049 passed in 25.35s`; Critic PASS

- ~~Acquisition manifest real-calendar exception-chain suppression~~ — **완료** (2026-05-14)
  - `downloadedAt` real-calendar parse failures now keep the same value-free `downloadedAt must be a real calendar date/time` diagnostic while suppressing the underlying `datetime.strptime` exception chain (`from None`)
  - Verification: RED reproduced parser `ValueError('day is out of range for month')` as `__cause__`; targeted regression `1 passed`; acquisition manifest tests `46 passed`; related Tool Portfolio tests `423 passed`; Full S4 pytest `1047 passed in 25.28s`; Critic PASS

- ~~Actual runner CLI input failure fail-closed handling~~ — **완료** (2026-05-14)
  - Actual Tool Portfolio runner CLI catches JSON input-loading `ValueError`s and now has a later scalar-parser hardening loop for argparse `--timeout`/`--phase`; both use fixed stderr `input validation failed` without traceback/path/content echo
  - Verification: RED reproduced missing-path and malformed-content CLI raises; targeted CLI tests `2 passed`; actual runner tests `18 passed`; related Tool Portfolio tests `422 passed`; Full S4 pytest `1046 passed in 24.95s`; Critic PASS

- ~~Juliet corpus file selection failure path redaction~~ — **완료** (2026-05-14)
  - `_select_juliet_file()` now reports missing Juliet fixture selection with value-free `No Juliet file found` diagnostics, avoiding host-local corpus/cache root path echo
  - Verification: RED reproduced secret root path leakage; targeted helper test `1 passed`; corpus acquisition tests `14 passed`; related Tool Portfolio tests `420 passed`; Full S4 pytest `1044 passed in 25.18s`; Critic PASS

- ~~Actual runner JSON input loader read/parse error-surface sanitization~~ — **완료** (2026-05-14)
  - Actual Tool Portfolio runner `_load_json_object()` now wraps read and parse failures as value-free `ValueError`s without host-local paths, raw parser messages, content fragments, or chained causes; valid object and non-object behavior remain stable
  - Verification: RED reproduced missing-path and malformed-JSON raw exception surfaces; targeted loader tests `3 passed`; actual runner tests `16 passed`; related Tool Portfolio tests `419 passed`; Full S4 pytest `1043 passed in 24.94s`; Critic PASS

- ~~Corpus Readiness JSON object loader path redaction~~ — **완료** (2026-05-14)
  - `_load_json_object()` now reports non-object JSON input with a value-free category and no host-local path, complementing existing CLI invalid-input sanitization
  - Verification: RED reproduced secret path leakage; targeted loader test `1 passed`; corpus readiness tests `36 passed`; related Tool Portfolio tests `416 passed`; Full S4 pytest `1040 passed in 25.51s`; Critic PASS

- ~~Tool-set config validator error-surface sanitization~~ — **완료** (2026-05-14)
  - `validate_tool_set_config()` now rejects non-string configs with contractual `ValueError` and emits value-free diagnostics for unknown current tools, WR-gated future configs, and unknown config strings
  - Valid current-six configs and `allow_future=True` future config passthrough remain unchanged
  - Verification: RED reproduced 5 invalid-config echo/type failures; targeted config tests `6 passed`; experiment manifest tests `41 passed`; related Tool Portfolio tests `415 passed`; Full S4 pytest `1039 passed in 25.23s`; Critic PASS

- ~~Decision-cycle forbidden runtime coupling guard error-surface sanitization~~ — **완료** (2026-05-14)
  - The static no-network/no-LLM/no-S5 coupling guard now raises value-free `forbidden runtime coupling detected` diagnostics instead of echoing host-local file paths or raw regex patterns
  - Verification: RED reproduced secret path + regex leakage; targeted guard test `1 passed`; decision-cycle tests `4 passed`; related Tool Portfolio tests `410 passed`; Full S4 pytest `1034 passed in 25.49s`; Critic PASS

- ~~Corpus acquisition local path/error-surface sanitization~~ — **완료** (2026-05-14)
  - Corpus acquisition zip-member, outside-cache deletion, and checksum-mismatch diagnostics are now value-free stable categories; local paths, archive member names, expected checksums, and actual checksums are not echoed
  - Verification: RED reproduced 3 acquisition helper raw-echo failures; targeted acquisition helper tests `3 passed`; corpus acquisition tests `13 passed`; related Tool Portfolio tests `406 passed`; Full S4 pytest `1033 passed in 25.46s`; Critic PASS

- ~~Acquisition manifest duplicate acquisitionId error-surface sanitization~~ — **완료** (2026-05-14)
  - `build_acquisition_index()` no longer echoes duplicate caller-controlled `acquisitionId` values; duplicate diagnostics keep the stable category `duplicate acquisitionId` only
  - Verification: RED reproduced safe-shaped secret duplicate ID leakage; targeted duplicate test `1 passed`; acquisition manifest tests `45 passed`; related Tool Portfolio tests `393 passed`; Full S4 pytest `1030 passed in 25.07s`; Critic PASS

- ~~Experiment report forbidden-key guard error-surface sanitization~~ — **완료** (2026-05-14)
  - Final offline Tool Portfolio report `_reject_forbidden_keys()` now mirrors the corpus-manifest guard: fixed forbidden verdict literals are canonicalized before formatting, arbitrary mapping path components become `<field>`, and only list indices remain in diagnostic paths
  - This closes last-defense error-surface leaks if future generated report fields accidentally reintroduce `safe`/`clean`/`vulnerable`/verdict-like keys under caller-shaped labels or malicious key objects
  - Verification: RED reproduced 3 report guard path/key stringification leaks; targeted guard tests `3 passed`; experiment-report tests `240 passed`; related Tool Portfolio tests `392 passed`; Full S4 pytest `1029 passed in 25.31s`; Critic PASS

- ~~Corpus manifest identity-field error-surface sanitization~~ — **완료** (2026-05-14)
  - Corpus manifest public identifiers now fail closed through a safe-id contract for `caseId`, `expected.targetId`, explicit `lineageId`, and external `acquisitionId` (`[A-Za-z0-9][A-Za-z0-9._:-]{0,255}`; no whitespace/control/surrounding whitespace)
  - Duplicate case IDs, lineage leakage, source-artifact leakage, acquisition lookup misses, and acquisition checksum mismatches now use value-free diagnostics; absent `lineageId` falls back to safe `caseId`, never raw `sourceRef`
  - Verification: RED reproduced 10 identity/leakage failures; targeted identity/error-surface tests `10 passed`; manifest+readiness tests `71 passed`; related Tool Portfolio tests `389 passed`; Full S4 pytest `1026 passed in 24.78s`; Critic PASS

- ~~Corpus manifest forbidden-key error-surface sanitization~~ — **완료** (2026-05-14)
  - Recursive corpus manifest verdict-key rejection no longer appends arbitrary parent mapping keys or stringifies forbidden-key objects in `ValueError` paths
  - Error messages preserve fixed forbidden key literals such as `safe` while replacing parent mapping labels with generic `<field>` components; `str` subclass key spoofing is canonicalized before formatting
  - Verification: RED reproduced 3 forbidden-key path/key stringification leaks; targeted forbidden-key tests `4 passed`; manifest+readiness tests `61 passed`; related Tool Portfolio tests `379 passed`; Full S4 pytest `1016 passed in 25.07s`; Critic PASS after initial BLOCK

- ~~Corpus manifest case checksum strictness~~ — **완료** (2026-05-14)
  - Corpus manifest case `checksum` values now require exact `sha256:<64 lowercase hex>` instead of prefix-only validation, preventing malformed prefix-valid secrets from reaching Corpus Readiness `caseStatuses[].expectedChecksum`
  - Direct readiness builder rejects malformed checksums before case-source projection; readiness CLI emits sanitized invalid JSON (`CORPUS_READINESS_INPUT_INVALID`) without raw checksum echo
  - Verification: RED reproduced 6 malformed-checksum failures; targeted checksum tests `6 passed`; manifest+readiness tests `58 passed`; related Tool Portfolio tests `376 passed`; Full S4 pytest `1013 passed in 25.22s`; Critic PASS

- ~~Corpus Readiness full caller-provided input sanitization~~ — **완료** (2026-05-14)
  - Caller-provided offline `corpusReadinessGate` now uses a strict top-level allowlist, rejects caller-supplied `inputValidation`, validates optional `schemaVersion`/`consumerPolicy`, and field-validates `summary`, `acquisitionStatuses`, `caseStatuses`, generated `requiredCorpusInputValidation`, and `consistencyChecks` without raw value echo
  - Report normalization no longer preserves `{**gate}` raw payloads; it reconstructs only validated fields, preserves generated invalid required-corpus evidence, and keeps normalized inconsistent readiness gates re-ingestable. Harness fixture `sliceCounts` compatibility includes `s4-harness-fixture-positive` and `s4-harness-fixture-negative`
  - Verification: RED reproduced 11 raw-echo/compatibility failures; focused corpus-readiness sanitization tests `13 passed`; experiment-report tests `237 passed`; Full S4 pytest `1007 passed in 25.13s`; Critic PASS

- ~~System Stability Gate full non-pass input sanitization~~ — **완료** (2026-05-14)
  - Caller-provided offline `systemStabilityGate` now rejects unknown top-level fields, invalid `schemaVersion`, invalid top-level `reasonCodes`, invalid non-pass `requiredTools`, and malformed non-pass phase/failure evidence with value-free `SYSTEM_STABILITY_GATE_INPUT_INVALID` diagnostics
  - Accepted non-pass gates may preserve minimal, subset, or generated empty `requiredTools` fail evidence; pass gates still require complete current-six evidence. Version/path failure evidence is redacted to `versionStatus` / `expectedExecutablePathStatus`, and normalized inconsistent gates are re-ingestable
  - Verification: RED reproduced 13 raw-echo/compatibility failures; system-stability/system-gate tests `53 passed`; report+consumer tests `248 passed`; Full S4 pytest `994 passed in 24.87s`; Critic PASS

- ~~Consumer canary guard for `QUALITY_REQUIRED_SPLITS_INVALID`~~ — **완료** (2026-05-14)
  - Added an explicit S4-owned offline report consumer regression proving `QUALITY_REQUIRED_SPLITS_INVALID` is projected as a safe non-decision-grade quality failure reason, not `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`
  - Verification: targeted consumer canary test `1 passed in 0.05s`; report+consumer tests `233 passed in 0.67s`; all Tool Portfolio/evidence tests `417 passed in 1.23s`; Full S4 pytest `979 passed in 25.20s`; Critic PASS

- ~~Dedicated invalid requiredSplits Quality Gate reason~~ — **완료** (2026-05-14)
  - Invalid `thresholds.requiredSplits` entries now fail as threshold configuration invalid with `QUALITY_REQUIRED_SPLITS_INVALID` instead of masquerading as `SPLIT_METRICS_MISSING`
  - Empty/blank-only required splits remain `QUALITY_REQUIRED_SPLITS_NOT_DECLARED`; unknown/non-string/malformed entries skip split scoring entirely, expose sanitized `invalidRequiredSplits={"category":"invalid-entry"}`, keep `splitAssessments`/`passingSplits`/`failingSplits` empty, and retain only sanitized `<invalid>` threshold snapshot entries
  - Verification: RED reproduced 4 invalid requiredSplits pseudo-split failures; targeted tests `6 passed, 203 deselected`; report+consumer tests `232 passed in 0.66s`; focused report/canary/oracle/readiness/actual/manifest tests `307 passed in 0.79s`; all Tool Portfolio/evidence tests `416 passed in 1.26s`; Full S4 pytest `978 passed in 24.76s`; Critic PASS

- ~~Threshold/primaryToolSetConfig/requiredSplits diagnostic sanitization~~ — **완료** (2026-05-14)
  - Offline Tool Portfolio local-quality diagnostics/snapshots no longer echo arbitrary threshold config labels or values: unknown `primaryToolSetConfig` values become `<invalid>`, threshold snapshots emit only allowlisted fields, unknown threshold keys are omitted, invalid threshold values are redacted, and invalid `requiredSplits` entries become `<invalid>` without raw split echo
  - Non-JSON threshold diagnostics preserve only allowlisted top-level field names; unknown top-level and nested mapping keys are sanitized to `<invalid>`. Invalid primary config redaction also applies when system-gate, report-identity, matching-policy, or findings-input failures take precedence
  - Verification: RED reproduced 10 threshold/primary/split leakage paths; targeted tests `10 passed, 197 deselected`; experiment-report tests `207 passed in 0.65s`; focused report/oracle/canary/readiness/actual/manifest tests `305 passed in 0.83s`; all Tool Portfolio/evidence tests `414 passed in 1.23s`; Full S4 pytest `976 passed in 25.52s`; Critic PASS after initial requiredSplits/precedence BLOCK

- ~~MatchingPolicy invalid diagnostic sanitization~~ — **완료** (2026-05-14)
  - Invalid oracle `matchingPolicy` diagnostics no longer echo or stringify arbitrary unknown keys, schemaVersion values, or out-of-range lineWindow values
  - Diagnostics retain category/field/type/expected evidence and valid minimal `{}` policy canonicalization remains unchanged
  - Verification: RED reproduced raw policy key/value echo; targeted matchingPolicy diagnostics `7 passed in 0.07s`; focused report/oracle/canary/readiness/actual/manifest tests `296 passed in 0.77s`; all Tool Portfolio tests `393 passed in 1.10s`; Full S4 pytest `967 passed in 25.22s`; Critic PASS

- ~~Legacy external_corpus_status invalid diagnostic sanitization~~ — **완료** (2026-05-14)
  - Invalid legacy compatibility-context diagnostics no longer echo or stringify arbitrary top-level keys or unknown nested field labels
  - Valid accepted non-readiness-owned legacy context remains preserved in `decisionSupport.externalCorpusStatus`; invalid diagnostics use `<invalid>` plus safe type metadata where relevant
  - Verification: RED reproduced raw legacy key/field echo; targeted legacy diagnostics `7 passed in 0.08s`; focused report/consumer/readiness/actual/manifest/system tests `317 passed in 0.89s`; all Tool Portfolio tests `390 passed in 1.08s`; Full S4 pytest `964 passed in 25.08s`; Critic PASS

- ~~System Stability nested pass-evidence diagnostic sanitization~~ — **완료** (2026-05-14)
  - Caller-provided `requiredTools[]` and `phases.*.status` invalid values no longer echo arbitrary strings or stringify objects in report input-validation diagnostics
  - Unknown tool IDs and invalid phase status strings are redacted as `<invalid>`; non-string values report safe field/type only; generated missing current-six tool diagnostics are preserved
  - Verification: RED reproduced raw tool/phase status echo; targeted nested system diagnostics `7 passed in 0.07s`; focused report/system/readiness/actual/manifest/canary tests `313 passed in 0.75s`; all Tool Portfolio tests `386 passed in 1.13s`; Full S4 pytest `960 passed in 25.08s`; Critic PASS

- ~~Report-side top-level gate status diagnostic sanitization~~ — **완료** (2026-05-14)
  - Caller-provided invalid `systemStabilityGate.status` and `corpusReadinessGate.status` no longer echo arbitrary strings or stringify non-string objects in input-validation diagnostics
  - Invalid nonblank strings report `<invalid>`, blank strings report `<blank>`, and non-string statuses report safe `type` only while preserving fail-closed `*_GATE_INPUT_INVALID` semantics
  - Verification: RED reproduced raw secret/object status echo; targeted status-sanitization tests `6 passed in 0.07s`; focused report/readiness/actual/manifest/canary/system-stability tests `309 passed in 0.74s`; all Tool Portfolio tests `382 passed in 1.10s`; Full S4 pytest `956 passed in 24.97s`; Critic PASS

- ~~Corpus Readiness report-side status/path validation hardening~~ — **완료** (2026-05-14)
  - Caller-provided offline `corpusReadinessGate` payloads now reject raw host path fields, non-allowlisted status values, missing available path proof, contradictory available+unsafe status, unsafe `caseStatuses[].sourcePath`, and extra-acquisition raw path bypasses before report emission
  - Available gates must prove `localPathStatus="available"`, `resolvedLocalPathStatus="available"`, and `resolvedPathStatus="available"`; minimal blocked/not_run evidence remains accepted when it does not leak raw paths or invalid status values
  - Verification: RED reproduced accept/leak bypasses; targeted status/path tests `6 passed in 0.07s`; focused readiness/report/actual/manifest/canary tests `271 passed in 0.76s`; all Tool Portfolio tests `378 passed in 1.04s`; Full S4 pytest `952 passed in 25.03s`; Critic PASS after BLOCKER fixes

- ~~Corpus Readiness status-field enum contract hardening~~ — **완료** (2026-05-14)
  - Exported and freeze-tested machine-facing readiness status vocabularies: `localPathStatus`, `resolvedLocalPathStatus`, `resolvedPathStatus`, and `sourcePathStatus`
  - Representative gates now assert every emitted status is allowlisted across available, missing acquisition, base-required, outside-base, missing local path, missing case, checksum mismatch, and unsafe sourcePath cases; raw host-local path fields remain absent
  - Verification: RED reproduced missing exported constants; targeted enum tests `2 passed in 0.07s`; focused readiness/actual/manifest/report/canary tests `265 passed in 0.68s`; all Tool Portfolio tests `372 passed in 1.04s`; Full S4 pytest `946 passed in 25.40s`; Critic PASS

- ~~Corpus Readiness missing-acquisition path-status consistency~~ — **완료** (2026-05-14)
  - Missing acquisition status entries now expose `localPathStatus="not_declared"` and `resolvedLocalPathStatus="not_resolved"` like other sanitized acquisition status entries
  - No reason-code/status behavior changed; canonical harness fixture regenerated and drift-guarded after the additive contract shape change
  - Verification: RED reproduced missing status fields; targeted missing-acquisition + harness drift tests `2 passed in 0.05s`; focused readiness/actual/manifest/report/canary tests `263 passed in 0.69s`; all Tool Portfolio tests `370 passed in 1.04s`; Full S4 pytest `944 passed in 25.36s`; Critic PASS

- ~~Corpus Readiness local filesystem path redaction~~ — **완료** (2026-05-14)
  - Readiness artifacts no longer expose host-local `caseStatuses[].resolvedPath` or `acquisitionStatuses[*].localPath`/`resolvedLocalPath`
  - Machine evidence is preserved through `resolvedPathStatus`, `localPathStatus`, `resolvedLocalPathStatus`, safe relative `sourcePath`, checksums, manifest checksum, counts, splits, and reason codes
  - Verification: RED reproduced secret-bearing root leakage; targeted missing/checksum/available/actual-runner tests `4 passed in 0.05s`; focused readiness/actual/manifest/report/canary tests `263 passed in 0.68s`; all Tool Portfolio tests `370 passed in 1.04s`; Full S4 pytest `944 passed in 25.05s`; Critic PASS

- ~~Corpus Readiness CLI output-write fallback~~ — **완료** (2026-05-14)
  - Offline readiness CLI no longer double-faults when `--output` points to an unwritable path such as a directory
  - Output write failures return exit `1` and emit sanitized invalid JSON to stdout with `CORPUS_READINESS_OUTPUT_WRITE_FAILED`, fixed `error="output write failed"`, and safe `errorClass`
  - Verification: RED reproduced `IsADirectoryError` escape; targeted CLI tests `4 passed in 0.04s`; focused readiness/manifest/report/actual/canary tests `263 passed in 0.65s`; all Tool Portfolio tests `370 passed in 1.02s`; Full S4 pytest `944 passed in 25.54s`; Critic PASS

- ~~Corpus Readiness CLI invalid-error sanitization~~ — **완료** (2026-05-14)
  - Offline readiness CLI invalid-output JSON no longer emits raw `str(exc)` that may include caller-controlled manifest paths
  - Invalid output keeps deterministic `CORPUS_READINESS_INPUT_INVALID`, fixed `error="input validation failed"`, and safe `errorClass` only
  - Verification: RED reproduced secret-bearing manifest path leakage; targeted CLI tests `3 passed in 0.04s`; focused readiness/manifest/report/actual/canary tests `262 passed in 0.68s`; all Tool Portfolio tests `369 passed in 1.03s`; Full S4 pytest `943 passed in 25.44s`; Critic PASS

- ~~Corpus Readiness unsafe `sourcePath` redaction~~ — **완료** (2026-05-14)
  - Unsafe readiness case statuses no longer echo raw absolute/traversal/Windows/UNC source paths in blocked JSON
  - Unsafe statuses preserve stable machine identity with `sourcePath="<unsafe>"`, `sourcePathStatus="unsafe"`, `caseId`, `acquisitionId`, and `CORPUS_CASE_SOURCE_PATH_UNSAFE`; safe relative missing/checksum paths remain visible
  - Verification: RED reproduced secret-bearing unsafe path leakage; targeted redaction/backslash/missing tests `12 passed in 0.06s`; focused readiness/manifest/report/actual/canary tests `261 passed in 0.66s`; all Tool Portfolio tests `368 passed in 1.02s`; Full S4 pytest `942 passed in 25.40s`; Critic PASS

- ~~Actual runner relative acquisition `localPath` fail-closed hardening~~ — **완료** (2026-05-14)
  - Direct `stage_case_only_corpus()` no longer resolves relative acquisition `localPath` against process cwd; it now requires explicit base-path support for relative corpus roots
  - `build_actual_tool_portfolio_report()` preserves user-facing readiness semantics: relative `localPath` without base returns blocked report/no scan with `LOCAL_CORPUS_BASE_PATH_REQUIRED`
  - Verification: RED reproduced cwd-dependent direct staging; targeted tests `3 passed in 0.04s`; focused actual/readiness/manifest/report tests `232 passed in 0.65s`; all Tool Portfolio tests `362 passed in 1.05s`; Full S4 pytest `936 passed in 25.15s`; Critic PASS

- ~~Corpus manifest `sourcePath` safety validation~~ — **완료** (2026-05-14)
  - Strict Tool Portfolio manifest/report paths now reject blank, surrounding-whitespace, POSIX absolute, Windows drive/UNC absolute after backslash-to-slash normalization, and slash/backslash `..` traversal `sourcePath` values before scoring
  - Corpus Readiness intentionally preserves deterministic blocked JSON for the same unsafe paths via `CORPUS_CASE_SOURCE_PATH_UNSAFE`, including literal backslash filenames that exist and checksum-match on Linux
  - Verification: RED reproduced unsafe/blank sourcePath acceptance; targeted sourcePath tests `16 passed in 0.07s`; focused manifest/report/readiness/canary/actual tests `253 passed in 0.70s`; all Tool Portfolio tests `360 passed in 1.14s`; Full S4 pytest `934 passed in 24.78s`; Critic re-review PASS

- ~~Tool Portfolio mapping finding payload validation/canonicalization~~ — **완료** (2026-05-14)
  - Added semantic validation for mapping findings in required current-six `findings_by_config` before oracle scoring
  - Valid mappings with top-level `file`/`line` are canonicalized into `location.file`/`location.line`; CWE matching still requires metadata evidence and does not infer CWE from `rule_id`
  - Malformed rule/location/file/line/metadata/dataFlow payloads now fail closed through `FINDINGS_BY_CONFIG_INPUT_INVALID` without raw secret/value echo
  - Critic twice blocked the initial plan until top-level split-filter compatibility and metadata-backed CWE evidence were explicit; final plan and implementation PASS
  - Verification: RED reproduced oracle matcher crash; targeted tests `6 passed in 0.07s`; report+canary+actual tests `210 passed in 0.63s`; all Tool Portfolio tests `344 passed in 1.08s`; Full S4 pytest `918 passed in 25.16s`; Critic PASS

- ~~Tool Portfolio finding tool identity/config membership validation~~ — **완료** (2026-05-14)
  - Hardened `_normalize_findings_by_config()` so required current-six findings must use exact current-six tool IDs before scoring
  - `single-tool:<tool>` now rejects other-tool findings; `leave-one-out:<tool>` rejects the excluded tool; unknown/missing/non-string/blank tool IDs fail closed without raw unknown tool echo
  - Preserves mapping compatibility for both `toolId` and `tool_id` plus `SastFinding.tool_id`
  - Verification: RED reproduced unknown tool scoring fail-open; targeted tests `5 passed in 0.06s`; report+canary+actual tests `204 passed in 0.60s`; all Tool Portfolio tests `338 passed in 1.01s`; Full S4 pytest `912 passed in 25.01s`; Critic PASS

- ~~Tool Portfolio `byCweTool` diagnostic matrix~~ — **완료** (2026-05-14)
  - Added score-row-scoped `qualityDiagnostics.splitDiagnostics[*].byCweTool` to decompose expected CWE × concrete tool × match-class rows without claiming per-tool recall/FN/raw-pressure
  - Critic BLOCK caught the initial overclaim risk around best-per-target rows; final semantics keep cppcheck-style raw pressure in `byTool` and portfolio misses in `byCwe`, not in `byCweTool`
  - Regenerated canonical `s4-harness-fixture-report-v1.json` after snapshot RED reproduced drift
  - Verification: targeted matrix tests `3 passed in 0.07s`; report+canary+actual tests `199 passed in 0.64s`; all Tool Portfolio tests `333 passed in 1.00s`; Full S4 pytest `907 passed in 25.07s`; Critic PASS

- ~~Tool Portfolio diagnostic identifier fail-closed canary~~ — **완료** (2026-05-14)
  - Hardened offline `benchmark/tool_portfolio_report_consumer_canary.py` so malformed/unknown projected diagnostic identifiers are sanitized and also mark the summary unsafe
  - Scope is intentionally limited to fields the summary projects: `qualityDiagnostics.splitDiagnostics.*.diagnosticTriage.candidates[].candidateId` and `toolContributionDiagnostics.tools[].toolId/evidenceClass`
  - RED reproduced silent-drop decision-grade bug; summary schema/key set remains unchanged; production `/v1/scan`, S3, and S5 are unchanged
  - Verification: canary tests `23 passed in 0.05s`; report+actual tests `198 passed in 0.60s`; all Tool Portfolio tests `332 passed in 1.01s`; Full S4 pytest `906 passed in 25.01s`; Critic PASS

- ~~Stale consumer-summary artifact guard~~ — **완료** (2026-05-14)
  - Added a symmetric S4-owned test guard for `s4-tool-portfolio-report-consumer-summary-v1` artifacts under `benchmark/results/tool_portfolio/*.json`
  - Only canonical `s4-harness-fixture-consumer-summary-v1.json` may carry the summary schema, and it must exact-match `summarize_tool_portfolio_report(canonical_report)` as parsed JSON
  - Synthetic offender test covers clean canonical summary, extra stale summary artifact, and drifted canonical summary; real repo guard ensures no extra committed summary-schema artifacts silently become S3-facing evidence
  - Verification: canary tests `22 passed in 0.07s`; report+actual tests `197 passed in 0.57s`; all Tool Portfolio tests `331 passed in 1.02s`; Full S4 pytest `905 passed in 25.98s`; Critic PASS

- ~~Tool Portfolio report consumer canary + CLI smoke gate~~ — **완료** (2026-05-13)
  - Added `benchmark/tool_portfolio_report_consumer_canary.py`, a pure JSON offline report consumer canary and module CLI smoke gate for `s4-tool-portfolio-experiment-report-v1`; production `/v1/scan`, S3/S5 code, and report schema remain unchanged
  - `toolPortfolioDecisionGradeUsable` is intentionally narrow: system stability pass + `qualityGateAllowed=true` + corpus readiness available/decision-grade + local/final quality pass + threshold profile `quality-sufficiency`/`decision_grade_candidate` + no unsafe projection
  - Critic BLOCK #1 fixed reasonCodes/requiredFollowUps forbidden-value leakage; Critic BLOCK #2 fixed status/intent/diagnostic-surface scalar leakage; CLI smoke uses exit `0` valid-summary pass, `2` emitted summary with `reportPresent=false` or required decision-grade failure, and `1` no summary emitted; emitted summaries carry `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"` and exact top-level keys; committed sample `s4-harness-fixture-consumer-summary-v1.json` is parsed-dict locked to canonical report summarizer output
  - Verification: RED failures reproduced including parsed-invalid default exit `0`, missing summary schema version, missing committed summary artifact, and stale-guard misclassification; canary tests `20 passed in 0.05s`; report+actual tests `195 passed in 0.61s`; all Tool Portfolio tests `329 passed in 1.05s`; Full S4 pytest `903 passed in 25.39s`; Critic PASS

- ~~Stale experiment-report artifact removal guard~~ — **완료** (2026-05-13)
  - Removed stale tracked same-schema artifact `benchmark/results/tool_portfolio/s4-harness-fixture-20260512T042442Z.json` because it lacked current diagnostics/gate shape and could be accidentally consumed by globbing
  - Added top-level schema guard: under `benchmark/results/tool_portfolio/`, only canonical `s4-harness-fixture-report-v1.json` may use `s4-tool-portfolio-experiment-report-v1`; operational battery schemas are skipped
  - Verification: RED offender reproduced; focused canonical artifact tests `3 passed in 0.06s`; report+actual tests `175 passed in 0.57s`; all Tool Portfolio tests `309 passed in 0.98s`; Full S4 pytest `883 passed in 25.42s`; Critic PASS

- ~~Harness report snapshot drift guard~~ — **완료** (2026-05-13)
  - Added exact committed-vs-generated equality test for `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json` to prevent S3-facing offline report artifact drift
  - Regenerated committed harness report so it now includes `qualityDiagnostics` and `toolContributionDiagnostics` from the deterministic builder
  - Added readable contract assertions for generated + committed artifacts: diagnostics available, stable ALL_TOOLS contribution rows, final quality `not_decision_grade`
  - Verification: RED 2 failures reproduced stale artifact drift; focused snapshot tests `2 passed in 0.06s`; report+actual tests `174 passed in 0.63s`; all Tool Portfolio tests `308 passed in 0.99s`; Full S4 pytest `882 passed in 25.76s`; Critic PASS

- ~~Actual runner staged localPath canonicalization~~ — **완료** (2026-05-13)
  - Fixed relative CLI `--work-dir` causing staged acquisition `localPath` values to remain relative and false-block staged `corpusReadinessGate` with `LOCAL_CORPUS_BASE_PATH_REQUIRED`
  - Staging now emits absolute resolved staged `localPath` values while preserving `_reset_stage_root` lexical delete safety
  - Actual `report-after-stage-path-fix.json`: readiness `available`, system `pass`, final quality `not_decision_grade`, absolute staged localPaths, toolContributionDiagnostics `available`
  - Verification: RED 2 failures reproduced; actual-runner tests `11 passed in 0.08s`; report+actual tests `173 passed in 0.60s`; all Tool Portfolio tests `307 passed in 1.01s`; Full S4 pytest `881 passed in 26.24s`; Critic PASS

- ~~Tool Contribution Diagnostics v1~~ — **완료** (2026-05-13)
  - Added additive offline-only `toolContributionDiagnostics` to `s4-tool-portfolio-experiment-report-v1`; production `/v1/scan`, S3/S5, and gate decisions remain unchanged
  - Rows are stable current-six `ALL_TOOLS` order and classify deterministic evidence classes: `unique-positive-contributor`, `overlap-only-positive-contributor`, `noise-only-or-no-positive-contribution`, `no-observed-signal`
  - Critic BLOCK resolved comparative-config completeness and metric-scope ambiguity; actual-run comparative degradation now makes contribution diagnostics `not_run` rather than fake zero-signal rows
  - Actual `report-after-tool-contribution.json`: readiness `available`, system `pass`, final quality `not_decision_grade`, toolContributionDiagnostics `available` with six rows
  - Verification: contribution tests `7 passed in 0.23s`; report+actual tests `171 passed in 0.60s`; all Tool Portfolio tests `305 passed in 1.02s`; Full S4 pytest `879 passed in 25.73s`; Critic PASS

- ~~Diagnostic Triage candidate lanes~~ — **완료** (2026-05-13)
  - Added deterministic `diagnosticTriage` candidates under offline `qualityDiagnostics.splitDiagnostics[*]`; production `/v1/scan`, gate decisions, S3/S5 remain unchanged
  - Candidate lanes are not root-cause/verdict claims: `matching-policy-review`, `cwe-normalization-review`, `negative-discrimination-review`, `recall-gap-investigation`, `noise-pressure-review`
  - Critic BLOCK resolved raw-pressure/noise-trigger ambiguity and overclaiming names; final implementation uses neutral categories, FN-only recall trigger, oracle-FP-only noise trigger, and per-CWE triageReasonCodes derived from per-CWE counts only
  - Actual `report-after-triage.json`: validation/test both emit all five candidate lanes while final `qualityGate.status` remains `not_decision_grade`
  - Verification: triage tests `6 passed in 0.18s`; report+actual tests `164 passed in 0.55s`; all Tool Portfolio tests `298 passed in 0.96s`; Full S4 pytest `872 passed in 26.36s`; Critic PASS


- ~~Quality Diagnostics v1 for Tool Portfolio reports~~ — **완료** (2026-05-13)
  - Added additive offline-only `qualityDiagnostics` to `s4-tool-portfolio-experiment-report-v1` without changing production `/v1/scan` or gate decisions
  - Diagnostics separate units: target score-row outcomes, unique raw finding pressure, weak/wrong-CWE attempt counters, expected-CWE buckets, by-tool raw pressure, and deterministic hints
  - Critic initially BLOCKed ambiguous count units; revised plan passed, and RED tests fixed diagnostic/gate separation, duplicate key dedupe, allowed negative warning semantics, wrong-CWE expected-CWE bucketing, and blocked/not-run omission
  - Actual `report-after-diagnostics.json`: validation pressure `uniqueRaw=226`, `tp=5`, `oracleFP=221`; test pressure `uniqueRaw=311`, `tp=4`, `oracleFP=307`; final quality remains `not_decision_grade`
  - Verification: report+actual tests `160 passed in 0.53s`; all Tool Portfolio tests `294 passed in 0.94s`; Full S4 pytest `868 passed in 26.05s`; Critic PASS


- ~~Low-threshold threshold-profile decision-grade separation~~ — **완료** (2026-05-13)
  - Added report-side `qualityGate.localQualityAssessment.thresholdProfile` to classify threshold intent without LLMs or S3/S5 coupling
  - Non-discriminating profiles (`minimumTargetRecall<=0`, `minimumFindingPrecision<=0`, `maximumNegativeTargetFpr>=1`) now produce final `qualityGate.status="not_decision_grade"` with `QUALITY_THRESHOLDS_NON_DISCRIMINATING`, even when split scoring succeeds
  - Critic BLOCK uncovered low-threshold/no-finding misclassification through `findingPrecision=null`; RED test added and fixed so runner-integrity profiles remain not-decision-grade while discriminating thresholds still fail missing metrics
  - Verification: report+actual tests `153 passed in 0.48s`; all Tool Portfolio tests `287 passed in 0.94s`; Full S4 pytest `861 passed in 26.30s`; actual CLI emitted `report-after-threshold-profile.json` with readiness available, system pass, final quality not-decision-grade; Critic re-review PASS


- ~~Actual Juliet/SARD low-threshold runner-integrity run~~ — **완료** (2026-05-13)
  - Ran `benchmark.tool_portfolio_actual_runner` against the local 80-case Juliet/SARD cache under `.omx/corpora/s4-tool-portfolio/actual-runs/20260513-low-threshold/`
  - Initial stale `report.json` correctly showed blocked system stability because Flawfinder crashed on malformed numeric CSV fields and the Juliet profile used a fake `sdkId`
  - Added RED tests and fixed actual-run profile to use `sdkResolutionMode=none` with explicit include paths; hardened Flawfinder CSV parser for blank/non-numeric `Line`/`Column`/`Level`
  - Final post-profile artifact `report-after-threshold-profile.json`: `corpusReadinessGate=available`, `systemStabilityGate=pass`, final `qualityGate=not_decision_grade`, `thresholdProfile.intent="runner-integrity-only"`, `QUALITY_THRESHOLDS_NON_DISCRIMINATING`, all 15 configs present, staged localPaths under `actual-runs/.../staged-cases`, no extracted-cache metric path leakage
  - This is runner-integrity evidence only, not current-six quality sufficiency; actual metrics remain low (`validation recall=0.25 precision=0.0221`, `test recall=0.2 precision=0.0129`)
  - Original profile/parser fix verification: targeted runner/flawfinder/sdk tests `23 passed in 3.27s`; all Tool Portfolio tests `284 passed in 0.91s`; Full S4 pytest `858 passed in 26.42s`; Critic PASS
  - Threshold-profile hardening verification: report+actual tests `153 passed in 0.48s`; all Tool Portfolio tests `287 passed in 0.94s`; Full S4 pytest `861 passed in 26.30s`; Critic BLOCK then re-review PASS


- ~~Actual Tool Portfolio runner implementation~~ — **완료** (2026-05-13)
  - Added `benchmark/tool_portfolio_actual_runner.py` for offline actual current-six Tool Portfolio runs over pinned local corpus/acquisition manifests
  - Builds deterministic case-only staging roots so semgrep/cppcheck/flawfinder scan only manifest source files, not full extracted Juliet/SARD caches
  - Emits all 15 `required_current_six_configs()` keys; parser-only/contract-canary are present as empty no-scanner configs in actual Juliet/SARD mode
  - Top-level `systemStabilityGate` uses only full-current-six executions; single-tool/leave-one-out requested-tool completeness is separate and intentional subset skips do not poison current-six stability
  - CLI supports `--base-path` for relative acquisition `localPath`; staged acquisition manifests repin checksums and relative Juliet `C/testcasesupport` include profile resolution uses the explicit base
  - RED missing-module failure reproduced; actual-run tests `7 passed in 0.07s`; focused actual/readiness/report/manifest/system suite `211 passed in 0.54s`; all Tool Portfolio tests `284 passed in 0.90s`; Full S4 pytest `856 passed in 26.15s`; Critic re-review PASS


- ~~Corpus Readiness required_corpora ID/projection sanitization hardening~~ — **완료** (2026-05-13)
  - `required_corpora` IDs are strict strings with no surrounding whitespace/control characters; invalid/non-string IDs fail closed as `CORPUS_REQUIRED_CORPUS_ID_INVALID` without raw echo
  - Safe unknown required corpora are preserved as future corpus IDs but project under generic `external` with `LOCAL_EXTERNAL_*` reason codes instead of raw external status keys
  - Caller-provided readiness `externalCorpusStatus` is sanitized to canonical keys (`juliet`, `sard`, `external`, `requiredCorpusReadiness`), allowed nested fields, validated acquisition IDs, and allowlisted readiness reason codes
  - RED regressions reproduced raw ID leakage, safe-shaped status key leakage, nested attacker field leakage, and safe-shaped reason-code leakage; readiness/report tests `161 passed in 0.54s`; focused acquisition/corpus/readiness/report/manifest suite `224 passed in 0.83s`; tool-portfolio focused suite `277 passed in 0.87s`; Full S4 pytest `849 passed in 26.24s`; Critic re-review PASS

- ~~Corpus Readiness relative localPath containment hardening~~ — **완료** (2026-05-13)
  - explicit `base_path`가 주어진 relative acquisition `localPath`는 resolved path가 base 내부에 있어야 함
  - `../` traversal과 symlink escape는 `LOCAL_CORPUS_PATH_OUTSIDE_BASE`로 acquisition-level blocked 처리하고 case source checks까지 진행하지 않음
  - existing outside-base path라도 false `LOCAL_CORPUS_PATH_NOT_FOUND`를 추가하지 않으며, absolute localPath는 실제 `.omx` corpus compatibility를 위해 유지
  - RED: 2 failed reproduced; readiness tests `14 passed in 0.05s`; focused acquisition/corpus/readiness/manifest/report suite `215 passed in 0.82s`; tool-portfolio focused suite `268 passed in 0.83s`; Full S4 pytest `840 passed in 26.26s`; Critic review PASS

- ~~Acquisition manifest error-surface sanitation and URL authority strictness~~ — **완료** (2026-05-13)
  - safe unknown field labels such as `unexpected` remain visible, but unsafe/control/newline field keys are reported as `<unsafe>` on validation and checksum paths
  - http/https authority validation now rejects hostless, port-only, query/fragment-bearing, and userinfo-bearing authorities without echoing raw URL values
  - `local://` fixture and `file://` local archive compatibility preserved
  - RED: 10 failed initially; Critic BLOCK added `https://user@` and `https://user@:443/path` regressions; acquisition/corpus/experiment/report tests `201 passed in 0.76s`; tool-portfolio focused suite `265 passed in 0.83s`; Full S4 pytest `837 passed in 25.77s`; Critic re-review PASS

- ~~Acquisition provenance semantic validation hardening~~ — **완료** (2026-05-13)
  - `downloadedAt`는 exact `YYYY-MM-DD` 또는 `YYYY-MM-DDTHH:MM:SSZ`만 허용하고 real calendar parsing으로 impossible date를 거부
  - `sourceUrl`은 existing harness compatibility 때문에 `http`/`https`/`file`/`local` schemes를 허용하되 malformed host/path/reference를 fail-closed; `sourcePageUrl`은 `http`/`https`만 허용
  - URL/timestamp validation errors는 raw value/repr를 echo하지 않음
  - metadata-only `sourcePageUrl`/`licenseOrRedistributionNote` 변경은 archive/extraction bytes가 stable하면 재추출 없이 manifest만 re-pin하고 original `downloadedAt`을 보존
  - RED: 14 failed reproduced; Acquisition/corpus tests: `41 passed in 0.36s`; acquisition/corpus/experiment/report tests: `188 passed in 0.79s`; tool-portfolio focused suite: `252 passed in 0.83s`; Full S4 pytest: `824 passed in 26.10s`; Critic implementation review PASS

- ~~Acquisition manifest strict schema/checksum hardening~~ — **완료** (2026-05-13)
  - acquisition manifest는 required fields와 known optional fields(`sourcePageUrl`, `expectedArchiveChecksum`)만 허용하며 unknown field는 checksum JSON serialization 전에 fail-closed
  - exported `manifest_checksum()`와 `validate_acquisition_manifest()`가 같은 canonicalizer를 사용하므로 optional provenance fields가 deterministic checksum에 포함됨
  - non-string/unknown/non-JSON field value는 raw repr/secret leakage 없이 sanitized `ValueError`로 차단
  - Critic BLOCK으로 발견된 trusted-cache mismatch(`expectedArchiveChecksum` sha256 prefix 비교)를 regression test로 고정하고 수정
  - Acquisition/corpus/experiment manifest tests: `28 passed in 0.25s`; tool-portfolio focused suite: `230 passed in 0.71s`; Full S4 pytest: `802 passed in 24.62s`; Critic re-review PASS

- ~~Decision-cycle threshold JSON-serializability hardening~~ — **완료** (2026-05-13)
  - raw `thresholds`가 local quality validation 전에 `checksum_json`에서 TypeError로 crash되는 경로 차단
  - invalid object/set payload는 deterministic sanitized checksum surrogate를 사용하고 `QUALITY_THRESHOLDS_INPUT_INVALID`로 fail-closed
  - Critic amendment 반영: invalid thresholds만으로 split metric scoring은 suppress하지 않고, nonfinite/range/non-numeric threshold value는 기존 `QUALITY_THRESHOLD_VALUE_INVALID` 경로 유지
  - Targeted non-json threshold tests: `3 passed in 0.06s`; Threshold focused tests: `12 passed in 0.08s`; Experiment-report tests: `138 passed in 0.41s`; report/corpus/system focused tests: `183 passed in 0.44s`; tool-portfolio focused suite: `212 passed in 0.64s`; Full S4 pytest: `796 passed in 24.89s`; Critic implementation review PASS

- ~~Report identity/provenance validation hardening~~ — **완료** (2026-05-13)
  - offline Tool Portfolio `runId`/`createdAt`/`phase`를 decision-cycle 생성 전에 strict validation
  - invalid identity는 safe placeholders(`invalid-run-id`, `invalid-created-at`, phase `validation`)와 sanitized `reportIdentityValidation`으로 fail-closed하며 oracle scoring을 suppress
  - invalid phase `ValueError` crash와 raw identity leakage를 차단; Critic BLOCK으로 발견된 `$` anchor trailing-newline bypass는 `\Z` anchor regression test로 수정
  - Targeted identity tests: `12 passed in 0.07s`; Experiment-report tests: `135 passed in 0.39s`; report/corpus/system focused tests: `180 passed in 0.44s`; tool-portfolio focused suite: `209 passed in 0.63s`; Full S4 pytest: `793 passed in 25.10s`; Critic re-review PASS

- ~~legacy external_corpus_status context sanitation hardening~~ — **완료** (2026-05-13)
  - legacy `external_corpus_status`는 compatibility context로만 허용하고 final gate/follow-up authority는 readiness-derived projection에 고정
  - reserved `requiredCorpusReadiness`, readiness-owned keys, forbidden verdict vocabulary, malformed reasonCodes/acquisitionIds, invalid statuses는 omitted + sanitized `legacyExternalCorpusStatusInputValidation`으로 기록
  - Critic first review BLOCK: reserved key가 readiness-owned일 때 failure 없이 skip되고 invalid status raw value가 echo되는 문제를 regression tests로 재현 후 수정
  - Targeted legacy-context tests: `7 passed in 0.07s`; Experiment-report tests: `123 passed in 0.40s`; report/corpus/system focused tests: `168 passed in 0.44s`; tool-portfolio focused suite: `197 passed in 0.61s`; Full S4 pytest: `781 passed in 25.68s`; Critic re-review PASS

- ~~Oracle matchingPolicy semantic validation hardening~~ — **완료** (2026-05-13)
  - offline Tool Portfolio report의 `matchingPolicy` semantic fields를 strict canonical v1 contract로 고정
  - wrong schema/unknown key/bool·non-int·out-of-range `lineWindowDefault`/non-bool `functionFallbackDefault`가 oracle scoring을 바꾸지 못하고 `ORACLE_MATCHING_POLICY_INPUT_INVALID`로 fail-closed
  - optional 누락은 canonical default(`lineWindowDefault=5`, `functionFallbackDefault=false`)로 정규화하여 기존 minimal payload compatibility 유지
  - Matching-policy focused tests: `13 passed in 0.07s`; Experiment-report tests: `117 passed in 0.36s`; report/corpus/system focused tests: `162 passed in 0.39s`; tool-portfolio focused suite: `191 passed in 0.59s`; Full S4 pytest: `775 passed in 25.41s`; Critic implementation review PASS

- ~~legacy external_corpus_status authority separation~~ — **완료** (2026-05-13)
  - offline Tool Portfolio report에서 legacy `external_corpus_status`는 `decisionSupport.externalCorpusStatus` compatibility context로만 유지
  - final `qualityGate`와 `decisionSupport.requiredFollowUps`는 readiness-derived projection만 소비하므로, available `corpusReadinessGate`를 unrelated legacy blocked status가 overblock하지 못함
  - inverse path도 유지: blocked/not_run readiness는 legacy available status가 있어도 `requiredCorpusReadiness`로 not-decision-grade 유지
  - Experiment-report tests: `108 passed in 0.33s`; report/corpus/system focused tests: `153 passed in 0.37s`; tool-portfolio focused suite: `181 passed in 0.41s`; Full S4 pytest: `766 passed in 25.52s`; Critic implementation review PASS

- ~~Corpus Readiness Gate payload/proof validation hardening~~ — **완료** (2026-05-13)
  - explicit non-mapping/empty/invalid `corpusReadinessGate` payload를 silent default/crash 없이 `CORPUS_READINESS_GATE_INPUT_INVALID`로 fail-closed
  - forged `status="available"` gate는 non-empty `requiredCorpora`, matching available `acquisitionStatuses`, required-corpus-bound non-empty `caseStatuses`, checked count / validation-test split proof, and required-corpus-bound `externalCorpusStatus.acquisitionIds` projection을 모두 증명해야 함
  - blocked/not_run minimal evidence는 보존하되 top-level readiness blocker를 항상 `requiredCorpusReadiness`로 projection하여 embedded/legacy external status가 blocker를 숨기지 못하게 함
  - available+reasonCodes는 `CORPUS_READINESS_GATE_INCONSISTENT`; malformed/blank/non-empty nested reason codes and malformed/wrong acquisitionIds are input-invalid
  - Critic blocker loops fixed: non-available projection suppression, available reasonCodes bypass, unrelated case evidence, malformed external reasonCodes, explicit wrong acquisitionIds, and multi-corpus projection overvalidation
  - Experiment-report tests: `107 passed in 0.33s`; report/corpus/system focused tests: `152 passed in 0.37s`; tool-portfolio focused suite: `180 passed in 0.42s`; Full S4 pytest: `765 passed in 25.63s`; Critic final re-review PASS

- ~~System Stability Gate payload/nested phase validation hardening~~ — **완료** (2026-05-13)
  - caller-provided non-mapping `systemStabilityGate` payload를 `SYSTEM_STABILITY_GATE_INPUT_INVALID`로 fail-closed
  - `status="pass"` gate는 current-six `requiredTools` 완전성 및 `phases.preflight`/`phases.executionCompleteness`의 nested pass evidence(`status="pass"`, empty `failures`)를 증명해야 함
  - minimal `fail`/`not_run` evidence는 input-invalid로 덮어쓰지 않고 보존하며, non-pass `qualityGateAllowed=true` 모순은 malformed phases가 있어도 `SYSTEM_STABILITY_GATE_INCONSISTENT`로 fail/blocked 정규화
  - RED regressions: malformed pass-phase fail-open 5건, malformed inconsistent non-pass crash 2건 재현 후 수정
  - Experiment-report tests: `73 passed in 0.25s`; report/corpus/system focused tests: `118 passed in 0.29s`; tool-portfolio focused suite: `146 passed in 0.30s`; Full S4 pytest: `731 passed in 26.11s`; Critic final re-review PASS

- ~~Corpus acquisition provenance/split-leakage/reproducibility hardening~~ — **완료** (2026-05-13)
  - existing extraction cache는 prior acquisition manifest가 verified archive checksum, recomputed extraction-tree checksum, expected source metadata, local path와 일치할 때만 trusted reuse
  - tampered/partial cache는 silent re-pinning하지 않고 verified archive에서 clean re-extract되어 case checksum이 원본으로 복구됨
  - single SARD candidate는 validation/test 양쪽에 복제하지 않고 readiness가 `CORPUS_REQUIRED_SPLITS_MISSING`으로 blocked되도록 정렬
  - corpus manifest `createdAt`은 현재 wall-clock이 아니라 pinned acquisition manifest `downloadedAt` 날짜에서 파생되어 trusted cache 재실행 시 decision-cycle checksum drift를 만들지 않음
  - corpus manifest validator는 lineage ID가 달라도 동일 acquisition/sourceRef/checksum external artifact가 validation/test에 동시에 있으면 `source artifact leakage`로 거부
  - Acquisition/manifest/readiness tests: `27 passed in 0.21s`; tool-portfolio focused suite: `123 passed in 0.41s`; Full S4 pytest: `704 passed in 24.79s`

- ~~Juliet/SARD Corpus Acquisition CLI + actual local cache verification~~ — **완료** (2026-05-13)
  - `benchmark/tool_portfolio_corpus_acquisition.py` 추가: NIST Juliet C/C++ 1.3, SARD C analyzer v2 vulnerable, SARD C analyzer v2 secure archive를 다운로드하고 official SHA-256을 검증
  - archives/extractions/manifests는 ignored `.omx/corpora/s4-tool-portfolio/` 아래에 배치하여 repo에 대용량 corpus를 커밋하지 않음
  - 생성 artifact: `manifests/acquisitions/{juliet-c-cpp-1.3,sard-c-v2-vulnerable,sard-c-v2-secure}.json`, `manifests/corpus/juliet-sard-focused-v1.json`, `readiness/juliet-sard-focused-readiness-v1.json`
  - 실제 cache readiness: `status="available"`, `decisionGradeReady=true`, `checkedCaseCount=80`, validation/test 각 40, Juliet 48 cases + SARD 32 cases
  - SARD vulnerable/secure 두 acquisition은 `externalCorpusStatus.sard.acquisitionIds[]`로 aggregate되어 한쪽 blocker가 다른쪽 available에 덮이지 않음
  - Acquisition/readiness tests: `15 passed in 0.10s`; tool-portfolio focused suite: `92 passed in 0.27s`; Full S4 pytest: `683 passed in 25.39s`

- ~~Corpus Readiness Gate v1~~ — **완료** (2026-05-13)
  - `benchmark/tool_portfolio_corpus_readiness.py` 추가: required external corpora, acquisition `localPath`, safe `sourcePath`, per-case file existence/checksum, validation/test split presence를 로컬 파일시스템 기준으로 검증
  - `python -m benchmark.tool_portfolio_corpus_readiness` CLI 추가: manifest/base-path/required-corpus 입력으로 deterministic JSON preflight 출력, exit `0` available / `2` blocked / `1` invalid
  - required corpus 미선언은 `CORPUS_REQUIRED_CORPORA_NOT_DECLARED`로 fail-closed
  - `benchmark/tool_portfolio_experiment_report.py`가 `corpusReadinessGate`를 top-level로 포함하고, legacy `decisionSupport.externalCorpusStatus`는 readiness gate에서 파생
  - report composition에서 readiness projection과 legacy `external_corpus_status`를 merge하되 readiness가 authoritative라서 `not_run`/`blocked`가 legacy available 상태에 의해 숨겨지지 않음
  - S4 harness fixture는 더 이상 Juliet block 상태를 hardcode하지 않고 `required_corpora=["juliet-c-cpp-1.3"]` readiness gate로 `not_decision_grade`를 산출
  - 현재 fixture report: `corpusReadinessGate.status="blocked"`, `decisionGradeReady=false`, reason `LOCAL_JULIET_CORPUS_NOT_PRESENT`
  - Critic final review PASS
  - Tool-portfolio focused suite after report integration: `70 passed in 0.12s`; Full S4 pytest: `648 passed in 24.66s`
  - CLI/fail-closed hardening verification: readiness tests `9 passed in 0.06s`; tool-portfolio focused suite `73 passed in 0.14s`; Full S4 pytest `651 passed in 24.43s`
  - Authoritative readiness report-merge verification: readiness/report tests `19 passed in 0.08s`; tool-portfolio focused suite `76 passed in 0.12s`; Full S4 pytest `654 passed in 23.96s`

- ~~System Stability Gate required-tools fail-closed hardening~~ — **완료** (2026-05-13)
  - offline Tool Portfolio `systemStabilityGate`에서 empty required tool set이 pass되는 fail-open 경로 차단
  - blank/duplicate required tool IDs는 canonical current-six order로 normalize
  - unknown required tool IDs는 `REQUIRED_TOOL_UNKNOWN` preflight failure로 고정하고 execution completeness `TOOL_RESULT_NOT_RECORDED`로 오분류하지 않음
  - Runtime `/v1/scan` `options.tools` 계약은 변경 없음
  - System-stability focused tests: `33 passed in 0.04s`; tool-portfolio focused suite: `79 passed in 0.13s`; Full S4 pytest: `657 passed in 23.89s`

- ~~System Stability Gate `not_run` decision-grade hardening~~ — **완료** (2026-05-13)
  - default/precomputed `systemStabilityGate.status="not_run"`이 local quality threshold pass를 final `qualityGate.status="pass"`로 승격시키는 fail-open 경로 차단
  - `not_run`은 split metrics와 localQualityAssessment를 보존하지만 final gate는 `SYSTEM_STABILITY_GATE_NOT_RUN` reason으로 `not_decision_grade`
  - explicit passing system-stability gate가 있어야 final quality pass 가능
  - Experiment-report/system-stability focused tests: `43 passed in 0.09s`; tool-portfolio focused suite: `80 passed in 0.14s`; Full S4 pytest: `658 passed in 24.44s`

- ~~System Stability Gate `qualityGateAllowed` invariant hardening~~ — **완료** (2026-05-13)
  - `qualityGateAllowed=true`는 `systemStabilityGate.status="pass"`에만 허용
  - default/precomputed harness `systemStabilityGate.status="not_run"`은 `qualityGateAllowed=false`로 정렬
  - `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json` 재생성 및 builder match 확인
  - Experiment-report/system-stability focused tests: `44 passed in 0.09s`; tool-portfolio focused suite: `81 passed in 0.13s`; Full S4 pytest: `659 passed in 23.36s`

- ~~Local Quality Gate `requiredSplits` fail-closed hardening~~ — **완료** (2026-05-13)
  - explicit empty/blank-only `thresholds.requiredSplits`가 local quality pass가 되는 fail-open 경로 차단
  - required splits normalize: blank drop, duplicate drop, known split canonical order `validation`/`test`/`canary`, unknown nonblank split은 stable after known and fails via existing `SPLIT_METRICS_MISSING`
  - empty normalized required splits는 `QUALITY_REQUIRED_SPLITS_NOT_DECLARED`로 local/final quality fail
  - Experiment-report focused tests: `12 passed in 0.08s`; experiment-report/system-stability focused tests: `46 passed in 0.09s`; tool-portfolio focused suite: `83 passed in 0.14s`; Full S4 pytest: `661 passed in 23.39s`

- ~~Local Quality Gate threshold-criteria fail-closed hardening~~ — **완료** (2026-05-13)
  - `minimumTargetRecall`, `minimumFindingPrecision`, `maximumNegativeTargetFpr` 중 하나도 없으면 local quality가 pass되는 fail-open 경로 차단
  - zero-criteria threshold config는 `QUALITY_THRESHOLDS_NOT_DECLARED`로 local/final quality fail
  - 기존 non-decision `minimumTargetRecall=0.0` 경로는 threshold criterion declared로 유지
  - Experiment-report focused tests: `13 passed in 0.08s`; experiment-report/system-stability focused tests: `47 passed in 0.10s`; tool-portfolio focused suite: `84 passed in 0.13s`; Full S4 pytest: `662 passed in 23.92s`

- ~~Local Quality Gate threshold-value validation hardening~~ — **완료** (2026-05-13)
  - threshold 값이 negative, >1, non-numeric, non-finite일 때 pass/exception으로 새지 않고 `QUALITY_THRESHOLD_VALUE_INVALID`로 fail-closed
  - invalid diagnostics는 `invalidThresholdFields` field names만 노출하고 non-finite raw float는 JSON threshold diagnostics에 그대로 쓰지 않음
  - Experiment-report focused tests: `17 passed in 0.09s`; experiment-report/system-stability focused tests: `51 passed in 0.11s`; tool-portfolio focused suite: `88 passed in 0.16s`; Full S4 pytest: `666 passed in 24.50s`

- ~~Local Quality Gate primary-tool-set config validation hardening~~ — **완료** (2026-05-13)
  - `primaryToolSetConfig` explicit blank/whitespace/unknown/non-string 값이 pass 또는 `SPLIT_METRICS_MISSING` 오분류로 새는 경로 차단
  - absent/null만 `full-current-six` default를 허용하고, invalid explicit 값은 `QUALITY_PRIMARY_TOOL_SET_CONFIG_INVALID`로 local/final quality fail
  - Experiment-report focused tests: `23 passed in 0.10s`; experiment-report/system-stability focused tests: `57 passed in 0.12s`; tool-portfolio focused suite: `94 passed in 0.17s`; Full S4 pytest: `672 passed in 24.34s`

- ~~System Stability Gate consistency validation hardening~~ — **완료** (2026-05-13)
  - caller-provided `systemStabilityGate.status`와 `qualityGateAllowed`가 모순될 때 final quality pass 또는 모순 payload 노출로 새는 경로 차단
  - inconsistent gate는 `SYSTEM_STABILITY_GATE_INCONSISTENT`, `status="fail"`, `qualityGateAllowed=false`, `phases.gateConsistency.status="fail"`로 정규화되고 기존 phase evidence는 보존
  - Experiment-report focused tests: `26 passed in 0.12s`; experiment-report/system-stability focused tests: `60 passed in 0.13s`; tool-portfolio focused suite: `97 passed in 0.19s`; Full S4 pytest: `675 passed in 25.11s`

- ~~Corpus Readiness Gate consistency validation hardening~~ — **완료** (2026-05-13)
  - caller-provided `corpusReadinessGate.status`/`decisionGradeReady`/`externalCorpusStatus` 모순이 final quality pass로 새는 경로 차단
  - inconsistent gate는 `CORPUS_READINESS_GATE_INCONSISTENT`, `status="blocked"`, `decisionGradeReady=false`, `consistencyChecks.status="fail"`로 정규화되고 acquisition/case/summary evidence는 보존
  - Experiment-report focused tests: `29 passed in 0.12s`; experiment-report/corpus-readiness/system-stability focused tests: `74 passed in 0.17s`; tool-portfolio focused suite: `101 passed in 0.20s`; Full S4 pytest: `681 passed in 24.90s`

- ~~findings_by_config payload/element shape validation hardening~~ — **완료** (2026-05-13)
  - findings input이 None/list/string, required config 누락, config value string/non-sequence, element string/None/int일 때 crash 또는 silent scoring으로 새는 경로 차단
  - passing prerequisites에서는 `FINDINGS_BY_CONFIG_INPUT_INVALID`로 local/final quality fail, split metrics는 `not_run`, portfolioMetrics는 blocked
  - Critic BLOCKED로 발견된 missing required config silent-empty-score bug를 regression test로 고정
  - Experiment-report focused tests: `48 passed in 0.17s`; experiment-report/corpus-readiness/system-stability focused tests: `93 passed in 0.21s`; tool-portfolio focused suite: `121 passed in 0.24s`; Full S4 pytest: `706 passed in 25.62s`

- ~~Oracle matchingPolicy payload shape validation hardening~~ — **완료** (2026-05-13)
  - `matchingPolicy`가 None/list/string 등 non-mapping일 때 crash 또는 silent default로 scoring되는 경로 차단
  - passing prerequisites에서는 `ORACLE_MATCHING_POLICY_INPUT_INVALID`로 local/final quality fail, split metrics는 `not_run`, portfolioMetrics는 blocked
  - system failure가 있으면 blocked/invalid-precondition semantics 우선
  - Experiment-report focused tests: `37 passed in 0.14s`; experiment-report/corpus-readiness/system-stability focused tests: `82 passed in 0.17s`; tool-portfolio focused suite: `109 passed in 0.22s`; Full S4 pytest: `691 passed in 24.85s`

- ~~Local Quality Gate thresholds payload shape validation hardening~~ — **완료** (2026-05-13)
  - `thresholds`가 None/list/string 등 non-mapping일 때 crash로 새는 경로 차단
  - passing prerequisites에서는 `QUALITY_THRESHOLDS_INPUT_INVALID`로 local/final quality fail, system failure가 있으면 blocked/invalid-precondition semantics 우선
  - Experiment-report focused tests: `33 passed in 0.13s`; experiment-report/corpus-readiness/system-stability focused tests: `78 passed in 0.17s`; tool-portfolio focused suite: `105 passed in 0.21s`; Full S4 pytest: `687 passed in 24.88s`

- ~~S4 API 계약서 / 담당문서 docs-sync~~ — **완료** (2026-05-12)
  - `wiki/canon/api/sast-runner-api.md`, `wiki/canon/handoff/s4/readme.md`, `wiki/canon/specs/sast-runner.md`에 current-six liveness snapshot과 local Quality Gate 상태를 반영
  - 2026-05-12 fresh probe: Semgrep `1.156.0`, Cppcheck `2.13.0`, Flawfinder `2.0.19`, clang-tidy `18.1.3`, scan-build available, gcc-fanalyzer/GCC `13.3.0`; `policyStatus="ok"`, `unavailableTools=[]`
  - 최신 full S4 pytest 재확인: `642 passed in 25.57s`
  - 현재 품질 상태는 `qualityGate.status="not_decision_grade"`, `qualityGate.localQualityAssessment.status="fail"`; validation/test fail, canary pass

- ~~Tool Portfolio Experiment Spec v1 framework~~ — **완료** (2026-05-12)
  - acquisition/corpus manifest validators, oracle matcher, decision-cycle freeze, experiment report builder, and S4 harness fixture added under `services/sast-runner/benchmark` + tests
  - S4-owned harness fixture exercises validation/test/canary split, full-current-six, six single-tool, six leave-one-out configs, matching classes, unique contribution, and leave-one-out deltas
  - generated report: `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json`
  - decision-grade Juliet validation/test remains blocked/not_run until a pinned local Juliet corpus is available; historical baselines are prerequisite evidence only
  - Critic-blocker fixes added: split-scoped metrics, no function-region-only TP when fallback disabled, explicit negative allowed-warning policy validation/enforcement and allowed-warning FP/noise exclusion
  - Full S4 pytest after Critic-blocker fixes: `548 passed in 13.09s`

- ~~Tool-agnostic Claim Support Readiness + claimBoundaryMatrix~~ — **완료** (2026-05-12)
  - `gates.claimSupportReadiness` 추가: runtime claim-support classifier이며 quality score/security verdict가 아님
  - `claimBoundaryMatrix[]` 추가: `absence-of-vulnerability`, `cwe-absence`, build-context/runtime/external/semantic/final-verdict claims를 machine-readable unsupported boundary로 고정
  - Gate implementation은 `app/scanner/claim_support_gate.py`에 격리되어 concrete SAST tool id, S5/GraphRAG/LLM/network coupling 없이 normalized evidence surfaces만 소비
  - Full S4 pytest: `516 passed in 12.94s`

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
