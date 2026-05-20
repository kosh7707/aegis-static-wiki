---
title: "SAST Runner API 명세 (v0.11.2)"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/api/sast-runner-api.md"
original_path: "docs/api/sast-runner-api.md"
last_verified: "2026-05-14"
service_tags: ["s4"]
decision_tags: []
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md", "wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md"]
migration_status: "canonicalized"
---

# SAST Runner API 명세 (v0.11.2)

> **AEGIS — Automotive Embedded Governance & Inspection System**
>
> S2(AEGIS Core) 또는 S3(Analysis Agent)가 SAST Runner를 호출할 때 참조하는 API 계약서.
> SAST Runner는 AEGIS의 **결정론적 전처리 엔진**으로, 6개 SAST 도구 + SCA + 코드 구조 + 빌드 자동화를 제공한다.

---

## 검증 상태

- 2026-05-14: Tool Portfolio report consumer `runnerIntegrityOnly` unsafe-projection fail-closed hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now publishes `runnerIntegrityOnly=true` only when the sanitized runner-integrity signal is present and no unsafe projection exists. Reports may still expose sanitized `thresholdIntent`, `thresholdProfileStatus`, and `reasonCodes` for diagnostics, but the S3-facing boolean convenience classification fails closed whenever `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` is emitted. RED reproduced an otherwise-positive report with injected `QUALITY_THRESHOLDS_NON_DISCRIMINATING` and a malformed runner-integrity report both returning `runnerIntegrityOnly=true` despite unsafe projection; targeted runner-integrity tests `3 passed`, Tool Portfolio consumer canary tests `46 passed`, related Tool Portfolio report/actual/consumer tests `314 passed`, all Tool Portfolio tests `542 passed`, full `services/sast-runner` pytest gate `1335 passed in 32.39s`; Critic implementation+docs review PASS.
- 2026-05-14: Tool Portfolio report consumer `toolPortfolioDecisionGradeUsable` completeness invariant — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` no longer trusts positive system/corpus/local/final/threshold gates alone. A summary is decision-grade usable only when those gates are positive, no unsafe projection exists, diagnostic surfaces are available, all current-six tool contribution rows are present, sanitized failure `reasonCodes` are empty, and `decisionSupport.requiredFollowUps` is empty. Diagnostic candidate IDs remain advisory and are not required for clean reports. If a report otherwise looks decision-grade but the projected evidence is incomplete, the canary adds `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and returns not usable; already non-decision-grade/failing reports do not gain that sentinel merely for completeness gaps. RED reproduced missing diagnostics, missing/empty current-six contribution rows, pass+failure-reason, and pass+required-follow-up cases returning usable; targeted completeness tests `6 passed`, Tool Portfolio consumer canary tests `44 passed`, related Tool Portfolio report/actual/consumer tests `312 passed`, all Tool Portfolio tests `540 passed`, full `services/sast-runner` pytest gate `1333 passed in 32.10s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer `localStaticEvidenceReady` completeness invariant — `benchmark.static_evidence_consumer_canary.summarize_static_evidence_contract()` no longer trusts pass/ready/pass gates alone. `localStaticEvidenceReady=true` now requires positive gates plus required local evidence coverage surfaces (`staticToolExecution`, `sastFindings`, `findingLocations`, `findingCweMapping`, `originClassification`), required claim boundaries, required claim-support statuses, and current-six tool matrix readiness (`ok` with local-tool policy or benign `skipped` with not-applicable policy). If gates claim ready but projected evidence is incomplete, the canary adds `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` only to system/evidence/claim reason arrays and returns not ready; already degraded/non-ready reports do not gain that sentinel merely for incomplete projection. RED reproduced forged pass/ready/pass summaries with empty/missing projected evidence returning local-ready; targeted completeness tests `4 passed`, static evidence consumer canary tests `38 passed`, static evidence related tests `77 passed`, full `services/sast-runner` pytest gate `1327 passed in 31.88s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer summary committed artifact and stale-artifact guard — committed `benchmark/results/static_evidence/s4-clean-ready-consumer-summary-v1.json` as the canonical parsed summary for `clean_ready_top_level.json`, exact-matched against `summarize_static_evidence_contract()` and CLI stdout. Tests now reject extra or drifted JSON artifacts with `summarySchemaVersion="s4-static-evidence-contract-consumer-summary-v1"` under `benchmark/results/static_evidence/`, while unrelated result JSON remains allowed. RED reproduced missing committed summary artifact; targeted artifact tests `4 passed`, static evidence consumer canary tests `36 passed`, static evidence related tests `75 passed`, full `services/sast-runner` pytest gate `1325 passed in 32.47s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer canary malformed nested scan-container classification — `_locate_contract()` now distinguishes truly absent nested scan contracts from present malformed `scan` containers. A response with `scan` present as a non-object is classified as `contractLocation="malformed"` with `STATIC_EVIDENCE_CONTRACT_MALFORMED`, while absent or `scan=null` remains `contractLocation="missing"` with `STATIC_EVIDENCE_CONTRACT_ABSENT`; no raw container value is stringified. RED reproduced present non-object `scan` being classified as absent; targeted nested-scan tests `2 passed`, static evidence consumer canary tests `32 passed`, static evidence related tests `71 passed`, full `services/sast-runner` pytest gate `1321 passed in 32.37s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer canary CLI smoke gate and structured diagnostics — `benchmark.static_evidence_consumer_canary` now exposes a pure-JSON CLI (`python -m benchmark.static_evidence_consumer_canary --response <path> [--require-local-static-ready]`) that emits the exact S3-facing summary JSON, exits `2` after summary emission for absent/malformed contracts or failed readiness requirement, and exits `1` with fixed structured stderr (`error`, `reasonCode`, `reasonCodes`, `stage`, `summaryEmitted`) for argument/file/JSON/output failures. The CLI does not import app code, execute tools, call network, echo raw paths/content/exceptions, or pollute `toolAnomalyReasonCodes`. RED reproduced the missing CLI entrypoint; targeted CLI tests `7 passed`, static evidence consumer canary tests `30 passed`, static evidence related tests `69 passed`, full `services/sast-runner` pytest gate `1319 passed in 33.16s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer canary summary schema version and exact-key lock — `benchmark.static_evidence_consumer_canary.summarize_static_evidence_contract()` now emits `summarySchemaVersion="s4-static-evidence-contract-consumer-summary-v1"` for present, absent, and malformed summaries, and the test suite exact-locks the top-level summary key set. This is a version for the S3-facing consumer-canary summary, not the underlying `staticEvidenceContract` producer schema. RED reproduced the missing summary schema version/key lock; targeted summary-schema test `1 passed`, static evidence consumer canary tests `23 passed`, static evidence related tests `62 passed`, full `services/sast-runner` pytest gate `1312 passed in 32.51s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer canary duplicate matrix identity fail-closed hardening — `benchmark.static_evidence_consumer_canary.summarize_static_evidence_contract()` now treats duplicate `toolEvidenceMatrix[].toolId` and `claimBoundaryMatrix[].claimId` rows as unsafe projection even when every duplicated value is individually allowlisted. First-observed projected values are preserved for `toolMatrixStatuses`, `toolConsumerPolicies`, `claimSupportStatuses`, and derived `unsupportedClaims`; later duplicates cannot overwrite S3-facing summary semantics. Unsafe multiplicity adds canary-generated `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` only to system/evidence/claim reason arrays, never `toolAnomalyReasonCodes`, and forces `localStaticEvidenceReady=false`. RED reproduced duplicate tool/claim rows preserving local readiness true with no unsafe evidence; targeted duplicate tests `2 passed`, static evidence consumer canary tests `22 passed`, static evidence related tests `61 passed`, full `services/sast-runner` pytest gate `1311 passed in 32.15s`; Critic implementation+docs review PASS.
- 2026-05-14: Static Evidence consumer canary map/container-shape fail-closed hardening — `benchmark.static_evidence_consumer_canary.summarize_static_evidence_contract()` now treats present non-object map/container projections (`gates`, `coverage`, `claimBoundaries`, `coverage.staticToolExecution`, and individual gate maps) as unsafe instead of silently normalizing them as absent. Absent/`None` remains compatible, malformed containers normalize to safe defaults without object stringification, canary-generated `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` is added only to system/evidence/claim reason arrays, `toolAnomalyReasonCodes` is not polluted, and `localStaticEvidenceReady=false`. RED reproduced malformed `coverage`/`claimBoundaries` keeping local readiness true and malformed gate containers lacking unsafe evidence; targeted container tests `4 passed`, static evidence consumer canary tests `20 passed`, static evidence related tests `59 passed`, full `services/sast-runner` pytest gate `1309 passed in 32.51s`; Critic implementation+docs review PASS.
- 2026-05-14: Tool Portfolio report consumer canary duplicate tool-contribution identity fail-closed hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now treats duplicate `toolContributionDiagnostics.tools[].toolId` rows as unsafe projection even when every duplicated value is individually allowlisted. The first observed class is preserved, later duplicate rows cannot overwrite `toolContributionClasses`, malformed multiplicity adds canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and `toolPortfolioDecisionGradeUsable=false`. RED reproduced a duplicate valid `semgrep` row silently overwriting the S3-facing class while leaving `reasonCodes=[]` and decision-grade usability true; targeted duplicate test `1 passed`, consumer canary tests `38 passed`, related Tool Portfolio report/actual/consumer tests `306 passed`, all Tool Portfolio tests `534 passed`, full `services/sast-runner` pytest gate `1305 passed in 32.80s`; Critic implementation+docs review PASS.
- 2026-05-14: Tool Portfolio report consumer canary boolean decision-field fail-closed hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now treats present non-bool `systemStabilityGate.qualityGateAllowed` and `corpusReadinessGate.decisionGradeReady` values as unsafe instead of silently normalizing them as false. Absent/`None` remains compatible, real `true`/`false` booleans are preserved, integers such as `1`/`0` are not accepted as booleans, malformed values are not coerced/stringified, and canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces `toolPortfolioDecisionGradeUsable=false`. RED reproduced malformed decision booleans yielding non-usable summaries with empty unsafe evidence; targeted boolean tests `2 passed`, consumer canary tests `37 passed`, related Tool Portfolio report/actual/consumer tests `305 passed`, all Tool Portfolio tests `533 passed`, full `services/sast-runner` pytest gate `1304 passed in 32.88s`; Critic implementation+docs review PASS.
- 2026-05-14: Tool Portfolio report consumer canary mapping/container-shape fail-closed hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now treats present non-object map/container projections as unsafe instead of silently normalizing them as absent. Absent/`None` remains compatible, while malformed top-level gates, nested quality maps, diagnostic surfaces/split/triage maps, tool-contribution diagnostics, and `decisionSupport` normalize to safe defaults without object stringification, add canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force `toolPortfolioDecisionGradeUsable=false`. RED reproduced malformed object containers yielding empty unsafe evidence and, for diagnostic/decision-support containers, decision-grade usability staying true; targeted container tests `4 passed`, consumer canary tests `35 passed`, related Tool Portfolio report/actual/consumer tests `303 passed`, all Tool Portfolio tests `531 passed`, full `services/sast-runner` pytest gate `1302 passed in 32.78s`; Critic implementation+docs review PASS.
- 2026-05-14: Tool Portfolio report consumer canary scalar fail-closed hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now treats present non-string or blank scalar projections as unsafe instead of conflating them with absent optional fields. Absent/`None` remains compatible, allowlisted strings are preserved, malformed diagnostic-only and decision-predicate scalars normalize to safe defaults without object stringification, and canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces `toolPortfolioDecisionGradeUsable=false`. RED reproduced malformed diagnostic statuses leaving decision-grade usability true and malformed system status lacking unsafe reason evidence; targeted scalar tests `2 passed`, consumer canary tests `31 passed`, related Tool Portfolio report/actual/consumer tests `299 passed`, all Tool Portfolio tests `527 passed`, full `services/sast-runner` pytest gate `1298 passed in 32.23s`; Critic implementation+docs review PASS.
- 2026-05-14: Tool Portfolio report consumer canary list-shape fail-closed hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now treats malformed `reasonCodes` and `decisionSupport.requiredFollowUps` containers/items as unsafe projection instead of silently dropping them. Absent/`None` optional lists remain non-unsafe, proper lists preserve valid allowlisted entries, malformed items are not stringified, and canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces `toolPortfolioDecisionGradeUsable=false`. RED reproduced non-list reason/follow-up containers and malformed list items leaving decision-grade usability true; targeted shape tests `2 passed`, consumer canary tests `29 passed`, related Tool Portfolio report/actual/consumer tests `297 passed`, all Tool Portfolio tests `525 passed`, full `services/sast-runner` pytest gate `1296 passed in 32.58s`; Critic PASS.
- 2026-05-14: Tool Portfolio report consumer canary summary-only reason spoofing hardening — `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` now treats canary-generated summary diagnostics (`TOOL_PORTFOLIO_REPORT_ABSENT`, `TOOL_PORTFOLIO_REPORT_MALFORMED`, `TOOL_PORTFOLIO_REPORT_SCHEMA_UNSUPPORTED`, `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`) as invalid if caller-provided inside a present valid report reason-code array. Spoofed summary-only reasons are omitted, converted into canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force `toolPortfolioDecisionGradeUsable=false` while absent/malformed/wrong-schema fast paths still emit their fixed summaries. RED reproduced `toolPortfolioDecisionGradeUsable=true` with spoofed summary-only reasons; targeted spoofing test `1 passed`, consumer canary tests `27 passed`, related Tool Portfolio report/actual/consumer tests `295 passed`, all Tool Portfolio tests `523 passed`, full `services/sast-runner` pytest gate `1294 passed in 32.77s`; Critic PASS.
- 2026-05-14: Static Evidence consumer canary projection sanitization — `benchmark.static_evidence_consumer_canary.summarize_static_evidence_contract()` now allowlists S3-facing projected statuses, generated reason codes, surfaces, claim IDs, tool IDs, claim/tool statuses, and consumer policies; generated partial/degraded/unknown tool evidence remains safe, while malformed/unknown projection values or caller-spoofed summary-only diagnostics (`STATIC_EVIDENCE_CONTRACT_ABSENT`, `STATIC_EVIDENCE_CONTRACT_MALFORMED`, `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION`) cause the canary itself to add `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` to `systemReasonCodes`, `evidenceReasonCodes`, and `claimSupportReasonCodes`, force `localStaticEvidenceReady=false`, and never enter `toolAnomalyReasonCodes`. RED regressions proved prior helper could echo `shouldCallS5`/`routeTo`-style values and stringify unsafe coverage keys; unsafe-projection tests `2 passed`, compatibility/fail-closed tests `3 passed`, spoofed-sentinel test `1 passed`, summary-only diagnostic spoofing test `1 passed`, consumer canary tests `16 passed`, static-evidence related tests `51 passed`, full `services/sast-runner` pytest gate `1293 passed in 32.39s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI structured stderr diagnostics — `juliet_runner.py::main()` failure stderr now uses a compact exact 3-key JSON envelope (`error`, `reasonCode`, `stage`) for parser, selector, artifact, payload, output, handoff, run, and report-build failures. Fixed mappings include `JULIET_CLI_ARGUMENTS_INVALID`, selector/artifact/payload/output reason codes, `JULIET_COMPARISON_HANDOFF_FAILED` with `stage=handoff`, and `JULIET_BENCHMARK_EXECUTION_FAILED` with `stage=run`; all existing `parser.error(...)` branches preserve exit `2`, and broken stderr writes are best-effort. RED regressions proved prior stderr was plain text and broken stderr could leak a raw `ValueError`; targeted structured stderr tests `9 passed`, `test_juliet_runner.py` `58 passed`, benchmark/JULIET related tests `113 passed`, full `services/sast-runner` pytest gate `1286 passed in 32.98s`; Critic PASS.
- 2026-05-14: Standalone benchmark compare CLI structured stderr diagnostics — `benchmark.compare.main()` failure stderr now uses a compact exact 3-key JSON envelope (`error`, `reasonCode`, `stage`) for parse, threshold, artifact, payload, and report-output failures. Fixed mappings are `BENCHMARK_COMPARE_CLI_ARGUMENTS_INVALID` / `BENCHMARK_COMPARE_THRESHOLD_INVALID` / `BENCHMARK_COMPARE_ARTIFACT_INVALID` / `BENCHMARK_COMPARE_PAYLOAD_INVALID` / `BENCHMARK_COMPARE_REPORT_FAILED`, with `stage=input` except report output failures (`stage=output`). RED regressions proved prior stderr was plain text and broken stderr could leak a raw `ValueError`; targeted structured stderr tests `6 passed`, `test_benchmark.py` `55 passed`, benchmark/JULIET related tests `112 passed`, full `services/sast-runner` pytest gate `1285 passed in 32.57s`; Critic PASS.
- 2026-05-14: Tool Portfolio report consumer canary structured stderr diagnostics — `tool_portfolio_report_consumer_canary.py::main()` failure stderr now uses a compact exact 5-key JSON envelope (`error`, `reasonCode`, `reasonCodes`, `stage`, `summaryEmitted`) while preserving legacy `reasonCodes=[reasonCode]` and `summaryEmitted=false`; input failures use `error=input validation failed`, `reasonCode=TOOL_PORTFOLIO_REPORT_CLI_INPUT_INVALID`, `stage=input`, and output summary serialization/stdout failures use `summary output failed` / `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` / `output`. RED regressions proved prior stderr lacked `error/reasonCode/stage`; targeted structured stderr tests `4 passed`, consumer canary tests `26 passed`, related Tool Portfolio CLI/report tests `415 passed`, full `services/sast-runner` pytest gate `1284 passed in 32.04s`; Critic PASS.
- 2026-05-14: Blocked metric bucket direct-helper sanitization — `blocked_metric_bucket()` now allowlists split names (`validation|test|canary`) and system-stability reason codes before emitting blocked metric buckets; invalid split values become `<invalid>`, malformed/blank/non-string/non-allowlisted reason entries add `SYSTEM_STABILITY_GATE_INPUT_INVALID`, string reason-code containers are not character-expanded, and arbitrary reason objects are not stringified. RED regressions reproduced raw secret split/reason/object leakage and string-container expansion; blocked-bucket tests `3 passed`, system-stability tests `60 passed`, related Tool Portfolio/readiness tests `393 passed`, full `services/sast-runner` pytest gate `1284 passed in 32.23s`; Critic PASS.
- 2026-05-14: System Stability direct required-tools identity sanitization — `build_system_stability_gate()` now preserves known current-six required tools in canonical order but collapses unknown, blank, non-string, or invalid required-tool entries to one `<invalid>` sentinel in `requiredTools` and the generated `REQUIRED_TOOL_UNKNOWN` preflight failure; arbitrary caller tool identities are no longer stringified or echoed by the direct helper. RED regressions reproduced raw unknown tool and object identity leakage; targeted required-tools identity tests `3 passed`, system-stability tests `57 passed`, related Tool Portfolio/readiness tests `390 passed`, full `services/sast-runner` pytest gate `1281 passed in 32.69s`; Critic PASS.
- 2026-05-14: System Stability direct execution-completeness metadata sanitization — `build_system_stability_gate()` now sanitizes execution failure `status`, `reasonCode`, `degradeReasons`, `timedOutFiles`, and `failedFiles` before emitting direct helper output: statuses are allowlisted or `unknown`, skip reasons are allowlisted or derived from safe status/degraded fallback, degrade reasons are allowlisted without object stringification, and counts are nonnegative non-bool integers or `null`. RED regressions reproduced raw skip reason, weird status, secret degrade reason/object, and bad count echo; targeted execution tests `22 passed`, system-stability tests `56 passed`, related Tool Portfolio/readiness tests `389 passed`, full `services/sast-runner` pytest gate `1280 passed in 32.06s`; Critic PASS.
- 2026-05-14: System Stability direct preflight metadata sanitization — `build_system_stability_gate()` now emits unavailable-tool preflight failures with allowlisted `reasonCode`, `versionStatus=present|missing`, and `expectedExecutablePathStatus=redacted|not-configured`; raw `version`, raw `expectedExecutablePath`, and arbitrary `probeReason` strings are no longer emitted by the direct helper. Report-side normalization accepts the new status-only fields for re-ingestion. RED regressions reproduced raw secret probe reason, version, and executable path leakage; targeted preflight tests `8 passed`, system-stability tests `54 passed`, related Tool Portfolio/readiness tests `387 passed`, full `services/sast-runner` pytest gate `1278 passed in 32.85s`; Critic PASS.
- 2026-05-14: Quality Gate direct-helper reason-code sanitization — `build_quality_gate()` now allowlists propagated system-stability reason codes and external corpus/readiness reason codes before they reach `qualityGate.reasonCodes`; malformed, blank, non-string, object, or non-allowlisted entries are suppressed without `str()` conversion and replaced with `SYSTEM_STABILITY_GATE_INPUT_INVALID` or `CORPUS_READINESS_GATE_INPUT_INVALID` as appropriate. RED regressions reproduced raw secret/object/number reason-code echo from system fail, inconsistent pass+false, and external blocked-readiness inputs; reason-sanitization tests `3 passed`, quality-gate subset `21 passed`, system-stability tests `52 passed`, related Tool Portfolio/readiness tests `385 passed`, full `services/sast-runner` pytest gate `1276 passed in 32.17s`; Critic PASS.
- 2026-05-14: Quality Gate eligibility invariant fail-closed hardening — `build_quality_gate()` now returns `eligible` only when `systemStabilityGate.status="pass"` and `qualityGateAllowed is True`; absent system gates remain `not_decision_grade` with `SYSTEM_STABILITY_GATE_NOT_RUN`, valid `not_run` gates stay non-decision-grade, and malformed/inconsistent system-gate inputs block quality scoring with `SYSTEM_STABILITY_GATE_FAILED` plus `SYSTEM_STABILITY_GATE_INPUT_INVALID` or `SYSTEM_STABILITY_GATE_INCONSISTENT`. RED regressions reproduced prior fail-open `eligible` results for pass-without-allowance, malformed/unknown status, non-pass-with-allowance, and absent system gate; targeted invariant tests `15 passed`, system-stability tests `49 passed`, related Tool Portfolio tests `343 passed`, full `services/sast-runner` pytest gate `1273 passed in 30.75s`; Critic PASS.
- 2026-05-14: Corpus Acquisition CLI structured stderr diagnostics — `tool_portfolio_corpus_acquisition.py::main()` now emits compact JSON stderr diagnostics for existing input/output failure boundaries while preserving fixed-message compatibility: input failures use `error=input validation failed`, `reasonCode=CORPUS_ACQUISITION_CLI_INPUT_INVALID`, `stage=input`; output failures use `corpus acquisition output failed` / `CORPUS_ACQUISITION_CLI_OUTPUT_FAILED` / `output`. RED regressions proved prior plain-text stderr was not machine-readable; structured acquisition tests `4 passed`, targeted/compat acquisition CLI tests `8 passed`, related Tool Portfolio tests `329 passed`, full `services/sast-runner` pytest gate `1258 passed in 29.80s`; Critic PASS.
- 2026-05-14: Actual Tool Portfolio runner structured CLI diagnostics — `tool_portfolio_actual_runner.py::main()` now emits compact JSON stderr diagnostics for the three CLI failure stages while preserving fixed-message compatibility: input failures use `error=input validation failed`, `reasonCode=ACTUAL_RUN_CLI_INPUT_INVALID`, `stage=input`; report-build/run failures use `actual run failed` / `ACTUAL_RUN_FAILED` / `run`; output failures use `output write failed` / `ACTUAL_RUN_OUTPUT_WRITE_FAILED` / `output`. RED regressions proved prior plain-text stderr was not machine-readable; structured input/run/output tests `4 passed`, targeted/compat actual-runner CLI tests `8 passed`, related Tool Portfolio tests `329 passed`, full `services/sast-runner` pytest gate `1258 passed in 30.32s`; Critic PASS.
- 2026-05-14: Actual Tool Portfolio runner CLI report-build failure sanitization — `tool_portfolio_actual_runner.py::main()` now wraps ordinary failures from `asyncio.run(build_actual_tool_portfolio_report(...))` before output writing, maps staging/tool/report-composition failures to fixed `actual run failed` stderr with exit `1`, and skips `write_experiment_report()` on report-build failure. RED regressions reproduced raw `ValueError`, raw `RuntimeError`, and broken-stderr cascade leakage with secret output paths/messages; report-build boundary tests `2 passed`, targeted/compat actual-runner CLI tests `7 passed`, related Tool Portfolio tests `329 passed`, full `services/sast-runner` pytest gate `1258 passed in 31.32s`; Critic PASS.
- 2026-05-14: Actual Tool Portfolio runner CLI output-boundary sanitization — `tool_portfolio_actual_runner.py::main()` now wraps `write_experiment_report(report, --output)` after successful report build, maps write/serialization/path failures to fixed `output write failed` stderr with exit `1`, and uses a best-effort stderr emitter so broken stderr cannot re-raise raw exceptions. RED regressions reproduced raw `OSError`, raw `TypeError`, and stderr cascade leakage with secret output paths/messages; output-boundary tests `3 passed`, targeted/compat actual-runner CLI tests `5 passed`, related Tool Portfolio tests `327 passed`, full `services/sast-runner` pytest gate `1256 passed in 30.66s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI argparse-boundary sanitization — `juliet_runner.py::main()` now maps missing required arguments, unknown arguments, and malformed option-value shapes to fixed `invalid Juliet arguments` with exit `2`, no argparse usage/raw token/path echo, and no benchmark/output/baseline side effects, while preserving existing fixed post-parse diagnostics (`invalid tool/CWE/variant/timeout selection`, artifact/payload/report/output/compare/execution failures). RED regressions reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret flag/path echo; new parser-boundary tests `3 passed`, targeted/compat Juliet CLI tests `10 passed`, benchmark/JULIET related tests `111 passed`, full `services/sast-runner` pytest gate `1253 passed in 30.99s`; Critic PASS.
- 2026-05-14: Standalone benchmark compare CLI argparse-boundary sanitization — `benchmark.compare.main()` now maps missing required args, unknown args, and malformed option shapes to fixed `invalid comparison arguments` with exit `2`, no argparse usage/raw token/path echo, while preserving existing fixed post-parse diagnostics (`invalid threshold selection`, `invalid comparison artifact`, `invalid comparison artifact payload`, `comparison report failed`). RED regressions reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret token/path echo; targeted/compat compare tests `8 passed`, benchmark/JULIET related tests `108 passed`, full `services/sast-runner` pytest gate `1250 passed in 30.26s`; Critic PASS.
- 2026-05-14: Corpus Readiness CLI argparse/input-boundary sanitization — `tool_portfolio_corpus_readiness.py::main()` now maps missing required arguments, unknown arguments, and malformed repeated-option shapes to the existing sanitized invalid-input JSON payload on stdout with exit `1`, stderr empty, and no raw argparse usage/token/path echo; post-parse JSON/load/build/output behavior remains unchanged. RED regressions reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret token echo; targeted/compat CLI tests `6 passed`, related Tool Portfolio tests `125 passed`, full `services/sast-runner` pytest gate `1247 passed in 31.19s`; Critic PASS.
- 2026-05-14: Corpus Acquisition CLI output-boundary sanitization — `tool_portfolio_corpus_acquisition.py::main()` now maps summary-output write/serialization failures, stdout JSON serialization/write failures, and broken stderr fallback to fixed `corpus acquisition output failed` semantics without raw exception, object, or path echo; acquisition failures remain outside this catch. RED regressions reproduced raw `OSError`, raw `TypeError` with secret class names, stdout write leakage, and stderr cascade risk; targeted output/input tests `6 passed`, related Tool Portfolio tests `122 passed`, full `services/sast-runner` pytest gate `1244 passed in 29.87s`; Critic PASS.
- 2026-05-14: Corpus Acquisition CLI argparse/input-boundary sanitization — `tool_portfolio_corpus_acquisition.py::main()` now maps invalid `--corpus`, unknown arguments, and malformed option shapes to fixed `input validation failed` stderr with exit `1`, before acquisition/network/file side effects; valid repeated corpus selection preserves caller order and summary/stdout behavior. RED regressions reproduced raw argparse `SystemExit`, usage, invalid-choice/unrecognized/expected-one-argument diagnostics, and secret token echo; targeted CLI tests `4 passed`, related Tool Portfolio tests `118 passed`, full `services/sast-runner` pytest gate `1240 passed in 29.38s`; Critic PASS.
- 2026-05-14: Actual Tool Portfolio runner CLI argparse/scalar input sanitization — `tool_portfolio_actual_runner.py::main()` now maps invalid `--timeout` and `--phase` argparse failures plus JSON input-loading failures to fixed `input validation failed` stderr with exit `1`; `--timeout` is parsed as a positive decimal string with no new upper bound, and invalid scalar inputs fail before file reads or output writes. RED regressions reproduced raw argparse `SystemExit`, usage, and secret token echo; targeted/compat CLI tests `5 passed`, related Tool Portfolio tests `340 passed`, full `services/sast-runner` pytest gate `1236 passed in 29.67s`; Critic PASS.
- 2026-05-14: Tool Portfolio report consumer canary CLI output-boundary sanitization — `tool_portfolio_report_consumer_canary.py::main()` now wraps sanitized summary JSON serialization and stdout write failures, returning exit `1` with fixed `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` stderr JSON when no summary can be emitted. RED regressions reproduced raw stdout `OSError` and summary serialization `TypeError`; targeted/compat CLI tests `5 passed`, related report/consumer tests `266 passed`, full `services/sast-runner` pytest gate `1233 passed in 29.82s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI stdout JSON separator failure sanitization — no-output Juliet CLI now treats the blank separator before stdout JSON as part of `_emit_cli_stdout_json()`, so separator write failures map to fixed `stdout JSON write failed` instead of raw `OSError`. RED regression reproduced raw secret `OSError` after markdown output; targeted stdout tests `2 passed`, benchmark/JULIET related tests `105 passed`, full `services/sast-runner` pytest gate `1231 passed in 30.44s`; Critic PASS.
- 2026-05-14: CLI artifact preflight filesystem-probe failure sanitization — standalone compare and Juliet benchmark CLI artifact preflight now catch filesystem probe `OSError`/`ValueError` from `Path.is_file()`, `Path.exists()`, and `Path.is_dir()` and map them to the existing fixed diagnostics `invalid comparison artifact`, `invalid baseline artifact`, or `invalid output artifact`. RED regressions reproduced raw probe `OSError` leakage; targeted probe tests `4 passed`, benchmark/JULIET related tests `104 passed`, full `services/sast-runner` pytest gate `1230 passed in 31.06s`; Critic PASS.
- 2026-05-14: Standalone compare CLI markdown report failure sanitization — `benchmark.compare.main()` now maps expected comparison markdown render/write failures to fixed `comparison report failed`, without raw traceback/exception/path echo and before regression evaluation. Programmatic markdown/compare helpers remain unchanged. RED regression reproduced raw secret `ValueError` leakage from `report.to_markdown()`; targeted compare markdown tests `3 passed`, focused compare tests `23 passed`, benchmark/JULIET related tests `100 passed`, full `services/sast-runner` pytest gate `1226 passed in 29.63s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI numeric selector conversion failure sanitization — `--cwes`, `--variant-filter`, and `--timeout` now parse positive decimal values through a shared fixed-diagnostic helper that catches `int()` conversion failures such as oversized decimal digit-limit `ValueError`s. Valid selector behavior is unchanged and no new upper bound is introduced. RED regressions reproduced raw conversion tracebacks for all three selectors; targeted oversized+valid selector tests `6 passed`, focused selector tests `11 passed`, benchmark/JULIET related tests `99 passed`, full `services/sast-runner` pytest gate `1225 passed in 30.01s`; Critic PASS.
- 2026-05-14: Comparison payload canonical CWE key validation — shared CLI comparison payload preflight now requires `results` keys to match canonical `CWE-<positive integer>` format, preventing caller-controlled artifact keys from reaching public comparison markdown. Empty results and generated CWE keys remain valid; programmatic compare helpers remain unchanged. RED regressions reproduced secret key echo in standalone compare and Juliet baseline output; targeted key tests `3 passed`, focused payload/key/range tests `9 passed`, benchmark/JULIET related tests `96 passed`, full `services/sast-runner` pytest gate `1222 passed in 29.55s`; Critic PASS.
- 2026-05-14: Comparison metric semantic range validation — shared CLI comparison payload preflight now requires `summary.overallRecall` and per-CWE `combined.recall` to be probabilities in `[0.0, 1.0]`, and optional `noisePerFile` / `targetedNoisePerFile` to be non-negative finite numbers. Empty results and boundary values remain valid; programmatic compare helpers remain unchanged. RED regressions reproduced out-of-range summary fail-open, negative recall/noise regression misclassification, and Juliet baseline side effects; targeted range tests `6 passed`, focused payload/range tests `8 passed`, benchmark/JULIET related tests `93 passed`, full `services/sast-runner` pytest gate `1219 passed in 29.87s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI output-data construction failure sanitization — report payload construction now exits with fixed `benchmark report build failed` if `result.to_dict()` raises or returns a non-mapping, before output/markdown/stdout/compare side effects. Successful output shape is unchanged. RED regressions reproduced raw secret `ValueError` and non-mapping `TypeError`; targeted output-data tests `3 passed`, focused CLI boundary tests `11 passed`, benchmark/JULIET related tests `87 passed`, full `services/sast-runner` pytest gate `1213 passed in 29.65s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI markdown report failure sanitization — markdown rendering/output now exits with fixed `markdown report failed` for expected render/write failures without raw traceback, exception text/type, object values, baseline paths, or output paths. Already-written `--output` JSON is preserved; downstream stdout JSON and baseline compare handoff are skipped after markdown failure. RED regression reproduced raw secret `ValueError` leakage after output write; targeted markdown tests `2 passed`, focused CLI output-boundary tests `10 passed`, benchmark/JULIET related tests `85 passed`, full `services/sast-runner` pytest gate `1211 passed in 30.16s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI benchmark execution/setup failure sanitization — `juliet_runner.py::main()` now wraps escaped setup/execution failures before a `BenchmarkResult` exists and exits with fixed `benchmark execution failed` without raw traceback, exception type/message, Juliet root, or output path echo. Programmatic `run_benchmark()` and per-CWE scan-failure semantics remain unchanged. RED regressions reproduced raw missing-`testcases` `FileNotFoundError` and synthetic secret `ValueError`; targeted benchmark-failure tests `2 passed`, focused Juliet boundary tests `8 passed`, benchmark/JULIET related tests `84 passed`, full `services/sast-runner` pytest gate `1210 passed in 31.21s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI compare handoff failure sanitization — after benchmark execution/output, Juliet `--baseline` comparison handoff now maps expected late read/decode/type/schema helper failures to fixed `comparison handoff failed` without raw exception/path echo. Successfully written output artifacts are preserved, and successful `compare_from_files()` arguments remain unchanged. RED regression reproduced raw `OSError` leakage after output/markdown; targeted compare-handoff tests `2 passed`, focused baseline/output/stdout tests `12 passed`, benchmark/JULIET related tests `82 passed`, full `services/sast-runner` pytest gate `1208 passed in 32.00s`; Critic PASS.
- 2026-05-14: Comparison artifact required-schema validation — standalone `benchmark.compare` CLI and Juliet `--baseline` preflight now require minimal benchmark-result anchors (`summary`, `results`, `summary.overallRecall`, per-CWE `combined`, and per-CWE `combined.recall`) before comparison. Empty `results: {}` with valid summary remains accepted; programmatic `_load_result()`/`compare()`/`compare_from_files()` remain unchanged. RED regressions reproduced `{}` fail-open comparison, missing `combined.recall` becoming regression exit `1`, and Juliet baseline `{}` executing benchmark/output path; targeted required-schema tests `4 passed`, focused payload/baseline tests `9 passed`, benchmark/JULIET related tests `81 passed`, full `services/sast-runner` pytest gate `1207 passed in 30.76s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI duplicate tool selector validation — `juliet_runner.py::main()` now rejects duplicate `--tools` selectors before benchmark execution/output writes; duplicate current-six entries exit with fixed `invalid tool selection`, do not run the benchmark, do not create `--output`, and do not echo the raw selector or output path. Valid unique current-six subsets still preserve caller order. RED regression reproduced `semgrep,semgrep` fail-open execution; targeted duplicate+valid tests `2 passed`, focused tool-selector tests `4 passed`, benchmark/JULIET related tests `77 passed`, full `services/sast-runner` pytest gate `1203 passed in 34.28s`; Critic PASS.
- 2026-05-14: Comparison payload nested-shape validation — standalone `benchmark.compare` CLI and Juliet `--baseline` preflight now reject malformed nested comparison payloads before `compare()`/`compare_from_files()`; summary/results/combined structures and finite numeric metric fields are validated with centralized `is_comparison_payload_shape()`. Invalid standalone artifacts use fixed `invalid comparison artifact payload`; Juliet baselines use fixed `invalid baseline artifact payload`; programmatic `compare()` and `compare_from_files()` semantics remain unchanged. RED regressions reproduced raw `AttributeError`/`TypeError`, NaN fail-open, and Juliet benchmark side effects; targeted regressions `4 passed`, focused compare/JULIET CLI tests `16 passed`, benchmark/JULIET related tests `85 passed`, full `services/sast-runner` pytest gate `1202 passed in 39.34s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI stdout JSON serialization failure sanitization — no-output `juliet_runner.py::main()` now emits report JSON through `_emit_cli_stdout_json()`; serialization/print failures exit with fixed `stdout JSON write failed` without raw object/exception echo and do not call `compare_from_files()`, while file-output behavior is unchanged. RED regression reproduced raw `TypeError` leakage from a secret-named non-serializable result field; targeted regression `1 passed`, focused stdout/output/baseline tests `5 passed`, benchmark/JULIET related tests `81 passed`, full `services/sast-runner` pytest gate `1198 passed in 31.31s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI output write failure sanitization — `juliet_runner.py::main()` now writes `--output` through `_write_cli_output_artifact()`; parent creation or file write failures after benchmark execution exit with fixed `output artifact write failed` without raw path/exception echo and do not print stdout JSON or call `compare_from_files()`. RED regressions reproduced raw `OSError` leakage for parent mkdir and write failures; targeted regressions `2 passed`, focused Juliet baseline/output CLI tests `6 passed`, benchmark/JULIET related tests `80 passed`, full `services/sast-runner` pytest gate `1197 passed in 30.80s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI baseline payload validation — `juliet_runner.py::main()` now validates caller-provided `--baseline` JSON payload after scalar/artifact preflight and before benchmark execution/output writes; unreadable, malformed, or non-object baselines exit with fixed `invalid baseline artifact payload` without raw path/content echo, while valid baselines still hand the original `Path` to `compare_from_files()`. RED regressions reproduced benchmark side effects followed by raw `JSONDecodeError`/`AttributeError` path/content leakage; targeted regressions `3 passed`, baseline/output focused Juliet CLI tests `8 passed`, benchmark/JULIET related tests `78 passed`, full `services/sast-runner` pytest gate `1195 passed in 31.65s`; Critic PASS.
- 2026-05-14: Benchmark compare CLI JSON payload validation — `benchmark.compare.main()` now loads baseline/current JSON through CLI-only `_load_cli_result()` after threshold/artifact preflight; unreadable, malformed, or non-object artifacts exit with fixed `invalid comparison artifact payload` without raw path/content echo, while programmatic `_load_result()` and `compare_from_files()` remain unchanged. RED regressions reproduced raw `JSONDecodeError` content leakage and non-object payload `AttributeError` path/content leakage; targeted payload regressions `2 passed`, compare CLI focused tests `11 passed`, benchmark/JULIET related tests `75 passed`, full `services/sast-runner` pytest gate `1192 passed in 30.57s`; Critic PASS.
- 2026-05-14: Benchmark compare CLI threshold fail-closed validation — `benchmark.compare.main()` now parses `--threshold` through a fixed validator before artifact validation/loading; blank, non-numeric, non-finite, non-positive, or greater-than-one values exit with fixed `invalid threshold selection` without raw input echo, while valid positive thresholds preserve regression exit semantics. RED regressions reproduced raw argparse secret leakage, NaN fail-open, and out-of-range fail-open/wrong-exit behavior; targeted regressions `6 passed`, benchmark/JULIET related tests `73 passed`, full `services/sast-runner` pytest gate `1190 passed in 30.40s`; Critic PASS.
- 2026-05-14: Benchmark compare CLI artifact preflight validation — `benchmark.compare.main()` now validates standalone `--baseline`/`--current` artifacts with `Path.is_file()` before `_load_result()`; missing baseline or directory current exits with fixed `invalid comparison artifact`, while valid comparisons keep sanitized markdown labels. RED regressions reproduced raw `FileNotFoundError`/`IsADirectoryError` secret path leakage; targeted regressions `3 passed`, benchmark/JULIET related tests `67 passed`, full `services/sast-runner` pytest gate `1184 passed in 30.45s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI output artifact preflight validation — `juliet_runner.py::main()` now validates `--output` before benchmark execution/output writes; existing directory outputs or existing non-directory parents exit with fixed `invalid output artifact`, while missing parents and existing regular output files remain supported. RED regressions reproduced raw `IsADirectoryError`/`FileExistsError` secret path leakage after benchmark side effects; targeted regressions `3 passed`, benchmark/JULIET related tests `64 passed`, full `services/sast-runner` pytest gate `1181 passed in 30.56s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI baseline artifact preflight validation — `juliet_runner.py::main()` now validates `--baseline` with `Path.is_file()` before benchmark execution/output writes; missing or directory baselines exit with fixed `invalid baseline artifact`, while valid baselines preserve the real `Path` handoff to `compare_from_files()`. RED regressions reproduced raw `FileNotFoundError`/`IsADirectoryError` secret path leakage after benchmark side effects; targeted regressions `3 passed`, benchmark/JULIET related tests `61 passed`, full `services/sast-runner` pytest gate `1178 passed in 30.16s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI timeout selector fail-closed validation — `juliet_runner.py::main()` now parses `--timeout` through a fixed-message validator instead of argparse raw `int` conversion; blank/non-decimal/signed/decimal/non-positive values exit with fixed `invalid timeout selection` before benchmark execution/output writes, while valid/default positive seconds remain unchanged. RED regressions reproduced raw `invalid int value` secret leakage and non-positive timeout fail-open execution; targeted regressions `4 passed`, benchmark/JULIET related tests `58 passed`, full `services/sast-runner` pytest gate `1175 passed in 30.36s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI variant selector fail-closed validation — `juliet_runner.py::main()` now validates and normalizes `--variant-filter` before benchmark execution/report serialization; `all` maps to execution `None`, positive decimal IDs preserve trimmed text, and blank/non-decimal/non-positive values exit with fixed `invalid variant selection`. RED regressions reproduced invalid/blank selector fail-open execution and raw whitespace report labels; targeted regressions `4 passed`, benchmark/JULIET related tests `54 passed`, full `services/sast-runner` pytest gate `1171 passed in 29.63s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI CWE selector fail-closed validation — `juliet_runner.py::main()` now validates `--cwes` before benchmark execution; blank, non-decimal, signed/decimal, or non-positive selector segments exit with fixed `invalid CWE selection` instead of raw Python `ValueError`, while valid positive CWE IDs remain supported. RED regressions reproduced raw `ValueError` leakage for secret/blank selectors; targeted regressions `3 passed`, benchmark/JULIET related tests `50 passed`, full `services/sast-runner` pytest gate `1167 passed in 30.43s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI tool selector fail-closed validation — `juliet_runner.py::main()` now validates `--tools` against the current-six allowlist before benchmark execution; unknown or blank selectors exit with fixed `invalid tool selection` and do not run the benchmark or write output files. RED regressions reproduced unknown/blank selector fail-open execution and blank selector report leakage; targeted regressions `3 passed`, benchmark/JULIET related tests `47 passed`, full `services/sast-runner` pytest gate `1164 passed in 30.90s`; Critic PASS.
- 2026-05-14: Juliet benchmark CLI report/log path redaction — `juliet_runner.py::main()` no longer serializes caller-provided `--juliet-path` into report JSON and no longer logs caller-provided `--output` paths; public reports use the historical `<JULIET_ROOT>/C` placeholder while actual benchmark input/output behavior is preserved. RED regressions reproduced secret Juliet root leakage in stdout/written JSON and secret output-path leakage in save logs; targeted regressions `2 passed`, benchmark/JULIET related tests `44 passed`, full `services/sast-runner` pytest gate `1161 passed in 30.48s`; Critic PASS.
- 2026-05-14: Benchmark compare markdown path-label redaction — `ComparisonReport.to_markdown()` no longer renders caller-provided baseline/current path labels; public markdown uses fixed `baseline artifact` / `current artifact` labels while preserving internal comparison fields and scoring semantics. RED regression reproduced `/tmp/SECRET_BASELINE_PATH_SHOULD_NOT_LEAK.json` and `/tmp/SECRET_CURRENT_PATH_SHOULD_NOT_LEAK.json`; targeted regression `1 passed`, benchmark/JULIET related tests `42 passed`, full `services/sast-runner` pytest gate `1159 passed in 30.30s`; Critic PASS.
- 2026-05-14: Juliet benchmark start-log variant filter redaction — `run_benchmark(..., variant_filter=...)` no longer logs caller-provided variant values; start logs expose value-free `variantSelection=all|filtered` while preserving discovery/scoring semantics. RED regression reproduced `SECRET_VARIANT_FILTER_SHOULD_NOT_LEAK` in logs; targeted regression `1 passed`, benchmark/JULIET related tests `41 passed`, full `services/sast-runner` pytest gate `1158 passed in 30.13s`; Critic PASS.
- 2026-05-14: Juliet benchmark start-log tool selector redaction — `run_benchmark(..., tools=[...])` no longer logs caller-provided tool selector values; start logs expose value-free `toolSelection=all|custom` plus `toolCount` while preserving actual tool execution semantics. RED regression reproduced `SECRET_TOOL_SELECTOR_SHOULD_NOT_LEAK` in logs; targeted regression `1 passed`, benchmark/JULIET related tests `40 passed`, full `services/sast-runner` pytest gate `1157 passed in 30.79s`; Critic PASS.
- 2026-05-14: Benchmark report `cweName` serialization sanitization — generated `CWEMetrics.to_dict()` benchmark JSON no longer echoes corpus-derived `cwe_name`; known tracked Juliet CWEs serialize through a deterministic allowlist and unknown CWEs fall back to the stable `CWE-*` id. RED regressions reproduced secret `cwe_name` leakage for known and unknown CWE rows; targeted regressions `2 passed`, benchmark/JULIET related tests `39 passed`, full `services/sast-runner` pytest gate `1156 passed in 30.63s`; Critic PASS.
- 2026-05-14: Juliet benchmark suite progress log redaction — per-suite benchmark logs no longer echo corpus-derived CWE directory suffixes (`suite.cwe_name`); progress logs keep only stable `CWE-*` key and file count. RED regression reproduced `SECRET_CWE_DIR_SUFFIX_SHOULD_NOT_LEAK` in logs from a malformed local Juliet directory; targeted regression `1 passed`, Juliet/benchmark related tests `37 passed`, full `services/sast-runner` pytest gate `1154 passed in 30.49s`; Critic PASS.
- 2026-05-14: Juliet benchmark custom-rules setting restoration — `run_benchmark(custom_rules=false)` now restores `settings.custom_rules_dir` via `try/finally` across normal completion, no-suite early return, and discovery exceptions, preventing global benchmark/tool-state contamination. RED regressions reproduced stale `None` after no-suite return and missing-`testcases` `FileNotFoundError`; targeted regressions `2 passed`, Juliet/benchmark related tests `36 passed`, full `services/sast-runner` pytest gate `1153 passed in 30.80s`; Critic PASS.
- 2026-05-14: Juliet benchmark no-suite log path redaction — offline Juliet benchmark selection failures no longer log host-local `juliet_root` or requested CWE list when `testcases/` exists but no suite matches the requested selection. RED regression reproduced `SECRET_JULIET_EMPTY_SELECTION_ROOT_SHOULD_NOT_LEAK` in benchmark logs; targeted regression `1 passed`, Juliet/benchmark related tests `34 passed`, full `services/sast-runner` pytest gate `1151 passed in 30.34s`; Critic PASS.
- 2026-05-14: Durable ownership request-id conflict error-envelope standardization — cross-endpoint reuse of an active durable `X-Request-Id` still fails with HTTP 409 and preserves top-level `error`/`requestId` plus `existingEndpoint`/`requestedEndpoint`/`statusUrl`/`resultUrl`, but now also returns `success=false` and `errorDetail{code="REQUEST_ID_CONFLICT",message,requestId,retryable=false}`. RED regression reproduced the missing `success` envelope; targeted regression `1 passed`, request ownership + scan endpoint tests `113 passed`, full `services/sast-runner` pytest gate `1150 passed in 30.49s`; Critic PASS.
- 2026-05-14: Durable ownership missing/expired error-envelope standardization — `/v1/requests/{requestId}`, `/result`, and cancel missing/expired branches now preserve top-level `error`/`requestId` and HTTP 404/410 while adding `success=false` and `errorDetail{code,message,requestId,retryable=false}`. RED regressions reproduced missing envelopes on `REQUEST_NOT_FOUND`/`REQUEST_EXPIRED`; targeted regressions `2 passed`, request ownership + scan endpoint tests `113 passed`, full `services/sast-runner` pytest gate `1150 passed in 30.32s`; Critic PASS.
- 2026-05-14: Direct preflight 400 error-shape standardization — `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` direct validation branches now preserve legacy `error` messages and HTTP 400 while adding `success=false` and `errorDetail{code,message,requestId,retryable=false}`. Stable codes are `PROJECT_PATH_REQUIRED`, `PROJECT_PATH_NOT_FOUND`, and `BUILD_COMMAND_REQUIRED`. RED regressions reproduced missing `success`/`errorDetail` on representative branches; targeted regressions `6 passed`, scan endpoint suite `103 passed`, full `services/sast-runner` pytest gate `1150 passed in 30.61s`; Critic PASS.
- 2026-05-14: Request-validation `loc` context-aware map-key redaction — 422 location sanitization now also redacts safe-looking caller-controlled map keys when they appear under `buildEnvironment`, `defines`, or `environment`. Known schema field names and integer indices remain useful, but map-key segments such as `buildEnvironment.environment` and `buildProfile.defines.compiler` become `<field>`. RED regressions reproduced both leaks; targeted regressions `4 passed`, related scan endpoint/startup tests `105 passed`, full `services/sast-runner` pytest gate `1150 passed in 30.06s`; Critic PASS.
- 2026-05-14: Request-validation `loc` dynamic-key redaction — sanitized 422 `validationErrors[].loc` no longer passes through caller-controlled mapping keys such as `buildEnvironment` entries. Known schema/transport field names and integer indices remain useful, but all non-allowlisted string loc parts become `<field>`. RED regression reproduced a secret dynamic environment key leaking through `validationErrors[0].loc`; targeted regressions `2 passed`, related scan endpoint/startup tests `103 passed`, full `services/sast-runner` pytest gate `1148 passed in 30.36s`; Critic PASS.
- 2026-05-14: FastAPI/Pydantic 422 request-validation error redaction — pre-router `RequestValidationError` responses no longer use FastAPI's raw `detail[].input` echo. Malformed request bodies still return HTTP 422, but public JSON now uses fixed `REQUEST_VALIDATION_FAILED` / `request validation failed`, sanitized structural `validationErrors[]`, and `X-Request-Id`/`errorDetail.requestId` propagation; logs carry only safe count/location metadata. RED regression reproduced a nested secret object leaking through `detail[0].input`; targeted regression `1 passed`, related scan endpoint/router logging/startup tests `103 passed`, full `services/sast-runner` pytest gate `1147 passed in 30.79s`; Critic PASS.
- 2026-05-14: Public `SCAN_TOOL_INVALID` unknown tool-id redaction — unsupported `options.tools[]` values still fail early with HTTP 400, `SCAN_TOOL_INVALID`, and `retryable=false`, but sync `/v1/scan`, NDJSON validation JSON, `/v1/build-and-analyze` pre-build validation, router logs, and request summaries no longer echo caller-supplied unknown tool IDs. The response keeps safe current-six allowed-tool guidance. RED regressions reproduced raw secret tool-id leakage in response/log surfaces; targeted regressions `3 passed`, related scan endpoint/sdk/orchestrator tests `185 passed`, full `services/sast-runner` pytest gate `1146 passed in 30.61s`; Critic PASS.
- 2026-05-14: Public `SDK_NOT_FOUND` sdkId redaction — unknown bare `sdkId` still fails early with HTTP 400, `SDK_NOT_FOUND`, and `retryable=false`, but `/v1/scan` sync JSON, NDJSON validation JSON, `/v1/build-and-analyze` pre-build validation, router logs, and health request summaries no longer echo the caller-supplied SDK identifier. Guidance remains fixed/value-free (`registered sdkId`, `sdkResolutionMode='non-registered'`, `sdkResolutionMode='none'`). RED regressions reproduced raw secret sdkId leakage in response/log surfaces; targeted regressions `5 passed`, related scan endpoint/sdk/orchestrator tests `184 passed`, full `services/sast-runner` pytest gate `1145 passed in 29.57s`; Critic PASS.
- 2026-05-14: Router structured-log SDK identity redaction — `Scan started` and `Scan execution summary` logs no longer emit raw `sdkId`; they expose value-free `sdkIdProvided` and `executionSdkIdProvided` booleans. The static router logging guard now forbids literal `sdkId` logger extra keys together with raw path/command keys. RED static guard reproduced both offenders (`scan.py` scan-start and scan-summary); targeted regressions `2 passed`, related scan router/endpoint/sdk/orchestrator tests `185 passed`, full `services/sast-runner` pytest gate `1145 passed in 28.32s`; Critic PASS.
- 2026-05-14: Public finding/dataFlow external absolute path redaction — retained cross-boundary findings now preserve shape but redact raw external SDK/system roots in `location.file`, `dataFlow[].file`, and `metadata.evidenceResolution.location.file`; internal filtering still runs on raw parser paths before public projection. RED regressions covered retained cross-boundary secret path leakage and verified filter stats remained unchanged; targeted regressions `2 passed`, related orchestrator/parser/endpoint/static-evidence tests `268 passed`, full `services/sast-runner` pytest gate `1144 passed in 28.47s`; Critic PASS.
- 2026-05-14: `/v1/includes` dependency path public evidence redaction — include dependency lists no longer expose absolute host/SDK paths. Project-local absolute dependencies are normalized to scan-root-relative paths, and external absolute dependencies are represented as `<external>/<basename>` or `<external>/<unknown>` while preserving the response shape. RED regressions reproduced raw `/tmp/SECRET_INCLUDE_ROOT/...` leakage in the resolver/endpoint path; targeted regressions `12 passed`, related include/scan endpoint/static-evidence tests `143 passed`, full `services/sast-runner` pytest gate `1142 passed in 28.74s`; Critic PASS.
- 2026-05-14: SDK execution-report root-path public evidence redaction — `/v1/scan` `execution.sdk` no longer exposes raw `sdkDescriptor.sdkRootPath`; the legacy `sdkRootPath` field is nullable/omitted on the wire and additive `sdkRootPathStatus` carries status-only evidence (`configured`/`not-configured`). Non-registered SDK resolution and include/compiler enrichment still use the descriptor path internally. RED regressions reproduced raw SDK root leakage in producer and endpoint response; targeted regressions `2 passed`, related orchestrator/sdk contract/scan endpoint/sdk resolver/static-evidence tests `254 passed`, full `services/sast-runner` pytest gate `1136 passed in 28.63s`; Critic PASS.
- 2026-05-14: Startup runtime `logDir` structured-log redaction — `SAST Runner runtime configuration` logs no longer emit raw log directory paths; they expose value-free `logDirConfigured` and `logDirSource` while `_setup_logging()` still uses the actual path internally for file handlers. RED regression reproduced secret `settings.log_dir` exposure/missing status in startup lifespan logging; startup logging tests `2 passed`, related startup+scan endpoint tests `98 passed`, full `services/sast-runner` pytest gate `1117 passed in 28.54s`; Critic PASS.
- 2026-05-14: Runtime tool availability expected-executable-path redaction — `ScanOrchestrator.check_tools()` and defensive runtime consumers now expose only `expectedExecutablePathStatus` (`configured`/`not-configured`) instead of raw `expectedExecutablePath` paths in `/v1/health`, startup degraded-tool logs, and required-tool preflight failure metadata/logs. Availability, version, `probeReason`, and policy behavior are preserved. RED regressions reproduced raw path exposure/missing status in producer, health, startup, and preflight surfaces; targeted regressions `4 passed`, related orchestrator/scan endpoint/startup tests `173 passed`, full `services/sast-runner` pytest gate `1116 passed in 28.41s`; Critic PASS.
- 2026-05-14: LibraryDiffer `_compute_diff()` path sanitization — SCA diff evidence from `diff --brief` parsing now emits only resolved library-relative source paths for `modifications[].file` and additive `addedFilesList[]`; raw `Only in ...` lines, host-local library roots, upstream/cache paths, and outside-root modified rows are ignored instead of echoed. `addedFiles` remains the filtered integer count. RED regressions reproduced missing sanitized `addedFilesList` for root/subdir added files and raw outside modified-row fallback; targeted regressions `2 passed`, LibraryDiffer tests `24 passed`, related library/SCA/scan endpoint tests `141 passed`, full `services/sast-runner` pytest gate `1113 passed in 28.45s`; Critic PASS.
- 2026-05-14: Unknown internal exception surface sanitization — unexpected non-domain exceptions in `/v1/scan` sync/NDJSON, direct `_error_response()` endpoints such as `/v1/build`, `/v1/build-and-analyze` summary paths, durable ownership result payloads, health `requestSummary.blockedReason`, and structured logs now use fixed `"internal error"` / `INTERNAL_ERROR` surfaces with safe `exceptionType` metadata only. Known `SastRunnerError` and `PolicyViolationError` messages remain unchanged. RED regressions reproduced raw secret exception leakage in build response/log/summary, NDJSON event/log/summary, sync scan response/log/summary, and durable async result/summary; targeted regressions `4 passed`, scan endpoint + request ownership tests `105 passed`, full `services/sast-runner` pytest gate `1111 passed in 28.84s`; Critic PASS.
- 2026-05-14: BuildRunner API evidence output/excerpt sanitization — `/v1/build` and nested `/v1/build-and-analyze` build results now retain `buildEvidence.buildOutput` as a string/null field but replace nonblank raw stdout/stderr with fixed `"build output omitted"`; BuildRunner `failureDetail.matchedExcerpt` remains present but is nullable and no longer echoes raw loader/command/build output lines. `requestedBuildCommand`, `effectiveBuildCommand`, `buildDir`, and `compileCommandsPath` remain existing explicit evidence fields. RED regressions reproduced success stdout/stderr, compile-commands failure stdout/stderr, shared-library loader-line, and exit127 stderr leakage; targeted regressions `4 passed`, BuildRunner tests `21 passed`, related build/scan/request-ownership tests `123 passed`, full `services/sast-runner` pytest gate `1108 passed in 25.48s`; Critic PASS.
- 2026-05-14: Drive-qualified relative files[] path hardening — `_validate_path()` now rejects Windows drive-qualified relative path forms like `C:foo.c` / `z:foo.c` with stable `Absolute path not allowed` diagnostics while preserving arbitrary colon filenames such as `src:main.c`; RED helper regressions reproduced two drive-qualified relative bypasses, targeted path validation `9 passed`, scan endpoint + path validation tests `102 passed`, related scan/request-ownership/sdk/static-evidence tests `152 passed`, full `services/sast-runner` pytest gate `1104 passed in 25.20s`; Critic PASS.
- 2026-05-14: gcc/scan-build per-file source log sanitization — gcc-fanalyzer and scan-build per-file failure/timeout warning logs now use value-free categories plus safe timeout seconds instead of source file identifiers; findings, progress callbacks, runtime counters, and API responses are unchanged; RED caplog regressions reproduced secret source filename leakage in four surfaces, targeted regressions `4 passed`, affected gcc/scan-build runner tests `31 passed`, related gcc/scan-build/orchestrator/scan endpoint tests `199 passed`, full `services/sast-runner` pytest gate `1101 passed in 25.21s`; Critic PASS.
- 2026-05-14: gcc-fanalyzer compiler path log sanitization — `GccAnalyzerRunner.run()` and unsupported SDK fallback logs now use value-free category/count/boolean fields instead of raw compiler executable paths; execution, findings, and API responses are unchanged; RED caplog regressions reproduced secret compiler path leakage in start and fallback logs, targeted regressions `2 passed`, gcc-analyzer tests `18 passed`, related gcc/orchestrator/scan endpoint tests `186 passed`, full `services/sast-runner` pytest gate `1099 passed in 25.40s`; Critic PASS.
- 2026-05-14: files[] Windows/backslash path validation hardening — `_validate_path()` now rejects backslash-normalized traversal, Windows drive absolute paths, and UNC/backslash-root paths with fixed value-free `Path traversal not allowed` / `Absolute path not allowed` diagnostics while preserving safe relative POSIX and `src\main.c` compatibility; RED helper regressions reproduced four unsafe bypasses, targeted path validation `6 passed`, scan endpoint + path validation tests `99 passed`, related scan/request-ownership/sdk/static-evidence tests `149 passed`, full `services/sast-runner` pytest gate `1097 passed in 25.26s`; Critic PASS.
- 2026-05-14: BuildRunner log surface sanitization — `BuildRunner.discover_targets()` and `BuildRunner.build()` start logs now use value-free category/count/boolean fields instead of raw project paths or caller build commands; API/evidence response fields are unchanged; RED caplog regressions reproduced secret project path and command leakage, targeted regressions `2 passed`, BuildRunner tests `17 passed`, related build/scan/request-ownership tests `119 passed`, full `services/sast-runner` pytest gate `1091 passed in 25.53s`; Critic PASS.
- 2026-05-14: Simple runner command-start log sanitization — Semgrep, Cppcheck, and Flawfinder no longer log joined CLI commands or caller path fragments on command start; logs retain stable category plus count/boolean metadata only; RED caplog regressions reproduced secret scan/rules/include path leakage and command flags in all three runners, targeted regressions `3 passed`, affected runner tests `46 passed`, related runner/orchestrator/scan endpoint tests `214 passed`, full `services/sast-runner` pytest gate `1089 passed in 25.99s`; Critic PASS.
- 2026-05-14: Router structured-log raw path/command extra sanitization — `scan.py` router logger extras now use value-free presence fields instead of raw `projectPath`, `buildCommand`, `requestedBuildCommand`, `effectiveBuildCommand`, or `compileCommandsPath`; API response payloads are unchanged; RED static AST gate found 14 forbidden logger extra offenders, targeted AST gate `1 passed`, scan endpoint + static gate tests `94 passed`, related scan/request-ownership/sdk/static-evidence tests `144 passed`, full `services/sast-runner` pytest gate `1086 passed in 25.32s`; Critic PASS.
- 2026-05-14: files[] path validation raw-echo sanitization — `/v1/scan`, `/v1/functions`, and `/v1/includes` absolute/traversal `files[].path` validation failures now return fixed `Absolute path not allowed` / `Path traversal not allowed` messages without caller-provided file-path echo while preserving status 400 and `NO_FILES_PROVIDED` code; RED reproduced secret path leakage in four endpoint/error-shape regressions, targeted regressions `4 passed`, scan endpoint tests `93 passed`, related scan/request-ownership/sdk/static-evidence tests `143 passed`, full `services/sast-runner` pytest gate `1085 passed in 25.66s`; Critic PASS.
- 2026-05-14: NoFilesError projectPath-not-found API response sanitization — `_prepare_scan_dir()`-based `/v1/scan`, `/v1/functions`, `/v1/includes`, plus `/v1/libraries`, now return fixed `projectPath not found` errors without caller-provided path echo while preserving status 400 and response shapes; RED reproduced secret path leakage in four endpoints, targeted regressions `4 passed`, scan endpoint tests `91 passed`, related scan/request-ownership/sdk/static-evidence tests `141 passed`, full `services/sast-runner` pytest gate `1083 passed in 25.05s`; Critic PASS.
- 2026-05-14: Direct projectPath-not-found API response sanitization — `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` now return fixed `projectPath not found` validation errors without caller-provided project path echo while preserving status codes and response shape; RED reproduced secret path leakage in all three endpoints, targeted regressions `3 passed`, scan endpoint tests `87 passed`, related scan/request-ownership/sdk/static-evidence tests `137 passed`, full `services/sast-runner` pytest gate `1079 passed in 25.59s`; Critic PASS.
- 2026-05-14: SCA library identity path-log sanitization — library identification summary and permission-denied scan logs now emit count/category-only messages without project roots, child paths, or permission exception detail while preserving returned library metadata; production `/v1/scan` response schema 변경 없음; RED reproduced secret project/permission path leakage, targeted regressions `2 passed`, library identifier tests `13 passed`, related library/SCA/static-evidence/scan endpoint tests `155 passed`, full `services/sast-runner` pytest gate `1078 passed in 25.64s`; Critic PASS.
- 2026-05-14: SCA diff failure log sanitization — SCA library diff failures now log a fixed category without project-derived library names or raw diff exception text while preserving fail-soft `diff=null` behavior; production `/v1/scan` response schema 변경 없음; RED reproduced secret library/exception log leakage, targeted regression `1 passed`, SCA service tests `9 passed`, related SCA/scan/static-evidence/quality tests `143 passed`, full `services/sast-runner` pytest gate `1076 passed in 24.89s`; Critic PASS.
- 2026-05-14: Orchestrator tool exception surface sanitization — per-tool task exceptions now emit category-only warning logs and `execution.toolResults[].skipReason="tool-execution-failed"` without raw exception text while preserving fail-soft execution report semantics; production `/v1/scan` response schema 변경 없음; RED reproduced raw exception leakage in logs and execution JSON, targeted regression `1 passed`, orchestrator tests `75 passed`, related orchestrator/scan endpoint/static-evidence/quality tests `209 passed`, full `services/sast-runner` pytest gate `1076 passed in 24.97s`; Critic PASS.
- 2026-05-14: SDK validation error-surface sanitization — SDK helper validation errors now use value-free category strings for missing SDK path/sysroot/environment setup/compiler checks without host path, sysroot, setup, or compiler-prefix echo; production `/v1/scan` response schema 변경 없음; RED reproduced validation error leakage, targeted regressions `4 passed`, SDK resolver tests `37 passed`, related SDK/build/scan endpoint tests `152 passed`, full `services/sast-runner` pytest gate `1075 passed in 25.47s`; Critic PASS.
- 2026-05-14: SDK include-path resolution log sanitization — SDK include-path success/missing-directory/missing-sysroot logs now emit category/count-only messages without caller sdkId, SDK root/base paths, or sysroot paths while preserving include-path return semantics; production `/v1/scan` response schema 변경 없음; RED reproduced sdkId/root/base/sysroot log leakage, targeted regressions `3 passed`, SDK resolver tests `37 passed`, related SDK/build/scan endpoint tests `152 passed`, full `services/sast-runner` pytest gate `1075 passed in 24.79s`; Critic PASS.
- 2026-05-14: SDK registry load failure log sanitization — missing/malformed SDK registry loading now emits fixed categories without SDK root paths, registry filenames, or JSON/OSError detail while preserving fail-soft empty registry semantics; production `/v1/scan` response schema 변경 없음; RED reproduced secret SDK root path and JSON parser-detail leakage, targeted regressions `2 passed`, SDK resolver tests `34 passed`, related SDK/build/scan endpoint tests `149 passed`, full `services/sast-runner` pytest gate `1072 passed in 25.29s`; Critic PASS.
- 2026-05-14: AST dump failure log sanitization — advisory AST/codegraph extraction failures now emit a fixed category without source filenames or raw tool/parser exception text while preserving `None` fail-soft behavior; production `/v1/scan` response schema 변경 없음; RED reproduced secret filename/exception log leakage, targeted regression `1 passed`, AST dumper tests `14 passed`, related codegraph/static-evidence/scan endpoint tests `161 passed`, full `services/sast-runner` pytest gate `1070 passed in 25.00s`; Critic PASS.
- 2026-05-14: Build metadata macro extraction failure log sanitization — advisory gcc macro extraction failures now emit a fixed category without raw exception text while preserving fail-soft `{compiler, macros: {}, targetInfo: {}}` semantics; production `/v1/scan` response schema 변경 없음; RED reproduced secret exception log leakage, targeted regression `1 passed`, build metadata tests `23 passed`, related scanner/orchestrator/endpoint+runner tests `262 passed`, full `services/sast-runner` pytest gate `1069 passed in 25.33s`; Critic PASS.
- 2026-05-14: Scan-build plist parse failure log sanitization — malformed scan-build plist warnings now emit a fixed category without plist filenames or parser exception text while preserving fail-soft parsing of other plist files; production `/v1/scan` response schema 변경 없음; RED reproduced secret plist filename/parser-detail leakage, targeted regression `1 passed`, scan-build runner tests `11 passed`, related scanner/orchestrator/endpoint tests `187 passed`, full `services/sast-runner` pytest gate `1068 passed in 25.55s`; Critic PASS.
- 2026-05-14: Compile-analyzer per-file failure log sanitization — gcc-fanalyzer and scan-build per-file failure logs no longer echo raw exception text while preserving failed-file counts and partial execution semantics; production `/v1/scan` response schema 변경 없음; RED reproduced raw exception leakage in both runner logs, targeted regressions `2 passed`, gcc/scan-build runner tests `26 passed`, related scanner/orchestrator/endpoint tests `186 passed`, full `services/sast-runner` pytest gate `1067 passed in 26.83s`; Critic PASS.
- 2026-05-14: Semgrep runner raw stdout/stderr log sanitization — Semgrep empty-output and non-JSON output failure logs now emit fixed categories without raw stdout/stderr snippets, while preserving empty-SARIF fallback and `ToolOutputInvalidError` semantics; production `/v1/scan` response schema 변경 없음; RED reproduced raw Semgrep stderr/stdout log leakage, targeted regressions `2 passed`, Semgrep runner tests `22 passed`, related scanner/parser/orchestrator/endpoint tests `198 passed`, full `services/sast-runner` pytest gate `1065 passed in 24.84s`; Critic PASS.
- 2026-05-14: Juliet manifest missing-testcases path sanitization — offline Juliet discovery missing-`testcases/` failures now preserve `FileNotFoundError` semantics with a stable value-free diagnostic and no root path echo; production `/v1/scan` API 변경 없음; RED reproduced secret root path leakage, targeted regression `1 passed`, benchmark/JULIET related tests `33 passed`, full `services/sast-runner` pytest gate `1063 passed in 24.95s`; Critic PASS.
- 2026-05-14: Juliet benchmark scan-failure log sanitization — offline Juliet benchmark failure logs no longer echo raw orchestrator/tool exception text while preserving all-cases-FN fallback semantics; production `/v1/scan` API 변경 없음; RED reproduced secret exception log leakage, targeted regression `1 passed`, benchmark/JULIET related tests `32 passed`, full `services/sast-runner` pytest gate `1062 passed in 25.23s`; Critic PASS.
- 2026-05-14: SARIF parser malformed-output sanitization — Semgrep SARIF parser-shape failures now surface as stable `SARIF_PARSE_ERROR` diagnostics without parser internals, caller strings, or chained causes; production `/v1/scan` success schema 변경 없음; RED reproduced parser-detail leakage and raw `AttributeError` escape, targeted regressions `2 passed`, SARIF parser tests `16 passed`, related parser/scan/tool-output tests `114 passed`, full `services/sast-runner` pytest gate `1061 passed in 25.25s`; Critic PASS.
- 2026-05-14: Tool Output Compatibility fixture input error-surface sanitization — offline parser-compatibility evidence fixture reads now reject unsafe fixture paths and wrap missing/malformed fixture inputs with value-free diagnostics; production `/v1/scan` API 변경 없음; RED reproduced raw missing-fixture path, malformed SARIF parser diagnostic, and traversal leakage, targeted regressions `3 passed`, tool-output compatibility tests `12 passed`, related offline evidence/report tests `88 passed`, full `services/sast-runner` pytest gate `1059 passed in 25.33s`; Critic PASS.
- 2026-05-14: Tool Output Compatibility manifest/parserKind error-surface sanitization — offline parser-compatibility evidence loader now uses value-free diagnostics for unreadable/malformed/non-object manifests and unsupported parser kinds; production `/v1/scan` API 변경 없음; RED reproduced raw missing-path, parser, non-object, and parserKind leakage, targeted regressions `4 passed`, tool-output compatibility tests `9 passed`, related offline evidence/report tests `85 passed`, full `services/sast-runner` pytest gate `1056 passed in 25.01s`; Critic PASS.
- 2026-05-14: Benchmark Slice artifact loader error-surface sanitization — offline benchmark-slice quality-evidence loader now wraps unreadable/malformed/non-object artifacts with value-free diagnostics and suppresses raw paths/content/parser exception chains; production `/v1/scan` API 변경 없음; RED reproduced raw missing-path, parser, and non-object path leakage, targeted regressions `3 passed`, benchmark slice report tests `9 passed`, related offline evidence/report tests `81 passed`, full `services/sast-runner` pytest gate `1052 passed in 25.38s`; Critic PASS.
- 2026-05-14: Actual runner path-boundary exception-chain suppression — offline Tool Portfolio actual runner source-root and relative-base escape failures now suppress `Path.relative_to()` exception chains while preserving value-free category diagnostics; production `/v1/scan` API 변경 없음; RED reproduced chained secret absolute path leakage, targeted regressions `2 passed`, actual runner tests `20 passed`, related Tool Portfolio tests `425 passed`, full `services/sast-runner` pytest gate `1049 passed in 25.35s`; Critic PASS.
- 2026-05-14: Acquisition manifest real-calendar exception-chain suppression — offline Tool Portfolio acquisition manifest `downloadedAt` calendar-parse failures now suppress the underlying parser exception chain while preserving value-free field-only diagnostics; production `/v1/scan` API 변경 없음; RED reproduced parser `ValueError` cause leakage, targeted regression `1 passed`, acquisition manifest tests `46 passed`, related Tool Portfolio tests `423 passed`, full `services/sast-runner` pytest gate `1047 passed in 25.28s`; Critic PASS.
- 2026-05-14: Actual runner CLI input failure fail-closed handling — offline actual Tool Portfolio runner CLI now catches JSON input-loading `ValueError`s only, returns exit `1`, and emits fixed `input validation failed` stderr without traceback/path/content echo; production `/v1/scan` API 변경 없음; targeted CLI tests `2 passed`, actual runner tests `18 passed`, related Tool Portfolio tests `422 passed`, full `services/sast-runner` pytest gate `1046 passed in 24.95s`; Critic PASS.
- 2026-05-14: Juliet corpus file selection failure path redaction — offline corpus acquisition `_select_juliet_file()` now emits value-free missing-file diagnostics without host-local corpus/cache root path echo; production `/v1/scan` API 변경 없음; targeted helper test `1 passed`, corpus acquisition tests `14 passed`, related Tool Portfolio tests `420 passed`, full `services/sast-runner` pytest gate `1044 passed in 25.18s`; Critic PASS.
- 2026-05-14: Actual runner JSON input loader read/parse error-surface sanitization — offline actual Tool Portfolio runner `_load_json_object()` now wraps read/parse failures as value-free diagnostics without host-local path/content echo or chained causes; production `/v1/scan` API 변경 없음; targeted loader tests `3 passed`, actual runner tests `16 passed`, related Tool Portfolio tests `419 passed`, full `services/sast-runner` pytest gate `1043 passed in 24.94s`; Critic PASS.
- 2026-05-14: Corpus Readiness JSON object loader path redaction — offline readiness `_load_json_object()` now emits value-free non-object JSON diagnostics without host-local path echo, complementing CLI invalid-input sanitization; production `/v1/scan` API 변경 없음; targeted loader test `1 passed`, corpus readiness tests `36 passed`, related Tool Portfolio tests `416 passed`, full `services/sast-runner` pytest gate `1040 passed in 25.51s`; Critic PASS.
- 2026-05-14: Tool-set config validator error-surface sanitization — offline Tool Portfolio `validate_tool_set_config()` now emits value-free diagnostics for unknown current tools, WR-gated future configs, unknown config strings, and non-string configs while preserving valid current-six and `allow_future=True` behavior; production `/v1/scan` API 변경 없음; targeted config tests `6 passed`, experiment manifest tests `41 passed`, related Tool Portfolio tests `415 passed`, full `services/sast-runner` pytest gate `1039 passed in 25.23s`; Critic PASS.
- 2026-05-14: Decision-cycle forbidden runtime coupling guard error-surface sanitization — static no-network/no-LLM/no-S5 coupling guard now emits value-free diagnostics without host-local file paths or raw regex patterns; production `/v1/scan` API 변경 없음; targeted guard test `1 passed`, decision-cycle tests `4 passed`, related Tool Portfolio tests `410 passed`, full `services/sast-runner` pytest gate `1034 passed in 25.49s`; Critic PASS.
- 2026-05-14: Corpus acquisition local path/error-surface sanitization — offline corpus acquisition zip-member, outside-cache deletion, and checksum-mismatch diagnostics now use value-free categories without echoing member names, local paths, expected checksums, or actual checksums; production `/v1/scan` API 변경 없음; targeted acquisition helper tests `3 passed`, corpus acquisition tests `13 passed`, related Tool Portfolio tests `406 passed`, full `services/sast-runner` pytest gate `1033 passed in 25.46s`; Critic PASS.
- 2026-05-14: Acquisition manifest duplicate acquisitionId error-surface sanitization — offline Tool Portfolio acquisition index duplicate diagnostics now keep the stable `duplicate acquisitionId` category without echoing caller-controlled IDs; production `/v1/scan` API 변경 없음; targeted duplicate test `1 passed`, acquisition manifest tests `45 passed`, related Tool Portfolio tests `393 passed`, full `services/sast-runner` pytest gate `1030 passed in 25.07s`; Critic PASS.
- 2026-05-14: Experiment report forbidden-key guard error-surface sanitization — final offline Tool Portfolio report forbidden verdict-key guard now canonicalizes fixed literals and redacts arbitrary mapping path labels/object stringification in diagnostics; production `/v1/scan` API 변경 없음; targeted guard tests `3 passed`, experiment-report tests `240 passed`, related Tool Portfolio tests `392 passed`, full `services/sast-runner` pytest gate `1029 passed in 25.31s`; Critic PASS.
- 2026-05-14: Corpus manifest identity-field error-surface sanitization — offline Tool Portfolio corpus manifest identifiers (`caseId`, `expected.targetId`, explicit `lineageId`, external `acquisitionId`) now use a strict safe-id contract and value-free diagnostics for duplicates, lineage/source-artifact leakage, missing acquisitions, and checksum mismatches; absent public lineage falls back to safe `caseId`, not `sourceRef`; production `/v1/scan` API 변경 없음; targeted identity/error-surface tests `10 passed`, manifest+readiness tests `71 passed`, related Tool Portfolio tests `389 passed`, full `services/sast-runner` pytest gate `1026 passed in 24.78s`; Critic PASS.
- 2026-05-14: Corpus manifest forbidden-key error-surface sanitization — recursive forbidden verdict-key validation now avoids arbitrary parent mapping labels and canonicalizes forbidden-key objects before formatting errors; production `/v1/scan` API 변경 없음; targeted forbidden-key tests `4 passed`, manifest+readiness tests `61 passed`, related Tool Portfolio tests `379 passed`, full `services/sast-runner` pytest gate `1016 passed in 25.07s`; Critic PASS after initial BLOCK.
- 2026-05-14: Corpus manifest case checksum strictness — offline Tool Portfolio corpus manifest case `checksum` values now require exact `sha256:<64 lowercase hex>` so malformed prefix-valid values cannot leak through Corpus Readiness `expectedChecksum`; production `/v1/scan` API 변경 없음; targeted checksum tests `6 passed`, manifest+readiness tests `58 passed`, related Tool Portfolio tests `376 passed`, full `services/sast-runner` pytest gate `1013 passed in 25.22s`; Critic PASS.
- 2026-05-14: Corpus Readiness full caller-provided input sanitization — caller-provided offline `corpusReadinessGate` rejects unknown top-level fields, forbidden caller `inputValidation`, invalid schema/policy, malformed nested acquisition/case/summary/required-corpus-input/consistency evidence without raw echo; generated invalid required-corpus evidence and normalized inconsistent gates remain compatible; production `/v1/scan` API 변경 없음; focused corpus-readiness sanitization tests `13 passed`, experiment-report tests `237 passed`, full `services/sast-runner` pytest gate `1007 passed in 25.13s`; Critic PASS.
- 2026-05-14: System Stability Gate full non-pass input sanitization — caller-provided offline `systemStabilityGate` rejects unknown top-level fields, invalid schema/reason/requiredTools/phase failure evidence without raw echo; accepted non-pass generated/minimal/subset evidence remains compatible; version/path failures are redacted; production `/v1/scan` API 변경 없음; system-stability/system-gate tests `53 passed`, report+consumer tests `248 passed`, full `services/sast-runner` pytest gate `994 passed in 24.87s`; Critic PASS.
- 2026-05-06: `services/sast-runner` 전체 pytest 게이트 재확인 — `399 passed in 11.08s`.
- 2026-05-08: health-control v2 durable ownership slice — full `services/sast-runner` pytest gate 재확인: `407 passed in 11.47s`.
- 2026-05-08: SDK resolution contract + cancel endpoint gates — focused `tests/test_sdk_resolution_contract.py tests/test_request_ownership.py` 15 passed; related S4 gate 147 passed; full `services/sast-runner` pytest gate `414 passed in 13.83s`.
- 2026-05-11: evidence-resolution 고도화 — oracle fixture gate `tests/test_evidence_oracles.py` 12 passed; related S4 regression 132 passed; full `services/sast-runner` pytest gate `426 passed in 12.45s`.
- 2026-05-11: staticEvidenceContract v1 고도화 — static contract/golden corpus/report/governance gates 추가; focused oracle gates `8/5/4/4 passed`; full `services/sast-runner` pytest gate `447 passed in 13.28s`.
- 2026-05-11: S3-consumable staticEvidenceContract hardening — `toolEvidenceMatrix` 추가, Golden Corpus v1 evidence bundles/canaries 확장, non-registered SDK analyzer rescue 회귀 테스트 추가; full `services/sast-runner` pytest gate `471 passed in 13.33s`.
- 2026-05-11: per-tool anomaly gate propagation hardening — 성공 응답 내 tool `failed`/`partial`/degraded/blocking-skip/missing/unknown metadata가 `systemStability=degraded`, `staticToolExecution=partial`, `anomalyReasonCodes[]`로 전파됨을 고정; full `services/sast-runner` pytest gate `481 passed in 13.28s`.
- 2026-05-11: staticEvidenceContract consumer canaries — precomputed response JSON만 소비하는 harness를 추가해 top-level/nested contract, degraded/failed/missing/allowed-skip/policy-failure/absent/malformed/poisoned-raw-execution cases 고정; full `services/sast-runner` pytest gate `490 passed in 13.35s`.
- 2026-05-11: Tool Output Compatibility v1 — current six-tool parser output fixtures/manifest/report를 추가하고 governance `parserCompatibility` gate에 연결; full `services/sast-runner` pytest gate `496 passed in 13.08s`.
- 2026-05-11: Benchmark Slice Report v1 — pinned historical Juliet artifacts `v0.6.0-full.json`/`v0.7.0-all-variants.json`을 source-scoped quality evidence로 정리하고 governance `benchmarkSliceCoverage` gate에 연결; full `services/sast-runner` pytest gate `503 passed in 13.93s`.
- 2026-05-12: Tool-agnostic claim-support readiness hardening — `gates.claimSupportReadiness`와 `claimBoundaryMatrix[]`를 추가해 Quality Gate가 concrete SAST tool identity가 아니라 normalized evidence/claim boundaries 기준으로 판정함을 고정; full `services/sast-runner` pytest gate `516 passed in 12.94s`.
- 2026-05-12: Required-tool system-stability hardening — default `/v1/scan`은 current six 전체를 required tool set으로 삼고, preflight unavailable 또는 post-execution failed/partial/degraded/skipped/missing/unknown/non-normal required tool을 품질 문제가 아닌 시스템 안정성 실패로 fail-closed 처리; focused all-six gate `83 passed`, Critic RED unknown/non-normal reproduction `2 failed` before fix, related runner/API suite `210 passed in 13.04s`, full `services/sast-runner` pytest gate `641 passed in 25.79s`.
- 2026-05-12: Local Quality Gate threshold/oracle hardening — `s4-tool-portfolio-experiment-report-v1`가 validation/test/canary scoring 성공과 threshold 품질 판정을 분리하고 `qualityGate.localQualityAssessment`로 local oracle 품질 상태를 노출; focused tool-portfolio suite `64 passed in 0.12s`, full `services/sast-runner` pytest gate `642 passed in 25.47s`.
- 2026-05-12: Fresh S4 tool-liveness and docs-sync verification — `ScanOrchestrator.check_tools(force=True)` 기준 current six 모두 available, `policyStatus="ok"`, `unavailableTools=[]`: Semgrep `1.156.0`, Cppcheck `2.13.0`, Flawfinder `2.0.19`, clang-tidy `18.1.3`, scan-build probe OK, gcc-fanalyzer/GCC `13.3.0`; full `services/sast-runner` pytest gate `642 passed in 25.57s`.
- 2026-05-13: Corpus Readiness Gate v1 — offline `s4-tool-portfolio-experiment-report-v1`에 `corpusReadinessGate`를 추가해 required external corpus local path/file/checksum/split readiness를 검증하고, `decisionSupport.externalCorpusStatus`를 readiness에서 파생; production `/v1/scan` API 변경 없음; focused tool-portfolio suite `70 passed in 0.12s`, full `services/sast-runner` pytest gate `648 passed in 24.66s`.
- 2026-05-13: Corpus Readiness Gate CLI/fail-closed hardening — `python -m benchmark.tool_portfolio_corpus_readiness` offline preflight 추가, required corpus 미선언은 `CORPUS_REQUIRED_CORPORA_NOT_DECLARED`로 blocked; production `/v1/scan` API 변경 없음; readiness tests `9 passed in 0.06s`, focused tool-portfolio suite `73 passed in 0.14s`, full `services/sast-runner` pytest gate `651 passed in 24.43s`.
- 2026-05-13: Corpus Readiness authoritative report merge — offline report composition에서 `corpusReadinessGate`가 legacy `external_corpus_status`보다 우선하도록 고정해 readiness `not_run`/`blocked`가 available status에 의해 숨겨지지 않음; production `/v1/scan` API 변경 없음; readiness/report tests `19 passed in 0.08s`, focused tool-portfolio suite `76 passed in 0.12s`, full `services/sast-runner` pytest gate `654 passed in 23.96s`.
- 2026-05-13: System Stability Gate required-tools fail-closed hardening — offline report-side system gate에서 empty required tool set은 `SYSTEM_REQUIRED_TOOLS_NOT_DECLARED`, unknown required tool은 `REQUIRED_TOOL_UNKNOWN` preflight failure로 차단; production `/v1/scan` API 변경 없음; system-stability tests `33 passed in 0.04s`, focused tool-portfolio suite `79 passed in 0.13s`, full `services/sast-runner` pytest gate `657 passed in 23.89s`.
- 2026-05-13: System Stability Gate `not_run` decision-grade hardening — offline report-side `systemStabilityGate.status="not_run"`이 local quality threshold pass를 final `qualityGate.status="pass"`로 승격시키지 못하도록 고정; production `/v1/scan` API 변경 없음; experiment-report/system-stability tests `43 passed in 0.09s`, focused tool-portfolio suite `80 passed in 0.14s`, full `services/sast-runner` pytest gate `658 passed in 24.44s`.
- 2026-05-13: System Stability Gate `qualityGateAllowed` invariant hardening — offline report-side `qualityGateAllowed=true`는 `systemStabilityGate.status="pass"`에만 허용하고 default/precomputed `not_run` gate는 false로 정렬; production `/v1/scan` API 변경 없음; experiment-report/system-stability tests `44 passed in 0.09s`, focused tool-portfolio suite `81 passed in 0.13s`, full `services/sast-runner` pytest gate `659 passed in 23.36s`.
- 2026-05-13: Local Quality Gate `requiredSplits` fail-closed hardening — offline report-side threshold config에서 explicit empty/blank-only required splits를 `QUALITY_REQUIRED_SPLITS_NOT_DECLARED`로 fail-closed; production `/v1/scan` API 변경 없음; experiment-report tests `12 passed in 0.08s`, focused tool-portfolio suite `83 passed in 0.14s`, full `services/sast-runner` pytest gate `661 passed in 23.39s`.
- 2026-05-13: Local Quality Gate threshold-criteria fail-closed hardening — offline report-side threshold config에서 recall/precision/negative-FPR 기준이 모두 없으면 `QUALITY_THRESHOLDS_NOT_DECLARED`로 fail-closed; production `/v1/scan` API 변경 없음; experiment-report tests `13 passed in 0.08s`, focused tool-portfolio suite `84 passed in 0.13s`, full `services/sast-runner` pytest gate `662 passed in 23.92s`.
- 2026-05-13: Local Quality Gate threshold-value validation hardening — offline report-side threshold config에서 declared threshold 값이 numeric/finite/`[0.0, 1.0]` 조건을 만족하지 않으면 `QUALITY_THRESHOLD_VALUE_INVALID`로 fail-closed; production `/v1/scan` API 변경 없음; experiment-report tests `17 passed in 0.09s`, focused tool-portfolio suite `88 passed in 0.16s`, full `services/sast-runner` pytest gate `666 passed in 24.50s`.
- 2026-05-13: Local Quality Gate primary-tool-set config validation hardening — offline report-side `primaryToolSetConfig`는 absent/null일 때만 `full-current-six` default를 허용하고 explicit invalid 값은 `QUALITY_PRIMARY_TOOL_SET_CONFIG_INVALID`로 fail-closed; production `/v1/scan` API 변경 없음; experiment-report tests `23 passed in 0.10s`, focused tool-portfolio suite `94 passed in 0.17s`, full `services/sast-runner` pytest gate `672 passed in 24.34s`.
- 2026-05-13: System Stability Gate consistency validation hardening — offline report-side caller-provided system gate의 `status`/`qualityGateAllowed` 모순을 `SYSTEM_STABILITY_GATE_INCONSISTENT`로 fail/blocked 정규화; production `/v1/scan` API 변경 없음; experiment-report tests `26 passed in 0.12s`, focused tool-portfolio suite `97 passed in 0.19s`, full `services/sast-runner` pytest gate `675 passed in 25.11s`.
- 2026-05-13: findings_by_config payload/element shape validation hardening — offline report-side findings input이 non-mapping, required config 누락, invalid config value, invalid finding element이면 `FINDINGS_BY_CONFIG_INPUT_INVALID`로 fail-closed하고 oracle-derived scored metrics를 만들지 않음; production `/v1/scan` API 변경 없음; experiment-report tests `48 passed in 0.17s`, focused tool-portfolio suite `121 passed in 0.24s`, full `services/sast-runner` pytest gate `706 passed in 25.62s`.
- 2026-05-13: System Stability Gate payload/nested phase validation hardening — offline report-side caller-provided `systemStabilityGate` non-mapping payloads and malformed `status="pass"` requiredTools/phase evidence fail closed with `SYSTEM_STABILITY_GATE_INPUT_INVALID`; fail/not_run minimal evidence is preserved; inconsistent non-pass gates with malformed phases normalize to `SYSTEM_STABILITY_GATE_INCONSISTENT` without crashing; production `/v1/scan` API 변경 없음; experiment-report tests `73 passed in 0.25s`, focused tool-portfolio suite `146 passed in 0.30s`, full `services/sast-runner` pytest gate `731 passed in 26.11s`.
- 2026-05-13: Corpus Readiness Gate payload/proof validation hardening — offline report-side caller-provided `corpusReadinessGate` non-mapping/empty/invalid payloads fail closed with `CORPUS_READINESS_GATE_INPUT_INVALID`; forged `available` gates must bind required corpora to acquisition statuses, case statuses, checked/split summary, and external projection acquisition IDs; non-available gates always project `requiredCorpusReadiness` from top-level blockers; production `/v1/scan` API 변경 없음; experiment-report tests `107 passed in 0.33s`, focused tool-portfolio suite `180 passed in 0.42s`, full `services/sast-runner` pytest gate `765 passed in 25.63s`.
- 2026-05-13: legacy external_corpus_status authority separation — offline report-side legacy `external_corpus_status` remains compatibility context but no longer gates final quality or requiredFollowUps when `corpusReadinessGate` is authoritative available; production `/v1/scan` API 변경 없음; experiment-report tests `108 passed in 0.33s`, focused tool-portfolio suite `181 passed in 0.41s`, full `services/sast-runner` pytest gate `766 passed in 25.52s`.
- 2026-05-13: Oracle matchingPolicy semantic validation hardening — offline report-side `matchingPolicy`는 canonical v1 schema, allowed keys, integer `lineWindowDefault` in `[0,25]`, boolean `functionFallbackDefault`만 허용하고 invalid semantic fields를 `ORACLE_MATCHING_POLICY_INPUT_INVALID`로 fail-closed; production `/v1/scan` API 변경 없음; matching-policy focused tests `13 passed in 0.07s`, experiment-report tests `117 passed in 0.36s`, focused tool-portfolio suite `191 passed in 0.59s`, full `services/sast-runner` pytest gate `775 passed in 25.41s`.
- 2026-05-13: legacy external_corpus_status context sanitation hardening — offline report-side legacy `external_corpus_status` context는 reserved/readiness-owned keys, forbidden vocabulary, malformed sequences, invalid statuses를 omitted+sanitized validation failure로 처리하고 final quality/readiness follow-up gating에는 영향 없음; production `/v1/scan` API 변경 없음; targeted legacy-context tests `7 passed in 0.07s`, experiment-report tests `123 passed in 0.40s`, focused tool-portfolio suite `197 passed in 0.61s`, full `services/sast-runner` pytest gate `781 passed in 25.68s`.
- 2026-05-13: Report identity/provenance validation hardening — offline report-side `runId`/`createdAt`/`phase`를 decision-cycle 생성 전 검증하고 invalid identity는 safe placeholder + sanitized `reportIdentityValidation`으로 fail-closed; invalid phase crash와 trailing-newline raw leakage 차단; production `/v1/scan` API 변경 없음; targeted identity tests `12 passed in 0.07s`, experiment-report tests `135 passed in 0.39s`, focused tool-portfolio suite `209 passed in 0.63s`, full `services/sast-runner` pytest gate `793 passed in 25.10s`.
- 2026-05-14: Nested SCA diff repository URL evidence sanitization — public `diffSummary.repoUrl` and `/v1/libraries` nested `entry.diff.repoUrl` mappings now strip URL userinfo, query, and fragment even if a caller/test-double supplies raw diff mappings; diff mappings are shallow-copied before sanitization and raw top-level repo URLs still flow into internal differ calls; targeted tests `2 passed in 0.03s`, related repository/SCA/evidence/differ/scan endpoint tests `153 passed in 14.90s`, full `services/sast-runner` pytest gate `1135 passed in 28.55s`; Critic PASS.
- 2026-05-14: SCA repository URL public evidence credential sanitization — public SCA `repoUrl`/`remoteUrl` evidence now strips URL userinfo, query, and fragment while preserving safe scheme/host/port/path repository identity; raw URLs remain available internally for clone/fetch/diff; schema fields are unchanged; targeted tests `9 passed in 0.04s`, related repository/library/differ/SCA/evidence/scan endpoint tests `165 passed in 14.97s`, full `services/sast-runner` pytest gate `1133 passed in 28.46s`; Critic PASS.
- 2026-05-14: BuildMetadata public compiler identity path sanitization — `/v1/metadata` and nested build metadata `compiler` evidence now emits compiler executable identity plus version rather than host-local SDK compiler paths; subprocess execution and version probing still use the real path internally; RED reproduced POSIX and Windows-like compiler path leakage in success/fail-soft metadata; targeted tests `2 passed in 0.03s`, related build-metadata + scan endpoint tests `121 passed in 14.90s`, full `services/sast-runner` pytest gate `1124 passed in 28.73s`; Critic PASS.
- 2026-05-14: LibraryDiffer CloneCache repo URL log sanitization — `CloneCache.get_or_clone()` debug HIT/MISS logs now emit category/age/freshness only without raw repository URLs, tokens, internal hosts, or repo paths; clone/fetch URL usage, cache keying, returned cache paths, and diff/API evidence behavior are unchanged; RED reproduced two leaking log surfaces; targeted tests `2 passed in 0.03s`, related library/SCA/scan endpoint tests `131 passed in 15.15s`, full `services/sast-runner` pytest gate `1122 passed in 28.48s`; Critic PASS.
- 2026-05-14: SDK registry/enrichment log identity/path sanitization — `register_sdk()`/`unregister_sdk()` and `ScanOrchestrator._enrich_profile_with_sdk()` logs now emit category/count-only messages without raw sdkId, SDK installation paths, or include paths; registry storage, SDK resolution internals, and public API/evidence fields are unchanged; RED reproduced three leaking log surfaces; targeted tests `3 passed in 0.03s`, SDK resolver + orchestrator tests `116 passed in 0.12s`, full `services/sast-runner` pytest gate `1120 passed in 28.44s`; Critic PASS.
- 2026-05-14: Consumer canary guard for `QUALITY_REQUIRED_SPLITS_INVALID` — S4-owned offline report consumer summary now explicitly tests that invalid required split config is a safe non-decision-grade quality failure reason and not unsafe projection; production `/v1/scan` API 변경 없음; targeted consumer test `1 passed in 0.05s`, report+consumer tests `233 passed in 0.67s`, all Tool Portfolio/evidence tests `417 passed in 1.23s`, full `services/sast-runner` pytest gate `979 passed in 25.20s`; Critic PASS.
- 2026-05-14: Dedicated invalid `requiredSplits` Quality Gate reason — offline report-side local quality now returns `QUALITY_REQUIRED_SPLITS_INVALID` for unknown/non-string/malformed `thresholds.requiredSplits` entries instead of `SPLIT_METRICS_MISSING`, skips split scoring for invalid split configuration, and preserves sanitized threshold snapshots; production `/v1/scan` API 변경 없음; targeted tests `6 passed, 203 deselected`, report+consumer tests `232 passed in 0.66s`, focused report/canary/oracle/readiness/actual/manifest tests `307 passed in 0.79s`, all Tool Portfolio/evidence tests `416 passed in 1.26s`, full `services/sast-runner` pytest gate `978 passed in 24.76s`; Critic PASS.
- 2026-05-14: Tool Portfolio threshold/primaryToolSetConfig/requiredSplits diagnostic sanitization — offline report-side local-quality diagnostics and threshold snapshots redact arbitrary config keys/values, omit unknown threshold keys, sanitize non-JSON diagnostic paths, and preserve fail-closed `<invalid>` required split semantics; production `/v1/scan` API 변경 없음; targeted tests `10 passed, 197 deselected`, experiment-report tests `207 passed in 0.65s`, focused report/oracle/canary/readiness/actual/manifest tests `305 passed in 0.83s`, all Tool Portfolio/evidence tests `414 passed in 1.23s`, full `services/sast-runner` pytest gate `976 passed in 25.52s`; Critic PASS after initial requiredSplits/precedence BLOCK.
- 2026-05-13: Decision-cycle threshold JSON-serializability hardening — offline report-side `thresholds`가 decision-cycle checksum 전에 JSON-safe인지 검증되고 object/set payload는 sanitized deterministic checksum surrogate + `QUALITY_THRESHOLDS_INPUT_INVALID`로 fail-closed; production `/v1/scan` API 변경 없음; targeted non-json threshold tests `3 passed in 0.06s`, threshold focused tests `12 passed in 0.08s`, focused tool-portfolio suite `212 passed in 0.64s`, full `services/sast-runner` pytest gate `796 passed in 24.89s`.
- 2026-05-13: Acquisition manifest strict schema/checksum hardening — offline corpus acquisition manifest는 required/known optional fields만 허용하고 unknown/non-string fields 및 non-JSON values를 checksum 계산 전에 sanitized `ValueError`로 차단; `sourcePageUrl`/`expectedArchiveChecksum`는 canonical checksum에 포함; trusted cache reuse bug fixed by comparing `expectedArchiveChecksum` as `sha256:<hex>`; production `/v1/scan` API 변경 없음; acquisition/corpus/experiment manifest tests `28 passed in 0.25s`, focused tool-portfolio suite `230 passed in 0.71s`, full `services/sast-runner` pytest gate `802 passed in 24.62s`; Critic re-review PASS.
- 2026-05-13: Acquisition provenance semantic validation hardening — offline acquisition manifests now validate `downloadedAt` exact date/UTC timestamp shape with real calendar parsing, `sourceUrl` schemes (`http/https/file/local`) with existing `local://` fixture compatibility, and `sourcePageUrl` as `http/https` only; metadata-only `sourcePageUrl`/`licenseOrRedistributionNote` source updates repin manifests without re-extracting and preserve pinned `downloadedAt`; production `/v1/scan` API 변경 없음; RED 14 failures reproduced; acquisition/corpus tests `41 passed in 0.36s`; acquisition/corpus/experiment/report tests `188 passed in 0.79s`; focused tool-portfolio suite `252 passed in 0.83s`; full `services/sast-runner` pytest gate `824 passed in 26.10s`; Critic implementation review PASS.
- 2026-05-13: Acquisition manifest error-surface sanitation and URL authority strictness — unsafe unknown field keys are redacted as `<unsafe>` on both validation and checksum paths while safe developer labels remain visible; hostless/query/fragment/userinfo HTTP(S) authorities are rejected without raw URL echo; `local://` and `file://` compatibility preserved; production `/v1/scan` API 변경 없음; RED 10 failures plus Critic BLOCK userinfo regressions reproduced; acquisition/corpus/experiment/report tests `201 passed in 0.76s`; focused tool-portfolio suite `265 passed in 0.83s`; full `services/sast-runner` pytest gate `837 passed in 25.77s`; Critic re-review PASS.
- 2026-05-13: Corpus Readiness relative localPath containment hardening — relative acquisition `localPath` with explicit `base_path` must resolve inside base; `../` and symlink escapes block with `LOCAL_CORPUS_PATH_OUTSIDE_BASE` before case checks, while absolute `.omx`/external paths remain supported; production `/v1/scan` API 변경 없음; RED 2 failures reproduced; readiness tests `14 passed in 0.05s`; focused acquisition/corpus/readiness/manifest/report suite `215 passed in 0.82s`; focused tool-portfolio suite `268 passed in 0.83s`; full `services/sast-runner` pytest gate `840 passed in 26.26s`; Critic review PASS.
- 2026-05-13: Corpus Readiness required_corpora ID/projection sanitization hardening — offline readiness required corpus IDs are strict no-whitespace/no-control safe IDs; safe unknown corpora project as generic `external`; caller-provided readiness `externalCorpusStatus` is sanitized to canonical keys/allowed nested fields/allowlisted readiness reason codes without raw key/reason/nested-field leakage; production `/v1/scan` API 변경 없음; readiness/report tests `161 passed in 0.54s`, focused acquisition/corpus/readiness/report/manifest suite `224 passed in 0.83s`, focused tool-portfolio suite `277 passed in 0.87s`, full `services/sast-runner` pytest gate `849 passed in 26.24s`; Critic re-review PASS.
- 2026-05-13: Actual Tool Portfolio runner — benchmark-only `python -m benchmark.tool_portfolio_actual_runner` can stage pinned local corpus cases and run all required current-six portfolio configs into `s4-tool-portfolio-experiment-report-v1`; production `/v1/scan` API 변경 없음; default thresholds fail closed unless explicit criteria are supplied; CLI supports `--base-path` for relative acquisition `localPath`; actual-run tests `7 passed in 0.07s`, focused suite `211 passed in 0.54s`, all Tool Portfolio tests `284 passed in 0.90s`, full `services/sast-runner` pytest gate `856 passed in 26.15s`; Critic re-review PASS.
- 2026-05-13: Actual Juliet/SARD low-threshold runner-integrity execution — actual runner over local 80-case Juliet/SARD cache now produces `report-after-fixes.json` with staged readiness available, system stability pass, all 15 configs, and no extracted-cache metric path leakage after fixing Juliet profile SDK mode and Flawfinder malformed numeric parsing; production `/v1/scan` API 변경 없음; this is low-threshold runner-integrity evidence, not current-six quality sufficiency; targeted tests `23 passed in 3.27s`, Tool Portfolio tests `284 passed in 0.91s`, full `services/sast-runner` pytest gate `858 passed in 26.42s`; Critic PASS.
- 2026-05-13: Low-threshold threshold-profile hardening — offline Tool Portfolio `qualityGate.localQualityAssessment.thresholdProfile` now marks non-discriminating threshold profiles as `runner-integrity-only`; `minimumTargetRecall=0.0`/`minimumFindingPrecision=0.0`/`maximumNegativeTargetFpr=1.0` cannot produce final `qualityGate.status="pass"` and instead yields `not_decision_grade` with `QUALITY_THRESHOLDS_NON_DISCRIMINATING`; production `/v1/scan` API 변경 없음; report+actual tests `153 passed in 0.48s`, all Tool Portfolio tests `287 passed in 0.94s`, full `services/sast-runner` pytest gate `861 passed in 26.30s`; Critic re-review PASS.
- 2026-05-13: Quality Diagnostics v1 — offline Tool Portfolio reports now include additive `qualityDiagnostics` with diagnostic-only target-row/finding-pressure/match-attempt/CWE/tool decomposition; production `/v1/scan` API 변경 없음; report+actual tests `160 passed in 0.53s`, all Tool Portfolio tests `294 passed in 0.94s`, full `services/sast-runner` pytest gate `868 passed in 26.05s`; actual `report-after-diagnostics.json` has validation pressure `uniqueRaw=226/tp=5/oracleFP=221` and test pressure `uniqueRaw=311/tp=4/oracleFP=307`; Critic PASS.
- 2026-05-13: Diagnostic Triage candidate lanes — offline `qualityDiagnostics` now includes deterministic candidate investigation lanes (`matching-policy-review`, `cwe-normalization-review`, `negative-discrimination-review`, `recall-gap-investigation`, `noise-pressure-review`) without root-cause/verdict claims; production `/v1/scan` API 변경 없음; triage tests `6 passed in 0.18s`, report+actual tests `164 passed in 0.55s`, all Tool Portfolio tests `298 passed in 0.96s`, full `services/sast-runner` pytest gate `872 passed in 26.36s`; actual `report-after-triage.json` keeps final quality `not_decision_grade`; Critic PASS.
- 2026-05-13: Tool Contribution Diagnostics v1 — offline `s4-tool-portfolio-experiment-report-v1` now includes additive `toolContributionDiagnostics` for deterministic current-six per-tool contribution/noise evidence from single-tool and leave-one-out scores; production `/v1/scan` API 변경 없음; comparative config failures make the block `not_run` instead of fake zero-signal rows; contribution tests `7 passed in 0.23s`, report+actual tests `171 passed in 0.60s`, all Tool Portfolio tests `305 passed in 1.02s`, full `services/sast-runner` pytest gate `879 passed in 25.73s`; actual `report-after-tool-contribution.json` keeps final quality `not_decision_grade`; Critic PASS.
- 2026-05-13: Actual runner staged localPath canonicalization — offline `benchmark.tool_portfolio_actual_runner` now emits absolute staged acquisition `localPath` values even when CLI `--work-dir` is relative, preventing false `LOCAL_CORPUS_BASE_PATH_REQUIRED` readiness blocks after successful staging/scanning; production `/v1/scan` API 변경 없음; actual-runner tests `11 passed in 0.08s`, report+actual tests `173 passed in 0.60s`, all Tool Portfolio tests `307 passed in 1.01s`, full `services/sast-runner` pytest gate `881 passed in 26.24s`; actual `report-after-stage-path-fix.json` keeps readiness available and final quality `not_decision_grade`; Critic PASS.
- 2026-05-13: Harness report snapshot drift guard — committed offline `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json` is now required to exactly match deterministic `build_harness_fixture_report()` output and explicitly include `qualityDiagnostics` + `toolContributionDiagnostics`; production `/v1/scan` API 변경 없음; RED 2 failures reproduced stale artifact drift, focused snapshot tests `2 passed in 0.06s`, report+actual tests `174 passed in 0.63s`, all Tool Portfolio tests `308 passed in 0.99s`, full `services/sast-runner` pytest gate `882 passed in 25.76s`; Critic PASS.
- 2026-05-13: Stale experiment-report artifact removal guard — removed tracked timestamped same-schema `s4-harness-fixture-20260512T042442Z.json` and added a guard that only canonical `s4-harness-fixture-report-v1.json` may use `s4-tool-portfolio-experiment-report-v1` under `benchmark/results/tool_portfolio/`; production `/v1/scan` API 변경 없음; focused canonical artifact tests `3 passed in 0.06s`, report+actual tests `175 passed in 0.57s`, all Tool Portfolio tests `309 passed in 0.98s`, full `services/sast-runner` pytest gate `883 passed in 25.42s`; Critic PASS.
- 2026-05-14: Tool Portfolio consumer-summary stale artifact guard — offline report consumer summary artifacts are now guarded symmetrically: only `benchmark/results/tool_portfolio/s4-harness-fixture-consumer-summary-v1.json` may use `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"`, and it must exact-match `summarize_tool_portfolio_report(canonical_report)` as parsed JSON; extra or drifted summary artifacts are offenders. Production `/v1/scan` API 변경 없음; canary tests `22 passed in 0.07s`, report+actual tests `197 passed in 0.57s`, all Tool Portfolio tests `331 passed in 1.02s`, full `services/sast-runner` pytest gate `905 passed in 25.98s`; Critic implementation review PASS.
- 2026-05-14: Tool Portfolio diagnostic identifier fail-closed canary — offline consumer summary now treats malformed/unknown projected `diagnosticTriage.candidates[].candidateId` and `toolContributionDiagnostics.tools[].toolId/evidenceClass` as `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`; values are still sanitized from output but the summary is not decision-grade usable. Production `/v1/scan` API 변경 없음; RED reproduced silent-drop decision-grade bug; canary tests `23 passed in 0.05s`, report+actual tests `198 passed in 0.60s`, all Tool Portfolio tests `332 passed in 1.01s`, full `services/sast-runner` pytest gate `906 passed in 25.01s`; Critic implementation review PASS.
- 2026-05-14: Tool Portfolio `byCweTool` diagnostic matrix — offline `qualityDiagnostics.splitDiagnostics[*]` now includes score-row-scoped CWE×tool match-class buckets for expected-CWE/tool decomposition. The matrix excludes per-tool FN/recall/precision/raw-pressure fields and skips portfolio missed-target rows to avoid overclaiming. Production `/v1/scan` API 변경 없음; RED reproduced missing field and stale snapshot drift; targeted matrix tests `3 passed in 0.07s`, report+canary+actual tests `199 passed in 0.64s`, all Tool Portfolio tests `333 passed in 1.00s`, full `services/sast-runner` pytest gate `907 passed in 25.07s`; Critic implementation review PASS.
- 2026-05-14: Tool Portfolio finding tool identity/config membership validation — offline report builder now fail-closes required current-six `findings_by_config` when finding `toolId` is missing/non-string/blank/unknown, when `single-tool:<tool>` contains another tool, or when `leave-one-out:<tool>` contains the excluded tool. Diagnostics do not echo raw unknown tool IDs. Production `/v1/scan` API 변경 없음; RED reproduced unknown tool scoring fail-open; targeted tests `5 passed in 0.06s`, report+canary+actual tests `204 passed in 0.60s`, all Tool Portfolio tests `338 passed in 1.01s`, full `services/sast-runner` pytest gate `912 passed in 25.01s`; Critic implementation review PASS.
- 2026-05-14: Tool Portfolio mapping finding payload validation/canonicalization — offline report builder now validates mapping findings before scoring and canonicalizes valid top-level `file`/`line` into `location.file`/`location.line`. Malformed rule/location/file/line/metadata/dataFlow payloads fail closed via `FINDINGS_BY_CONFIG_INPUT_INVALID` without raw value echo. Production `/v1/scan` API 변경 없음; RED reproduced oracle matcher crash on bad line; targeted tests `6 passed in 0.07s`, report+canary+actual tests `210 passed in 0.63s`, all Tool Portfolio tests `344 passed in 1.08s`, full `services/sast-runner` pytest gate `918 passed in 25.16s`; Critic implementation review PASS.
- 2026-05-14: Corpus manifest `sourcePath` safety validation — offline Tool Portfolio strict manifest/report paths reject blank, absolute, Windows drive/UNC absolute, and slash/backslash traversal `sourcePath` values without raw unsafe value echo; Corpus Readiness keeps deterministic blocked JSON with `CORPUS_CASE_SOURCE_PATH_UNSAFE` for the same normalized unsafe paths; production `/v1/scan` API 변경 없음; targeted sourcePath tests `16 passed in 0.07s`, focused manifest/report/readiness/canary/actual tests `253 passed in 0.70s`, all Tool Portfolio tests `360 passed in 1.14s`, full `services/sast-runner` pytest gate `934 passed in 24.78s`; Critic PASS.
- 2026-05-14: Actual runner relative acquisition `localPath` fail-closed hardening — direct actual-runner staging no longer resolves relative acquisition `localPath` against process cwd; explicit `--base-path` remains the required support path for relative corpora, while report mode returns readiness-blocked/no-scan with `LOCAL_CORPUS_BASE_PATH_REQUIRED`; production `/v1/scan` API 변경 없음; targeted tests `3 passed in 0.04s`, focused actual/readiness/manifest/report tests `232 passed in 0.65s`, all Tool Portfolio tests `362 passed in 1.05s`, full `services/sast-runner` pytest gate `936 passed in 25.15s`; Critic PASS.
- 2026-05-14: Corpus Readiness unsafe `sourcePath` redaction — unsafe case statuses in offline readiness JSON now redact raw absolute/traversal/Windows/UNC paths as `sourcePath="<unsafe>"` with `sourcePathStatus="unsafe"`, preserving case/acquisition/reason identity while safe relative paths remain visible; production `/v1/scan` API 변경 없음; RED reproduced secret-bearing path leakage; targeted tests `12 passed in 0.06s`, focused readiness/manifest/report/actual/canary tests `261 passed in 0.66s`, all Tool Portfolio tests `368 passed in 1.02s`, full `services/sast-runner` pytest gate `942 passed in 25.40s`; Critic PASS.
- 2026-05-14: Corpus Readiness CLI invalid-error sanitization — offline readiness CLI invalid JSON now emits fixed `error="input validation failed"` and safe `errorClass` instead of raw `str(exc)`, preventing secret-bearing manifest path leakage; production `/v1/scan` API 변경 없음; RED reproduced raw path leakage; targeted CLI tests `3 passed in 0.04s`, focused readiness/manifest/report/actual/canary tests `262 passed in 0.68s`, all Tool Portfolio tests `369 passed in 1.03s`, full `services/sast-runner` pytest gate `943 passed in 25.44s`; Critic PASS.
- 2026-05-14: Corpus Readiness CLI output-write fallback — offline readiness CLI `--output` write failures now return exit 1 with sanitized stdout JSON and `CORPUS_READINESS_OUTPUT_WRITE_FAILED` instead of escaping a double-fault exception; production `/v1/scan` API 변경 없음; RED reproduced directory-output `IsADirectoryError` escape; targeted CLI tests `4 passed in 0.04s`, focused readiness/manifest/report/actual/canary tests `263 passed in 0.65s`, all Tool Portfolio tests `370 passed in 1.02s`, full `services/sast-runner` pytest gate `944 passed in 25.54s`; Critic PASS.
- 2026-05-14: Corpus Readiness local filesystem path redaction — offline readiness case/acquisition statuses no longer expose host-local `resolvedPath`, `localPath`, or `resolvedLocalPath`; status-only fields preserve machine evidence while safe relative `sourcePath` and checksums remain; production `/v1/scan` API 변경 없음; RED reproduced secret-bearing root leakage; targeted tests `4 passed in 0.05s`, focused readiness/actual/manifest/report/canary tests `263 passed in 0.68s`, all Tool Portfolio tests `370 passed in 1.04s`, full `services/sast-runner` pytest gate `944 passed in 25.05s`; Critic PASS.
- 2026-05-14: Corpus Readiness missing-acquisition path-status consistency — absent acquisition statuses now include sanitized `localPathStatus="not_declared"` and `resolvedLocalPathStatus="not_resolved"`, matching the status-field shape of declared acquisitions; production `/v1/scan` API 변경 없음; RED reproduced missing field; harness fixture regenerated and guarded; focused suite `263 passed in 0.69s`, all Tool Portfolio tests `370 passed in 1.04s`, full `services/sast-runner` pytest gate `944 passed in 25.36s`; Critic PASS.
- 2026-05-14: Corpus Readiness status-field enum contract hardening — offline readiness now exports/freeze-tests allowlisted machine status vocabularies for `localPathStatus`, `resolvedLocalPathStatus`, `resolvedPathStatus`, and `sourcePathStatus`; production `/v1/scan` API 변경 없음; RED reproduced missing exported constants; targeted enum tests `2 passed in 0.07s`, focused readiness/actual/manifest/report/canary tests `265 passed in 0.68s`, all Tool Portfolio tests `372 passed in 1.04s`, full `services/sast-runner` pytest gate `946 passed in 25.40s`; Critic PASS.
- 2026-05-14: Corpus Readiness report-side status/path validation hardening — caller-provided offline `corpusReadinessGate` payloads now reject raw host path fields, non-allowlisted status values, missing available proof status fields, contradictory available+unsafe source path status, extra-acquisition raw paths, and unsafe `caseStatuses[].sourcePath`; production `/v1/scan` API 변경 없음; RED reproduced the accept/leak bypasses; targeted status/path tests `6 passed in 0.07s`, focused readiness/report/actual/manifest/canary tests `271 passed in 0.76s`, all Tool Portfolio tests `378 passed in 1.04s`, full `services/sast-runner` pytest gate `952 passed in 25.03s`; Critic PASS after BLOCKER fixes.
- 2026-05-14: report-side top-level gate status diagnostic sanitization — caller-provided invalid `systemStabilityGate.status` and `corpusReadinessGate.status` no longer echo arbitrary strings or stringify objects in input-validation diagnostics; production `/v1/scan` API 변경 없음; RED reproduced raw secret/object status echo; targeted status-sanitization tests `6 passed in 0.07s`, focused report/readiness/actual/manifest/canary/system-stability tests `309 passed in 0.74s`, all Tool Portfolio tests `382 passed in 1.10s`, full `services/sast-runner` pytest gate `956 passed in 24.97s`; Critic PASS.
- 2026-05-14: System Stability nested pass-evidence diagnostic sanitization — caller-provided `requiredTools[]` and `phases.*.status` invalid values no longer echo arbitrary strings or stringify objects; generated missing current-six diagnostics remain useful; production `/v1/scan` API 변경 없음; RED reproduced raw tool/phase status echo; targeted nested system diagnostics `7 passed in 0.07s`, focused report/system/readiness/actual/manifest/canary tests `313 passed in 0.75s`, all Tool Portfolio tests `386 passed in 1.13s`, full `services/sast-runner` pytest gate `960 passed in 25.08s`; Critic PASS.
- 2026-05-14: legacy external_corpus_status invalid diagnostic sanitization — invalid compatibility-context diagnostics no longer echo or stringify arbitrary top-level keys or unknown nested fields while valid accepted legacy context remains preserved; production `/v1/scan` API 변경 없음; RED reproduced raw key/field echo; targeted legacy diagnostics `7 passed in 0.08s`, focused report/consumer/readiness/actual/manifest/system tests `317 passed in 0.89s`, all Tool Portfolio tests `390 passed in 1.08s`, full `services/sast-runner` pytest gate `964 passed in 25.08s`; Critic PASS.
- 2026-05-14: matchingPolicy invalid diagnostic sanitization — invalid oracle policy diagnostics no longer echo or stringify arbitrary unknown keys, schemaVersion values, or out-of-range lineWindow values; production `/v1/scan` API 변경 없음; RED reproduced raw policy key/value echo; targeted matchingPolicy diagnostics `7 passed in 0.07s`, focused report/oracle/canary/readiness/actual/manifest tests `296 passed in 0.77s`, all Tool Portfolio tests `393 passed in 1.10s`, full `services/sast-runner` pytest gate `967 passed in 25.22s`; Critic PASS.
- 2026-05-13: Tool Portfolio report consumer canary + CLI smoke gate — offline report consumers now have S4-owned pure JSON canary helper/CLI `benchmark/tool_portfolio_report_consumer_canary.py`; `toolPortfolioDecisionGradeUsable` is fail-closed and requires system/corpus/local-quality/final-quality/threshold prerequisites plus no unsafe projection; reason/follow-up/status/intent/diagnostic/tool identifiers are allowlisted and forbidden decision/routing/verdict vocabulary is checked as both keys and values; CLI exits `2` when a summary is emitted but `reportPresent=false` or required decision-grade fails, and exits `1` only when no summary can be emitted; summaries are versioned as `s4-tool-portfolio-report-consumer-summary-v1`, exact-key locked, and committed as `s4-harness-fixture-consumer-summary-v1.json` with parsed-dict drift guard; production `/v1/scan` API 변경 없음; canary tests `20 passed in 0.05s`, report+actual tests `195 passed in 0.61s`, all Tool Portfolio tests `329 passed in 1.05s`, full `services/sast-runner` pytest gate `903 passed in 25.39s`; Critic PASS.
- 2026-05-13: Oracle matchingPolicy payload shape validation hardening — offline report-side `matchingPolicy`가 mapping/object가 아니면 `ORACLE_MATCHING_POLICY_INPUT_INVALID`로 fail-closed하고 oracle-derived scored metrics를 만들지 않음; production `/v1/scan` API 변경 없음; experiment-report tests `37 passed in 0.14s`, focused tool-portfolio suite `109 passed in 0.22s`, full `services/sast-runner` pytest gate `691 passed in 24.85s`.
- 2026-05-13: Local Quality Gate thresholds payload shape validation hardening — offline report-side `thresholds`가 mapping/object가 아니면 `QUALITY_THRESHOLDS_INPUT_INVALID`로 fail-closed하고 raw payload를 echo하지 않음; production `/v1/scan` API 변경 없음; experiment-report tests `33 passed in 0.13s`, focused tool-portfolio suite `105 passed in 0.21s`, full `services/sast-runner` pytest gate `687 passed in 24.88s`.
- 2026-05-13: Corpus Readiness Gate consistency validation hardening — offline report-side caller-provided readiness gate의 `status`/`decisionGradeReady`/`externalCorpusStatus` 모순을 `CORPUS_READINESS_GATE_INCONSISTENT`로 blocked/not-decision-grade 정규화; production `/v1/scan` API 변경 없음; experiment-report tests `29 passed in 0.12s`, focused tool-portfolio suite `101 passed in 0.20s`, full `services/sast-runner` pytest gate `681 passed in 24.90s`.
- 2026-05-13: Juliet/SARD Corpus Acquisition CLI — benchmark-only `python -m benchmark.tool_portfolio_corpus_acquisition`가 NIST Juliet/SARD archives를 실제 다운로드/검증/추출하고 `.omx/corpora/s4-tool-portfolio/`에 acquisition/corpus/readiness manifests를 생성; production `/v1/scan` API 변경 없음; actual readiness `status="available"`, `decisionGradeReady=true`, `checkedCaseCount=80`; acquisition/readiness tests `15 passed in 0.10s`, focused tool-portfolio suite `92 passed in 0.27s`, full `services/sast-runner` pytest gate `683 passed in 25.39s`.
- 2026-05-13: Corpus acquisition provenance/split-leakage/reproducibility hardening — existing extraction cache is trusted only when prior acquisition manifest matches current archive/tree checksums, single SARD candidates are no longer duplicated across validation/test, corpus manifest validation rejects source-artifact leakage across held-out splits, and corpus manifest `createdAt` reuses pinned acquisition manifest dates; production `/v1/scan` API 변경 없음; acquisition/manifest/readiness tests `27 passed in 0.21s`, tool-portfolio focused suite `123 passed in 0.41s`, full `services/sast-runner` pytest gate `704 passed in 24.79s`.
- API 계약 범위는 `/v1/build` explicit readiness, `/v1/scan` `compileCommands`/`thirdPartyPaths`, SDK `none`/`non-registered`/S4-local `sdkId` resolution, `/v1/scan` evidence-resolution metadata, enriched `scan.sca.libraries[]`, `/v1/libraries`, `/v1/discover-targets`, `/v1/health` request-aware summary, durable ownership status/result/cancel을 포함한다.

