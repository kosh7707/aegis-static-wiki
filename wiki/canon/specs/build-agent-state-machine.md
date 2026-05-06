---
title: "Build Agent State and Outcome Contract"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/build-agent.md"
  - "wiki/canon/api/build-agent-api.md"
  - "wiki/canon/handoff/s3/readme.md"
  - "wiki/canon/work-requests/s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve.md"
  - "wiki/canon/work-requests/s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h.md"
  - "services/build-agent/app/validators/build_request_contract.py"
  - "services/build-agent/app/routers/build_resolve_handler.py"
  - "services/build-agent/app/core/result_assembler.py"
  - "services/build-agent/app/tools/implementations/try_build.py"
last_verified: "2026-05-06"
service_tags: ["s3", "build-agent"]
decision_tags: ["build-agent", "state-machine", "build-v1.1-default", "cleanpass", "artifact-mismatch-completed", "scriptHintPath", "system-stability", "test-oracle"]
related_pages: ["wiki/canon/specs/build-agent.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/work-requests/s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h.md"]
---

# Build Agent State and Outcome Contract

> **Owner**: S3  
> **Status**: canonical stabilization contract  
> **Last verified**: 2026-05-06

이 문서는 Build Agent 안정화와 다중 테스트셋 회귀를 위한 **상태/판정 기준 SSoT**다. Analysis Agent의 claim/evidence state-machine 문서 패밀리처럼 큰 설계면은 아니며, Build Agent의 단순한 compile-first 흐름을 테스트 oracle로 고정하기 위한 1-page contract다.

Build Agent의 public API shape는 `wiki/canon/api/build-agent-api.md`가 우선한다. 이 문서는 그 API의 `status`, `result.cleanPass`, `result.buildOutcome`, `result.buildDiagnostics`를 어떤 상태 전이와 판정 기준으로 해석해야 하는지 정의한다.

---

## 1. Scope

적용 대상:
- `POST /v1/tasks` `taskType="build-resolve"`
- strict compile-first contract
- `build-v1.1` completed envelope
- request-scoped generated build script / `try_build` / artifact validation

비적용 대상:
- `sdk-analyze`의 세부 SDK profile 추론 state
- Analysis Agent `deep-analyze` / `generate-poc` claim lifecycle
- S4 build runner 내부 상태
- S2 orchestration persistence state

---

## 2. Two-layer outcome model

Build Agent도 Analysis Agent와 마찬가지로 task execution과 result quality를 분리한다.

### Task status

Task status는 Build Agent가 요청을 처리하여 schema-valid response envelope까지 도달했는지를 뜻한다.

대표 status는 현재 구현의 `TaskStatus` enum을 따른다:

```text
completed
validation_failed
timeout
model_error
budget_exceeded
unsafe_output
empty_result
```

### Build result outcome

Build result outcome은 build-domain 판단 결과를 뜻한다.

대표 outcome:

```text
built
compile_failed
missing_materials
sdk_mismatch
artifact_mismatch
inconclusive
```

핵심 불변식:

```text
status="completed" != clean build success
```

호출자는 빌드 성공/준비 완료를 판단할 때 반드시 다음을 확인해야 한다.

```text
status == "completed"
AND result.cleanPass == true
AND result.buildOutcome.cleanPass == true
```

---

## 3. Canonical state list

Build Agent 안정화 테스트는 아래 상태 이름을 oracle 용어로 사용한다. 구현 코드가 반드시 같은 enum 이름을 노출해야 한다는 뜻은 아니지만, 테스트/문서/리뷰에서는 이 용어를 기준으로 분류한다.

| State | Meaning |
|---|---|
| `received` | `/v1/tasks` request를 수신했다. |
| `validated_request` | top-level envelope, `contractVersion`, `strictMode`, trusted context, build target, expected artifacts가 검증됐다. |
| `preflight_failed` | caller contract가 invalid라 build-domain 판단을 시작할 수 없다. |
| `workspace_prepared` | effective BuildTarget root와 request-scoped write area가 준비됐다. |
| `phase0_completed` | deterministic phase0 collection / initial build context extraction이 끝났다. |
| `script_material_loaded` | `scriptHintPath`, setup script, SDK material 등 caller-provided build material이 안전하게 해석됐다. |
| `script_planning` | LLM/tool loop가 request-scoped build script 작성 계획을 세우는 중이다. |
| `script_written` | request-scoped `build-aegis-*/aegis-build.sh` 또는 equivalent generated script가 작성됐다. |
| `try_build_running` | generated script를 통해 S4 build execution이 실행 중이다. |
| `try_build_failed_repairable` | compile/build 실패가 발생했지만 bounded repair 후보가 남아 있다. |
| `try_build_failed_terminal` | repair budget, missing material, unsupported SDK/toolchain 등으로 더 이상 의미 있는 repair가 불가능하다. |
| `artifact_validation` | build execution 결과와 `expectedArtifacts[]`를 비교하는 중이다. |
| `completed_clean` | strict clean-pass 조건을 모두 만족한 completed envelope가 생성됐다. |
| `completed_non_clean` | build-domain 판단은 끝났지만 `cleanPass=false`인 completed envelope가 생성됐다. |
| `task_failed` | valid result envelope를 책임 있게 만들 수 없어 task-level failure로 종료됐다. |

