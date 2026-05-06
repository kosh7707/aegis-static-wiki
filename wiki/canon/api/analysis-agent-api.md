---
title: "Analysis Agent API 명세"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/analysis-agent-api.md"
  - ".omx/plans/prd-s3-fail-never-state-machine-20260424.md"
  - ".omx/plans/prd-s3-system-stability-overhaul-20260425.md"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-paper-remediation-complete-20260427.md"
  - "/home/kosh/AEGIS/.omx/plans/test-spec-s3-paper-remediation-complete-20260427.md"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-post-ralplan-followup-defects-20260427.md"
  - "/home/kosh/AEGIS/.omx/plans/test-spec-s3-post-ralplan-followup-defects-20260427.md"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-generation-controls-wr-20260429.md"
  - "/home/kosh/AEGIS/.omx/plans/test-spec-s3-generation-controls-wr-20260429.md"
  - "mcp://aegis-static-wiki.write_page"
last_verified: "2026-05-06"
service_tags: ["s3", "analysis-agent", "api-contract", "s2"]
decision_tags: ["structured-output", "api-contract", "deep-analyze", "http-status", "state-machine", "result-outcomes", "agent-v1.1", "clean-pass", "wp-0a", "claim-diagnostics", "accepted-only-claims", "contract-notice", "wp-1", "generation-controls", "tool-schema-validation", "input-boundary", "topk-alignment", "transitional-deprecation", "regression-gate", "tool-intent-runtime-dispatch", "non-dynamic-api-audit"]
related_pages: ["wiki/canon/specs/analysis-agent.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/api-contract-decisions.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md", "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md"]
---

# Analysis Agent API 명세

> **소유자**: S3  
> **포트**: 8001  
> **호출자**: S2  
> **최종 업데이트**: 2026-05-06
> **계약 방향**: S3 claim-evidence state-machine `agent-v1.1` additive response schema contract.

Analysis Agent의 public contract 문서다. 2026-04-24부터 S3는 `completed`와 clean security pass를 분리한다. `completed`는 **schema-valid honest review result envelope**를 뜻하며, accepted claim / accepted PoC / clean hot-gate pass를 뜻하지 않는다.

정상 endpoint 입력과 required services health-alive 조건에서 S3-owned 내부 deficiency(`INVALID_SCHEMA`급 output deficiency, ref/grounding/quality/PoC rejection, no accepted claims, recoverable LLM-output deficiency)는 public task failure로 노출하지 않는다. RecoveryTriage/repair/outcome classification을 거쳐 `HTTP 200 + status="completed"` result envelope로 반환한다.

`agent-v1.1`은 **response schema/API contract label**이다. 이는 prompt identity가 아니며, `promptVersion=agent-v1` 및 `/v1/health.activePromptVersions.deep-analyze=agent-v1` 의미를 바꾸지 않는다. S3가 response schema를 노출할 때는 `schemaVersion=agent-v1.1` 및 additive health field(예: `activeResponseSchemas.deep-analyze=agent-v1.1`)를 사용한다.

2026-04-25 system-stability WP0 decision: `contextualEvidenceRefs`를 `agent-v1.1` public response field로 승격한다. Knowledge/CVE/CWE/CAPEC/ATT&CK 같은 contextual refs는 claim grounding proof가 아니므로 `usedEvidenceRefs`나 `claims[].supportingEvidenceRefs`에 들어가지 않고 `contextualEvidenceRefs`/diagnostics/audit에 기록한다.

---

## Base URL

```text
http://localhost:8001
```

## 공통 헤더

| 헤더 | 방향 | 설명 |
|---|---|---|
| `X-Request-Id` | request/response | 요청/응답 round-trip. S3는 이를 로그 및 S4/S5/S7 호출에 전파한다. |
| `X-AEGIS-Task-Status` | response | `/v1/tasks` 응답의 task status. 예: `completed`, `validation_failed`, `model_error`. |
| `X-AEGIS-Task-Ok` | response | task-level 완료 여부. `completed`면 `true`; true task failure면 `false`. `true`는 clean pass를 의미하지 않는다. |

---

## 엔드포인트 요약

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `deep-analyze`, `generate-poc` |
| GET | `/v1/health` | 상태 + prompt/version + LLM/KB 상태 |
| GET | `/v1/models` | model profiles |
| GET | `/v1/prompts` | prompt 목록 |