---

## Static Evidence Contract v1 (design gate, 2026-05-11)

`/v1/scan` and `/v1/build-and-analyze` exposes an additive `staticEvidenceContract` block per `wiki/canon/specs/sast-runner-static-evidence-contract.md`. The block is a machine-readable coverage/readiness contract for S4's deterministic C/C++ static evidence artifact.

Required top-level keys: `schemaVersion`, `analysisProfile`, `artifactKind`, `producer`, `provenance`, `gates.systemStability`, `gates.evidenceReadiness`, `gates.claimSupportReadiness`, `gates.qualityEvaluation`, `coverage`, `claimBoundaries`, `claimBoundaryMatrix`, `toolEvidenceMatrix`, and `followUpHints`. Optional additive `missingEvidence`, if present, follows the same neutral readiness rules as `followUpHints`.

Boundary rules:
- `coverage.externalVulnerabilityKnowledge`, `coverage.semanticGraphRetrieval`, `coverage.runtimeBehavior`, `coverage.exploitabilityJudgment`, and `coverage.finalSecurityVerdict` must be explicit `not_provided` surfaces.
- `coverage.structuralCodeGraph`, when provided, is only `graphKind="structural-callgraph"`; `semanticRetrieval` and `graphRag` remain `not_provided`.
- `missingEvidence` / `followUpHints` are neutral readiness metadata only: no service calls, no hard orchestration commands, no S5 API request shaping, no LLM prompt, and no verdict/risk-score fields.
- Runtime responses default `gates.qualityEvaluation.status` to `not_evaluated`; only the separate validation harness/report path populates quality results.
- `gates.claimSupportReadiness` is a runtime-local claim-support classifier, not a quality score. It can be `pass`, `partial`, `fail`, or `unknown`, uses `consumerPolicy="not_a_quality_score_not_a_security_verdict"`, and must not copy concrete tool IDs into its reason codes.
- `claimBoundaryMatrix[]` is an additive machine-readable claim-boundary matrix. It keeps negative/out-of-scope claims such as `absence-of-vulnerability`, `cwe-absence`, `runtime-behavior`, `external-vulnerability-affectedness`, and `semantic-graph-completeness` unsupported even when findings are empty and execution is clean.
- `toolEvidenceMatrix` emits one record per current S4 tool in stable order (`semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`) under the existing `s4-static-evidence-contract-v1` schema. It is an S3-consumable local tool-state matrix, not a portfolio v2.
- Runtime scan required-tool policy is authoritative: explicit `options.tools` is the required set, otherwise all six tools are required. A required tool that is missing, skipped, failed, partial, degraded, has invalid output, or is otherwise non-normal produces `errorDetail.code="REQUIRED_TOOL_EXECUTION_INCOMPLETE"` and a failed static evidence contract.

