---
title: "Shared (S1-S2) API / Model Contract"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/api/shared-models.md"
original_path: "docs/api/shared-models.md"
last_verified: "2026-04-14"
service_tags: ["platform"]
decision_tags: []
related_pages: ["wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
---

# Shared (S1-S2) API / Model Contract

> Canonical contract for the current S1 (frontend) ↔ S2 (backend) integration.
>
> Authority order for this document:
> 1. `services/shared/src/models.ts`
> 2. `services/shared/src/dto.ts`
> 3. mounted backend controllers under `services/backend/src/controllers/*.ts`
>
> This file is intentionally backend-owned. If S2 behavior changes, update this document first and treat it as the canonical contract for S1.
> If you need the bigger end-to-end request/WS flow before reading field-level contracts, see [[wiki/context/project/end-to-end-scenarios|AEGIS 대표 시나리오별 통신 흐름]].

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
interface Project {
  id: string;
  name: string;
  description: string;
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
}
```

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
  verifyError?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

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

interface BuildTarget {
  id: string;
  projectId: string;
  name: string;
  relativePath: string;
  includedPaths?: string[];
  sourcePath?: string;
  buildProfile: BuildProfile;
  buildSystem?: "cmake" | "make" | "custom";
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

interface User {
  id: string;
  username: string;
  displayName: string;
  role: "viewer" | "analyst" | "admin";
  createdAt: string;
  updatedAt: string;
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
| POST | `/api/projects/:pid/targets` | `{ name, relativePath, buildProfile, buildSystem?, includedPaths? }` | `201 { success, data: BuildTarget }` | `201`, `400`, `404` |
| PUT | `/api/projects/:pid/targets/:id` | `{ name?, relativePath?, buildProfile?, buildSystem? }` | `200 { success, data: BuildTarget }` | `200`, `400`, `404` |
| DELETE | `/api/projects/:pid/targets/:id` | - | `200 { success: true }` | `200`, `404` |
| GET | `/api/projects/:pid/targets/:id/build-log` | - | `200 { success, data: { buildLog: string \| null, status: BuildTargetStatus, updatedAt: string } }` | `200`, `404` |
| POST | `/api/projects/:pid/targets/discover` | empty body | `200 { success, data: { discovered, created, targets, elapsedMs } }` | `200`, `400`, `404` |

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
| GET | `/api/projects/:pid/sdk/:id/log` | `?tailLines=<n>` optional | `200 { success, data: { sdkId, logPath, content, truncated } }` | `200`, `404` |
| POST | `/api/projects/:pid/sdk` | see note below | `202 { success, data: RegisteredSdk }` | `202`, `400`, `404` |
| DELETE | `/api/projects/:pid/sdk/:id` | - | `200 { success: true }` | `200`, `404` |

`POST /api/projects/:pid/sdk` mounted behavior today:

- required multipart field: `name`
- accepted ingress: multipart `file` upload (single archive or single `.bin` in this milestone)
- `localPath` is no longer the canonical/requested ingress
- multiple uploaded files are treated as **folder upload** when the client preserves relative paths (for example via `webkitRelativePath`-derived filenames or explicit relative-path metadata)
- returned `RegisteredSdk.status` is initially `"uploaded"`, then the async pipeline advances through upload materialization / analyze / verify terminal states
- `.bin` installs materialize a canonical install log at `uploads/{projectId}/sdk/{sdkId}/install.log`
- `GET /api/projects/:pid/sdk/:id/log` is the HTTP recovery/read surface for install-log tail content

### SDK profile lookup routes

| Method | Path | Success | Status codes |
|---|---|---|---|
| GET | `/api/sdk-profiles` | `200 { success, data: SdkProfile[] }` | `200` |
| GET | `/api/sdk-profiles/:id` | `200 { success, data: SdkProfile }` | `200`, `404` |

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
  - 현재 runtime에서는 BuildTarget의 SDK choice가 명시적으로 확정(`sdk-selected` 또는 `sdk-none-explicit`)되지 않으면 Quick가 거부된다.
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

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{ username: string; password: string }` | `200 { success, data: { token, user } }` | `200`, `400` |
| POST | `/api/auth/logout` | Bearer token optional | `200 { success: true }` | `200` |
| GET | `/api/auth/me` | Bearer token | `200 { success, data: User }` | `200`, `401` |
| GET | `/api/auth/users` | - | `200 { success, data: User[] }` | `200` |

Notes:

- login failure is currently `400 Invalid username or password`, not `401`.
- `/api/auth/*` is auth-exempt at middleware level so login/logout/me/users remain reachable even when global auth is enabled.
- `/api/auth/me` still returns `401 Not authenticated` when `req.user` is absent.

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

| Method | Path | Request | Success | Status codes |
|---|---|---|---|---|
| GET | `/api/projects/:pid/runs` | - | `200 { success, data: Run[] }` | `200` |
| GET | `/api/runs/:id` | - | `200 { success, data: RunDetail }` | `200`, `404` |
| GET | `/api/projects/:pid/findings` | query `status,severity,module,sourceType,q,sort,order` optional | `200 { success, data: Finding[] }` | `200`, `400` |
| GET | `/api/projects/:pid/findings/summary` | - | `200 { success, data: AnalysisSummaryLike }` | `200` |
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
  state: "idle" | "queued" | "running" | "failed";
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
  controlPolicyVersion?: "health-control-signal-rollout-v1";
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
- Legacy S4 `requestSummary.ackStatus="broken"` is normalized to `localAckState="ack-break"`.

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
| `sdk-progress` | `{ sdkId, phase: "uploading" \| "uploaded" \| "extracting" \| "extracted" \| "installing" \| "installed" \| "analyzing" \| "verifying" \| "ready", message, percent?, uploadedBytes?, totalBytes?, fileName? }` |
| `sdk-log` | `{ sdkId, timestamp, source: "aegis" \| "installer", kind: "lifecycle" \| "heartbeat" \| "output" \| "terminal", stream?: "stdout" \| "stderr", message, logPath? }` |
| `sdk-complete` | `{ sdkId, profile, path? }` |
| `sdk-error` | `{ sdkId, phase: "upload_failed" \| "extract_failed" \| "install_failed" \| "verify_failed", error, logPath? }` |

Role and recovery:

- **Foreground role**: live SDK registration/verification state machine within project-scoped SDK UI.
- **Terminal signals**:
  - `sdk-complete`
  - `sdk-error`
- **Background completion awareness**:
  - success → `type: "sdk_ready", jobKind: "sdk", resourceId: sdkId, correlationId: sdkId`
  - failure → `type: "sdk_failed", jobKind: "sdk", resourceId: sdkId, correlationId: sdkId`
- **Recovery / re-entry source of truth**:
  - `GET /api/projects/:pid/sdk/:id` for a single SDK
  - `GET /api/projects/:pid/sdk` for collection/list recovery
  - `GET /api/projects/:pid/sdk/:id/log` for install-log tail recovery

`sdk-log` semantics:

- `source: "aegis"` = structured S2 lifecycle lines (upload stored/completed, install start, heartbeat, terminal events)
- `source: "installer"` = installer stdout/stderr lines when observable
- `kind: "heartbeat"` means the installer child process is still alive at emit time; it is **not** a progress-percentage claim
- `logPath` points to the canonical install log file when the client needs follow-up fetch

### 4.6 Analysis WS — `/ws/analysis?analysisId=<analysisId>`

| `type` | Payload |
|---|---|
| `analysis-progress` | `{ analysisId, buildTargetId?, executionId?, phase, message, targetName?, targetProgress?: { current, total } }` |
| `analysis-quick-complete` | `{ analysisId, buildTargetId?, executionId?, findingCount }` |
| `analysis-deep-complete` | `{ analysisId, buildTargetId?, executionId?, findingCount }` |
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
  - if the live WS stream was missed, clients should recover from these REST surfaces rather than expecting WS replay.

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
