---
title: "S3. Analysis Agent 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s3-handoff/README.md"
  - "/home/kosh/AEGIS/.omc/state/codex-handoff-progress.md"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-paper-remediation-complete-20260427.md"
last_verified: "2026-05-12"
service_tags: ["s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract", "paper-remediation-complete", "system-stability", "hotn-reporting", "build-v1.1-default", "critic-fix", "planner-runtime-wiring", "negative-evidence-honesty", "thinking-on", "generation-controls", "tool-schema-validation", "input-boundary", "s7-contract", "s7-health-readiness", "topk-alignment", "transitional-deprecation", "regression-gate", "tool-intent-runtime-dispatch", "non-dynamic-api-audit", "static-evidence-contract-v1", "evidence-readiness", "s4-static-evidence-gates", "s4-quality-evaluation-boundary", "s4-consolidated-contract", "tool-liveness", "system-stability-gate", "s4-local-quality-gate-boundary", "s4-current-api-alignment", "static-evidence-contract-fail-closed"]
related_pages: ["wiki/canon/roadmap/s3-roadmap.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/implementation-work-packages.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md", "wiki/canon/work-requests/s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin.md", "wiki/canon/work-requests/s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability.md", "wiki/canon/work-requests/s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re.md", "wiki/canon/handoff/s7/session-s7-thinking-default-true-20260428.md", "wiki/canon/api/llm-gateway-api.md", "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md", "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance.md", "wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update.md", "wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/handoff/s4/session-s4-api-doc-sync-20260512.md", "wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md"]
---

# S3. Analysis Agent 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.**
> **마지막 업데이트: 2026-05-12**

이 문서는 S3 lane의 현재 책임, 경계, 아키텍처, 그리고 2026-05-08 기준 최신 implementation/contract 정렬 상태를 다음 세션이 바로 이어받을 수 있도록 정리한 canonical handoff다.

---

## 1. S3의 역할

### S3 소유 서비스

| 서비스 | 포트/위치 | 역할 |
|---|---|---|
| Analysis Agent | `:8001` | `deep-analyze`, `generate-poc` |
| Build Agent | `:8003` | `build-resolve`, `sdk-analyze` |
| agent_runtime (service-local) | 각 서비스 내부 `app/agent_runtime/` | Analysis/Build 각각의 로컬 LLM/도구/정책/스키마 프레임. 공유 런타임 디렉터리는 retired/deleted 상태 |

### S3가 호출하는 외부 서비스

| 서비스 | 소유 | 역할 |
|---|---|---|
| S7 Gateway (`:8000`) | S7 | 모든 LLM 호출 단일 관문 |
| S4 SAST Runner (`:9000`) | S4 | scan / functions / libraries / build-and-analyze / build |
| S5 Knowledge Base (`:8002`) | S5 | KB search / CVE lookup / code-graph / project-memory |

### S3의 정체성

> S3는 **결정론적 수집 + 구조화된 LLM 해석**으로 동작하는 증거 기반 보안 분석/control-plane 계층이다.

핵심 원칙:
1. Phase 1 결정론적 실행 우선
2. Phase 2 LLM 결정 표면 최소화
3. Evidence-first
4. public contract/health surface 안정성 우선

---

## 2. 소유 문서

| 문서 | 경로 |
|---|---|
| S3 handoff | `wiki/canon/handoff/s3/readme.md` |
| S3 roadmap | `wiki/canon/roadmap/s3-roadmap.md` |
| Analysis Agent spec | `wiki/canon/specs/analysis-agent.md` |
| Build Agent spec | `wiki/canon/specs/build-agent.md` |
| Analysis Agent API | `wiki/canon/api/analysis-agent-api.md` |
| Build Agent API | `wiki/canon/api/build-agent-api.md` |

문서 갱신 원칙:
- canonical wiki를 먼저 갱신한다.
- `docs/**`는 migration/compatibility surface일 뿐 canonical source가 아니다.
- 다른 lane 코드 동작은 API 계약서와 WR로만 이해한다.

---

## 3. 경계와 운영 규칙

### 다른 서비스 코드
- 다른 lane 코드 열람 금지
- 연동 해석은 API 계약서와 WR 기준
- 계약과 구현이 어긋나면 WR로 조정

### 금지/주의
- 커밋 금지
- 사용자 허락 없는 서비스 start/stop 금지
- canonical WR은 `wiki/canon/work-requests/**` 기준
- `docs/work-requests/**`는 archive-only reference

### Codex/OMX 메모
- 로그/장애 분석은 `log-analyzer` 우선
- 문서/세션 기록은 `wiki/canon/handoff/s3/` 우선
- lane 전용 진행 상태는 `.omx/state`와 handoff session artifact로 남긴다

---

## 4. 현재 아키텍처 상태 (2026-04-14)

### Analysis Agent 공개 surface
- `POST /v1/tasks`
  - `deep-analyze`
  - `generate-poc`
- `GET /v1/health`
- `GET /v1/models`
- `GET /v1/prompts`

### Build Agent 공개 surface
- `POST /v1/tasks`
  - `build-resolve`
  - `sdk-analyze`
- `GET /v1/health`

### 내부 레이아웃 요약

| 영역 | 현재 파일 |
|---|---|
| analysis public router | `services/analysis-agent/app/routers/tasks.py` |
| analysis handlers | `services/analysis-agent/app/routers/deep_analyze_handler.py`, `generate_poc_handler.py` |
| analysis phase1 façade / flow | `services/analysis-agent/app/core/phase_one*.py` |
| analysis loop / result assembly | `services/analysis-agent/app/core/agent_loop.py`, `result_assembler.py` |
| analysis ToolIntent dispatch | `services/analysis-agent/app/core/agent_loop.py`, `services/analysis-agent/app/agent_runtime/llm/caller.py` |
| build public router | `services/build-agent/app/routers/tasks.py` |
| build handlers | `services/build-agent/app/routers/build_resolve_handler.py`, `sdk_analyze_handler.py` |
| build phase0 / loop / result assembly | `services/build-agent/app/core/phase_zero.py`, `agent_loop.py`, `result_assembler.py` |
| build ToolIntent dispatch | `services/build-agent/app/core/agent_loop.py`, `services/build-agent/app/agent_runtime/llm/caller.py` |
| service-local caller / policy / router | `services/analysis-agent/app/agent_runtime/**`, `services/build-agent/app/agent_runtime/**` |
| analysis legacy direct caller | `services/analysis-agent/app/clients/real.py` |
| analysis eval helper | `services/analysis-agent/eval/eval_runner.py` |

---

## 5. 보호해야 하는 외부 surface

다음은 **S2-visible protected surface**이며 내부 리팩토링 중에도 바꾸면 안 된다.

1. Analysis Agent `/v1/health`
   - `activePromptVersions = {deep-analyze: agent-v1, generate-poc: v1}`
2. Build Agent `/v1/health`
   - `version = 1.0.0`
3. Build Agent strict contract parsing
   - top-level `contractVersion`, `strictMode`
   - legacy alias normalization 유지
4. `/v1/tasks` request/response top-level shape
5. Analysis Agent legacy task rejection semantics

보충 메모:
- `result.buildPreparation` 추가는 기존 protected surface를 깨지 않는 **확장**이다.
- Analysis Agent nested explicit-step alias 지원도 **compatibility-preserving alias 추가**다.
- 2026-04-14의 후속 S5/S7 hardening은 **internal consumer-side behavior** 변화이며, 추가 outward S3 public API delta는 아니다.

---

## 6. 2026-04-14 기준 최신 상태

### 완료된 핵심 정렬
- shared `TerminationPolicy` / `BudgetManager` / `ToolRouter` 공통화
- Build Agent `tasks.py` thin-router 분리 완료
- Analysis Agent `tasks.py` thin-router 분리 완료
- Build Agent `build-resolve` 성공 응답에 `result.buildPreparation` 추가
- Analysis Agent `deep-analyze`에 `buildPreparation` / `quickContext` / `graphContext` alias 입력 추가
- Analysis Agent `/v1/health`에 request-aware control-signal summary (`activeRequestCount`, `requestSummary`) 추가
- elapsed wall-clock time alone으로는 더 이상 S3 로컬 abort를 발생시키지 않도록 정렬
- Analysis Agent `/health`는 장시간 대기 구간에서 `transport-only`를 노출할 수 있음