`toolEvidenceMatrix` consumer policies:

| Condition | Consumer policy |
|---|---|
| tool status `ok` | `local_tool_execution_state_only_not_vulnerability_verdict` |
| tool status `partial` or degraded | `local_tool_partial_use_with_degradation_metadata` |
| tool status `failed` | `local_tool_failed_do_not_use_as_negative_evidence` |
| allowed skip (`operator-requested-subset`, `profile-not-applicable`) | `not_requested_or_not_applicable` |
| blocking skip (`runtime-tool-missing`, `environment-drift`, `tool-check-failed`, or other non-allowed reason) | `blocks_successful_artifact` |
| missing execution metadata | `metadata_absent_do_not_infer` |

Gate propagation:
- A successful `/v1/scan` or `/v1/build-and-analyze` response with a current per-tool anomaly is still transport/domain successful, but `staticEvidenceContract.gates.systemStability.status` is `degraded`.
- Current per-tool anomalies are `partial`, `failed`, degraded `ok`, blocking skip, missing/not-recorded current result, and unknown status. Allowed skips do not degrade.
- The same anomaly is reflected in `coverage.staticToolExecution.status="partial"`, `reasonCodes=["TOOL_EXECUTION_PARTIAL"]`, and deterministic `anomalyReasonCodes[]` such as `TOOL_FAILED:scan-build`.
- Policy-failure responses remain `systemStability=fail` and `evidenceReadiness=not_ready`; required-tool policy failures also set `claimSupportReadiness=fail`.

