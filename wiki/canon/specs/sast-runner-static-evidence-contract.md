---
title: "S4 Static Evidence Contract v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md"
  - ".omx/plans/s4-static-evidence-enhancement-plan-v1.md"
last_verified: "2026-05-11"
service_tags: ["s4"]
decision_tags: ["static-evidence-contract-v1", "coverage-contract", "readiness-contract"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md"]
---

# S4 Static Evidence Contract v1

Status: **implemented in S4 runtime responses and validation harness**  
Owner: **S4 / SAST Runner**  
Scope: **C/C++ deterministic static evidence artifact**  
Non-goals: LLM reasoning, CVE lookup, GraphRAG retrieval, runtime analysis, exploitability judgment, final vulnerability verdict.

This page is the canonical design for the additive `staticEvidenceContract` block that S4 attaches to deterministic static-analysis responses. It exists to prevent downstream consumers from overreading S4 output as semantic, external-vulnerability, runtime, or final-verdict evidence.

---

## 1. Required top-level block

`POST /v1/scan` and `/v1/build-and-analyze` expose an additive block named `staticEvidenceContract` when S4 has produced a static evidence artifact.

Minimum shape:

```json
{
  "schemaVersion": "s4-static-evidence-contract-v1",
  "analysisProfile": "c-cpp-core",
  "artifactKind": "s4-static-evidence-artifact",
  "producer": { "service": "s4-sast-runner", "deterministic": true },
  "provenance": {},
  "gates": {
    "systemStability": {},
    "evidenceReadiness": {},
    "qualityEvaluation": {}
  },
  "coverage": {},
  "claimBoundaries": {},
  "toolEvidenceMatrix": [],
  "followUpHints": []
}
```

The field is additive. Existing `findings`, `execution`, `sca`, `codeGraph`, `libraries`, `metadata`, and build/readiness payloads remain backward-compatible. `missingEvidence` may also appear as optional additive neutral readiness metadata, but it is not part of the required S3 minimum key set.

---

## 2. Coverage status vocabulary

Every coverage surface uses the same status vocabulary:

| Status | Meaning |
|---|---|
| `provided` | S4 computed and included local deterministic evidence for this surface. |
| `partial` | S4 computed some local evidence, but known parts are absent, degraded, or incomplete. |
| `not_provided` | S4 does not provide this evidence by design. |
| `not_computed` | S4 could provide this class of evidence, but this request/profile did not compute it. |
| `not_applicable` | The surface does not apply to this request/profile. |
| `unavailable` | Required local input/tooling was unavailable. |
| `failed` | S4 attempted the surface and failed. |
| `unknown` | S4 cannot classify the surface deterministically. |

For every status other than `provided`, S4 must include at least one stable `reasonCodes[]` value and a `consumerPolicy`. The default consumer policy for non-`provided` surfaces is `do_not_use_as_negative_evidence`.

`provided` means only “observed by S4”. It never means “absence of vulnerability”. Empty local results must not be treated as proof that a vulnerability class is absent.

---

## 3. Coverage entry shape

```json
{
  "status": "provided",
  "reasonCodes": [],
  "consumerPolicy": "observed_positive_evidence_only",
  "evidenceRefs": ["findings[]", "execution.toolResults"],
  "summary": "S4 emitted normalized SAST findings and execution evidence.",
  "observedCount": 3
}
```

Required keys:

| Key | Required | Description |
|---|:---:|---|
| `status` | O | One status from the coverage vocabulary. |
| `reasonCodes` | O | Stable machine-readable reasons. Empty only when `status=provided`. |
| `consumerPolicy` | O | How a consumer may use this surface. |
| `evidenceRefs` | X | Existing response paths that contain the concrete evidence. |
| `summary` | X | Human-readable explanation. |
| `observedCount` | X | Deterministic count when meaningful. |

---

## 4. Required coverage surfaces

`coverage` is an object keyed by surface name. S4 v1 must include at least the following keys.

### Locally deterministic surfaces

| Key | Evidence class | Typical evidence refs |
|---|---|---|
| `staticToolExecution` | Tool execution status, omission policy, degraded state | `execution`, `execution.toolResults` |
| `sastFindings` | Normalized SAST finding list | `findings[]` |
| `findingLocations` | File/line location presence for findings | `findings[].file`, `findings[].line` |
| `findingCweMapping` | CWE extraction/normalization status | `findings[].metadata.cweId`, `findings[].metadata.evidenceResolution` |
| `findingDataflow` | Tool-provided dataflow evidence when present | `findings[].dataFlow` |
| `originClassification` | user/third-party/cross-boundary origin evidence | `findings[].origin`, `metadata.evidenceResolution.origin` |
| `structuralCodeGraph` | Structural call graph only | `codeGraph.functions[]` |
| `includeGraph` | Include dependency graph | `/v1/includes` output when requested separately |
| `targetMetadata` | Compiler macro/target metadata | `/v1/metadata` output or build-and-analyze `metadata` |
| `scaIdentity` | Library identity evidence | `sca.libraries[]`, `libraries[]` |
| `scaVersionEvidence` | Version/commit/tag evidence | `sca.libraries[].versionEvidence` |
| `scaDiffEvidence` | Upstream diff/modification evidence | `diff`, `diffSummary` |

### Explicitly not-provided surfaces

S4 v1 must include these as `not_provided`:

| Key | Required status | Reason |
|---|---|---|
| `externalVulnerabilityKnowledge` | `not_provided` | S4 does not query vulnerability databases. |
| `semanticGraphRetrieval` | `not_provided` | S4 does not perform semantic graph retrieval. |
| `runtimeBehavior` | `not_provided` | S4 does not execute runtime behavior analysis. |
| `exploitabilityJudgment` | `not_provided` | S4 does not decide exploitability. |
| `finalSecurityVerdict` | `not_provided` | S4 does not issue final security verdicts. |

These surfaces must use `consumerPolicy: "do_not_use_as_negative_evidence"` and stable reason codes such as `OUT_OF_SCOPE_S4`, `EXTERNAL_KNOWLEDGE_NOT_QUERIED`, `SEMANTIC_RETRIEVAL_NOT_PERFORMED`, `RUNTIME_NOT_ANALYZED`, `EXPLOITABILITY_NOT_JUDGED`, and `FINAL_VERDICT_NOT_PROVIDED`.

---

## 5. Structural-only code graph semantics

S4 code graph evidence is structural. When `coverage.structuralCodeGraph.status=provided`, the entry must include:

```json
{
  "status": "provided",
  "graphKind": "structural-callgraph",
  "semanticRetrieval": "not_provided",
  "graphRag": "not_provided",
  "consumerPolicy": "structural_positive_evidence_only"
}
```

This means:

- calls and functions are static structural observations;
- no semantic retrieval has been performed;
- no graph-based vulnerability reasoning has been performed;
- consumers must not infer semantic completeness from the structural graph alone.

If code graph extraction was not requested or no `projectPath`-style material was available, use `status: "not_computed"` with a stable reason code such as `CODE_GRAPH_NOT_REQUESTED` or `PROJECT_PATH_NOT_PROVIDED`.

---

## 6. Gate separation

The contract separates three gates so that operational stability, evidence readiness, and quality evaluation are not conflated.

### `gates.systemStability`

Purpose: Did S4 execute the requested local pipeline reliably enough to treat emitted local evidence as an artifact?

Allowed statuses:

- `pass`
- `degraded`
- `fail`
- `unknown`

Typical rules:

- `pass`: response success is true, no disallowed tool omission, no degraded execution state, and no per-tool anomaly in the current execution metadata.
- `degraded`: response success is true but execution reports partial/degraded local analysis, or current per-tool metadata contains `partial`, `failed`, degraded `ok`, blocking skip, missing/not-recorded, or unknown tool status.
- `fail`: response failure, disallowed omission, or authoritative policy failure. A single tool `failed` state inside an otherwise successful artifact degrades the artifact; it does not by itself convert the response into a failed artifact unless policy failure codes are also present.
- `unknown`: S4 cannot classify stability deterministically.

Per-tool anomaly reason codes are deterministic and emitted in current tool order: `TOOL_PARTIAL:<tool>`, `TOOL_FAILED:<tool>`, `TOOL_DEGRADED:<tool>`, `TOOL_BLOCKING_SKIP:<tool>`, `TOOL_NOT_RECORDED:<tool>`, and `TOOL_STATUS_UNKNOWN:<tool>`. If a tool is both `partial` and marked degraded, `TOOL_PARTIAL:<tool>` subsumes the degraded flag to avoid duplicate anomaly codes for the same local state.

### `gates.evidenceReadiness`

Purpose: Which locally deterministic surfaces are ready for downstream consumption?

Allowed statuses:

- `ready`
- `partial`
- `not_ready`
- `unknown`

This gate is not a vulnerability-quality score. It is a readiness summary over local evidence coverage. `partial` is expected when optional surfaces were not computed or when some requested local surfaces are incomplete.


### Evidence readiness matrix update (2026-05-11)

`gates.evidenceReadiness` uses a deterministic required/optional surface matrix. Explicit S4 out-of-scope surfaces remain excluded from readiness blockers because they are already represented as `not_provided` claim boundaries.

Required local surfaces:

- `staticToolExecution`
- `sastFindings`
- `findingLocations`
- `findingCweMapping`
- `originClassification`

Optional local surfaces:

- `findingDataflow`
- `structuralCodeGraph`
- `includeGraph`
- `targetMetadata`
- `scaIdentity`
- `scaVersionEvidence`
- `scaDiffEvidence`

Precedence:

| Condition | `evidenceReadiness.status` | Notes |
|---|---|---|
| emitted artifact has `success=false` or a policy-failure reason | `not_ready` | Applies only to emitted static evidence artifacts, such as scan/build-and-analyze policy failure responses. |
| required surface is missing, `not_computed`, `failed`, `unavailable`, or `unknown` | `not_ready` | The minimum local static evidence artifact is not ready. |
| required surface is `partial` | `partial` | Local evidence exists but is incomplete. |
| optional surface is `partial`, `failed`, `unavailable`, or `unknown` | `partial` | Optional local evidence degraded; consumers must not treat missing pieces as negative evidence. |
| optional surface is `not_computed` or `not_applicable` | ignored | Optional non-computation does not prevent readiness for the required local artifact. |
| all required surfaces are `provided` and no optional local surface is degraded | `ready` | External/semantic/runtime/exploitability/final-verdict surfaces remain out-of-scope and excluded. |

Readiness statuses use stable reason codes: `ARTIFACT_FAILED`, `REQUIRED_EVIDENCE_MISSING`, and `LOCAL_EVIDENCE_PARTIAL`. When per-tool anomalies exist, `coverage.staticToolExecution.status` becomes `partial`, uses reason code `TOOL_EXECUTION_PARTIAL`, and carries `anomalyReasonCodes[]` with the same deterministic per-tool codes used by `gates.systemStability`.

### `gates.qualityEvaluation`

Purpose: Was this artifact evaluated against a named validation/golden-corpus profile?

Allowed statuses:

- `not_evaluated`
- `pass`
- `partial`
- `fail`
- `unknown`

Default runtime response value is:

```json
{
  "status": "not_evaluated",
  "reasonCodes": ["NO_VALIDATION_PROFILE_RAN"],
  "consumerPolicy": "do_not_treat_as_quality_score"
}
```

Only the validation harness/report path may populate `pass`, `partial`, or `fail`. Runtime attachment in `/v1/scan` must not invent quality scores.

---

## 7. Claim boundaries

`claimBoundaries` is mandatory and must make the artifact’s limits machine-readable.

```json
{
  "maySupport": [
    "local-static-tool-observations",
    "normalized-cwe-location-dataflow-origin-evidence",
    "structural-callgraph-evidence-when-provided",
    "sca-identity-version-diff-evidence-when-provided"
  ],
  "mustNotSupportAlone": [
    "external-vulnerability-affectedness",
    "semantic-graph-completeness",
    "runtime-exploitability",
    "final-security-verdict",
    "absence-of-vulnerability-from-empty-findings"
  ],
  "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence"
}
```

No runtime field may be named as a final verdict surface such as `vulnerable`, `safe`, `affected`, `clean`, `riskScore`, or `securityVerdict`.

---

## 8. Optional `missingEvidence` and required `followUpHints`

`followUpHints` is part of the required top-level contract. `missingEvidence`, if present, is optional additive metadata. Both are neutral readiness metadata only.

Allowed:

```json
{
  "surface": "externalVulnerabilityKnowledge",
  "status": "not_provided",
  "reasonCode": "EXTERNAL_KNOWLEDGE_NOT_QUERIED",
  "consumerPolicy": "do_not_use_as_negative_evidence",
  "message": "External vulnerability knowledge is outside this S4 artifact."
}
```

Forbidden:

- service calls;
- endpoint names as commands;
- hard orchestration instructions;
- S5 request shaping;
- LLM prompts;
- verdict fields or risk scores.

The fields may help a consumer notice missing evidence, but they must not decide which other service to call or how to call it.

---

## 9. SCA compatibility rule

`cveLookupEligible` remains as backward-compatible SCA library metadata for existing consumers. The contract v1 neutralizes its interpretation:

- It is an eligibility/identity hint only.
- It is not evidence that a CVE exists.
- It is not evidence that no CVE exists.
- It must not be placed under `externalVulnerabilityKnowledge` as `provided`.

The canonical readiness signal is the relevant `coverage.sca*` entry plus `coverage.externalVulnerabilityKnowledge.status="not_provided"`.

---

## 10. Validation expectations

The first implementation must add executable contract oracles before claiming quality improvement.

Minimum oracle classes:

1. Contract oracle: required keys, status vocabulary, explicit `not_provided` external/semantic/runtime/verdict surfaces.
2. Tool capability oracle: each of the six current SAST tools is represented in a machine-checkable capability fixture or report.
3. Evidence bundle oracle: sample `/v1/scan` and `/v1/build-and-analyze` payloads with `staticEvidenceContract` attached.
4. Vulnerability-family canary: at least one C/C++ family fixture proving that S4 reports local static evidence without producing a final verdict.

Static guards must cover the contract helper module, expected implementation path `services/sast-runner/app/scanner/static_evidence_contract.py`, and must prove no external vulnerability database calls, no GraphRAG calls, no LLM calls, and no S5 API coupling are introduced.

### Gate-specific test inventory update (2026-05-11)

The gate implementation is considered well-written only when each gate has direct transition tests plus endpoint propagation tests where applicable:

| Gate | Required test evidence |
|---|---|
| `systemStability` | Direct `pass`, `degraded`, and `fail` coverage. `policy_failure_reason_codes` must force `fail` even if the caller mistakenly passes `success=true`. Successful artifacts with per-tool `partial`, `failed`, degraded `ok`, blocking skip, missing/not-recorded, or unknown metadata must become `degraded`, not silently `pass`. |
| `evidenceReadiness` | Direct required/optional matrix coverage: required missing or `not_computed` => `not_ready`; required `partial` => `partial`; optional `partial`, `failed`, `unavailable`, or `unknown` => `partial`; optional `not_computed`/`not_applicable` ignored; `findings=[]` distinct from `findings=None`. Per-tool anomalies must partialize `staticToolExecution` with `TOOL_EXECUTION_PARTIAL` and `anomalyReasonCodes[]`. |
| `qualityEvaluation` | Runtime contract remains `not_evaluated`; only validation/report profiles may attach `pass`, `partial`, or `fail`, and doing so must not mutate runtime stability/readiness. |
| Endpoint propagation | `/v1/scan` and `/v1/build-and-analyze` policy-failure artifacts must expose failed/not-ready contracts in both sync and async ownership paths. |
| Determinism boundary | Static helper guard must prove no external vulnerability DB call, no S5/GraphRAG call, no LLM call, and no verdict/risk-score coupling. |

Current executable tests:

- `tests/test_static_evidence_contract.py` — gate transition matrix, policy-failure propagation, async scan/build-and-analyze ownership paths, S4-only helper guard.
- `tests/test_static_evidence_report.py` — runtime/report `qualityEvaluation` separation.
- `tests/test_golden_corpus_v1.py` — Golden Corpus v1 manifest/oracle validation.
- `tests/test_tool_portfolio_governance.py` — six-tool portfolio governance baseline.
- `tests/test_static_evidence_consumer_canaries.py` — precomputed full-response JSON consumer canaries proving S3-facing interpretation can be derived from `staticEvidenceContract` only. It covers top-level and nested contracts, clean ready, failed tool degraded, missing/not-recorded metadata, policy failure, allowed skip, raw `execution.toolResults` poisoning, absent contract, and malformed contract behavior.

---

## 11. Implementation notes

Recommended code organization:

- `services/sast-runner/app/scanner/static_evidence_contract.py` owns deterministic contract construction.
- `services/sast-runner/app/schemas/response.py` adds optional alias field `staticEvidenceContract` to response models.
- `services/sast-runner/app/routers/scan.py` attaches the block after local evidence projection and before serialization.

The implementation must remain deterministic and side-effect-free. It may inspect already-computed local response objects but must not perform network I/O, database I/O, LLM calls, or cross-service calls.

---

## 12. Tool evidence matrix

`toolEvidenceMatrix` is a required additive top-level field under the same `s4-static-evidence-contract-v1` schema. It gives S3 a stable, S4-authored interpretation of each current tool's local execution state so S3 does not have to infer tool meaning from raw `execution.toolResults` alone.

Rules:

- schema version remains `s4-static-evidence-contract-v1`; this is not a v2 split;
- one record is emitted for each current S4 tool in stable order: `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`;
- missing execution metadata is represented as `status="not_recorded"` with `consumerPolicy="metadata_absent_do_not_infer"`;
- all records are local deterministic evidence only and set `requiresNetwork=false`, `requiresExternalKnowledge=false`, and `emitsFinalVerdict=false`;
- `verdictPolicy` is always `local-tool-state-is-not-a-vulnerability-verdict`.

Minimum record shape:

```json
{
  "toolId": "semgrep",
  "role": "pattern-taint",
  "uniqueContribution": "fast project-specific pattern and taint evidence",
  "overlap": ["flawfinder dangerous API patterns"],
  "limitations": ["coverage depends on configured rulesets", "local evidence only"],
  "status": "ok",
  "findingsCount": 1,
  "elapsedMs": 10,
  "version": "1.45.0",
  "skipReason": null,
  "degraded": false,
  "degradeReasons": [],
  "consumerPolicy": "local_tool_execution_state_only_not_vulnerability_verdict",
  "evidenceRefs": ["execution.toolResults.semgrep"],
  "deterministic": true,
  "requiresNetwork": false,
  "requiresExternalKnowledge": false,
  "emitsFinalVerdict": false,
  "verdictPolicy": "local-tool-state-is-not-a-vulnerability-verdict"
}
```

Consumer policy taxonomy:

| Condition | `consumerPolicy` |
|---|---|
| tool status `ok` | `local_tool_execution_state_only_not_vulnerability_verdict` |
| tool status `partial` or per-tool degraded metadata | `local_tool_partial_use_with_degradation_metadata` |
| tool status `failed` | `local_tool_failed_do_not_use_as_negative_evidence` |
| skipped with `operator-requested-subset` or `profile-not-applicable` | `not_requested_or_not_applicable` |
| skipped with `runtime-tool-missing`, `environment-drift`, `tool-check-failed`, or other non-allowed reason | `blocks_successful_artifact` |
| missing execution/tool-result metadata | `metadata_absent_do_not_infer` |

This matrix is intentionally duplicated from S4's local tool governance vocabulary into runtime artifacts because S3 needs immediate, machine-readable consumption semantics.

Gate propagation semantics:

- A current tool `failed` result inside a successful response sets `gates.systemStability.status="degraded"`, not `fail`, unless S4 also emits policy-failure reason codes.
- Per-tool `partial`, `failed`, degraded `ok`, blocking skip, missing/not-recorded current result, or unknown status sets `coverage.staticToolExecution.status="partial"`.
- `coverage.staticToolExecution.reasonCodes` includes `TOOL_EXECUTION_PARTIAL`; `coverage.staticToolExecution.anomalyReasonCodes` mirrors the deterministic per-tool reason codes in `gates.systemStability.reasonCodes`.
- Allowed skips (`operator-requested-subset`, `profile-not-applicable`) do not degrade the artifact.


---

## 13. Implementation status (2026-05-11)

Implemented in `services/sast-runner`:

- `app/scanner/static_evidence_contract.py` builds deterministic `staticEvidenceContract` payloads.
- `app/schemas/response.py` exposes optional `staticEvidenceContract` aliases on `ScanResponse` and `BuildAndAnalyzeResponse`.
- `app/routers/scan.py` attaches the contract to `/v1/scan` and `/v1/build-and-analyze`, including policy-failure cases where `gates.systemStability.status="fail"`.
- `toolEvidenceMatrix` emits one S3-consumable local execution/governance record per current S4 tool under the existing v1 schema.
- Per-tool anomaly classification now drives both `gates.systemStability` and `coverage.staticToolExecution`, so S3 can distinguish a successful-but-degraded local artifact from a clean local artifact without reading raw runner internals.
- `benchmark/golden_corpus_validator.py`, `benchmark/static_evidence_report.py`, and `benchmark/tool_portfolio_governance.py` provide validation/report/governance surfaces without changing runtime quality semantics.
- `benchmark/static_evidence_consumer_canary.py` is a pure JSON consumer-canary harness. It imports no S4 app modules, ignores raw `execution.toolResults`, and summarizes only `gates`, `coverage`, `claimBoundaries`, and `toolEvidenceMatrix` for local-static-readiness testing.

Verification evidence:

- `tests/test_static_evidence_contract.py` — static contract runtime and failure-path oracles.
- `tests/test_golden_corpus_v1.py` — four-layer Golden Corpus v1 manifest/oracle gate.
- `tests/test_static_evidence_report.py` — report/profile qualityEvaluation separation.
- `tests/test_tool_portfolio_governance.py` — six-tool governance decision gate.
- Full S4 pytest gate on 2026-05-11 after S3-consumable matrix/corpus hardening: `471 passed in 13.33s`.
- Full S4 pytest gate on 2026-05-11 after per-tool anomaly gate propagation hardening: `481 passed in 13.28s`.
- Full S4 pytest gate on 2026-05-11 after consumer-canary harness hardening: `490 passed in 13.35s`.
- Full S4 pytest gate on 2026-05-11 after Tool Output Compatibility v1 hardening: `496 passed in 13.08s`.
- Full S4 pytest gate on 2026-05-11 after Benchmark Slice Report v1 hardening: `503 passed in 13.93s`.