---

## POST /v1/tasks

### 지원 taskType

| taskType | 설명 |
|---|---|
| `deep-analyze` | 프로젝트 보안 심층 분석 (Phase 1/2 + structured finalization + outcome classification) |
| `generate-poc` | 특정 claim에 대한 PoC 생성 / rejection / inconclusive classification |

레거시 5개 taskType(`static-explain`, `static-cluster`, `dynamic-annotate`, `test-plan-propose`, `report-draft`)은 Analysis Agent가 직접 처리하지 않고 `UNKNOWN_TASK_TYPE`로 거절한다.

---

## HTTP / task 상태 의미

S3 `/v1/tasks`는 동기 task endpoint다. HTTP 2xx는 S3가 정상 review result envelope를 반환했음을 뜻한다. 단, `completed`는 clean pass가 아니다.

| Task outcome | HTTP | body signal |
|---|---:|---|
| 정상 검토 완료 | `200` | `status="completed"`, `validation.valid=true`, result-level outcome fields, `X-AEGIS-Task-Ok: true` |
| invalid caller contract / unsupported task type / missing required trusted input | `400/422` | structured error or task failure |
| unsafe / out-of-authority request | `422/403-like` | task failure |
| true dependency/runtime unavailable or dead before response assembly | `503` | `status="model_error"` or dependency failure code |
| hard timeout / cancellation that prevents envelope return | `504` | `status="timeout"`, `failureCode="TIMEOUT"` |
| impossible schema-valid envelope assembly / internal exception | `500` | `INTERNAL_ERROR` |

Consumer 규칙:
- `status="completed"`는 task completion이다.
- Clean pass 판단은 `analysisOutcome`, `qualityOutcome`, `pocOutcome`을 함께 읽는다.
- `X-AEGIS-Task-Ok: true`는 S3가 result envelope를 정상 반환했다는 뜻이며, accepted claim/PoC를 뜻하지 않는다.
- `failureCode`는 true task failure 응답에만 있어야 한다. Valid input + health-alive internal deficiency는 `failureCode` 대신 result outcome / `recoveryTrace` / `audit.agentAudit`에 기록한다.

---

## 핵심 요청 필드

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `taskType` | string | O | `deep-analyze` 또는 `generate-poc` |
| `taskId` | string | O | 호출자 추적용 ID |
| `context` | object | O | trusted/semiTrusted/untrusted 입력 컨텍스트 |
| `evidenceRefs` | array | X | S2가 제공한 증적 ref 목록 |
| `constraints.maxTokens` | int | X | 생성 토큰 제한 |
| `constraints.timeoutMs` | int | X | advisory downstream/tool budget 힌트. elapsed wall-clock time만으로 S3 agent loop를 hard-abort시키는 값은 아니다. |
| `constraints.enableThinking` | bool | X | S3 generation preset의 thinking flag override. 기본은 thinking-on. |
| `constraints.temperature` | number | X | optional generation temperature override (`0..2`). |
| `constraints.topP` | number | X | optional top-p override (`0..1`). |
| `constraints.topK` | int | X | optional top-k override (`>=-1`). `-1` preserves the S7/vLLM unlimited top-k sentinel; named S3 presets still use positive defaults. |
| `constraints.minP` | number | X | optional min-p override (`0..1`). |
| `constraints.presencePenalty` | number | X | optional presence penalty override (`-2..2`). |
| `constraints.repetitionPenalty` | number | X | optional repetition penalty override (`0..2`). |

### Generation-control constraints (2026-04-29)

The public `constraints.*` generation override surface is camelCase-only. Snake_case keys such as `top_p`, `top_k`, `min_p`, `presence_penalty`, and `repetition_penalty` are rejected at the S3 API boundary. Internally S3 serializes to S7 snake_case when calling `/v1/chat` or `/v1/async-chat-requests`.

If callers omit these optional fields, S3 applies service-owned named presets and still sends the complete S7-required tuple. `constraints.maxTokens` accepts `1..32768`; `constraints.topK` accepts `-1` or any positive integer to align with S7. Stricter sub-call caps such as the structured finalizer cap remain internal per-call policy and do not change the public acceptance range.

### Tool dispatch and `tool_choice` policy (2026-05-06)

Analysis Agent does **not** use vLLM/OpenAI `tool_choice="required"` for mandatory evidence acquisition. Current production policy is:

| Situation | S7 request shape | Enforcement authority |
|---|---|---|
| Ordinary tool-capable LLM turn | `tools=[...]`, `tool_choice="auto"` | vLLM may choose tool call or content; S3 validates/handles the result. |
| Mandatory first acquisition before any successful tool call | `tools=None`, no `tool_choice`, strict JSON ToolIntent, thinking enabled | S3 runtime converts the ToolIntent JSON into a synthetic `ToolCallRequest` and dispatches it. |
| Finalizer / forced report / no tools available | tool-less strict JSON or ordinary content path | S3 result assembly / schema repair / outcome classification. |

This supersedes the older P10 shorthand that used `tool_choice="required"`. The reason is the 2026-05-03 Qwen/vLLM incompatibility where `enable_thinking=true` plus `tool_choice="required"` can produce `finish_reason="tool_calls"` with empty `tool_calls`. S3 therefore preserves the safety goal — no report before required acquisition — through ToolIntent runtime dispatch rather than guided tool-choice.

Callers must not infer clean success from this dispatch policy. The public contract remains result-level: `status="completed"` is an honest envelope, while clean deep/PoC success must be read from `analysisOutcome`, `qualityOutcome`, `pocOutcome`, `cleanPass`, and diagnostics.

### `deep-analyze`용 `context.trusted`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `objective` | string | O | 분석 목표 |
| `projectPath` | string | △ | 프로젝트 루트 절대 경로 |
| `targetPath` | string | X | `projectPath` 기준 상대 경로 |
| `files` | array | △ | fallback file-content 입력 |
| `projectId` | string | X | code-graph / memory용 프로젝트 식별자 |
| `buildCommand` | string | X | 있으면 Phase 1 build-and-analyze 경로 시도 |
| `buildEnvironment` | object | X | build path에 전달할 environment |
| `buildProfile` | object | X | S4 scan/profile 보강 입력 |
| `provenance` | object | X | `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId` 등 |
| `sastFindings` | array | X | precomputed findings 제공 시 Phase 1 일부 스킵 |
| `scaLibraries` | array | X | precomputed SCA 제공 시 해당 결과 사용 |
| `thirdPartyPaths` | string[] | X | S4 heavy analyzer 제외 대상 |
| `sastTools` | string[] \| null | X | S4 도구 subset 선택 |

`projectPath`와 `files` 중 최소 하나는 있어야 한다.

### preferred explicit-step aliases

| 필드 | 타입 | 설명 |
|---|---|---|
| `buildPreparation` | object | Build Agent 성공 응답에서 전달받은 build bundle. |
| `quickContext` | object | Quick 단계 결과 bundle. |
| `graphContext` | object | graph/ready 상태 bundle. |

### `generate-poc`용 `context.trusted`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `objective` | string | O | PoC 생성 목표 |
| `claim` | object | O | deep-analyze 결과 claim. missing/invalid이면 task failure. |
| `files` | array | O | 관련 소스 파일 내용. missing이면 task failure. |
| `buildPreparation` | object | X | Build Agent 산출물. PoC 실행 경로/바이너리 이름 추론에 사용. |

---

## 성공 응답 (`TaskSuccessResponse`)

성공 시 HTTP `200` + `status: "completed"` + `X-AEGIS-Task-Ok: true`.

핵심 top-level 필드:
- `taskId`, `taskType`, `status`
- `modelProfile`, `promptVersion`, `schemaVersion`
- `validation.valid=true`
- `result`
- `audit`

### `AssessmentResult` fields