Consumer canary harness:
- `benchmark/static_evidence_consumer_canary.py` consumes precomputed response-shaped JSON fixtures only.
- It derives S3-facing local contract readiness only from `staticEvidenceContract.gates`, `coverage`, `claimBoundaries`, `claimBoundaryMatrix`, and `toolEvidenceMatrix`; raw `execution.toolResults` is ignored.
- The summary projection is field-allowlisted: system/evidence/claim/quality statuses, coverage surfaces, claim IDs, tool IDs, support statuses, and consumer policies must match S4-owned vocabularies. Unknown or malformed projected values are omitted or normalized instead of being echoed.
- Unsafe projection adds `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` to `systemReasonCodes`, `evidenceReasonCodes`, and `claimSupportReasonCodes`, forces `localStaticEvidenceReady=false`, and never enters `toolAnomalyReasonCodes`; arbitrary coverage keys are not stringified.
- Its `localStaticEvidenceReady` boolean is intentionally narrow: `contractPresent && systemStability == "pass" && evidenceReadiness == "ready" && claimSupportReadiness == "pass" && no unsafe projection`. It is not a security score, vulnerability decision, S3/S5 routing instruction, or final verdict.

Tool Portfolio report consumer canary:
- `benchmark/tool_portfolio_report_consumer_canary.py` consumes only offline `s4-tool-portfolio-experiment-report-v1` JSON as a helper and CLI smoke gate. It does not import `app.*`, execute tools, read `toolResults`, call network, or route to S3/S5.
- It emits a versioned summary (`summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"`) with exact top-level keys and neutral sanitized fields such as `toolPortfolioDecisionGradeUsable`, `runnerIntegrityOnly`, diagnostic surface statuses, allowlisted reason codes/follow-ups, allowlisted diagnostic candidate IDs, and allowlisted current-six contribution classes. The canonical sample artifact is `benchmark/results/tool_portfolio/s4-harness-fixture-consumer-summary-v1.json`; tests compare parsed JSON against the canonical report summarizer output and CLI output.
- `toolPortfolioDecisionGradeUsable=true` means only that offline Tool Portfolio quality evidence is decision-grade usable. It is not a security verdict, not an absence-of-vulnerability claim, and not an S3/S5 routing decision.
- Any unallowlisted projected string/scalar adds canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, normalizes the unsafe field, and forces `toolPortfolioDecisionGradeUsable=false`; tests check forbidden decision/routing/verdict vocabulary as exact keys and exact string values. Caller-provided summary-only diagnostics (`TOOL_PORTFOLIO_REPORT_ABSENT`, `TOOL_PORTFOLIO_REPORT_MALFORMED`, `TOOL_PORTFOLIO_REPORT_SCHEMA_UNSUPPORTED`, `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`) are treated as unsafe spoofing when they appear inside a present valid report. Malformed `reasonCodes` / `decisionSupport.requiredFollowUps` containers or list items are also unsafe projection; valid allowlisted entries in proper lists are preserved without stringifying malformed objects. Present non-string or blank scalar projections are unsafe, while absent/`None` remains compatible.
- CLI smoke semantics: default mode exits `0` for parsed valid-schema summaries even if they are not decision-grade; parsed invalid summaries with `reportPresent=false` exit `2`. `--require-decision-grade` exits `0` only when `toolPortfolioDecisionGradeUsable=true`; it exits `2` after emitting a sanitized summary when the artifact is not decision-grade, and exits `1` with sanitized stderr when CLI args/file/JSON syntax prevent summary emission.


