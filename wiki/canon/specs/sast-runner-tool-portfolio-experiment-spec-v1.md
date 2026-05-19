---
title: "S4 Tool Portfolio Experiment Spec v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/sast-runner.md"
  - "wiki/canon/specs/sast-runner-static-evidence-contract.md"
  - "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md"
  - ".omx/goals/autoresearch/s4-tool-portfolio-literature/research.md"
last_verified: "2026-05-14"
service_tags: ["s4"]
decision_tags: ["tool-portfolio-experiment-v1", "sast-runner", "deterministic-experiment", "golden-corpus", "validation-test-split"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md"]
---

# S4 Tool Portfolio Experiment Spec v1

Status: **draft canonical experiment spec**
Owner: **S4 / SAST Runner**
Scope: **LLM-free, local, deterministic C/C++ SAST tool-portfolio experiments**
Decision posture: **no immediate add/remove/upgrade decision; build the experiment system first**

This page defines the experiment protocol S4 must use before making any claim that the current six SAST tools are sufficient, insufficient, removable, replaceable, or upgrade-worthy. It turns the prior research review and the existing Tool Portfolio Governance v1 into an executable experiment plan.

---

## 1. Objective

S4 needs a local experiment framework that can answer these questions without LLMs, network-dependent runtime calls, S5/S3 code changes, or subjective tool ranking:

1. What does each current tool actually detect, miss, and uniquely contribute on C/C++ corpora with ground truth?
2. Which findings are true positives, false positives, false negatives, related-but-not-target matches, or unsupported negative evidence?
3. How much marginal value does each tool add to the six-tool portfolio after overlap and noise are counted?
4. Which tool/parser/ruleset/version changes deserve future implementation work?
5. Where are S4's evidence coverage boundaries so S4 can emit machine-readable claim boundaries and S4-internal consumer canaries; any S3 behavior change remains separate WR/API-owner work?

Success means S4 can produce a reproducible JSON report that separates validation evidence, held-out test evidence, parser compatibility, runtime stability, and claim-boundary implications.

---

## 2. Non-goals and hard constraints

Non-goals for this spec:

- no LLM in experiment execution or scoring;
- no S5/GraphRAG/CVE lookup as scoring input;
- no S3 code changes;
- no runtime security verdict, exploitability judgment, or absence-of-vulnerability claim;
- no immediate new SAST tool introduction;
- no v2 API split;
- no production `/v1/scan` contract change required for the first experiment harness.

Hard constraints:

- Experiments run locally and deterministically after required corpora are present on disk.
- Any externally obtained corpus must be pinned by manifest metadata and checksum before use; the experiment runner itself must not fetch network resources.
- Dataset acquisition and experiment scoring are separate phases.
- Validation-set decisions must be frozen before the held-out test-set run.
- Every metric must keep `sourceArtifact`, `sliceKind`, `toolSetConfig`, and `matchingPolicy` metadata.
- Empty findings are never negative security evidence.

---

## 3. Source research behind the spec

This protocol follows the canonical S4 specs and the prior S4 literature review artifact. The `.omx` research artifact is noncanonical evidence until it is promoted to a wiki context page; this spec includes the distilled design constraints directly so it does not depend on `.omx` as the canonical source.

Canonical wiki inputs:

- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`

Noncanonical research evidence:

- `.omx/goals/autoresearch/s4-tool-portfolio-literature/research.md`

High-level sources informing the design:

- NIST SAMATE / SATE methodology: tool fit, not global ranking.
- NIST SARD / Juliet: controlled C/C++ ground-truth slices, but not sufficient as the whole truth.
- NIST static analyzer measurement guidance: recall, precision/discrimination, overlap, ground truth, relevance.
- Empirical real-world C/C++ SAST studies: synthetic recall does not imply real-world effectiveness; tool union increases recall and noise.

---

## 4. Existing S4 assets reused by the experiment framework

Current reusable assets:

| Asset | Path | Use in this experiment spec |
|---|---|---|
| Golden Corpus v1 manifest | `services/sast-runner/tests/fixtures/golden_corpus_v1/manifest.json` | bootstrap canaries and contract/gate validation |
| Tool Output Compatibility v1 | `services/sast-runner/tests/fixtures/tool_output_compat_v1/manifest.json` | parser compatibility prerequisite |
| Tool Output Compatibility manifest loader | `services/sast-runner/benchmark/tool_output_compat.py` | parser-compatibility evidence loading must fail closed with value-free manifest/parserKind diagnostics |
| Tool Output Compatibility fixture loader | `services/sast-runner/benchmark/tool_output_compat.py` | parser-compatibility fixture paths/read/JSON parse failures must fail closed with value-free diagnostics |
| Claim Support Gate fixtures | `services/sast-runner/tests/fixtures/claim_support_gate_v1/manifest.json` | claim-boundary and unsupported-negative-evidence oracle |
| Governance report builder | `services/sast-runner/benchmark/tool_portfolio_governance.py` | current governance baseline and gate vocabulary |
| Benchmark slice report | `services/sast-runner/benchmark/benchmark_slice_report.py` | current historical Juliet baseline ingestion |
| Juliet runner | `services/sast-runner/benchmark/juliet_runner.py` | local benchmark execution against actual tools |
| Benchmark compare | `services/sast-runner/benchmark/compare.py` | regression/delta comparison |
| Static evidence report | `services/sast-runner/benchmark/static_evidence_report.py` | qualityEvaluation/report separation |
| Static evidence consumer canary helper | `services/sast-runner/benchmark/static_evidence_consumer_canary.py` | downstream `/v1/scan` contract-consumption canaries without S3 code |
| Tool Portfolio report consumer canary helper/CLI | `services/sast-runner/benchmark/tool_portfolio_report_consumer_canary.py` | offline report-consumption canaries and CLI smoke gate for `s4-tool-portfolio-experiment-report-v1` without S3/S5 code |

The first implementation should extend these assets rather than creating a parallel benchmark stack.

---

## 5. Corpus model

### 5.1 Required slice taxonomy

Each corpus case belongs to exactly one `sliceKind`:

| sliceKind | Purpose | First source |
|---|---|---|
| `s4-canary` | Minimal S4-owned fixtures for contract, parser, and known vulnerability-family behavior | existing Golden Corpus v1 |
| `juliet-controlled-positive` | Controlled vulnerable C/C++ bad functions/cases | Juliet C/C++ v1.3+ |
| `juliet-controlled-negative` | Controlled good functions/cases for FP/discrimination | Juliet C/C++ v1.3+ |
| `sard-focused` | Small focused SARD cases outside the existing Juliet subset | SARD C/C++ suites |
| `real-cve-pair` | vulnerable/fixed real-world cases | SATE/SARD/CVE-derived curated local fixtures |
| `build-context-required` | compile_commands/include/macro-dependent cases | S4-owned or curated C/C++ fixtures |
| `parser-regression` | raw output shapes independent of tool execution | existing and future tool-output fixtures |

### 5.2 Validation/test split

The split is part of the artifact and must be stable:

- `validation`: used for harness development, matching-policy tuning, thresholds, and candidate triage.
- `test`: held out until the experiment rules are frozen; used for final add/remove/upgrade evidence.
- `canary`: always-run guard set; cannot be used to claim portfolio quality by itself.

Rules:

1. A case cannot appear in both `validation` and `test`.
2. Cases with the same root project and same vulnerability lineage must stay in the same split.
3. Thresholds may be changed only before the first held-out `test` run for a decision cycle.
4. If the matching policy changes after a test run, the decision cycle is invalidated and must restart.

### 5.3 Tracked CWE set

The first decision cycle uses the exact tracked CWE set already present in current pinned historical Juliet baseline artifacts:

```json
["CWE-78", "CWE-121", "CWE-122", "CWE-134", "CWE-190", "CWE-252", "CWE-369", "CWE-401", "CWE-416", "CWE-457", "CWE-476", "CWE-680"]
```

Notes:

- `CWE-120` is currently a Golden Corpus/SARD-style canary and parser compatibility target, not part of the pinned Juliet benchmark-slice decision cycle until a new benchmark baseline explicitly includes it.
- `juliet_runner.py` default priority CWE behavior is not authoritative for this experiment spec. Experiment commands must pass the explicit tracked list.
- Future CWE additions require corpus-manifest, baseline, and report-schema updates before quality claims.

### 5.4 Oracle target granularity

The atomic oracle target is not merely a file. It is:

```text
caseId + targetId + polarity + cweId/family + region/function/sink/flow metadata
```

Allowed target granularities:

| granularity | Required metadata | Use |
|---|---|---|
| `sink-line` | file + sink line + CWE/family | preferred positive target |
| `source-sink-flow` | source line + sink line + flow role metadata | dataflow-capable cases |
| `function-region` | function name + start/end line + CWE/family | Juliet same-file good/bad disambiguation |
| `file-region` | file + start/end line + CWE/family | fallback when function extraction is unavailable |
| `negative-region` | file/function/line range + allowed warning policy | negative/good-code discrimination |

Juliet good and bad functions may coexist in the same file, so negative policy is region/function-scoped by default. A warning elsewhere in the same file is not automatically a negative-case FP unless it intersects the negative target region or violates that target's explicit allowed-warning policy.

### 5.5 Minimum first experiment corpus

The first executable experiment should start small but non-toy:

- Existing `s4-canary` layer: all Golden Corpus v1 contract/evidence/canary/parser cases.
- Juliet validation slice: the explicit 12-CWE tracked set in §5.3, variant `01`, both bad and good function/region targets where available.
- Juliet held-out test slice: the same explicit 12-CWE tracked set, using non-`01` variants or a predeclared target subset not used during matching-policy tuning.
- At least one `build-context-required` fixture where compile context changes detection.
- At least one `real-cve-pair` candidate only after the local manifest/checksum rules are implemented.

This staged minimum prevents the project from blocking on a huge real-world corpus before the harness itself is trustworthy.

---

## 6. Corpus and acquisition manifest schemas

The experiment harness should introduce a corpus manifest with schema version `s4-tool-portfolio-experiment-corpus-v1` and an acquisition manifest with schema version `s4-tool-portfolio-acquisition-v1`.

Minimum shape:

```json
{
  "schemaVersion": "s4-tool-portfolio-experiment-corpus-v1",
  "profile": "c-cpp-tool-portfolio-v1",
  "createdAt": "2026-05-12",
  "owner": "s4-sast-runner",
  "cases": [
    {
      "caseId": "juliet-cwe121-variant01-0001",
      "sliceKind": "juliet-controlled-positive",
      "split": "validation",
      "language": "c",
      "sourceArtifact": "Juliet C/C++ 1.3",
      "acquisitionId": "juliet-c-cpp-1.3",
      "acquisitionManifestChecksum": "sha256:...",
      "sourceRef": "juliet-c-cpp-1.3:CWE121/...",
      "sourcePath": "CWE121_Stack_Based_Buffer_Overflow/...",
      "checksum": "sha256:...",
      "expected": {
        "targetId": "target-001",
        "granularity": "sink-line",
        "cweId": "CWE-121",
        "polarity": "positive",
        "locations": [
          { "file": "...", "line": 42, "role": "sink" }
        ],
        "functionRegion": { "function": "bad", "startLine": 35, "endLine": 45 },
        "allowedMatchWindows": { "lineDelta": 5, "functionFallback": false }
      },
      "buildContext": {
        "requiresCompileCommands": false,
        "compileCommandsFixture": null,
        "defines": [],
        "includePaths": []
      },
      "notes": []
    }
  ]
}
```

Required validation:

- unique `caseId`;
- valid `sliceKind` and `split`;
- exact `sha256:<64 lowercase hex>` checksum present for externally sourced cases;
- externally sourced cases include `acquisitionId`, `acquisitionManifestChecksum`, and stable `sourceRef` linking them to a validated acquisition manifest;
- positive targets have expected CWE and location/sink or region information;
- negative targets have explicit `polarity="negative"`, target region metadata, and an expected non-match policy;
- no case has verdict-like fields such as `safe`, `clean`, `vulnerable`, `affected`, `riskScore`, or `securityVerdict`;
- `sourcePath` is a non-empty relative corpus member path with no surrounding whitespace; strict report/manifest validation rejects POSIX absolute paths, Windows drive/UNC absolute paths after backslash-to-slash normalization, and any `..` segment without echoing raw unsafe values.

Case `checksum` values are strict corpus-manifest inputs, not advisory strings: they must match exact `sha256:<64 lowercase hex>`. Prefix-only values such as `sha256:<secret>` are manifest-invalid and must fail before Corpus Readiness can emit `caseStatuses[].expectedChecksum` mismatch evidence. Invalid checksum diagnostics identify only the case checksum field and expected format, not the raw checksum value.

Corpus manifest public identity fields are strict deterministic identifiers, not arbitrary labels. `caseId`, `expected.targetId`, explicit `lineageId`, and external `acquisitionId` must match `[A-Za-z0-9][A-Za-z0-9._:-]{0,255}` with no whitespace/control/surrounding whitespace. Unsafe identity diagnostics identify only the field/context and expected safe-identifier contract; duplicate case IDs, lineage leakage, source-artifact leakage, missing acquisition index entries, and acquisition checksum mismatches must not echo caller-controlled IDs, `sourceRef`, or checksum values. When `lineageId` is absent, public target rows fall back to safe `caseId`, never raw `sourceRef`.

Recursive forbidden verdict-key validation must not expose arbitrary manifest key labels. Diagnostics may name the fixed forbidden literal (`safe`, `clean`, `vulnerable`, etc.) but parent mapping path components are sanitized and key objects equal to a forbidden literal are canonicalized before formatting.

The same forbidden verdict-key diagnostic rule applies to the final `s4-tool-portfolio-experiment-report-v1` report guard. It is a last-defense invariant: valid generated reports should contain no forbidden verdict keys, but if a future generated field reintroduces one, diagnostics must report only the canonical fixed literal and sanitized path components, never caller-shaped labels or key-object `str`/`repr`.

### 6.1 Acquisition manifest

Every externally obtained corpus source must have acquisition provenance before it can appear in a corpus manifest. Minimum shape:

```json
{
  "schemaVersion": "s4-tool-portfolio-acquisition-v1",
  "sourceName": "Juliet C/C++",
  "sourceUrl": "https://...",
  "sourceVersion": "1.3",
  "licenseOrRedistributionNote": "...",
  "downloadedAt": "2026-05-12",
  "archiveChecksum": "sha256:...",
  "extractionRootChecksum": "sha256:...",
  "localPath": "/path/to/local/corpus",
  "offlineScoringOnly": true,
  "networkAccessRequiredForScoring": false
}
```

Validation must reject externally sourced cases without acquisition provenance.

Additional acquisition-manifest hardening requirements:

- the validator accepts only the required schema fields plus known optional provenance fields `sourcePageUrl` and `expectedArchiveChecksum`;
- unknown fields, non-string keys, and malformed optional provenance fields are rejected before checksum JSON serialization;
- `manifest_checksum()` and `validate_acquisition_manifest()` must use the same canonical manifest projection;
- known optional provenance fields, when present, are part of the canonical checksum and must not be silently dropped;
- errors must identify only the failing field/class, not raw values or object representations;
- acquisition index duplicate errors must identify only the duplicate `acquisitionId` category and must not echo the ID value;
- corpus acquisition helper errors for unsafe archive members, outside-cache deletion, and archive checksum mismatch must be value-free categories and must not echo member names, host paths, expected checksums, or actual checksums;
- corpus acquisition CLI argparse/input failures must be fixed-diagnostic and side-effect-free: invalid `--corpus`, unknown arguments, and malformed option shapes return exit `1` with fixed `input validation failed`, do not echo usage/caller tokens/paths, and must not call acquisition or write summary artifacts; valid repeated corpus selections preserve caller order;
- corpus acquisition CLI output failures must be fixed-diagnostic: summary-output write/serialization failures and stdout JSON serialization/write failures return exit `1` with fixed `corpus acquisition output failed`, do not echo raw exception/object/path material, and broken stderr reporting is best-effort suppressed; acquisition/network/archive failures remain outside this output catch;
- Juliet corpus file-selection missing-file errors must be value-free categories and must not echo host-local corpus/cache root paths;
- readiness CLI argparse/input failures must emit sanitized invalid-input JSON on stdout with exit `1`, no raw argparse stderr/usage/token/path echo, and no JSON load/readiness-build side effects;
- readiness JSON object-loader errors must be value-free categories and must not echo host-local input paths;
- standalone compare CLI argparse/input failures must emit fixed `invalid comparison arguments` with exit `2`, no raw argparse usage/token/path echo, and no artifact reads; fixed post-parse diagnostics remain specific for threshold/artifact/payload/report failures;
- actual-runner JSON object-loader read, parse, and non-object errors must be value-free categories and must not echo host-local paths, content fragments, parser internals, or chained causes;
- actual-runner CLI must fail closed for JSON input-loading `ValueError`s and argparse scalar `--timeout`/`--phase` failures with fixed stderr and exit `1`; invalid scalar inputs must fail before manifest file reads/output writes, timeout must be positive decimal with no new upper bound, and downstream build/report failures remain outside that catch;
- actual-runner path-boundary failures for source-root escapes and relative acquisition-base escapes must suppress underlying `Path.relative_to()` exception chains and must not expose host-local paths through tracebacks/logging;
- trusted acquisition-cache reuse requires the prior manifest to match current source metadata, archive checksum, extraction tree checksum, local path, and `expectedArchiveChecksum` with the canonical `sha256:<hex>` format.
- `downloadedAt` must be an exact `YYYY-MM-DD` date or `YYYY-MM-DDTHH:MM:SSZ` UTC timestamp and must parse as a real calendar value;
- `downloadedAt` real-calendar parse failures must suppress underlying parser exception chains and must not expose raw values or parser internals in tracebacks/logging;
- `sourceUrl` may use `http`, `https`, `file`, or S4-owned fixture `local` schemes; `sourcePageUrl`, when present, may use only `http` or `https`;
- source metadata changes such as `sourcePageUrl` or `licenseOrRedistributionNote` should re-pin the manifest without re-extracting unchanged archive/extraction bytes, preserving the original pinned `downloadedAt`.
- unknown field labels and URL validation errors must not echo unsafe keys or raw malformed URL values; http/https authorities with hostless, query/fragment-only, or userinfo-bearing forms are invalid.

### 6.2 Corpus Readiness Gate v1

The experiment report now includes a standalone local preflight gate with schema
`s4-tool-portfolio-corpus-readiness-gate-v1`.

Purpose:

- decide whether required external corpora are actually present and pinned before S4 calls a validation/test report decision-grade;
- keep corpus readiness separate from SAST tool liveness, parser compatibility, and quality thresholds;
- derive legacy `decisionSupport.externalCorpusStatus` from the readiness gate as a compatibility projection instead of handcoding it in harness fixtures.

Required input:

- `required_corpora`: explicit acquisition IDs that must be present for a decision-grade run, e.g. `["juliet-c-cpp-1.3", "sard-c-v2-vulnerable", "sard-c-v2-secure"]`;
- acquisition manifests validated by `s4-tool-portfolio-acquisition-v1`;
- a corpus manifest validated by `s4-tool-portfolio-experiment-corpus-v1`;
- optional explicit `base_path` for resolving relative acquisition `localPath` values.

Deterministic filesystem rules:

- absolute `localPath` values are resolved directly;
- relative `localPath` values require explicit `base_path`; they must not silently resolve against the process current working directory;
- each externally sourced case must have a safe relative `sourcePath`; POSIX absolute paths, Windows drive/UNC absolute paths after backslash-to-slash normalization, and both slash/backslash `..` escapes are blocked;
- case files must exist under the resolved acquisition root and match the pinned `sha256:` checksum;
- required corpora must include both `validation` and `test` cases before `decisionGradeReady=true`;
- `required_corpora` IDs are strict strings matching `[A-Za-z0-9][A-Za-z0-9._:-]{0,127}` with no surrounding whitespace or control characters; invalid IDs fail closed with `CORPUS_REQUIRED_CORPUS_ID_INVALID` and are not echoed in report JSON.

Required reason codes include:

| Condition | Reason code |
|---|---|
| No required decision-grade corpus declared | `CORPUS_REQUIRED_CORPORA_NOT_DECLARED` |
| Malformed required corpus ID | `CORPUS_REQUIRED_CORPUS_ID_INVALID` |
| Required Juliet acquisition not declared | `LOCAL_JULIET_CORPUS_NOT_PRESENT` |
| Required SARD acquisition not declared | `LOCAL_SARD_CORPUS_NOT_PRESENT` |
| Required non-Juliet/SARD external acquisition not declared | `LOCAL_EXTERNAL_CORPUS_NOT_PRESENT` |
| Required non-Juliet/SARD external acquisition incomplete | `LOCAL_EXTERNAL_CORPUS_INCOMPLETE` |
| Acquisition `localPath` absent or missing on disk | `LOCAL_CORPUS_PATH_NOT_FOUND` |
| Relative `localPath` without explicit base | `LOCAL_CORPUS_BASE_PATH_REQUIRED` |
| Relative `localPath` resolves outside explicit base after symlink/path resolution | `LOCAL_CORPUS_PATH_OUTSIDE_BASE` |
| Required corpus has no declared cases | `CORPUS_REQUIRED_CASES_NOT_DECLARED` |
| Required validation/test split missing | `CORPUS_REQUIRED_SPLITS_MISSING` |
| Case `sourcePath` is absolute, Windows drive/UNC absolute after backslash normalization, or escapes root | `CORPUS_CASE_SOURCE_PATH_UNSAFE` |
| Referenced case file is missing | `CORPUS_CASE_SOURCE_MISSING` |
| Referenced case checksum differs | `CORPUS_CASE_CHECKSUM_MISMATCH` |

Current S4 harness behavior:

- The synthetic S4 harness fixture passes `required_corpora=["juliet-c-cpp-1.3"]`.
- Because the local Juliet corpus is not pinned in the repo environment, the generated report has `corpusReadinessGate.status="blocked"` and `decisionGradeReady=false`.
- This is intentional: S4-owned fixtures may validate gate mechanics, but they cannot become decision-grade external Juliet/SARD evidence.

CLI preflight:

```bash
python -m benchmark.tool_portfolio_corpus_readiness \
  --corpus-manifest tests/fixtures/tool_portfolio_experiment_v1/corpus_manifest.json \
  --acquisition-manifest tests/fixtures/tool_portfolio_experiment_v1/acquisition_manifest.json \
  --required-corpus juliet-c-cpp-1.3 \
  --base-path .
```

Exit semantics:

| Exit code | Meaning |
|---:|---|
| `0` | `corpusReadinessGate.status="available"` |
| `2` | deterministic readiness JSON emitted, but status is blocked/not_run |
| `1` | input JSON/path/schema validation failed or requested output cannot be written; invalid JSON is emitted with `CORPUS_READINESS_INPUT_INVALID` or `CORPUS_READINESS_OUTPUT_WRITE_FAILED`, fixed sanitized `error`, and safe `errorClass` without raw exception/path echo. If `--output` write fails, the sanitized invalid JSON falls back to stdout. |

The CLI is a benchmark/offline preflight surface only. It does not change production `/v1/scan`.

Authoritative merge rule:

- `corpusReadinessGate` is authoritative for decision-grade eligibility.
- Legacy or caller-supplied `external_corpus_status` may add compatibility context, but it must not suppress a `not_run` or `blocked` readiness gate.
- Caller-provided `corpusReadinessGate.externalCorpusStatus` is sanitized before report emission: only canonical keys `juliet`, `sard`, `external`, and `requiredCorpusReadiness` are projected; nested entries may expose only `status`, allowlisted readiness `reasonCodes`, and `acquisitionIds` that are bound to validated `requiredCorpora`. Unknown nested fields and safe-shaped attacker keys/reason codes are dropped or input-invalid without raw echo.

Report-side caller-provided Corpus Readiness gates are sanitized field-by-field before S3-facing report emission. The report builder rejects unknown top-level fields, non-string top-level keys, forbidden caller-supplied `inputValidation`, invalid optional `schemaVersion`, invalid `consumerPolicy`, unknown nested fields in `summary`/`acquisitionStatuses`/`caseStatuses`, and malformed generated `requiredCorpusInputValidation` or `consistencyChecks` without echoing caller values. Normalization must reconstruct only validated fields; it must not preserve arbitrary `{**gate}` payloads. Generated required-corpus input failures and generated inconsistent-gate `consistencyChecks` remain accepted on re-ingest, and `summary.sliceCounts` must accept all canonical `SLICE_KINDS`, including `s4-harness-fixture-positive` and `s4-harness-fixture-negative`.
- Readiness intentionally validates unsafe case `sourcePath` as blocked JSON rather than manifest-invalid input: `validate_corpus_manifest(..., allow_unsafe_source_path=True)` preserves deterministic `corpusReadinessGate` output, while readiness `_unsafe_source_path()` applies the same backslash-normalized absolute/traversal semantics and still blocks literal backslash filenames even when a matching file/checksum exists. Unsafe case statuses redact the raw path as `sourcePath="<unsafe>"` plus `sourcePathStatus="unsafe"`; safe relative missing/checksum/available statuses keep their useful `sourcePath` evidence. Case statuses never expose host-local `resolvedPath`; acquisition statuses never expose host-local `localPath` or `resolvedLocalPath`. They use status-only fields (`resolvedPathStatus`, `localPathStatus`, `resolvedLocalPathStatus`) while preserving safe relative `sourcePath`, checksums, manifest checksum, counts, splits, and reason codes. Missing acquisitions also carry `localPathStatus="not_declared"` and `resolvedLocalPathStatus="not_resolved"` so every acquisition status entry has the same sanitized path-status shape. The machine-facing status vocabularies are exported and frozen: `localPathStatus` in `available|base_required|missing|not_declared|not_resolved|outside_base`, `resolvedLocalPathStatus` in `available|missing|not_resolved|outside_base`, `resolvedPathStatus` in `available|checksum_mismatch|missing|outside_root|unsafe`, and `sourcePathStatus` currently only `unsafe`. Report-side normalization applies the same contract to caller-provided `corpusReadinessGate` payloads before S3-facing report emission: available gates must prove `available` path statuses, optional status fields are allowlisted on all gates, raw host path fields are forbidden, and unsafe caller-provided `caseStatuses[].sourcePath` values are input-invalid without raw echo. Top-level caller-provided gate status diagnostics are sanitized for both `corpusReadinessGate` and `systemStabilityGate`: invalid nonblank strings become `<invalid>`, blank strings `<blank>`, and non-string status values report only their safe JSON type. For `systemStabilityGate.status="pass"`, nested pass-evidence diagnostics likewise avoid caller-value echo: unknown `requiredTools[]` values and invalid phase statuses are redacted, non-string values report safe field/type only, and generated missing current-six tool names remain visible. Invalid legacy `external_corpus_status` compatibility diagnostics follow the same rule for top-level keys and unknown nested fields: arbitrary labels are replaced with `<invalid>` and non-string labels report safe type only, while valid accepted legacy entries are preserved. Invalid `matchingPolicy` diagnostics redact unknown key labels, schemaVersion values, and out-of-range lineWindow values as `<invalid>` while preserving safe field/type/expected metadata.
- Safe unknown required corpus IDs are preserved in `requiredCorpora`/`acquisitionStatuses` for future corpus support, but their compatibility projection uses generic `external` status/reason codes rather than raw status keys.
- If readiness has no per-corpus `externalCorpusStatus` and is `not_run`/`blocked`, S4 projects a synthetic compatibility key:

```json
{
  "requiredCorpusReadiness": {
    "status": "not_run",
    "reasonCodes": ["CORPUS_READINESS_GATE_NOT_RUN"]
  }
}
```

This prevents a legacy `external_corpus_status={"juliet": {"status": "available"}}` from making an un-run readiness preflight look decision-grade.

Actual acquisition/cache CLI:

```bash
PYTHONPATH=. python -m benchmark.tool_portfolio_corpus_acquisition \
  --summary-output /home/kosh/AEGIS/.omx/corpora/s4-tool-portfolio/latest-acquisition-summary.json
```

The acquisition CLI is the only benchmark-side network/download surface for this experiment stack. It downloads known NIST SAMATE/SARD archives, verifies official SHA-256 checksums, extracts them under the ignored local cache `.omx/corpora/s4-tool-portfolio/`, emits `s4-tool-portfolio-acquisition-v1` manifests, generates a focused `juliet-sard-focused-v1.json` corpus manifest, and immediately runs the readiness gate. Experiment scoring remains offline and reads only pinned local files. Actual runner staging follows the same relative-path policy as readiness: acquisition `localPath` values may be absolute, or relative only when an explicit base path is supplied; direct staging rejects cwd-dependent relative `localPath` resolution before copying/scanning.

Current known external corpus IDs:

| acquisitionId | Source | Official SHA-256 | Use |
|---|---|---|---|
| `juliet-c-cpp-1.3` | NIST SARD test suite 112 / Juliet C/C++ 1.3 | `ada9d7e1c323d283446df3f55bdee0d00bda1fed786785fe98764d58688f38eb` | Juliet controlled positive/negative validation/test targets for all 12 tracked CWEs |
| `sard-c-v2-vulnerable` | NIST SARD test suite 100 / C analyzer v2 vulnerable | `423f20e8ead850bf64cd93cd4a73dc1161d7b5bb6036328e16fc32e27d09f0d1` | focused SARD positive targets for tracked CWEs present in that suite |
| `sard-c-v2-secure` | NIST SARD test suite 101 / C analyzer v2 secure | `19b7059d067c093d078c6b34d1ec669ccd648aa5b8507ca3fb49d58324bb802b` | focused SARD negative targets for tracked CWEs present in that suite |

When both SARD vulnerable and secure acquisitions are required, compatibility `externalCorpusStatus.sard` is aggregate status: any blocked SARD acquisition keeps the aggregate blocked and preserves all `acquisitionIds`/reason codes.

---

## 7. Tool-set configurations

Every experiment run must identify the exact tool-set configuration.

Required configurations for current six tools:

1. `full-current-six`: `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`.
2. `single-tool:<toolId>` for each current tool.
3. `leave-one-out:<toolId>` for each current tool.
4. `parser-only-current-six`: parser fixtures without executing tools.
5. `contract-canary-current-six`: Golden Corpus and consumer-canary validation only.

Future WR-gated configurations only:

- `upgrade-ab:<toolId>:<oldVersion>:<newVersion>`;
- `ruleset-ab:<rulesetId>`;
- `add-one-in:<candidateToolId>`;
- `remove-candidate:<toolId>`.

Milestone 1 is current-six-only. The initial validator must reject candidate tool IDs and future configurations unless an explicit WR/decision-cycle flag enables them. A future candidate configuration remains invalid until parser compatibility fixtures exist for every new or changed raw output shape.

Invalid tool-set config diagnostics are value-free: unknown current-tool IDs, disabled future configurations, unknown config strings, and non-string config values must report only stable categories and must not echo submitted tool/config values. Explicit `allow_future=True` may preserve a future config only on the successful future-WR-gated path.

---

## 8. Matching policy

The scoring engine must distinguish target true positives from weak nearby findings. This requires a first implementation step before advanced scoring: preserve enough raw/case-level finding data from current S4 outputs and benchmark results to match against `file`, `line`, `dataFlow`, `metadata.cweId`, `metadata.cwe`, and `metadata.evidenceResolution`. Current file+CWE-only benchmark aggregation is insufficient for §8 matching.

### 8.1 Match classes

| class | Meaning | Counts as TP? |
|---|---|:---:|
| `exact-target-match` | expected CWE/family and expected location/sink within line window | yes |
| `strong-related-match` | expected CWE/family and same dataflow sink/source or same canonical callsite, but line differs beyond exact window | yes, separately tagged |
| `weak-related-match` | same vulnerable function/file but missing required CWE or sink relation | no; reported separately |
| `wrong-cwe-target-location` | right target location but wrong CWE/family | no; FP-like diagnostic |
| `off-target-finding` | finding outside the expected target region/case | no; noise/FP |
| `negative-case-finding` | any finding that violates the negative case's allowed-warning policy | no; FP |
| `missed-target` | no exact or strong-related match for a positive oracle | FN |

### 8.2 Default location rules

- Use normalized relative paths.
- Prefer sink/source line windows over function-only matching.
- Match against `metadata.cweId` first, then deterministic `metadata.cwe[]` fallback, then evidence-resolution CWE status.
- Match `dataFlow` source/sink roles when provided; absence of dataflow becomes a weaker match class, not a negative claim.
- Default exact line window: `±5` lines unless the case manifest overrides it.
- Function-only matching is disabled by default because prior research shows same-function warnings can be irrelevant.
- A finding cannot support absence-of-vulnerability or CWE absence, even if no match is found.

### 8.3 CWE family matching

The matcher may use family equivalence only when predeclared in a local deterministic map. Example: stack/heap buffer overflow subtypes may be related for some aggregate reports, but exact CWE metrics must remain available.

---

## 9. Metrics

### 9.1 Counting unit and formulas

Primary counting unit is the **oracle target**. Findings are secondary evidence attached to targets.

Definitions:

- `targetTP`: a positive oracle target with at least one exact or strong-related match. Multiple findings on the same target count as one targetTP for target-level recall; extras may count as duplicate/noise findings.
- `targetFN`: a positive oracle target with no exact or strong-related match.
- `matchedTpFindings`: findings that participate in exact or strong-related positive target matches.
- `fpFindings`: findings that are off-target, wrong-CWE for the target, weak-related only, duplicate beyond the selected target match, or attached to a negative-target violation.
- `negativeTargetViolationCount`: explicit negative oracle targets/regions whose allowed-warning policy is violated by at least one finding.
- `negativeTargetCleanCount`: explicit negative oracle targets/regions with no violating finding.
- `targetRecall = targetTP / (targetTP + targetFN)` when denominator > 0.
- `findingPrecision = matchedTpFindings / (matchedTpFindings + fpFindings)` when denominator > 0.
- `negativeTargetFpr = negativeTargetViolationCount / (negativeTargetViolationCount + negativeTargetCleanCount)` for explicit negative targets only.
- `discrimination = positiveTargetDetectionRate - negativeTargetViolationRate` for bad/good paired targets.
- `noisePerKloc = fpFindings / analyzedKloc`; `noisePerFile = fpFindings / analyzedFiles`.
- `uniqueTpContribution(tool)`: oracle targets matched by that tool and by no other tool in the compared configuration.
- `leaveOneOutRecallDelta(tool) = recall(full-current-six) - recall(leave-one-out:tool)`.
- `leaveOneOutNoiseDelta(tool) = noise(full-current-six) - noise(leave-one-out:tool)`.

Reports must include both target-level and finding-level counts where both are meaningful.

### 9.2 Per-tool and per-configuration metrics

For each `toolSetConfig`, `sliceKind`, `split`, and CWE/family:

- `tp`, `fp`, `fn`, `tn` where `tn` is meaningful only for explicit negative cases;
- recall / true-positive rate;
- precision;
- false-positive rate;
- discrimination: bad/good pair separation;
- noise per file and per KLOC;
- weak-related count;
- wrong-CWE count;
- runtime seconds;
- tool failure / partial / degraded rate;
- parser compatibility status;
- claim-support readiness distribution.

### 9.3 Portfolio metrics

For the portfolio:

- unique TP contribution by tool;
- overlap clusters: equivalent, strong-related, weak-related;
- leave-one-out recall delta;
- leave-one-out noise delta;
- leave-one-out runtime delta;
- add-one-in delta for future candidates;
- upgrade A/B delta for future version changes.

### 9.4 Report separation

Reports must not collapse everything into one score. Required top-level buckets:

- `validationMetrics`;
- `testMetrics`;
- `canaryMetrics`;
- `parserCompatibility`;
- `runtimeStability`;
- `claimBoundaryImpact`;
- `decisionSupport`.

---

## 10. Experiment report schema

The runner should emit `s4-tool-portfolio-experiment-report-v1`.

Minimum shape:

```json
{
  "schemaVersion": "s4-tool-portfolio-experiment-report-v1",
  "runId": "20260512-...",
  "createdAt": "2026-05-12T00:00:00Z",
  "producer": { "service": "s4-sast-runner", "deterministic": true },
  "decisionCycle": {
    "decisionCycleId": "s4-tool-portfolio-20260512-001",
    "phase": "validation | test",
    "frozen": true,
    "corpusManifestChecksum": "sha256:...",
    "matchingPolicyChecksum": "sha256:...",
    "thresholdsChecksum": "sha256:...",
    "splitAssignmentChecksum": "sha256:...",
    "rulesetChecksums": {},
    "toolVersions": {},
    "toolPaths": {},
    "timeoutConfig": {},
    "environmentSummary": {},
    "lockfileChecksum": "sha256:..."
  },
  "corpusManifest": {
    "schemaVersion": "s4-tool-portfolio-experiment-corpus-v1",
    "path": "...",
    "checksum": "sha256:..."
  },
  "corpusReadinessGate": {
    "schemaVersion": "s4-tool-portfolio-corpus-readiness-gate-v1",
    "status": "available | blocked | not_run",
    "decisionGradeReady": false,
    "requiredCorpora": ["juliet-c-cpp-1.3"],
    "reasonCodes": [],
    "acquisitionStatuses": {},
    "caseStatuses": [],
    "externalCorpusStatus": {},
    "consumerPolicy": "local_filesystem_readiness_only_not_quality_or_security_verdict"
  },
  "matchingPolicy": {
    "schemaVersion": "s4-oracle-matching-policy-v1",
    "lineWindowDefault": 5,
    "functionFallbackDefault": false
  },
  "toolSetConfigs": [],
  "validationMetrics": {},
  "testMetrics": {},
  "canaryMetrics": {},
  "parserCompatibility": {},
  "runtimeStability": {},
  "claimBoundaryImpact": {},
  "decisionSupport": {
    "currentDecision": "insufficient-evidence-for-tool-change",
    "removeCandidates": [],
    "upgradeCandidates": [],
    "addCandidates": [],
    "futureCandidateActionsRequireWr": true,
    "requiredFollowUps": []
  }
}
```

Report guardrails:

- `currentDecision` is decision support, not automatic production rollout.
- Future candidate arrays are WR-gated planning signals only; Milestone 1 reports must keep them empty.
- The report may say `insufficient-evidence-for-tool-change`, `candidate-needs-more-data`, or `ready-for-WR-review`; it must not silently mutate runtime policy.
- Report fields must not include final vulnerability verdict vocabulary.

### 10.1 System Stability Gate v1 report-side fail-closed rules

Tool-portfolio reports use `s4-tool-portfolio-system-stability-gate-v1` before local oracle scoring. This gate is report-side/offline and does not change runtime `/v1/scan` `options.tools` validation.

Required-tool rules:

- `build_system_stability_gate()` normalizes explicit required tools to canonical current-six `ALL_TOOLS` order.
- For generated gates, blank entries and duplicates are ignored after normalization.
- For generated gates, an empty normalized required tool list is a valid fail-closed evidence shape with `SYSTEM_REQUIRED_TOOLS_NOT_DECLARED`; report normalization must preserve that non-pass evidence.
- Unknown required tool IDs fail preflight with a detailed `REQUIRED_TOOL_UNKNOWN` phase failure.
- Unknown tool IDs must not fall through into execution-completeness as misleading `TOOL_RESULT_NOT_RECORDED`.
- Known unavailable tools continue to use the existing coarse top-level `REQUIRED_TOOL_UNAVAILABLE` reason with detailed preflight failure records.
- Known failed/partial/skipped/degraded/missing execution results continue to use `REQUIRED_TOOL_INCOMPLETE`.
- Caller-provided report-side pass gates require complete current-six `requiredTools`; caller-provided non-pass gates may omit `requiredTools`, provide a current-six subset, or preserve generated empty required-tool evidence, but unknown/blank/non-string/duplicate entries fail closed without raw echo.

This protects the experiment harness from scoring quality when the current-six pass prerequisite was not proven, while preserving legitimate fail-closed evidence generated by S4 itself.

### 10.2 Local Quality Gate threshold configuration rules

`qualityGate.localQualityAssessment` must fail closed when threshold configuration omits the split set to assess.

Rules:

- `findingsByConfig`/`findings_by_config` must be a mapping with all required current-six config keys; values must be non-string sequences of `SastFinding` or mapping items. Invalid payloads fail closed with `FINDINGS_BY_CONFIG_INPUT_INVALID`, suppress oracle scoring, and raw payloads must not be echoed.
- `matchingPolicy` itself must be a mapping/object; non-mapping payloads fail closed with `ORACLE_MATCHING_POLICY_INPUT_INVALID`, oracle-derived metrics must be non-scored, and raw payloads must not be echoed.
- Valid `matchingPolicy` is canonicalized to `schemaVersion=s4-oracle-matching-policy-v1`, `lineWindowDefault` integer in `[0,25]` (default `5`), and `functionFallbackDefault` boolean (default `false`). Wrong schema, unknown keys, bool/non-int/out-of-range line windows, and non-bool fallback values fail closed with sanitized `ORACLE_MATCHING_POLICY_INPUT_INVALID` diagnostics before oracle scoring.
- Legacy `external_corpus_status` is compatibility context only. It may preserve valid non-readiness-owned entries with `status` in `available|blocked|not_run` plus optional non-empty string `reasonCodes`/`acquisitionIds`; reserved `requiredCorpusReadiness`, readiness-owned keys, forbidden verdict vocabulary, unknown fields, malformed sequences, and invalid statuses are omitted from `decisionSupport.externalCorpusStatus` and reported only in sanitized `decisionSupport.legacyExternalCorpusStatusInputValidation` failures. These failures must not gate `qualityGate` or `requiredFollowUps`.
- Report identity fields are fail-closed before decision-cycle construction. `runId` must be a safe non-empty identifier matching `[A-Za-z0-9][A-Za-z0-9._:-]{0,127}` with true end anchoring, `createdAt` must be real RFC3339 UTC seconds (`YYYY-MM-DDTHH:MM:SSZ`), and `phase` must be `validation|test|canary`. Invalid identity uses sanitized placeholders in top-level report and `decisionCycle`, emits `reportIdentityValidation`, suppresses oracle scoring, and never echoes raw invalid values. System/corpus prerequisite precedence remains authoritative.
- Threshold payloads used for decision-cycle checksum must be JSON-serializable before `build_decision_cycle_lock`. Valid thresholds keep the original checksum input. Non-mapping or non-JSON-serializable threshold payloads use a deterministic sanitized checksum surrogate and fail local quality with `QUALITY_THRESHOLDS_INPUT_INVALID` without suppressing split metric scoring when other prerequisites pass; raw object repr, exception text, and container contents must not be emitted.
- `thresholds` itself must be a mapping/object; non-mapping payloads fail closed with `QUALITY_THRESHOLDS_INPUT_INVALID` and sanitized type/category diagnostics.
- `thresholds.requiredSplits` defaults to `["validation", "test", "canary"]` when absent or `null`.
- Explicit `requiredSplits=[]` or only blank strings is invalid.
- Blank split names are ignored.
- Duplicate split names are ignored.
- Known splits are assessed in canonical order: `validation`, `test`, `canary`.
- Unknown nonblank, non-string, bytes, or otherwise malformed split entries are represented only in the sanitized threshold snapshot as `<invalid>` and fail before split scoring with `QUALITY_REQUIRED_SPLITS_INVALID`; they must not populate `splitAssessments`, `passingSplits`, or `failingSplits` as pseudo-splits.
- Empty normalized required splits produce `qualityGate.localQualityAssessment.status="fail"` with `QUALITY_REQUIRED_SPLITS_NOT_DECLARED`.
- At least one quality threshold criterion must be declared: `minimumTargetRecall`, `minimumFindingPrecision`, or `maximumNegativeTargetFpr`.
- If no threshold criterion is declared, local quality fails with `QUALITY_THRESHOLDS_NOT_DECLARED`.
- Declared quality threshold values must be numeric, finite, and in the inclusive `[0.0, 1.0]` range.
- Invalid threshold values fail closed before split scoring with `QUALITY_THRESHOLD_VALUE_INVALID`; diagnostics may include `invalidThresholdFields` field names only.
- Non-finite values must not be emitted raw in JSON report threshold diagnostics.
- `thresholds.primaryToolSetConfig` defaults to `full-current-six` only when absent or `null`.
- Explicit `primaryToolSetConfig` values must be nonblank strings and must match a known `required_current_six_configs()` config.
- Report-visible threshold diagnostics and snapshots must be sanitized separately from scoring: snapshots emit only allowlisted threshold config fields, unknown top-level threshold keys are omitted, invalid threshold values and invalid `primaryToolSetConfig` values are redacted as `<invalid>`, and non-JSON diagnostic paths preserve only allowlisted top-level field names while replacing unknown top-level/nested mapping keys with `<invalid>`. Invalid `requiredSplits` entries must not be stringified or echoed; they are represented as `<invalid>` in the threshold snapshot and fail closed before split scoring with `QUALITY_REQUIRED_SPLITS_INVALID`.
- Invalid primary config values fail closed before split scoring with `QUALITY_PRIMARY_TOOL_SET_CONFIG_INVALID`; diagnostics must be sanitized category/type metadata and unknown string values must be reported as `<invalid>`, not truncated raw input.
- If system stability and corpus readiness prerequisites pass, this local quality configuration error produces final `qualityGate.status="fail"`, not `not_decision_grade`.

Corpus-readiness consistency rule:

- Caller-provided `corpusReadinessGate` payloads must be mapping/object shaped; explicit `{}` or non-mapping payloads fail closed with `CORPUS_READINESS_GATE_INPUT_INVALID` and sanitized `inputValidation` diagnostics.
- `status` must be one of `available`, `blocked`, or `not_run`; `decisionGradeReady` must be boolean; `reasonCodes` and nested reason-code lists must contain non-empty strings only.
- Caller-provided `corpusReadinessGate` payloads must satisfy `decisionGradeReady is True` iff `status == "available"`.
- `status="available"` must prove decision-grade readiness: non-empty `requiredCorpora`, matching available `acquisitionStatuses` with validation/test split counts, non-empty available `caseStatuses` bound to every required acquisition ID, `summary.checkedCaseCount == len(caseStatuses) > 0`, summary validation/test split counts, and required-corpus-bound available `externalCorpusStatus` projections.
- If `externalCorpusStatus[*].acquisitionIds` is present, it is authoritative: it must be a non-string sequence of non-empty strings and include the required acquisition ID; key/name fallback is allowed only when `acquisitionIds` is absent and unambiguous.
- `status="blocked"` and `status="not_run"` may preserve minimal evidence without acquisition/case proof, but they must always project `requiredCorpusReadiness` from the top-level readiness status/reason codes so embedded or legacy external status cannot suppress blockers.
- Non-available readiness gates must not project only `available` external corpus status.
- Inconsistent readiness gates are normalized to `status="blocked"`, `decisionGradeReady=false`, `CORPUS_READINESS_GATE_INCONSISTENT`, and `consistencyChecks.status="fail"`; acquisition/case/summary evidence must be preserved.
- The authoritative external corpus projection must include `requiredCorpusReadiness.status="blocked"` or `not_run` with top-level reason codes for any non-available or reason-coded readiness gate.
- With otherwise passing system/local quality, readiness inconsistency or input invalidity yields final `qualityGate.status="not_decision_grade"`, not pass.
- Legacy/caller-supplied `external_corpus_status` is compatibility context only. The report prerequisite `qualityGate` and `decisionSupport.requiredFollowUps` must consume the readiness-derived projection, not legacy merged context, so an unrelated legacy blocked key cannot overrule `corpusReadinessGate.status="available"`.

System-stability `not_run` rule:

- `default_not_run_system_gate()` remains valid for precomputed harness fixtures that do not execute tools.
- `status="not_run"` keeps split metrics and `qualityGate.localQualityAssessment` useful as local/prerequisite evidence.
- It cannot produce final `qualityGate.status="pass"`.
- It must emit `qualityGateAllowed=false`; `qualityGateAllowed=true` is reserved for `systemStabilityGate.status="pass"`.
- Caller-provided system gates must satisfy the invariant `qualityGateAllowed is True` iff `status == "pass"`.
- Caller-provided non-mapping system-stability payloads fail closed with `SYSTEM_STABILITY_GATE_INPUT_INVALID`, block final quality, and expose only sanitized input diagnostics.
- For `status="pass"`, report-side system gates must prove pass eligibility: `requiredTools` must be non-empty, current-six complete, duplicate-free, and contain no unknown tool IDs; `phases.preflight` and `phases.executionCompleteness` must each be mappings with `status="pass"` and an explicitly present empty `failures` sequence.
- Malformed `status="pass"` nested phase evidence, including empty phase mappings, non-pass phase statuses, non-empty failures, or malformed failures, fails closed with `SYSTEM_STABILITY_GATE_INPUT_INVALID` before oracle scoring.
- `status="fail"` and `status="not_run"` gates may preserve minimal evidence. Strict current-six tool and nested pass-phase proof is pass-only so existing failure/not-run evidence is not overwritten as input-invalid.
- Non-pass gates still validate any optional provided evidence: unknown top-level fields, invalid schema versions, invalid top-level reason codes, malformed requiredTools entries, malformed phase/failure containers, unknown phase/failure fields, invalid tool/status/degrade reason fields, and unsafe version/path evidence fail closed or are redacted without raw value echo. `version` is projected only as `versionStatus`, and `expectedExecutablePath` only as `expectedExecutablePathStatus`.
- Direct `build_system_stability_gate()` unavailable-tool preflight failures must be status-only and re-ingestable: `reasonCode` is allowlisted with `runtime-tool-missing` fallback, `versionStatus` is `present|missing`, `expectedExecutablePathStatus` is `redacted|not-configured`, and raw `probeReason`, `version`, or executable path strings must not be emitted.
- Direct `build_system_stability_gate()` execution-completeness failures must sanitize generated and raw result metadata before exposure: status is restricted to `ok|partial|failed|skipped|missing|not_run|unknown`, skip reasons use the system failure reason-code allowlist or safe fallback, degrade reasons use the degrade-reason allowlist, and `timedOutFiles`/`failedFiles` are nonnegative non-bool integers or `null`.
- Direct `build_system_stability_gate()` required-tool declarations are identity-sanitized before gate construction: known current-six tools are emitted in canonical order; unknown strings, blanks, non-string entries, and invalid containers collapse to a single `<invalid>` sentinel with `REQUIRED_TOOL_UNKNOWN`; empty declarations still use `SYSTEM_REQUIRED_TOOLS_NOT_DECLARED`.
- Direct `blocked_metric_bucket()` output must sanitize helper inputs: `split` is one of `validation|test|canary` or `<invalid>`, `reasonCodes` are system top-level allowlisted, malformed containers/items add `SYSTEM_STABILITY_GATE_INPUT_INVALID`, and string/object inputs are never expanded or stringified into public buckets.
- Normalized inconsistent gates are valid to re-ingest: `phases.gateConsistency.failures[].reasonCode="SYSTEM_STABILITY_GATE_INCONSISTENT"` is allowlisted for the gate-consistency phase.
- Inconsistent caller-provided system gates are normalized to `status="fail"`, `qualityGateAllowed=false`, `SYSTEM_STABILITY_GATE_INCONSISTENT`, and `phases.gateConsistency.status="fail"`; existing preflight/execution phase evidence is preserved when it is mapping-shaped, and malformed phase containers must not crash normalization.
- When local quality would otherwise pass, final quality remains `not_decision_grade` with `SYSTEM_STABILITY_GATE_NOT_RUN` until an explicit passing system-stability gate is provided.
- Direct `build_quality_gate()` callers use the same eligibility invariant as report normalization: quality is `eligible` only when `systemStabilityGate.status == "pass"` and `qualityGateAllowed is True`; `system_stability_gate=None` is treated as `not_decision_grade` with `SYSTEM_STABILITY_GATE_NOT_RUN`, valid `not_run` plus `qualityGateAllowed=false` remains non-decision-grade, and malformed/inconsistent direct-helper gates block scoring with `SYSTEM_STABILITY_GATE_FAILED` plus `SYSTEM_STABILITY_GATE_INPUT_INVALID` or `SYSTEM_STABILITY_GATE_INCONSISTENT`.
- Direct `build_quality_gate()` reason-code propagation is allowlisted before report exposure: system-stability reason codes must be in the system top-level allowlist, external corpus/readiness reason codes must be in `READINESS_REASON_CODE_ALLOWLIST`, and malformed/unknown entries add `SYSTEM_STABILITY_GATE_INPUT_INVALID` or `CORPUS_READINESS_GATE_INPUT_INVALID` while suppressing raw strings, numeric coercions, and object `str`/`repr` output.

---


### 10.3 S3/downstream consumer contract

The offline Tool Portfolio report is a downstream evidence artifact, not a runtime vulnerability verdict. S3 consumption is tracked by WR `wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md`; S4 owns the report schema and will not edit S3 code directly.

Consumer contract:

- Tool Portfolio report consumer canary CLI failure stderr uses an exact 5-key JSON envelope: `error`, `reasonCode`, `reasonCodes`, `stage`, and `summaryEmitted`. Input failure diagnostics use `input validation failed` / `TOOL_PORTFOLIO_REPORT_CLI_INPUT_INVALID` / `input`; summary serialization or stdout write failures use `summary output failed` / `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` / `output`; successful stdout summary schema is unchanged.

1. Treat `corpusReadinessGate` as authoritative. `decisionSupport.externalCorpusStatus` is a compatibility projection derived from readiness and cannot override a non-available readiness gate.
2. Treat validation/test evidence as decision-grade only when `corpusReadinessGate.status == "available"` and `corpusReadinessGate.decisionGradeReady == true`.
3. Treat `systemStabilityGate.status == "pass"` as a prerequisite for final report quality pass. `not_run`, `blocked`, and `fail` can preserve metrics but remain non-decision-grade.
4. Treat split metric bucket status as scoring execution status. Threshold quality belongs to `qualityGate.localQualityAssessment`, and final offline evidence status belongs to `qualityGate.status`.
5. Preserve no-negative-evidence semantics. Blocked corpora, invalid thresholds, system-gate failures, local quality failures, absent findings, or synthetic harness reports must not become `sast_no_findings`, `cve_no_hits`, `absence-of-vulnerability`, or final security verdicts.
6. Preserve aggregate SARD semantics. `decisionSupport.externalCorpusStatus.sard.acquisitionIds[]` can include vulnerable and secure acquisitions; a consumer must not reduce that aggregate to one lossy boolean.

Expected S3 replies are `accepted-no-code-change`, `accepted-doc-only`, `code-change-needed`, or `blocked` with missing sample/field details.

---

## 11. Decision rules

### 11.1 Universal prerequisites

A tool change decision cannot proceed unless all are true:

1. corpus manifest validates;
2. parser compatibility passes for current and changed tool outputs;
3. canary/contract gates pass;
4. validation and held-out test results are both present;
5. matching policy was frozen before held-out test scoring;
6. runtime degraded/failure rate is reported;
7. S3/S5 API changes are either not required or tracked as separate WRs.

### 11.2 Keep

Keep a tool when any of these are true:

- it has unique TP contribution on validation or test;
- it has high precision for a CWE/family that the portfolio otherwise covers weakly;
- it provides useful confirmation overlap without meaningful noise/runtime cost;
- it acts as a fast canary that improves S3-readable claim support;
- removal worsens parser/claim-boundary/runtimes in a way that is not offset by reduced noise.

### 11.3 Remove candidate

A tool can become a remove candidate only if all are true:

- zero unique TP on validation and held-out test for tracked CWE/family slices;
- removing it does not reduce recall or discrimination for any tracked high-priority CWE/family;
- noise or runtime savings are measurable;
- consumer contract semantics become simpler or unchanged;
- the decision is represented in a governance report and WR-reviewed before implementation.

### 11.4 Upgrade candidate

A tool upgrade can proceed only if:

- parser compatibility fixtures cover the new raw output shape;
- validation improves or fixes a documented gap;
- held-out test confirms the improvement without unacceptable noise/runtime regression;
- omission policy and degraded semantics remain compatible.

### 11.5 Add candidate

A new tool can be proposed only if:

- a documented gap exists in current six-tool validation/test evidence;
- the candidate is deterministic, local, offline at experiment runtime, and parser-fixture friendly;
- add-one-in improves unique TP, discrimination, or runtime/noise tradeoff enough to justify maintenance;
- it does not require LLM, external vulnerability lookup, or network service calls.

---

## 12. Local execution plan

### 12.1 Existing gates to run before experiment harness changes

From `services/sast-runner`:

```bash
python3 -m pytest \
  tests/test_tool_portfolio_governance.py \
  tests/test_tool_output_compat.py \
  tests/test_benchmark_slice_report.py \
  tests/test_golden_corpus_v1.py \
  tests/test_static_evidence_report.py \
  tests/test_static_evidence_consumer_canaries.py \
  tests/test_analysis_quality_gate.py \
  tests/test_static_evidence_contract.py
```

### 12.2 Juliet baseline execution pattern

After Juliet is available locally:

```bash
PYTHONPATH=. python3 -m benchmark.juliet_runner \
  --juliet-path /path/to/Juliet/testcases/C \
  --variant-filter 01 \
  --cwes 78,121,122,134,190,252,369,401,416,457,476,680 \
  --output benchmark/results/tool_portfolio/validation/full-current-six.json
```

Single-tool and leave-one-out runs use the same command with `--tools`:

```bash
PYTHONPATH=. python3 -m benchmark.juliet_runner \
  --juliet-path /path/to/Juliet/testcases/C \
  --variant-filter 01 \
  --cwes 78,121,122,134,190,252,369,401,416,457,476,680 \
  --tools semgrep \
  --output benchmark/results/tool_portfolio/validation/single-tool-semgrep.json
```

### 12.3 First harness implementation tests

Before implementing the experiment runner, add tests for:

- corpus manifest schema validation;
- acquisition manifest validation for external corpora;
- acquisition linkage validation: external corpus cases must resolve `acquisitionId` + `acquisitionManifestChecksum` + `sourceRef`;
- split disjointness, lineage leakage, and checksum requirements;
- forbidden verdict key recursion guard across manifests and reports;
- same-file Juliet good/bad function-region matching;
- oracle matching classes, dataflow/CWE matching, and line-window behavior;
- negative-case region-scoped FP/discrimination behavior;
- report schema shape, row-level metadata presence, and metric bucket separation;
- deterministic no-network/no-LLM/no-S5 static guard for new modules;
- the no-network/no-LLM/no-S5 static guard must use value-free failure diagnostics and must not echo host-local file paths or regex internals;
- decision-cycle freeze tests rejecting held-out test reruns after matching-policy/threshold/split drift;
- current-six-only validator tests that reject future candidate tool IDs in Milestone 1;
- leave-one-out and unique-contribution math on small synthetic report fixtures.

Expected test files:

- `services/sast-runner/tests/test_tool_portfolio_corpus_acquisition.py`
- `services/sast-runner/tests/test_tool_portfolio_experiment_manifest.py`
- `services/sast-runner/tests/test_tool_portfolio_acquisition_manifest.py`
- `services/sast-runner/tests/test_tool_portfolio_oracle_matcher.py`
- `services/sast-runner/tests/test_tool_portfolio_experiment_report.py`
- `services/sast-runner/tests/test_tool_portfolio_decision_cycle_freeze.py`

Expected implementation files:

- `services/sast-runner/benchmark/tool_portfolio_corpus_acquisition.py`
- `services/sast-runner/benchmark/tool_portfolio_experiment_manifest.py`
- `services/sast-runner/benchmark/tool_portfolio_acquisition_manifest.py`
- `services/sast-runner/benchmark/tool_portfolio_oracle_matcher.py`
- `services/sast-runner/benchmark/tool_portfolio_experiment_report.py`
- `services/sast-runner/benchmark/tool_portfolio_decision_cycle.py`

---

## 13. First milestone checklist

Milestone 1: experiment harness skeleton, no new tool changes.

- [ ] Write corpus and acquisition manifest validator tests first.
- [ ] Implement `s4-tool-portfolio-experiment-corpus-v1` and `s4-tool-portfolio-acquisition-v1` parsers/validators.
- [ ] Write raw/case-level finding capture tests before advanced matching.
- [ ] Extend benchmark result capture so matcher can see file/line/dataFlow/CWE/evidenceResolution fields.
- [ ] Write oracle matcher tests first.
- [ ] Implement deterministic matcher with exact/strong/weak/wrong/off-target/missed classes.
- [ ] Write report schema and decision-cycle freeze tests first.
- [ ] Implement report builder for precomputed small fixtures.
- [ ] Connect existing Golden Corpus, parser compatibility, and benchmark-slice reports as prerequisite gates.
- [ ] Reject candidate/future tool-set configs until a WR-gated decision-cycle flag exists.
- [ ] Run focused pytest gates.
- [ ] Only then run local Juliet validation slice if Juliet is available.

Milestone 2: local validation experiment.

- [ ] Freeze validation manifest.
- [ ] Run full-current-six.
- [ ] Run six single-tool configs.
- [ ] Run six leave-one-out configs.
- [ ] Produce validation report.
- [ ] Inspect unique contribution, overlap, noise, and runtime.

Milestone 3: held-out test experiment.

- [ ] Freeze matching policy.
- [ ] Verify decision-cycle lock checksums, then run held-out test slice.
- [ ] Compare validation vs test deltas.
- [ ] Emit decision-support report.
- [ ] If any API or consumer behavior changes are needed, send WR before implementation.

---

## 14. Relationship to S4 governance

This spec does not replace `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`.

It supplies the missing experiment protocol required by that governance page. The intended lifecycle is:

1. Static Evidence Contract and Golden Corpus gates pass.
2. Tool Output Compatibility and Benchmark Slice gates pass.
3. This experiment spec produces validation/test reports.
4. Governance consumes those reports.
5. Only then can S4 propose add/remove/upgrade through WR-backed implementation.

Until step 4 has real validation and held-out test evidence, the correct governance decision remains **keep current six tools and improve measurement**.
---

## 15. Implementation status (2026-05-14)

Status: **framework implemented; synthetic harness remains non-decision-grade, and actual Juliet/SARD external corpus acquisition now succeeds into the ignored local `.omx` cache with readiness `available` when explicitly run**.

Implemented in `services/sast-runner`:

- `benchmark/tool_portfolio_acquisition_manifest.py` — acquisition provenance validation and stable manifest checksums.
- `benchmark/tool_portfolio_corpus_acquisition.py` — NIST Juliet/SARD download, SHA-256 verification, safe extraction, acquisition-manifest emission, focused corpus-manifest generation, and immediate readiness preflight for local offline scoring.
- `benchmark/tool_portfolio_experiment_manifest.py` — corpus manifest validation, tracked CWE set, split/lineage leakage checks, current-six tool-set config validation, forbidden verdict-key guard.
- `benchmark/tool_portfolio_corpus_readiness.py` — local filesystem corpus readiness gate for required external corpora, safe path resolution, checksum verification, validation/test split readiness, and compatibility `externalCorpusStatus` projection.
- `benchmark/tool_portfolio_oracle_matcher.py` — target-level deterministic oracle matching with exact/strong/weak/wrong/off-target/negative/missed classes.
- `benchmark/tool_portfolio_decision_cycle.py` — decision-cycle freeze checksums and static no-network/no-LLM/no-S5 coupling guard for new modules.
- `benchmark/tool_portfolio_experiment_report.py` — `s4-tool-portfolio-experiment-report-v1` builder with validation/test/canary metric buckets, embedded `corpusReadinessGate`, derived compatibility `externalCorpusStatus`, local threshold-based `qualityGate.localQualityAssessment`, unique contribution, leave-one-out deltas, historical benchmark prerequisite evidence, and WR-gated future candidate policy.
- `benchmark/tool_portfolio_harness_fixture.py` — file-based S4-owned synthetic/precomputed harness fixture runner.
- `benchmark/tool_portfolio_actual_runner.py` — offline actual Tool Portfolio runner for pinned local Juliet/SARD corpora; it stages only manifest source files before scanning so all six tools are constrained to the corpus manifest cases.
- `benchmark/cwe_matcher.py` now extracts `metadata.cweId` and `metadata.evidenceResolution.cwe.id` in addition to legacy `metadata.cwe[]`.

Added deterministic local harness fixture:

- `tests/fixtures/tool_portfolio_experiment_v1/acquisition_manifest.json`
- `tests/fixtures/tool_portfolio_experiment_v1/corpus_manifest.json`
- `tests/fixtures/tool_portfolio_experiment_v1/findings_by_config.json`
- `tests/fixtures/tool_portfolio_experiment_v1/quality_gate_oracle.json`

Generated report artifact:

- `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json`

The harness fixture deliberately labels itself as `s4-harness-fixture`; it is not Juliet evidence and cannot justify a production tool add/remove/upgrade decision. The report now marks decision-grade Juliet validation/test as `blocked` through `corpusReadinessGate.status="blocked"` with `LOCAL_JULIET_CORPUS_NOT_PRESENT`, and projects that state into `decisionSupport.externalCorpusStatus` for compatibility. Current historical baseline JSONs remain prerequisite/governance continuity evidence only, not replacement held-out test evidence for the new oracle matcher. Separately, the explicit acquisition CLI has downloaded/pinned Juliet C/C++ 1.3 plus SARD C v2 vulnerable/secure into `.omx/corpora/s4-tool-portfolio/` and produced an 80-case focused validation/test corpus with readiness `available`; this local cache is not committed.

Actual Tool Portfolio runner status: `benchmark/tool_portfolio_actual_runner.py` can now consume pinned local corpus/acquisition manifests, create a deterministic case-only staging tree, run all 15 `required_current_six_configs()` keys, and feed actual findings into `s4-tool-portfolio-experiment-report-v1`. The runner does not scan acquisition roots directly; `semgrep`, `cppcheck`, and `flawfinder` see only staged manifest files. Top-level `systemStabilityGate` is derived from `full-current-six` executions only so intentional single/leave-one-out skips cannot poison current-six stability. Default thresholds are fail-closed (`requiredSplits` only) unless the operator supplies explicit criteria. CLI relative `localPath` support requires `--base-path`, which is also used for Juliet `C/testcasesupport` include profile resolution.

Actual low-threshold runner-integrity execution: `.omx/corpora/s4-tool-portfolio/actual-runs/20260513-low-threshold/report-after-stage-path-fix.json` is the latest actual runner artifact over the 80-case local Juliet/SARD corpus after fixing runner/profile/parser issues, hardening threshold-profile semantics, adding diagnostic-only quality decomposition, adding candidate triage lanes, adding tool-contribution diagnostics, and canonicalizing staged acquisition paths. This artifact is **runner-integrity evidence only** because thresholds were deliberately permissive (`minimumTargetRecall=0.0`, `minimumFindingPrecision=0.0`, `maximumNegativeTargetFpr=1.0`). The report encodes that fact directly: `qualityGate.status="not_decision_grade"`, `qualityGate.localQualityAssessment.status="not_decision_grade"`, and `qualityGate.localQualityAssessment.thresholdProfile.intent="runner-integrity-only"` with `QUALITY_THRESHOLDS_NON_DISCRIMINATING`. It must not be cited as current-six quality sufficiency. Observed primary metrics remain low: validation recall `0.25`, precision `0.0221`, `fpFindings=221`; test recall `0.2`, precision `0.0129`, `fpFindings=307`.

Quality Gate local assessment semantics added on 2026-05-12:

- `validationMetrics.status`, `testMetrics.status`, and `canaryMetrics.status` mean that deterministic scoring ran for that split; threshold pass/fail is reported under `qualityGate.localQualityAssessment`.
- `qualityGate.localQualityAssessment.primaryToolSetConfig` defaults to `full-current-six`; single-tool and leave-one-out rows are portfolio evidence, not the direct pass/fail basis for the local Quality Gate.
- `qualityGate.localQualityAssessment.thresholdProfile` classifies threshold intent. If every declared quality criterion is non-discriminating (`minimumTargetRecall<=0`, `minimumFindingPrecision<=0`, `maximumNegativeTargetFpr>=1`), split scoring may still run but final `qualityGate.status` must remain `not_decision_grade` with `QUALITY_THRESHOLDS_NON_DISCRIMINATING`. Missing metrics do not turn such runner-integrity profiles into quality failures; discriminating thresholds still fail missing metrics.
- `qualityDiagnostics` is additive diagnostic-only evidence with schema `s4-tool-portfolio-quality-diagnostics-v1`. It never changes `qualityGate`, `decisionSupport`, or production `/v1/scan`. It separates target-row outcomes from raw finding pressure: `targetOutcomeCounts` are score-row counts, `findingPressure` uses unique oracle finding keys, `matchAttemptDiagnostics` exposes weak/wrong-CWE attempt counters, `byCwe` buckets by expected target CWE, and `byTool` reports raw pressure without per-tool FP attribution.
- `qualityDiagnostics.splitDiagnostics[*].diagnosticTriage` turns diagnostic facts into deterministic candidate investigation lanes, not root cause or verdict. Stable candidate order is `matching-policy-review`, `cwe-normalization-review`, `negative-discrimination-review`, `recall-gap-investigation`, `noise-pressure-review`. Candidates use neutral categories `measurement-review` or `coverage-or-noise-review`; `nonTpRawFindingCount` is context only and does not trigger noise triage without oracle-counted FP evidence.
- Actual diagnostic artifact `report-after-stage-path-fix.json` has `qualityDiagnostics.status="available"`. Validation pressure: `uniqueRawFindingCount=226`, `tpFindingCount=5`, `oracleCountedFpFindingCount=221`; test pressure: `uniqueRawFindingCount=311`, `tpFindingCount=4`, `oracleCountedFpFindingCount=307`. Both splits expose deterministic hints and the five candidate lanes: `matching-policy-review`, `cwe-normalization-review`, `negative-discrimination-review`, `recall-gap-investigation`, and `noise-pressure-review`.
- `toolContributionDiagnostics` is additive diagnostic-only evidence with schema `s4-tool-portfolio-tool-contribution-diagnostics-v1`. It aggregates all scored targets across `includedSplits`, never mutates `qualityGate`/`decisionSupport`, and never emits add/remove/upgrade recommendations. Rows are stable `ALL_TOOLS` order and classify each current-six tool as `unique-positive-contributor`, `overlap-only-positive-contributor`, `noise-only-or-no-positive-contribution`, or `no-observed-signal` from already-scored single-tool and leave-one-out configs. If comparative configs are incomplete, the block is `not_run` with `TOOL_CONTRIBUTION_COMPARATIVE_CONFIG_INCOMPLETE` and `tools=[]` rather than fake zero-signal rows. Latest actual artifact has readiness `available`, system `pass`, staged acquisition `localPath` values absolute even when the CLI uses relative `--work-dir`, and `toolContributionDiagnostics.status="available"`: `semgrep`, `scan-build`, and `gcc-fanalyzer` are unique-positive contributors; `cppcheck` and `clang-tidy` are overlap-only positive contributors; `flawfinder` is noise-without-positive-contribution on this low-threshold runner-integrity slice.
- The S4-owned Tool Portfolio report consumer canary must project `QUALITY_REQUIRED_SPLITS_INVALID` as an allowlisted quality-gate reason that keeps `toolPortfolioDecisionGradeUsable=false` because local/final quality failed, not because the projection is unsafe.
- `tool_portfolio_report_consumer_canary.summarize_tool_portfolio_report()` is the S4-owned offline report consumption canary. It accepts only top-level schema `s4-tool-portfolio-experiment-report-v1`, emits neutral sanitized summary fields, and sets `toolPortfolioDecisionGradeUsable=true` only when system stability, corpus readiness, local quality, final quality, and quality-sufficiency threshold profile are all positive, no unsafe projection exists, and the projected consumer evidence is complete. Decision-grade projection completeness requires `qualityDiagnostics.status="available"`, `toolContributionDiagnostics.status="available"`, one sanitized `toolContributionClasses` row for every current-six tool, empty sanitized failure `reasonCodes`, and empty sanitized `decisionSupport.requiredFollowUps`; diagnostic candidate IDs are advisory and are not required because a clean decision-grade report may have no triage candidates. If the positive gate predicate would otherwise pass but these projected evidence requirements are incomplete, the canary adds `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and forces `toolPortfolioDecisionGradeUsable=false`; already failing, blocked, runner-integrity-only, or not-decision-grade reports do not gain unsafe projection solely because optional completeness surfaces are absent. The separate `runnerIntegrityOnly` convenience boolean is also fail-closed: it is true only when the sanitized runner-integrity signal is present and `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` is absent. Unsafe reports may still expose sanitized threshold/reason context, but the boolean classification itself must not remain true. It allowlists every projected reason/follow-up/status/intent/diagnostic/tool string; unsafe projection adds `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and forces the summary not decision-grade. The helper is pure JSON and does not import app code, call tools/network, inspect raw `toolResults`, or encode S3/S5 routing. The emitted summary is itself versioned as `s4-tool-portfolio-report-consumer-summary-v1` and exact-key locked so future raw-field additions require an intentional summary schema bump. The committed sample `benchmark/results/tool_portfolio/s4-harness-fixture-consumer-summary-v1.json` must equal the summarizer output for the canonical harness report as parsed JSON; CLI parsed stdout must equal the same artifact. The module also exposes a smoke CLI: `python -m benchmark.tool_portfolio_report_consumer_canary --report <path> [--require-decision-grade]`; exit `0` means parsed valid-schema summary emitted and the optional required decision-grade gate passed, exit `2` means summary emitted but `reportPresent=false` or required decision-grade failed, and exit `1` means args/file/JSON syntax prevented summary emission. The committed consumer summary artifact is protected by a symmetric stale-artifact guard: under `benchmark/results/tool_portfolio/*.json`, any document with `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"` is allowed only at `s4-harness-fixture-consumer-summary-v1.json` and only when parsed JSON exact-matches the generated canonical-report summary; extra or drifted summary artifacts are CI/test offenders. Projected diagnostic identifiers and summary-only reason spoofing are fail-closed as part of the same summary contract: unknown or malformed `diagnosticTriage.candidates[].candidateId`, `toolContributionDiagnostics.tools[].toolId`, or `toolContributionDiagnostics.tools[].evidenceClass` values are omitted from sanitized output but add `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and force `toolPortfolioDecisionGradeUsable=false`. Duplicate `toolContributionDiagnostics.tools[].toolId` rows are also malformed projection even if their IDs/classes are individually allowlisted: the first observed contribution class is preserved, later duplicates are ignored, and unsafe projection is emitted so duplicate rows cannot silently alter S3-facing tool contribution evidence. Canary-generated summary diagnostics (`TOOL_PORTFOLIO_REPORT_ABSENT`, `TOOL_PORTFOLIO_REPORT_MALFORMED`, `TOOL_PORTFOLIO_REPORT_SCHEMA_UNSUPPORTED`, `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`) are not valid producer reason codes in present valid reports; caller-provided occurrences are omitted, converted into canary-generated unsafe projection, and force non-decision-grade usability. `reasonCodes` and `decisionSupport.requiredFollowUps` are list-shaped contract fields: absent/`None` remains optional, non-list containers are unsafe, and proper lists preserve valid allowlisted strings while malformed items are omitted without stringification and still mark unsafe projection. Scalar projections distinguish absence from malformed presence: absent/`None` keeps compatibility, but present non-string or blank scalar values are unsafe projection even when they normalize to safe defaults such as `unknown` or `missing`. Object/map projections follow the same fail-closed distinction: absent/`None` remains compatible, but present non-object containers for top-level gates, nested quality maps, diagnostic surfaces/split/triage maps, tool-contribution diagnostics, or `decisionSupport` are unsafe projection, normalize only to safe defaults, never stringify arbitrary objects, and force non-decision-grade usability. Boolean decision fields (`systemStabilityGate.qualityGateAllowed`, `corpusReadinessGate.decisionGradeReady`) likewise distinguish absence from malformed presence: absent/`None` defaults to `false` without unsafe projection, real booleans are preserved, and present non-bool values including integers are unsafe projection without coercion or stringification.

- Required current-six `findings_by_config` entries must carry validated tool identity before scoring. Accepted sources are `SastFinding.tool_id`, mapping `toolId`, or mapping `tool_id`; values must be exact current-six tool IDs. `single-tool:<tool>` configs may contain only that tool, and `leave-one-out:<tool>` configs must not contain the excluded tool. Invalid tool identity or config membership uses `FINDINGS_BY_CONFIG_INPUT_INVALID`, suppresses scoring, and must not echo raw unknown tool IDs.
- Mapping findings in required current-six `findings_by_config` entries are semantically validated before scoring. Valid mapping findings may use nested `location.file`/`location.line` or top-level `file`/`line`; the normalizer canonicalizes them into `location` for split filtering and oracle matching. Missing/blank rule/file, invalid line, non-mapping `location`/`metadata`, and malformed `dataFlow`/`data_flow` fail closed through `FINDINGS_BY_CONFIG_INPUT_INVALID` with sanitized field/type diagnostics and no raw value echo. CWE evidence remains metadata-driven; S4 does not infer CWE from `ruleId`.
- `qualityDiagnostics.splitDiagnostics[*].byCweTool` is a score-row-scoped CWE×tool match-class diagnostic matrix. It buckets existing best-per-target score rows by expected target CWE and concrete `toolId`, preserves wrong-CWE rows under the expected CWE, and exposes only `targetTP`, `negativeTargetViolationCount`, `targetOutcomeCounts`, and `triageReasonCodes`. It intentionally omits per-tool `targetFN`, recall, precision, raw finding pressure, and `ALL_TOOLS` pseudo-tool buckets; portfolio-level misses remain in `byCwe`, and raw pressure remains in `findingPressure`/`byTool`.
- `negativeTargetFpr=null` means the split has no negative targets, so `maximumNegativeTargetFpr` is not applicable and must not fail that split.
- The current S4 harness fixture has `qualityGate.status=\"not_decision_grade\"` because Juliet is not locally pinned, while `qualityGate.localQualityAssessment.status=\"fail\"` because validation/test fixture metrics intentionally include precision/noise failures. The canary split passes.
- The regenerated report artifact `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json` now contains `systemStabilityGate`, `qualityGate`, and `qualityGate.localQualityAssessment`.

Verification evidence:

- Juliet benchmark CLI structured stderr diagnostics: RED regressions proved Juliet benchmark failure boundaries were still plain text and that `sys.stderr.write()` `ValueError` could escape instead of returning the stable CLI exit. Final `juliet_runner.py::main()` emits exact 3-key compact JSON stderr (`error`, `reasonCode`, `stage`) for parser (`JULIET_CLI_ARGUMENTS_INVALID`), selector, artifact, payload, output (`JULIET_OUTPUT_ARTIFACT_WRITE_FAILED`, `JULIET_MARKDOWN_REPORT_FAILED`, `JULIET_STDOUT_JSON_WRITE_FAILED`, `JULIET_BENCHMARK_REPORT_BUILD_FAILED`), handoff (`JULIET_COMPARISON_HANDOFF_FAILED`), and run (`JULIET_BENCHMARK_EXECUTION_FAILED`) failures; unknown argparse messages collapse to `invalid Juliet arguments`, all current parser-error branches exit `2`, and stderr write failures are best-effort. Targeted structured stderr tests `9 passed in 0.05s`; `test_juliet_runner.py` `58 passed in 0.12s`; benchmark/JULIET related tests `113 passed in 0.17s`; full S4 pytest `1286 passed in 32.98s`; Critic implementation+docs review PASS.
- Standalone benchmark compare CLI structured stderr diagnostics: RED regressions proved the fixed compare failure boundaries were still plain text and that `sys.stderr.write()` `ValueError` could escape instead of returning the stable CLI exit. Final `benchmark.compare.main()` emits exact 3-key compact JSON stderr (`error`, `reasonCode`, `stage`) for parse (`BENCHMARK_COMPARE_CLI_ARGUMENTS_INVALID`), threshold (`BENCHMARK_COMPARE_THRESHOLD_INVALID`), artifact (`BENCHMARK_COMPARE_ARTIFACT_INVALID`), payload (`BENCHMARK_COMPARE_PAYLOAD_INVALID`), and report-output (`BENCHMARK_COMPARE_REPORT_FAILED`) failures; unknown argparse messages collapse to `invalid comparison arguments`, all these failures exit `2`, and stderr write failures are best-effort. Targeted structured stderr tests `6 passed in 0.05s`; `test_benchmark.py` `55 passed in 0.09s`; benchmark/JULIET related tests `112 passed in 0.18s`; full S4 pytest `1285 passed in 32.57s`; Critic implementation review PASS.
- Tool Portfolio report consumer canary `runnerIntegrityOnly` unsafe-projection fail-closed hardening: RED reproduced two S3-facing classification leaks: an otherwise-positive report with injected `QUALITY_THRESHOLDS_NON_DISCRIMINATING` reason and a runner-integrity-intent report with duplicate tool contribution projection both emitted `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` yet kept `runnerIntegrityOnly=true`. Final projection computes the underlying runner-integrity signal separately and publishes `runnerIntegrityOnly = signal && !unsafe_projection`, preserving genuine sanitized runner-integrity-only reports while failing the boolean closed for unsafe summaries. Targeted runner-integrity tests `3 passed in 0.04s`; consumer canary tests `46 passed in 0.06s`; related report/actual/consumer tests `314 passed in 0.98s`; all Tool Portfolio tests `542 passed in 1.71s`; full S4 pytest `1335 passed in 32.39s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary decision-grade completeness invariant: RED reproduced otherwise-passing reports with missing `qualityDiagnostics`, missing/empty `toolContributionDiagnostics.tools`, pass-status failure `reasonCodes`, or required follow-ups still returning `toolPortfolioDecisionGradeUsable=true`. Final projection now treats positive gates as necessary but insufficient: decision-grade usability additionally requires available diagnostic surfaces, complete current-six tool contribution rows, empty sanitized failure reasons, and empty sanitized required follow-ups; diagnostic candidate IDs remain advisory. Incomplete projected evidence on an otherwise-positive report adds canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and forces non-usable output, while already non-decision-grade/failing reports do not gain unsafe solely from completeness gaps. Targeted completeness tests `6 passed in 0.04s`; consumer canary tests `44 passed in 0.06s`; related report/actual/consumer tests `312 passed in 0.99s`; all Tool Portfolio tests `540 passed in 1.83s`; full S4 pytest `1333 passed in 32.10s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary duplicate tool-contribution identity fail-closed hardening: RED reproduced a duplicate allowlisted `semgrep` contribution row overwriting the first class, leaving `reasonCodes=[]`, and preserving decision-grade usability. Final projection treats any duplicate `toolContributionDiagnostics.tools[].toolId` as unsafe multiplicity, preserves the first observed class, ignores later duplicate rows, adds canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and forces non-decision-grade usability. Targeted duplicate test `1 passed in 0.04s`; consumer canary tests `38 passed in 0.06s`; related report/actual/consumer tests `306 passed in 0.98s`; all Tool Portfolio tests `534 passed in 1.69s`; full S4 pytest `1305 passed in 32.80s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary boolean decision-field fail-closed hardening: RED reproduced present non-bool `qualityGateAllowed` and `decisionGradeReady` values silently normalizing to false without unsafe reason evidence. Final boolean projection treats absent/`None` as compatible, preserves real `true`/`false`, rejects present non-bool values including integers without coercion/stringification, adds canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and forces non-decision-grade usability. Targeted boolean tests `2 passed in 0.03s`; consumer canary tests `37 passed in 0.06s`; related report/actual/consumer tests `305 passed in 0.99s`; all Tool Portfolio tests `533 passed in 1.70s`; full S4 pytest `1304 passed in 32.88s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary mapping/container-shape fail-closed hardening: RED reproduced present non-object map containers silently normalizing as absent: malformed gate/quality maps lacked unsafe reason evidence, and malformed diagnostic or `decisionSupport` containers could leave `toolPortfolioDecisionGradeUsable=true`. Final map projection treats absent/`None` as compatible, but present non-object containers as unsafe; malformed containers are not stringified, normalize to safe defaults, add canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force non-decision-grade usability. Targeted container tests `4 passed in 0.03s`; consumer canary tests `35 passed in 0.06s`; related report/actual/consumer tests `303 passed in 0.99s`; all Tool Portfolio tests `531 passed in 1.70s`; full S4 pytest `1302 passed in 32.78s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary scalar fail-closed hardening: RED reproduced malformed diagnostic-only scalar statuses silently normalizing to `missing` while `toolPortfolioDecisionGradeUsable` stayed true, and malformed decision-predicate scalar status normalizing to `unknown` without unsafe reason evidence. Final scalar projection treats absent/`None` as compatible, but present non-string or blank scalar values as unsafe; malformed scalars are not stringified, normalize to safe defaults, add canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and force non-decision-grade usability. Targeted scalar tests `2 passed in 0.03s`; consumer canary tests `31 passed in 0.06s`; related report/actual/consumer tests `299 passed in 1.07s`; all Tool Portfolio tests `527 passed in 1.57s`; full S4 pytest `1298 passed in 32.23s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary list-shape fail-closed hardening: RED reproduced non-list `reasonCodes` / `decisionSupport.requiredFollowUps` containers and malformed list items being silently dropped while `toolPortfolioDecisionGradeUsable` stayed true. Final string-list projection preserves absent/`None` optional fields, rejects non-list containers, preserves valid allowlisted strings in proper lists, rejects non-string list items without stringification, adds canary-generated `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, and forces non-decision-grade usability. Targeted shape tests `2 passed in 0.04s`; consumer canary tests `29 passed in 0.06s`; related report/actual/consumer tests `297 passed in 1.04s`; all Tool Portfolio tests `525 passed in 1.64s`; full S4 pytest `1296 passed in 32.58s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary summary-only reason spoofing hardening: RED reproduced a present valid report with caller-provided `TOOL_PORTFOLIO_REPORT_ABSENT` / `MALFORMED` / `SCHEMA_UNSUPPORTED` / `UNSAFE_PROJECTION` reason codes still yielding `toolPortfolioDecisionGradeUsable=true`. Final allowlist removes those canary-generated summary diagnostics from producer reason-code projection while preserving `_absent_summary()` fast paths; spoofed summary-only reasons now produce exactly `reasonCodes=["TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION"]` and force non-decision-grade usability. Targeted spoofing test `1 passed in 0.04s`; consumer canary tests `27 passed in 0.06s`; related report/actual/consumer tests `295 passed in 1.07s`; all Tool Portfolio tests `523 passed in 1.54s`; full S4 pytest `1294 passed in 32.77s`; Critic implementation+docs review PASS.
- Tool Portfolio report consumer canary structured stderr diagnostics: RED regressions proved failure stderr had only legacy `reasonCodes`/`summaryEmitted` and lacked explicit `error`, singular `reasonCode`, and `stage`. Final `_emit_cli_error()` emits exact 5-key compact JSON for input and output failures, preserves legacy fields, catches stderr `ValueError`, and does not change successful stdout summary schema. Targeted structured stderr tests `4 passed in 0.04s`; consumer canary tests `26 passed in 0.05s`; related Tool Portfolio CLI/report tests `415 passed in 1.44s`; full S4 pytest `1284 passed in 32.04s`; Critic implementation review PASS.
- Blocked metric bucket direct-helper sanitization: RED regressions reproduced `blocked_metric_bucket()` echoing raw split/reason/object values and expanding a string reason-code container into characters. Final helper allowlists split names and system top-level reason codes, emits `<invalid>` for invalid split values, adds `SYSTEM_STABILITY_GATE_INPUT_INVALID` for malformed reason input, and does not stringify arbitrary objects. Blocked-bucket tests `3 passed in 0.04s`; system-stability tests `60 passed in 0.06s`; related Tool Portfolio/readiness tests `393 passed in 1.11s`; full S4 pytest `1284 passed in 32.23s`; Critic implementation review PASS.
- System Stability direct required-tools identity sanitization: RED regressions reproduced direct `build_system_stability_gate()` echoing raw unknown required-tool strings and object `str`/`repr` output through `requiredTools` and generated preflight `toolId`. Final `_normalize_required_tools()` preserves known current-six IDs in canonical order and emits at most one `<invalid>` sentinel plus `REQUIRED_TOOL_UNKNOWN` preflight failure for unknown/blank/non-string/invalid entries, without stringifying arbitrary objects. Targeted required-tools tests `3 passed in 0.04s`; system-stability tests `57 passed in 0.08s`; related Tool Portfolio/readiness tests `390 passed in 1.10s`; full S4 pytest `1281 passed in 32.69s`; Critic implementation review PASS.
- System Stability direct execution-completeness metadata sanitization: RED regressions reproduced direct `build_system_stability_gate()` echoing raw `skipReason`, unknown status strings, secret degrade reasons/objects, and malformed count objects from execution result mappings. Final helper allowlists statuses and degrade reasons, uses safe reason-code fallback from sanitized status/degraded state, preserves only nonnegative non-bool count integers, and does not stringify arbitrary values. Targeted execution tests `22 passed in 0.05s`; system-stability tests `56 passed in 0.06s`; related Tool Portfolio/readiness tests `389 passed in 1.09s`; full S4 pytest `1280 passed in 32.06s`; Critic implementation review PASS.
- System Stability direct preflight metadata sanitization: RED regressions reproduced raw unavailable-tool `probeReason`, `version`, and `expectedExecutablePath` leakage from direct `build_system_stability_gate()` output. Final helper emits allowlisted/fallback preflight `reasonCode`, status-only `versionStatus` and `expectedExecutablePathStatus`, and report-side validation/projection accepts these status-only fields for re-ingestion. Targeted preflight tests `8 passed in 0.04s`; system-stability tests `54 passed in 0.05s`; related Tool Portfolio/readiness tests `387 passed in 1.31s`; full S4 pytest `1278 passed in 32.85s`; Critic implementation review PASS.
- Quality Gate direct-helper reason-code sanitization: RED regressions reproduced raw secret/object/number reason-code echo from direct `build_quality_gate()` system fail gates, inconsistent `pass`/`qualityGateAllowed=false` gates, and blocked external corpus/readiness inputs. Final helper allowlists system reason codes locally, reuses readiness reason-code allowlisting for external corpus blockers, never stringifies arbitrary reason objects, and emits input-invalid sentinels for malformed/unknown entries. Reason-sanitization tests `3 passed in 0.04s`; quality-gate subset `21 passed in 0.04s`; system-stability tests `52 passed in 0.05s`; related Tool Portfolio/readiness tests `385 passed in 1.10s`; full S4 pytest `1276 passed in 32.17s`; Critic implementation review PASS.
- Quality Gate eligibility invariant fail-closed hardening: RED regressions reproduced direct `build_quality_gate()` returning `eligible` when system-stability evidence was absent, malformed, or internally inconsistent (`pass` without `qualityGateAllowed=True`, unknown/malformed status, or non-pass status with allowance). Final helper gates quality eligibility on exact `status="pass"` plus `qualityGateAllowed is True`, preserves valid `not_run` harness semantics, maps absent gates to `SYSTEM_STABILITY_GATE_NOT_RUN`, and blocks malformed/inconsistent gates with `SYSTEM_STABILITY_GATE_FAILED` plus input-invalid/inconsistent reasons. Targeted invariant tests `15 passed in 0.05s`; system-stability tests `49 passed in 0.05s`; related Tool Portfolio tests `343 passed in 0.93s`; full S4 pytest `1273 passed in 30.75s`; Critic implementation review PASS.
- Corpus Acquisition CLI structured stderr diagnostics: RED regressions proved acquisition CLI input/output fixed diagnostics were still plain text and not machine-readable. Final `tool_portfolio_corpus_acquisition.py::main()` emits compact JSON stderr with exact keys `error`, `reasonCode`, and `stage` for input (`CORPUS_ACQUISITION_CLI_INPUT_INVALID`) and output (`CORPUS_ACQUISITION_CLI_OUTPUT_FAILED`) failures, preserving fixed-message substrings, broken-stderr suppression, and no-raw-echo behavior without catching acquisition/network/archive failures. Structured acquisition tests `4 passed in 0.04s`; targeted/compat acquisition CLI tests `8 passed in 0.04s`; related Tool Portfolio tests `329 passed in 1.25s`; full S4 pytest `1258 passed in 29.80s`; Critic implementation review PASS.
- Actual Tool Portfolio runner structured CLI diagnostics: RED regressions proved the fixed failure boundaries were still plain text and not machine-readable. Final `tool_portfolio_actual_runner.py::main()` emits compact JSON stderr with exact keys `error`, `reasonCode`, and `stage` for input (`ACTUAL_RUN_CLI_INPUT_INVALID`), run/report-build (`ACTUAL_RUN_FAILED`), and output (`ACTUAL_RUN_OUTPUT_WRITE_FAILED`) failures, preserving existing fixed-message substrings and broken-stderr/no-raw-leak behavior. Structured input/run/output tests `4 passed in 0.04s`; targeted/compat actual-runner CLI tests `8 passed in 0.04s`; related Tool Portfolio tests `329 passed in 1.26s`; full S4 pytest `1258 passed in 30.32s`; Critic implementation review PASS.
- Actual Tool Portfolio runner CLI report-build failure sanitization: RED regressions reproduced raw `ValueError` and `RuntimeError` escaping from `asyncio.run(build_actual_tool_portfolio_report(...))` plus a secondary broken-stderr cascade before any output write. Final `tool_portfolio_actual_runner.py::main()` wraps ordinary report-build/staging/tool/report-composition failures, emits fixed `actual run failed` / exit `1` with best-effort stderr, skips `write_experiment_report()` after failure, and preserves separate input/output/success semantics. Report-build boundary tests `2 passed in 0.04s`; targeted/compat actual-runner CLI tests `7 passed in 0.04s`; related Tool Portfolio tests `329 passed in 1.26s`; full S4 pytest `1258 passed in 31.32s`; Critic implementation review PASS.
- Actual Tool Portfolio runner CLI output-boundary sanitization: RED regressions reproduced raw `OSError` and `TypeError` escaping from `write_experiment_report(report, --output)` plus a secondary broken-stderr cascade. Final `tool_portfolio_actual_runner.py::main()` wraps only the post-build output write/serialization boundary, emits fixed `output write failed` / exit `1` with best-effort stderr, preserves fixed `input validation failed` and successful `0`/`2` semantics, and leaves report-build failures out of scope. Output-boundary tests `3 passed in 0.04s`; targeted/compat actual-runner CLI tests `5 passed in 0.04s`; related Tool Portfolio tests `327 passed in 1.24s`; full S4 pytest `1256 passed in 30.66s`; Critic implementation review PASS.
- Juliet benchmark CLI argparse-boundary sanitization: RED regressions reproduced raw argparse `SystemExit`, usage, required/unrecognized/expected-one-argument diagnostics, and secret flag/path echo for missing required args, unknown args, and missing `--cwes` values. Final `juliet_runner.py::main()` uses a fixed-diagnostic parser that maps non-allowlisted parse-shape failures to `invalid Juliet arguments` / exit `2`, keeps stdout empty, prevents benchmark/output/baseline side effects, and preserves allowlisted post-parse fixed diagnostics. Parser-boundary tests `3 passed in 0.04s`; targeted/compat Juliet CLI tests `10 passed in 0.05s`; benchmark/JULIET related tests `111 passed in 0.16s`; full S4 pytest `1253 passed in 30.99s`; Critic implementation review PASS.
- Tool Portfolio report consumer canary CLI output-boundary sanitization: RED regressions reproduced raw stdout `OSError` from `sys.stdout.write()` and raw summary serialization `TypeError` from `json.dumps(summary)`. Final CLI wraps summary serialization/stdout write, returns exit `1` with fixed stderr JSON `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` and `summaryEmitted=false` when no summary is emitted, and makes stderr error emission best-effort. Targeted/compat CLI tests `5 passed in 0.04s`; related report/consumer tests `266 passed in 0.82s`; full S4 pytest `1233 passed in 29.82s`; Critic implementation review PASS.
- Juliet benchmark CLI stdout JSON separator failure sanitization: RED regression reproduced the no-output separator `print()` before report JSON escaping as raw `OSError` after markdown output. Final `_emit_cli_stdout_json()` owns the separator newline plus JSON serialization/print boundary, maps expected failures to fixed `stdout JSON write failed`, emits no JSON markers, and skips baseline compare handoff. Targeted stdout tests `2 passed in 0.04s`; benchmark/JULIET related tests `105 passed in 0.16s`; full S4 pytest `1231 passed in 30.44s`; Critic implementation review PASS.
- CLI artifact preflight filesystem-probe failure sanitization: RED regressions reproduced raw `OSError` leakage from standalone compare `Path.is_file()`, Juliet baseline `Path.is_file()`, Juliet output `Path.exists()`, and Juliet output-parent `Path.exists()` probes. Final preflight helpers catch only `OSError`/`ValueError`, map failures to fixed `invalid comparison artifact`, `invalid baseline artifact`, or `invalid output artifact`, and tests prove no benchmark/load/write/markdown/stdout/compare side effects plus no raw traceback/exception/path echo. Targeted probe tests `4 passed in 0.13s`; benchmark/JULIET related tests `104 passed in 0.15s`; full S4 pytest `1230 passed in 31.06s`; Critic implementation review PASS.
- Comparison payload nested-shape validation: RED regressions reproduced standalone compare raw `AttributeError` for `summary` arrays, raw `TypeError` for non-numeric `combined.recall`, NaN fail-open regression scoring, and Juliet `--baseline` benchmark side effects followed by raw compare handoff leakage; final centralized `benchmark.compare.is_comparison_payload_shape()` validates top-level/summary/results/combined structures, string result keys, and finite non-bool metric fields at CLI boundaries. Standalone compare uses fixed `invalid comparison artifact payload`; Juliet baseline uses fixed `invalid baseline artifact payload`; `compare()`/`compare_from_files()` programmatic semantics are unchanged. Targeted regressions `4 passed in 0.09s`; focused compare/JULIET CLI tests `16 passed in 0.06s`; benchmark/JULIET related tests `85 passed in 0.16s`; full S4 pytest `1202 passed in 39.34s`; Critic implementation review PASS.
- Juliet benchmark CLI stdout JSON serialization failure sanitization: RED regression reproduced no-output `print(json.dumps(output_data, ...))` leaking raw `TypeError` with a secret-named non-serializable result field; final `juliet_runner.py::main()` routes no-output report JSON through `_emit_cli_stdout_json()`, converts serialization/print failures to fixed `stdout JSON write failed`, proves benchmark may run once and markdown may emit but JSON markers and `compare_from_files()` are suppressed after failure, and leaves file-output behavior untouched. Targeted regression `1 passed in 0.04s`; focused stdout/output/baseline tests `5 passed in 0.04s`; benchmark/JULIET related tests `81 passed in 0.13s`; full S4 pytest `1198 passed in 31.31s`; Critic implementation review PASS.
- Juliet benchmark CLI output write failure sanitization: RED regressions reproduced raw `OSError` leakage from `output_path.parent.mkdir(...)` and `output_path.write_text(...)`; final `juliet_runner.py::main()` routes output writes through `_write_cli_output_artifact()`, converts parent creation/write failures to fixed `output artifact write failed`, leaves output shape preflight as `invalid output artifact`, proves benchmark may run once but stdout JSON and `compare_from_files()` are suppressed after write failure, and preserves successful output overwrite behavior. Targeted regressions `2 passed in 0.04s`; focused Juliet baseline/output CLI tests `6 passed in 0.04s`; benchmark/JULIET related tests `80 passed in 0.12s`; full S4 pytest `1197 passed in 30.80s`; Critic implementation review PASS.
- Juliet benchmark CLI baseline payload validation: RED regressions reproduced malformed/non-object `--baseline` payloads running the benchmark and then leaking raw `JSONDecodeError`/`AttributeError` path/content through `compare_from_files()`; final `juliet_runner.py::main()` preflight order is scalar parse → baseline artifact → output artifact → baseline payload → benchmark execution, invalid payloads use fixed `invalid baseline artifact payload`, fake benchmark/output side effects are skipped, and valid baselines still pass the original `Path` to compare handoff. Targeted regressions `3 passed in 0.04s`; baseline/output focused Juliet CLI tests `8 passed in 0.04s`; benchmark/JULIET related tests `78 passed in 0.12s`; full S4 pytest `1195 passed in 31.65s`; Critic implementation review PASS.
- Benchmark compare CLI JSON payload validation: RED regressions reproduced malformed baseline raw `JSONDecodeError` content leakage and non-object current payload `AttributeError` path/content leakage; final standalone `benchmark.compare.main()` loads baseline/current artifacts through CLI-only `_load_cli_result()` after threshold/artifact preflight, converts read/decode/JSON/type/top-level non-object failures into fixed `invalid comparison artifact payload`, and leaves programmatic `_load_result()`/`compare_from_files()` semantics unchanged. Targeted payload regressions `2 passed in 0.03s`; compare CLI focused tests `11 passed in 0.04s`; benchmark/JULIET related tests `75 passed in 0.16s`; full S4 pytest `1192 passed in 30.57s`; Critic implementation review PASS.
- Benchmark compare CLI threshold fail-closed validation: RED regressions reproduced raw argparse secret threshold leakage, `NaN` fail-open, and out-of-range `0`/`-0.1`/`1.1` fail-open or wrong-exit behavior; final standalone `benchmark.compare.main()` parses `--threshold` through a fixed validator before artifact validation/loading, rejects blank/non-numeric/non-finite/non-positive/>1.0 values with fixed `invalid threshold selection`, proves invalid threshold fails before `_load_result()`, and preserves valid threshold regression exit semantics. Targeted regressions `6 passed in 0.04s`; benchmark/JULIET related tests `73 passed in 0.11s`; full S4 pytest `1190 passed in 30.40s`; Critic implementation review PASS.
- Benchmark compare CLI artifact preflight validation: RED regressions reproduced missing baseline and directory current raw `FileNotFoundError`/`IsADirectoryError` surfaces leaking secret comparison paths; final standalone `benchmark.compare.main()` preflights `--baseline`/`--current` with `Path.is_file()` before `_load_result()`, exits `2` with fixed `invalid comparison artifact` for invalid artifacts, preserves valid comparison behavior, and relies on sanitized markdown labels for stdout. Targeted regressions `3 passed in 0.03s`; benchmark/JULIET related tests `67 passed in 0.10s`; full S4 pytest `1184 passed in 30.45s`; Critic implementation review PASS.
- Juliet benchmark CLI output artifact preflight validation: RED regressions reproduced directory output and parent-is-file output paths raising raw `IsADirectoryError`/`FileExistsError` with secret paths after benchmark side effects; final CLI preflights `--output` before benchmark execution/output writes, exits `2` with fixed `invalid output artifact` for invalid output artifacts, preserves missing-parent creation and regular-file overwrite compatibility, and uses the validated path for compare handoff. Targeted regressions `3 passed in 0.04s`; benchmark/JULIET related tests `64 passed in 0.10s`; full S4 pytest `1181 passed in 30.56s`; Critic implementation review PASS.
- Juliet benchmark CLI baseline artifact preflight validation: RED regressions reproduced missing/directory `--baseline` artifacts raising raw `FileNotFoundError`/`IsADirectoryError` with secret paths after benchmark side effects; final CLI preflights the baseline with `Path.is_file()` before benchmark execution/output writes, exits `2` with fixed `invalid baseline artifact` for invalid paths, and preserves valid real `Path` handoff to compare logic. Targeted regressions `3 passed in 0.04s`; benchmark/JULIET related tests `61 passed in 0.09s`; full S4 pytest `1178 passed in 30.16s`; Critic implementation review PASS.
- Juliet benchmark CLI timeout selector fail-closed validation: RED regressions reproduced argparse raw `invalid int value` echoing a secret `--timeout` token and non-positive timeout values entering benchmark execution; final CLI parsing accepts only positive decimal seconds, exits `2` with fixed `invalid timeout selection` before benchmark execution/output writes for invalid values, and preserves valid/default timeout behavior. Targeted regressions `4 passed in 0.04s`; benchmark/JULIET related tests `58 passed in 0.09s`; full S4 pytest `1175 passed in 30.36s`; Critic implementation review PASS.
- Juliet benchmark CLI variant selector fail-closed validation: RED regressions reproduced invalid/blank `--variant-filter` selectors entering benchmark execution and raw whitespace variant labels reaching report JSON; final CLI parsing trims and normalizes the selector, maps `all` to execution `None`/report `all`, preserves positive decimal variant IDs, and exits `2` with fixed `invalid variant selection` before benchmark execution/output writes for invalid values. Targeted regressions `4 passed in 0.04s`; benchmark/JULIET related tests `54 passed in 0.08s`; full S4 pytest `1171 passed in 29.63s`; Critic implementation review PASS.
- Juliet benchmark CLI CWE selector fail-closed validation: RED regressions reproduced manual `int(c.strip())` raising raw `ValueError` for secret and blank `--cwes` selector segments before the deterministic benchmark input contract; final CLI parsing exits `2` with fixed `invalid CWE selection` before benchmark execution/output writes, suppresses raw selector/error echo, and preserves arbitrary positive integer CWE IDs. Targeted regressions `3 passed in 0.03s`; benchmark/JULIET related tests `50 passed in 0.08s`; full S4 pytest `1167 passed in 30.43s`; Critic implementation review PASS.
- Standalone compare CLI markdown report failure sanitization: RED regression reproduced `benchmark.compare.main()` leaking raw `ValueError` secret text from a failing `report.to_markdown()` before regression evaluation. Final standalone compare CLI wraps markdown rendering/printing, maps expected failures to fixed `comparison report failed`, avoids raw traceback/type/path echo, skips `has_regression()` after report failure, and leaves programmatic `ComparisonReport.to_markdown()` / `compare_from_files()` unchanged. Targeted compare markdown tests `3 passed in 0.03s`; focused compare tests `23 passed, 27 deselected in 0.06s`; benchmark/JULIET related tests `100 passed in 0.15s`; full S4 pytest `1226 passed in 29.63s`; Critic implementation review PASS.
- Juliet benchmark CLI numeric selector conversion failure sanitization: RED regressions reproduced oversized decimal selectors (`'9' * 5000`) escaping as raw Python digit-limit `ValueError` tracebacks for `--cwes`, `--variant-filter`, and `--timeout`. Final CLI centralizes positive-decimal parsing, catches `ValueError`/`OverflowError`, maps failures to existing fixed selector diagnostics, avoids benchmark/output side effects, and preserves valid selector semantics without adding upper bounds. Targeted oversized+valid selector tests `6 passed in 0.04s`; focused selector tests `11 passed, 39 deselected in 0.04s`; benchmark/JULIET related tests `99 passed in 0.14s`; full S4 pytest `1225 passed in 30.01s`; Critic implementation review PASS.
- Comparison payload canonical CWE key validation: RED regressions reproduced standalone compare printing `SECRET_CWE_KEY_SHOULD_NOT_LEAK` from a caller-controlled `results` key and Juliet `--baseline` executing benchmark/compare before printing `SECRET_BASELINE_CWE_KEY_SHOULD_NOT_LEAK`. Final CLI preflight requires result keys to match `CWE-<positive integer>`, rejects arbitrary/lowercase/signed/zero labels without normalization, preserves empty-results and generated-key compatibility, and keeps programmatic compare helpers unchanged. Targeted key tests `3 passed in 0.04s`; focused payload/key/range tests `9 passed, 87 deselected in 0.06s`; benchmark/JULIET related tests `96 passed in 0.14s`; full S4 pytest `1222 passed in 29.55s`; Critic implementation review PASS.
- Comparison metric semantic range validation: RED regressions reproduced standalone compare accepting `summary.overallRecall=1.5`, converting negative `combined.recall`/negative noise densities into regression exit `1`, and Juliet `--baseline` executing benchmark/compare against out-of-range metrics. Final CLI preflight requires recall metrics to be probabilities in `[0.0, 1.0]`, optional `noisePerFile`/`targetedNoisePerFile` to be non-negative finite numbers, preserves empty-results and boundary-value compatibility, and keeps programmatic compare helpers unchanged. Targeted range tests `6 passed in 0.05s`; focused payload/range tests `8 passed, 85 deselected in 0.05s`; benchmark/JULIET related tests `93 passed in 0.13s`; full S4 pytest `1219 passed in 29.87s`; Critic implementation review PASS.
- Juliet benchmark CLI output-data construction failure sanitization: RED regressions reproduced `result.to_dict()` raising raw `ValueError` with secret text and returning a non-mapping list that produced raw `TypeError` before any output/markdown/compare boundary. Final CLI builds report payload through a fixed boundary, requires mapping-shaped result data, maps expected construction failures to `benchmark report build failed`, emits no output/markdown/stdout/compare side effects, and preserves successful output shape. Targeted output-data tests `3 passed in 0.04s`; focused CLI boundary tests `11 passed, 34 deselected in 0.05s`; benchmark/JULIET related tests `87 passed in 0.13s`; full S4 pytest `1213 passed in 29.65s`; Critic implementation review PASS.
- Juliet benchmark CLI markdown report failure sanitization: RED regression reproduced `result.to_markdown()` raising raw `ValueError` with secret text after output JSON was already written. Final CLI wraps markdown rendering/printing, maps expected render/write failures to fixed `markdown report failed`, preserves already-written output JSON, emits no stdout report/JSON markers, and skips downstream baseline compare handoff. Targeted markdown tests `2 passed in 0.04s`; focused CLI output-boundary tests `10 passed, 33 deselected in 0.05s`; benchmark/JULIET related tests `85 passed in 0.13s`; full S4 pytest `1211 passed in 30.16s`; Critic implementation review PASS.
- Juliet benchmark CLI benchmark execution/setup failure sanitization: RED regressions reproduced missing `testcases/` and synthetic `run_benchmark()` `ValueError` escaping Juliet CLI as raw tracebacks with secret root/error material. Final CLI wraps top-level benchmark execution, maps expected escaped setup/execution failures to fixed `benchmark execution failed`, emits no stdout report/JSON markers, writes no output artifact, and leaves programmatic `run_benchmark()` plus per-CWE scan-failure semantics unchanged. Targeted benchmark-failure tests `2 passed in 0.04s`; focused Juliet boundary tests `8 passed, 34 deselected in 0.05s`; benchmark/JULIET related tests `84 passed in 0.13s`; full S4 pytest `1210 passed in 31.21s`; Critic implementation review PASS.
- Juliet benchmark CLI compare handoff failure sanitization: RED regression reproduced `compare_from_files()` raising raw `OSError` with secret text after output write and markdown emission. Final Juliet CLI wraps the late baseline comparison handoff, maps expected handoff failures to fixed `comparison handoff failed`, preserves successfully written output JSON, and keeps successful `compare_from_files()` argument behavior unchanged. Targeted compare-handoff tests `2 passed in 0.04s`; focused baseline/output/stdout tests `12 passed, 28 deselected in 0.05s`; benchmark/JULIET related tests `82 passed in 0.12s`; full S4 pytest `1208 passed in 32.00s`; Critic implementation review PASS.
- Comparison artifact required-schema validation: RED regressions reproduced standalone compare accepting `{}` as a baseline, missing per-CWE `combined.recall` being converted into regression exit `1`, and Juliet `--baseline {}` executing benchmark/output/compare side effects. Final CLI preflight requires top-level `summary`/`results`, `summary.overallRecall`, per-CWE `combined`, and per-CWE `combined.recall`, while preserving empty `results: {}` compatibility and programmatic compare permissiveness. Targeted required-schema tests `4 passed in 0.04s`; focused payload/baseline tests `9 passed, 72 deselected in 0.06s`; benchmark/JULIET related tests `81 passed in 0.12s`; full S4 pytest `1207 passed in 30.76s`; Critic implementation review PASS.
- Juliet benchmark CLI duplicate tool selector validation: RED regression reproduced `--tools semgrep,semgrep` entering benchmark execution and producing report/output side effects; final CLI parsing rejects duplicate current-six selectors with fixed `invalid tool selection` before benchmark execution/output writes, suppresses raw duplicate selector/output-path echo, and preserves valid unique subset order. Targeted duplicate+valid tests `2 passed in 0.04s`; focused tool-selector tests `4 passed, 34 deselected in 0.04s`; benchmark/JULIET related tests `77 passed in 0.15s`; full S4 pytest `1203 passed in 34.28s`; Critic implementation review PASS.
- Juliet benchmark CLI tool selector fail-closed validation: RED regressions reproduced `--tools` unknown/blank selectors entering benchmark execution and blank selectors leaking into report JSON; final CLI parsing validates against the module-local current-six allowlist, exits `2` with fixed `invalid tool selection` before benchmark execution/output writes, and preserves valid current-six subset order. Targeted regressions `3 passed in 0.03s`; benchmark/JULIET related tests `47 passed in 0.07s`; full S4 pytest `1164 passed in 30.90s`; Critic implementation review PASS.
- Juliet benchmark CLI report/log path redaction: RED regressions reproduced caller-provided `--juliet-path` leakage through stdout/written JSON and caller-provided `--output` leakage through save logs; final CLI report JSON emits the historical `julietPath="<JULIET_ROOT>/C"` placeholder and save logs use fixed value-free status while preserving real benchmark input and requested output-file writes. Targeted regressions `2 passed in 0.03s`; benchmark/JULIET related tests `44 passed in 0.07s`; full S4 pytest `1161 passed in 30.48s`; Critic implementation review PASS.
- Benchmark compare markdown path-label redaction: RED regression reproduced caller-provided baseline/current comparison path leakage in `ComparisonReport.to_markdown()` (`SECRET_BASELINE_PATH_SHOULD_NOT_LEAK`, `SECRET_CURRENT_PATH_SHOULD_NOT_LEAK`); final markdown uses fixed role labels (`baseline artifact` / `current artifact`) while preserving internal `baseline_path`/`current_path`, scoring, regression detection, and `(current run)` convenience output. Targeted regression `1 passed in 0.03s`; benchmark/JULIET related tests `42 passed in 0.07s`; full S4 pytest `1159 passed in 30.30s`; Critic implementation review PASS.
- Juliet benchmark start-log variant filter redaction: RED regression reproduced caller-provided `variant_filter` leakage from `run_benchmark()` start logs (`SECRET_VARIANT_FILTER_SHOULD_NOT_LEAK`); final start log emits only `variantSelection=all|filtered`, while preserving discovery input and scoring semantics. Targeted regression `1 passed in 0.03s`; benchmark/JULIET related tests `41 passed in 0.07s`; full S4 pytest `1158 passed in 30.13s`; Critic implementation review PASS.
- Juliet benchmark start-log tool selector redaction: RED regression reproduced caller-provided `tools[]` selector leakage from `run_benchmark()` start logs (`SECRET_TOOL_SELECTOR_SHOULD_NOT_LEAK`); final start log emits only `toolSelection=all|custom` and `toolCount`, while preserving actual tool execution inputs and scoring semantics. Targeted regression `1 passed in 0.03s`; benchmark/JULIET related tests `40 passed in 0.07s`; full S4 pytest `1157 passed in 30.79s`; Critic implementation review PASS.
- Benchmark report `cweName` serialization sanitization: RED regressions reproduced `CWEMetrics.to_dict()` echoing secret corpus/caller `cwe_name` values for both known and unknown CWE rows; final serialization emits allowlisted tracked-CWE display names or the stable CWE id fallback, while preserving internal `CWEMetrics.cwe_name` and scoring semantics. Targeted regressions `2 passed in 0.03s`; benchmark/JULIET related tests `39 passed in 0.07s`; full S4 pytest `1156 passed in 30.63s`; Critic implementation review PASS.
- Juliet benchmark suite progress log redaction: RED regression reproduced corpus-derived CWE directory suffix leakage from `run_benchmark()` per-suite logs (`--- CWE-121 (SECRET_CWE_DIR_SUFFIX_SHOULD_NOT_LEAK): ...`); final progress log emits only stable CWE key and file count while preserving `CWEMetrics.cwe_name` and benchmark result semantics. Targeted regression `1 passed in 0.03s`; Juliet/benchmark related tests `37 passed in 0.06s`; full S4 pytest `1154 passed in 30.49s`; Critic implementation review PASS.
- Juliet benchmark custom-rules setting restoration: RED regressions reproduced `run_benchmark(custom_rules=false)` leaving `settings.custom_rules_dir=None` after no-suite early return and missing-`testcases` discovery exception; final benchmark runner restores the original setting in `finally` while preserving empty-result and exception semantics. Targeted regressions `2 passed in 0.03s`; Juliet/benchmark related tests `36 passed in 0.06s`; full S4 pytest `1153 passed in 30.80s`; Critic implementation review PASS.
- Juliet benchmark no-suite log path redaction: RED regression reproduced host-local Juliet root leakage when `run_benchmark()` saw an existing `testcases/` tree but no matching CWE/variant suite; final no-suite branch logs fixed `No Juliet test suites found for benchmark selection` and preserves empty `BenchmarkResult()`/no-orchestrator behavior. Targeted regression `1 passed in 0.03s`; Juliet/benchmark related tests `34 passed in 0.06s`; full S4 pytest `1151 passed in 30.34s`; Critic implementation review PASS.
- Durable ownership request-id conflict error-envelope standardization: RED regression reproduced bare `REQUEST_ID_CONFLICT` durable ownership conflict without `success`/`errorDetail`; final conflict branch preserves HTTP 409 and existing public routing fields (`error`, `requestId`, `existingEndpoint`, `requestedEndpoint`, `statusUrl`, `resultUrl`) while adding `success=false`, `errorDetail.code="REQUEST_ID_CONFLICT"`, fixed message `request id already belongs to another endpoint`, `requestId`, and `retryable=false`. Targeted regression `1 passed in 0.05s`; request ownership + scan endpoint tests `113 passed in 20.45s`; full S4 pytest `1150 passed in 30.49s`; Critic implementation review PASS.
- Durable ownership missing/expired error-envelope standardization: RED regressions reproduced bare `REQUEST_NOT_FOUND`/`REQUEST_EXPIRED` durable ownership errors without `success`/`errorDetail`; final helper preserves top-level `error`/`requestId` and HTTP 404/410 while adding `success=false`, `errorDetail.code`, fixed message (`request not found` / `request expired`), `requestId`, and `retryable=false` for `get_status`, `get_result`, and `cancel` missing/expired branches. Targeted regressions `2 passed in 0.05s`; request ownership + scan endpoint tests `113 passed in 20.36s`; full S4 pytest `1150 passed in 30.32s`; Critic implementation review PASS.
- Direct preflight 400 error-shape standardization: RED regressions reproduced bare direct validation responses without `success`/`errorDetail` for representative `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` branches. Final helper preserves exact legacy `error` strings and HTTP 400 while adding `success=false`, stable codes (`PROJECT_PATH_REQUIRED`, `PROJECT_PATH_NOT_FOUND`, `BUILD_COMMAND_REQUIRED`), `requestId`, and `retryable=false`. Targeted regressions `6 passed in 0.04s`; scan endpoint suite `103 passed in 17.08s`; full S4 pytest `1150 passed in 30.61s`; Critic implementation review PASS.
- Request-validation `loc` context-aware map-key redaction: RED regressions reproduced safe-looking caller keys leaking through sanitized 422 loc (`buildEnvironment.environment`, `buildProfile.defines.compiler`). Final sanitizer walks raw loc parts, treats string segments immediately after mapping fields (`buildEnvironment`, `build_environment`, `defines`, `environment`) as dynamic keys, emits `<field>`, and otherwise preserves known schema/transport names plus integer indices. Targeted regressions `4 passed in 0.04s`; related scan endpoint/startup tests `105 passed in 17.13s`; full S4 pytest `1150 passed in 30.06s`; Critic implementation review PASS.
- Request-validation `loc` dynamic-key redaction: RED regression reproduced a caller-controlled `buildEnvironment` key leaking through sanitized 422 `validationErrors[0].loc`; final handler allowlists known schema/transport aliases plus Python field names, preserves integer indices, and converts all other string loc parts to `<field>`, while existing raw-body 422 regression still locks useful `["body", "files", 0, "content"]` structural loc. Targeted regressions `2 passed in 0.04s`; related scan endpoint/startup tests `103 passed in 17.04s`; full S4 pytest `1148 passed in 30.36s`; Critic implementation review PASS.
- FastAPI/Pydantic 422 request-validation error redaction: RED regression reproduced raw nested request-body secret leakage through default FastAPI `detail[0].input` before S4 router/domain handlers executed; final global `RequestValidationError` handler preserves HTTP 422 and request-id propagation while returning fixed `REQUEST_VALIDATION_FAILED` / `request validation failed` plus sanitized structural `validationErrors[]` (`type`, safe `loc`, fixed `msg`) and no `input`/`ctx`/`url` or raw-value logging. Targeted regression `1 passed in 0.04s`; related scan endpoint/router logging/startup tests `103 passed in 17.32s`; full S4 pytest `1147 passed in 30.79s`; Critic implementation review PASS.
- Public `SCAN_TOOL_INVALID` unknown tool-id redaction: RED regressions reproduced raw secret unknown tool IDs in sync `/v1/scan` domain-error JSON/logs, NDJSON validation JSON, and `/v1/build-and-analyze` pre-build validation response; final implementation keeps `SCAN_TOOL_INVALID` / HTTP 400 / `retryable=false` and early build/tool stop semantics while replacing unknown ID interpolation with fixed allowed-current-six guidance. Targeted regressions `3 passed in 0.77s`; related scan endpoint/sdk/orchestrator tests `185 passed in 19.91s`; full S4 pytest `1146 passed in 30.61s`; Critic implementation review PASS.
- Public `SDK_NOT_FOUND` sdkId redaction: RED regressions reproduced raw secret SDK identifiers in sync `/v1/scan` domain-error JSON/logs, NDJSON validation JSON, and `/v1/build-and-analyze` pre-build validation response; final implementation keeps `SDK_NOT_FOUND` / HTTP 400 / `retryable=false` and early build/tool stop semantics while replacing the message with fixed guidance that does not echo the submitted `sdkId`. Targeted regressions `5 passed in 1.65s`; related scan endpoint/sdk/orchestrator tests `184 passed in 19.15s`; full S4 pytest `1145 passed in 29.57s`; Critic implementation review PASS.
- Router structured-log SDK identity redaction: RED static guard reproduced raw `sdkId` logger extras in `Scan started` and `Scan execution summary`; runtime caplog regression arranged a registered secret SDK id and verified scan-start/summary logs expose only `sdkIdProvided`/`executionSdkIdProvided` booleans with no raw secret in log text or record dictionaries. Targeted regressions `2 passed in 0.15s`; related scan router/endpoint/sdk/orchestrator tests `185 passed in 17.81s`; full S4 pytest `1145 passed in 28.32s`; Critic implementation review PASS.
- Public finding/dataFlow external absolute path redaction: RED regressions covered retained cross-boundary findings leaking raw external SDK/system roots through `location.file`, `dataFlow[].file`, and enriched `metadata.evidenceResolution.location.file`. Final implementation preserves raw parser paths through `_filter_user_code_findings()` for SDK/system-noise and cross-boundary classification, then projects public findings to scan-root-relative paths or `<external>/<basename>`/`<external>/<unknown>` before evidence enrichment. Targeted regressions `2 passed in 0.03s`; related orchestrator/parser/endpoint/static-evidence tests `268 passed in 15.22s`; full S4 pytest `1144 passed in 28.47s`; Critic implementation review PASS.
- `/v1/includes` dependency path public evidence redaction: RED regressions reproduced raw absolute include dependency leakage from resolver parsing and the public endpoint path (`/tmp/SECRET_INCLUDE_ROOT/...`). Final include evidence preserves `includes[source]=string[]`, converts scan-root-contained absolute dependencies to relative paths, and converts external absolute host/SDK/system dependencies to `<external>/<basename>` or `<external>/<unknown>` without changing resolver execution. Targeted regressions `12 passed in 0.05s`; related include/scan endpoint/static-evidence tests `143 passed in 15.02s`; full S4 pytest `1142 passed in 28.74s`; Critic implementation review PASS.
- SDK execution-report root-path public evidence redaction: RED regressions reproduced non-registered `sdkDescriptor.sdkRootPath` leakage through `execution.sdk` producer and `/v1/scan` serialized response; final public evidence keeps `sdkRootPath` nullable/omitted and adds status-only `sdkRootPathStatus=configured|not-configured` while preserving internal descriptor-based SDK resolution. Targeted regressions `2 passed in 1.40s`; related orchestrator/sdk contract/scan endpoint/sdk resolver/static-evidence tests `254 passed in 17.73s`; full S4 pytest `1136 passed in 28.63s`; Critic implementation review PASS.
- New experiment harness focused gate after Critic-blocker fixes: `32 passed` within the focused suite; final matcher/manifest/report regression subset `23 passed in 0.07s`.
- Experiment harness + existing S4 governance/static-evidence focused gate after Critic-blocker fixes: `121 passed in 0.27s`.
- Full S4 pytest gate after Critic-blocker fixes: `548 passed in 13.09s`.
- Local Quality Gate threshold/oracle focused report tests: `7 passed in 0.08s`.
- Tool-portfolio experiment/system-gate focused suite after local Quality Gate hardening: `64 passed in 0.12s`.
- Full S4 pytest gate after local Quality Gate hardening: `642 passed in 25.47s`.
- Corpus Readiness Gate v1 focused tests: `6 passed`.
- Tool-portfolio experiment/system-gate focused suite after corpus readiness integration: `70 passed in 0.12s`.
- Full S4 pytest gate after corpus readiness integration: `648 passed in 24.66s`.
- Critic final implementation review: PASS; no blocker remained before this wiki update.
- Corpus Readiness Gate CLI/fail-closed hardening: focused readiness tests `9 passed in 0.06s`; tool-portfolio experiment/system-gate focused suite `73 passed in 0.14s`; full S4 pytest `651 passed in 24.43s`; Critic implementation review PASS.
- Corpus readiness authoritative report merge hardening: readiness/report focused tests `19 passed in 0.08s`; tool-portfolio experiment/system-gate focused suite `76 passed in 0.12s`; full S4 pytest `654 passed in 23.96s`; Critic blocker correction re-review PASS.
- System Stability Gate required-tools fail-closed hardening: system-stability focused tests `33 passed in 0.04s`; tool-portfolio experiment/system-gate focused suite `79 passed in 0.13s`; full S4 pytest `657 passed in 23.89s`; Critic implementation review PASS.
- System Stability Gate `not_run` decision-grade hardening: experiment-report/system-stability focused tests `43 passed in 0.09s`; tool-portfolio experiment/system-gate focused suite `80 passed in 0.14s`; full S4 pytest `658 passed in 24.44s`; Critic implementation review PASS.
- System Stability Gate `qualityGateAllowed` invariant hardening: experiment-report/system-stability focused tests `44 passed in 0.09s`; tool-portfolio experiment/system-gate focused suite `81 passed in 0.13s`; harness artifact regenerated and matched builder with `qualityGateAllowed=false`; full S4 pytest `659 passed in 23.36s`; Critic implementation review PASS.
- Local Quality Gate `requiredSplits` fail-closed hardening: experiment-report focused tests `12 passed in 0.08s`; experiment-report/system-stability focused tests `46 passed in 0.09s`; tool-portfolio experiment/system-gate focused suite `83 passed in 0.14s`; full S4 pytest `661 passed in 23.39s`; Critic implementation review PASS.
- Local Quality Gate threshold-criteria fail-closed hardening: experiment-report focused tests `13 passed in 0.08s`; experiment-report/system-stability focused tests `47 passed in 0.10s`; tool-portfolio experiment/system-gate focused suite `84 passed in 0.13s`; full S4 pytest `662 passed in 23.92s`; Critic implementation review PASS.
- Local Quality Gate threshold-value validation hardening: experiment-report focused tests `17 passed in 0.09s`; experiment-report/system-stability focused tests `51 passed in 0.11s`; tool-portfolio experiment/system-gate focused suite `88 passed in 0.16s`; full S4 pytest `666 passed in 24.50s`; Critic implementation review PASS.
- Local Quality Gate primary-tool-set config validation hardening: experiment-report focused tests `23 passed in 0.10s`; experiment-report/system-stability focused tests `57 passed in 0.12s`; tool-portfolio experiment/system-gate focused suite `94 passed in 0.17s`; full S4 pytest `672 passed in 24.34s`; Critic implementation review PASS.
- System Stability Gate consistency validation hardening: experiment-report focused tests `26 passed in 0.12s`; experiment-report/system-stability focused tests `60 passed in 0.13s`; tool-portfolio experiment/system-gate focused suite `97 passed in 0.19s`; full S4 pytest `675 passed in 25.11s`; Critic implementation review PASS.
- Corpus Readiness Gate consistency validation hardening: experiment-report focused tests `29 passed in 0.12s`; experiment-report/corpus-readiness/system-stability focused tests `74 passed in 0.17s`; tool-portfolio experiment/system-gate focused suite `101 passed in 0.20s`; full S4 pytest `681 passed in 24.90s`; Critic implementation review PASS.
- Local Quality Gate thresholds payload shape validation hardening: experiment-report focused tests `33 passed in 0.13s`; experiment-report/corpus-readiness/system-stability focused tests `78 passed in 0.17s`; tool-portfolio experiment/system-gate focused suite `105 passed in 0.21s`; full S4 pytest `687 passed in 24.88s`; Critic implementation review PASS.
- Oracle matchingPolicy payload shape validation hardening: experiment-report focused tests `37 passed in 0.14s`; experiment-report/corpus-readiness/system-stability focused tests `82 passed in 0.17s`; tool-portfolio experiment/system-gate focused suite `109 passed in 0.22s`; full S4 pytest `691 passed in 24.85s`; Critic implementation review PASS.
- findings_by_config payload and element shape validation hardening: experiment-report focused tests `48 passed in 0.17s`; experiment-report/corpus-readiness/system-stability focused tests `93 passed in 0.21s`; tool-portfolio experiment/system-gate focused suite `121 passed in 0.24s`; full S4 pytest `706 passed in 25.62s`; Critic implementation re-review PASS after missing-required-config blocker fix.
- System Stability Gate payload/nested phase validation hardening: RED regressions reproduced malformed pass-phase fail-open and malformed inconsistent non-pass crash; final report tests `73 passed in 0.25s`; experiment-report/corpus-readiness/system-stability focused tests `118 passed in 0.29s`; tool-portfolio focused suite `146 passed in 0.30s`; full S4 pytest `731 passed in 26.11s`; Critic final re-review PASS.
- Corpus Readiness Gate payload/proof validation hardening: RED regressions reproduced explicit malformed payload default/crash, forged available proof, missing required-corpus case binding, suppressed non-available projection blockers, available-with-reasonCodes bypass, malformed external reasonCodes/acquisitionIds, and multi-corpus projection overvalidation; final report tests `107 passed in 0.33s`; experiment-report/corpus-readiness/system-stability focused tests `152 passed in 0.37s`; tool-portfolio focused suite `180 passed in 0.42s`; full S4 pytest `765 passed in 25.63s`; Critic final re-review PASS.
- Legacy external_corpus_status authority separation: available readiness with unrelated legacy blocked context no longer overblocks final quality or requiredFollowUps; report tests `108 passed in 0.33s`; experiment-report/corpus-readiness/system-stability focused tests `153 passed in 0.37s`; tool-portfolio focused suite `181 passed in 0.41s`; full S4 pytest `766 passed in 25.52s`; Critic implementation review PASS.
- Legacy external_corpus_status context sanitation hardening: RED regressions reproduced reserved `requiredCorpusReadiness` context leakage, nested forbidden-key crash/leakage, malformed legacy status entries, and invalid-status raw value echo; final targeted legacy-context tests `7 passed in 0.07s`; experiment-report tests `123 passed in 0.40s`; experiment-report/corpus-readiness/system-stability focused tests `168 passed in 0.44s`; tool-portfolio focused suite `197 passed in 0.61s`; full S4 pytest `781 passed in 25.68s`; Critic blocker re-review PASS.
- Report identity/provenance input validation hardening: RED regressions reproduced unchecked `runId`/`createdAt` passthrough and invalid `phase` ValueError crash; Critic implementation review initially BLOCKed trailing-newline runId raw-leakage because `$` anchoring with `.match()` accepted `SECRET_TOKEN...\n`; final `\Z`-anchored fix verified targeted identity tests `12 passed in 0.07s`; experiment-report tests `135 passed in 0.39s`; experiment-report/corpus-readiness/system-stability focused tests `180 passed in 0.44s`; tool-portfolio focused suite `209 passed in 0.63s`; full S4 pytest `793 passed in 25.10s`; Critic re-review PASS.
- Decision-cycle threshold JSON-serializability hardening: RED regressions reproduced `TypeError` crashes when raw `thresholds` or nested threshold values were `object()`/`set()` before local quality validation; final non-json threshold tests `3 passed in 0.06s`; threshold focused tests `12 passed in 0.08s`; experiment-report tests `138 passed in 0.41s`; experiment-report/corpus-readiness/system-stability focused tests `183 passed in 0.44s`; tool-portfolio focused suite `212 passed in 0.64s`; full S4 pytest `796 passed in 24.89s`; Critic implementation review PASS.
- Acquisition manifest strict schema/checksum hardening: RED regressions reproduced unknown-field fail-open and non-JSON object `TypeError` before checksum; final acquisition/corpus/experiment manifest tests `28 passed in 0.25s`; tool-portfolio focused suite `230 passed in 0.71s`; full S4 pytest `802 passed in 24.62s`; Critic first review BLOCKed trusted-cache `expectedArchiveChecksum` prefix mismatch, regression fixed and re-review PASS.
- Acquisition provenance semantic validation hardening: RED regressions reproduced 14 failures for malformed `downloadedAt`, URL/sourcePageUrl acceptance, and metadata-only source updates not re-pinning manifests; final acquisition/corpus tests `41 passed in 0.36s`; acquisition/corpus/experiment/report tests `188 passed in 0.79s`; tool-portfolio focused suite `252 passed in 0.83s`; full S4 pytest `824 passed in 26.10s`; Critic implementation review PASS.
- Acquisition manifest error-surface sanitation and URL authority strictness: RED regressions reproduced unsafe unknown field key leakage and hostless/query/fragment URL acceptance; Critic BLOCK added userinfo hostless bypass; final acquisition/corpus/experiment/report tests `201 passed in 0.76s`; tool-portfolio focused suite `265 passed in 0.83s`; full S4 pytest `837 passed in 25.77s`; Critic re-review PASS.
- Corpus Readiness relative localPath containment hardening: RED regressions reproduced relative `../` and symlink escape roots being accepted as available; final readiness tests `14 passed in 0.05s`; acquisition/corpus/readiness/manifest/report suite `215 passed in 0.82s`; tool-portfolio focused suite `268 passed in 0.83s`; full S4 pytest `840 passed in 26.26s`; Critic review PASS.
- Corpus Readiness required_corpora ID/projection sanitization hardening: RED regressions reproduced raw required corpus IDs, safe-shaped external status keys, nested projection fields, and safe-shaped reason codes leaking through caller-provided readiness gates; final readiness/report tests `161 passed in 0.54s`; acquisition/corpus/readiness/report/manifest suite `224 passed in 0.83s`; tool-portfolio focused suite `277 passed in 0.87s`; full S4 pytest `849 passed in 26.24s`; Critic re-review PASS.
- Actual Tool Portfolio runner implementation: RED collection failure reproduced missing module; Critic plan BLOCKs resolved 15-config completeness, case-only staging, CLI defaults, smoke/subset semantics, top-level full-current-six system-gate scope, staged manifest checksum repinning, stale stage cleanup, and relative `localPath` base-path/profile resolution; actual-run tests `7 passed in 0.07s`; focused actual/readiness/report/manifest/system suite `211 passed in 0.54s`; all Tool Portfolio tests `284 passed in 0.90s`; full S4 pytest `856 passed in 26.15s`; Critic re-review PASS.
- Actual Juliet/SARD low-threshold runner-integrity run: initial actual CLI wrote stale `report.json` with `REQUIRED_TOOL_INCOMPLETE` due flawfinder malformed numeric parsing and fake SDK lookup warning; RED tests added for `sdkResolutionMode=none` Juliet include profile and malformed Flawfinder `Line`/`Column`/`Level` parsing; fixed actual CLI produced `report-after-fixes.json` with readiness/system/quality gates pass under deliberately low thresholds, all 15 configs present, staged acquisition paths under `actual-runs/.../staged-cases`, and no extracted-cache metric path leakage; targeted runner/flawfinder/sdk tests `23 passed in 3.27s`; Tool Portfolio tests `284 passed in 0.91s`; full S4 pytest `858 passed in 26.42s`; Critic PASS.
- Low-threshold threshold-profile hardening: RED regressions reproduced low/permissive thresholds being promoted to final quality pass and, after Critic BLOCK, low-threshold/no-finding actual-run profiles being misclassified as quality failure via `findingPrecision=null`; final report/actual tests `153 passed in 0.48s`; all Tool Portfolio tests `287 passed in 0.94s`; full S4 pytest `861 passed in 26.30s`; actual CLI rerun wrote `report-after-threshold-profile.json` with readiness `available`, system `pass`, final quality `not_decision_grade`, `QUALITY_THRESHOLDS_NON_DISCRIMINATING`, all 15 configs, and no extracted-cache metric path leakage; Critic re-review PASS.
- Quality Diagnostics v1: RED tests reproduced missing diagnostic block and fixed diagnostic/gate separation, target-row vs finding-pressure unit separation, expected-CWE wrong-CWE bucketing, duplicate finding-key dedupe, allowed negative warning raw-pressure semantics, and blocked/not-run omission of scored buckets; report+actual tests `160 passed in 0.53s`; all Tool Portfolio tests `294 passed in 0.94s`; full S4 pytest `868 passed in 26.05s`; actual CLI wrote `report-after-diagnostics.json` with diagnostic pressure summaries for validation/test; Critic PASS.
- Diagnostic Triage candidate lanes: Critic BLOCK resolved overclaiming/noise-trigger ambiguity by using neutral candidate names/categories and oracle-FP-only noise triggers; RED tests fixed stable ordering, allowlisted ids/categories/actions, wrong-CWE candidate, clean-pass empty candidates, threshold independence, and raw-only pressure no-noise behavior; triage tests `6 passed in 0.18s`; report+actual tests `164 passed in 0.55s`; all Tool Portfolio tests `298 passed in 0.96s`; full S4 pytest `872 passed in 26.36s`; actual CLI wrote `report-after-triage.json`; Critic PASS.
- Tool Contribution Diagnostics v1: Critic BLOCK resolved comparative-completeness and metric-scope ambiguity before implementation; RED tests reproduced the missing additive block, missing builder seam, and actual-run comparative degradation fake-row risk; final contribution tests `7 passed in 0.23s`; report+actual tests `171 passed in 0.60s`; all Tool Portfolio tests `305 passed in 1.02s`; full S4 pytest `879 passed in 25.73s`; actual CLI wrote `report-after-tool-contribution.json` with readiness `available`, system `pass`, final quality `not_decision_grade`, and six stable tool rows; Critic PASS.
- Actual runner staged localPath canonicalization: RED tests reproduced relative `--work-dir` causing staged acquisition `localPath` to remain relative and staged `corpusReadinessGate` to block with `LOCAL_CORPUS_BASE_PATH_REQUIRED`; final actual-runner tests `11 passed in 0.08s`; report+actual tests `173 passed in 0.60s`; all Tool Portfolio tests `307 passed in 1.01s`; full S4 pytest `881 passed in 26.24s`; actual CLI with relative paths wrote `report-after-stage-path-fix.json` with readiness `available`, system `pass`, final quality `not_decision_grade`, and absolute staged localPaths; Critic PASS.
- Harness report snapshot drift guard: RED tests reproduced stale committed `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json` missing `qualityDiagnostics`/`toolContributionDiagnostics` and differing from `build_harness_fixture_report()`; regenerated the committed artifact and added exact generated-vs-committed dict equality plus explicit diagnostic block assertions; focused snapshot tests `2 passed in 0.06s`; report+actual tests `174 passed in 0.63s`; all Tool Portfolio tests `308 passed in 0.99s`; full S4 pytest `882 passed in 25.76s`; Critic PASS.
- Stale experiment-report artifact removal guard: RED test reproduced tracked stale timestamped same-schema artifact `benchmark/results/tool_portfolio/s4-harness-fixture-20260512T042442Z.json` as an offender; deleted that stale JSON and added top-level `schemaVersion` guard so only canonical `s4-harness-fixture-report-v1.json` may use `s4-tool-portfolio-experiment-report-v1`; operational battery schemas remain allowed; focused canonical artifact tests `3 passed in 0.06s`; report+actual tests `175 passed in 0.57s`; all Tool Portfolio tests `309 passed in 0.98s`; full S4 pytest `883 passed in 25.42s`; Critic PASS.
- Tool Portfolio mapping finding payload validation/canonicalization: RED reproduced oracle matcher crash on bad `location.line`; final implementation validates and canonicalizes mapping findings before scoring, preserves top-level `file`/`line` compatibility with metadata-provided CWE evidence, and sanitizes malformed rule/location/file/line/metadata/dataFlow diagnostics; targeted tests `6 passed in 0.07s`; report+canary+actual tests `210 passed in 0.63s`; all Tool Portfolio tests `344 passed in 1.08s`; full S4 pytest `918 passed in 25.16s`; Critic implementation review PASS.
- Corpus manifest `sourcePath` safety validation: RED reproduced unsafe/blank `sourcePath` acceptance; strict manifest/report paths now reject blank/absolute/traversal/backslash traversal source paths without raw value echo, while Corpus Readiness preserves deterministic blocked JSON for unsafe paths using normalized semantics; targeted sourcePath tests `16 passed in 0.07s`; focused manifest/report/readiness/canary/actual tests `253 passed in 0.70s`; all Tool Portfolio tests `360 passed in 1.14s`; full S4 pytest `934 passed in 24.78s`; Critic re-review PASS.
- Actual runner relative acquisition `localPath` fail-closed hardening: RED reproduced cwd-dependent direct staging of relative acquisition paths without explicit base; `_resolve_acquisition_root()` now rejects relative `localPath` without `base_path`, while build-report mode keeps readiness-blocked/no-scan semantics with `LOCAL_CORPUS_BASE_PATH_REQUIRED`; targeted tests `3 passed in 0.04s`; focused actual/readiness/manifest/report tests `232 passed in 0.65s`; all Tool Portfolio tests `362 passed in 1.05s`; full S4 pytest `936 passed in 25.15s`; Critic implementation review PASS.
- Corpus Readiness unsafe `sourcePath` redaction: RED reproduced secret-bearing unsafe sourcePath leakage in blocked readiness JSON; unsafe case statuses now emit `sourcePath="<unsafe>"` and `sourcePathStatus="unsafe"` while preserving blocker identity, and safe missing-file paths remain unredacted; targeted readiness redaction/backslash/missing tests `12 passed in 0.06s`; focused readiness/manifest/report/actual/canary tests `261 passed in 0.66s`; all Tool Portfolio tests `368 passed in 1.02s`; full S4 pytest `942 passed in 25.40s`; Critic implementation review PASS.
- Corpus Readiness CLI invalid-error sanitization: RED reproduced secret-bearing manifest path leakage through `main()` broad-exception `str(exc)` JSON; invalid CLI output now emits fixed `error="input validation failed"` plus safe `errorClass` and never includes raw exception/path text; targeted CLI invalid/blocked/available tests `3 passed in 0.04s`; focused readiness/manifest/report/actual/canary tests `262 passed in 0.68s`; all Tool Portfolio tests `369 passed in 1.03s`; full S4 pytest `943 passed in 25.44s`; Critic implementation review PASS.
- Corpus Readiness CLI output-write fallback: RED reproduced `--output` directory double-fault escaping as `IsADirectoryError`; CLI now falls back to stdout with sanitized invalid JSON, reason `CORPUS_READINESS_OUTPUT_WRITE_FAILED`, fixed `error="output write failed"`, and safe `errorClass`; targeted output/invalid/blocked/available CLI tests `4 passed in 0.04s`; focused readiness/manifest/report/actual/canary tests `263 passed in 0.65s`; all Tool Portfolio tests `370 passed in 1.02s`; full S4 pytest `944 passed in 25.54s`; Critic implementation review PASS.
- Corpus Readiness local filesystem path redaction: RED reproduced secret-bearing acquisition root leakage through `acquisitionStatuses.localPath`/`resolvedLocalPath` and `caseStatuses.resolvedPath`; readiness output now removes those raw host paths and emits `localPathStatus`, `resolvedLocalPathStatus`, and `resolvedPathStatus` instead; targeted missing/checksum/available/actual-runner tests `4 passed in 0.05s`; focused readiness/actual/manifest/report/canary tests `263 passed in 0.68s`; all Tool Portfolio tests `370 passed in 1.04s`; full S4 pytest `944 passed in 25.05s`; Critic implementation review PASS.
- Corpus Readiness missing-acquisition path-status consistency: RED reproduced missing `localPathStatus`/`resolvedLocalPathStatus` on absent acquisition statuses; missing acquisitions now emit `not_declared`/`not_resolved` without raw paths, and the canonical harness fixture was regenerated under drift guard; targeted missing-acquisition + harness drift tests `2 passed in 0.05s`; focused readiness/actual/manifest/report/canary tests `263 passed in 0.69s`; all Tool Portfolio tests `370 passed in 1.04s`; full S4 pytest `944 passed in 25.36s`; Critic implementation review PASS.
- Corpus Readiness status-field enum contract hardening: RED reproduced missing exported enum constants; readiness now exports/freeze-tests `LOCAL_PATH_STATUS_VALUES`, `RESOLVED_LOCAL_PATH_STATUS_VALUES`, `CASE_RESOLVED_PATH_STATUS_VALUES`, and `SOURCE_PATH_STATUS_VALUES`, and representative gates assert all emitted status fields are allowlisted while raw host path fields remain absent; targeted enum tests `2 passed in 0.07s`; focused readiness/actual/manifest/report/canary tests `265 passed in 0.68s`; all Tool Portfolio tests `372 passed in 1.04s`; full S4 pytest `946 passed in 25.40s`; Critic implementation review PASS.
- Corpus Readiness report-side status/path validation hardening: RED reproduced caller-provided `corpusReadinessGate` accept/leak bypasses for unknown path status values, missing available path proof, raw host path fields, extra-acquisition raw paths, unsafe `sourcePath`, and contradictory available+unsafe source path status; report normalization now fails these closed with sanitized `CORPUS_READINESS_GATE_INPUT_INVALID`; targeted status/path tests `6 passed in 0.07s`; focused readiness/report/actual/manifest/canary tests `271 passed in 0.76s`; all Tool Portfolio tests `378 passed in 1.04s`; full S4 pytest `952 passed in 25.03s`; Critic implementation review PASS after BLOCKER fixes.
- Report-side top-level gate status diagnostic sanitization: RED reproduced raw invalid status echo and object stringification for caller-provided `corpusReadinessGate.status` and `systemStabilityGate.status`; invalid nonblank strings now report `<invalid>`, blank strings `<blank>`, and non-string values safe type-only diagnostics; targeted status-sanitization tests `6 passed in 0.07s`; focused report/readiness/actual/manifest/canary/system-stability tests `309 passed in 0.74s`; all Tool Portfolio tests `382 passed in 1.10s`; full S4 pytest `956 passed in 24.97s`; Critic implementation review PASS.
- System Stability nested pass-evidence diagnostic sanitization: RED reproduced raw caller `requiredTools[]` echo, object stringification, and phase-status echo/stringification in pass-gate validation; unknown tool IDs now report `<invalid>`, non-string tool/status values report safe type-only diagnostics, invalid phase status strings report `<invalid>`, and generated missing-current-six diagnostics remain visible; targeted nested system diagnostics `7 passed in 0.07s`; focused report/system/readiness/actual/manifest/canary tests `313 passed in 0.75s`; all Tool Portfolio tests `386 passed in 1.13s`; full S4 pytest `960 passed in 25.08s`; Critic implementation review PASS.
- Nested SCA diff repository URL evidence sanitization: RED regressions reproduced credential-bearing nested `diffSummary.repoUrl` and `/v1/libraries` `entry.diff.repoUrl` leakage when raw diff mappings are supplied; public diff mappings now shallow-copy/sanitize top-level URL fields while preserving raw top-level repo URLs for internal differ calls; targeted regressions `2 passed in 0.03s`; related repository/SCA/evidence/differ/scan endpoint tests `153 passed in 14.90s`; full S4 pytest `1135 passed in 28.55s`; Critic implementation review PASS.
- SCA repository URL public evidence credential sanitization: public `repoUrl`/`remoteUrl` and diff `repoUrl` evidence now strips URL userinfo, query, and fragment while preserving scheme/host/port/path identity; raw repository URLs remain internal clone/fetch/diff inputs; targeted regressions `9 passed in 0.04s`; related repository/library/differ/SCA/evidence/scan endpoint tests `165 passed in 14.97s`; full S4 pytest `1133 passed in 28.46s`; Critic implementation review PASS.
- BuildMetadata public compiler identity path sanitization: RED regressions reproduced POSIX SDK compiler path leakage in successful metadata and Windows-like compiler path leakage in fail-soft metadata; `BuildMetadataExtractor.extract()` now returns basename-style compiler identity plus optional version while subprocess execution and version probing still use the real path internally; targeted regressions `2 passed in 0.03s`; related build-metadata + scan endpoint tests `121 passed in 14.90s`; full S4 pytest `1124 passed in 28.73s`; Critic implementation review PASS.
- LibraryDiffer CloneCache repo URL log sanitization: RED regressions reproduced raw private repository URL/token/host/path leakage in clone-cache MISS and HIT debug logs; `CloneCache.get_or_clone()` now logs category/age/freshness only while preserving clone/fetch URL usage, cache keying, returned cache paths, and diff/API evidence behavior; targeted regressions `2 passed in 0.03s`; related library/SCA/scan endpoint tests `131 passed in 15.15s`; full S4 pytest `1122 passed in 28.48s`; Critic implementation review PASS.
- SDK registry/enrichment log identity/path sanitization: RED regressions reproduced raw sdkId/SDK install path leakage in `register_sdk()`, raw sdkId leakage in `unregister_sdk()`, and raw sdkId leakage in `ScanOrchestrator._enrich_profile_with_sdk()`; those logs now emit category/count-only messages while preserving registry storage, SDK include/compiler resolution, and public API/evidence semantics; targeted regressions `3 passed in 0.03s`; SDK resolver + orchestrator tests `116 passed in 0.12s`; full S4 pytest `1120 passed in 28.44s`; Critic implementation review PASS.
- Startup runtime `logDir` structured-log redaction: RED regression reproduced secret configured `settings.log_dir` exposure and missing status fields in `SAST Runner runtime configuration` startup logging; the startup log now emits value-free `logDirConfigured` and `logDirSource` and no raw `logDir`, while `_setup_logging()` still uses the actual path internally for file handlers; startup logging tests `2 passed in 0.03s`; related startup logging + scan endpoint tests `98 passed in 14.90s`; full S4 pytest `1117 passed in 28.54s`; Critic implementation review PASS.
- Runtime `expectedExecutablePath` redaction: RED regressions reproduced raw path exposure or missing status in `ScanOrchestrator.check_tools()` producer output, defensive `/v1/health` response, startup degraded-tool logs, and required-tool preflight failure metadata/logs; runtime availability evidence now exposes only `expectedExecutablePathStatus=configured|not-configured`, removes raw `expectedExecutablePath` from public/log surfaces, and preserves availability/version/probeReason/policy behavior; targeted regressions `4 passed in 0.04s`; related orchestrator/scan endpoint/startup logging tests `173 passed in 15.00s`; full S4 pytest `1116 passed in 28.41s`; Critic implementation review PASS.
- LibraryDiffer `_compute_diff()` path sanitization: RED regressions reproduced missing sanitized added-file evidence for root/subdir `Only in` rows and raw outside modified-row fallback from `diff --brief` parsing; `_compute_diff()` now emits only resolved local-library-relative source paths in `modifications[].file` and additive `addedFilesList[]`, keeps `addedFiles=len(addedFilesList)` after filtering, and ignores raw/unrelativizable/outside-root rows instead of echoing host-local paths or raw diff lines; targeted regressions `2 passed in 0.03s`; LibraryDiffer tests `24 passed in 0.06s`; related library/SCA/scan endpoint tests `141 passed in 15.02s`; full S4 pytest `1113 passed in 28.45s`; Critic implementation review PASS.
- Unknown internal exception surface sanitization: RED regressions reproduced raw secret exception leakage through direct build `_error_response()` JSON/log/health summary, NDJSON error events/log/summary, sync scan JSON/log/summary, and durable async ownership result/summary; unknown non-domain exceptions now surface fixed `"internal error"` / `INTERNAL_ERROR`, request summaries use the same fixed blocker, logs include only safe `exceptionType` metadata and no traceback, while known `SastRunnerError`/`PolicyViolationError` messages remain unchanged; targeted regressions `4 passed in 4.19s`; scan endpoint + request ownership tests `105 passed in 19.22s`; full S4 pytest `1111 passed in 28.84s`; Critic implementation review PASS.
- BuildRunner API evidence output/excerpt sanitization: RED regressions reproduced raw subprocess stdout/stderr and failure-line leakage through `buildEvidence.buildOutput` and `failureDetail.matchedExcerpt` on success, compile-commands-missing, shared-library-load, and exit127 paths; BuildRunner now emits fixed `"build output omitted"` for nonblank build output, `None` for absent output, and nullable `matchedExcerpt=null` while preserving category/summary/hint/retryable and out-of-scope explicit command/path evidence fields; targeted regressions `4 passed in 0.03s`; BuildRunner tests `21 passed in 0.06s`; related build/scan/request-ownership tests `123 passed in 15.19s`; full S4 pytest `1108 passed in 25.48s`; Critic implementation review PASS.
- Drive-qualified relative files[] path hardening: RED helper regressions reproduced two Windows drive-qualified relative path bypasses (`C:...`, `z:...`) that are unsafe cross-platform even though they are not POSIX absolute; `_validate_path()` now rejects start-of-string single-letter drive prefixes with fixed `Absolute path not allowed` while preserving arbitrary colon filenames such as `src:main.c`; targeted path validation tests `9 passed in 0.03s`; scan endpoint + path validation tests `102 passed in 12.72s`; related scan/request-ownership/sdk/static-evidence tests `152 passed in 18.29s`; full S4 pytest `1104 passed in 25.20s`; Critic implementation review PASS.
- gcc/scan-build per-file source log sanitization: RED caplog regressions reproduced secret source filename leakage in gcc-fanalyzer and scan-build aggregation failure logs plus direct timeout logs; the four warning surfaces now emit value-free categories, with timeout seconds retained as safe operational metadata, while findings/progress/runtime/API contract surfaces remain unchanged; targeted regressions `4 passed in 0.05s`; affected gcc/scan-build runner tests `31 passed in 0.08s`; related gcc/scan-build/orchestrator/scan endpoint tests `199 passed in 12.63s`; full S4 pytest `1101 passed in 25.21s`; Critic implementation review PASS.
- gcc-fanalyzer compiler path log sanitization: RED caplog regressions reproduced raw secret compiler executable path leakage in `GccAnalyzerRunner.run()` start logs and unsupported SDK fallback logs; both surfaces now emit stable categories with count/boolean metadata only while preserving execution/finding/API behavior; targeted regressions `2 passed in 0.03s`; gcc-analyzer tests `18 passed in 0.04s`; related gcc/orchestrator/scan endpoint tests `186 passed in 12.54s`; full S4 pytest `1099 passed in 25.40s`; Critic implementation review PASS.
- files[] Windows/backslash path validation hardening: RED helper regressions reproduced four unsafe `files[].path` bypasses that Linux `Path.parts` did not catch (`..\`, nested `\..\`, Windows drive absolute, and UNC/backslash-root); `_validate_path()` now checks a backslash-normalized validation view and emits only fixed value-free traversal/absolute diagnostics while preserving safe `src/main.c` and `src\main.c`; targeted path validation tests `6 passed in 0.03s`; scan endpoint + path validation tests `99 passed in 12.82s`; related scan/request-ownership/sdk/static-evidence tests `149 passed in 18.34s`; full S4 pytest `1097 passed in 25.26s`; Critic implementation review PASS.
- BuildRunner log surface sanitization: RED caplog regressions reproduced raw secret project path leakage in `discover_targets()` logs and raw secret project path/build command leakage in `build()` start logs; BuildRunner now emits category plus count/boolean metadata only for those log surfaces while preserving API/evidence response fields; targeted regressions `2 passed in 0.03s`; BuildRunner tests `17 passed in 0.05s`; related build/scan/request-ownership tests `119 passed in 15.35s`; full S4 pytest `1091 passed in 25.53s`; Critic implementation review PASS.
- Simple runner command-start log sanitization: RED caplog regressions reproduced joined CLI command leakage, secret scan directories, secret rules/include paths, and command flags in Semgrep, Cppcheck, and Flawfinder start logs; those runners now emit stable `Running <Tool>` categories with count/boolean metadata only and no command/path fragments; targeted regressions `3 passed in 0.03s`; affected runner tests `46 passed in 0.08s`; related runner/orchestrator/scan endpoint tests `214 passed in 12.80s`; full S4 pytest `1089 passed in 25.99s`; Critic implementation review PASS.
- Router structured-log raw path/command extra sanitization: RED static AST gate reproduced 14 `scan.py` router logger extra offenders for raw `projectPath`, `buildCommand`, `requestedBuildCommand`, `effectiveBuildCommand`, and `compileCommandsPath`; router logs now emit value-free presence fields while preserving request/status/count/timing signals and leaving API response payloads unchanged; targeted AST gate `1 passed in 0.04s`; scan endpoint + static gate tests `94 passed in 12.63s`; related scan/request-ownership/sdk/static-evidence tests `144 passed in 18.29s`; full S4 pytest `1086 passed in 25.32s`; Critic implementation review PASS.
- files[] path validation raw-echo sanitization: RED reproduced caller-provided secret `files[].path` echo in `/v1/scan` typed errors and `/v1/functions`/`/v1/includes` generic error responses for absolute/traversal paths; `_validate_path()` now raises fixed `Absolute path not allowed` / `Path traversal not allowed` messages without raw path echo while preserving status 400 and `NO_FILES_PROVIDED`; targeted regressions `4 passed in 0.04s`; scan endpoint tests `93 passed in 12.66s`; related scan/request-ownership/sdk/static-evidence tests `143 passed in 18.18s`; full S4 pytest `1085 passed in 25.66s`; Critic implementation review PASS.
- NoFilesError projectPath-not-found API response sanitization: RED reproduced caller-provided secret `projectPath` echo in `/v1/scan`, `/v1/functions`, `/v1/includes`, and `/v1/libraries` NoFilesError-based validation responses; `_prepare_scan_dir()` and libraries validation now raise fixed `projectPath not found` while preserving 400 response shape and typed `errorDetail.message`; targeted regressions `4 passed in 0.04s`; scan endpoint tests `91 passed in 12.40s`; related scan/request-ownership/sdk/static-evidence tests `141 passed in 17.84s`; full S4 pytest `1083 passed in 25.05s`; Critic implementation review PASS.
- Direct projectPath-not-found API response sanitization: RED reproduced caller-provided secret `projectPath` echo in `/v1/build`, `/v1/build-and-analyze`, and `/v1/discover-targets` validation errors; these direct-return endpoints now emit fixed `projectPath not found` errors while preserving 400 status and response shape; targeted regressions `3 passed in 0.04s`; scan endpoint tests `87 passed in 12.38s`; related scan/request-ownership/sdk/static-evidence tests `137 passed in 17.68s`; full S4 pytest `1079 passed in 25.59s`; Critic implementation review PASS.
- SCA library identity path-log sanitization: RED reproduced secret project root and permission child path leakage in `LibraryIdentifier.identify()` summary and permission-denied scan logs; SCA identity logs now use count/category-only messages while preserving returned library metadata and skip behavior; targeted regressions `2 passed in 0.03s`; library identifier tests `13 passed in 0.04s`; related library/SCA/static-evidence/scan endpoint tests `155 passed in 12.77s`; full S4 pytest `1078 passed in 25.64s`; Critic implementation review PASS.
- SCA diff failure log sanitization: RED reproduced project-derived library name and raw diff exception leakage in `analyze_libraries()` warning logs; SCA diff failures now log fixed `lib_differ.diff failed` while preserving fail-soft `diff=None` and continuing with later libraries; targeted regression `1 passed in 0.03s`; SCA service tests `9 passed in 0.05s`; related SCA/scan/static-evidence/quality tests `143 passed in 12.84s`; full S4 pytest `1076 passed in 24.89s`; Critic implementation review PASS.
- Orchestrator tool exception surface sanitization: RED reproduced raw secret tool exception text in `ScanOrchestrator.run()` warning logs and `execution.toolResults[].skipReason`; per-tool task exceptions now log fixed `Tool <tool> failed` and use category-only `tool-execution-failed` skip reasons while preserving fail-soft execution reports; targeted regression `1 passed in 0.03s`; orchestrator tests `75 passed in 0.07s`; related orchestrator/scan endpoint/static-evidence/quality tests `209 passed in 12.71s`; full S4 pytest `1076 passed in 24.97s`; Critic implementation review PASS.
- SDK validation error-surface sanitization: RED reproduced host path, sysroot, setup script, and compiler-prefix leakage in `validate_sdk()` error strings; SDK validation now returns value-free category strings for missing SDK path/sysroot/environment setup/compiler checks while preserving list shape and validation flow; targeted regressions `4 passed in 0.03s`; SDK resolver tests `37 passed in 0.07s`; related SDK/build/scan endpoint tests `152 passed in 15.40s`; full S4 pytest `1075 passed in 25.47s`; Critic implementation review PASS.
- SDK include-path resolution log sanitization: RED reproduced caller sdkId and SDK root/base/sysroot path leakage in include-path success, missing-directory, and missing-sysroot logs; `resolve_sdk_paths()` and `_resolve_from_registry()` now log category/count-only messages while preserving returned paths/empty lists; targeted regressions `3 passed in 0.03s`; SDK resolver tests `37 passed in 0.08s`; related SDK/build/scan endpoint tests `152 passed in 15.14s`; full S4 pytest `1075 passed in 24.79s`; Critic implementation review PASS.
- SDK registry load failure log sanitization: RED reproduced SDK registry missing-path logs leaking a secret SDK root/registry filename and malformed-registry logs leaking JSON parser detail; `_load_sdk_registry()` now logs fixed `SDK registry not found` / `Failed to load SDK registry` categories while preserving `{}` fail-soft behavior; targeted regressions `2 passed in 0.03s`; SDK resolver tests `34 passed in 0.06s`; related SDK/build/scan endpoint tests `149 passed in 15.03s`; full S4 pytest `1072 passed in 25.29s`; Critic implementation review PASS.
- AST dump failure log sanitization: RED reproduced raw secret source filename and exception text in advisory AST dump failure logs; `AstDumper._dump_single()` now logs fixed `AST dump failed` while preserving `None` fail-soft behavior; targeted regression `1 passed in 0.04s`; AST dumper tests `14 passed in 0.07s`; related codegraph/static-evidence/scan endpoint tests `161 passed in 14.45s`; full S4 pytest `1070 passed in 25.00s`; Critic implementation review PASS.
- Build metadata macro extraction failure log sanitization: RED reproduced raw secret exception text in advisory gcc macro extraction failure logs; `BuildMetadataExtractor.extract()` now logs fixed `gcc macro extraction failed` while preserving fail-soft `{compiler, macros: {}, targetInfo: {}}` semantics; targeted regression `1 passed in 0.03s`; build metadata tests `23 passed in 0.04s`; related scanner/orchestrator/endpoint+runner tests `262 passed in 12.67s`; full S4 pytest `1069 passed in 25.33s`; Critic implementation review PASS.
- Scan-build plist parse failure log sanitization: RED reproduced malformed plist warning leaking a secret plist filename and parser detail while a valid plist still parsed; `_parse_plist_results()` now logs fixed `Failed to parse scan-build plist` and continues; targeted regression `1 passed in 0.03s`; scan-build runner tests `11 passed in 0.03s`; related scanner/orchestrator/endpoint tests `187 passed in 13.17s`; full S4 pytest `1068 passed in 25.55s`; Critic implementation review PASS.
- Compile-analyzer per-file failure log sanitization: RED reproduced raw secret exception text in gcc-fanalyzer and scan-build failed-file aggregation logs; runner logs now omit exception strings while preserving `_last_failed` and partial behavior; targeted regressions `2 passed in 0.03s`; gcc/scan-build runner tests `26 passed in 0.05s`; related scanner/orchestrator/endpoint tests `186 passed in 12.60s`; full S4 pytest `1067 passed in 26.83s`; Critic implementation review PASS.
- Semgrep runner raw stdout/stderr log sanitization: RED reproduced raw secret stderr in empty-stdout logs and raw secret stdout/stderr in non-JSON output logs; Semgrep runner now logs fixed categories while preserving empty-SARIF fallback and `ToolOutputInvalidError`; targeted regressions `2 passed in 0.03s`; Semgrep runner tests `22 passed in 0.06s`; related scanner/parser/orchestrator/endpoint tests `198 passed in 12.65s`; full S4 pytest `1065 passed in 24.84s`; Critic implementation review PASS.
- Juliet manifest missing-testcases path sanitization: RED reproduced missing `testcases/` diagnostic echoing a secret Juliet root path; `discover_cwe_suites()` now preserves `FileNotFoundError` with stable `Juliet testcases directory not found`; targeted regression `1 passed in 0.03s`; benchmark/JULIET related tests `33 passed in 0.06s`; full S4 pytest `1063 passed in 24.95s`; Critic implementation review PASS.
- Juliet benchmark scan-failure log sanitization: RED reproduced raw secret exception text in `_benchmark_cwe()` failure logs while preserving all-cases-FN fallback; benchmark logs now emit stable `Scan failed for <CWE>` only; targeted regression `1 passed in 0.03s`; benchmark/JULIET related tests `32 passed in 0.06s`; full S4 pytest `1062 passed in 25.23s`; Critic implementation review PASS.
- SARIF parser malformed-output sanitization: RED reproduced detail-leaking `SarifParseError` for malformed rule shapes and raw `AttributeError` escape for non-mapping runs; `parse_sarif()` now raises stable `SarifParseError("Failed to parse SARIF output")` from None for parser-shape failures; targeted regressions `2 passed in 0.03s`; SARIF parser tests `16 passed in 0.04s`; related parser/scan/tool-output tests `114 passed in 12.64s`; full S4 pytest `1061 passed in 25.25s`; Critic implementation review PASS.
- Tool Output Compatibility fixture input error-surface sanitization: RED reproduced missing fixture raw `FileNotFoundError` path leakage, malformed Semgrep SARIF JSON parser diagnostics, and traversal `inputFixture` path leakage; `_parse_findings()` now uses safe relative fixture resolution plus value-free read/JSON helpers; targeted regressions `3 passed in 0.03s`; tool-output compatibility tests `12 passed in 0.04s`; related offline evidence/report tests `88 passed in 0.23s`; full S4 pytest `1059 passed in 25.33s`; Critic implementation review PASS.
- Tool Output Compatibility manifest/parserKind error-surface sanitization: RED reproduced missing manifest raw `FileNotFoundError` path leakage, malformed JSON parser diagnostics, non-object manifest fail-open, and unsupported parserKind raw value echo; `load_manifest()` and parserKind rejection now use stable value-free diagnostics with suppressed read/parser causes; targeted regressions `4 passed in 0.03s`; tool-output compatibility tests `9 passed in 0.03s`; related offline evidence/report tests `85 passed in 0.20s`; full S4 pytest `1056 passed in 25.01s`; Critic implementation review PASS.
- Benchmark Slice artifact loader error-surface sanitization: RED reproduced missing artifact raw `FileNotFoundError` path leakage, malformed JSON parser-message leakage, and non-object JSON path echo; `_load_artifact()` now emits stable value-free categories with suppressed read/parser causes; targeted regressions `3 passed in 0.03s`; benchmark slice report tests `9 passed in 0.04s`; related offline evidence/report tests `81 passed in 0.21s`; full S4 pytest `1052 passed in 25.38s`; Critic implementation review PASS.
- Actual runner path-boundary exception-chain suppression: RED reproduced chained `Path.relative_to()` errors leaking secret absolute paths for relative acquisition `localPath` base escape and symlink-resolved `sourcePath` acquisition-root escape; boundary catches now raise the same value-free category diagnostics `from None`; targeted regressions `2 passed in 0.04s`; actual runner tests `20 passed in 0.11s`; related Tool Portfolio tests `425 passed in 1.32s`; full S4 pytest `1049 passed in 25.35s`; Critic implementation review PASS.
- Acquisition manifest real-calendar exception-chain suppression: RED reproduced underlying `datetime.strptime` parser `ValueError` surviving as the sanitized acquisition manifest error `__cause__`; `_parse_datetime()` now raises the same value-free field-only diagnostic `from None`; targeted regression `1 passed in 0.03s`; acquisition manifest tests `46 passed in 0.05s`; related Tool Portfolio tests `423 passed in 1.35s`; full S4 pytest `1047 passed in 25.28s`; Critic implementation review PASS.
- Actual Tool Portfolio runner CLI argparse/scalar input sanitization: RED reproduced invalid `--timeout` and `--phase` raw argparse `SystemExit`, usage output, and secret token echo before the fixed JSON input path could run; final `main()` uses a fixed-diagnostic parser plus explicit positive-decimal timeout parser, maps invalid scalar and JSON input failures to fixed `input validation failed` exit `1`, proves scalar failures do not call `_load_json_object()` or create output artifacts, and preserves valid timeout `45` handoff. Targeted/compat CLI tests `5 passed in 0.05s`; related Tool Portfolio tests `340 passed in 0.95s`; full S4 pytest `1236 passed in 29.67s`; Critic implementation review PASS.
- Actual runner CLI input failure fail-closed handling: RED reproduced missing-path and malformed-content CLI raises from JSON input loading; final targeted CLI tests `2 passed`; actual runner tests `18 passed in 0.09s`; related Tool Portfolio tests `422 passed in 1.31s`; full S4 pytest `1046 passed in 24.95s`; Critic implementation review PASS.
- Juliet corpus file selection failure path redaction: RED reproduced secret corpus root path leakage from `_select_juliet_file()`; final targeted helper test `1 passed`; corpus acquisition tests `14 passed in 0.32s`; related Tool Portfolio tests `420 passed in 1.34s`; full S4 pytest `1044 passed in 25.18s`; Critic implementation review PASS.
- Actual runner JSON input loader read/parse error-surface sanitization: RED reproduced missing-path and malformed-JSON raw exception surfaces; final targeted loader tests `3 passed`; actual runner tests `16 passed in 0.09s`; related Tool Portfolio tests `419 passed in 1.33s`; full S4 pytest `1043 passed in 24.94s`; Critic implementation review PASS.
- Standalone benchmark compare CLI argparse-boundary sanitization: RED reproduced missing required args, unknown secret flag/path, and missing `--threshold` value raw argparse `SystemExit`, usage output, and caller token/path echo. Final `benchmark.compare.main(argv=None)` uses a fixed-diagnostic parser with a safe-message allowlist so raw parser failures exit `2` with fixed `invalid comparison arguments`, existing post-parse diagnostics remain specific, and parser failures do not call `_load_result()`. Targeted/compat compare tests `8 passed in 0.04s`; benchmark/JULIET related tests `108 passed in 0.16s`; full S4 pytest `1250 passed in 30.26s`; Critic implementation review PASS.
- Corpus Readiness CLI argparse/input-boundary sanitization: RED reproduced missing required `--corpus-manifest`, unknown argument, and missing repeated-option value raw argparse `SystemExit`, usage output, and caller token/path echo. Final CLI uses a fixed-diagnostic parser and emits the existing sanitized invalid-input JSON payload on stdout with exit `1`, stderr empty, and no `_load_json_object()` or `build_corpus_readiness_gate()` side effects for parser failures. Targeted/compat CLI tests `6 passed in 0.05s`; related Tool Portfolio tests `125 passed in 0.51s`; full S4 pytest `1247 passed in 31.19s`; Critic implementation review PASS.
- Corpus Readiness JSON object loader path redaction: RED reproduced secret host path leakage from `_load_json_object()` on non-object JSON input; final targeted loader test `1 passed`; corpus readiness tests `36 passed in 0.07s`; related Tool Portfolio tests `416 passed in 1.34s`; full S4 pytest `1040 passed in 25.51s`; Critic implementation review PASS.
- Tool-set config validator error-surface sanitization: RED reproduced unknown current-tool, WR-gated future config, unknown config, and non-string config raw echo/type failures; final targeted config tests `6 passed`; experiment manifest tests `41 passed in 0.05s`; related Tool Portfolio tests `415 passed in 1.32s`; full S4 pytest `1039 passed in 25.23s`; Critic implementation review PASS.
- Decision-cycle forbidden runtime coupling guard error-surface sanitization: RED reproduced host-local path and raw regex leakage from the no-network/no-LLM/no-S5 guard; final targeted guard test `1 passed`; decision-cycle tests `4 passed in 0.03s`; related Tool Portfolio tests `410 passed in 1.33s`; full S4 pytest `1034 passed in 25.49s`; Critic implementation review PASS.
- Corpus Acquisition CLI output-boundary sanitization: RED reproduced raw summary-output `OSError`, stdout JSON `TypeError` with secret class names, stdout write `OSError`, and broken-stderr cascade risk. Final CLI uses local `_write_cli_summary_output()` and `_emit_cli_bundle_stdout()` bool-returning boundaries plus best-effort `_emit_cli_error()`, maps output failures to fixed `corpus acquisition output failed` exit `1`, stops before stdout after summary-output failure, and leaves `acquire_known_corpora()` failures uncaught. Targeted output/input tests `6 passed in 0.04s`; related Tool Portfolio tests `122 passed in 0.49s`; full S4 pytest `1244 passed in 29.87s`; Critic implementation review PASS.
- Corpus Acquisition CLI argparse/input-boundary sanitization: RED reproduced invalid `--corpus`, unknown argument, and missing-value raw argparse `SystemExit`, usage output, and caller token/path echo. Final `main()` uses a fixed-diagnostic parser plus explicit corpus-source validation, removes argparse `choices=` from `--corpus`, maps parser/source selection failures to fixed `input validation failed` exit `1`, proves invalid inputs do not call `acquire_known_corpora()` or create summary artifacts, and preserves valid repeated corpus selection order/force/output-root/summary/stdout behavior. Targeted CLI tests `4 passed in 0.04s`; related Tool Portfolio tests `118 passed in 0.49s`; full S4 pytest `1240 passed in 29.38s`; Critic implementation review PASS.
- Corpus acquisition local path/error-surface sanitization: RED reproduced secret zip member, outside-cache path, expected checksum, and actual checksum leakage; final targeted acquisition helper tests `3 passed`; corpus acquisition tests `13 passed in 0.32s`; related Tool Portfolio tests `406 passed in 1.40s`; full S4 pytest `1033 passed in 25.46s`; Critic implementation review PASS.
- Acquisition manifest duplicate acquisitionId error-surface sanitization: RED reproduced safe-shaped secret duplicate acquisition ID leakage from `build_acquisition_index()`; final targeted duplicate test `1 passed`; acquisition manifest tests `45 passed in 0.05s`; related Tool Portfolio tests `393 passed in 1.02s`; full S4 pytest `1030 passed in 25.07s`; Critic implementation review PASS.
- Experiment report forbidden-key guard error-surface sanitization: RED reproduced report guard leaks for secret parent labels, parent key-object stringification, and forbidden `str` subclass key stringification; final targeted guard tests `3 passed`; experiment-report tests `240 passed in 0.88s`; related Tool Portfolio tests `392 passed in 1.07s`; full S4 pytest `1029 passed in 25.31s`; Critic implementation review PASS.
- Corpus manifest identity-field error-surface sanitization: RED reproduced unsafe `caseId`/`targetId`/`lineageId`/`acquisitionId` acceptance plus duplicate/acquisition/leakage/sourceRef raw echo paths; final targeted identity/error-surface tests `10 passed`; manifest+readiness tests `71 passed in 0.11s`; related Tool Portfolio tests `389 passed in 0.95s`; full S4 pytest `1026 passed in 24.78s`; Critic implementation review PASS.
- Corpus manifest forbidden-key error-surface sanitization: RED reproduced secret parent path and forbidden-key object stringification leaks; final targeted forbidden-key tests `4 passed`; manifest+readiness tests `61 passed in 0.09s`; related Tool Portfolio tests `379 passed in 0.94s`; full S4 pytest `1016 passed in 25.07s`; Critic re-review PASS after initial BLOCK.
- Corpus manifest case checksum strictness: RED reproduced prefix-valid secret/short/uppercase/non-hex malformed checksums passing manifest validation and leaking through readiness `expectedChecksum`; final targeted checksum tests `6 passed`; manifest+readiness tests `58 passed in 0.09s`; related Tool Portfolio tests `376 passed in 0.93s`; full S4 pytest `1013 passed in 25.22s`; Critic implementation review PASS.
- Corpus Readiness full caller-provided input sanitization: RED regressions reproduced top-level/nested raw echo and generated-shape compatibility failures; final focused corpus-readiness sanitization tests `13 passed`; experiment-report tests `237 passed in 0.76s`; full S4 pytest `1007 passed in 25.13s`; Critic implementation review PASS.
- System Stability full non-pass input sanitization: RED regressions reproduced top-level reason/schema/requiredTools/phase failure raw echo plus normalized-gate compatibility failures; final system-stability/system-gate tests `53 passed`; report+consumer tests `248 passed`; full S4 pytest `994 passed in 24.87s`; Critic final re-review PASS.
- Legacy external_corpus_status invalid diagnostic sanitization: RED reproduced raw invalid legacy key/field echo and object stringification in compatibility-context input validation; invalid diagnostics now use `key="<invalid>"`/`field="<invalid>"` with safe type metadata where relevant, while valid accepted legacy context remains preserved; targeted legacy diagnostics `7 passed in 0.08s`; focused report/consumer/readiness/actual/manifest/system tests `317 passed in 0.89s`; all Tool Portfolio tests `390 passed in 1.08s`; full S4 pytest `964 passed in 25.08s`; Critic implementation review PASS.
- Consumer canary guard for `QUALITY_REQUIRED_SPLITS_INVALID`: targeted consumer canary regression `1 passed in 0.05s`; report+consumer tests `233 passed in 0.67s`; all Tool Portfolio/evidence tests `417 passed in 1.23s`; full S4 pytest `979 passed in 25.20s`; Critic PASS.
- Dedicated invalid `requiredSplits` Quality Gate reason: RED reproduced invalid required split entries being reported as `SPLIT_METRICS_MISSING` with a sanitized pseudo-split; final implementation emits `QUALITY_REQUIRED_SPLITS_INVALID`, sanitized `invalidRequiredSplits`, and skips split scoring for invalid split config while preserving `QUALITY_REQUIRED_SPLITS_NOT_DECLARED` for empty/blank-only declarations; targeted tests `6 passed, 203 deselected`; report+consumer tests `232 passed in 0.66s`; focused report/canary/oracle/readiness/actual/manifest tests `307 passed in 0.79s`; all Tool Portfolio/evidence tests `416 passed in 1.26s`; full S4 pytest `978 passed in 24.76s`; Critic implementation review PASS.
- Threshold/primaryToolSetConfig/requiredSplits diagnostic sanitization: RED reproduced 10 leakage paths for unknown primary config values, unknown threshold keys, invalid threshold values, invalid required splits, non-JSON diagnostic key paths, and invalid-primary precedence branches; final targeted tests `10 passed, 197 deselected`; experiment-report tests `207 passed in 0.65s`; focused report/oracle/canary/readiness/actual/manifest tests `305 passed in 0.83s`; all Tool Portfolio/evidence tests `414 passed in 1.23s`; full S4 pytest `976 passed in 25.52s`; Critic implementation review PASS after initial requiredSplits/precedence BLOCK.
- MatchingPolicy invalid diagnostic sanitization: RED reproduced raw unknown policy key echo, tuple key stringification, raw schemaVersion echo, and raw out-of-range lineWindow echo; invalid diagnostics now use `<invalid>` plus safe type/expected metadata while preserving default policy canonicalization; targeted matchingPolicy diagnostics `7 passed in 0.07s`; focused report/oracle/canary/readiness/actual/manifest tests `296 passed in 0.77s`; all Tool Portfolio tests `393 passed in 1.10s`; full S4 pytest `967 passed in 25.22s`; Critic implementation review PASS.
- Tool Portfolio finding tool identity/config membership validation: RED reproduced unknown `toolId` scoring fail-open; final implementation validates `SastFinding.tool_id`, mapping `toolId`, and mapping `tool_id`, enforces single-tool/leave-one-out membership, sanitizes unknown tool diagnostics, and reuses `FINDINGS_BY_CONFIG_INPUT_INVALID`; targeted tests `5 passed in 0.06s`; report+canary+actual tests `204 passed in 0.60s`; all Tool Portfolio tests `338 passed in 1.01s`; full S4 pytest `912 passed in 25.01s`; Critic implementation review PASS.
- Tool Portfolio `byCweTool` diagnostic matrix: RED reproduced missing `byCweTool` and stale canonical report snapshot drift; implementation adds score-row-scoped expected-CWE/tool match-class buckets while excluding per-tool FN/recall/precision/raw pressure; targeted matrix tests `3 passed in 0.07s`; snapshot+summary tests `2 passed in 0.05s`; report+canary+actual tests `199 passed in 0.64s`; all Tool Portfolio tests `333 passed in 1.00s`; full S4 pytest `907 passed in 25.07s`; Critic implementation review PASS.
- Tool Portfolio diagnostic identifier fail-closed canary: RED reproduced that unsafe projected diagnostic identifiers could be silently dropped while summary remained decision-grade usable; implementation now treats malformed/unknown projected `candidateId`/`toolId`/`evidenceClass` as unsafe projection without changing summary schema; focused canary tests `23 passed in 0.05s`; report+actual tests `198 passed in 0.60s`; all Tool Portfolio tests `332 passed in 1.01s`; full S4 pytest `906 passed in 25.01s`; Critic implementation review PASS.
- Tool Portfolio consumer-summary stale artifact guard: synthetic offender detection covers clean canonical summary, extra summary artifact, and drifted canonical summary; real repo guard requires no summary-schema offenders under `benchmark/results/tool_portfolio`; focused canary tests `22 passed in 0.07s`; report+actual tests `197 passed in 0.57s`; all Tool Portfolio tests `331 passed in 1.02s`; full S4 pytest `905 passed in 25.98s`; Critic implementation review PASS.
- Tool Portfolio report consumer canary + CLI smoke gate: RED tests reproduced missing helper, candidate/tool/evidence identifier leakage, reason/follow-up forbidden-value leakage, status/intent/diagnostic-surface scalar leakage, missing CLI entry point, default-mode parsed-invalid exit `0`, missing summary-level schema version/exact-key lock, missing committed summary artifact, and stale-report-guard misclassification of that summary artifact; final helper/CLI uses strict allowlists for all projected strings, emits `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"`, exact-locks top-level summary keys, commits `s4-harness-fixture-consumer-summary-v1.json` as a parsed-dict snapshot, preserves stale report protection through path+summary-schema+exact-match exception, emits `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION`, keeps `toolPortfolioDecisionGradeUsable=false` on unsafe projection, exits `2` for `reportPresent=false` summaries, and supports reproducible module smoke checks; focused canary tests `20 passed in 0.05s`; report+actual tests `195 passed in 0.61s`; all Tool Portfolio tests `329 passed in 1.05s`; full S4 pytest `903 passed in 25.39s`; Critic final re-review PASS.
- Oracle matchingPolicy semantic validation hardening: RED focused tests reproduced arbitrary mapping acceptance for wrong schema, unknown keys, bool/negative/too-large/non-int `lineWindowDefault`, non-bool `functionFallbackDefault`, and missing optional-field canonicalization; final matching-policy focused tests `13 passed in 0.07s`; experiment-report tests `117 passed in 0.36s`; experiment-report/corpus-readiness/system-stability focused tests `162 passed in 0.39s`; tool-portfolio focused suite `191 passed in 0.59s`; full S4 pytest `775 passed in 25.41s`; Critic implementation review PASS.
- Juliet/SARD Corpus Acquisition CLI and actual local cache verification: `tests/test_tool_portfolio_corpus_acquisition.py tests/test_tool_portfolio_corpus_readiness.py` `15 passed in 0.10s`; tool-portfolio acquisition/readiness/manifest/report/system-gate focused suite `92 passed in 0.27s`; actual NIST archive SHA-256 verification and extraction under `.omx/corpora/s4-tool-portfolio/`; readiness CLI over actual Juliet/SARD manifests `status=available`, `decisionGradeReady=true`, `checkedCaseCount=80`; Ralph deslop pass removed unused acquisition fields and added SARIF fallback/error regression tests; full S4 pytest `683 passed in 25.39s`.
- Corpus acquisition provenance/split-leakage/reproducibility hardening after code-review REQUEST_CHANGES: acquisition/manifest/readiness tests `27 passed in 0.21s`; tool-portfolio focused suite `123 passed in 0.41s`; actual readiness CLI remains `status=available`, `decisionGradeReady=true`, `checkedCaseCount=80`; full S4 pytest `704 passed in 24.79s`.


Critic implementation review initially rejected split metric contamination, function-region-only TP promotion, missing negative allowed-warning policy, and missing negative allowed-warning policy enforcement, and exclusion of allowed negative-region findings from FP/noise aggregation. These were fixed with regression tests before the final full S4 pytest gate.