| 필드 | 타입 | 설명 |
|---|---|---|
| `summary` | string | 검토 요약 |
| `claims[]` | array | accepted final claims only. Rejected candidates may remain in audit/recovery trace, not as accepted claims. |
| `caveats[]` | string[] | 제한/불확실성 |
| `usedEvidenceRefs[]` | string[] | v1 final refs: local or derived-from-local only |
| `suggestedSeverity` | string \| null | `critical/high/medium/low/info` |
| `confidence` | number | 0..1 |
| `needsHumanReview` | bool | 분석가 검토 필요 여부 |
| `recommendedNextSteps[]` | string[] | 다음 권고 |
| `policyFlags[]` | string[] | structured_finalizer, recovery classification 등 policy flags |
| `analysisOutcome` | enum | `accepted_claims`, `no_accepted_claims`, `inconclusive` |
| `qualityOutcome` | enum | `accepted`, `accepted_with_caveats`, `rejected`, `inconclusive`, `repair_exhausted` |
| `pocOutcome` | enum | `poc_accepted`, `poc_rejected`, `poc_inconclusive`, `poc_not_requested` |
| `recoveryTrace[]` | array | bounded public deficiency/recovery summaries |
| `cleanPass` | bool | strict clean evaluation pass 여부. `completed`와 별개다. |
| `evaluationVerdict` | object | task completion, clean pass, gate reasons, gate outcomes를 소비자용으로 요약한다. |
| `contextualEvidenceRefs[]` | string[] | knowledge/context refs. local proof list가 아니며 claim support로 쓰지 않는다. |
| `evidenceDiagnostics` | object | invalid/wrong-role/missing-slot/unclassified refs 및 acquisition diagnostics. |
| `qualityGate` | object | accepted/caveated/rejected/inconclusive/repairable gate result와 failed/repairable items. |

### Outcome semantics

| Condition | Result-level outcome | Task status |
|---|---|---|
| grounded accepted claims exist | `analysisOutcome=accepted_claims`, `qualityOutcome=accepted` or caveated | `completed` |
| no claim can be accepted honestly | `analysisOutcome=no_accepted_claims` | `completed` |
| partial evidence/tool limits prevent conclusion | `analysisOutcome=inconclusive` | `completed` |
| quality repair exhausted | `qualityOutcome=repair_exhausted`; for `generate-poc`, exhausted quality repair uses `pocOutcome=poc_inconclusive` | `completed` |
| PoC accepted | `pocOutcome=poc_accepted` | `completed` |
| PoC rejected or inconclusive for valid PoC request/runtime | `pocOutcome=poc_rejected` or `poc_inconclusive` | `completed` |

Clean deep pass = `completed + analysisOutcome=accepted_claims + qualityOutcome=accepted + cleanPass=true`.  
Clean PoC pass = `completed + pocOutcome=poc_accepted + qualityOutcome=accepted + cleanPass=true`.

### 2026-04-28 PoC quality exhaustion refinement

For valid `generate-poc` requests where S3 performs bounded quality repair but exhausts the configured quality-repair cap or request-scoped repair budget, the completed envelope uses:

```text
qualityOutcome = repair_exhausted
pocOutcome = poc_inconclusive
recoveryTrace.action = poc_quality_repair_exhausted
cleanPass = false
```

This distinguishes “S3 tried to produce a safe, claim-bound PoC but could not conclude” from ordinary `poc_rejected` cases. Immediate unsafe, hallucinated-ref, or grounding-deficient PoC outputs remain `poc_rejected`. This is a result-semantic refinement only; `/v1/tasks` top-level response shape and `completed` survival semantics are unchanged.

---

## Recovery / deficiency policy

When input is valid and required services are health-alive, these are not public task failures:

- malformed/non-JSON/partial LLM output while S7 is reachable;
- internal schema deficiencies such as `INVALID_SCHEMA`;
- hallucinated, missing, or wrong-role refs;
- grounding deficiencies;
- no accepted claims;
- quality rejection or repair exhaustion;
- PoC schema/ref/quality/safety rejection.

They must become result-level outcomes and be visible through `result.recoveryTrace`, `result.policyFlags`, and/or `audit.agentAudit`.

---

## Failure 응답 (`TaskFailureResponse`)

Task failure remains narrow:

| status | failureCode 예시 | HTTP | Use when |
|---|---|---:|---|
| `validation_failed` | `INVALID_SCHEMA` | `400/422` | caller request contract invalid or required trusted input missing, not S3-owned final-output deficiency under live runtime |
| `unsafe_output` | `UNSAFE_CONTENT` | `422/403-like` | unsafe/out-of-authority request |
| `model_error` | `MODEL_UNAVAILABLE`, `LLM_OVERLOADED` | `503` | required service genuinely unavailable/dead before any response can be assembled |
| `timeout` | `TIMEOUT` | `504` | hard timeout/cancel prevents envelope return |
| `budget_exceeded` | `TOKEN_BUDGET_EXCEEDED`, `MAX_STEPS_EXCEEDED` | `413` | only when budget condition prevents any schema-valid completed envelope; otherwise classify as `repair_exhausted`/`inconclusive` |
| internal exception | `INTERNAL_ERROR` | `500` | S3 cannot assemble any valid response envelope |

