---
title: "Shared (S1-S2) API / Model Contract"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/api/shared-models.md"
original_path: "docs/api/shared-models.md"
last_verified: "2026-05-08"
service_tags: ["platform"]
decision_tags: ["build-script-hint", "scriptHintPath", "build-agent-contract", "sdk-materialization", "health-control-v2", "s1-aggregate-types"]
related_pages: ["wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
---

# Shared (S1-S2) API / Model Contract

> Canonical contract for the current S1 (frontend) ↔ S2 (backend) integration.
>
> Authority order for this document:
> 1. `services/shared/src/models.ts`
> 2. `services/shared/src/dto.ts`
> 3. `services/shared/src/llm-sampling.ts`
> 4. mounted backend controllers under `services/backend/src/controllers/*.ts`
>
> This file is intentionally backend-owned. If S2 behavior changes, update this document first and treat it as the canonical contract for S1.
> If you need the bigger end-to-end request/WS flow before reading field-level contracts, see [[wiki/context/project/end-to-end-scenarios|AEGIS 대표 시나리오별 통신 흐름]].
>
> 2026-05-02 implementation audit: this page was checked against `services/shared/src/models.ts`,
> `services/shared/src/dto.ts`, `services/backend/src/router-setup.ts`, and mounted S2 controllers.
> The audit clarified project-scoped SDK delete behavior, limited WS subscribe-time snapshots,
> and the S2-owned direct S7 task caller generation-control tuple.
>
> 2026-05-03 implementation audit: S2 added `services/shared/src/llm-sampling.ts` as the
> S2-owned shared generation-control vocabulary. This page describes S2 caller/shared-type
> behavior only; S3 and S7 public API ownership remains in their canonical API documents.

---

## 1. Contract conventions

### 1.1 Success envelope

Most REST endpoints return:

```ts
interface ApiSuccess<T> {
  success: true;
  data?: T;
}
```

Exceptions currently mounted in code:

- `GET /health` returns the raw health object without a top-level `success` field.
- `GET /api/projects/:id/overview` returns the raw `ProjectOverviewResponse` object without a top-level `success` field.
- `GET /api/files/:fileId/download` returns `text/plain`, not JSON.
- `GET /api/projects/:pid/source/files` returns extra top-level fields beside `data`.

### 1.2 Error envelope

Async/controller errors handled by `error-handler.middleware.ts` return:

```ts
interface ApiError {
  success: false;
  error: string;
  errorDetail?: {
    code:
      | "INVALID_INPUT"
      | "NOT_FOUND"
      | "CONFLICT"
      | "FORBIDDEN"
      | "RATE_LIMITED"
      | "ADAPTER_UNAVAILABLE"
      | "LLM_UNAVAILABLE"
      | "LLM_HTTP_ERROR"
      | "LLM_PARSE_ERROR"
      | "LLM_TIMEOUT"
      | "AGENT_UNAVAILABLE"
      | "AGENT_TIMEOUT"
      | "SAST_UNAVAILABLE"
      | "SAST_TIMEOUT"
      | "BUILD_AGENT_UNAVAILABLE"
      | "BUILD_AGENT_TIMEOUT"
      | "KB_UNAVAILABLE"
      | "KB_HTTP_ERROR"
      | "PIPELINE_STEP_FAILED"
      | "DB_ERROR"
      | "INTERNAL_ERROR";
    message: string;
    requestId?: string;
    retryable: boolean;
    // endpoint-specific structured metadata may appear here
    // e.g. project delete conflict → blockers
  };
}
```

Synchronous controller validation errors sometimes return only:

```json
{ "success": false, "error": "..." }
```

### 1.3 Common rules

- All timestamps are ISO 8601 strings.
- IDs are server-generated strings (`project-*`, `sdk-*`, `analysis-*`, `pipe-*`, etc.).
- Protected routes require `Authorization: Bearer <token>` when auth middleware is enabled.
- `401 { success: false, error: "Authentication required" }` is the current protected-route auth failure shape.

---

## 2. Core shared models

Only the currently relevant shared types for active S1↔S2 surfaces are repeated here.

### 2.1 Project

```ts
type ProjectOwnerKind = "user" | "system";

interface ProjectOwnerSummary {
  /** 안정 식별자 — user id 또는 system id */
  id: string;
  /** 화면 표시명. ko-KR 한글 및 latin1/영문 이름 모두 UTF-8 JSON 문자열로 전달된다. */
  name: string;
  /** 1~2자 이니셜. null/undefined이면 S1이 name에서 derive 가능. */
  avatar?: string | null;
  /** 사람 사용자 vs 시스템 생성 프로젝트. */
  kind?: ProjectOwnerKind;
}

interface Project {
  id: string;
  name: string;
  description: string;
  /** 프로젝트 생성자/1차 담당자. 기존 migrated row는 없을 수 있다. */
  owner?: ProjectOwnerSummary;
  createdAt: string;
  updatedAt: string;
}
```

```ts
interface ProjectListItem extends Project {
  lastAnalysisAt?: string;
  severitySummary?: { critical: number; high: number; medium: number; low: number };
  gateStatus?: "pass" | "fail" | "warning";
  unresolvedDelta?: number;
  /** Project Explorer 담당 컬럼용 primary owner. S2가 보유하지 못한 경우 omit. */
  owner?: ProjectOwnerSummary;
}
```

`GET /api/projects` owner policy (2026-04-27):

- Authenticated project creation stores the current `req.user` profile as `owner` (`id`, `displayName`/`username`, 1~2 character `avatar`, `kind: "user"`).
- Existing/migrated projects whose `projects.owner_*` columns are empty omit `owner`; S1 should keep the dim `—` placeholder for those rows.
- No owner mutation endpoint exists in this cycle. Backfill/migration, owner reassignment, multi-owner roles, and avatar image URLs are future WR scope.
- Soft-auth / unauthenticated development creation may omit `owner`; S2 intentionally does not invent a fake person.

### 2.2 Uploaded file (DB-backed file API)

```ts
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  language?: string;
  projectId?: string;
  path?: string;
  createdAt?: string;
}
```

### 2.3 Source tree entry (filesystem-backed source API)

`GET /api/projects/:pid/source/files` returns `SourceFileEntry[]` from `ProjectSourceService`:

```ts
type SourceFileType =
  | "source"
  | "config"
  | "build"
  | "script"
  | "doc"
  | "linker"
  | "executable"
  | "object"
  | "shared-lib"
  | "archive"
  | "image"
  | "unknown";

interface SourceFileEntry {
  relativePath: string;
  size: number;
  language: string;
  fileType: SourceFileType;
  previewable: boolean;
}
```

### 2.4 Build / SDK models

```ts
type SdkProfileId = string;

interface BuildProfile {
  sdkId: SdkProfileId;
  compiler: string;
  compilerVersion?: string;
  targetArch: string;
  languageStandard: string;
  headerLanguage: "c" | "cpp" | "auto";
  includePaths?: string[];
  defines?: Record<string, string>;
  flags?: string[];
}
```

```ts
interface SdkProfile {
  id: SdkProfileId;
  name: string;
  vendor: string;
  description: string;
  defaults: Omit<BuildProfile, "sdkId">;
}
```

`SdkProfile` is exported from `@aegis/shared` via `services/shared/src/models.ts` and `services/shared/src/index.ts`.
The current built-in profile response shape does not include `version`, `archCompat`, or additional metadata beyond the fields above.

```ts
type SdkRegistryStatus =
  | "uploading"
  | "uploaded"
  | "extracting"
  | "extracted"
  | "installing"
  | "installed"
  | "analyzing"
  | "verifying"
  | "ready"
  | "upload_failed"
  | "extract_failed"
  | "install_failed"
  | "verify_failed";

type SdkArtifactKind = "archive" | "bin" | "folder";

interface SdkAnalyzedProfile {
  compiler?: string;
  compilerPrefix?: string;
  gccVersion?: string;
  targetArch?: string;
  languageStandard?: string;
  sysroot?: string;
  environmentSetup?: string;
  includePaths?: string[];
  defines?: Record<string, string>;
  artifactKind?: SdkArtifactKind;
  sdkVersion?: string;
  targetSystem?: string;
  installLogPath?: string;
}

type SdkProgressPhase = Exclude<SdkRegistryStatus, "upload_failed" | "extract_failed" | "install_failed" | "verify_failed">;
type SdkErrorPhase = Extract<SdkRegistryStatus, "upload_failed" | "extract_failed" | "install_failed" | "verify_failed">;
type SdkPhase = SdkProgressPhase | SdkErrorPhase;

type SdkErrorCode =
  | "UPLOAD_INVALID_INPUT"
  | "EXTRACT_ARCHIVE_EMPTY"
  | "EXTRACT_UNSAFE_ENTRY"
  | "EXTRACT_FAILED"
  | "INSTALL_ETXTBSY"
  | "INSTALL_PROCESS_FAILED"
  | "INSTALL_TIMEOUT"
  | "VERIFY_PATH_ESCAPED"
  | "VERIFY_PATH_MISSING"
  | "VERIFY_CONTENT_EMPTY"
  | "VERIFY_PROFILE_PATH_INVALID"
  | "ANALYZE_UNAVAILABLE"
  | "RETRY_UNSUPPORTED_PHASE"
  | "RETRY_QUOTA_EXCEEDED"
  | "RETRY_COOLDOWN_ACTIVE"
  | "RETRY_ARTIFACT_UNAVAILABLE"
  | "UNKNOWN_SDK_ERROR";

interface SdkPhaseDetail {
  kind: string;
  params?: Record<string, string | number | boolean>;
}

interface SdkPhaseHistoryEntry {
  phase: SdkPhase;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  message?: string;
}

interface RegisteredSdk {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  path: string;
  profile?: SdkAnalyzedProfile;
  artifactKind?: SdkArtifactKind;
  sdkVersion?: string;
  targetSystem?: string;
  installLogPath?: string;
  status: SdkRegistryStatus;
  currentPhaseStartedAt?: number;
  phaseHistory?: SdkPhaseHistoryEntry[];
  retryCount?: number;
  retryable?: boolean;
  retryExpiresAt?: number;
  verifyError?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

```ts
type SdkMetricsPhaseKey = SdkPhase;

interface SdkMetrics {
  /** Canonical count of project-registered SDK records. */
  totalRegistered: number;
  /** Compatibility alias for totalRegistered; retained for existing consumers. */
  sdkCount: number;
  readyCount: number;
  failedCount: number;
  averagePhaseDurationMs: Partial<Record<SdkMetricsPhaseKey, number>>;
}

interface SdkMetricsResponse {
  success: boolean;
  data: SdkMetrics;
}

interface SdkProfileListResponse {
  success: boolean;
  data: SdkProfile[];
}

interface SdkProfileResponse {
  success: boolean;
  data?: SdkProfile;
  error?: string;
}
```

`averagePhaseDurationMs` only includes phases present in persisted `RegisteredSdk.phaseHistory`.
`sdkCount === totalRegistered`; S1 should prefer `totalRegistered` for new typed UI and keep `sdkCount`
only as a compatibility alias.

### 2.5 Build target / target library

```ts
type BuildTargetStatus =
  | "discovered"
  | "resolving"
  | "configured"
  | "resolve_failed"
  | "building"
  | "built"
  | "build_failed"
  | "scanning"
  | "scanned"
  | "scan_failed"
  | "graphing"
  | "graphed"
  | "graph_failed"
  | "ready";

type BuildTargetSdkChoiceState = "sdk-selected" | "sdk-none-explicit" | "sdk-unresolved";

interface BuildTarget {
  id: string;
  projectId: string;
  name: string;
  relativePath: string;
  includedPaths?: string[];
  sourcePath?: string;
  buildProfile: BuildProfile;
  /** SDK selection preflight state. Quick is allowed only when this is sdk-selected or sdk-none-explicit. */
  sdkChoiceState: BuildTargetSdkChoiceState;
  buildSystem?: "cmake" | "make" | "custom";
  /** Effective-BuildTarget-root-relative uploaded script hint; reference-only for S3 Build Agent. */
  scriptHintPath?: string;
  buildCommand?: string;
  status: BuildTargetStatus;
  compileCommandsPath?: string;
  buildLog?: string;
  sastScanId?: string;
  scaLibraries?: Array<{ name: string; version?: string; path: string; repoUrl?: string }>;
  codeGraphStatus?: "pending" | "ingested" | "failed";
  codeGraphNodeCount?: number;
  lastBuiltAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

```ts
interface TargetLibrary {
  id: string;
  targetId: string;
  projectId: string;
  name: string;
  version?: string;
  path: string;
  included: boolean;
  modifiedFiles: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 2.6 Analysis / dynamic-test / report / auth / notification models

```ts
type AnalysisTrackerStatus = "running" | "completed" | "failed" | "aborted";
type AnalysisPhase =
  | "queued"
  | "rule_engine"
  | "llm_chunk"
  | "merging"
  | "complete"
  | "quick_sast"
  | "quick_graphing"
  | "quick_complete"
  | "deep_submitting"
  | "deep_analyzing"
  | "deep_retrying"
  | "deep_complete";

interface AnalysisProgress {
  analysisId: string;
  projectId: string;
  buildTargetId?: string;
  executionId?: string;
  status: AnalysisTrackerStatus;
  phase: AnalysisPhase;
  currentChunk: number;
  totalChunks: number;
  totalFiles?: number;
  processedFiles?: number;
  message: string;
  startedAt: string;
  updatedAt: string;
  endedAt?: string;
  error?: string;
}
```

```ts
type AgentAnalysisOutcome = "accepted_claims" | "no_accepted_claims" | "inconclusive";
type AgentQualityOutcome =
  | "accepted"
  | "accepted_with_caveats"
  | "rejected"
  | "inconclusive"
  | "repair_exhausted";
type AgentPocOutcome = "poc_accepted" | "poc_rejected" | "poc_inconclusive" | "poc_not_requested";

interface AgentRecoveryTraceEntry {
  deficiency?: string;
  action?: string;
  outcome?: string;
  detail?: string;
}

type NonAcceptedClaimLifecycleStage =
  | "candidate"
  | "under_evidenced"
  | "needs_human_review"
  | "rejected"
  | "retried"
  | "inconclusive"
  | "repair_exhausted"
  | "withdrawn";

type NonAcceptedClaimOutcomeContribution =
  | "no_accepted_claims"
  | "rejected_unsupported"
  | "needs_human_review"
  | "poc_rejected"
  | "poc_inconclusive"
  | (string & {});

interface NonAcceptedClaimEvidenceTrailEntry {
  evidenceRef?: string;
  evidenceRefId?: string;
  refId?: string;
  role?: string;
  status?: string;
  detail?: string;
}

interface NonAcceptedClaimRevisionHistoryEntry {
  fromStatus?: NonAcceptedClaimLifecycleStage | (string & {});
  toStatus?: NonAcceptedClaimLifecycleStage | (string & {});
  reason?: string;
  timestampMs?: number;
}

interface NonAcceptedClaim {
  claimId?: string;
  /** Canonical S3 lifecycle stage. This is the lifecycle-stage field for S1 sorting/filtering. */
  status: NonAcceptedClaimLifecycleStage | (string & {});
  family?: string;
  primaryLocation?: string;
  /** Open-string reason code; examples are documented in analysis-agent-api.md. */
  rejectionCode?: string;
  rejectionReason?: string;
  statement?: string;
  detail?: string;
  retryCount?: number;
  severity?: Severity;
  requiredEvidence?: string[];
  presentEvidence?: string[];
  missingEvidence?: string[];
  evidenceTrail?: NonAcceptedClaimEvidenceTrailEntry[];
  revisionHistory?: NonAcceptedClaimRevisionHistoryEntry[];
  invalidRefs?: string[];
  supportingEvidenceRefs?: string[];
  outcomeContribution?: NonAcceptedClaimOutcomeContribution;
}

interface AgentClaimDiagnosticsSummary {
  lifecycleCounts?: Record<string, number>;
  /** Typed diagnostic-only records for candidate claims that did not become accepted final claims. */
  nonAcceptedClaims?: NonAcceptedClaim[];
}

interface AgentEvidenceDiagnosticsSummary {
  [key: string]: unknown;
}

interface AnalysisResult {
  id: string;
  projectId: string;
  buildTargetId?: string;
  analysisExecutionId?: string;
  module: AnalysisModule;
  status: AnalysisStatus;
  vulnerabilities: Vulnerability[];
  summary: AnalysisSummary;
  warnings?: AnalysisWarning[];
  caveats?: string[];
  confidenceScore?: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  needsHumanReview?: boolean;
  recommendedNextSteps?: string[];
  policyFlags?: string[];
  analysisOutcome?: AgentAnalysisOutcome;
  qualityOutcome?: AgentQualityOutcome;
  pocOutcome?: AgentPocOutcome;
  recoveryTrace?: AgentRecoveryTraceEntry[];
  /** S3 claim lifecycle diagnostics; claims[] remains accepted-final-only. */
  claimDiagnostics?: AgentClaimDiagnosticsSummary;
  /** Evidence acquisition diagnostics, including failed/negative attempts. */
  evidenceDiagnostics?: AgentEvidenceDiagnosticsSummary;
  agentAudit?: AgentAuditSummary;
  createdAt: string;
}
```

S3 Analysis Agent claim diagnostics policy (2026-04-27):

- `claims[]` is accepted-final-only. S2/S1 must not expect raw candidate, under-evidenced, rejected, or other non-accepted lifecycle states in `claims[]`.
- Non-accepted claim lifecycle data is preserved under `claimDiagnostics` using S3 WP-1 object shape (`lifecycleCounts`, `nonAcceptedClaims[]`).
- Negative or failed evidence acquisition attempts are preserved under `evidenceDiagnostics`; diagnostic evidence references are not supporting refs for accepted claims.
- These fields are additive and optional; old rows/non-Deep rows may omit them.
- `claimDiagnostics.nonAcceptedClaims[]` may include S3 Pass-A proof fields (`requiredEvidence`, `presentEvidence`, `missingEvidence`, `evidenceTrail`, `revisionHistory`) and `outcomeContribution` values such as `rejected_unsupported` or `needs_human_review`. S1 should treat these as diagnostic detail, not as accepted findings.
- 2026-05-06 S2 typed export: `claimDiagnostics.nonAcceptedClaims[]` is now `NonAcceptedClaim[]` in `@aegis/shared`. S2 does not rename S3 `status`; consumers should treat `status` as the canonical lifecycle-stage key.
- `rejectionCode` is open-string and optional. Current examples are documented in `wiki/canon/api/analysis-agent-api.md`; unknown codes must fall back to review/diagnostic display, not client-side success.
- S2 forwards stable optional S3 lifecycle proof keys unchanged. New stable per-claim keys require S2/shared-models update before S1 consumes them.
- S2 validates `claimDiagnostics` before persisting/exposing stored analysis results and before returning the PoC facade. New writes with malformed diagnostics are rejected at the DAO boundary; malformed historical/manual rows or malformed optional PoC diagnostics are omitted rather than exposed as untyped records.

S3 Analysis Agent outcome semantics:

- `status: "completed"` means S3 returned a schema-valid review envelope; it does **not** by itself mean a clean/deployable deep-analysis pass.
- S2/S1 should treat a clean deep pass as `status === "completed" && analysisOutcome === "accepted_claims" && qualityOutcome === "accepted"`.
- Valid-input S3 deficiencies (for example no accepted claims, caveats, rejected/repair-exhausted review quality, or inconclusive PoC) are represented in the result fields above and `recoveryTrace`; they are not transport failures.
- True task failures remain failure envelopes / non-2xx paths for invalid caller input, unsafe/out-of-authority requests, dead dependencies, timeout/cancel, or impossible result-envelope assembly.
- For `generate-poc`, S3 quality-repair exhaustion is represented as `status="completed"` with `pocOutcome="poc_inconclusive"` and `qualityOutcome="repair_exhausted"` plus recovery trace detail such as `action="poc_quality_repair_exhausted"`. This is non-clean and requires review, but is not a task transport failure.

### 2.6.1 Deep outcome / cleanPass UI contract (S2→S1)

This subsection is the normative S2 answer for S1 Deep outcome display. It is grounded in `services/shared/src/models.ts`, `services/shared/src/dto.ts`, `services/backend/src/services/analysis-orchestrator.ts`, `services/backend/src/services/agent-client.ts`, and `services/backend/src/dao/analysis-result.dao.ts`.

#### Outcome enum definitions and recommended copy

`analysisOutcome` classifies whether the S3 claim/evidence review accepted at least one actionable claim. It is not a transport status.

| value | Meaning | ko-KR copy | en copy | UI tone |
|---|---|---|---|---|
| `accepted_claims` | At least one claim passed the claim/evidence acceptance rules and became a finding candidate. | 유효 발견 있음 | Accepted findings | positive / complete |
| `no_accepted_claims` | The task completed, but no claim was accepted as evidence-backed. This can mean proposed claims were rejected or none survived normalization. | 수용된 발견 없음 | No accepted findings | neutral-review |
| `inconclusive` | The agent could not produce enough claim/evidence support to reach a reliable analysis conclusion. | 결론 불가 | Inconclusive analysis | caution-review |

`qualityOutcome` classifies the review envelope quality. Clean pass requires exactly `accepted`.

| value | Meaning | ko-KR copy | en copy | UI tone |
|---|---|---|---|---|
| `accepted` | Review quality passed without caveats that should block clean interpretation. | 품질 통과 | Quality accepted | positive / complete |
| `accepted_with_caveats` | Review quality is usable but caveats remain. Render caveats from `AnalysisResult.caveats` and warnings when present. | 조건부 품질 통과 | Accepted with caveats | caution-review |
| `rejected` | Review quality failed; do not present the run as a clean security conclusion. | 품질 게이트 실패 | Quality rejected | critical-review |
| `inconclusive` | Quality evaluation itself could not reach a reliable conclusion. | 품질 결론 불가 | Quality inconclusive | caution-review |
| `repair_exhausted` | Deterministic/agent recovery attempts were exhausted before a clean review envelope could be produced. Human review is required. | 복구 한도 초과 | Repair exhausted | critical-review |

`pocOutcome` classifies optional proof-of-concept validation. Deep analysis defaults to `poc_not_requested` when PoC was not part of the task.

| value | Meaning | ko-KR copy | en copy | UI tone |
|---|---|---|---|---|
| `poc_accepted` | PoC validation accepted/reproduced the vulnerable behavior. | PoC 재현 성공 | PoC accepted | confidence-boost |
| `poc_rejected` | PoC validation did not reproduce the claim; the associated claim may need review. | PoC 재현 실패 | PoC rejected | review |
| `poc_inconclusive` | PoC was attempted but could not reach a reliable conclusion. | PoC 결론 불가 | PoC inconclusive | caution-review |
| `poc_not_requested` | PoC was not requested or not applicable for this analysis path. | PoC 미요청 | PoC not requested | quiet / omit when space is limited |

Outcome colors/icons are S1-owned presentation choices, but S2 recommends not reusing vulnerability severity colors for non-severity outcomes. Use distinct neutral/caution/critical-review treatment rather than implying CVSS severity.

#### `recoveryTrace` schema and display

Current shared schema:

```ts
interface AgentRecoveryTraceEntry {
  deficiency?: string;
  action?: string;
  outcome?: string;
  detail?: string;
}
```

`recoveryTrace` is an optional array on REST `AnalysisResult`. It is public, bounded recovery/deficiency summary text from S3, preserved by S2 when present. S2 does not currently enforce a numeric item cap in backend code; "bounded" means S3 must not emit raw prompt/log dumps or unbounded internal traces. S1 should defensively render a compact first N entries (recommend 3 inline, expandable for more) and tolerate absent/empty arrays.

Recommended display pattern:

- condensed surfaces: show a single "복구 이력 있음 / Recovery trace available" chip when `recoveryTrace.length > 0`;
- detail surfaces: use an expandable accordion or timeline with `deficiency → action → outcome`, and put `detail` behind expansion;
- do not treat `recoveryTrace` as an error by itself. It is context for non-clean or recovered outcomes.

Localization: S2 currently preserves S3 text strings and does not emit locale variants or enum-kind/params for recoveryTrace. S1 may label the surrounding UI in ko/en, but should treat the inner strings as backend-provided technical summaries until a future structured-i18n WR exists.

#### `cleanPass` semantics

`cleanPass` is currently a **WS convenience field** on `analysis-deep-complete`, not a persisted field on REST `AnalysisResult`. REST consumers derive it as:

```ts
const cleanPass =
  result.status === "completed" &&
  result.analysisOutcome === "accepted_claims" &&
  result.qualityOutcome === "accepted";
```

All other combinations are non-clean and should be rendered as review/warning states rather than as failed transports. `pocOutcome` does not currently participate in the cleanPass boolean, but non-accepted PoC outcomes produce warnings and should be surfaced where relevant.

Recommended cleanPass display matrix:

| Condition | Primary copy ko-KR | Primary copy en | Recommended treatment |
|---|---|---|---|
| `cleanPass === true` | 분석 완료 | Analysis complete | success/complete |
| `qualityOutcome === "rejected"` | 품질 게이트 실패 | Quality gate failed | critical-review; show warnings/caveats |
| `qualityOutcome === "repair_exhausted"` | 자동 복구 한도 초과 | Automatic repair exhausted | critical-review; request human review |
| `qualityOutcome === "accepted_with_caveats"` | 주의 필요 · 조건부 통과 | Needs review · accepted with caveats | caution-review; show caveats |
| `analysisOutcome === "no_accepted_claims"` | 수용된 발견 없음 | No accepted findings | neutral-review; do not imply no vulnerabilities globally |
| `analysisOutcome === "inconclusive"` or `qualityOutcome === "inconclusive"` | 분석 결론 불가 | Analysis inconclusive | caution-review; suggest rerun/review |
| unknown/missing outcome on old rows | 결과 상태 확인 필요 | Outcome needs review | fallback-review |

Forward compatibility: live WS consumers may trust `payload.cleanPass` when present. REST consumers and historical-run views should derive it from enums. If future enum values appear, S1 must default to fallback-review, not success.

#### WS and REST consistency

- `analysis-deep-complete` currently includes `analysisOutcome?`, `qualityOutcome?`, `pocOutcome?`, and `cleanPass?`. In current S2 success paths these are populated, but the shared DTO remains optional for backward compatibility with older messages. `recoveryTrace` is **not** currently emitted on the WS complete payload; fetch REST result details for recovery trace.
- `analysis-quick-complete` currently contains `{ analysisId, buildTargetId?, executionId?, findingCount }` only. Quick analysis does not carry S3 result-level outcome fields.
- `analysis-error` currently contains `{ analysisId, buildTargetId?, executionId?, phase: "quick" | "deep", error, retryable, partial? }`. Error messages do not include outcome fields and S2 does not synthesize `analysisOutcome: "inconclusive"` for true task failures.
- REST `AnalysisResult` may include `analysisOutcome`, `qualityOutcome`, `pocOutcome`, and `recoveryTrace`. Old rows or non-Deep rows may omit them; S1 must treat absence as fallback-review / legacy-not-available rather than success.

#### Surface priority guidance for S1

S2's guidance is advisory; S1 owns layout and visual design. Recommended noise levels:

| Surface | Recommended outcome display | Noise level |
|---|---|---|
| Overview / SecurityPostureSection | One compact chip derived from `cleanPass`/quality outcome; avoid full enum table. | low |
| Report / ExecutiveSummary | Show cleanPass state, quality outcome, analysis outcome, and caveats/warnings summary. | medium-high |
| AnalysisHistory run table | Add compact outcome chip next to run status for Deep rows; fallback for legacy rows. | low-medium |
| StaticAnalysis latest/deep summary | Show all three outcome chips plus recovery-trace affordance when present. | medium |
| Detail/report drilldown | Show full enum copy, warnings, caveats, recoveryTrace accordion/timeline. | high |

Backwards compatibility: these fields are additive. Existing S1 screens that ignore them should continue to work, but may overstate clean completion if they rely only on `status: "completed"`. S1 can adopt incrementally; S2 recommends Report and AnalysisHistory first because they are most likely to misrepresent Deep quality.

#### Shared package and enum expansion policy

- Source of truth order remains: `services/shared/src/models.ts` / `dto.ts`, then mounted S2 behavior, then this document. This document should be updated with code changes.
- In the monorepo, `@aegis/shared` reflects `services/shared` source/build configuration; consumers should run shared/backend/frontend typecheck in their lane when adopting new fields.
- S1 may adopt fields surface-by-surface; simultaneous rollout across all pages is not required.
- Future enum additions are possible. Unknown values should be rendered as fallback-review / inconclusive-like, preserve the raw value for diagnostics, and never map to success by default.
- Possible future S3 additive fields include `confidenceScore`, richer evidence counts, repair counts, or structured recovery events. Treat them as future/additive unless a WR freezes them.

### 2.6.2 PoC facade outcome contract — `POST /api/analysis/poc` (S2→S1)

This subsection is the S2 answer to S1 WR `s1-to-s2-poc-facade-result-outcome-gating-pocoutcome-qualityoutcome-cleanpass`. The route remains a synchronous facade over S3 `generate-poc`; `success: true` means S2 received a schema-valid S3 completed envelope and does **not** by itself mean the generated PoC is cleanly accepted.

Request body is unchanged:

```ts
interface GeneratePocRequest {
  projectId: string;
  findingId: string;
}
```

Response data now forwards S3 result-level PoC outcomes alongside the generated/accepted PoC claim surface:

```ts
interface PocResponseData {
  findingId: string;
  poc: {
    statement: string;
    detail: string;
  };
  audit: {
    latencyMs: number;
    tokenUsage?: { prompt: number; completion: number };
  };

  /** S3 result.pocOutcome. Required on the S2 facade response. */
  pocOutcome: AgentPocOutcome;
  /** S3 result.qualityOutcome. Required on the S2 facade response. */
  qualityOutcome: AgentQualityOutcome;
  /** S3 result.cleanPass when present; otherwise S2 derives the conservative PoC-clean predicate. */
  cleanPass: boolean;
  /** S3 result.claimDiagnostics. Optional diagnostic surface for non-accepted claims. */
  claimDiagnostics?: AgentClaimDiagnosticsSummary;
}
```

S2 forwards `pocOutcome`, `qualityOutcome`, `cleanPass`, and `claimDiagnostics` for both accepted-claim and zero-claim completed envelopes. When S3 omits optional legacy outcome fields, S2 fills conservative defaults for backward compatibility:

- `pocOutcome`: defaults to `poc_accepted` only when an accepted PoC claim is present; otherwise `poc_inconclusive`.
- `qualityOutcome`: defaults to `accepted` only when an accepted PoC claim is present; otherwise `inconclusive`.
- `cleanPass`: uses S3 `result.cleanPass` when present; otherwise derives `pocOutcome === "poc_accepted" && qualityOutcome === "accepted"`.

Interpretation rules:

- Clean PoC pass is `pocOutcome === "poc_accepted" && qualityOutcome === "accepted" && cleanPass === true`.
- Non-clean outcomes (`poc_rejected`, `poc_inconclusive`, `qualityOutcome=accepted_with_caveats|rejected|inconclusive|repair_exhausted`, or `cleanPass=false`) are still transport/envelope success and should render as review-needed, not as HTTP failure.
- If future enum values appear, S1 must fall back to review/fallback tone and must not map unknown values to success.
- If `claimDiagnostics` is malformed at runtime, S2 omits that optional field rather than returning untyped `nonAcceptedClaims[]` records. The outcome fields remain authoritative for clean/non-clean PoC interpretation.

```ts
interface DynamicTestConfig {
  testType: "fuzzing" | "pentest";
  targetEcu: string;
  protocol: string;
  targetId: string;
  count?: number;
  strategy: "random" | "boundary" | "scenario";
}

interface DynamicTestResult {
  id: string;
  projectId: string;
  config: DynamicTestConfig;
  status: "pending" | "running" | "completed" | "failed" | "aborted";
  totalRuns: number;
  crashes: number;
  anomalies: number;
  findings: DynamicTestFinding[];
  createdAt: string;
}

interface DynamicTestFinding {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  type: "crash" | "anomaly" | "timeout";
  input: string;
  response?: string;
  description: string;
  llmAnalysis?: string;
}
```

```ts
interface Notification {
  id: string;
  projectId: string;
  type:
    | "analysis_complete"
    | "critical_finding"
    | "approval_pending"
    | "gate_failed"
    | "upload_complete"
    | "upload_failed"
    | "sdk_ready"
    | "sdk_failed"
    | "pipeline_complete"
    | "pipeline_failed";
  title: string;
  body: string;
  severity?: "critical" | "high" | "medium" | "low" | "info";
  jobKind?: "analysis" | "upload" | "sdk" | "pipeline" | "gate" | "approval" | "finding";
  resourceId?: string;
  correlationId?: string;
  read: boolean;
  createdAt: string;
}

type UserAccountStatus = "active" | "disabled";

interface User {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  role: "viewer" | "analyst" | "admin";
  accountStatus?: UserAccountStatus;
  organizationId?: string | null;
  organizationCode?: string | null;
  organizationName?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationVerifyPreview {
  orgId: string;
  code: string;
  name: string;
  admin: { displayName: string; email: string };
  region: string;
  defaultRole: "viewer" | "analyst" | "admin";
  emailDomainHint?: string;
}

type RegistrationRequestStatus = "pending_admin_review" | "approved" | "rejected";

interface RegistrationRequest {
  id: string;
  organizationId: string;
  organizationCode: string;
  organizationName: string;
  fullName: string;
  email: string;
  status: RegistrationRequestStatus;
  assignedRole?: "viewer" | "analyst" | "admin";
  approvedUserId?: string;
  decisionReason?: string;
  lookupExpiresAt: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}
```

```ts
interface ModuleReport {
  meta: {
    generatedAt: string;
    projectId: string;
    projectName: string;
    module: "static_analysis" | "dynamic_analysis" | "dynamic_testing" | "deep_analysis";
  };
  summary: {
    totalFindings: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  };
  runs: Array<{ run: Run; gate?: GateResult }>;
  findings: Array<{ finding: Finding; evidenceRefs: EvidenceRef[] }>;
  gateResults: GateResult[];
}

interface ProjectReport {
  generatedAt: string;
  projectId: string;
  projectName: string;
  modules: {
    static?: ModuleReport;
    dynamic?: ModuleReport;
    test?: ModuleReport;
    deep?: ModuleReport;
  };
  totalSummary: ModuleReport["summary"];
  approvals: ApprovalRequest[];
  auditTrail: AuditLogEntry[];
  customization?: {
    executiveSummary?: string;
    companyName?: string;
    logoUrl?: string;
    language?: string;
    reportTitle?: string;
  };
}
```

---

### 2.7 S2-owned LLM generation-control vocabulary

`services/shared/src/llm-sampling.ts` defines the shared TypeScript vocabulary S2 uses for
generation-control request fields. It intentionally preserves three distinct shapes instead of
creating one universal downstream contract:

```ts
interface GenerationControlFields {
  enableThinking: boolean;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  minP: number;
  presencePenalty: number;
  repetitionPenalty: number;
}

type S7TaskGenerationConstraints = GenerationControlFields;
type PartialS7TaskGenerationConstraints = Partial<S7TaskGenerationConstraints>;
type S3GenerationOverrides = Partial<GenerationControlFields>;
```

S2 semantics:

- **Core field vocabulary**: the eight fields above are the canonical camelCase names S2 uses at
  TypeScript/API-client boundaries.
- **S7 task path**: direct S2 calls to S7 `/v1/tasks` through `LlmTaskClient` must emit the full
  required tuple. S2 normalizes missing generation fields at the S7 client boundary.
- **S3 task paths**: S2-facing `AgentClient` and `BuildAgentClient` request types accept optional
  camelCase generation overrides because S3 owns named presets when callers omit them. S2 does not
  emit shared defaults to existing S2→S3 orchestration paths by default.

Current S2 S7 default tuple is:

```ts
{
  enableThinking: true,
  maxTokens: 16384,
  temperature: 0.6,
  topP: 0.95,
  topK: 20,
  minP: 0.0,
  presencePenalty: 0.0,
  repetitionPenalty: 1.0,
}
```

`maxTokens` acceptance range is `1..32768` in current S3/S7 public contracts, but S2's default
remains `16384` until a separate policy decision changes it. Current canonical S3/S7 API docs both
accept `topK >= -1`; S2 still keeps S7-required and S3-optional shapes separate because requiredness
and preset ownership differ by downstream. Timeout guidance remains separate from generation fields:
direct S2→S7 task calls use S2's ≤ `300000ms` timeout budget, while S2→S3 orchestration paths may use
S3-facing advisory timeouts up to `900000ms` where their canonical API contracts allow it.

## 3. REST surface contract

## 3.1 Project surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/projects` | `{ name: string; description?: string }` | `201 { success, data: Project }` | `201`, `400 name is required` |
| GET | `/api/projects` | - | `200 { success, data: ProjectListItem[] }` | `200` |
| GET | `/api/projects/:id` | - | `200 { success, data: Project }` | `200`, `404` |
| PUT | `/api/projects/:id` | `{ name?: string; description?: string }` | `200 { success, data: Project }` | `200`, `400 blank name`, `404` |
| DELETE | `/api/projects/:id` | - | `200 { success: true }` | `200`, `404`, `409 active blockers`, `500 db/quarantine failure` |
| GET | `/api/projects/:id/overview` | - | raw `ProjectOverviewResponse` | `200`, `404` |

Current mounted semantics:

- `PUT /api/projects/:id`
  - `name`이 전달되면 trim 후 저장
  - trim 결과 빈 문자열이면 `400 { success: false, error: "name is required" }`
- `DELETE /api/projects/:id`
  - raw row delete가 아니라 safe teardown workflow다.
  - success path:
    1. blocker check
    2. `uploads/{projectId}` quarantine
    3. project-scoped DB row delete
    4. DB 실패 시 uploads root restore
  - conflict path:
    - `409 CONFLICT`
    - `errorDetail.blockers` with currently authoritative blocker categories:
      - `activeAnalysis`
      - `connectedAdapters`
      - `activeDynamicSessions`
      - `runningDynamicTest`
      - `activeSdkRegistrations`
      - `activePipelineTargets`

`ProjectOverviewResponse` currently has this shape:

```ts
interface ProjectOverviewResponse {
  project: Project;
  fileCount: number;
  summary: {
    totalVulnerabilities: number;
    bySeverity: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
    };
    byModule: { static: number; dynamic: number; test: number };
  };
  targetSummary?: { total: number; ready: number; failed: number; running: number; discovered: number };
  recentAnalyses: AnalysisResult[];
  trend?: { newFindings: number; resolvedFindings: number; unresolvedTotal: number };
}
```

## 3.2 File surface (`UploadedFile` store)

These routes are DB-backed metadata/content routes, distinct from `/source/*` filesystem routes.

| Method | Path | Success | Status codes |
|---|---|---|---|
| GET | `/api/projects/:projectId/files` | `200 { success, data: UploadedFile[] }` | `200` |
| GET | `/api/files/:fileId/content` | `200 { success, data: { id, name, path, language, content } }` | `200`, `404` |
| GET | `/api/files/:fileId/download` | `200 text/plain` | `200`, `404` |
| DELETE | `/api/projects/:projectId/files/:fileId` | `200 { success: true }` | `200`, `404` |

## 3.3 Source upload / source tree surface

### Upload

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/projects/:pid/source/upload` | `multipart/form-data`, field name `file`, up to 200 files | `202 { success, data: { uploadId, status: "received" } }` | `202`, `400`, `404` |
| GET | `/api/projects/:pid/source/upload-status/:uploadId` | - | `200 { success, data: UploadStatus }` | `200`, `404` |

```ts
type UploadPhase = "received" | "extracting" | "indexing" | "complete" | "failed";

interface UploadStatus {
  uploadId: string;
  phase: UploadPhase;
  message: string;
  fileCount?: number;
  projectPath?: string;
  error?: string;
}
```

### Clone / browse / read / delete

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/projects/:pid/source/clone` | `{ gitUrl: string; branch?: string }` | `200 { success, data: { projectPath, fileCount, files } }` | `200`, `400`, `404` |
| GET | `/api/projects/:pid/source/files` | `?filter=source` optional | `200 { success, data: SourceFileEntry[], composition, totalFiles, totalSize, targetMapping? }` | `200`, `404` |
| GET | `/api/projects/:pid/source/file` | `?path=<relative-path>` | `200 { success, data: { path, content, size, language, fileType, previewable, lineCount? } }` | `200`, `400`, `404` |
| DELETE | `/api/projects/:pid/source` | - | `200 { success: true }` | `200` |

Notes:

- `filter=source` returns the backend's default C/C++ filtered set.
- no `filter` returns the full file tree.
- `targetMapping` is keyed by `relativePath` and contains `{ targetId, targetName }` when build targets exist.
- file-explorer/source-list output excludes the managed SDK subtree `uploads/{projectId}/sdk/**`.
  - this is a root-scoped managed-path rule, not a generic directory-name hide
  - normal project paths such as `src/sdk/*` remain visible

## 3.4 Build-target surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/targets` | - | `200 { success, data: BuildTarget[] }` | `200`, `404` |
| POST | `/api/projects/:pid/targets` | `{ name, relativePath, buildProfile, buildSystem?, includedPaths?, scriptHintPath? }` | `201 { success, data: BuildTarget }` | `201`, `400`, `404` |
| PUT | `/api/projects/:pid/targets/:id` | `{ name?, relativePath?, buildProfile?, buildSystem?, scriptHintPath?: string \| null }` | `200 { success, data: BuildTarget }` | `200`, `400`, `404` |
| DELETE | `/api/projects/:pid/targets/:id` | - | `200 { success: true }` | `200`, `404` |
| GET | `/api/projects/:pid/targets/:id/build-log` | - | `200 { success, data: { buildLog: string \| null, status: BuildTargetStatus, updatedAt: string } }` | `200`, `404` |
| POST | `/api/projects/:pid/targets/discover` | empty body | `200 { success, data: { discovered, created, targets, elapsedMs } }` | `200`, `400`, `404` |

`scriptHintPath` semantics (2026-05-06):

- Optional selected uploaded build-script hint for S3 Build Agent `context.trusted.build.scriptHintPath`.
- The path is relative to the **effective BuildTarget root**: if S2 uses an isolated `sourcePath`, it is relative to that isolated root; otherwise it is relative to `projectPath/buildTargetPath`.
- S2 validates the path on create/update: non-empty string, no absolute path, no Windows drive/UNC prefix, no backslashes, no NUL, no traversal, symlink-resolved containment inside the effective BuildTarget root, regular file only, max 20,000 bytes, valid UTF-8 text, and no NUL-containing content.
- `scriptHintPath: null` on PUT clears the saved hint.
- S2 forwards the path as reference-only material. The uploaded script must not be treated as directly executable by S1/S2/S3.

Validation enforced today:

- `relativePath` is required on create and must not contain `..`.
- `includedPaths` entries must not contain `..`.
- target update does **not** currently accept `includedPaths` changes.
- if `includedPaths` is sent to `PUT /api/projects/:pid/targets/:id`, the mounted backend now returns `400 InvalidInput` with `errorDetail.code = "INVALID_INPUT"` instead of silently ignoring the field.

## 3.5 Target-library surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/targets/:tid/libraries` | - | `200 { success, data: TargetLibrary[] }` | `200`, `404` |
| PATCH | `/api/projects/:pid/targets/:tid/libraries` | `{ libraries: Array<{ id: string; included: boolean }> }` | `200 { success, data: TargetLibrary[] }` | `200`, `400`, `404` |

## 3.6 SDK surface

### Project SDK routes

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/sdk` | - | `200 { success, data: { builtIn: SdkProfile[], registered: RegisteredSdk[] } }` | `200`, `404` |
| GET | `/api/projects/:pid/sdk/:id` | - | `200 { success, data: RegisteredSdk }` | `200`, `404` |
| GET | `/api/projects/:pid/sdk/quota` | - | `200 { success, data: { usedBytes, maxBytes, sdkCount } }` | `200`, `404` |
| GET | `/api/projects/:pid/sdk/metrics` | - | `200 { success, data: SdkMetrics }` | `200`, `404` |
| GET | `/api/projects/:pid/sdk/:id/log` | `?tailLines=<n>` or `?offset=<n>&limit=<n>`; `download=true` optional | JSON: `200 { success, data: { sdkId, logPath, content, truncated, totalLines, nextOffset? } }`; download: `text/plain` attachment | `200`, `404` |
| POST | `/api/projects/:pid/sdk/:id/retry` | `{ fromPhase?: "analyzing" | "verifying" }` | `202 { success, data: RegisteredSdk }` | `202`, `400`, `404` |
| POST | `/api/projects/:pid/sdk` | see note below | `202 { success, data: RegisteredSdk }` | `202`, `400`, `404` |
| DELETE | `/api/projects/:pid/sdk/:id` | - | `200 { success: true }` | `200`, `404` |

`POST /api/projects/:pid/sdk` mounted behavior today:

- required multipart field: `name`
- accepted ingress: multipart `file` upload (single archive, single `.bin`, or multi-file folder upload)
- `localPath` is no longer the canonical/requested ingress
- multiple uploaded files are treated as **folder upload** when the client preserves relative paths (for example via `webkitRelativePath`-derived filenames or explicit relative-path metadata)
- returned `RegisteredSdk.status` is initially `"uploaded"`, then the async pipeline advances through upload materialization / analyze / verify terminal states
- `.bin` installs materialize a canonical install log at `uploads/{projectId}/sdk/{sdkId}/install.log`
- `GET /api/projects/:pid/sdk/:id/log` is the HTTP recovery/read surface for install-log tail or paginated content; `download=true` returns a `text/plain` attachment.
- `POST /api/projects/:pid/sdk/:id/retry` reuses a retained/materialized failed SDK artifact, increments `retryCount`, and currently restarts from `verifying` or optional `analyzing`; unsupported/non-retained failures must still be re-uploaded.
- `GET /api/projects/:pid/sdk/quota` reports project SDK storage usage against `AEGIS_SDK_STORAGE_QUOTA_BYTES` (default 50 GiB).
- `GET /api/projects/:pid/sdk/metrics` returns aggregate SDK counts and average phase durations from persisted `phaseHistory`.
  - Current `SdkMetrics` fields: `totalRegistered`, `sdkCount` compatibility alias, `readyCount`, `failedCount`, `averagePhaseDurationMs`.
  - `averagePhaseDurationMs` is keyed by `SdkMetricsPhaseKey = SdkPhase` and omits phases with no recorded durations.
- `GET /api/projects/:pid/sdk/:id/log` returns server-side `logPath` for correlation/debugging plus log `content`; S1 should render the log content from the endpoint, not require users to SSH to the server path.
- `sdk-error.troubleshootingUrl` is a wiki-canonical anchor path derived from structured `code` (for example `wiki/canon/troubleshooting/sdk#extract-failed`).
- `DELETE /api/projects/:pid/sdk/:id` is project-scoped. If the SDK id exists but belongs to another project, S2 returns `404 NOT_FOUND` and does not delete it.

S2 → S3 Build Agent SDK materialization descriptor producer semantics (2026-05-08):

- When a BuildTarget uses a registered uploaded SDK (`buildProfile.sdkId` starts with `sdk-`) in SDK mode, S2 derives the Build Agent descriptor from `RegisteredSdk` rather than asking S1 for additional inputs.
- `build.sdkRootPath` is the project-owned materialized SDK root from `RegisteredSdk.path`. S2 verifies that it exists, is a directory, is non-empty, and remains inside `uploads/{projectId}/sdk/**` after realpath resolution.
- `RegisteredSdk.verified === true` is **not** required for descriptor production. The gate is materialization/usefulness of the project-owned root, not semantic SDK verification. States such as `extracted`, `installed`, `analyzing`, `verifying`, `ready`, and retained failed materialized states can be attempted when the root is usable; actively mutating ingress states (`uploading`, `uploaded`, `extracting`, `installing`) and `upload_failed` are not descriptor-ready.
- `build.setupScript` is derived from `RegisteredSdk.profile.environmentSetup` when present, exists, and resolves inside `sdkRootPath`; S2 emits it relative to `sdkRootPath`.
- `build.sysroot` is derived from `RegisteredSdk.profile.sysroot` under the same inside-root rule and is emitted relative to `sdkRootPath`.
- `build.toolchainTriplet` is derived from `RegisteredSdk.profile.compilerPrefix` with trailing dashes removed.
- `build.environment` contains descriptor-derived hints such as `AEGIS_SDK_ROOT`, `SDK_DIR`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, `SDKTARGETSYSROOT`, and `AEGIS_TOOLCHAIN_TRIPLET` when derivable.
- S2 does not emit legacy flat aliases (`setupScript`, `toolchainTriplet`, `buildEnvironment`) outside `context.trusted.build`, so S2 cannot create canonical/legacy descriptor conflicts.
- S2 does not infer SDK materialization from host defaults such as `/home/kosh/ti-sdk`; built-in SDK ids continue to carry `sdkId` only unless a future uploaded/materialized SDK association contract is added.
- `scriptHintPath`, when present, remains BuildTarget-root-relative and is still emitted only as `context.trusted.build.scriptHintPath`; inline script text aliases are not emitted.

### SDK profile lookup routes

| Method | Path | Success | Status codes |
|---|---|---|---|
| GET | `/api/sdk-profiles` | `200 SdkProfileListResponse` (`{ success: true, data: SdkProfile[] }`) | `200` |
| GET | `/api/sdk-profiles/:id` | `200 SdkProfileResponse` (`{ success: true, data: SdkProfile }`) | `200`, `404 { success: false, error: "SDK profile not found" }` |

## 3.7 Pipeline surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/projects/:pid/pipeline/prepare` | `{ targetIds?: string[] }` | `202 { success, data: { preparationId, status: "running" } }` | `202`, `404` |
| POST | `/api/projects/:pid/pipeline/prepare/:targetId` | empty body | `202 { success, data: { preparationId, targetId, status: "running" } }` | `202`, `404` |
| POST | `/api/projects/:pid/pipeline/run` | `{ targetIds?: string[] }` | `202 { success, data: { pipelineId, status: "running" } }` | `202`, `404` |
| POST | `/api/projects/:pid/pipeline/run/:targetId` | empty body | `202 { success, data: { pipelineId, targetId, status: "running" } }` | `202`, `404` |
| GET | `/api/projects/:pid/pipeline/status` | - | `200 { success, data: PipelineStatus }` | `200`, `404` |

```ts
type PipelinePhase = "setup" | "build" | "ready";

interface PipelineStatus {
  targets: Array<{
    id: string;
    name: string;
    status: BuildTargetStatus;
    phase: PipelinePhase;
    compileCommandsPath?: string;
    sastScanId?: string;
    codeGraphNodeCount?: number;
    lastBuiltAt?: string;
  }>;
  readyCount: number;
  failedCount: number;
  totalCount: number;
}
```

Current phase mapping is controller-derived:

- `setup`: `discovered | resolving | configured | resolve_failed`
- `ready`: `ready`
- `build`: everything else

Build-preparation note:

- `POST /pipeline/prepare*` is an additive explicit build-preparation surface.
- It currently reuses the existing target status model (`resolving`, `configured`, `building`, `built`, `build_failed`) and the same pipeline status recovery path:
  - `GET /api/projects/:pid/pipeline/status`
- No separate build-preparation WS family has been introduced in this slice.

## 3.8 Analysis surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/analysis/quick` | `{ projectId: string; buildTargetId: string }` | `202 { success, data: { analysisId, buildTargetId, executionId, status: "running" } }` | `202`, `400`, `404` |
| POST | `/api/analysis/deep` | `{ projectId: string; buildTargetId: string; executionId: string }` | `202 { success, data: { analysisId, buildTargetId, executionId, status: "running" } }` | `202`, `400`, `404` |
| GET | `/api/analysis/status` | - | `200 { success, data: AnalysisProgress[] }` | `200` |
| GET | `/api/analysis/status/:analysisId` | - | `200 { success, data: AnalysisProgress }` | `200`, `404` |
| POST | `/api/analysis/abort/:analysisId` | - | `200 { success, data: { analysisId, status: "aborted" } }` | `200`, `404` |
| GET | `/api/analysis/results` | `?projectId=<id>` | `200 { success, data: AnalysisResult[] }` | `200`, `400` |
| GET | `/api/analysis/results/:analysisId` | - | `200 { success, data: AnalysisResult }` | `200`, `404` |
| DELETE | `/api/analysis/results/:analysisId` | - | `200 { success: true }` | `200`, `404` |
| GET | `/api/analysis/summary` | `?projectId=<id>&period=30d` | `200 { success, data: StaticAnalysisDashboardSummary }` | `200`, `400` |
| POST | `/api/analysis/poc` | `{ projectId: string; findingId: string }` | `200 { success, data: { findingId, poc, audit } }` | `200`, `400`, `404`, `502` |

- `POST /api/analysis/quick`
  - BuildTarget-only 실행 요청이다.
  - `buildTargetId` 필수
  - legacy `mode`, `targetIds`, project-only payload는 `400 INVALID_INPUT`
  - `BuildTarget.sdkChoiceState` is the canonical frontend preflight field for SDK choice.
  - 현재 runtime에서는 BuildTarget의 SDK choice가 명시적으로 확정(`sdk-selected` 또는 `sdk-none-explicit`)되지 않으면 Quick가 거부된다.
  - `sdk-unresolved` means S1 should disable Quick and explain that SDK choice must be selected or explicitly set to no-SDK/native.
- `POST /api/analysis/deep`
  - `buildTargetId` 필수
  - `executionId` 필수
  - legacy `quickAnalysisId` payload는 `400 INVALID_INPUT`
  - Deep는 해당 BuildTarget의 same-lineage Quick 3단계(build-prep, GraphRAG ingest, one S4 scan)가 모두 성공한 execution에서만 허용된다.

Compatibility note:
- `POST /api/analysis/run`은 cutover 후 더 이상 mounted되지 않는다.
- Project는 실행 단위가 아니라 aggregate read scope일 뿐이며, analysis execution API는 BuildTarget identity 없이 호출할 수 없다.

`GET /api/analysis/summary` notes:

- `period` defaults to `30d`.
- `all` disables the lower-bound date.
- unsupported period strings currently degrade to `all` behavior.

## 3.9 Dynamic-test surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/dynamic-test/run` | `{ projectId, config, adapterId, testId? }` | `200 { success, data: DynamicTestResult }` | `200`, `400` |
| GET | `/api/dynamic-test/results` | `?projectId=<id>` | `200 { success, data: DynamicTestResult[] }` | `200`, `400` |
| GET | `/api/dynamic-test/results/:testId` | - | `200 { success, data: DynamicTestResult }` | `200`, `404` |
| DELETE | `/api/dynamic-test/results/:testId` | - | `200 { success: true }` | `200`, `404` |

Validation rules enforced today:

- `config.testType` must be `fuzzing | pentest`.
- `config.strategy` must be `random | boundary | scenario`.
- if `strategy === "random"`, `count` must be `1..1000`.

## 3.10 Report surface

### Built-in reports

| Method | Path | Query | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/report` | `severity,status,runId,from,to` optional | `200 { success, data: ProjectReport }` | `200`, `404` |
| GET | `/api/projects/:pid/report/static` | same filters | `200 { success, data: ModuleReport }` | `200`, `404` |
| GET | `/api/projects/:pid/report/dynamic` | same filters | `200 { success, data: ModuleReport }` | `200`, `404` |
| GET | `/api/projects/:pid/report/test` | same filters | `200 { success, data: ModuleReport }` | `200`, `404` |

Query parsing rules:

- `severity` and `status` are comma-separated lists.
- `runId`, `from`, `to` are optional single strings.

### Custom report

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/projects/:pid/report/custom` | see body below | `200 { success, data: ProjectReport }` | `200`, `404` |

```ts
interface CustomReportRequest {
  filters?: {
    severity?: string[];
    status?: string[];
    runId?: string;
    from?: string;
    to?: string;
  };
  findingIds?: string[];
  includeSections?: {
    executiveSummary?: boolean;
    static?: boolean;
    dynamic?: boolean;
    test?: boolean;
    deep?: boolean;
    approvals?: boolean;
    auditTrail?: boolean;
  };
  customization?: {
    executiveSummary?: string;
    companyName?: string;
    logoUrl?: string;
    language?: string;
    reportTitle?: string;
  };
}
```

## 3.11 Notification surface

| Method | Path | Success | Status codes |
|---|---|---|---|
| GET | `/api/projects/:pid/notifications` | `200 { success, data: Notification[] }` | `200` |
| GET | `/api/projects/:pid/notifications?unread=true` | `200 { success, data: Notification[] }` | `200` |
| GET | `/api/projects/:pid/notifications/count` | `200 { success, data: { unread: number } }` | `200` |
| PATCH | `/api/projects/:pid/notifications/read-all` | `200 { success: true }` | `200` |
| PATCH | `/api/notifications/:id/read` | `200 { success: true }` | `200` |

Current `Notification` payload semantics:

```ts
interface Notification {
  id: string;
  projectId: string;
  type:
    | "analysis_complete"
    | "critical_finding"
    | "approval_pending"
    | "gate_failed"
    | "upload_complete"
    | "upload_failed"
    | "sdk_ready"
    | "sdk_failed"
    | "pipeline_complete"
    | "pipeline_failed";
  title: string;
  body: string;
  severity?: Severity;
  jobKind?: "analysis" | "upload" | "sdk" | "pipeline" | "gate" | "approval" | "finding";
  resourceId?: string;
  correlationId?: string;
  read: boolean;
  createdAt: string;
}
```

Important clarification:

- `type` is the **exact notification category** emitted by S2.
- `jobKind` is the **exact async-flow/domain kind** when the same notification channel spans upload/sdk/pipeline/analysis/gate/etc.
- `resourceId` is the durable resource identifier carried by the notification.
- `correlationId` is the foreground/live-flow correlation key when one exists (for example `uploadId`, `sdkId`, `pipelineId`).

## 3.12 Auth surface

### Route matrix

| Access | Method | Path | Notes |
|---|---|---|---|
| public | POST | `/api/auth/login` | `username` field is a compatibility name; backend resolves exact `username` first, then normalized `email` |
| public | POST | `/api/auth/logout` | token optional; remains public for brownfield compatibility |
| public | GET | `/api/auth/orgs/:code/verify` | org code preview for signup UX |
| public | POST | `/api/auth/register` | creates pending registration request and returns lookup token |
| public | GET | `/api/auth/registrations/lookup/:lookupToken` | public bearer-style lookup using high-entropy token, not internal id |
| public | POST | `/api/auth/password-reset/request` | always returns generic `202 { accepted: true }` |
| public | GET | `/api/auth/dev/password-reset/latest?email=` | non-production mock bridge: returns latest active reset token for the email when dev bridge is enabled |
| public | POST | `/api/auth/password-reset/confirm` | consumes reset token and rotates password |
| authenticated | GET | `/api/auth/me` | current session identity |
| admin-only | GET | `/api/auth/users` | org-admin sees same-org users only; platform-admin (`organizationId = null`) may see all |
| admin-only | GET | `/api/auth/registration-requests` | list registration requests for same org unless platform-admin bypass applies |
| admin-only | GET | `/api/auth/registration-requests/:id` | request detail |
| admin-only | POST | `/api/auth/registration-requests/:id/approve` | assign role + approve; approval makes account login-capable immediately |
| admin-only | POST | `/api/auth/registration-requests/:id/reject` | terminal rejection |

### Request / response shapes

```ts
interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    expiresAt: string;
    user: User;
  };
  error?: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  orgCode: string;
  termsAcceptedAt: string;
  auditAcceptedAt: string;
}

interface RegisterResponse {
  success: boolean;
  data?: {
    registrationId: string;
    lookupToken: string;
    lookupExpiresAt: string;
    status: RegistrationRequestStatus;
    createdAt: string;
  };
  error?: string;
}

interface PasswordResetRequestBody {
  email: string;
}

interface PasswordResetConfirmBody {
  token: string;
  newPassword: string;
}

interface DevPasswordResetDeliveryResponse {
  success: boolean;
  data?: {
    available: boolean;
    delivery?: DevPasswordResetDelivery;
  };
  error?: string;
}
```

### Frozen v1 semantics
- `rememberMe=false` => default session TTL `24h`
- `rememberMe=true` => extended session TTL `30d`
- login rate limit: `10/min/IP`, `10/10min/identifier`
- registration lookup token TTL `30d`
- password reset token TTL `1h`
- password reset request rate limit:
  - `5/min/IP`
  - `3/hour/email`
- issuing a new password reset token revokes older unconsumed reset tokens for that user
- successful password reset consumes the presented token, revokes any remaining outstanding reset tokens, and invalidates all active sessions for that user
- registration approve/reject/lookup responses return the full shared `RegistrationRequest` shape; `organizationCode` / `organizationName` are populated for the requester-visible organization.
- non-production mock bridge defaults:
  - `AEGIS_AUTH_DEV_FIXTURES=true` (default-on only when `NODE_ENV` is `development` or `test`)
  - `AEGIS_AUTH_DEV_PASSWORD_RESET_BRIDGE=true` (default-on only when `NODE_ENV` is `development` or `test`)
  - fixture org-admin password defaults to `Admin1234!` unless `AEGIS_AUTH_DEV_ADMIN_PASSWORD` overrides it
  - seeded org/admin fixtures: `ACME-KR-SEC`/`acme-admin`, `HYUNDAI-AVSEC`/`hyundai-admin`, `LG-EV-SECOPS`/`lges-admin`
  - `GET /api/auth/dev/password-reset/latest?email=` reads the latest active token from SQLite `dev_password_reset_deliveries` for frontend mock-to-real bridging
- org verify rate limit: `10/min/IP`
- registration submit rate limit:
  - `5/min/IP`
  - `3 active pending requests / 24h / email`
- `Invite` is **not** part of v1 auth lifecycle.
- Password is collected at registration-request time.
- Org-admin approval makes the account login-capable immediately.
- Public registration lookup uses `lookupToken`; raw internal ids are not accepted as public lookup credentials.
- `/api/auth/users` is no longer public even when soft-auth mode is enabled.

### Brownfield compatibility notes
- Existing `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me` remain mounted.
- The login request field keeps the name `username` to minimize S1 churn, but its v1 meaning is now “login identifier”.
- Platform-admin bypass is transitional: pre-provisioned legacy/system admins with `organizationId = null` may review across organizations until a later admin-model cleanup.

## 3.13 Additional mounted REST surfaces

### Project settings / adapters

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/settings` | - | `200 { success, data: ProjectSettings }` | `200` |
| PUT | `/api/projects/:pid/settings` | partial project settings | `200 { success, data: ProjectSettings }` | `200` |
| GET | `/api/projects/:pid/adapters` | - | `200 { success, data: Adapter[] }` | `200` |
| POST | `/api/projects/:pid/adapters` | `{ name, url }` | `201 { success, data: Adapter }` | `201`, `400` |
| PUT | `/api/projects/:pid/adapters/:id` | `{ name?, url? }` | `200 { success, data: Adapter }` | `200`, `400`, `404` |
| DELETE | `/api/projects/:pid/adapters/:id` | - | `200 { success: true }` | `200`, `404` |
| POST | `/api/projects/:pid/adapters/:id/connect` | - | `200 { success, data: Adapter }` | `200`, `404` |
| POST | `/api/projects/:pid/adapters/:id/disconnect` | - | `200 { success, data: Adapter }` | `200`, `404` |

Validation notes:

- adapter `url` must currently start with `ws://` or `wss://`.
- project settings validation is service-driven rather than controller-driven.

### Runs / findings / gates / approvals / activity

```ts
interface FindingsSummary {
  total: number;
  bySeverity: Partial<Record<Severity, number>>;
  byStatus: Partial<Record<FindingStatus, number>>;
}

interface FindingSummaryResponse {
  success: boolean;
  data: FindingsSummary;
}
```

`FindingsSummary` is the exact aggregate shape currently emitted by
`GET /api/projects/:pid/findings/summary`. S2 does not currently emit `byModule`,
`byRuleId`, `recentDelta`, `acceptedCount`, or `dismissedCount` from this endpoint.
If S2 adds those aggregate fields later, they must be added to `FindingsSummary`
and this contract before S1 renders them.

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/runs` | - | `200 { success, data: Run[] }` | `200` |
| GET | `/api/runs/:id` | - | `200 { success, data: RunDetail }` | `200`, `404` |
| GET | `/api/projects/:pid/findings` | query `status,severity,module,sourceType,q,sort,order` optional | `200 { success, data: Finding[] }` | `200`, `400` |
| GET | `/api/projects/:pid/findings/summary` | - | `200 { success, data: FindingsSummary }` | `200` |
| GET | `/api/projects/:pid/findings/groups` | query `groupBy=ruleId|location` | `200 { success, data: Array<{ key, count, topSeverity, findingIds }> }` | `200`, `400` |
| PATCH | `/api/findings/bulk-status` | `{ findingIds, status, reason, actor? }` | `200 { success, data: { updated, failed } }` | `200`, `400` |
| GET | `/api/findings/:id/history` | - | `200 { success, data: FindingHistoryEntry[] }` | `200`, `404` |
| GET | `/api/findings/:id` | - | `200 { success, data: FindingDetail }` | `200`, `404` |
| PATCH | `/api/findings/:id/status` | `{ status, reason, actor? }` | `200 { success, data: Finding }` | `200`, `400`, `404` |
| GET | `/api/projects/:pid/gates` | - | `200 { success, data: GateResult[] }` | `200` |
| GET | `/api/projects/:pid/gates/runs/:runId` | - | `200 { success, data: GateResult }` | `200`, `404` |
| GET | `/api/gates/:id` | - | `200 { success, data: GateResult }` | `200`, `404` |
| POST | `/api/gates/:id/override` | `{ reason, actor? }` | `201 { success, data: ApprovalRequest }` | `201`, `400`, `404`, `409` |
| GET | `/api/projects/:pid/approvals/count` | - | `200 { success, data: { pending, total } }` | `200` |
| GET | `/api/projects/:pid/approvals` | query `status=pending` optional | `200 { success, data: ApprovalRequest[] }` | `200` |
| GET | `/api/approvals/:id` | - | `200 { success, data: ApprovalRequest }` | `200`, `404` |
| POST | `/api/approvals/:id/decide` | `{ decision, comment?, actor? }` | `200 { success, data: ApprovalRequest }` | `200`, `400`, `404` |
| GET | `/api/projects/:pid/activity` | query `limit=1..50` optional | `200 { success, data: ActivityEntry[] }` | `200` |



#### Gate / approval additive mock-absorption fields (S1 WR 2026-04-26)

S2 now exposes the QualityGate / Approvals mock-derived signals as additive shared fields. Existing consumers may ignore them; S1 should prefer these fields over frontend-side threshold maps or commit/branch derivation. Historical rows may omit them.

```ts
type GateRuleMetricUnit = "count" | "percent";

interface GateRuleMetric {
  current: number;
  threshold: number;
  unit?: GateRuleMetricUnit;
}

interface GateRuleResult {
  ruleId: GateRuleId;
  result: "passed" | "failed" | "warning";
  message: string;
  linkedFindingIds: string[];
  current?: number;
  threshold?: number;
  unit?: GateRuleMetricUnit;
  meta?: GateRuleMetric;
}

interface GateResult {
  id: string;
  runId: string;
  projectId: string;
  status: GateStatus;
  rules: GateRuleResult[];
  profileId?: string;
  commit?: string;
  branch?: string;
  requestedBy?: string;
  evaluatedAt: string;
  override?: { overriddenBy: string; reason: string; approvalId: string; overriddenAt: string };
  createdAt: string;
}

interface ApprovalImpactSummary {
  failedRules: number;
  ignoredFindings: number;
  severityBreakdown?: Record<string, number>;
}

type ApprovalTargetSnapshot =
  | { runId: string; commit?: string; branch?: string; profile?: string; action?: ApprovalActionType }
  | { findingId: string; file?: string; line?: number; severity?: Severity };

interface ApprovalRequest {
  id: string;
  actionType: ApprovalActionType;
  requestedBy: string;
  targetId: string;
  projectId: string;
  reason: string;
  status: ApprovalStatus;
  impactSummary?: ApprovalImpactSummary;
  targetSnapshot?: ApprovalTargetSnapshot;
  decision?: { decidedBy: string; decidedAt: string; comment?: string };
  expiresAt: string;
  createdAt: string;
}
```

Current S2 population rules:

- `GateRuleResult.current` / `threshold` / `unit` are emitted from backend policy evaluation. Current units are `count` for `no-critical`, `high-threshold`, `sandbox-unreviewed`; `percent` for `evidence-coverage` (`100` threshold). `meta` mirrors the same values for grouped consumers.
- `GateResult.profileId` is the actual policy profile id used for evaluation (`default`, `strict`, `relaxed`, or a configured profile id when available).
- `GateResult.requestedBy` is currently `system` for automatic run-completion gate evaluation unless a future caller-owned trigger path supplies a real actor.
- `GateResult.commit` / `branch` are persisted and returned when S2 knows them; current automatic evaluation does not synthesize them from frontend state. S1 must render placeholders when absent.
- `POST /api/gates/:id/override` creates `ApprovalRequest.impactSummary` and `targetSnapshot` from the target gate. `targetSnapshot.profile` maps to `GateResult.profileId`.
- `finding.accepted_risk` approval creation paths populate `impactSummary` as one ignored finding with a severity breakdown and `targetSnapshot` as `{ findingId, file?, line?, severity? }` when the finding is visible.
- All additions preserve the canonical `{ success, data }` envelope and do not change status codes.

Mock source mapping: Quality Gate mock threshold cards map to `GateRuleResult.current/threshold/unit`; gate card profile/commit/branch/user map to `GateResult.profileId/commit/branch/requestedBy`; Approvals list/panel impact blocks map to `ApprovalRequest.impactSummary`; detail-pane rows map to `ApprovalRequest.targetSnapshot`.

Notable current behavior:

- `/api/projects/:pid/approvals?status=` only special-cases `pending`; other values currently fall back to the full list.
- invalid `limit` on `/api/projects/:pid/activity` falls back to the default (`10`) instead of producing `400`.

### Dynamic-analysis surface

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/dynamic-analysis/sessions` | `{ projectId, adapterId }` | `201 { success, data: DynamicAnalysisSession }` | `201`, `400` |
| GET | `/api/dynamic-analysis/sessions` | query `projectId` optional | `200 { success, data: DynamicAnalysisSession[] }` | `200` |
| GET | `/api/dynamic-analysis/sessions/:id` | - | `200 { success, data: DynamicAnalysisSession }` | `200`, `404` |
| POST | `/api/dynamic-analysis/sessions/:id/start` | - | `200 { success, data: DynamicAnalysisSession }` | `200`, `400` |
| DELETE | `/api/dynamic-analysis/sessions/:id` | - | `200 { success, data: DynamicAnalysisSession }` | `200`, `404` |
| GET | `/api/dynamic-analysis/scenarios` | - | `200 { success, data: AttackScenario[] }` | `200` |
| POST | `/api/dynamic-analysis/sessions/:id/inject` | `{ canId, dlc, data, label? }` | `200 { success, data: CanInjectionResponse }` | `200`, `400` |
| POST | `/api/dynamic-analysis/sessions/:id/inject-scenario` | `{ scenarioId }` | `200 { success, data: CanInjectionResponse[] }` | `200`, `400` |
| GET | `/api/dynamic-analysis/sessions/:id/injections` | - | `200 { success, data: CanInjectionResponse[] }` | `200` |

### Health surface

`GET /health` returns a bare JSON object, not the default success envelope.
`requestId` query parameter is optional; when present, S2 forwards it to downstream `/v1/health`
surfaces and exposes normalized polling guidance for any request-aware summary fields.

```ts
interface HealthControlSummary {
  activeRequestCount: number | null;
  requestId: string | null;
  endpoint: string | null;
  state: "idle" | "queued" | "running" | "completed" | "failed" | "cancelled" | "expired";
  localAckState: "phase-advancing" | "transport-only" | "ack-break" | null;
  degraded: boolean;
  degradeReasons: string[];
  lastAckAt: number | null;
  lastAckSource: string | null;
  blockedReason: string | null;
  pollDecision: "continue_waiting" | "chain_abort" | "no_active_request" | "inconclusive";
  decisionReasons: string[];
}

interface ServiceHealth {
  status: "ok" | "degraded" | "unreachable";
  detail?: Record<string, unknown>;
  control?: HealthControlSummary;
}

interface HealthResponse {
  service: string;
  status: "ok" | "degraded" | "unhealthy";
  version: string;
  controlPolicyVersion?: "health-control-signal-rollout-v2";
  requestIdQueried?: string;
  detail: { version: string; uptime: number };
  llmGateway?: ServiceHealth;
  analysisAgent?: ServiceHealth;
  sastRunner?: ServiceHealth;
  knowledgeBase?: ServiceHealth;
  buildAgent?: ServiceHealth;
  adapters: { total: number; connected: number };
}
```

Normalization note:
- S2 keeps coarse service status (`ok | degraded | unreachable`) separate from request-aware control state.
- When downstream health includes the frozen `requestSummary` fields, S2 computes `control.pollDecision`.
- `queued`, `running + phase-advancing`, `running + transport-only`, and `degraded=true` without ack-break/blocked map to `continue_waiting`.
- `failed`, `cancelled`, `expired`, `localAckState="ack-break"`, or non-null `blockedReason` map to `chain_abort`.
- `completed` maps to `no_active_request`; it only means an owned request reached terminal completion and must not be interpreted as clean success. Callers must inspect the result-level fields for the specific operation (`cleanPass`, `analysisOutcome`, `qualityOutcome`, `pocOutcome`, `buildOutcome`, S4 build/readiness fields, etc.).
- Legacy S4 `requestSummary.ackStatus="broken"` is normalized to `localAckState="ack-break"`.

Health-control v2 S2 consumer scope (2026-05-08):
- S2 direct S4 build/scan calls use S4 durable ownership mode (`Prefer: respond-async` + operation-scoped child `X-Request-Id`), then poll `/v1/requests/{requestId}/result` until an explicit terminal result/failure is retrievable.
- S2 does not use elapsed request age as an abort reason on that S4 ownership path. A submit transport timeout is recoverable when `/v1/health?requestId=...` proves the owned S4 request is still alive or terminal-completed with retrievable result ownership.
- Explicit local cancellation is propagated as an `AbortSignal` through S2's S4 wait loop and S2 now best-effort calls S4 `DELETE /v1/requests/{requestId}` for the derived durable S4 ownership id. A successful S4 cancel returns `202` for queued/running requests or `200` for already-terminal idempotent requests; S2 still treats the local operation as cancelled and logs non-retained `404`/`410` cancel responses as best-effort cleanup misses.
- Direct S2→S7 `/v1/tasks` and S2→S3 `/v1/tasks` remain finite compatibility task surfaces unless those owner lanes publish status/result/cancel ownership endpoints for S2 to consume. S2 still forwards `requestId` to their `/v1/health` summaries for user-facing progress and aggregate control guidance.

---

## 4. WebSocket surface contract

### 4.1 Transport rules

Backend WS broadcasters serialize messages as JSON and automatically append:

```ts
interface WsEnvelopeMeta {
  channel: "dynamic-analysis" | "dynamic-test" | "analysis" | "upload" | "pipeline" | "sdk" | "notification";
  projectId?: string;
  timestamp: number;
  seq?: number;
}
```

Actual runtime behavior today:

- payloads are sent as `{ ...message, meta }`.
- `meta.projectId` is the broadcaster subscription key.
  - project-scoped channels: real `projectId` (`/ws/notifications`, `/ws/pipeline`, `/ws/sdk`)
  - `/ws/dynamic-analysis`: current value is `sessionId`
  - `/ws/upload`: current value is `uploadId`
  - `/ws/analysis`: current value is `analysisId`
  - `/ws/dynamic-test`: current value is `testId`

S1 should therefore treat `meta.projectId` as routing metadata, not as a guaranteed real project id on non-project-scoped channels.

Subscribe-time snapshot behavior:

- `/ws/upload?uploadId=` sends the current in-memory upload snapshot immediately on subscribe when the upload status is still retained.
- `/ws/analysis?analysisId=` sends the current `AnalysisTracker` snapshot immediately on subscribe when the analysis tracker still retains it.
- Other WS channels currently do not provide a backend-owned subscribe-time replay snapshot.
- These snapshots are convenience recovery aids, not durable histories. The REST recovery endpoints in §4.9 remain authoritative after navigation/reconnect.

### 4.2 Dynamic-analysis WS — `/ws/dynamic-analysis?sessionId=<sessionId>`

| `type` | Payload |
|---|---|
| `message` | `CanMessage` |
| `alert` | `DynamicAlert` |
| `status` | `{ messageCount, alertCount }` |
| `injection-result` | `CanInjectionResponse` |
| `injection-error` | `{ error }` |

### 4.3 Upload WS — `/ws/upload?uploadId=<uploadId>`

| `type` | Payload |
|---|---|
| `upload-progress` | `{ uploadId, phase: "received" \| "extracting" \| "indexing", message, fileCount? }` |
| `upload-complete` | `{ uploadId, fileCount, projectPath }` |
| `upload-error` | `{ uploadId, phase: "failed", error }` |

Role and recovery:

- **Foreground role**: live upload progress while the user stays on the upload/source-management flow.
- **Terminal signals**: `upload-complete`, `upload-error`.
- **Background completion awareness**: a project notification is also emitted with:
  - success → `type: "upload_complete", jobKind: "upload", resourceId: uploadId, correlationId: uploadId`
  - failure → `type: "upload_failed", jobKind: "upload", resourceId: uploadId, correlationId: uploadId`
- **Recovery / re-entry source of truth**: `GET /api/projects/:pid/source/upload-status/:uploadId`
  - this is a last-known-status fallback snapshot (current implementation: in-memory, ~30 minute retention), not an indefinitely durable history surface.
  - a fresh `/ws/upload?uploadId=` subscriber also receives that same retained snapshot when present.

### 4.4 Pipeline WS — `/ws/pipeline?projectId=<projectId>`

| `type` | Payload |
|---|---|
| `pipeline-target-status` | `{ pipelineId, projectId, targetId, targetName, status: BuildTargetStatus, message, phase: "setup" \| "build" \| "ready" }` |
| `pipeline-complete` | `{ pipelineId, projectId, readyCount, failedCount, totalCount }` |
| `pipeline-error` | `{ pipelineId, projectId, targetId, targetName, phase, error }` |

Implementation note:

- `pipeline-error.phase` is currently emitted from the catch path and should be treated as a coarse phase indicator, not a guaranteed exact failing step.
- `pipelineId` is the foreground/background correlation key for a single pipeline execution, while the subscription key remains `projectId`.

Role and recovery:

- **Foreground role**: target-by-target lifecycle stream, not a single scalar progress bar contract.
- **Terminal signals**:
  - `pipeline-complete` always fires at run end with `{ readyCount, failedCount, totalCount }`
  - `pipeline-error` fires per failed target during the run
- **Background completion awareness**:
  - success → `type: "pipeline_complete", jobKind: "pipeline", resourceId: pipelineId, correlationId: pipelineId`
  - partial/failed terminal outcome → `type: "pipeline_failed", jobKind: "pipeline", resourceId: pipelineId, correlationId: pipelineId`
- **Recovery / re-entry source of truth**: `GET /api/projects/:pid/pipeline/status`
  - authoritative after navigation/reconnect
  - returns current target statuses/phases for the project rather than replaying an old WS stream.

### 4.5 SDK WS — `/ws/sdk?projectId=<projectId>`

| `type` | Payload |
|---|---|
| `sdk-progress` | `{ sdkId, phase: "uploading" \| "uploaded" \| "extracting" \| "extracted" \| "installing" \| "installed" \| "analyzing" \| "verifying" \| "ready", message, percent?, uploadedBytes?, totalBytes?, fileName?, etaSeconds?, phaseStartedAt?, phaseDetail? }` |
| `sdk-log` | `{ sdkId, timestamp, source: "aegis" \| "installer", kind: "lifecycle" \| "heartbeat" \| "output" \| "terminal", stream?: "stdout" \| "stderr", message, logPath? }` |
| `sdk-complete` | `{ sdkId, profile, path? }` |
| `sdk-error` | `{ sdkId, phase: "upload_failed" \| "extract_failed" \| "install_failed" \| "verify_failed", error, logPath?, code?, retryable?, recoverable?, troubleshootingUrl?, userMessage?, technicalDetail?, failedAt?, correlationId? }` |

Normative UI mapping:

- S2 emits the 9 progress phases as backend state-machine facts. S1 may group them into the mock 5-step stepper as:

| UI step | S2 phases |
|---|---|
| 업로드 | `uploading`, `uploaded` |
| 설치/압축해제 | `extracting`, `extracted`, `installing`, `installed` |
| AI 분석 | `analyzing` |
| 검증 | `verifying` |
| 완료 | `ready` |

- The grouping is a frontend presentation decision, but this table is S2-approved and aligned with the current implementation.
- Current phase flows differ by `artifactKind`:
  - `archive`: `uploading → uploaded → extracting → extracted → analyzing → verifying → ready`
  - `bin`: `uploading → uploaded → installing → installed → analyzing → verifying → ready`
  - `folder`: `uploading → uploaded → extracting → extracted → analyzing → verifying → ready`
- A phase may be absent when that artifact kind does not require it; S1 should not render a missing backend phase as an error by itself.
- `sdk-progress.etaSeconds` is currently emitted for live upload progress only, computed from observed upload byte rate. S2 intentionally omits ETA for extract/install/analyze/verify when it cannot produce a reliable estimate.
- `sdk-progress.phaseStartedAt` is backend epoch-ms for the current phase when available. `RegisteredSdk.currentPhaseStartedAt` and `RegisteredSdk.phaseHistory` are persisted for REST/reconnect recovery.
- `phaseDetail` is additive structured detail shaped as `{ kind, params? }`. Current kinds include upload/materialization/analyze/verify/ready variants such as `sdk.uploaded`, `sdk.extracting.archive`, `sdk.installing.bin`, and retry variants like `sdk.verifying.retry`.
- `message` remains human-readable ko-KR backend text. S1 should prefer `phaseDetail.kind + params` for future i18n and treat `message` as display fallback.
- `fileName` is optional. It is emitted for upload progress, `uploaded`, archive `extracting`, and `.bin` `installing`; it is not guaranteed for `analyzing`, `verifying`, or `ready`. It is a sanitized display basename / submitted filename, not an absolute server path. Long-name truncation is S1 responsibility.
- `sdk-error.code` is the structured SDK-domain error code (`SdkErrorCode`). `retryable` and `recoverable` are currently identical booleans from S2 retry policy; S1 may use either as a CTA gate but should prefer `retryable` for retry UI.

Role and recovery:

- **Foreground role**: live SDK registration/verification state machine within project-scoped SDK UI.
- **Terminal signals**:
  - `sdk-complete`
  - `sdk-error`
- **Background completion awareness**:
  - success → `type: "sdk_ready", jobKind: "sdk", resourceId: sdkId, correlationId: sdkId`
  - failure → `type: "sdk_failed", jobKind: "sdk", resourceId: sdkId, correlationId: sdkId`
- **Recovery / re-entry source of truth**:
  - `GET /api/projects/:pid/sdk/:id` for a single SDK, including `currentPhaseStartedAt`, `phaseHistory`, `retryCount`, `retryable`, `retryExpiresAt`
  - `GET /api/projects/:pid/sdk` for collection/list recovery
  - `GET /api/projects/:pid/sdk/:id/log` for install-log tail/paginated recovery
  - `GET /api/projects/:pid/sdk/quota` for project SDK storage summary
  - `GET /api/projects/:pid/sdk/metrics` for aggregate SDK operational metrics

`sdk-log` semantics:

- `source: "aegis"` = structured S2 lifecycle lines (upload stored/completed, install start, heartbeat, terminal events)
- `source: "installer"` = installer stdout/stderr lines when observable
- `kind: "heartbeat"` means the installer child process is still alive at emit time; it is **not** a progress-percentage claim
- `logPath` points to the canonical install log file when the client needs follow-up fetch

WebSocket connection health:

- Missing subscription key still closes with code `4000`.
- The shared S2 `WsBroadcaster` now runs an app-level ping/pong heartbeat every 30 seconds. A client that misses a heartbeat is terminated and removed; send failures also remove clients.
- `meta.seq` remains monotonic per broadcaster key while that key is active, and can still be used for gap detection.

### 4.5.1 SDK follow-up implementation matrix (S1 WR 2026-04-25)

This subsection answers the S1 SDK second follow-up WR after S2 implementation. Status vocabulary:

- **implemented** = implemented in `services/shared` / `services/backend` and covered by targeted S2 tests in this cycle.
- **implemented-limited** = implemented with explicitly bounded semantics; S1 must observe the stated limits.
- **future** = accepted direction but not implemented in this cycle.
- **rejected** = S2 should not expose the requested behavior as phrased.
- **frontend autonomous** = S1 may decide presentation/mock behavior without S2 contract changes.

#### A. Timing

| Item | Decision | S2 answer |
|---|---|---|
| A1 `etaSeconds` | implemented-limited | `sdk-progress.etaSeconds` is emitted for upload progress from byte-rate telemetry. Extract/install/analyze/verify omit it unless future reliable duration models exist. |
| A2 `phaseStartedAt` | implemented | `sdk-progress.phaseStartedAt` and REST `RegisteredSdk.currentPhaseStartedAt` are epoch-ms backend timestamps. |
| A3 `phaseHistory` | implemented | REST `RegisteredSdk.phaseHistory` persists `Array<{ phase, startedAt, endedAt?, durationMs?, message? }>` in `sdk_registry.phase_history`. |
| A4 emit cadence | implemented | Upload emits `0`, then integer percent increases up to `99`, then `uploaded` emits `100`. There is no time-based throttle. Non-upload phases emit on state transition only. |
| A5 `meta.timestamp` accuracy | implemented | WS envelope `meta.timestamp` is backend `Date.now()` epoch-ms. It is suitable for server-message ordering and server-relative elapsed from first observed phase; it is not client/server clock-skew corrected. |

#### B. Structured detail / error shape

| Item | Decision | S2 answer |
|---|---|---|
| B1 `phaseDetail` / `messageKey` | implemented | S2 emits `phaseDetail: { kind, params? }` on SDK progress. Current `message` remains ko-KR fallback text. |
| B2 `troubleshootingUrl` | implemented | `sdk-error.troubleshootingUrl` is wiki-canonical and backend-generated from structured code, e.g. `wiki/canon/troubleshooting/sdk#install-process-failed`. |
| B3 `sdk-error.retryable` | implemented | `sdk-error.retryable` and `RegisteredSdk.retryable` are emitted. Current policy: non-upload failed phases are retryable when retained/materialized artifacts are available and retry limits allow. |
| B4 structured error `code` | implemented | `sdk-error.code` is `SdkErrorCode`; S1 should branch on this instead of free-text `error`. |
| B5 `recoverable` / error severity | implemented-limited | `sdk-error.recoverable` mirrors `retryable`. S2 does not yet emit a separate severity enum. |

#### C. Retry endpoint

| Item | Decision | S2 answer |
|---|---|---|
| C1 `POST /sdk/:id/retry` | implemented-limited | Mounted as `POST /api/projects/:pid/sdk/:id/retry`. It reuses an existing failed SDK id and retained/materialized `sdk.path`; unsupported/unretained artifacts return `400`. |
| C2 retry quota/cooldown | implemented | Current policy: max `3` retry attempts, `30s` cooldown from last update, `24h` retry retention window (`retryExpiresAt`). |
| C3 retry phase flow | implemented-limited | Request body supports `{ fromPhase?: "analyzing" | "verifying" }`; default is `verifying`. Retry emits `analyzing` when requested, then `verifying`, then `ready` or `sdk-error`. |
| C4 failed-artifact retention / `retryExpiresAt` | implemented-limited | Failed rows get `retryExpiresAt`; retry only succeeds if `sdk.path` still exists. Extract/install failures may still require fresh upload if no materialized path exists. |

#### D. Log access

| Item | Decision | S2 answer |
|---|---|---|
| D1 `GET /sdk/:id/log` detail | implemented | Default `tailLines=200`; response now includes `{ sdkId, logPath, content, truncated, totalLines, nextOffset? }`. |
| D2 streaming/pagination | implemented-limited | Offset pagination is supported via `?offset=&limit=` (limit capped to 10,000). Chunked/SSE log streaming remains future; live logs continue via `sdk-log` WS. |
| D3 live log streaming WS | implemented | `sdk-log` live WS payload remains `{ sdkId, timestamp, source, kind, stream?, message, logPath? }`; envelope adds `meta.timestamp` and `meta.seq`. |
| D4 `logPath` security | implemented | `logPath` remains server-side correlation/debug path. S1 should render log `content` or a “view/download log” action, not present `logPath` as the primary end-user instruction. |
| D5 `installLogPath` vs `logPath` | implemented | Both refer to the canonical install log path in current SDK registration. `RegisteredSdk.installLogPath` / `profile.installLogPath` are persisted profile fields; `sdk-log.logPath` and `sdk-error.logPath` are event correlation fields. |
| D6 log download | implemented | `GET /api/projects/:pid/sdk/:id/log?download=true` returns a `text/plain` attachment named `<sdkId>-install.log`. |

#### E. i18n / locale

| Item | Decision | S2 answer |
|---|---|---|
| E1 message locale policy | implemented-limited | Current SDK `message` strings remain ko-KR backend text. New `phaseDetail.kind + params` is the structured seam for S1 i18n; S2 does not honor `Accept-Language` or WS locale query. |
| E2 SDK metadata locale | implemented | `sdkVersion`, `targetSystem`, compiler fields, paths, defines, and include paths are technical/free-text metadata, not localized enums. |

#### F. Precision / optimization

| Item | Decision | S2 answer |
|---|---|---|
| F1 `percent` precision | implemented | Current upload percent is integer `0..99`, with `100` on `uploaded`. No float precision today. |
| F2 byte fields | implemented | `uploadedBytes` and `totalBytes` are JavaScript numbers. Current multer limit is 4 GiB per file and 2000 files; JS safe integer range is sufficient for current limits. |
| F3 message length | frontend autonomous | No backend max length contract today. Current progress messages are short; long installer output belongs in `sdk-log`. S1 should truncate UI copy defensively. |

#### G. Concurrent / quota

| Item | Decision | S2 answer |
|---|---|---|
| G1 concurrent SDK uploads | implemented current behavior; future limits possible | No explicit per-project concurrency limit or `MAX_CONCURRENT_SDK_UPLOADS_PER_PROJECT` today. Multiple SDK registrations can be started, bounded only by request/file limits and host resources. |
| G2 SDK quota | implemented | `GET /api/projects/:pid/sdk/quota` returns `{ usedBytes, maxBytes, sdkCount }`. `maxBytes` defaults to 50 GiB and can be set with `AEGIS_SDK_STORAGE_QUOTA_BYTES`. |
| G3 global quota | future | No instance-wide quota endpoint today. |

#### H. Lifecycle

| Item | Decision | S2 answer |
|---|---|---|
| H1 DELETE in-flight job | rejected as cancel; future cancellation | `DELETE /sdk/:id` is not a safe cancellation contract for uploading/extracting/installing/analyzing/verifying. It deletes DB/files best-effort but does not coordinate/cancel the async pipeline or emit `USER_CANCELLED`. |
| H2 reconnect phase consistency | implemented | Reconnect recovery source is `GET /api/projects/:pid/sdk/:id` / list. It returns current persisted status plus `currentPhaseStartedAt` and `phaseHistory`; missed live WS messages are still possible. |
| H3 project DELETE cleanup | implemented | Project delete blocks active/non-terminal SDK registrations. If allowed, project upload root is quarantined and removed as part of project teardown, including terminal SDK files. |
| H4 ready metadata mutation | future / currently rejected | No `PATCH /sdk/:id` today. Ready SDK metadata is read-only after registration except delete. |

#### I. Test fixtures / mock support

| Item | Decision | S2 answer |
|---|---|---|
| I1 canonical SDK mock fixture export | frontend autonomous now; future shared fixture possible | No `services/shared/fixtures/sdk-mocks.ts` today. S1 may build mock data from shared DTO shapes. S2 test app mocks now include the new endpoint surface for backend contract tests. |
| I2 dev phase simulator | rejected for current backend; frontend autonomous | No backend simulator endpoint today. S2 rejects adding runtime simulator behavior in this cycle; S1 mock mode may simulate phases. |
| I3 e2e upload fixture | future | S2 tests create temporary SDK fixtures internally, but there is no canonical cross-lane small SDK fixture path yet. |

#### J. Shared types versioning

| Item | Decision | S2 answer |
|---|---|---|
| J1 shared package reflection | implemented | Source fields live in `services/shared/src/dto.ts` and `services/shared/src/models.ts`; S2 rebuilt `services/shared/dist` during verification. S1 should run shared/frontend typecheck when adopting. |
| J2 breaking-change policy | implemented policy | Additive fields/message types are preferred. Field removals/renames or semantic changes require canonical docs update plus WR/deprecation coordination before S1 depends on the change. |
| J3 source-of-truth | implemented policy | Authority order for S1-S2 shared contract remains: `services/shared/src/models.ts`, `services/shared/src/dto.ts`, `services/shared/src/llm-sampling.ts`, mounted S2 behavior, then this document. |

#### K. Small clarifications

| Item | Decision | S2 answer |
|---|---|---|
| K1 `GET /sdk` ordering | implemented | Registered SDK list is `created_at DESC`. No `orderBy` / `order` query support today. |
| K2 WS query params | implemented | `/ws/sdk?projectId=<projectId>` only. There is no `sdkId` filter today; clients receive project-scoped SDK messages. |
| K3 WS envelope guarantees | implemented | SDK messages get flattened `meta` with `channel="sdk"`, `projectId` equal to subscription key, `timestamp` epoch-ms, and monotonic `seq` per key while a broadcaster key is active. No `meta.correlationId` today; `sdk-error.correlationId` uses the `sdkId`. |
| K4 `sdk-complete.path?` | implemented | `path` is the server-side materialized SDK path. S1 should not use it as a client route or user-facing filesystem instruction. |
| K5 duplicate upload detection | future | No hash/name duplicate detection today. Each successful upload gets a new SDK id. |
| K6 status enum expansion | implemented policy | Unknown future SDK phases should render as fallback “SDK 상태 확인 필요”, keep polling/fetching REST state, and must not be treated as `ready` unless the value is explicitly `ready`. |

#### L. artifactKind message copy

| Item | Decision | S2 answer |
|---|---|---|
| L1 message copy table | implemented | Current notable `sdk-progress.message` values: upload `SDK 업로드 중...`, `SDK 업로드 중... {percent}%`, `SDK 업로드 완료`; archive `SDK 압축 해제 중...`, `SDK 압축 해제 완료`; folder `SDK 폴더 업로드 정리 중...`, `SDK 폴더 업로드 정리 완료`; bin `SDK 설치 파일 실행 중...`, `SDK 설치 완료`; retry verify `S2가 SDK 구조를 다시 검증 중...`; ready `SDK 등록 완료` / `SDK 재시도 완료`. Prefer `phaseDetail` for stable branching. |
| L2 archive/folder both use `extracting` | frontend autonomous with S2 guidance | Keep the stable step label “설치/압축해제”; use `artifactKind`, `phaseDetail.kind`, and `message` as sub-text if S1 wants dynamic nuance. |

#### M. Outcome / profile

| Item | Decision | S2 answer |
|---|---|---|
| M1 `RegisteredSdk.profile` schema | implemented | `SdkAnalyzedProfile` fields are optional: `compiler`, `compilerPrefix`, `gccVersion`, `targetArch`, `languageStandard`, `sysroot`, `environmentSetup`, `includePaths`, `defines`, `artifactKind`, `sdkVersion`, `targetSystem`, `installLogPath`. |
| M2 `sdk-complete.path?` | implemented | Same as K4: server-side materialized SDK path, not a client route. |
| M3 extraction confidence | future | No `confidence` for `sdkVersion` / `targetSystem` today. `verified` means S2 verified materialized SDK tree/path constraints, not AI metadata confidence. |

#### N. Error UX

| Item | Decision | S2 answer |
|---|---|---|
| N1 `userMessage` / `technicalDetail` split | implemented | `sdk-error` now includes both `userMessage` and `technicalDetail` while preserving legacy `error`. |
| N2 error correlation id | implemented | `sdk-error.correlationId` uses `sdkId`; notifications also use `correlationId=sdkId`. WS envelope still has no separate `meta.correlationId`. |
| N3 error timestamp | implemented | `sdk-error.failedAt` is payload-level epoch-ms. REST `RegisteredSdk.updatedAt` reflects last persisted status update. |

#### O. Observability / metrics

| Item | Decision | S2 answer |
|---|---|---|
| O1 SDK metrics endpoint | implemented | `GET /api/projects/:pid/sdk/metrics` returns `SdkMetrics`: `{ totalRegistered, sdkCount, readyCount, failedCount, averagePhaseDurationMs }`. `sdkCount` is a compatibility alias for `totalRegistered`; new S1 code should prefer `totalRegistered`. |
| O2 WS connection health | implemented | Shared WS broadcaster sends ping every 30s, removes/terminates missed pong clients, removes send failures, and preserves `meta.seq` for gap detection. S1 still owns reconnect UI/backoff. |

### 4.6 Analysis WS — `/ws/analysis?analysisId=<analysisId>`

| `type` | Payload |
|---|---|
| `analysis-progress` | `{ analysisId, buildTargetId?, executionId?, phase, message, targetName?, targetProgress?: { current, total } }` |
| `analysis-quick-complete` | `{ analysisId, buildTargetId?, executionId?, findingCount }` |
| `analysis-deep-complete` | `{ analysisId, buildTargetId?, executionId?, findingCount, analysisOutcome?, qualityOutcome?, pocOutcome?, cleanPass? }` |
| `analysis-error` | `{ analysisId, buildTargetId?, executionId?, phase: "quick" \| "deep", error, retryable, partial? }` |

Current progress phases:

- `quick_sast`
- `quick_graphing`
- `quick_complete`
- `deep_submitting`
- `deep_analyzing`
- `deep_retrying`
- `deep_complete`

Role and recovery:

- **Foreground role**: primary real-time progress surface for explicit Quick and explicit Deep analysis jobs.
- **Terminal signals**:
  - `analysis-quick-complete`
  - `analysis-deep-complete`
  - `analysis-error`
- **Background completion awareness**:
  - project notifications may also appear (`analysis_complete`, `critical_finding`, `gate_failed`) after normalization/gate evaluation, but they are **supplementary** and not the authoritative 1:1 replay surface for a specific `analysisId`.
- **Recovery / re-entry source of truth**:
  - while status is retained: `GET /api/analysis/status/:analysisId`
  - for completed material: `GET /api/analysis/results/:analysisId`
  - a fresh `/ws/analysis?analysisId=` subscriber receives the current retained tracker snapshot when present.
  - if the live WS stream was missed or the tracker snapshot is gone, clients should recover from these REST surfaces rather than expecting durable WS replay.

### 4.7 Dynamic-test WS — `/ws/dynamic-test?testId=<testId>`

| `type` | Payload |
|---|---|
| `test-progress` | `{ testId, current, total, crashes, anomalies, message }` |
| `test-finding` | `{ testId, finding }` |
| `test-complete` | `{ testId }` |
| `test-error` | `{ testId, error }` |

### 4.8 Notification WS — `/ws/notifications?projectId=<projectId>`

| `type` | Payload |
|---|---|
| `notification` | `Notification` |

Current high-value notification categories for progress/completion UX:

- `upload_complete` / `upload_failed`
- `sdk_ready` / `sdk_failed`
- `pipeline_complete` / `pipeline_failed`
- `analysis_complete`
- `critical_finding`
- `approval_pending`

Interpretation rules:

- `type` is the coarse UX category.
- `jobKind` identifies the async domain or object family.
- `resourceId` is the stable resource/job identifier for follow-up lookup.
- `correlationId` is the live-flow correlation key when the notification should be associated with an in-progress foreground stream.

### 4.9 Recovery source-of-truth matrix

| Async flow | Live foreground progress | Re-entry / reconnect source of truth | Background completion surface |
|---|---|---|---|
| Source upload | `/ws/upload?uploadId=` | `GET /api/projects/:pid/source/upload-status/:uploadId` | `/ws/notifications` + notifications list (`upload_complete` / `upload_failed`) |
| SDK registration | `/ws/sdk?projectId=` | `GET /api/projects/:pid/sdk/:id` | `/ws/notifications` + notifications list (`sdk_ready` / `sdk_failed`) |
| Analysis (explicit Quick / explicit Deep) | `/ws/analysis?analysisId=` | `GET /api/analysis/status/:analysisId`, then `GET /api/analysis/results/:analysisId` | notifications are supplementary; HTTP status/results remain authoritative |
| Pipeline | `/ws/pipeline?projectId=` | `GET /api/projects/:pid/pipeline/status` | `/ws/notifications` + notifications list (`pipeline_complete` / `pipeline_failed`) |
| General cross-screen completion | n/a | `GET /api/projects/:pid/notifications` / `/count` | `/ws/notifications?projectId=` |

Role and recovery:

- **Background role**: completion/failure awareness after navigation, tab switches, or late arrival.
- **Not a replacement for foreground progress**: notifications complement `/ws/upload`, `/ws/sdk`, `/ws/analysis`, `/ws/pipeline`; they do not replay those streams.
- **Authoritative recovery surface**:
  - `GET /api/projects/:pid/notifications`
  - `GET /api/projects/:pid/notifications/count`
- **Correlation rule**:
  - use `jobKind` + `resourceId` + optional `correlationId` to route a notification back to the appropriate screen/state
  - use the per-flow REST recovery endpoint when the foreground WS stream itself is needed.

---

## 5. Canonical drift notes resolved by this document

These points are intentional contract clarifications and should be preserved unless code changes:

1. `UploadedFile` APIs and `/source/*` APIs are different surfaces with different backing stores and shapes.
2. `ProjectOverviewResponse` is a raw object, not the common success envelope.
3. SDK upload is now multipart-mounted on `/api/projects/:pid/sdk`; single archive / single `.bin` are supported for the current milestone, while multi-file folder upload is supported when the client preserves relative paths inside the multipart payload.
4. `SourceFileEntry.fileType` uses the current 12-value filesystem classifier from `ProjectSourceService`, not older ad-hoc labels.
5. WS envelopes are flattened as `{ ...message, meta }`, not `{ message, meta }`.
6. WS `meta.projectId` equals the subscription key on non-project channels today.
7. `pipeline-error.phase` is currently only a coarse catch-path phase hint, not an exact failed-step contract.
8. Upload / SDK / pipeline completion now have explicit notification categories and correlation keys for cross-screen completion awareness.
9. Analysis recovery is authoritative via `/api/analysis/status/:analysisId` and `/api/analysis/results/:analysisId`; notification delivery is supplemental rather than a strict mirror of `/ws/analysis`.
10. S2 direct calls to S7 `/v1/tasks` through `LlmTaskClient` send the full caller-owned generation tuple required by `wiki/canon/api/llm-gateway-api.md`: `enableThinking`, `maxTokens`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, and `repetitionPenalty`. Existing caller-provided `maxTokens`, `timeoutMs`, or `outputSchema` are preserved while missing generation controls are backfilled from `DEFAULT_S7_TASK_GENERATION_CONSTRAINTS` in `services/shared/src/llm-sampling.ts` (`true`, `16384`, `0.6`, `0.95`, `20`, `0.0`, `0.0`, `1.0`).
11. S2 `AgentClient` and `BuildAgentClient` accept optional S3 generation overrides from `S3GenerationOverrides`, but current S2→S3 orchestrator call paths do not emit shared default presets by default. Current fixed S2 hints remain: Deep analysis `{ maxTokens: 4096, timeoutMs: 300000 }`, build-resolve `{ timeoutMs: 600000 }`, and sdk-analyze `{ timeoutMs: 300000 }`.