### S5 2026-04-14 notice 소비
- explicit `408 TIMEOUT` vs `503 KB_NOT_READY` 구분
- code-graph ingest `status/readiness/warnings` 실제 소비
- GraphRAG/code-graph readiness에 따라 phase-2 graph tools gating
- `dangerous-callers`는 Neo4j readiness가 명시적으로 false면 실행하지 않음
- prompt에서 S5 timeout/partial-readiness를 negative evidence처럼 오해하지 않도록 caveat 반영

### S7 2026-04-14 phase-2 소비
- tool-less LLM 호출은 새 async ownership surface를 우선 사용
- async surface unavailable이면 sync `/v1/chat`로 fallback
- 적용 범위:
  - analysis-agent agent loop
  - `generate-poc`
  - `build-agent` agent loop
  - analysis-agent legacy `RealLlmClient` / `TaskPipeline`
  - analysis-agent `eval_runner`
- unsupported async surface(404/405/501)는 짧게 cooldown 캐시하여, 매 호출마다 같은 probe를 반복하지 않도록 정렬

### 의미
- public surface는 유지된다.
- explicit build-preparation → Quick → Deep 계약 분리는 유지된다.
- timeout-policy redesign first rollout은 `/health` 중심으로 정렬되었다.
- no-result-loss 방향의 phase-2 async ownership surface는 S3 내부 주요 tool-less LLM 경로에서 실제 소비 중이다.
- 최근 S5/S7/S4 변화는 문서 수준이 아니라 S3 내부 동작에도 반영된 상태다.

### 2026-05-08 health-control v2 소비 상태
- Analysis/Build service-local `LlmCaller`와 analysis `eval_runner.py`에서 fixed async poll-deadline abort를 제거했다. Queued/running S7 ownership은 elapsed age만으로 취소하지 않는다.
- Analysis Agent S4 SAST scan은 `/v1/scan` durable ownership/status/result를 우선 사용한다. NDJSON fallback stream inactivity는 `/v1/health?requestId=` 확인 후 alive면 계속 대기한다.
- Analysis Agent Phase 1 `build-and-analyze`는 S4 durable ownership/status/result를 우선 사용하고, ack-break/blocked/domain-failure evidence를 보존한다.
- Build Agent `try_build`는 S4 `/v1/build` durable ownership/status/result를 우선 사용한다. Child `X-Request-Id`는 parent id + endpoint + operation + payload fingerprint 기반이라, 같은 retry는 idempotent하고 변경된 build command는 새 ownership을 얻는다.
- Analysis/Build ToolExecutor는 `wait_while_alive=true` tool에 generic 120s cutoff를 적용하지 않는다.
- Build Agent `/v1/health`는 additive `activeRequestCount` / `requestSummary`를 노출한다.

---

## 7. 최신 검증 상태 (2026-04-14)

### fresh verification snapshot
- `services/analysis-agent/.venv/bin/python -m pytest -q` → **585 passed** (2026-05-08)
- `services/build-agent/.venv/bin/python -m pytest -q` → **388 passed** (2026-05-08)
- focused health-control v2 blocker suite (`test_sast_tool.py`, `test_phase_one.py`, `test_health_control_v2_static_guard.py`) → **66 passed**
- `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval services/build-agent/app && git diff --check -- services/analysis-agent services/build-agent` → **PASS**

### 최근 focused evidence 하이라이트
- analysis-agent focused timeout-policy/health/async-ownership reruns green
- build-agent protected/contract/async-ownership reruns green
- eval helper async-ownership fallback/cooldown hardening green
- `generate-poc`, `deep-analyze`, `sdk-analyze`, `build-resolve` route-level async-ownership preference regression 추가

### 무엇을 최근에 검증했는가
- Build Agent success 응답의 `buildPreparation` bundle 유지
- Analysis Agent health summary의 idle / running / transport-only / ack-break semantics
- S5 `408 TIMEOUT` / `503 KB_NOT_READY` 소비 분리
- S5 code-graph ingest readiness에 따른 graph-tool gating
- S7 async ownership surface 우선 사용 + sync fallback
- unsupported async surface cooldown 캐싱
- route-level handler에서 실제 async ownership preference 요청 여부

---

## 8. 다음 세션에서 바로 이어갈 수 있는 것

1. **live runtime smoke 확대**
   - S7 async ownership surface가 실제 localhost/runtime에 배포된 상태에서 end-to-end smoke
   - S4/S7 `/health?requestId=` live polling smoke
2. **phase-2 durability question**
   - S7 async ownership retention이 process restart를 넘어 durable해야 하는지 판단
   - 필요 시 narrower WR / contract note 발행
3. **explicit-step contract 명문화 강화**
   - `buildPreparation` / `quickContext` / `graphContext` schema/fixtures 정리
4. **legacy drift 정리**
   - mounted backend/orchestration wording의 legacy Quick→Deep 자동 후속 표현 추적

현재 상태는 **public contract를 유지한 채 explicit-step + health-control + no-result-loss internal consumption을 상당 부분 실제 코드에 반영한 상태**다.

---

## 9. 2026-04-26 Producer/Critic/Orchestrator refactor status

S3는 retained shared-kernel 방향을 폐기하고, Analysis Agent와 Build Agent가 primitive runtime helper까지 service-local copy/specialization으로 소유하는 방향으로 전환했다.

핵심 경계:
- Producer: quality-aware candidate artifact author. 최종 score/verdict authority 없음.
- Critic / QualityGate: independent classifier / repair planner. Evidence fabrication 금지.
- Orchestrator / State Machine: task survival boundary, RecoveryTriage, final envelope authority.

현재 구현 표면:
- Analysis runtime: `services/analysis-agent/app/agent_runtime/`
- Build runtime: `services/build-agent/app/agent_runtime/`
- Analysis role modules: `app/producers`, `app/quality`, `app/state_machine`
- Build role modules: `app/producers`, `app/quality`, `app/state_machine`

후속 ownership coordination:
- 2026-04-27 기준 canonical charter와 로컬 bootstrap ownership map은 S3 active path를 `services/analysis-agent`, `services/build-agent`로 정렬했다.
- 앞으로 공유 런타임 디렉터리를 active S3 owned path로 다시 추가하지 않는다. 필요한 primitive helper는 각 서비스 내부 `app/agent_runtime/`에서 독립적으로 소유한다.

---

<!-- S3-PAPER-REMEDIATION-20260427:START -->
## 10. 2026-04-27 Paper-remediation / system-stability Ralph status

The S3 paper-remediation stabilization run is final-verified after Critic/Architect blocker fixes and canonical session/test evidence recording. This pass exists to make the S3 state machine obey the “valid input + live dependencies ⇒ completed result envelope” rule while still preserving honest quality outcomes.

Implemented surfaces:
- Analysis Agent evidence ledger now preserves append-only history and separates negative/operational attempts from final proof refs.
- Final accepted claims carry first-class lifecycle/status/slot diagnostics; rejected/under-evidenced candidates are exposed through `result.claimDiagnostics.nonAcceptedClaims[]`, not `result.claims[]`.
- Recovery/outcome routing uses an SSoT outcome-for-deficiency path for schema/ref/grounding/quality/repair-exhausted deficiencies.
- Phase 2 prompts receive live recovery/evidence ledger summaries and deterministic next-acquisition suggestions wired through the live `deep-analyze` runtime.
- PoC generation has structural quality gates and bounded configurable quality-repair attempts (default 2) with request-scoped budget guard; repair exhaustion returns completed non-clean outcome instead of ordinary endpoint failure.
- Readiness gating removes unavailable knowledge/code-graph tools and tells the model not to request them.
- Build Agent response schema is active `build-v1.1`; `EXPECTED_ARTIFACTS_MISMATCH` is a completed non-clean build-domain outcome with diagnostics.
- Producer/Critic/Orchestrator role boundaries are now test-guarded without adding import-linter dependency.
- Evaluation/hotN scaffold reports task completion separately from accepted claims, no accepted claims, inconclusive results, PoC accepted/rejected/inconclusive, strict clean pass, and silent-200 diagnostic coverage.