---

## GET /v1/health

`/v1/health` keeps coarse service health and request-aware control-signal summary.

Important fields:
- `service`, `status`, `version`, `llmMode`, `modelProfiles`, `activePromptVersions`
- `activeRequestCount`
- `requestSummary.state`: `idle`, `queued`, `running`, `failed`
- `requestSummary.localAckState`: `phase-advancing`, `transport-only`, `ack-break`, or `null`
- `activeResponseSchemas.deep-analyze`: additive response schema label such as `agent-v1.1` when exposed
- `rag.status`, `llmBackend` when applicable

Elapsed wall-clock time alone is not a local abort trigger. Long external waits may surface `transport-only` while S3 still owns eventual result assembly.

---

## 2026-04-24 implementation note

This contract supersedes the 2026-04-21 terminal-output-failure wording for valid-input/live-runtime S3-owned deficiencies. Strict finalization and schema repair still exist, but exhaustion after those recovery attempts should classify into completed result-level outcomes when S3 can assemble a schema-valid honest envelope.

---

## 2026-04-25 `agent-v1.1` deadline note

`constraints.timeoutMs` remains advisory by default. It shapes downstream/tool budgets and timeout hints but is not reinterpreted as a hard caller abort. Enforced S3 assembly/async-poll deadlines are S3-owned service configuration. If callers need a hard public deadline, S3 must introduce an explicit opt-in field/header such as `constraints.hardDeadlineMs` or `X-AEGIS-Hard-Deadline-Ms` through a separate contract notice.

<!-- S3-WP0A-20260427:START -->
## 2026-04-27 WP-0a/WP-1 public claim lifecycle contract gate

This section is the canonical pre-code/public-contract gate for the S3 paper-remediation implementation plan. WP-1 refined the exact bounded diagnostic shape while preserving the WP-0a placement rule.

### Accepted-only final claim surface

```text
result.claims[] = accepted final claims only
```

`result.claims[]` MUST NOT contain raw `candidate`, `under_evidenced`, `rejected`, or other non-accepted lifecycle candidates. A claim may appear in `result.claims[]` only after schema, ref, required-evidence, grounding, and quality-gate acceptance invariants hold.

Accepted final claims expose the legacy four fields plus additive lifecycle fields:

- legacy: `statement`, `detail`, `supportingEvidenceRefs`, `location`;
- additive: `claimId`, `status`, `requiredEvidence`, `presentEvidence`, `missingEvidence`, `evidenceTrail`, `queryHistory`, `revisionHistory`.

Public `status` values inside `result.claims[]` are restricted to accepted/caveated final states. In the current automated path this means `grounded` only. `needs_human_review` is sticky but diagnostic-only until S3 introduces an explicit human-acceptance path; `candidate`, `under_evidenced`, `needs_human_review`, and `rejected` stay out of this array.

### Non-accepted lifecycle diagnostic surface

S3 exposes non-accepted lifecycle information through bounded `result.claimDiagnostics` and detailed audit/recovery records, not through final accepted claims. Current additive shape:

```json
{
  "claimDiagnostics": {
    "lifecycleCounts": { "under_evidenced": 1 },
    "nonAcceptedClaims": [
      {
        "claimId": "claim-0",
        "status": "under_evidenced",
        "family": "command_injection",
        "primaryLocation": "src/main.c:42",
        "requiredEvidence": ["local_or_derived_support", "source_location", "sink_or_dangerous_api", "caller_chain_or_source_slice"],
        "presentEvidence": [],
        "missingEvidence": ["local_or_derived_support", "source_location", "sink_or_dangerous_api", "caller_chain_or_source_slice"],
        "evidenceTrail": [],
        "revisionHistory": [
          { "fromStatus": "candidate", "toStatus": "under_evidenced", "reason": "missing:local_or_derived_support,source_location,sink_or_dangerous_api,caller_chain_or_source_slice", "timestampMs": 1710000000000 }
        ],
        "invalidRefs": [],
        "supportingEvidenceRefs": ["eref-knowledge-CWE-78"],
        "outcomeContribution": "no_accepted_claims"
      }
    ]
  }
}
```

`result.claimDiagnostics.nonAcceptedClaims[]` is bounded for frontend/developer consumption. Full attempt history, raw rejected narratives, and verbose tool records remain in audit/debug artifacts.