---

## 4. Canonical transition table

| From | Event / condition | To | Public response meaning |
|---|---|---|---|
| `received` | strict contract valid | `validated_request` | continue |
| `received` | malformed/unsupported task or invalid strict contract | `preflight_failed` | `status="validation_failed"` |
| `validated_request` | target root and writable area prepared | `workspace_prepared` | continue |
| `validated_request` | target path escapes project / missing required material | `preflight_failed` | `status="validation_failed"` or caller-contract failure |
| `workspace_prepared` | deterministic phase0 collection done | `phase0_completed` | continue |
| `phase0_completed` | safe caller build material exists | `script_material_loaded` | continue |
| `phase0_completed` | no usable material but LLM can infer script | `script_planning` | continue |
| `script_material_loaded` | reference material rendered to LLM as untrusted/reference-only | `script_planning` | continue |
| `script_planning` | generated request-scoped script written | `script_written` | continue |
| `script_planning` | no valid script can be generated within budget | `completed_non_clean` | `status="completed"`, `cleanPass=false`, likely `missing_materials` or `inconclusive` |
| `script_written` | command targets generated request-scoped script | `try_build_running` | continue |
| `script_written` | command tries to execute uploaded/reference script directly | `completed_non_clean` or repair | must not execute; diagnose command-policy violation |
| `try_build_running` | S4 build succeeds | `artifact_validation` | continue |
| `try_build_running` | S4 build fails and repair budget remains | `try_build_failed_repairable` | continue |
| `try_build_failed_repairable` | repaired script written | `script_written` | continue |
| `try_build_running` | S4 build fails and repair exhausted | `try_build_failed_terminal` | continue to non-clean classification |
| `try_build_failed_terminal` | compile failure is known | `completed_non_clean` | `status="completed"`, `cleanPass=false`, `buildOutcome.outcome="compile_failed"` |
| `artifact_validation` | all expected artifacts satisfied | `completed_clean` | `status="completed"`, `cleanPass=true`, `buildOutcome.outcome="built"` |
| `artifact_validation` | expected artifacts missing | `completed_non_clean` | `status="completed"`, `cleanPass=false`, `failureCode="EXPECTED_ARTIFACTS_MISMATCH"` |
| any active state | S7 unavailable, hard timeout, cancellation, resource exhaustion, or unhandled internal exception prevents envelope assembly | `task_failed` | non-completed `TaskStatus`: `model_error`, `timeout`, `budget_exceeded`, `unsafe_output`, or `empty_result` |

---

## 5. `cleanPass=true` conditions

`cleanPass=true` is allowed only when all conditions are true:

1. request contract was valid;
2. declared build mode was preserved;
3. Build Agent wrote or selected a reusable request-scoped build script/command;
4. `try_build` executed the generated request-scoped script, not an uploaded/reference script directly;
5. S4 build execution returned success evidence;
6. expected artifact verification succeeded;
7. no terminal build-domain diagnostic invalidates the result.

A compile database, promising logs, inferred command, or LLM claim is not enough for `cleanPass=true`.

---

## 6. `completed_non_clean` conditions

The following are result-level build-domain outcomes, not ordinary task-level failures, when the caller input is valid and Build Agent can still return a schema-valid envelope:

| Condition | Expected public shape |
|---|---|
| compile/build execution failed after bounded repair | `status="completed"`, `cleanPass=false`, `buildOutcome.outcome="compile_failed"` |
| expected artifacts are missing after a successful or partially successful build | `status="completed"`, `cleanPass=false`, `buildOutcome.outcome="artifact_mismatch"`, `failureCode="EXPECTED_ARTIFACTS_MISMATCH"` |
| declared SDK/materials are insufficient for build synthesis | `status="completed"`, `cleanPass=false`, `buildOutcome.outcome="missing_materials"` or `inconclusive` |
| SDK/toolchain selection conflicts with caller contract | `status="completed"`, `cleanPass=false`, `buildOutcome.outcome="sdk_mismatch"` |
| bounded repair cannot produce a trustworthy command/script | `status="completed"`, `cleanPass=false`, `buildOutcome.outcome="inconclusive"` |
| LLM attempts to directly execute uploaded/reference script | command must be blocked; repair if possible, otherwise completed non-clean with diagnostics |