Fresh verification captured during this Ralph run:
- Analysis Agent full suite after Critic/Architect blocker fixes, direct slot-test reinforcement, and deslop: `449 passed in 4.64s` at that closeout checkpoint; superseded by the 2026-04-28 post-fix polish verification below.
- Build Agent full suite: `254 passed in 0.50s`.
- Wiki validation after canonical API/spec updates: PASS.
- Critic/Architect first pass rejected WP-4 planner wiring; the live runtime wiring and negative-ref diagnostic fixes were then implemented and reverified.
- Second review rejected WP-5 budget/config/repairHint closure and missing canonical session evidence; PoC repair budget/config/repairHint wiring and `record_session_history`/`append_test_evidence` evidence were then completed. Refreshed closeout review then rejected family-slot honesty and generate-poc repaired-success telemetry/spec drift; deterministic family slot enforcement, deep quality slot sufficiency, repaired-success latency/log timing, and spec corrections were applied.

Relevant WRs emitted to S2:
- `wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice.md`
- `wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement.md`
- `wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md`

Operational reminder for next S3 sessions:
- Do not run hot20 until unit/contract/static verification stays green after final deslop/architect review.
- For live hotN, count completed-but-non-clean results as task survival success only if diagnostics/audit/recovery trace explain why they are non-clean.
<!-- S3-PAPER-REMEDIATION-20260427:END -->

---

<!-- S3-POST-RALPLAN-FOLLOWUP-20260428:START -->
## 11. 2026-04-28 Post-ralplan followup defects Ralph status

The S3 self-followup WR `s3-to-s3-post-ralplan-execution-followup-defects-20260427` has been implemented and verified. This pass closes the seven post-execution defects from the 2026-04-27 critic package without widening scope into fake build-agent test padding.

Implemented followups:
- `transition_claim_status()` now appends append-only `revisionHistory` entries with `fromStatus`, `toStatus`, deterministic `reason`, and `timestampMs`.
- Phase 2 readiness gating is centralized through pre-AgentLoop `ToolRegistry` filtering. Neo4j-not-ready removes `code_graph.callers`, `code_graph.callees`, and `code_graph.search`; GraphRAG-not-ready removes only `code_graph.search`; KB-not-ready removes `knowledge.search`.
- `outcome_for_deficiency()` is pinned for all 13 `DeficiencyClass` values with contextual outcome matrix tests.
- `generate-poc` quality-repair exhaustion now returns `pocOutcome=poc_inconclusive` with `qualityOutcome=repair_exhausted`; immediate unsafe/ref/grounding failures remain `poc_rejected`.
- `callee_path` / `callee_chain` planner slots route to `code_graph.callees` using the current `function_name` schema.
- PoC quality gate now rejects base64-encoded destructive payloads and quote/subshell/IFS escape patterns while preserving well-formed non-destructive canary PoCs.

Fresh verification after implementation and post-fix P1/P2 polish:
- Analysis Agent full suite: `492 passed in 5.36s`.
- Build Agent full suite: `254 passed in 0.48s`.
- `python3 -m compileall -q services/analysis-agent/app services/build-agent/app`: PASS.

Contract notice:
- F-4 is a visible result-semantic refinement, so S3 issued a notify-style S3→S2 WR for the `poc_rejected` → `poc_inconclusive` repair-exhaustion change.

Operational reminder:
- The Build Agent test count remains 254 because F-1..F-7 touched Analysis Agent behavior only; no padding tests were added.
- certificate-maker hotN may proceed after this pass remains green through architect/deslop verification.
<!-- S3-POST-RALPLAN-FOLLOWUP-20260428:END -->

<!-- S3-POST-FIX-POLISH-20260428:START -->
## 12. 2026-04-28 Post-fix polish / test-gap closeout

After the 2026-04-27 critic/meta-retract package, S3 completed the P1/P2 polish handoff without changing the already-accepted F-1..F-7 semantics.

Closed polish items:
- `agentAudit` now carries typed evidence-catalog diagnostics instead of an undocumented raw dict extension.
- `attemptedAcquisitions` and `negativeAttempts` are semantically distinct: attempted acquisitions include positive and negative attempts, while negative attempts remain the failed/operational subset.
- `strictCleanPassRate` now filters state-machine fixture observations instead of duplicating the ordinary clean pass rate.
- PoC quality-repair exceptions emit warning diagnostics and still return completed non-clean outcomes when the request/runtime are valid.
- advisory `diagnose_claim_evidence()` calls pass explicit allowed-local refs.
- non-dict LLM claim entries are logged before being skipped.
- `_missing_required_slots()` documents its production precondition: `transition_claim_status()` must set `missingEvidence` before deep quality gating.

Closed priority test gaps:
- KB/CVE timeout smoke produces an honest completed envelope with operational diagnostics instead of task failure.
- PoC repair-cycle timeout remains `completed + qualityOutcome=repair_exhausted + pocOutcome=poc_inconclusive`.
- partial Phase 1 failure propagates into Phase 2 prompt/tool gating, including code-graph-not-ready tool removal.
- multi-turn duplicate acquisition is deduplicated through planner/session state.
- deterministic SAST phase is asserted exactly once and SAST is not advertised as a Phase 2 LLM tool.

Fresh verification at this closeout:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `492 passed in 5.36s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q` → `254 passed in 0.48s`.
- `python3 -m compileall -q services/analysis-agent/app services/build-agent/app` → PASS.

Contract clarification:
- `pocOutcome=poc_inconclusive` is the canonical result for bounded PoC quality-repair exhaustion under valid caller input and live runtime.
- `pocOutcome=poc_rejected` remains the canonical result for immediate unsafe, hallucinated-ref, or grounding-deficient PoC output.
- Both are task-level `completed` outcomes, not public task failures.
<!-- S3-POST-FIX-POLISH-20260428:END -->

---

<!-- S3-THINKING-ON-HOT20-READINESS-20260428:START -->
## 13. 2026-04-28 S7 thinking-on WR 소비 / hot20 readiness

S7이 S3 hotN WR을 완료하여 Gateway의 effective thinking 기본값이 `chat_template_kwargs.enable_thinking=true`로 정렬되었다. Strict JSON도 더 이상 thinking을 강제로 끄지 않으며, caller가 boolean `false`를 명시한 경우에만 mechanical/non-reasoning 요청으로 보존한다. 관련 canonical evidence는 `wiki/canon/handoff/s7/session-s7-thinking-default-true-20260428.md`와 `wiki/canon/api/llm-gateway-api.md`를 기준으로 한다.

S3 follow-up 반영 사항:
- Analysis Agent / Build Agent의 service-local `LlmCaller` 기본값은 `enable_thinking=True`다. Tool-call turn과 tool-less strict JSON finalizer 모두 S7에 thinking-on 요청을 보낸다.
- Analysis Phase 2 prompt, Build build-resolve prompt, legacy task prompt registry에서 `/no_think` suffix를 제거했다. Prompt는 내부 reasoning 사용은 허용하되 최종 content는 순수 JSON만 포함하도록 명시한다.
- `eval_runner`도 explicit `enable_thinking=true`와 `X-AEGIS-Strict-JSON=true`를 사용한다.
- S3 code grep guard 기준: `services/analysis-agent`와 `services/build-agent`의 active source/test 표면에 `enable_thinking=False`, `enable_thinking.*False`, `/no_think` 잔존이 없어야 한다.

Fresh verification for this thinking-on readiness pass:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `493 passed in 5.51s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q` → `257 passed in 0.55s`.
- `python3 -m compileall -q services/analysis-agent/app services/build-agent/app` → PASS.
- `rg -n "enable_thinking.*False|enable_thinking=False|/no_think" services/analysis-agent services/build-agent -g '!**/__pycache__/**' -g '!**/.venv/**'` → no matches.

Operational reminder:
- Thinking-on consumes reasoning tokens. For hot20/deep-analysis prompts, treat `finish_reason=length` with empty final content as token-budget deficiency, not proof that the model failed semantically.
- hot20 may proceed after external Claude review, using S7's `X-AEGIS-Effective-Thinking` header/logs plus S3 silent-200 diagnostics to distinguish true completed envelopes from hidden internal failure.
<!-- S3-THINKING-ON-HOT20-READINESS-20260428:END -->

---

<!-- S3-PASS-A-SEMANTIC-REMEDIATION-20260428:START -->
## 14. 2026-04-28 Pass-A semantic defect remediation Ralph status

S3 Pass-A semantic remediation (`.omx/plans/prd-s3-pass-a-semantic-defect-remediation-20260428.md`) has been implemented through WPs 1-17. DPA-8/DPA-20 remain retracted and WP-18/DPA-11 remains intentionally deferred.