---

## Durable ownership mode (health-control v2)

`/v1/scan`, `/v1/build`, `/v1/build-and-analyze`, `/v1/paper/static-evidence`는 기본적으로 기존 동기 호환 응답을 유지한다.
장시간 production caller는 아래 헤더로 **requestId 기반 durable ownership mode**를 선택한다.

```http
Prefer: respond-async
X-Request-Id: req-s4-owned-123
```

S4는 `202 Accepted`와 함께 상태/결과 조회 URL을 반환하고, 실제 작업은 원 HTTP 응답 lifecycle과 분리된 retained task로 계속 수행한다. Paper static-evidence에서는 endpoint identity가 `paper-static-evidence`로 기록된다.

```json
{
  "requestId": "req-s4-owned-123",
  "endpoint": "build",
  "state": "queued",
  "resultReady": false,
  "statusUrl": "/v1/requests/req-s4-owned-123",
  "resultUrl": "/v1/requests/req-s4-owned-123/result",
  "submittedAt": 1711900000000,
  "startedAt": null,
  "completedAt": null,
  "expiresAt": null,
  "requestSummary": {
    "requestId": "req-s4-owned-123",
    "endpoint": "build",
    "state": "queued",
    "localAckState": "transport-only"
  }
}
```

### negotiation precedence

`Prefer: respond-async`가 있으면 durable ownership mode가 우선한다.
따라서 `Accept: application/x-ndjson`가 함께 있어도 S4는 NDJSON stream이 아니라 `202` JSON ownership envelope를 반환한다.
`Prefer: respond-async`가 없고 `Accept: application/x-ndjson`만 있으면 기존 NDJSON compatibility stream을 사용한다.

### duplicate submit / uncertain transport recovery

caller는 동일 `X-Request-Id`로 `POST ... Prefer: respond-async`를 재시도할 수 있다.
이미 등록된 retained request가 있으면 S4는 새 작업을 시작하지 않고 기존 status envelope를 반환하며 `reused: true`를 포함한다.

If the same durable `X-Request-Id` belongs to another endpoint, including reuse between paper static-evidence and another S4 endpoint, S4 fails closed without starting a second operation:

```json
{
  "success": false,
  "error": "REQUEST_ID_CONFLICT",
  "requestId": "shared-trace-id",
  "errorDetail": {
    "code": "REQUEST_ID_CONFLICT",
    "message": "request id already belongs to another endpoint",
    "requestId": "shared-trace-id",
    "retryable": false
  },
  "existingEndpoint": "build",
  "requestedEndpoint": "scan",
  "statusUrl": "/v1/requests/shared-trace-id",
  "resultUrl": "/v1/requests/shared-trace-id/result"
}
```

### retention boundary

terminal result/failure는 process-local memory에 보존된다.
이는 transport interruption 복구용 durable ownership이며, S4 process restart 후에도 보존되는 persistent storage 계약은 아니다.
retained terminal payload의 기본 보존 시간은 300초다.

`X-Request-Id`는 trace/correlation ID이면서 durable ownership key로도 사용된다. 따라서 같은 S4 endpoint에 대한 불확실한 재시도에는 같은 `X-Request-Id`를 재사용해야 하지만, 서로 다른 S4 endpoint(`/v1/build` 후 `/v1/scan`, `/v1/paper/static-evidence` 후 `/v1/scan` 등)를 durable ownership mode로 호출할 때는 각 operation마다 고유한 `X-Request-Id`를 사용해야 한다. 같은 `X-Request-Id`가 다른 endpoint에 재사용되면 S4는 silent reuse 대신 HTTP `409 REQUEST_ID_CONFLICT`를 반환한다.

---

## GET /v1/requests/{requestId}

durable ownership status를 조회한다.

| 상태 | HTTP | 의미 |
|------|------|------|
| known queued/running/completed/failed/cancelled | 200 | status envelope 반환 |
| unknown requestId | 404 | `REQUEST_NOT_FOUND` |
| same requestId reused for a different endpoint | 409 | `REQUEST_ID_CONFLICT` |
| expired terminal result | 410 | `REQUEST_EXPIRED` |

---

## GET /v1/requests/{requestId}/result

retained terminal result 또는 failure를 조회한다.

| 상태 | HTTP | 의미 |
|------|------|------|
| queued/running | 202 | 아직 terminal result가 없음. status envelope 반환 |
| completed | 200 | `resultReady=true`, nested `result`에 원 endpoint 성공 payload 포함 |
| failed | 200 | retrieval은 성공. nested `result.success=false`와 `error`/`failureDetail`/`errorDetail` 확인 |
| cancelled | 200 | retrieval은 성공. nested `result.success=false`, `errorDetail.code="REQUEST_CANCELLED"` 확인 |
| unknown requestId | 404 | `REQUEST_NOT_FOUND` |
| same requestId reused for a different endpoint | 409 | `REQUEST_ID_CONFLICT` |
| expired terminal result | 410 | `REQUEST_EXPIRED` |

terminal failure retrieval이 HTTP 200인 이유는 **결과 조회 transport 성공**과 **owned 작업의 domain failure**를 구분하기 위해서다.
caller는 nested `result.success`, `build.readiness`, `failureDetail`, `errorDetail`을 authoritative domain outcome으로 사용해야 한다.

---

## DELETE /v1/requests/{requestId}

retained async request에 대해 **best-effort cancellation**을 요청한다. 이 endpoint는 `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`, `/v1/paper/static-evidence` durable ownership mode에 공통 적용된다.

| 상태 | HTTP | 의미 |
|------|------|------|
| queued/running | 202 | task cancel을 요청하고 즉시 terminal `state="cancelled"`, `resultReady=true` envelope 반환 |
| completed/failed/cancelled | 200 | idempotent terminal envelope 반환. 이미 끝난 작업은 되돌리지 않음 |
| unknown requestId | 404 | `REQUEST_NOT_FOUND` |
| expired terminal result | 410 | `REQUEST_EXPIRED` |

취소된 request의 retained result 예시는 다음과 같다.

```json
{
  "requestId": "req-s4-owned-123",
  "state": "cancelled",
  "resultReady": true,
  "result": {
    "success": false,
    "error": "request cancelled",
    "errorDetail": {
      "code": "REQUEST_CANCELLED",
      "message": "request cancelled",
      "requestId": "req-s4-owned-123",
      "retryable": false
    }
  },
  "requestSummary": {
    "state": "cancelled",
    "ackStatus": "broken",
    "localAckState": "ack-break",
    "lastAckSource": "request-cancelled",
    "blockedReason": "request cancelled"
  }
}
```

`activeRequestCount`는 `queued`/`running`만 센다. 따라서 `cancelled` 전환 직후 active count에서 제외된다.

---

## Base URL

```
http://localhost:9000
```

---

## 공통 헤더

| 헤더 | 방향 | 설명 |
|------|------|------|
| `X-Request-Id` | 요청/응답 | 요청 추적 ID. 없으면 S4가 자동 생성. 응답에도 포함 |
| `X-Timeout-Ms` | 요청 | **도구당 타임아웃 (밀리초)**. 최우선 적용. 미지정 시 `options.timeoutSeconds` → 기본 600초 |
| `Prefer: respond-async` | 요청 | `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`, `/v1/paper/static-evidence`에서 durable ownership mode를 요청. 응답은 `202 Accepted` + `statusUrl`/`resultUrl` |

---

## 엔드포인트 요약

| 메서드 | 경로 | MCP Tool | 용도 |
|--------|------|----------|------|
| POST | `/v1/scan` | `sast.scan` | 6개 SAST 도구 병렬 + SDK 해석 + 노이즈 필터링 + 실행 보고서 |
| POST | `/v1/functions` | `code.functions` | clang AST → 함수+호출 관계 (namespace, projectPath) |
| POST | `/v1/includes` | `code.includes` | gcc -E -M → 인클루드 트리 |
| POST | `/v1/metadata` | `build.metadata` | gcc -E -dM → 타겟 매크로/아키텍처 |
| POST | `/v1/libraries` | `sca.libraries` | 라이브러리 식별 + upstream diff (CVE는 S5로 이관) |
| POST | `/v1/build` | — | caller가 완전히 materialize한 build command/environment를 그대로 실행하고 explicit readiness contract를 반환 |
| POST | `/v1/build-and-analyze` | — | explicit build command/environment로 빌드 후 나머지 분석 수행 |
| POST | `/v1/discover-targets` | — | 프로젝트 내 빌드 타겟 자동 탐색 |
| POST | `/v1/paper/static-evidence` | — | TraceAudit paper path용 deterministic static-evidence bundle producer. `Prefer: respond-async` durable ownership 지원 |
| GET | `/v1/health` | — | 6개 도구 상태 + backward-compatible top-level fields + policy surface + request-aware summary |
| GET | `/v1/requests/{requestId}` | — | durable ownership status 조회 |
| GET | `/v1/requests/{requestId}/result` | — | retained terminal result/failure 조회 |
| DELETE | `/v1/requests/{requestId}` | — | retained async request best-effort cancel |

---

## 도구 목록 (6개)

| 도구 | 역할 | BuildProfile 활용 |
|------|------|-------------------|
| **Semgrep** | 패턴 매칭 + taint mode (C++에서는 `.c`/`.h`만 **확장자 필터**) | 룰셋 C/C++ 자동 선택 + `--include` 필터 |
| **Cppcheck** | 코드 품질 + 교차 번역 단위(CTU) 분석 | `--std`, `-I`, `-D` |
| **clang-tidy** | CERT 코딩 표준 기반 보안 + 버그 탐지 | `-std`, `-I`, `-D` |
| **Flawfinder** | 위험 함수 빠른 스캔 (CWE 매핑 포함) | (없음) |
| **scan-build** | Clang Static Analyzer 경로 민감 분석 | `-std`, `-I`, `-D` |
| **gcc -fanalyzer** | GCC 내장 정적 분석 (SDK 크로스 컴파일러 사용 가능) | `-std`, `-I`, `-D`, SDK 크로스 컴파일러 |

### 도구 자동 선택

BuildProfile이 있으면 SAST Runner가 **도구를 자동 선택/스킵**한다:

| 조건 | 동작 |
|------|------|
| `languageStandard`가 `c++*` | Semgrep **확장자 필터**: `--include *.c --include *.h`로 C 파일만 스캔 (스킵하지 않음) |
| 호스트 gcc 미지원 + SDK에 GCC 10+ | gcc-fanalyzer **SDK 컴파일러로 재확인** -> 사용 가능하면 활성화 |
| SDK 크로스 컴파일러 없음 | gcc-fanalyzer는 호스트 gcc로 폴백 |
| clang 미설치 | scan-build, clang-tidy 스킵 |
| 항상 실행 | Cppcheck, Flawfinder |

