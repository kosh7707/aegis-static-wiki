---
title: "S2 notice: BuildTarget scriptHintPath is available for uploaded build-script selection UI"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele"
last_verified: "2026-05-06"
service_tags: ["s1", "s2", "frontend", "backend", "build-agent"]
decision_tags: ["build-script-hint", "scriptHintPath", "uploaded-project-path", "api-contract"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/work-requests/s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele"
wr_kind: "notice"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-06T08:14:47.598Z","note":"S1 풀 포팅 완료. 데이터 채널: pipeline.ts (createBuildTarget body + updateBuildTarget body, null pass-through for clear) + useBuildTargets.add() 5th arg + update() body type. 신규 UI 컴포넌트 2: BuildTargetScriptHintTree (single-pick radio variant, BuildTargetTreeSelector multi-check 과 의미 분리) + BuildTargetScriptHintField (section frame + display row uploaded path + computed root-relative subtitle + root-mismatch role=alert warning + clear button). useBuildTargetCreateDialog state + initialScriptHintPath/initialRelativePath props + toApiScriptHintPath root-strip on submit. BuildTargetCreateDialog mount + buildTargetRoot 계산. 400 INVALID_INPUT preflight hint-specific toast (handoff §9 정합). 신규 page-local CSS 2개 모두 canonical 토큰만 (review-tone caution-review tone for warning, severity ramp 0, hex 0, oklch 0, 새 토큰 0). 검증: 712 PASS / 101 files (679 → +33), typecheck PASS, build PASS, production CSS lint grep clean. handoff §5 sync table 2 row 등록, design-system §6 cycle 2 entry, readme §8.1 cycle 2 entry, §5 frontend tests count 갱신. Edit-mode hook dual-mode 지원 유지 (mount site 신설은 별도 cycle)."}]
registered_at: "2026-05-06T07:11:20.854Z"
completed_at: "2026-05-06T08:14:47.598Z"
---

# S2 notice: BuildTarget scriptHintPath is available for uploaded build-script selection UI

## Summary
- Kind: notice
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S2 notice: BuildTarget scriptHintPath is available for uploaded build-script selection UI

## Summary
S2 implemented the S1-facing/backend side of S3's finalized Build Agent `build.scriptHintPath` contract. S1 can now add UI for selecting an uploaded project file as a build-script hint and save it on a BuildTarget.

## New S1-facing field

`BuildTarget.scriptHintPath?: string`

- Optional uploaded-file selection used as a hint for S3 Build Agent.
- It is relative to the **effective BuildTarget root**, not an absolute server path.
- It is reference-only: S1 should not describe it as directly executed.

## Endpoints

- `POST /api/projects/:pid/targets` accepts:
  - `{ name, relativePath, buildProfile?, buildSystem?, includedPaths?, scriptHintPath? }`
- `PUT /api/projects/:pid/targets/:id` accepts:
  - `{ name?, relativePath?, buildProfile?, buildSystem?, scriptHintPath?: string | null }`
- `scriptHintPath: null` clears the saved hint.

S1 can use the existing source tree surface for selection:

- `GET /api/projects/:pid/source/files`
- `GET /api/projects/:pid/source/file?path=...` when preview is needed

## Path semantics

S3 finalized the interpretation as effective-BuildTarget-root-relative:

- If S2 uses an isolated BuildTarget `sourcePath`, the hint path is relative to that isolated root.
- Otherwise it is relative to `projectPath/buildTargetPath`, i.e. the BuildTarget's root under the uploaded project.

For ordinary target `relativePath: "gateway/"`, a selected file at uploaded path `gateway/scripts/build.sh` should be saved to the target as:

```json
{ "scriptHintPath": "scripts/build.sh" }
```

## S2 validation

S2 validates before persisting:

- rejects empty paths;
- rejects absolute paths;
- rejects Windows drive / UNC prefixes;
- rejects backslash separators;
- rejects NUL and traversal;
- resolves symlinks and rejects escapes outside the effective BuildTarget root;
- requires a regular file;
- enforces max 20,000 bytes;
- requires valid UTF-8 text and no NUL-containing content.

S1 should surface S2 `400 INVALID_INPUT` as a selection/preflight error and let users choose another uploaded file.

## Downstream emission

During pipeline prepare/run, S2 forwards the saved value to S3 as:

```json
{
  "context": {
    "trusted": {
      "build": {
        "mode": "native" | "sdk",
        "sdkId": "... when sdk ...",
        "scriptHintPath": "scripts/build.sh"
      }
    }
  }
}
```

S2 does not send inline script hint text aliases.

## Verification

S2 verification on 2026-05-06:

- `npm test --workspace @aegis/backend -- --run src/services/__tests__/pipeline-orchestrator.test.ts src/__tests__/contract/api-contract.test.ts src/__tests__/integration/dao.integration.test.ts` → 224 passed
- `npm run build --workspace @aegis/shared` → PASS
- `npm run build --workspace @aegis/backend` → PASS
- `npm test --workspace @aegis/backend` → 28 files / 505 tests passed
- `cd /home/kosh/aegis-static-wiki && npm test` → 8 passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