2026-04-28 Pass-A refinement: `nonAcceptedClaims[]` now carries the same bounded lifecycle proof fields needed for developer-facing evidence consumption: `requiredEvidence`, `presentEvidence`, `missingEvidence`, `evidenceTrail`, and `revisionHistory`. `outcomeContribution="rejected_unsupported"` is used when all cited claim refs are invalid/missing and the state machine classifies the candidate as `rejected`.
`outcomeContribution="needs_human_review"` is used when the state machine preserves sticky NHR but no explicit human acceptance has promoted the claim into the public accepted surface.

#### `nonAcceptedClaims[]` typed consumer vocabulary (S2 export, 2026-05-06)

S2 exposes the per-claim diagnostic surface to S1 through `@aegis/shared` as `NonAcceptedClaim[]`. The S3 wire key remains `status`; S2 treats that key as the lifecycle-stage field and does not synthesize a separate `lifecycleStage` alias on the REST facade. Current documented lifecycle-stage examples are:

| `status` value | Meaning | Consumer policy |
|---|---|---|
| `candidate` | Candidate existed before acceptance checks completed. | Diagnostic only; not an accepted finding. |
| `under_evidenced` | Required evidence slots were not fully satisfied. | Show missing evidence and review/rerun guidance. |
| `needs_human_review` | State machine preserved sticky human-review state without accepted promotion. | Human-review diagnostic; not clean success. |
| `rejected` | Claim was rejected by evidence/quality checks. | Negative diagnostic; show reason/code when present. |
| `retried` | Claim participated in a repair/retry loop. | Display retry context when present. |
| `inconclusive` | Lifecycle could not reach accepted/rejected confidence. | Review/fallback tone. |
| `repair_exhausted` | Repair budget exhausted before clean acceptance. | Critical-review/human-review tone. |
| `withdrawn` | Candidate was withdrawn/superseded. | Low-priority diagnostic unless paired with stronger outcome. |

`rejectionCode` is an optional **open string**. S3 may emit stable codes over time without forcing a closed enum rollout; S1/S2 must not reject unknown codes. Current examples only:

| Example code | Meaning |
|---|---|
| `evidence_missing` | Required evidence was absent or insufficient. |
| `rejected_unsupported` | Cited refs were invalid/missing and the claim was rejected as unsupported. |
| `quality_repair_exhausted` | Repair loop could not produce an acceptable claim/PoC envelope. |
| `unsafe_or_out_of_scope` | Candidate was unsafe, irrelevant, or outside authorized analysis scope. |

`outcomeContribution` remains the S3-owned aggregate contribution hint. Current examples include `no_accepted_claims`, `rejected_unsupported`, `needs_human_review`, `poc_rejected`, and `poc_inconclusive`; additional values are additive diagnostics and must default to review/fallback presentation.

`generate-poc` follows the same accepted-only rule. Raw producer candidates are passed through the claim/evidence state machine before they can appear in `result.claims[]`. Trusted upstream bare ref IDs may satisfy allowlisting / generic `local_or_derived_support` only; they do not fabricate family-specific slots such as `sink_or_dangerous_api`, `caller_chain_or_source_slice`, or `source_slice` unless request/file/catalog evidence actually provides those roles. If zero PoC claims survive as accepted, S3 still returns a completed envelope with `analysisOutcome="no_accepted_claims"` and diagnostics rather than a task-level output error.

### Evidence diagnostics and completed-vs-clean interpretation

`result.evidenceDiagnostics` may include `negativeAttempts[]` / `attemptedAcquisitions[]`. Negative, operational, knowledge-only, and rejected records do not become claim-support refs.

Consumer interpretation remains:

- `HTTP 200 + status="completed"` means S3 returned a schema-valid honest review envelope.
- Clean/security success must be read from `analysisOutcome`, `qualityOutcome`, `pocOutcome`, `cleanPass`, final accepted `claims[]`, `claimDiagnostics`, and `evidenceDiagnostics`.
- Valid input + live required services + no accepted claims is `completed` with `analysisOutcome="no_accepted_claims"` or `analysisOutcome="inconclusive"`, not a task-level `INVALID_SCHEMA` / `LLM_BUSY` failure.

This remains notify-style canonical: S3 may implement the additive contract immediately after notifying S2; S2 approval wait is not required for S3-owned contract changes.
<!-- S3-WP0A-20260427:END -->