스킵 사유는 응답의 `execution.toolResults`에 기록된다.

### 도구 omission / skip 정책

- 기본 `/v1/scan`에서 required tool set은 current six 전체다. 명시적 `options.tools`가 있으면 그 subset만 required이며, 나머지는 `operator-requested-subset`으로 기록된다.
- 실행 전 required tool이 unavailable이면 어떤 analyzer도 실행하지 않고 HTTP `503` + `errorDetail.code="REQUIRED_TOOL_UNAVAILABLE"` + `staticEvidenceContract.gates.systemStability.status="fail"` 로 반환한다.
- 실행 후 required tool result가 없거나 `failed`/`partial`/`skipped`/degraded `ok`/unknown이면 HTTP `503` + `errorDetail.code="REQUIRED_TOOL_EXECUTION_INCOMPLETE"` 로 반환한다. 이 판정은 project-level SCA/codeGraph enrichment보다 먼저 수행된다.
- 알 수 없는 `options.tools[]` 값은 시스템 안정성 실패가 아니라 caller 입력 오류다. HTTP `400` + `errorDetail.code="SCAN_TOOL_INVALID"` 로 반환한다.
- **허용된 skip만 성공 가능** 하다.
- 허용된 skip taxonomy는 현재 `operator-requested-subset`, `profile-not-applicable` 다.
- `runtime-tool-missing`, `environment-drift`, `tool-check-failed` 는 **비허용 omission** 으로 취급한다.
- 동기 `POST /v1/scan` 에서 비허용 omission 또는 required-tool incomplete가 있으면 HTTP `503` + `success=false` + `status="failed"` + `errorDetail.code` 로 반환한다.
- NDJSON에서는 비허용 omission 또는 required-tool incomplete가 최종 `type="error"` 이벤트로 반환되며, `execution.toolResults` 와 `staticEvidenceContract` 를 포함한다.
- `toolsRun` 은 실제 실행한 도구 목록만 담고, `toolResults` 는 allowed skip을 포함한 정책 평가 대상 전체 도구를 담는다.

---

## NDJSON 스트리밍 모드 (하트비트 프로토콜)

`POST /v1/scan`은 **NDJSON 스트리밍 모드**를 지원한다. 대형 프로젝트(수만 줄 파일)에서 고정 타임아웃이 불가능한 문제를 해결하기 위해, 도구 실행 중 주기적으로 진행 이벤트를 보낸다.

### 활성화

요청에 `Accept: application/x-ndjson` 헤더를 추가한다. 헤더가 없으면 기존 동기 JSON 응답 (변경 없음).

### 응답 형식

`Content-Type: application/x-ndjson` — 각 줄이 하나의 JSON 객체 (`\n` 구분).

### 이벤트 타입

**progress** — 도구 완료/실패 시 (6개 도구별 1회):
```json
{"type":"progress","tool":"cppcheck","status":"completed","findingsCount":25,"elapsedMs":4500,"timestamp":1711900000000}
{"type":"progress","tool":"gcc-fanalyzer","status":"failed","findingsCount":0,"elapsedMs":120000,"timestamp":1711900120000}
```

**heartbeat** — 25초 간격 keepalive + 진행 상태:

세마포어 대기 중 (`queued`):
```json
{"type":"heartbeat","timestamp":1711900030000,"status":"queued"}
```

분석 실행 중 (`running` — `progress` 필드 포함):
```json
{"type":"heartbeat","timestamp":1711900030000,"status":"running","progress":{"activeTools":["gcc-fanalyzer","cppcheck"],"completedTools":["semgrep","flawfinder"],"findingsCount":26,"filesCompleted":12,"filesTotal":50,"currentFile":"src/http_client.cpp","degraded":true,"degradeReasons":["timeout-floor","timed-out-files"],"toolStates":{"gcc-fanalyzer":{"filesAttempted":50,"filesCompleted":12,"timedOutFiles":2,"failedFiles":0,"batchCount":7,"timeoutBudgetSeconds":60,"perFileTimeoutSeconds":10,"budgetWarning":true,"degraded":true,"degradeReasons":["timeout-floor","timed-out-files"]}}}}
```

| progress 필드 | 타입 | 설명 |
|---------------|------|------|
| activeTools | string[] | 현재 subprocess가 실행 중인 도구 목록 |
| completedTools | string[] | 완료된 도구 목록 |
| findingsCount | int | 현재까지 발견된 누적 findings 수 |
| filesCompleted | int | per-file 도구(gcc-fanalyzer, scan-build) 완료 파일 합산 |
| filesTotal | int | per-file 도구 전체 파일 합산 |
| currentFile | string? | 가장 최근 완료된 파일명 |
| degraded | bool | 현재 스캔이 degraded long-run 상태인지 여부 |
| degradeReasons | string[] | `timeout-floor`, `timed-out-files`, `failed-files` 등 degradation 이유 |
| toolStates | object | heavy analyzer별 상세 진행/예산/timeout 상태 |

**status 필드 (`queued` / `running`)**:
- `queued`: 동시 스캔 세마포어(`SAST_MAX_CONCURRENT_SCANS`, 기본 2) 대기 중. `progress` 없음
- `running`: 분석 실행 중. `progress` 포함

**result** — 최종 스캔 결과 (마지막 줄, 동기 모드 ScanResponse와 동일 스키마):
```json
{"type":"result","data":{"success":true,"scanId":"...","findings":[...],"stats":{...},"execution":{...}}}
```

**error** — 중간 실패 시 (result 대신 마지막 줄):
```json
{"type":"error","code":"REQUIRED_TOOL_EXECUTION_INCOMPLETE","message":"...","retryable":false,"requestId":"req-xxx","execution":{"toolResults":{"semgrep":{"status":"skipped","skipReason":"environment-drift"}}},"staticEvidenceContract":{"gates":{"systemStability":{"status":"fail"}}},"timestamp":1711900060000}
```

### S3 클라이언트 구현 가이드

1. 각 줄을 JSON 파싱하여 `type` 필드로 분기
2. **progress/heartbeat** 수신 시 → 타임아웃 카운터 리셋
3. **heartbeat `status: "queued"`** → stall 감지 비활성화 (대기는 정상)
4. **heartbeat `status: "running"`** → `progress.filesCompleted`가 3회 연속 동일이면 stall 판정 가능
5. **result** 수신 시 → `data` 필드를 기존 ScanResponse로 파싱 (동기 모드와 동일)
6. **error** 수신 시 → 에러 처리
7. **60초간 이벤트 없음** → S4 hang 판정, 연결 종료
8. `X-Request-Id`는 응답 헤더에 포함됨

### 타임아웃 의미 전환

| 모드 | 타임아웃 의미 |
|------|-------------|
| 동기 (`Accept: application/json`) | `X-Timeout-Ms` = 총 소요 시간 한도 |
| 스트리밍 (`Accept: application/x-ndjson`) | 클라이언트가 inactivity timeout 관리. `X-Timeout-Ms`는 S4 내부 도구별 예산으로만 사용 |
| durable ownership (`Prefer: respond-async`) | caller-side elapsed abort가 아니다. scan/paper tool-execution budget shaping에는 반영될 수 있으나, 결과 회수는 `/v1/requests/{requestId}` + `/result`가 담당 |

NDJSON stream은 compatibility surface다. Transport interruption 이후 terminal result 회수가 필요한 production caller는 `Prefer: respond-async`를 사용해야 한다.

---

## POST /v1/scan

6개 SAST 도구를 병렬 실행하고 합산된 SastFinding[]을 반환한다.

### 요청