Implemented surfaces:
- Claim lifecycle: `rejected` is reachable for all-invalid cited refs; mixed valid/invalid refs remain `under_evidenced`; sticky `needs_human_review` is preserved but diagnostic-only until an explicit human-acceptance path exists.
- Accepted-only output: `result.claims[]` now promotes only grounded claims. `under_evidenced`, `rejected`, and sticky NHR candidates remain in `result.claimDiagnostics.nonAcceptedClaims[]` with bounded lifecycle proof fields.
- Recovery/audit: recovery-eligible malformed/uncertain content turns do not consume forward-progress slots and now carry stable `audit_order` so `audit.agentAudit.turns[]` remains chronological and unambiguous.
- Budget survival: structured finalizer/schema repair and generate-poc schema/quality repair cap repair calls by remaining request-local completion budget and classify low-budget repair as completed non-clean outcome.
- Generate-PoC: raw producer claims run through `diagnose_claim_evidence()` and `transition_claim_status()` before public exposure. Trusted upstream bare refs satisfy allowlisting/generic support only and cannot fabricate family-specific slots.
- Evidence catalog/result diagnostics: support-capable local evidence is not downgraded by later operational collisions; operational/negative refs are excluded from LLM-facing evidence refs; attempted acquisitions include Phase-1 SAST/caller/source events.
- Parser/token parity: Analysis Agent and Build Agent active service-local parser/token-counter paths now recover unclosed `<think>`/trailing JSON safely and count prompt + completion tokens. No shared runtime or `agent-shared` resurrection.