---

## 7. Task-level failure boundary

Task-level failure is reserved for cases where Build Agent cannot responsibly reach build-domain classification.

Appropriate task-level failures:

1. invalid caller contract / malformed task envelope;
2. unsupported task type;
3. unsafe or out-of-scope project/build target path;
4. missing trusted project root or missing required caller-owned input that S3 has no authority to synthesize;
5. S7 dependency unavailable before useful classification can be made;
6. S4 dependency unavailable only when the outage prevents any schema-valid build-domain envelope from being assembled;
7. hard timeout or cancellation before result assembly;
8. budget/resource exhaustion preventing a schema-valid envelope;
9. internal exception preventing envelope assembly.

Not task-level failures when a valid completed envelope can be produced:

1. compile failure;
2. artifact mismatch;
3. missing build materials discovered after preflight;
4. bounded repair exhaustion;
5. SDK mismatch;
6. command-policy violation that can be diagnosed without executing unsafe command.

---

## 8. `scriptHintPath` / generated script invariant

`context.trusted.build.scriptHintPath` is reference material, not executable authority.

Canonical interpretation:
- path is relative to the effective BuildTarget root;
- the file must stay inside that root after normalization/symlink resolution;
- the file must be regular UTF-8 text under the documented size cap;
- inline script hint aliases are rejected;
- top-level `scriptHintPath` is rejected.

Execution invariant:

```text
Uploaded/reference script file MUST NOT be executed directly.
Only request-scoped generated script under build-aegis-*/ may be passed to try_build.
```

LLM-facing invariant:

```text
scriptHintPath content is untrusted/reference-only prompt material.
It must be wrapped/sanitized at the input-boundary before entering the prompt.
```

---

## 9. ToolIntent / tool-choice invariant

Build Agent must not rely on vLLM/OpenAI `tool_choice="required"` for mandatory first acquisition under the current Qwen/vLLM reasoning-parser stack.

Current production invariant:
- ordinary tool-capable turns use `tool_choice="auto"`;
- mandatory first acquisition is enforced by Build Agent runtime ToolIntent dispatch;
- unsupported caller tool choices such as `required` or named function choice must be rejected before HTTP submission;
- `finish_reason="tool_calls"` with empty `tool_calls[]` is an output-contract violation, not success.

This page follows the 2026-05-06 API contract and supersedes older Build Agent spec wording that still described `tool_choice="required"` as the first-turn mechanism.

---

## 10. Stabilization test oracle

For certificate-maker plus additional datasets, Build Agent stabilization should classify every run with this minimum matrix:

| Test observation | Expected classification |
|---|---|
| generated script builds and expected artifacts exist | `completed_clean` |
| generated script builds but expected artifacts missing | `completed_non_clean / artifact_mismatch` |
| generated script does not compile after repair | `completed_non_clean / compile_failed` |
| project lacks required build material but request is otherwise valid | `completed_non_clean / missing_materials` or `inconclusive` |
| invalid `buildTargetPath`, traversal, bad `scriptHintPath`, malformed strict contract | `preflight_failed / validation_failed` |
| S4 unavailable before build classification | current implementation treats the S4 call failure as a failed `try_build` tool result; repair/retry if possible, then `completed_non_clean` with diagnostics if envelope assembly succeeds, otherwise non-completed dependency/budget/timeout status |
| S7 output has empty tool calls / reasoning-only no action | retry if budget remains; otherwise non-completed output-contract/budget status or completed non-clean according to response assembly ability |
| LLM tries `bash scripts/build.sh` for uploaded reference script | must be blocked before S4 HTTP; repair or completed non-clean |

A hotN/system-stability pass must not treat HTTP 200 or `status="completed"` alone as clean success. It must report:

```text
task survival: response envelope produced
clean build success: result.cleanPass=true
non-clean reason: buildOutcome + buildDiagnostics
unsafe-command guard: direct reference-script execution was not sent to S4
```

---

## 11. Review checklist for future changes

Before changing Build Agent build-resolution behavior, verify:

1. Does the change preserve `completed != cleanPass`?
2. Does `cleanPass=true` still require S4 success evidence and expected artifact satisfaction?
3. Are uploaded/reference scripts still never executed directly?
4. Are writes still request-scoped?
5. Are caller-contract failures separated from build-domain non-clean outcomes?
6. Does bounded repair have a deterministic terminal classification?
7. Does the test suite include at least one clean, one artifact mismatch, one compile failure, and one unsafe-command/direct-script rejection case?