```json
{
  "scanId": "scan-uuid",
  "projectId": "proj-xxx",
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  },
  "files": [
    {
      "path": "src/main.c",
      "content": "#include <stdio.h>\nint main() { char buf[10]; gets(buf); return 0; }"
    }
  ],
  "buildProfile": {
    "sdkId": "ti-am335x",
    "compiler": "arm-none-linux-gnueabihf-gcc",
    "compilerVersion": "9.2.1",
    "targetArch": "arm-cortex-a8",
    "languageStandard": "c99",
    "headerLanguage": "c",
    "includePaths": ["include", "libraries/rapidjson/include"],
    "defines": {"__ARM_ARCH": "7"},
    "flags": ["-mthumb"]
  },
  "rulesets": ["p/c", "p/security-audit"],
  "options": {
    "timeoutSeconds": 120,
    "tools": ["flawfinder", "cppcheck"]
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scanId | string | O | 스캔 식별자 |
| projectId | string | O | 프로젝트 ID (로깅/추적용) |
| provenance | object | X | Build Snapshot provenance (`buildSnapshotId`, `buildUnitId`, `snapshotSchemaVersion`) |
| files | FileEntry[] | 조건부 | 분석 대상 소스 파일. `projectPath` 없을 때 필수 |
| projectPath | string | 조건부 | 프로젝트 디렉토리 절대 경로. `files` 없을 때 필수. C/C++ 소스 자동 탐색 |
| compileCommands | string | X | `compile_commands.json` 경로. 있으면 Cppcheck `--project=`, clang-tidy `-p`에 사용 |
| buildProfile | BuildProfile | X | 빌드 환경 설정. 있으면 도구 자동 선택 + SDK 해석 |
| rulesets | string[] | X | Semgrep 룰셋. 명시하면 자동 선택보다 우선 |
| thirdPartyPaths | string[] | X | vendored 서드파티 라이브러리 경로 (상대 경로). 지정 시 **(1) scope-early: heavy analyzer (gcc-fanalyzer, scan-build, clang-tidy) 실행 전 해당 경로 파일 제외 + (2) 나머지 도구 findings에서 해당 경로 제거** (cross-boundary는 유지). 미지정 시 기존 동작 |
| options.timeoutSeconds | int | X | 도구당 타임아웃. **`X-Timeout-Ms` 헤더 우선.** 둘 다 없으면 기본 600초 |
| options.tools | string[] | X | 실행할 도구 서브셋. `["semgrep", "cppcheck", "flawfinder", "clang-tidy", "scan-build", "gcc-fanalyzer"]` 중 선택. 미지정 시 전부 실행 (자동 선택 적용) |

#### FileEntry

| 필드 | 타입 | 설명 |
|------|------|------|
| path | string | 상대 파일 경로 (절대 경로, `..` 금지) |
| content | string | 파일 내용 |

#### BuildProfile (S4 analysis-path contract)

`BuildProfile`은 `/v1/scan`, `/v1/functions`, `/v1/includes`, `/v1/metadata`, `/v1/build-and-analyze.scanProfile`의 **analysis path**에서만 사용한다. `/v1/build`는 build execution-only surface라서 `sdkId`/SDK descriptor를 받지 않는다.

S4가 허용하는 SDK resolution contract는 정확히 아래 세 가지다.

| 모드 | 요청 shape | 의미 | registry 접근 | 실패 조건 |
|------|------------|------|---------------|----------|
| no SDK / native | `buildProfile` 생략 또는 SDK field 생략 | SDK-independent / native 분석 | 없음 또는 불필요 | 없음 |
| explicit none | `{"sdkResolutionMode":"none"}` | caller가 SDK 없음(`none`)을 명시 | **금지** | `sdkId` 또는 `sdkDescriptor`가 같이 오면 `SDK_PROFILE_INVALID` 400 |
| non-registered | `{"sdkResolutionMode":"non-registered","sdkDescriptor":{...}}` | caller(S3 등)가 이미 SDK resolve를 끝냈고 S4에는 경로/메타데이터를 넘김 | **금지** | `sdkDescriptor.sdkRootPath` 없으면 `SDK_PROFILE_INVALID` 400 |
| S4-local sdkId | `{"sdkId":"ti-am335x"}` | S4 local registry/root로 결정론적 해석 | 허용 | 모르는 `sdkId`면 `SDK_NOT_FOUND` 400, 분석 중단 |

`custom`/임의 sentinel 값은 더 이상 no-SDK 의미가 아니다. caller가 S4 registry를 타지 않는 SDK를 쓰려면 반드시 `sdkResolutionMode="non-registered"`와 descriptor를 보내야 한다. 알 수 없는 bare `sdkId`는 source-only fallback으로 조용히 진행하지 않고 명시적으로 실패한다.

| 필드 | 타입 | 설명 | 도구 활용 |
|------|------|------|----------|
| sdkId | string? | S4-local SDK 프로파일 ID. `sdkResolutionMode` 없이 사용할 때만 registry/root reference | SDK 헤더 자동 `-I`, env-setup 자동 source |
| sdkResolutionMode | `"none"` \| `"non-registered"`? | SDK 해석 모드. `none`은 registry lookup 금지, `non-registered`는 caller-resolved descriptor 필수 | resolver branch 선택 |
| sdkDescriptor | SdkDescriptor? | `non-registered` 전용 caller-resolved SDK metadata | include/sysroot/compiler/env setup 후보 생성 |
| compiler | string? | 컴파일러 | gcc -fanalyzer에서 SDK 크로스 컴파일러 선택. 미지정 시 sdkId/descriptor로 해석 |
| compilerVersion | string? | 컴파일러 버전 | 로깅 |
| targetArch | string? | 타겟 아키텍처 | 로깅, 향후 `--platform` |
| languageStandard | string? | 언어 표준 | `--std` 플래그. 미지정 시 컴파일러 기본값 사용 |
| headerLanguage | `"c"` \| `"cpp"` \| `"auto"` | `.h` 파일 처리 | 기본 `"auto"`. 룰셋 선택 시 참고 |
| includePaths | string[]? | 추가 인클루드 경로 | `-I`. **상대 경로는 scan_dir 기준으로 자동 변환** |
| defines | Record<string,string>? | 전처리기 매크로 | `-D` |
| flags | string[]? | 추가 컴파일 플래그 | 향후 활용 |

#### SdkDescriptor (`sdkResolutionMode="non-registered"`)

| 필드 | 타입 | 필수 | 설명 |
|------|------|:---:|------|
| sdkRootPath | string | O | caller가 resolve한 SDK root 절대 경로 |
| sysroot | string? | X | `sdkRootPath` 기준 상대 또는 절대 sysroot 경로 |
| setupScript | string? | X | `sdkRootPath` 기준 상대 또는 절대 environment setup script |
| toolchainTriplet | string? | X | 예: `arm-linux-gnueabihf`; sysroot 후보 include/compiler 경로 생성에 사용 |
| compilerPath | string? | X | caller가 확인한 compiler 절대 경로 |
| compilerVersion | string? | X | GCC include 후보 생성/로깅 |
| targetArch | string? | X | target architecture metadata |
| languageStandard | string? | X | target language standard metadata |
| includePaths | string[]? | X | caller가 확인한 include path 목록. S4는 descriptor/sysroot 후보와 합쳐 사용 |
| defines | Record<string,string>? | X | caller-resolved macro metadata(현재 additive) |
| environment | Record<string,string>? | X | caller-resolved environment metadata(현재 additive) |

예시:

```json
{
  "buildProfile": {
    "sdkResolutionMode": "non-registered",
    "sdkDescriptor": {
      "sdkRootPath": "/uploads/sdk/ti-am335x",
      "sysroot": "sysroots/armv7at2hf-neon-linux-gnueabi",
      "toolchainTriplet": "arm-linux-gnueabihf",
      "compilerPath": "/uploads/sdk/ti-am335x/sysroots/x86_64/usr/bin/arm-linux-gnueabihf-gcc",
      "compilerVersion": "9.2.1",
      "includePaths": ["/uploads/sdk/ti-am335x/sysroots/armv7at2hf-neon-linux-gnueabi/usr/include"]
    }
  }
}
```

#### SDK 자동 해석

`buildProfile.sdkId`가 SAST Runner에 등록된 SDK와 매칭되면, 해당 SDK의 **크로스 컴파일러 경로 + 헤더 경로(C++ 표준 라이브러리, GCC 내장, libc)를 자동 해석**하여 도구의 `-I` 옵션에 추가한다.

`non-registered` 모드에서는 S4 registry를 보지 않고 descriptor에서 include/sysroot/compiler/setup 후보를 결정론적으로 산출한다. `none` 모드에서는 registry lookup과 SDK compiler/env setup 해석을 모두 건너뛴다.


`execution.sdk.sdkRootPath` is no longer a public path evidence channel. For registered and non-registered SDK analysis, S4 may use the real descriptor/registry paths internally, but `/v1/scan` response serialization keeps `sdkRootPath` nullable/omitted and reports only `sdkRootPathStatus`:

| `sdkRootPathStatus` | Meaning |
|---|---|
| `configured` | A registry/descriptor SDK root was configured and used as internal resolution input. |
| `not-configured` | No SDK root was configured for the analysis profile. |
| field absent/null | No build profile / no SDK profile information exists. |

Consumers must not require host-local SDK root paths from S4 public evidence; use `resolutionMode`, `resolvedFrom`, `includePathsAdded`, and `sdkRootPathStatus` instead.

#### SDK 레지스트리

**경로 규칙**: `$SAST_SDK_ROOT/{sdkId}/` — `sdkId`가 곧 폴더명.

| 설정 | 값 | 비고 |
|------|------|------|
| 환경변수 | `SAST_SDK_ROOT` | `.env`에 설정. 미설정 시 `~/sdks` 폴백 |
| 폴더 규칙 | `$SAST_SDK_ROOT/{sdkId}/` | sdkId = 폴더명 |

**등록된 SDK:**

| sdkId | SDK | 크로스 컴파일러 | 헤더 경로 수 | environment-setup |
|-------|-----|----------------|:-----------:|:-:|
| `ti-am335x` | TI Processor SDK Linux AM335x 08.02.00.24 | `arm-none-linux-gnueabihf-gcc 9.2.1` | 7 | O |

**새 SDK 추가 방법:**
1. `$SAST_SDK_ROOT/{sdkId}/` 에 SDK 설치 (또는 심링크)
2. `$SAST_SDK_ROOT/sdk-registry.json`에 항목 추가 (코드 수정 불필요)
3. 이 테이블 갱신

#### Findings 필터링 (2단계)

**1단계 — scope-early (도구 실행 전):** `thirdPartyPaths`가 지정되면, heavy analyzer (gcc-fanalyzer, scan-build, clang-tidy)의 **분석 대상에서 해당 경로 파일을 제외**한다. 이는 OOM 방지를 위한 리소스 제어. 제외된 파일 수는 `filtering.filesScopedOut`에 보고.

**2단계 — findings 필터링 (도구 실행 후):**
- `location.file`이 절대 경로(`/`로 시작) → SDK/시스템 헤더 finding → `filtering.sdkNoiseRemoved`
- `location.file`이 `thirdPartyPaths`에 해당 → 서드파티 finding → `filtering.thirdPartyRemoved`
- 단, `dataFlow`에 사용자 코드가 포함되면 **cross-boundary**로 유지 (`origin: "cross-boundary"`)

실측: RE100 + TI AM335x SDK → 필터링 전 254건, 필터링 후 28건 (SDK 200건 + 서드파티 26건 제거, cross-boundary 5건 유지).

### 응답 (200, 성공)

```json
{
  "success": true,
  "scanId": "scan-uuid",
  "status": "completed",
  "findings": [ ... ],
  "stats": {
    "filesScanned": 2,
    "rulesRun": 5,
    "findingsTotal": 28,
    "elapsedMs": 113000
  },
  "execution": {
    "toolsRun": ["cppcheck", "clang-tidy", "flawfinder", "scan-build"],
    "toolResults": {
      "cppcheck": { "findingsCount": 4, "elapsedMs": 110000, "status": "ok", "version": "2.17.1" },
      "clang-tidy": { "findingsCount": 10, "elapsedMs": 5100, "status": "ok", "version": "18.1.3" },
      "flawfinder": { "findingsCount": 14, "elapsedMs": 20, "status": "ok", "version": "2.0.19" },
      "scan-build": { "findingsCount": 0, "elapsedMs": 3000, "status": "ok", "version": "18.1.3" },
      "semgrep": { "findingsCount": 3, "elapsedMs": 800, "status": "ok", "skipReason": null, "version": "1.155.0" },
      "gcc-fanalyzer": { "findingsCount": 0, "elapsedMs": 8000, "status": "ok", "version": "13.3.0" }
    },
    "sdk": {
      "resolved": true,
      "sdkId": "ti-am335x",
      "includePathsAdded": 7,
      "resolutionMode": "s4-registered",
      "resolvedFrom": "s4Registry",
      "sdkRootPath": null,
      "sdkRootPathStatus": "configured",
      "degradeReasons": []
    },
    "filtering": {
      "beforeFilter": 254,
      "afterFilter": 28,
      "sdkNoiseRemoved": 200,
      "thirdPartyRemoved": 26,
      "crossBoundaryKept": 5,
      "filesScopedOut": 480
    }
  },
  "codeGraph": {
    "functions": [ ... ],
    "callEdges": [ ... ]
  },
  "sca": {
    "libraries": [
      {
        "name": "rapidjson",
        "version": "1.1.0",
        "path": "libraries/rapidjson",
        "repoUrl": "https://github.com/Tencent/rapidjson.git",
        "source": "CMakeLists.txt:project()",
        "commit": null,
        "branch": null,
        "tag": null,
        "nearestTag": null,
        "identificationConfidence": "high",
        "versionStatus": "known",
        "versionConfidence": "high",
        "cveLookupEligible": true,
        "versionEvidence": {
          "status": "observed",
          "source": "CMakeLists.txt:project()",
          "value": "1.1.0"
        },
        "diagnostics": ["DIFF_NOT_COMPUTED"],
        "diffAvailable": false,
        "modificationStatus": "unknown",
        "diffSummary": null,
        "provenance": {
          "buildSnapshotId": "bsnap-123",
          "buildUnitId": "bunit-456",
          "snapshotSchemaVersion": "build-snapshot-v1",
          "libraryPath": "libraries/rapidjson"
        }
      }
    ]
  }
}
```

#### codeGraph / sca (optional, projectPath 모드에서만)

| 필드 | 타입 | 조건 | 설명 |
|------|------|------|------|
| codeGraph | object? | projectPath 제공 시 | 함수 목록 + 호출 관계 (`/v1/functions`와 동일 형식) |
| sca | object? | projectPath 제공 시 | 라이브러리 식별 결과. **CVE는 미포함** — S5 `POST /v1/cve/batch-lookup`으로 별도 조회 필요 |

`files[]` 모드에서는 두 필드 모두 `null`. 하위 호환 보장.

#### SastFinding (shared-models.md 준수)

| 필드 | 타입 | 설명 |
|------|------|------|
| toolId | string | `"semgrep"`, `"cppcheck"`, `"flawfinder"`, `"clang-tidy"`, `"scan-build"`, `"gcc-fanalyzer"` 중 하나 |
| ruleId | string | `"{toolId}:{원본 rule ID}"` 형식 |
| severity | string | 도구별 심각도 |
| message | string | 도구가 생성한 설명 |
| location | SastFindingLocation | 소스 위치 |
| dataFlow | SastDataFlowStep[]? | taint/data flow 경로 (있을 때만). gcc-fanalyzer는 note 라인에서 추출 |
| origin | string? | `"cross-boundary"`: SDK/라이브러리 경로 finding이지만 dataFlow가 사용자 코드를 포함. 경계면 취약점 |
| metadata | object? | 아래 참조 |

**metadata 주요 필드:**

| 필드 | 타입 | 설명 | 제공 도구 |
|------|------|------|----------|
| cweId | string? | 대표 CWE ID (예: `"CWE-476"`). cwe 배열의 첫 번째 원소 | 전 도구 (v0.9.0+) |
| cwe | string[]? | CWE ID 목록 (예: `["CWE-476"]`) | 전 도구 (v0.4.0+) |
| references | string[]? | 참고 URL | Semgrep |
| semgrepRuleId | string? | Semgrep 원본 rule ID | Semgrep |
| cppcheckId | string? | Cppcheck error ID | Cppcheck |
| clangTidyCheck | string? | clang-tidy 체크 이름 | clang-tidy |
| gccFlag | string? | gcc -Wanalyzer 플래그 | gcc-fanalyzer |
| checkName | string? | scan-build 체크 이름 | scan-build |
| category | string? | 카테고리 | scan-build |
| flawfinderLevel | int? | 위험 레벨 (1-5) | Flawfinder |
| evidenceResolution | object? | S4가 deterministic evidence semantics를 추가하는 namespaced metadata. 기존 tool metadata와 충돌하지 않도록 `metadata.evidenceResolution` 아래에만 추가된다. | 전 도구 (v0.11.2 evidence-resolution slice) |

#### evidenceResolution metadata (2026-05-11)

`metadata.evidenceResolution`은 S4가 관측한 finding evidence의 해상도를 높이기 위한 additive/null-safe 필드다. S4는 여기서 보안 판정 또는 CVE 결론을 만들지 않는다.

```json
{
  "schemaVersion": "s4-evidence-v1",
  "kind": "sast-finding",
  "toolId": "semgrep",
  "ruleId": "c.security.strcpy",
  "cwe": { "status": "known", "id": "CWE-120", "source": "metadata.cweId" },
  "location": { "status": "present", "file": "src/vulnerable.c", "line": 4, "column": 5, "endLine": null, "endColumn": null },
  "dataFlow": { "present": true, "stepCount": 1 },
  "origin": { "status": "user-code", "source": "default" },
  "diagnostics": []
}
```

- CWE가 없으면 `cwe.status="unknown"`, `cwe.id=null`, diagnostic `CWE_UNKNOWN`을 사용한다.
- dataflow가 없으면 `dataFlow.present=false`, `stepCount=0`, diagnostic `DATAFLOW_NOT_PROVIDED`를 사용한다.
- cross-boundary finding은 기존 top-level `origin="cross-boundary"`를 유지하고 `evidenceResolution.origin.status="cross-boundary"`로 반복 표기한다.
- 금지 필드: `vulnerable`, `safe`, `affected`, `clean`, `riskScore`, `securityVerdict`. Unknown/incomplete는 안전하다는 뜻이 아니다.

#### enriched `scan.sca.libraries[]` (2026-05-11)

`projectPath` 기반 `/v1/scan`은 library item을 더 이상 `name/version/path/repoUrl`로만 축약하지 않고, 아래 additive evidence fields를 함께 제공한다. `/v1/build-and-analyze`의 top-level `libraries[]`는 nested `scan.sca.libraries[]`와 같은 shape를 그대로 미러링한다. `/v1/libraries`는 계속 full-detail upstream diff endpoint다.

| 필드 | 의미 |
|---|---|
| `name`, `version`, `path`, `repoUrl` | 기존 consumer compatibility fields. `version`/`repoUrl`는 모르면 `null`. |
| `source` | 식별 방법: `git`, `CMakeLists.txt:project()`, `configure.ac:AC_INIT()`, `package.json`, `directory_name` 등. |
| `commit`, `branch`, `tag`, `nearestTag` | `.git` 기반 vendored library에서 관측 가능한 git evidence. 없으면 `null`. |
| `identificationConfidence` | `high` / `medium` / `low`. directory-name only는 `low`. |
| `versionStatus` | 현재 first pass는 deterministic observed version이면 `known`, 없으면 `unknown`. |
| `versionConfidence` | `high` / `medium` / `none`. version이 없으면 `none`. |
| `cveLookupEligible` | S3가 S5 CVE lookup 후보로 보낼 수 있는지에 대한 deterministic hint. `name`과 `version`이 있을 때만 true. CVE 결과가 아니다. |
| `versionEvidence` | `{status, source, value}`. 버전을 관측했으면 `status="observed"`, 없으면 `status="missing"`. |
| `diagnostics` | 예: `VERSION_UNKNOWN`, `REPO_URL_UNKNOWN`, `DIFF_NOT_COMPUTED`, `DIFF_UNAVAILABLE`. |
| `diffAvailable`, `modificationStatus`, `diffSummary` | `/v1/scan`은 full diff를 강제하지 않는다. 미계산이면 `false`, `unknown`, `null` 및 `DIFF_NOT_COMPUTED`. |
| `provenance` | caller provenance echo에 `libraryPath`를 더한 per-library projection. caller provenance가 없으면 `null`. |

#### execution 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| toolsRun | string[] | 실제 실행된 도구 목록 |
| toolResults | dict | 도구별 {findingsCount, elapsedMs, status, skipReason?, version?, timedOutFiles?, failedFiles?, filesAttempted?, batchCount?, timeoutBudgetSeconds?, perFileTimeoutSeconds?, budgetWarning?, degraded?, degradeReasons?} |
| sdk | object | {resolved, sdkId?, includePathsAdded} |
| filtering | object | {beforeFilter, afterFilter, sdkNoiseRemoved, **thirdPartyRemoved**, **crossBoundaryKept**, **filesScopedOut**} |

`toolResults[*].status` 값: `"ok"`, `"partial"`, `"skipped"`, `"failed"`. `"partial"`은 일부 파일이 timeout되었으나 나머지는 정상 완료된 경우

`toolResults[*].version`: 해당 도구의 설치 버전 (예: `"2.17.1"`). 스캔 재현성 추적용.

`toolResults[*].timedOutFiles` / `failedFiles`: `"partial"` 상태일 때, timeout/실패한 파일 수. gcc-fanalyzer/scan-build 전용.

`toolResults[*].filesAttempted`, `batchCount`, `timeoutBudgetSeconds`, `perFileTimeoutSeconds`, `budgetWarning`, `degraded`, `degradeReasons`: long-run heavy analyzer의 예산/배치/degraded 상태를 설명하는 추가 메타데이터.

### explicit Quick output contract

S2가 canonical Quick 결과로 정규화해야 하는 authoritative output은 아래다.

- `findings`
- `stats`
- `execution`
- `provenance` (입력 provenance echo)

`codeGraph` 와 `sca` 는 `projectPath` 모드에서만 제공되는 부가 결과다.
canonical Quick 여부는 응답 이름이 아니라 **호출 방식**으로 결정한다.
즉, upstream이 `/v1/build` 의 ready build evidence를 확보한 뒤 `compileCommands` 를 포함해 `POST /v1/scan` 을 호출한 경우를 explicit Quick로 본다.

#### Findings 필터링 기준

| 분류 | location 경로 | dataFlow | 결과 |
|------|---------------|----------|------|
| 사용자 코드 | 상대 경로 | — | **유지** |
| 경계면 (cross-boundary) | 절대 경로 (SDK/lib) | 사용자 코드 step 포함 | **유지** + `origin: "cross-boundary"` |
| 순수 SDK/라이브러리 내부 | 절대 경로 | 없거나 전부 외부 | **제거** |

### 응답 (에러)

```json
{
  "success": false,
  "scanId": "scan-uuid",
  "status": "failed",
  "error": "에러 메시지",
  "errorDetail": {
    "code": "SCAN_TIMEOUT",
    "message": "Semgrep scan exceeded 120s timeout",
    "requestId": "req-xxx",
    "retryable": true
  }
}
```

| 코드 | HTTP | retryable | 설명 |
|------|------|-----------|------|
| `NO_FILES_PROVIDED` | 400 | N | `files`와 `projectPath` 모두 미제공, 또는 경로 검증 실패 |
| `SDK_NOT_FOUND` | 400 | N | `buildProfile.sdkId`가 명시됐지만 registry/SDK root 어디에서도 찾을 수 없음. native/non-SDK build는 `sdkId`를 생략해야 함 |
| `DISALLOWED_TOOL_OMISSION` | 503 | N | 허용되지 않은 도구 omission (`runtime-tool-missing`, `tool-check-failed`) |
| `DISALLOWED_TOOL_ENVIRONMENT_DRIFT` | 503 | N | service-owned executable path는 존재하지만 runtime PATH/lookup이 깨진 경우 |
| `SCAN_TIMEOUT` | 504 | Y | 도구 타임아웃 초과 |
| `SARIF_PARSE_ERROR` | 502 | N | 출력 파싱 실패 |
| `INTERNAL_ERROR` | 500 | N | 예상치 못한 에러 |

---

## POST /v1/functions

소스 파일들에서 **함수 목록 + 호출 관계**를 추출한다. clang AST 기반.

### 요청

`POST /v1/scan`과 동일한 형식 (scanId, projectId, files, buildProfile).

### 응답

```json
{
  "functions": [
    {
      "name": "postJson",
      "file": "src/http_client.cpp",
      "line": 8,
      "calls": ["access", "fgets", "fprintf", "getenv", "pclose", "popen", "readlink", "strcmp"]
    },
    {
      "name": "curl_exec",
      "file": "libraries/libcurl/curl_exec.c",
      "line": 42,
      "calls": ["curl_multi_perform", "curl_easy_setopt"],
      "origin": "modified-third-party",
      "originalLib": "libcurl",
      "originalVersion": "7.68.0"
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 함수 이름 |
| file | string | 정의된 파일 (상대 경로) |
| line | int | 정의 시작 줄 |
| calls | string[] | 이 함수 내에서 호출하는 함수 이름 목록 |
| origin | string? | `"third-party"` (원본) 또는 `"modified-third-party"` (수정됨). 프로젝트 코드면 필드 없음. **projectPath 모드에서만** |
| originalLib | string? | 원본 라이브러리명. origin이 있을 때 |
| originalVersion | string? | 원본 라이브러리 버전. 버전 식별 성공 시 |

**필터링** (3단계):
1. `loc.file`이 소스 파일과 다르면 제거 (헤더에서 온 함수)
2. `line`이 소스 파일 줄 수를 초과하면 제거 (전처리 전개로 인한 가상 위치)
3. 함수 본문(`CompoundStmt`)이 없으면 제거 (`extern` 선언만 있는 헤더 함수)
4. `__` 접두사, `operator`, `isImplicit` 함수 제거

**호출 관계 추출**: 함수 본문 내의 `CallExpr`에서 callee를 추출. `ImplicitCastExpr → DeclRefExpr` 구조와 `MemberExpr`을 모두 처리.

---

## POST /v1/includes

파일별 **인클루드 의존성 트리**를 추출한다. `gcc -E -M` 기반.

### 요청

`POST /v1/scan`과 동일한 형식. `files[]` 또는 `projectPath` 중 하나 필수.

### 응답

```json
{
  "includes": {
    "src/http_client.cpp": [
      "include/http_client.hpp",
      "<external>/stdio.h"
    ]
  }
}
```

BuildProfile에 SDK가 지정되면 **SDK 크로스 컴파일러**로 인클루드 해석. SDK가 없으면 호스트 gcc 사용.


Public include dependency evidence never exposes absolute host-local, SDK, sysroot, or system include paths. Project-local absolute dependencies are normalized to scan-root-relative paths; external absolute dependencies are represented as `<external>/<basename>` or `<external>/<unknown>`. Relative dependency tokens remain unchanged.

---

## POST /v1/metadata

타겟 **빌드 환경 매크로**를 추출한다. `gcc -E -dM` 기반.

### 요청

`POST /v1/scan`과 동일한 형식. `files`는 비어있어도 됨 (컴파일러 기본 매크로만 추출).

### 응답

The `compiler` response field is public evidence and contains only the compiler executable identity plus optional version (for example, `arm-none-linux-gnueabihf-gcc 9.2.1`), not an absolute SDK/compiler path; S4 still uses the real compiler path internally for execution.

```json
{
  "compiler": "arm-none-linux-gnueabihf-gcc 9.2.1",
  "macros": {
    "__ARM_ARCH": "7",
    "__SIZEOF_POINTER__": "4",
    "__SIZEOF_LONG__": "4",
    "__cplusplus": "201402L",
    "__BYTE_ORDER__": "__ORDER_LITTLE_ENDIAN__"
  },
  "targetInfo": {
    "arch": "arm",
    "pointerSize": 4,
    "longSize": 4,
    "endianness": "little",
    "cppStandard": "201402L"
  }
}
```

호스트 gcc (x86_64) vs SDK 크로스 컴파일러 (ARM32)의 차이를 에이전트가 확인할 수 있다.

---

## GET /v1/health

서비스 상태 및 6개 도구 가용성 확인.

선택적으로 `requestId` query parameter를 주면, 해당 스캔 요청의 최소 request-summary control signal을 함께 반환한다.
미지정 시 가장 최근 active 요청(없으면 idle summary)을 반환한다.

```json
{
  "service": "s4-sast",
  "status": "ok",
  "semgrep": { "available": true, "version": "1.156.0" },
  "policyStatus": "ok",
  "policyReasons": [],
  "unavailableTools": [],
  "allowedSkipReasons": ["operator-requested-subset", "profile-not-applicable"],
  "version": "0.11.2",
  "tools": {
    "semgrep": { "available": true, "version": "1.156.0" },
    "cppcheck": { "available": true, "version": "2.13.0" },
    "flawfinder": { "available": true, "version": "2.0.19" },
    "clang-tidy": { "available": true, "version": "18.1.3" },
    "scan-build": { "available": true, "version": "scan-build" },
    "gcc-fanalyzer": { "available": true, "version": "13.3.0" }
  },
  "defaultRulesets": ["p/c", "p/security-audit"],
  "activeRequestCount": 1,
  "requestSummary": {
    "requestId": "req-scan-123",
    "endpoint": "scan",
    "state": "running",
    "ackStatus": "active",
    "localAckState": "phase-advancing",
    "lastAckAt": 1711900030000,
    "lastAckSource": "runtime-state",
    "localAckSources": [
      "request-accepted",
      "semaphore-acquired",
      "build-started",
      "tool-progress",
      "file-progress",
      "runtime-state",
      "build-subprocess-alive",
      "build-phase-complete",
      "terminal-result",
      "ack-break"
    ],
    "degraded": true,
    "degradeReasons": ["timeout-floor"],
    "activeTools": ["gcc-fanalyzer"],
    "completedTools": ["semgrep"],
    "findingsCount": 12,
    "filesCompleted": 5,
    "filesTotal": 20,
    "currentFile": "src/main.c",
    "blockedReason": null
  }
}
```

- `status`는 서비스 availability의 coarse health를 유지한다.
- `policyStatus`는 허용/비허용 omission 관점의 실행 정책 상태를 나타낸다.
- top-level `semgrep` 필드는 backward compatibility를 위해 유지되며, canonical tool matrix는 `tools` 필드다.
- `requestSummary` 는 full request dump가 아니라 polling caller를 위한 최소 control signal이다.
- 같은 additive summary shape를 `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`에 공통으로 사용하며, `endpoint` 필드가 현재 제어 대상 surface를 식별한다.

### health consumer interpretation

- `/v1/health.tools[*].available=true` 및 `policyStatus="ok"`는 **도구 생존성 / 시스템 안정성 preflight** 신호다.
- 이 신호는 validation/test/canary 품질 threshold 통과를 의미하지 않는다. 품질 threshold 판정은 runtime `/v1/scan`이 아니라 offline experiment report의 `qualityGate.localQualityAssessment`에서 확인한다.
- 2026-05-12 로컬 재검증 기준 current six는 모두 alive이며 `policyStatus="ok"`였다. 2026-05-13 S4 harness fixture의 offline report 상태는 `corpusReadinessGate.status="blocked"`, `qualityGate.status="not_decision_grade"`, `qualityGate.localQualityAssessment.status="fail"`이다.
- 따라서 caller는 **시스템 안정성 Gate**, **decision-grade corpus readiness**, **품질 Gate**를 분리해야 한다. 도구가 살아 있어도 local corpus가 없거나 local oracle 품질이 실패할 수 있고, 품질/코퍼스 readiness 실패는 `REQUIRED_TOOL_UNAVAILABLE`/`REQUIRED_TOOL_EXECUTION_INCOMPLETE` 같은 시스템 안정성 오류로 해석하면 안 된다.


### Tool Portfolio offline report consumer interpretation

`s4-tool-portfolio-experiment-report-v1` is an offline/benchmark report artifact, not a production `/v1/scan` response. S3 may consume it only as tool-portfolio readiness/quality evidence when S4 attaches or publishes the artifact separately. Runtime vulnerability claims still use `/v1/scan` `staticEvidenceContract` and the caller's own analysis policy.

Actual runner note: `benchmark.tool_portfolio_actual_runner` is an offline benchmark CLI. It creates a case-only staging tree before invoking tools so text/tree analyzers do not scan the full extracted Juliet/SARD cache. It emits all required Tool Portfolio config keys and keeps top-level `systemStabilityGate` scoped to `full-current-six` executions. This is not a production API surface.

S4-owned consumer canary note: `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` is the local contract canary for this offline report, emitting `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"`; `python -m benchmark.tool_portfolio_report_consumer_canary --report <path> --require-decision-grade` is the smoke-gate CLI form. Consumers that use the helper/CLI must require `toolPortfolioDecisionGradeUsable=true`; `runnerIntegrityOnly=true`, malformed/wrong schema, blocked gates, non-discriminating thresholds, or `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` means the artifact is not decision-grade quality evidence.

Observed low-threshold actual-run metrics from `report-after-stage-path-fix.json` are intentionally not quality-sufficiency evidence: validation recall `0.25`, precision `0.0221`, `fpFindings=221`; test recall `0.2`, precision `0.0129`, `fpFindings=307`. The report encodes this directly with `qualityGate.status="not_decision_grade"`, `qualityGate.localQualityAssessment.status="not_decision_grade"`, `qualityGate.localQualityAssessment.thresholdProfile.intent="runner-integrity-only"`, and `QUALITY_THRESHOLDS_NON_DISCRIMINATING`. `qualityDiagnostics` explains the low metrics without acting as a gate: validation finding pressure is `uniqueRaw=226`, `tp=5`, `oracleFP=221`; test finding pressure is `uniqueRaw=311`, `tp=4`, `oracleFP=307`. Both splits expose candidate investigation lanes `matching-policy-review`, `cwe-normalization-review`, `negative-discrimination-review`, `recall-gap-investigation`, and `noise-pressure-review`. `toolContributionDiagnostics` is also available with six stable current-six rows: `semgrep`, `scan-build`, and `gcc-fanalyzer` are unique-positive contributors; `cppcheck` and `clang-tidy` are overlap-only positive contributors; `flawfinder` is noise-without-positive-contribution for this low-threshold runner-integrity slice. The staged acquisition paths in this artifact are absolute, so relative CLI `--work-dir` no longer creates a false readiness block. Consumers must treat this run as runner-integrity and diagnostic evidence only.

Authoritative fields for downstream consumers:

| Field | Consumer meaning |
|---|---|
| `systemStabilityGate.status` | Report-side required-tool/system precondition. Final report quality can pass only when this is `pass`. |
| `systemStabilityGate.qualityGateAllowed` | Quality scoring eligibility latch. It must be `true` only with `systemStabilityGate.status="pass"`; missing/non-bool, pass+false, non-pass+true, unknown status, and absent system gate cannot produce `qualityGate.status="eligible"` or `pass`. |
| `corpusReadinessGate.status` + `decisionGradeReady` | Decision-grade external corpus precondition. Validation/test evidence is decision-grade only when `status="available"` and `decisionGradeReady=true`. |
| `validationMetrics.status`, `testMetrics.status`, `canaryMetrics.status` | Deterministic scoring-run status for each split. This is not threshold quality by itself. |
| `qualityGate.localQualityAssessment.status` | Local oracle threshold result for the primary tool-set config. `not_decision_grade` means scoring may have run but the threshold profile is not quality-sufficiency evidence. |
| `qualityGate.localQualityAssessment.thresholdProfile` | Threshold-intent classifier. `intent="runner-integrity-only"` with `QUALITY_THRESHOLDS_NON_DISCRIMINATING` prevents permissive smoke/integrity thresholds from being consumed as decision-grade quality. |
| `qualityDiagnostics` | Diagnostic-only decomposition for the primary tool-set config. It separates target-row outcomes, unique raw finding pressure, match-attempt counters, expected-CWE buckets, by-tool raw pressure, deterministic hints, and candidate investigation lanes. It must not be treated as a gate, root-cause claim, or verdict. |
| `toolContributionDiagnostics` | Diagnostic-only per-tool current-six contribution/noise evidence aggregated over `includedSplits`. It derives from single-tool and leave-one-out scores, never recommends add/remove/upgrade, and is `not_run` when comparative config evidence is incomplete. |
| `qualityGate.status` | Final offline report gate after system stability, corpus readiness, threshold profile, and local quality prerequisites are combined. |
| `qualityGate.reasonCodes` | Direct helper output is allowlist-sanitized for propagated system-stability and corpus-readiness reasons; malformed/unknown entries are replaced by input-invalid sentinels and arbitrary caller strings/object reprs are not emitted. |
| `decisionSupport.externalCorpusStatus` | Compatibility projection derived from `corpusReadinessGate`; it is not authoritative when the two disagree. |

S3 fail-closed rules:

- `corpusReadinessGate` is authoritative over legacy `decisionSupport.externalCorpusStatus`. A non-available readiness gate must not be overridden by a compatibility `available` field.
- Offline corpus manifests require strict safe relative `sourcePath` values for report/scoring paths: no blank/whitespace, no POSIX absolute, no Windows drive/UNC absolute after backslash normalization, and no `..` segment. Readiness may still accept the manifest shape to emit blocked JSON, but the same unsafe forms must surface as `CORPUS_CASE_SOURCE_PATH_UNSAFE`, not as available/missing evidence, and unsafe case statuses must redact the raw path as `sourcePath="<unsafe>"` plus `sourcePathStatus="unsafe"`. CLI invalid-output JSON must likewise use fixed sanitized error text plus safe `errorClass`, not raw exception messages or local paths; `--output` write failures fall back to sanitized stdout JSON with `CORPUS_READINESS_OUTPUT_WRITE_FAILED`. Readiness case/acquisition statuses use status-only local-path fields and must not expose host-local `resolvedPath`, `localPath`, or `resolvedLocalPath`; absent acquisitions use `not_declared`/`not_resolved`. The frozen status vocabularies are `localPathStatus=available|base_required|missing|not_declared|not_resolved|outside_base`, `resolvedLocalPathStatus=available|missing|not_resolved|outside_base`, `resolvedPathStatus=available|checksum_mismatch|missing|outside_root|unsafe`, and `sourcePathStatus=unsafe`. Caller-provided offline `corpusReadinessGate` payloads are validated against the same contract before report emission: available gates must prove available path statuses, extra acquisition entries cannot carry raw paths, and unsafe `caseStatuses[].sourcePath` values fail closed without raw echo. Caller-provided top-level gate `status` diagnostics are also sanitized: invalid nonblank strings are reported as `<invalid>`, blank strings as `<blank>`, and non-string statuses expose only the safe JSON type. System-stability pass-evidence diagnostics apply the same rule to caller-provided `requiredTools[]` and `phases.*.status`: unknown tool IDs and invalid phase status strings are redacted, non-string values expose only field/type, while S4-generated missing-current-six tool names remain visible. Legacy `external_corpus_status` invalid diagnostics also redact arbitrary invalid keys and unknown field labels (`<invalid>` plus safe type where relevant), while valid accepted non-readiness-owned legacy entries are still preserved as compatibility context. Invalid `matchingPolicy` diagnostics likewise redact arbitrary unknown keys, schemaVersion values, and out-of-range lineWindow values while keeping category/field/type/expected evidence and preserving valid default canonicalization. Actual-runner staging also requires explicit `--base-path` for relative acquisition `localPath`; direct staging must not resolve relative corpus roots against cwd.
- Caller-provided `corpusReadinessGate.status="available"` is accepted only when it proves required-corpus readiness through required corpora, acquisition statuses, case statuses, checked/split counts, and external projection acquisition IDs. Forged or malformed available gates are not decision-grade.
- `requiredCorpora` IDs must be strict safe strings; malformed IDs fail closed with `CORPUS_REQUIRED_CORPUS_ID_INVALID` without raw echo. Safe unknown required corpora project as generic `external`, not as raw external status keys.
- Caller-provided readiness projections are sanitized before report emission: only `juliet`/`sard`/`external`/`requiredCorpusReadiness`, allowed nested fields, validated acquisition IDs, and allowlisted readiness reason codes survive. Unknown nested fields and safe-shaped malicious keys/reasons do not appear in `corpusReadinessGate` or `decisionSupport.externalCorpusStatus`.
- Legacy `external_corpus_status` may be shown in `decisionSupport.externalCorpusStatus`, but final gate decisions and required follow-ups are derived from `corpusReadinessGate` only.
- `systemStabilityGate.status="not_run"`, `blocked`, or `fail` preserves useful metric evidence but cannot produce decision-grade quality pass.
- Direct `build_system_stability_gate()` unavailable-tool preflight failures expose only status metadata: allowlisted `reasonCode`, `versionStatus=present|missing`, and `expectedExecutablePathStatus=redacted|not-configured`. Raw `version`, `expectedExecutablePath`, and arbitrary `probeReason` values are internal-only and must not be emitted.
- Direct `build_system_stability_gate()` execution-completeness failures expose sanitized metadata only: `status` is allowlisted or `unknown`, `reasonCode` is allowlisted or a safe fallback, `degradeReasons` are allowlisted strings, and timeout/failure counts are nonnegative integers or `null`; arbitrary skip/status/degrade/count objects must not be emitted or stringified.
- Direct `build_system_stability_gate()` required-tool identity is value-sanitized: known current-six IDs remain canonical, while unknown/blank/non-string entries collapse to a single `<invalid>` sentinel in `requiredTools` and `REQUIRED_TOOL_UNKNOWN` preflight evidence.
- Direct `blocked_metric_bucket()` output is value-sanitized: `split` is `validation|test|canary` or `<invalid>`, and `reasonCodes` are system top-level allowlisted with `SYSTEM_STABILITY_GATE_INPUT_INVALID` for malformed containers/items.
- `systemStabilityGate.status="pass"` is accepted only with current-six complete `requiredTools` and valid nested `preflight`/`executionCompleteness` pass evidence. Malformed pass gates are input-invalid; fail/not_run gates may preserve minimal evidence.
- `validationMetrics.status="pass"` or `testMetrics.status="pass"` means scoring ran; S3 must inspect `qualityGate.localQualityAssessment`, `qualityGate.localQualityAssessment.thresholdProfile`, and final `qualityGate.status` before using the report as quality evidence. If `thresholdProfile.intent="runner-integrity-only"`, the report is not decision-grade even when split metrics are present.
- `qualityDiagnostics.status="available"` means diagnostic decomposition is available for scored splits. It does **not** make the report decision-grade, does not override `qualityGate`, and does not provide negative security evidence. `byTool` raw pressure fields intentionally do not expose per-tool counted FP attribution. `diagnosticTriage.candidates[]` are ordered local investigation lanes only; `noise-pressure-review` requires oracle-counted FP evidence, not raw-only non-TP pressure.
- `toolContributionDiagnostics.status="available"` means comparative single-tool/leave-one-out evidence was complete enough to emit deterministic per-tool rows. It does **not** recommend adding, removing, or upgrading tools and does not override quality/readiness gates. `status="not_run"` with `TOOL_CONTRIBUTION_COMPARATIVE_CONFIG_INCOMPLETE` means consumers must not infer `no-observed-signal` for missing/degraded comparative configs.
- If consuming the S4-owned Tool Portfolio report consumer canary summary, consumers must treat `toolPortfolioDecisionGradeUsable=false` as not decision-grade and must not reinterpret `reasonCodes`, `requiredFollowUps`, `diagnosticCandidateIds`, or `toolContributionClasses` as recommendations. Unsafe projection (`TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`) is a contract-consumption blocker, not a vulnerability finding.
- Blocked readiness, invalid local thresholds, local quality failure, system gate failure, or empty findings are **not** negative security evidence and must not be converted into `sast_no_findings`, `cve_no_hits`, `absence-of-vulnerability`, or a final vulnerability verdict.
- SARD aggregate status may contain vulnerable and secure acquisition IDs together; consumers must not collapse it to a single boolean that hides one side's blocked/error state.

S4 issued the S3 alignment WR at `wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md`.

### request-summary mapping

| 요청 요약 필드 | 의미 |
|---|---|
| `state=\"queued\"` | 스캔 요청은 등록됐지만 S4 동시성 세마포어를 아직 획득하지 못한 상태 |
| `state=\"running\"` + `localAckState=\"phase-advancing\"` | scan progress/file progress/runtime-state 또는 build phase completion처럼 S4가 최근의 실제 로컬 진행 전이를 관측한 상태 |
| `state=\"running\"` + `localAckState=\"transport-only\"` | build / build-and-analyze의 장시간 컴파일 구간처럼 프로세스 생존은 확인되지만 더 강한 로컬 진행 증거는 아직 없는 상태 |
| `degraded=true` | 기존 scan heartbeat/execution semantics의 degraded 상태가 health summary에도 반영된 상태 |
| `localAckState=\"ack-break\"` 또는 `ackStatus=\"broken\"` + `state=\"failed\"/\"cancelled\"` | local ack break equivalent. 내부 build/scan 루프가 예외/정책실패/취소로 비정상 종료되어 upper caller가 abort 대상으로 간주해야 하는 상태 |

### local ack sources

S4가 liveness로 신뢰하는 local ack source는 아래다.

- request accept (`request-accepted`)
- scan semaphore acquire (`lastAckSource=\"semaphore-acquired\"`)
- build phase start (`build-started`)
- tool progress callback (`tool-progress`)
- per-file progress callback (`file-progress`)
- runtime-state callback (`runtime-state`)
- build subprocess aliveness heartbeat (`build-subprocess-alive`)
- build phase completion (`build-phase-complete`)
- terminal result emission (`terminal-result`)
- request cancellation (`request-cancelled`)

S4는 **전역 wall-clock stall threshold를 health contract에 노출하지 않는다.**
ack break는 시간 경과가 아니라 **내부 실행 흐름의 명시적 비정상 종료**로 판단한다.

### upper caller abort guidance

Polling caller는 아래 조건을 abort signal로 취급해야 한다.

- `requestSummary.requestId` 가 일치하는 요청에서 `localAckState=\"ack-break\"`
- 또는 `ackStatus=\"broken\"`
- 또는 `state=\"failed\"/\"cancelled\"` 이고 `blockedReason` 이 채워진 경우

반대로 `state=\"queued\"` / `state=\"running\"` / `degraded=true` 만으로는 abort 사유가 아니다.
degraded는 실행 지속 가능 상태를 의미하며, final success/failure는 요청 본응답 또는 terminal health summary로 판단한다.

---

## 헤더 규약

| 헤더 | 방향 | 설명 |
|------|------|------|
| `X-Request-Id` | 요청 | correlation ID. 없으면 SAST Runner가 `req-{uuid}` 자동 생성 |
| `X-Request-Id` | 응답 | 동일 ID 반환 |

`X-Request-Id`는 SAST Runner 내부의 **모든 로그**에 `requestId` 필드로 전파된다 (contextvars 기반). `grep '{request-id}' logs/s4-sast-runner.jsonl`로 특정 요청의 전 구간 추적 가능.

---

## 로깅

| 항목 | 값 |
|------|-----|
| 로그 파일 | `logs/s4-sast-runner.jsonl` |
| 형식 | JSON structured (observability.md 준수) |
| 필수 필드 | `level`, `time` (epoch ms), `service` ("s4-sast"), `msg` |
| 요청 추적 | `requestId` — 라우터 ~ 오케스트레이터 ~ 개별 러너까지 전 레이어 전파 |
| scan summary | `Scan execution summary` — 도구별 findings/latency/status, filtering, SDK, compileCommands, degraded 상태 |
| build summary | `Build execution summary` — readiness, compileCommandsReady/quickEligible, entries/userEntries/exitCode/failureCategory |
| terminal summary | `Request terminal summary` — requestSummary terminal state/ackStatus/localAckState/blockedReason |
| paper static-evidence lifecycle | `paper static-evidence request start/end/error/accepted` — includes `requestId`, `caseId`, `buildTargetId`, `paperRunId`, completion `status`, `elapsedMs`, and safe `bundleStatus`/`code` where applicable; does not log raw `sourceRoot`, compile DB paths, or caller secrets |
| unknown internal exception | fixed `internal error` / `INTERNAL_ERROR` with safe `exceptionType` metadata only; raw exception text and tracebacks are not public/log contract surfaces |
| startup readiness | `SAST Runner runtime configuration`, `SAST Runner ready for traffic` — hotReload/config/tool-policy 상태 |
| tool executable path evidence | runtime health/startup/preflight surfaces expose `expectedExecutablePathStatus` only; raw expected executable paths are internal probe data |
| startup runtime config paths | startup config logs expose `logDirConfigured`/`logDirSource`, not raw log directory paths |
| SDK registry/enrichment logs | category/count-only (`SDK registered`, `SDK unregistered`, `SDK resolved ...`); raw sdkId, SDK install paths, and include paths are not log contract surfaces |
| router SDK identity logs | `Scan started` and `Scan execution summary` expose `sdkIdProvided`/`executionSdkIdProvided` booleans only; raw `sdkId` is forbidden in router logger extras |
| SDK execution root evidence | `/v1/scan` `execution.sdk.sdkRootPath` is nullable/omitted; use status-only `sdkRootPathStatus=configured|not-configured` instead of raw descriptor/registry paths |
| unknown bare sdkId | `SDK_NOT_FOUND` public surfaces are value-free: sync `/v1/scan`, NDJSON validation JSON, `/v1/build-and-analyze` pre-build validation, logs, and request summaries must not echo caller-supplied `sdkId`; use fixed guidance for registered / `non-registered` / `none` modes |
| unknown scan tool IDs | `SCAN_TOOL_INVALID` public surfaces are value-free: sync `/v1/scan`, NDJSON validation JSON, `/v1/build-and-analyze` pre-build validation, logs, and request summaries must not echo caller-supplied unknown `options.tools[]`; use fixed current-six allowed-tool guidance |
| request validation errors | FastAPI/Pydantic pre-router validation failures return fixed `REQUEST_VALIDATION_FAILED` / `request validation failed` with sanitized structural `validationErrors[]`; raw request `input`, `ctx`, `url`, and body values are not public/log contract surfaces |
| request validation locations | 422 `validationErrors[].loc` exposes only known schema/transport field names plus integer indices; dynamic caller-controlled mapping keys are redacted as `<field>` |
| request validation map-key locations | Under mapping fields (`buildEnvironment`, `defines`, `environment`), following string loc segments are always `<field>` even if they equal allowlisted schema names |
| request validation generated request IDs | Pre-router 422 responses preserve incoming `X-Request-Id`; if absent, S4 generates `req-{uuid}`, returns it in the response header, and uses the same value in `errorDetail.requestId` and logs |
| direct preflight validation errors | `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` direct 400 branches preserve `error` and include `success=false` plus `errorDetail{code,message,requestId,retryable=false}` |
| durable ownership missing/expired errors | Request status/result/cancel missing or expired responses preserve `error`/`requestId` and include `success=false` plus `errorDetail{code,message,requestId,retryable=false}` |
| durable ownership request-id conflicts | Cross-endpoint durable `X-Request-Id` reuse preserves HTTP 409 and routing fields while returning `success=false` plus `errorDetail{code="REQUEST_ID_CONFLICT",message,requestId,retryable=false}` |
| include dependency paths | `/v1/includes` dependency lists use scan-root-relative project paths or `<external>/<basename>`; raw absolute host/SDK include paths are not public evidence |
| finding/dataFlow external paths | `/v1/scan` retained cross-boundary findings redact external absolute paths in `location.file`, `dataFlow[].file`, and evidenceResolution location to `<external>/<basename>`/`<external>/<unknown>` after internal filtering |
| clone cache logs | LibraryDiffer clone-cache HIT/MISS logs are category/age/freshness-only; raw repository URLs, tokens, hosts, and repo paths are not log contract surfaces |
| Juliet benchmark no-suite logs | Offline benchmark empty-selection diagnostics are category-only and must not emit host-local Juliet roots, requested CWE lists, variant filters, or source paths |
| Juliet benchmark custom-rules state | `run_benchmark(custom_rules=false)` restores `settings.custom_rules_dir` in a `finally` block on success, no-suite return, and discovery exceptions; benchmark runs must not contaminate later S4 tool state |
| Juliet benchmark suite progress logs | Per-suite benchmark progress emits stable CWE key and file count only; corpus-derived CWE directory suffixes (`suite.cwe_name`) are not log contract surfaces |
| benchmark report CWE display names | Generated benchmark JSON `cweName` uses a deterministic allowlist keyed by `CWE-*`; unknown CWEs fall back to the CWE id and never echo corpus-derived `cwe_name` text |
| Juliet benchmark start tool selector logs | Start summary logs expose `toolSelection=all|custom` and `toolCount` only; caller-provided `tools[]` values are execution inputs, not log contract surfaces |
| Juliet benchmark start variant-filter logs | Start summary logs expose `variantSelection=all|filtered` only; caller-provided `variant_filter` values are discovery inputs, not log contract surfaces |
| benchmark compare markdown labels | Public benchmark comparison markdown uses fixed role labels (`baseline artifact` / `current artifact`); caller-provided baseline/current paths are internal comparison inputs, not report output surfaces |
| CLI artifact preflight filesystem probes | Standalone compare `--baseline`/`--current` and Juliet `--baseline`/`--output` preflight map `Path.is_file()` / `Path.exists()` / `Path.is_dir()` `OSError` or `ValueError` to fixed diagnostics (`invalid comparison artifact`, `invalid baseline artifact`, `invalid output artifact`) before artifact loading, benchmark execution, output writes, markdown/stdout emission, or compare handoff; raw exception text, traceback, and caller filesystem paths are not public surfaces |
| standalone benchmark compare markdown | `benchmark.compare.main()` maps markdown render/print failures to fixed `comparison report failed` without raw exception/path echo and skips regression evaluation after failed report emission; programmatic markdown helpers are unchanged |
| benchmark comparison artifact payloads | Standalone compare CLI and Juliet `--baseline` preflight require benchmark-result anchors (`summary`, `results`, `summary.overallRecall`, per-CWE `combined.recall`) before comparison; `results` keys must be canonical `CWE-<positive integer>` ids; recall metrics must be probabilities in `[0.0, 1.0]` and optional noise density fields must be non-negative finite numbers; empty `results: {}` with valid summary remains supported; invalid payloads use fixed diagnostics without raw path/content echo |
| Juliet benchmark CLI diagnostics | Failure stderr from `juliet_runner.py::main()` is a compact JSON object with exact keys `error`, `reasonCode`, and `stage`; parser/selector/artifact/payload/output/handoff/run/report-build failures preserve fixed safe messages while adding machine-readable reason codes and never include raw argparse usage, tokens, paths, content, exception details, or object reprs. Stderr write failures are best-effort and still exit `2` |
| Juliet benchmark CLI argparse boundary | Raw parser/argument-shape failures in `juliet_runner.py::main()` (missing required args, unknown args, missing option values) use fixed `invalid Juliet arguments` / exit `2` without argparse usage, raw token, or path echo and before benchmark/output/baseline side effects; allowlisted post-parse diagnostics remain specific (`invalid tool/CWE/variant/timeout selection`, artifact/payload/report/output/compare/execution failures) |
| Juliet benchmark CLI report/output paths | CLI report JSON uses the fixed `<JULIET_ROOT>/C` corpus placeholder and save logs are value-free; caller-provided `--juliet-path` and `--output` filesystem paths remain internal execution/write inputs, not public report/log surfaces |
| Juliet benchmark CLI tool selectors | `--tools` is fail-closed against the current-six allowlist and uniqueness before benchmark execution; unknown, blank, or duplicate selectors use fixed `invalid tool selection`, do not run benchmarks, and do not write output files; valid unique subsets preserve caller order |
| Juliet benchmark CLI CWE selectors | `--cwes` is fail-closed before benchmark execution; blank/non-decimal/signed/decimal/non-positive or decimal conversion-failure segments use fixed `invalid CWE selection`, do not run benchmarks, and do not write output files; arbitrary positive parsed integer CWE IDs remain supported |
| Juliet benchmark CLI variant selectors | `--variant-filter` is normalized before benchmark execution and report JSON: `all` maps to execution `None`/report `all`, positive parsed decimal IDs preserve trimmed text, and blank/non-decimal/non-positive or conversion-failure values use fixed `invalid variant selection` before side effects |
| Juliet benchmark CLI timeout selectors | `--timeout` is fail-closed before benchmark execution: blank/non-decimal/signed/decimal/non-positive or conversion-failure values use fixed `invalid timeout selection`, do not run benchmarks, and do not write output files; valid/default positive integer seconds are preserved |
| Juliet benchmark CLI baseline artifacts | `--baseline` is preflighted with `Path.is_file()` before benchmark execution/output writes; missing or directory baselines use fixed `invalid baseline artifact`; valid baselines preserve the real path handoff to compare logic |
| Juliet benchmark CLI output artifacts | `--output` is preflighted before benchmark execution: existing directory outputs or existing non-directory parents use fixed `invalid output artifact`; missing parents and existing regular files remain supported, and compare handoff uses the validated output path |
| Juliet benchmark CLI compare handoff | Late `--baseline` comparison handoff failures after benchmark/output use fixed `comparison handoff failed` without raw exception/path echo; successfully written benchmark output artifacts are preserved because only the regression-comparison step failed |
| Juliet benchmark CLI benchmark execution | Escaped setup/execution failures before `BenchmarkResult` use fixed `benchmark execution failed` with no raw traceback, exception type/message, Juliet root, output path, stdout report, or JSON markers; programmatic benchmark behavior is unchanged |
| Juliet benchmark CLI markdown report | Markdown render/print failures use fixed `markdown report failed` without raw traceback/exception/object/path echo; already-written output JSON is preserved and downstream stdout JSON / compare handoff are skipped |
| Juliet benchmark CLI report payload build | `result.to_dict()` failures or non-mapping payloads use fixed `benchmark report build failed` before output/markdown/stdout/compare side effects; successful output shape is unchanged and raw exception/object/path material is not public |
| Juliet benchmark CLI stdout JSON separator | No-output Juliet CLI treats the separator newline before report JSON as part of the stdout JSON emission boundary; separator, JSON serialization, or JSON print failures use fixed `stdout JSON write failed`, emit no JSON markers, and skip baseline compare handoff without raw exception/path echo |
| Standalone benchmark compare CLI diagnostics | Failure stderr from `benchmark.compare.main()` is a compact JSON object with exact keys `error`, `reasonCode`, and `stage`; parse, threshold, artifact, payload, and report-output failures preserve fixed safe messages while adding machine-readable reason codes and never include raw argparse usage, tokens, paths, content, exception details, or object reprs. Stderr write failures are best-effort and still exit `2` |
| Static Evidence consumer canary projection | `benchmark.static_evidence_consumer_canary.summarize_static_evidence_contract()` is a pure JSON S3-facing canary summary; it projects only allowlisted gate statuses, generated reason codes, coverage surfaces, claim IDs, tool IDs, support statuses, and consumer policies. Generated partial/degraded/unknown tool evidence is preserved; unsafe/malformed projection values and caller-spoofed summary-only diagnostics are omitted or normalized, cause canary-generated `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` in system/evidence/claim reason arrays, force `localStaticEvidenceReady=false`, and are never emitted as tool anomaly reasons or decision/routing directives |
| Tool Portfolio report consumer canary projection | `benchmark.tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` projects only allowlisted statuses, threshold intent/status, reason codes, follow-ups, diagnostic candidate IDs, tool IDs, and contribution classes from present `s4-tool-portfolio-experiment-report-v1` artifacts. Canary-generated summary-only diagnostics (`TOOL_PORTFOLIO_REPORT_ABSENT`, `TOOL_PORTFOLIO_REPORT_MALFORMED`, `TOOL_PORTFOLIO_REPORT_SCHEMA_UNSUPPORTED`, `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`) are not valid producer reason codes; caller-provided occurrences are omitted, converted into canary-generated unsafe projection, and force `toolPortfolioDecisionGradeUsable=false`; malformed reason/follow-up containers or list items do the same while preserving valid allowlisted entries from proper lists; present non-string or blank scalar projections also fail closed while absent/`None` remains compatible |
| Tool Portfolio report consumer canary CLI diagnostics | Failure stderr from `tool_portfolio_report_consumer_canary.py::main()` is a compact JSON object with exact keys `error`, `reasonCode`, `reasonCodes`, `stage`, and `summaryEmitted`; input/output stages preserve legacy reason-code list and summary-emitted flag while adding singular reason/stage fields and no raw path/content/exception echo |
| Corpus Acquisition CLI diagnostics | Failure stderr from `tool_portfolio_corpus_acquisition.py::main()` is a compact JSON object with exact keys `error`, `reasonCode`, and `stage`; existing input and output boundaries preserve fixed messages while adding machine-readable reason codes and never include raw corpus IDs, flags, paths, exception details, archive/source data, or object reprs |
| Actual Tool Portfolio runner CLI diagnostics | Failure stderr from `tool_portfolio_actual_runner.py::main()` is a compact JSON object with exact keys `error`, `reasonCode`, and `stage`; input, run, and output stages preserve fixed messages while adding machine-readable reason codes and never include raw exception text, paths, classes, args, or object reprs |
| Actual Tool Portfolio runner CLI report-build boundary | After input JSON/scalar loading succeeds but before output writing, `tool_portfolio_actual_runner.py::main()` maps ordinary report generation/staging/tool/report-composition failures to fixed `actual run failed` / exit `1` with best-effort stderr, no stdout, no output write, and no raw exception/object/path echo; input validation and output-write boundaries remain separate |
| Actual Tool Portfolio runner CLI output boundary | After actual report build succeeds, `tool_portfolio_actual_runner.py::main()` treats `--output` write/serialization as a fixed output boundary: expected write/path/serialization failures return exit `1` with `output write failed`, best-effort stderr, no stdout, and no raw exception/object/path echo; report-build failures remain outside this boundary |
| Tool Portfolio consumer canary CLI output | `tool_portfolio_report_consumer_canary.py` treats summary JSON serialization and stdout write as a bounded output surface; output failures return exit `1` with fixed stderr JSON reason `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` and `summaryEmitted=false`, while stderr emission itself is best-effort and value-free |

---

## POST /v1/libraries

프로젝트 내 vendored 라이브러리를 자동 식별하고 upstream과 비교한다. `projectPath` 필수.

SCA repository URL fields (`repoUrl`, `remoteUrl`, top-level diff `repoUrl`, and nested `diffSummary.repoUrl` / `/v1/libraries` `entry.diff.repoUrl`) are public evidence. They preserve safe repository identity but strip URL userinfo, query, and fragment; raw clone/fetch URLs remain internal runtime inputs only.

> **CVE 조회는 S5(KB) `POST /v1/cve/batch-lookup`으로 이관됨 (2026-03-19).**
> S3 Agent가 이 응답의 `name`, `version`, `repoUrl`을 S5에 전달하여 CVE를 조회한다.

### 요청

```json
{
  "scanId": "...",
  "projectId": "re100",
  "projectPath": "/path/to/project"
}
```

### 응답

```json
{
  "libraries": [
    {
      "name": "mosquitto",
      "version": "2.0.22",
      "commit": "28f914788f6a...",
      "branch": "master",
      "path": "gateway/libraries/mosquitto",
      "source": "git",
      "repoUrl": "https://github.com/eclipse/mosquitto.git",
      "diff": {
        "matchedVersion": "28f914788f6a...",
        "matchRatio": 0.988,
        "identicalFiles": 168,
        "modifiedFiles": 2,
        "modifications": [
          { "file": "lib/net_mosq.c", "insertions": 76, "deletions": 0 }
        ]
      }
    }
  ],
  "elapsedMs": 21000
}
```

### 응답 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 라이브러리 이름 (git repo명 또는 디렉토리명) |
| version | string? | 버전 (태그, CMake, configure.ac 등에서 추출) |
| commit | string? | git 커밋 해시 |
| branch | string? | git 브랜치 |
| path | string | 프로젝트 내 상대 경로 |
| source | string | 식별 방법 (`"git"`, `"CMakeLists.txt:project()"` 등) |
| repoUrl | string? | upstream git URL — **S5 CVE 조회 시 vendor 추론에 사용** |
| diff | object? | upstream과의 비교 결과 (통일 shape: 성공/에러 모두 동일 필드, nullable) |
| diff.matchedVersion | string? | 매칭된 upstream 버전/태그/커밋 (`null` = 에러) |
| diff.repoUrl | string | upstream URL |
| diff.matchRatio | float? | 동일 파일 비율 (1.0 = 원본, `null` = 에러) |
| diff.identicalFiles | int | 동일 파일 수 |
| diff.modifiedFiles | int | 수정된 파일 수 |
| diff.addedFiles | int | 추가된 파일 수 |
| diff.deletedFiles | int | 삭제된 파일 수 |
| diff.modifications | array | 수정된 파일 상세 `[{file, insertions, deletions}]` |
| diff.addedFilesList | array? | `_compute_diff()`/closest-version path에서 추가 파일의 library-relative source paths. Host-local absolute paths or raw `Only in` lines are not emitted. |
| diff.error | string? | 에러 메시지 (`null` = 성공) |

### 식별 방법 (우선순위순)

1. `.git` → 커밋 해시 + 리모트 URL + `git describe --tags`
2. CMakeLists.txt → `project(name VERSION x.y.z)`
3. configure.ac → `AC_INIT([name], [version])`
4. version.h / README
5. 디렉토리 이름 → 알려진 repo 매핑

### diff 방법

- `.git`이 있으면 커밋 해시로 정확한 upstream checkout
- SHA256 파일 해시 비교 (패키징/줄 끝 차이에 면역)
- 소스 코드만 (.c/.h/.cpp/.hpp), test/example/doc 제외
- `matchRatio` = 동일 파일 / (동일 + 수정) -- 100%면 원본
- **CloneCache**: 동일 repo에 대한 반복 clone을 TTL 기반 캐시로 최적화 (기본 1시간)
- **통일 응답**: 성공/에러 모두 동일한 JSON shape. 에러 시 `matchedVersion=null`, `matchRatio=null`, `error="메시지"`

---

## POST /v1/build

**빌드만 수행** — caller가 제공한 명령과 환경을 그대로 실행하여 `compile_commands.json`을 생성한다.
S4는 build path에서 더 이상 SDK/toolchain/build-command intent를 해석하지 않는다.

### 요청

```json
{
  "projectPath": "/uploads/re100/gateway-webserver",
  "buildCommand": "/uploads/re100/gateway-webserver/scripts/generated-build.sh",
  "buildEnvironment": {
    "CC": "/uploads/toolchains/arm/bin/arm-linux-gnueabihf-gcc",
    "SYSROOT": "/uploads/toolchains/arm/sysroot"
  },
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  },
  "wrapWithBear": true
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| projectPath | string | O | 서브 프로젝트 절대 경로 |
| buildCommand | string | O | caller가 완전히 materialize한 빌드 명령어 |
| buildEnvironment | Record<string,string> | X | caller가 제공하는 명시적 환경변수 주입 |
| provenance | object | X | Build Snapshot provenance (`buildSnapshotId`, `buildUnitId`, `snapshotSchemaVersion`) |
| wrapWithBear | bool | X | 기본 `true`. `false`면 bear 없이 순수 빌드 실행 |

### 응답 (200, 성공)

```json
{
  "success": true,
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  },
  "buildEvidence": {
    "requestedBuildCommand": "/uploads/re100/gateway-webserver/scripts/generated-build.sh",
    "effectiveBuildCommand": "/uploads/re100/gateway-webserver/scripts/generated-build.sh",
    "buildDir": "/uploads/re100/gateway-webserver",
    "compileCommandsPath": "/uploads/re100/gateway-webserver/compile_commands.json",
    "entries": 7,
    "userEntries": 7,
    "exitCode": 0,
    "buildOutput": "build output omitted",
    "wrapWithBear": true,
    "timeoutSeconds": 600,
    "timeoutMode": "sync-hard-deadline",
    "timeoutEnforced": true,
    "environmentKeys": ["CC", "SYSROOT"],
    "elapsedMs": 4885
  },
  "readiness": {
    "status": "ready",
    "compileCommandsReady": true,
    "quickEligible": true,
    "summary": "compile_commands.json contains user-target entries and the build exited successfully."
  }
}
```

### 응답 (200, 실패)

```json
{
  "success": false,
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  },
  "buildEvidence": {
    "requestedBuildCommand": "/uploads/re100/gateway-webserver/scripts/generated-build.sh",
    "effectiveBuildCommand": "/uploads/re100/gateway-webserver/scripts/generated-build.sh",
    "buildDir": "/uploads/re100/gateway-webserver",
    "compileCommandsPath": "/uploads/re100/gateway-webserver/compile_commands.json",
    "entries": 3,
    "userEntries": 1,
    "exitCode": 127,
    "buildOutput": "build output omitted",
    "wrapWithBear": true,
    "timeoutSeconds": 600,
    "timeoutMode": "sync-hard-deadline",
    "timeoutEnforced": true,
    "environmentKeys": ["CC", "SYSROOT"],
    "elapsedMs": 1234
  },
  "readiness": {
    "status": "partial",
    "compileCommandsReady": false,
    "quickEligible": false,
    "summary": "compile_commands.json contains some user-target entries, but the build did not finish successfully."
  },
  "failureDetail": {
    "category": "command-not-found",
    "summary": "The supplied build command referenced an unavailable executable or script (exit code 127).",
    "matchedExcerpt": null,
    "hint": "Caller must provide a valid build command and executable paths.",
    "retryable": false
  }
}
```

### 중요한 의미

- S4는 `buildCommand`를 **자동 감지하지 않는다**.
- S4는 `sdkId`를 **받지도 해석하지도 않는다**.
- caller가 잘못된 build material을 보내면 **실패가 정답**이다.
- BuildRunner가 생성하는 `buildEvidence.buildOutput`은 raw stdout/stderr를 보관하지 않는다. 실행 출력이 비어 있지 않으면 fixed marker `"build output omitted"`로 축약되고, 출력이 없으면 `null`이다.
- BuildRunner가 생성하는 `failureDetail.matchedExcerpt`는 raw loader/command/build output line을 echo하지 않으며 현재 `null`로 유지된다. category/summary/hint/retryable이 consumer action evidence다.
- canonical explicit Quick는 `/v1/build` 응답에서 `readiness.compileCommandsReady=true` 를 확인한 뒤, 반환된 `buildEvidence.compileCommandsPath` 로 `POST /v1/scan` 을 별도 호출하는 흐름이다.
- sync compatibility mode에서는 `X-Timeout-Ms`가 build subprocess hard deadline으로 적용될 수 있다.
- durable ownership mode(`Prefer: respond-async`)에서는 build subprocess에 caller-derived hard deadline을 적용하지 않는다. 이때 `buildEvidence.timeoutMode="async-ownership-no-caller-deadline"`, `timeoutEnforced=false`로 구분한다.

### build readiness contract

S2/S3는 아래 조건을 모두 만족할 때만 build preparation을 **다음 단계 준비 완료**로 간주해야 한다.

- `success=true`
- `readiness.status="ready"`
- `readiness.compileCommandsReady=true`
- `readiness.quickEligible=true`
- `buildEvidence.compileCommandsPath` 존재
- `buildEvidence.userEntries > 0`
- `buildEvidence.exitCode == 0`

`readiness.status="partial"` 은 `compile_commands.json` 일부가 남아 있어도 **canonical Quick 입력으로 사용하면 안 되는 상태**다.
이 경우 caller는 build material을 수정한 뒤 `/v1/build` 를 다시 호출해야 한다.

`readiness.status="not-ready"` 는 usable compile DB를 확인하지 못한 상태다.
대표 사례는 다음과 같다.
- `compile-commands-missing`
- `compile-commands-empty`
- `compile-commands-no-user-entries`
- `command-not-found`
- `shared-library-load`

### `failureDetail.category`

- `timeout`
- `compile-commands-missing`
- `compile-commands-empty`
- `compile-commands-no-user-entries`
- `shared-library-load`
- `command-not-found`
- `build-process`

---

## POST /v1/build-and-analyze

빌드 실행 + 전체 분석 파이프라인 한 번에.

> **위치:** `/v1/build-and-analyze`는 snapshot-first orchestration에서
> **convenience / transitional surface** 로만 취급한다.
> canonical path는 `POST /v1/build` → upstream snapshot persist → `POST /v1/scan`/기타 개별 호출이다.

### 요청

```json
{
  "projectPath": "/path/to/project",
  "buildCommand": "/uploads/project/generated-build.sh",
  "buildEnvironment": {
    "CC": "/uploads/toolchains/arm/bin/arm-linux-gnueabihf-gcc"
  },
  "projectId": "re100-webserver",
  "scanProfile": {
    "compiler": "arm-linux-gnueabihf-gcc",
    "targetArch": "arm-cortex-a8",
    "languageStandard": "c99",
    "includePaths": ["include"]
  },
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| projectPath | string | O | 프로젝트 디렉토리 절대 경로 |
| buildCommand | string | O | caller가 완전히 materialize한 빌드 명령어 |
| buildEnvironment | Record<string,string> | X | caller가 제공하는 명시적 build 환경 |
| projectId | string | X | 프로젝트 ID (기본: `"auto"`) |
| scanProfile | BuildProfile | X | build 후 scan 단계에서만 사용하는 analysis profile |
| provenance | object | X | Build Snapshot provenance |
| thirdPartyPaths | string[] | X | 내부 `/v1/scan` 호출에 전달 |
| options.timeoutSeconds | int | X | 내부 `/v1/scan` timeout |

### 응답

```json
{
  "success": true,
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  },
  "build": {
    "success": true,
    "provenance": {
      "buildSnapshotId": "bsnap-123",
      "buildUnitId": "bunit-456",
      "snapshotSchemaVersion": "build-snapshot-v1"
    },
    "buildEvidence": {
      "compileCommandsPath": "/path/to/compile_commands.json",
      "entries": 7,
      "elapsedMs": 4885
    },
    "readiness": {
      "status": "ready",
      "compileCommandsReady": true,
      "quickEligible": true
    }
  },
  "scan": {
    "success": true,
    "scanId": "build-analyze-req-123",
    "provenance": {
      "buildSnapshotId": "bsnap-123",
      "buildUnitId": "bunit-456",
      "snapshotSchemaVersion": "build-snapshot-v1"
    },
    "findings": [...],
    "execution": { "degraded": false, "degradeReasons": [] }
  },
  "codeGraph": {"functions": [...]},
  "libraries": [...],
  "metadata": { ... },
  "elapsedMs": 236316
}
```

### 동작

1. caller가 제공한 `buildCommand` + `buildEnvironment` 그대로 실행
2. nested `build.readiness.compileCommandsReady=true` 일 때만 생성된 `compile_commands.json`으로 `/v1/scan`
3. `/v1/functions`
4. `/v1/libraries`
5. `/v1/metadata`

Scan 단계에서 `REQUIRED_TOOL_UNAVAILABLE` 또는 `REQUIRED_TOOL_EXECUTION_INCOMPLETE`가 발생하면 `/v1/build-and-analyze`는 HTTP `503` + `success=false` 를 반환한다. 이때 이미 성공한 `build` evidence/readiness는 보존되고, nested `scan.success=false`, nested/top-level `staticEvidenceContract.gates.systemStability.status="fail"`, `errorDetail.code`가 함께 노출된다. 즉 build 준비 성공과 SAST 시스템 안정성 실패는 한 응답 안에서 분리되어 소비되어야 한다.

---

## POST /v1/discover-targets

프로젝트 내 **빌드 타겟(독립 빌드 단위)**을 자동 탐색한다. 빌드 실행 없이 파일시스템 스캔만 수행한다.

### 요청

```json
{
  "projectPath": "/uploads/proj-xxx"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| projectPath | string | O | 프로젝트 디렉토리 절대 경로 |

### 응답

```json
{
  "targets": [
    {
      "name": "gateway-webserver",
      "relativePath": "gateway-webserver/",
      "buildSystem": "cmake",
      "buildFile": "gateway-webserver/CMakeLists.txt"
    },
    {
      "name": "certificate-maker",
      "relativePath": "certificate-maker/",
      "buildSystem": "make",
      "buildFile": "certificate-maker/Makefile"
    }
  ],
  "elapsedMs": 2
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 타겟 이름 (디렉토리명) |
| relativePath | string | projectPath 기준 상대 경로 (루트면 `""`) |
| buildSystem | string | `cmake`, `make`, `meson`, `autotools` |
| buildFile | string | 빌드 파일의 상대 경로 |

### 의미
- `discover-targets`는 **identity hint surface** 다.
- 더 이상 `detectedBuildCommand`를 추천하지 않는다.

---

## Build Snapshot consumer seam

S4는 `/v1/build`, `/v1/scan`, `/v1/build-and-analyze`에서
**nested `provenance` object** 를 입력으로 받고 그대로 echo한다.

### build path와 analysis path의 차이
- **build path**: intent/materialization을 하지 않는다. caller가 fully materialized inputs를 준다.
- **analysis path**: 이번 배치에서 철학을 바꾸지 않는다. `BuildProfile` 기반 해석은 그대로 남아 있다.

### build path 원칙
- S4는 snapshot persistence owner가 아니다.
- S4는 build path에서 `sdkId`를 해석하지 않는다.
- build path는 caller가 제공한 concrete execution evidence만 실행한다.

### analysis path 원칙
- `/v1/scan` 등 analysis surface는 이번 범위에서 unchanged.
- 따라서 analysis path에서는 `BuildProfile` 해석이 계속 존재할 수 있다.

---

## SDK registry ownership 변경

`/v1/sdk-registry` public API는 제거되었다.

이유:
- SDK registry ownership은 S4 build path가 아니라 upstream(S3 via S2) concern이다.
- S4 build path는 더 이상 `sdkId`를 받아 실행하지 않는다.

S3가 필요한 SDK metadata는 **S2로부터** 받아야 한다.

---

## 관련 문서

- [SastFinding 타입 정의](shared-models.md)
- [SAST Runner 명세](../specs/sast-runner.md)
- [S4 인수인계서](../handoff/s4/readme.md)