Fresh verification after Critic blocker fixes:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `520 passed in 5.46s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q` → `260 passed in 0.51s`.
- `python3 -m compileall -q services/analysis-agent/app services/build-agent/app` → PASS.
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_system_stability_eval.py -q` → `6 passed in 0.01s`.
- Static guards: no `agent-shared`, no direct `RecoveryTraceEntry(` in `agent_loop.py`, no implementation hits for out-of-scope DPA-8/DPA-20/WP-18, no NHR accepted-claims promotion site.

Reviewer status:
- First critic pass rejected NHR accepted-surface leakage and ambiguous recovery-turn audit ordering.
- Follow-up critic pass approved after grounded-only claim promotion and `audit_order` chronology fixes.

Contract/notice:
- Canonical API and claim-lifecycle pages now document bounded lifecycle proof fields in `nonAcceptedClaims[]`, sticky NHR diagnostic-only behavior, and generate-poc accepted-only lifecycle gating.
- S3 issued notify-style S3→S2 WR: `wiki/canon/work-requests/s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only.md`.

Operational reminder:
- Hot20 is now unit/contract/static-ready from the S3 Pass-A side, but still should be run only when the live S7/KB/code-graph/S4 stack is intentionally allocated for a long latency test.
<!-- S3-PASS-A-SEMANTIC-REMEDIATION-20260428:END -->

---

<!-- S3-GENERATION-CONTROLS-S7-WR-20260429:START -->
## 15. 2026-04-29 S7 generation-controls WR 소비 / P16-P17 readiness

S3 consumed the 2026-04-29 S7 caller-owned generation-control WRs for Analysis Agent and Build Agent. The implementation is S3-only and does not edit S2/S7 code.

Implemented surfaces:
- Analysis Agent and Build Agent now have service-local `app/agent_runtime/llm/generation_policy.py` named presets.
- Both service-local `LlmCaller` implementations emit the full S7 tuple on sync and async chat paths: `max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `chat_template_kwargs.enable_thinking`.
- `constraints.maxTokens`, `agent_llm_max_tokens`, and `agent_max_completion_tokens` are aligned to `32768`.
- Public optional generation overrides are camelCase-only: `enableThinking`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`; snake_case public keys are rejected.
- Analysis/build loops use named presets plus request overrides and conservatively require first-turn tool use only before any successful tool call.
- Generate-PoC uses coding preset for initial draft and strict-repair preset for retry/repair paths. Source snippets are wrapped as untrusted LLM-facing content.
- Timeout constants are centralized in service-local `TimeoutDefaults` mirrored from the S7 contract: chat/default 1800s, eval client read 600s, repair/strict JSON 600s, tool execution 120s.
- P7 temperature-rationale comments are present at Generate-PoC draft/repair and structured-finalizer call sites.
- `eval_runner` sends the full tuple and consumes `TimeoutDefaults.TASK_CLIENT_READ_SECONDS`.
- P17: tool-call arguments are validated against registered schemas before implementation dispatch; violations return retryable `schema_violation` tool results without budget/dispatch/trace success.
- P16: tool result messages and Generate-PoC source snippets are wrapped/sanitized at the LLM-facing boundary while raw evidence/audit data remains intact.

Fresh verification:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `558 passed in 5.58s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q` → `301 passed in 0.55s`.
- `python3 -m compileall -q services/analysis-agent/app services/build-agent/app services/analysis-agent/eval` → PASS.
- Static guard for hidden `temperature=0.3` defaults over S3 services → no matches.
- Static guard for S7 full tuple / timeout / schema-validation / input-boundary fields → 266 implementation+test hits, confirming coverage after the reverify patch.

Execution note:
- The work was planned under `.omx/plans/prd-s3-generation-controls-wr-20260429.md` and `.omx/plans/test-spec-s3-generation-controls-wr-20260429.md`.
- A user-requested final Critic pre-flight recommended team execution; foundation was completed first, then request/call-site/eval, P17 router validation, and P16 input-boundary lanes were split.
- 2026-04-29 follow-up autopilot re-read `temperature-policy-analysis-20260428-s3-summary.md` and the full `temperature-policy-analysis-20260428.md`; it found P11 timeout centralization and P7 rationale comments needed one more tightening pass, then reverified full suites.
- Do not autonomously summon Critic in future sessions; use Critic only when the user explicitly requests it.
<!-- S3-GENERATION-CONTROLS-S7-WR-20260429:END -->

---

<!-- S3-TEMPERATURE-FOLLOWUP-20260503:START -->
## 16. 2026-05-03 Temperature-policy follow-up closeout / 2026-05-06 ToolIntent supersession

S3 originally closed the Step 1 temperature-policy follow-up items after reading `wiki/context/decisions/temperature-policy-analysis-20260428-s3-followup-20260503.md`. That 2026-05-03 closeout has since been superseded at the tool-dispatch boundary by the 2026-05-03/05-06 `tool_choice="required"` root-cause work and the ToolIntent runtime-dispatch implementation.

Current decisions as of 2026-05-06:
- **P10 supersession**: Analysis Agent and Build Agent no longer use vLLM/OpenAI `tool_choice="required"` for mandatory first evidence/build acquisition. `_tool_choice_for_turn(...)` returns `"auto"` when tools are present. Mandatory acquisition is enforced in S3 runtime, not by vLLM guided tool-choice.
- **ToolIntent runtime dispatch**: while no successful tool call exists and tools are available, the agent loop performs a tool-intent planning call with `tools=None`, no `tool_choice`, strict JSON, and thinking enabled. The returned ToolIntent JSON is converted by S3 into a synthetic `ToolCallRequest` and then dispatched through the normal tool router.
- **Reason for divergence from old P10 wording**: vLLM/Qwen reasoning-parser stacks can return `finish_reason="tool_calls"` with empty `tool_calls` when `enable_thinking=true` and `tool_choice="required"`. S3 therefore treats `required` as unsupported for current production use and preserves the original P10 safety intent via runtime gating.
- **P16**: LLM-facing tool results and source snippets remain wrapped/sanitized by `app/agent_runtime/security/input_boundary.py`; raw evidence/audit content remains unmutated outside the prompt boundary. Literal injected boundary delimiters are neutralized to `[BOUNDARY-MARKER-NEUTRALIZED]` before wrapping to avoid delimiter confusion.
- **P18**: Analysis Agent and Build Agent public `constraints.topK` align with S7's `top_k` range by accepting `ge=-1`, preserving the vLLM/S7 unlimited sampling escape hatch. Named presets remain positive (`top_k=20` for thinking, `top_k=1` for strict repair).
- **P19**: scalar `LlmCaller.call(temperature=...)` is transitional compatibility only and emits a `DeprecationWarning`; new S3 LLM call sites must pass named `GenerationControls` presets.
- **Regression gate**: durable pytest gate `services/analysis-agent/tests/test_s3_llm_readiness_gate.py` now checks for ToolIntent/P10-disable markers, P16 boundary markers, P18/P19 static markers, and `eval/eval_runner.py` P6 generation tuple coverage.

Fresh verification from the ToolIntent stabilization closeout:
- Analysis Agent full suite: `600 passed in 5.74s`.
- Build Agent full suite: `331 passed in 0.67s`.
- Focused ToolIntent tests: Analysis Agent `tests/test_tool_intent_runtime_dispatch.py`; Build Agent `tests/test_tool_intent_runtime_dispatch.py`.
- `python3 -m compileall -q services/analysis-agent/app services/build-agent/app services/analysis-agent/eval` → PASS.
- certificate-maker hot3 operational-only run on 2026-05-06: 3/3 attempts PASS for system stability, with Generate-PoC quality gate intentionally excluded from that operational verdict.

Operational reminder:
- Do not reintroduce `tool_choice="required"` or named tool choice in S3 until S7/vLLM explicitly proves that the current model + reasoning parser + tool parser + speculative/MTP stack supports it. Current allowed caller values are `auto`/`none`; S3-owned mandatory acquisition must remain ToolIntent/runtime-dispatched.
- Clean success remains result-level: `completed` is an honest envelope, not a clean finding/PoC/build proof.
<!-- S3-TEMPERATURE-FOLLOWUP-20260503:END -->

---

<!-- S3-NON-DYNAMIC-API-AUDIT-FOLLOWUP-20260506:START -->
## 17. 2026-05-06 Non-dynamic API contract audit follow-up

S3 re-read `wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md` and routed S3-relevant findings through current code. The audit intentionally excluded S3 implementation internals at the time; this section records the follow-up state after S3 ToolIntent stabilization.

S3-relevant audit findings:
- **F2 / S2 PoC facade**: S3's public contract requires consumers to inspect `pocOutcome`, `qualityOutcome`, and `cleanPass`. S3 currently emits those fields for `generate-poc` accepted/rejected/inconclusive outcomes. The drift was in S2 facade shaping, not in S3's response contract. Current AEGIS working tree contains non-S3 changes that appear to address this, but S3 does not own their verification/commit state.
- **F3 / S7 tool_choice guard**: S3 no longer sends `tool_choice="required"`; this mitigates S3's active risk. After the S7→S3 WR, service-local Analysis/Build `LlmCaller` now also rejects caller attempts to pass unsupported `required` or named function tool choices before HTTP submission. S7 still owns gateway-side request allowlisting for non-S3 callers.
- **F4 / S3 implementation unverified**: Follow-up inspection now confirms S3 has an implementation-level mitigation for the old P10 risk: ToolIntent runtime dispatch avoids vLLM `required` guided tool-choice while preserving mandatory acquisition semantics.

Current code anchors:
- Analysis ToolIntent path: `services/analysis-agent/app/core/agent_loop.py` and `services/analysis-agent/app/agent_runtime/llm/caller.py`.
- Build ToolIntent path: `services/build-agent/app/core/agent_loop.py` and `services/build-agent/app/agent_runtime/llm/caller.py`.
- S3 caller response-contract hardening: `services/analysis-agent/app/agent_runtime/errors.py`, `services/analysis-agent/app/agent_runtime/policy/retry.py`, `services/analysis-agent/app/agent_runtime/schemas/agent.py`, `services/build-agent/app/agent_runtime/errors.py`, `services/build-agent/app/agent_runtime/policy/retry.py`, `services/build-agent/app/agent_runtime/schemas/agent.py`.
- Generate-PoC outcome shaping: `services/analysis-agent/app/routers/generate_poc_handler.py`, `services/analysis-agent/app/schemas/response.py`.
- Readiness/static guard: `services/analysis-agent/tests/test_s3_llm_readiness_gate.py`.

S7→S3 WR closeout on 2026-05-06:
- Analysis Agent and Build Agent `LlmCaller` now allow only `tool_choice="auto"` or `"none"`; unsupported `required` and named function choices raise before HTTP dispatch.
- `LlmResponse.reasoning` is preserved for diagnostics and logged as `reasoningChars`.
- `finish_reason="tool_calls"` with an empty parsed `tool_calls[]`, and reasoning-only responses with no actionable content/tool call, become retryable `LlmContractViolationError` instances with bounded diagnostic excerpts.
- Async ownership `response_contract_violation` / `LLM_PARSE_RETRY` status payloads map to the same retryable contract-violation class; strict JSON contract failures remain `StrictJsonContractError` and are now included in retry policy.
- HTTP `422 INVALID_TOOL_CHOICE` remains a non-retryable caller-shaping/configuration failure; HTTP `503 LLM_PARSE_RETRY` remains retryable transport/output-contract failure.

Fresh verification for this S7→S3 WR closeout:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_llm_caller.py tests/test_retry_policy.py tests/test_s3_llm_readiness_gate.py -q` → `50 passed in 0.49s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest tests/test_llm_caller.py tests/test_policy_retry.py -q` → `20 passed in 0.18s`.
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `579 passed in 6.10s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q` → `318 passed in 0.71s`.
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_tool_intent_runtime_dispatch.py tests/test_skeleton_smoke.py -q` → `12 passed in 0.21s`.
- `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest tests/test_tool_intent_runtime_dispatch.py -q` → `4 passed in 0.04s`.
- `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval services/build-agent/app` → PASS.
- Static grep for active `tool_choice="required"` / named function emission under `services/analysis-agent` and `services/build-agent` found only guard tests/comments, not active emission code.

Remaining S3-facing risks:
- S7 gateway F3 remains a cross-lane defense-in-depth gap for non-S3 callers until unsupported tool choice values are rejected at the gateway and empty `finish_reason="tool_calls"` responses are converted to retryable contract violations there too.
- S3 still avoids vLLM `required` for mandatory acquisition; do not reinterpret the new caller allowlist as permission to reintroduce guided required/named choices.
- API/handoff docs before this section may predate ToolIntent; when conflicts appear, this section and the API pages last verified on 2026-05-06 supersede older P10 wording.
<!-- S3-NON-DYNAMIC-API-AUDIT-FOLLOWUP-20260506:END -->

---

<!-- S3-BUILD-SCRIPTHINTPATH-20260506:START -->
## 18. 2026-05-06 Build Agent `scriptHintPath` contract transition

S3 consumed S2's contract review reply for replacing inline Build Agent script hints with an uploaded-project-relative path. S2 accepted the `context.trusted.build.scriptHintPath` direction and reported no current S2 runtime emission of the old inline hint fields.

S3 implementation decision:
- `build.scriptHintPath` is canonical and relative to the **effective BuildTarget root** (`projectPath/buildTargetPath`, or `projectPath` when `buildTargetPath="."` / empty).
- Inline script hint aliases are removed rather than maintained:
  - `build.scriptHintText`
  - `build.scriptHint`
  - top-level `buildScriptHint`
  - top-level `buildScriptHintText`
- Top-level `scriptHintPath` is also rejected; S2/S1 should send only `context.trusted.build.scriptHintPath`.

Build Agent safety contract:
- reject empty, absolute, Windows drive/UNC, backslash, NUL, and traversal paths;
- resolve symlinks and reject escapes outside the effective BuildTarget root;
- require a regular UTF-8 text file under a 20,000 byte cap;
- hash and audit the referenced file material;
- expose bounded content to the LLM as reference-only prompt material;
- never execute the original uploaded script directly; only generated request-scoped `build-aegis-*/aegis-build.sh` may be passed to `try_build`.

Code anchors:
- `services/build-agent/app/schemas/request.py`
- `services/build-agent/app/validators/build_request_contract.py`
- `services/build-agent/app/routers/build_resolve_handler.py`
- `services/build-agent/app/routers/build_route_support.py`
- `services/build-agent/tests/test_build_request_contract.py`
- `services/build-agent/tests/test_build_resolve_handler.py`
- `services/build-agent/tests/test_build_route_support.py`
<!-- S3-BUILD-SCRIPTHINTPATH-20260506:END -->

---

<!-- S3-S4-NONREGISTERED-SDK-20260508:START -->
## 19. 2026-05-08 S4 non-registered SDK contract consumption / SAST failure honesty

S3 consumed S4's reply WR for the new SDK resolution contract. S4 now treats bare `sdkId` as an S4-local registry lookup only, while caller-resolved uploaded/local SDKs must use `sdkResolutionMode="non-registered"` with `sdkDescriptor.sdkRootPath`. Unknown bare SDK IDs fail before analysis with `SDK_NOT_FOUND`; S3 must not collapse that dependency/contract failure into `sast_no_findings`.

S3 implementation decision:
- Analysis Agent normalizes S4-facing `buildProfile` / `scanProfile` in `phase_one_exec._s4_build_profile()`.
- Explicit `sdkResolutionMode="non-registered"` profiles preserve `sdkDescriptor` and drop legacy/bare `sdkId` labels before S4 submission.
- If trusted build metadata contains a caller-resolved SDK root (`AEGIS_SDK_ROOT`, `SDK_ROOT`, or `SDK_DIR`) alongside a bare SDK label, S3 converts it to S4's non-registered descriptor contract and forwards optional setup/sysroot/triplet/compiler-path hints.
- Registry-style bare `sdkId` remains bare only when S3 has no caller-resolved SDK root evidence; S4 then owns registry lookup and may correctly return `SDK_NOT_FOUND`.
- Legacy `sdkId="custom"` remains stripped rather than forwarded as a registry id.

Failure-honesty decision:
- `Phase1Result` now distinguishes `sast_scan_attempted`, `sast_scan_completed`, and `sast_failure_detail`.
- Evidence catalog emits `sast_no_findings` only for completed zero-finding scans.
- S4/SAST contract or dependency failures become operational diagnostics (`sast_scan_failed`, and `sast_contract_failure` for SDK/400-class profile failures) and are excluded from final proof refs.
- Phase 2 prompt text now distinguishes scan failure from completed zero findings and instructs the model not to interpret SAST failure as absence of vulnerabilities.

Code anchors:
- `services/analysis-agent/app/core/phase_one_exec.py`
- `services/analysis-agent/app/core/phase_one_types.py`
- `services/analysis-agent/app/core/evidence_catalog.py`
- `services/analysis-agent/app/core/phase_one_prompt.py`
- `services/analysis-agent/tests/test_phase_one.py`
- `services/analysis-agent/tests/test_evidence_catalog.py`

Fresh focused verification during implementation:
- Initial focused implementation pass: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py tests/test_evidence_catalog.py -q` → `70 passed in 0.76s`.
- Initial related pass: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py tests/test_evidence_catalog.py tests/test_deep_analyze_handler.py tests/test_sast_tool.py -q` → `97 passed in 2.21s`.
- Post-Critic blocker fix: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_sast_tool.py tests/test_phase_one.py tests/test_evidence_catalog.py -q` → `89 passed in 0.96s`.
- Critic non-blocking status-code preservation follow-up: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_sast_tool.py tests/test_phase_one.py tests/test_evidence_catalog.py -q` → `90 passed in 1.06s`.
- Post-follow-up full Analysis Agent suite: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `595 passed in 6.32s`.
- S4 SDK contract focused recheck: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/python -m pytest tests/test_sdk_resolution_contract.py -q` → `6 passed in 1.72s`.
- Static/syntax check: `cd /home/kosh/AEGIS && python3 -m compileall -q services/analysis-agent/app && git diff --check -- services/analysis-agent` → PASS.

Critic follow-up:
- First Critic review rejected the initial implementation because durable `/v1/scan` could return a nested `success=false` result payload that `SastScanTool._build_result()` converted into `ToolResult(success=True)`, reintroducing `sast_no_findings` risk on the individual SAST path.
- S3 fixed that blocker by making `SastScanTool` preserve unsuccessful scan payloads as tool failures, making `run_sast()` treat `success=false` content as failure even from generic tools, and unwrapping nested `detail.failureDetail` payloads from S4 ownership errors.
- After the Critic pass, S3 also implemented the non-blocking recommendation to preserve S4 ownership `statusCode` in the SAST tool failure wrapper so non-SDK 400-class profile failures can be classified more precisely later.
- Regression tests now cover durable failed scan result, durable ownership-error `statusCode` preservation, `run_sast()` success-false payload handling, nested ownership-error detail unwrapping, and evidence-catalog operational/no-negative behavior.

Operational reminder:
- This is not a gateway-webserver-specific fix. Do not hardcode TI SDK IDs, gateway paths, or popen heuristics into S3 analysis logic; the durable rule is the generic S4 SDK contract plus honest acquisition-failure representation.
- Gateway-webserver live full-pipeline should be rerun only after focused unit/contract verification and intentional service restart/reload.
<!-- S3-S4-NONREGISTERED-SDK-20260508:END -->


---

<!-- S3-S7-HEALTH-READINESS-20260508:START -->
## 20. 2026-05-08 S7 health readiness contract consumption

S3 consumed S7's reply/notice WR for the `/v1/health` readiness split. S7 now defines top-level `status` as Gateway process liveness only; LLM work readiness must be read from `ready`, `llmReady`, `degraded`, `degradeReasons`, `blockedReason`, and `dependencyStatus.llmBackend.status`.

S3 implementation decision:
- Analysis Agent and Build Agent service-local `LlmCaller` perform a short `/v1/health` preflight before submitting to S7 async ownership for tool-less/finalizer calls.
- `status="ok"` is never treated as DGX/vLLM readiness by itself.
- If S7 reports `ready=false`, `llmReady=false`, a non-null `blockedReason`, `dependencyStatus.llmBackend.status != "ok"`, or legacy `llmBackend.status != "ok"`, S3 raises a retryable dependency/runtime `LlmUnavailableError` before async submit.
- `blockedReason="backend_unreachable"` and `llm_backend_unreachable` remain dependency/runtime failures, not model-output deficiencies.
- Missing `/v1/health` on older local S7 builds remains a compatibility fallback; the async endpoint probe is still attempted in that legacy case.

Code anchors:
- `services/analysis-agent/app/agent_runtime/llm/caller.py`
- `services/build-agent/app/agent_runtime/llm/caller.py`
- `services/analysis-agent/tests/test_llm_caller.py`
- `services/build-agent/tests/test_llm_caller.py`

Fresh verification:
- Focused Analysis preflight regression: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q tests/test_llm_caller.py::test_async_ownership_preflight_rejects_unready_llm_backend_before_submit tests/test_llm_caller.py::test_async_ownership_preflight_rejects_legacy_unreachable_backend_shape tests/test_llm_caller.py::test_async_ownership_returns_wrapped_result_for_toolless_calls tests/test_llm_caller.py::test_async_ownership_continues_running_until_completed_without_age_abort` → `4 passed in 0.08s`.
- Focused Build preflight regression: `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q tests/test_llm_caller.py::test_build_llm_caller_async_preflight_rejects_unready_llm_backend tests/test_llm_caller.py::test_build_llm_caller_async_ownership_continues_until_completed` → `2 passed in 0.07s`.
- Analysis LLM/eval focused suite: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q tests/test_llm_caller.py tests/test_eval_runner.py` → `36 passed in 0.46s`.
- Build LLM focused suite: `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q tests/test_llm_caller.py` → `13 passed in 0.20s`.
- Analysis Agent full suite: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `597 passed in 6.35s`.
- Build Agent full suite: `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q` → `389 passed in 3.11s`.
- Live S7-unreachable preflight smoke while VPN/DGX route was unavailable: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python - <<PY ... LlmCaller(...).call(..., prefer_async_ownership=True)` → `PRE_FLIGHT_BLOCKED LLM_UNAVAILABLE True LLM Gateway dependency not ready: backend_unreachable`; no async submit was attempted before the health readiness block.

Operational reminder:
- A live Gateway `status="ok"` only proves the S7 FastAPI route responds. S3 diagnostics and smoke scripts must report `llmReady=false` / `blockedReason` as LLM-unavailable even when the Gateway process is alive.
- This is a generic dependency-readiness consumption fix, not a gateway-webserver-specific workaround.
<!-- S3-S7-HEALTH-READINESS-20260508:END -->

---

<!-- S3-QG-HARDENING-20260509:START -->
## 21. 2026-05-09 Analysis Quality Gate / Generate-PoC strict hot11 closeout

S3 completed the Analysis Agent Quality Gate hardening run requested for
paper-quality hot11 evidence. The key change is that **task completion is no
longer accepted as proof of result quality**. Generate-PoC is now part of the
strict Quality Gate rather than an optional operational side channel.

Strict clean PoC rule:

```text
clean PoC = completed
          + result.pocOutcome == poc_accepted
          + result.qualityOutcome == accepted
          + result.cleanPass == true
```

Implementation highlights:
- `services/analysis-agent/eval/golden/hot11_full_pipeline_oracle.json` now
  requires clean PoC for matched findings.
- `services/analysis-agent/eval/golden/qg_anomaly_oracle.json` and
  `services/analysis-agent/eval/quality_gate_oracle.py` capture the
  "completed but not clean" anomaly golden set.
- `services/analysis-agent/app/quality/poc_quality_gate.py` requires PoC claims
  to be source/evidence bound and to include bounded repro steps, expected
  observation, and a non-destructive safety boundary.
- `services/analysis-agent/app/routers/generate_poc_handler.py` can assemble a
  deterministic source-grounded diagnostic PoC fallback when the LLM output path
  is deficient but accepted input claim refs and local source context are
  sufficient.
- Deterministic fallback source notes are rendered as inert prose so raw source
  banners, markdown fences, shell punctuation, or long token strings do not
  trip PoC safety detectors.
- CWE-798/259/321/532 and hardcoded/default credential findings are classified
  as source-backed `credential_exposure`, not dependency advisories requiring
  `library_origin`.
- `services/analysis-agent/scripts/hot11_full_pipeline_runner.py` now reports
  `Clean PoCs` and `pocQualityFailures`; matched findings without clean PoC fail
  the oracle.

Fresh verification:
- Analysis Agent full suite:
  `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q`
  → `615 passed in 6.70s`.
- Static/syntax:
  `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval`
  and `git diff --check -- services/analysis-agent` → PASS.
- Anomaly oracle:
  `evaluate_quality_gate_oracle(load_quality_gate_oracle())`
  → `passed=True`, `caseCount=5`.
- Old 2026-05-08 hot11 report strict re-evaluation:
  11/11 cases fail because their Generate-PoC envelopes were completed but
  non-clean.
- Fresh strict live hot11 full pipeline:
  `reports/hot11-qg-live-all-20260508T183529Z`
  → `overallStatus=passed`, `cases=11`, `Clean PoCs=11/11`.

Commits:
- AEGIS: `c8a147a Require clean PoC evidence for paper-grade hot11`.
- Wiki: `ac3a83e Record S3 strict PoC quality gate evidence`.

Operational reminder:
- Do not relax hotN/hot11 to count `completed` alone as pass.
- For paper-quality claims, consumers must inspect `pocOutcome`,
  `qualityOutcome`, and `cleanPass` together.
- This was a generic Quality Gate hardening pass, not a gateway-webserver or
  hot11 overfit. Future dataset additions should extend the oracle rather than
  special-case project names.
<!-- S3-QG-HARDENING-20260509:END -->

---

<!-- S3-S4-ENRICHED-EVIDENCE-CONSUMPTION-20260511:START -->
## 22. 2026-05-11 S4 enriched evidence consumption / SCA CVE lookup honesty

S3 consumed S4's evidence-resolution producer reply for enriched SAST findings and SCA libraries. S4 now emits SAST finding `metadata.evidenceResolution` and enriched SCA fields such as `versionStatus`, `versionConfidence`, `cveLookupEligible`, `diagnostics`, `diffAvailable`, `modificationStatus`, `diffSummary`, and provenance hints.

S3 implementation decision:
- Analysis Agent preserves enriched SAST/SCA dictionaries from precomputed `quickContext.sastFindings` / `quickContext.scaLibraries`, S4 `/v1/build-and-analyze` top-level `libraries[]`, and the individual SCA path without normalizing away S4 evidence fields.
- S5 `/v1/cve/batch-lookup` input is now partitioned before submission. A library is eligible only when it has `name` and `version`, `cveLookupEligible` is not `false`, and `versionStatus` is absent/legacy or `known`.
- Versionless, unknown, ambiguous, explicitly ineligible, or nameless libraries are skipped before S5 submission and recorded as `cve_lookup_skipped_libraries` diagnostics. S3 no longer sends name-only SCA libraries to S5.
- Eligible-library truncation records `cve_lookup_truncated` and `cve_lookup_unqueried_eligible_count`; truncated lookups are operational diagnostics and do not produce whole-set `cve_no_hits`.
- `cve_no_hits` negative evidence is emitted only when an eligible CVE lookup was actually attempted for the full eligible set, completed successfully, and returned no CVEs. Timeout, transport/error, all-ineligible, skipped-library, or truncated cases are operational diagnostics, not negative vulnerability evidence.
- Phase 2 prompt rendering now treats `DIFF_NOT_COMPUTED`, `diffAvailable=false`, and `modificationStatus="unknown"` as unknown/uncomputed diff evidence rather than "원본 그대로". `VERSION_UNKNOWN` / skipped CVE lookup is rendered as caveat/context, not as absence of CVEs.

Code anchors:
- `services/analysis-agent/app/core/phase_one_types.py`
- `services/analysis-agent/app/core/phase_one_kb.py`
- `services/analysis-agent/app/core/evidence_catalog.py`
- `services/analysis-agent/app/core/phase_one_prompt.py`
- `services/analysis-agent/tests/test_phase_one.py`
- `services/analysis-agent/tests/test_evidence_catalog.py`

Fresh verification:
- Focused RED→GREEN implementation gate: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py::TestRunCveLookup tests/test_phase_one.py::TestBuildPhase2Prompt::test_sca_prompt_preserves_unknown_version_and_diff_uncertainty tests/test_evidence_catalog.py::test_cve_no_hits_requires_completed_eligible_lookup tests/test_evidence_catalog.py::test_cve_all_ineligible_is_operational_skip_not_no_hits tests/test_evidence_catalog.py::test_cve_lookup_error_is_operational_not_no_hits -q` → `11 passed in 0.20s` (initial gate before truncation-blocker fix).
- Focused Phase 1/evidence catalog gate: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py tests/test_evidence_catalog.py -q` → `81 passed in 0.80s` (after truncation regression addition).
- Post-Critic truncation regression: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py::TestRunCveLookup tests/test_evidence_catalog.py::test_cve_truncated_lookup_is_operational_not_no_hits tests/test_evidence_catalog.py::test_cve_no_hits_requires_completed_eligible_lookup -q` → `10 passed in 0.29s`.
- Related Analysis Agent gate after truncation fix: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py tests/test_evidence_catalog.py tests/test_deep_analyze_handler.py tests/test_sast_tool.py -q` → `110 passed in 2.07s`.
- Analysis Agent full suite after truncation fix: `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `624 passed in 6.47s`.
- Static/syntax: `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval && git diff --check -- services/analysis-agent` → PASS.

Operational reminder:
- S4 enriched SCA fields are evidence quality/status hints, not vulnerability verdicts.
- Do not treat skipped/truncated CVE lookup or uncomputed diff as proof that a dependency is safe/unmodified.
- Keep library CVEs as caveats or recommended next steps unless local project source evidence independently supports a claim.
<!-- S3-S4-ENRICHED-EVIDENCE-CONSUMPTION-20260511:END -->


---

<!-- S3-S4-STATIC-EVIDENCE-CONTRACT-CONSUMPTION-20260511:START -->
## 23. 2026-05-11 S4 `staticEvidenceContract` / readiness gate consumption

S3 reviewed and accepted S4's implemented `staticEvidenceContract` v1, Golden Corpus v1, Tool Portfolio Governance v1, and follow-up gate-hardening notices. These are S4-owned producer/validation surfaces; S3 consumes them as deterministic local static-evidence contracts, not as final vulnerability judgments.

S3 consumer interpretation:
- `staticEvidenceContract.gates.systemStability` answers whether the S4 local artifact is operationally trustworthy enough to read; `fail` or policy-failure reason codes are acquisition/readiness diagnostics, not absence-of-vulnerability evidence.
- `staticEvidenceContract.gates.evidenceReadiness` answers which local deterministic S4 surfaces are `ready`, `partial`, or `not_ready`; `partial` and `not_ready` preserve follow-up obligations and caveats.
- Runtime `staticEvidenceContract.gates.qualityEvaluation.status="not_evaluated"` is expected and must not be treated as a quality failure. `pass`/`partial`/`fail` quality statuses belong to S4 validation/report profiles only.
- `findings=[]` means S4 emitted an empty local finding surface; it must not become proof that no vulnerability exists.
- Explicit `not_provided` surfaces for external vulnerability knowledge, semantic GraphRAG/retrieval, runtime behavior, exploitability judgment, and final security verdict preserve S5/S3 ownership of those decisions.
- Structural `codeGraph` evidence remains structural callgraph evidence only; S3 must not read it as semantic retrieval or graph-RAG completeness.

Current S3 action:
- No immediate S3 code change is required for the S4 gate-hardening notice because the current S3 evidence model already treats S4 failures/skips/unknowns as operational diagnostics and keeps S5 CVE/context acquisition separate from S4 local evidence.
- Future S3 ingestion work may map `staticEvidenceContract.coverage`, `gates`, and `claimBoundaries` into first-class EvidenceCatalog diagnostics once live S4 payloads are broadly available, but this must preserve the no-negative-evidence semantics above.

Canonical source pages:
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`
- `wiki/canon/work-requests/s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance.md`
- `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update.md`
<!-- S3-S4-STATIC-EVIDENCE-CONTRACT-CONSUMPTION-20260511:END -->


---

<!-- S3-S4-CONSOLIDATED-CONTRACT-20260512:START -->
## 24. 2026-05-12 S4 consolidated contract notice consumption

S3 consumed S4's consolidated WR `wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md`. This notice supersedes the older incremental S4→S3 staticEvidenceContract notices and is now the S3-facing summary for S4 tool liveness, runtime system-stability failures, and local Quality Gate/report semantics.

Current S4 state recorded by the WR and linked canonical docs:
- Fresh `ScanOrchestrator.check_tools(force=True)` on 2026-05-12 reports all six current SAST tools available: Semgrep `1.156.0`, Cppcheck `2.13.0`, Flawfinder `2.0.19`, clang-tidy `18.1.3`, scan-build probe OK, gcc-fanalyzer/GCC `13.3.0`; `policyStatus=ok`, `policyReasons=[]`, `unavailableTools=[]`.
- Default `/v1/scan` now treats all current six tools as required. Explicit `options.tools` narrows the required set to that caller-specified subset.
- Required-tool preflight failure is HTTP `503` with `errorDetail.code="REQUIRED_TOOL_UNAVAILABLE"`. Required-tool missing/failed/partial/skipped/degraded/non-normal post-execution failure is HTTP `503` with `errorDetail.code="REQUIRED_TOOL_EXECUTION_INCOMPLETE"`. Unknown `options.tools[]` is caller input error HTTP `400` with `errorDetail.code="SCAN_TOOL_INVALID"`.
- These codes are **system-stability / acquisition diagnostics**, not SAST quality results and not absence-of-vulnerability evidence.
- S4's local tool-portfolio harness currently reports `qualityGate.status=not_decision_grade`, `qualityGate.decision=insufficient-evidence-for-tool-change`, `qualityGate.localQualityAssessment.status=fail`, failing `validation`/`test` splits, and passing `canary`. The split metric `status` values mean scoring ran; threshold pass/fail lives under `qualityGate.localQualityAssessment`.

S3 consumer interpretation:
- S3 continues to treat S4 required-tool failures, policy failures, skips, and unknowns as operational SAST acquisition failures, never as `sast_no_findings`.
- Runtime `staticEvidenceContract.gates.systemStability`, `gates.evidenceReadiness`, `gates.claimSupportReadiness`, `claimBoundaryMatrix[]`, and `toolEvidenceMatrix` are local deterministic evidence-readiness/claim-boundary surfaces only.
- S4 local Quality Gate reports are offline experiment evidence and do not alter runtime `/v1/scan` vulnerability semantics.
- S4 still does not provide external vulnerability knowledge, semantic GraphRAG retrieval, runtime behavior, exploitability judgment, or final security verdict; S3/S5 remain responsible for those surfaces.

S3 test hardening added for this WR:
- `services/analysis-agent/tests/test_phase_one.py::test_run_sast_records_required_tool_system_stability_failure_without_no_findings` locks HTTP-503 required-tool/system-stability failure handling as `sast_scan_completed=false` with no negative SAST evidence.
- `services/analysis-agent/tests/test_evidence_catalog.py::test_sast_required_tool_failure_is_operational_system_stability_not_negative_evidence` locks evidence-catalog interpretation as operational `sast_scan_failed` only, not `sast_contract_failure` and not final proof/negative evidence.

Fresh S3 verification:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py::test_run_sast_records_required_tool_system_stability_failure_without_no_findings tests/test_evidence_catalog.py::test_sast_required_tool_failure_is_operational_system_stability_not_negative_evidence -q` → `2 passed in 0.14s`.
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_phase_one.py tests/test_evidence_catalog.py tests/test_sast_tool.py -q` → `101 passed in 1.23s`.

Superseded WR handling:
- The following older incremental S4→S3 notices should be completed by S3 as superseded by this consolidated notice:
  - `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption.md`
  - `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix.md`
  - `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates.md`
  - `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun.md`

Canonical source pages:
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md`
- `wiki/canon/handoff/s4/session-s4-api-doc-sync-20260512.md`
<!-- S3-S4-CONSOLIDATED-CONTRACT-20260512:END -->


---

<!-- S3-S4-API-ALIGNMENT-20260512:START -->
## 25. 2026-05-12 S4 current API contract alignment / fail-closed static evidence readiness

S3 consumed the action-request WR `wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md`. Unlike the earlier notice-only handling, this pass changed S3 consumer code because the current S4 API contract now requires consumers to read runtime `staticEvidenceContract` gates before treating local static evidence as clean/ready.

Implemented S3 behavior:
- S3 now summarizes S4 `staticEvidenceContract` as clean-ready only when all of the following hold: `gates.systemStability.status="pass"`, `gates.evidenceReadiness.status="ready"`, `gates.claimSupportReadiness.status="pass"`, `claimBoundaryMatrix[]` is present, and `toolEvidenceMatrix[]` is present.
- Missing, empty, or malformed `staticEvidenceContract` is fail-closed as `sast_static_evidence_ready=false` with `STATIC_EVIDENCE_CONTRACT_MISSING`; it must not become clean `sast_no_findings` evidence.
- S4 transport/domain success with degraded/partial/not-ready static evidence can still provide positive local observations, but S3 records an operational `sast_static_evidence_not_ready` diagnostic and suppresses SAST negative evidence from empty findings.
- S4 required-tool/system-stability failures remain operational SAST acquisition failures, not SAST quality verdicts, not absence-of-vulnerability evidence, and not final proof refs.
- Precomputed `quickContext` / trusted SAST findings obey the same contract-readiness rule; precomputed findings without a current `staticEvidenceContract` are not clean complete evidence.
- Partial SAST tools also suppress no-findings negative evidence even when older response shapes do not carry the current contract.
- Phase 2 prompt text now explicitly tells the LLM that not-ready/degraded S4 static evidence cannot support vulnerability absence, CWE absence, exploitability absence, S5/GraphRAG substitution, or final security verdicts.
- Offline S4 `qualityGate` split metric `status="pass"` is not treated as runtime static-evidence readiness; S3 only uses `staticEvidenceContract` gates/matrices for that decision.

Code anchors:
- `services/analysis-agent/app/core/s4_static_evidence.py`
- `services/analysis-agent/app/core/phase_one_types.py`
- `services/analysis-agent/app/core/phase_one_exec.py`
- `services/analysis-agent/app/core/phase_one_flow.py`
- `services/analysis-agent/app/core/evidence_catalog.py`
- `services/analysis-agent/app/core/phase_one_prompt.py`
- `services/analysis-agent/app/tools/implementations/sast_tool.py`

Regression anchors:
- `services/analysis-agent/tests/test_s4_static_evidence.py`
- `services/analysis-agent/tests/test_sast_tool.py`
- `services/analysis-agent/tests/test_phase_one.py`
- `services/analysis-agent/tests/test_evidence_catalog.py`

Fresh verification:
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest tests/test_s4_static_evidence.py tests/test_sast_tool.py tests/test_phase_one.py tests/test_evidence_catalog.py -q` → `115 passed in 1.43s`.
- `cd /home/kosh/AEGIS/services/analysis-agent && .venv/bin/python -m pytest -q` → `640 passed in 7.00s`.
- `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval && git diff --check -- services/analysis-agent` → PASS.
- `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py && git diff --check -- wiki/canon/handoff/s3/readme.md wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md` → PASS.

Critic status:
- First Critic pass rejected the initial implementation because missing/empty/malformed `staticEvidenceContract` could fail open into `sast_no_findings`.
- S3 fixed that blocker by recording missing/malformed contracts as not-ready across `/v1/scan`, `/v1/build-and-analyze`, and precomputed quickContext/trusted paths, then adding regressions for the fail-closed behavior.
- Final Critic pass (2026-05-13, Pascal) returned PASS with no blocking findings after reviewing the WR, S3 handoff, S4 contract alignment, fail-closed readiness handling, prompt warnings, and focused S3 tests (`114 passed in 1.33s`).
<!-- S3-S4-API-ALIGNMENT-20260512:END -->
