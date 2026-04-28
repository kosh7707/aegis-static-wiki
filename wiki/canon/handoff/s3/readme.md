---
title: "S3. Analysis Agent 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s3-handoff/README.md"
  - "/home/kosh/AEGIS/.omc/state/codex-handoff-progress.md"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-paper-remediation-complete-20260427.md"
last_verified: "2026-04-28"
service_tags: ["s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract", "paper-remediation-complete", "system-stability", "hotn-reporting", "build-v1.1-default", "critic-fix", "planner-runtime-wiring", "negative-evidence-honesty", "thinking-on"]
related_pages: ["wiki/canon/roadmap/s3-roadmap.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/implementation-work-packages.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md", "wiki/canon/work-requests/s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin.md", "wiki/canon/handoff/s7/session-s7-thinking-default-true-20260428.md", "wiki/canon/api/llm-gateway-api.md"]
---

# S3. Analysis Agent 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.**
> **마지막 업데이트: 2026-04-28**

이 문서는 S3 lane의 현재 책임, 경계, 아키텍처, 그리고 2026-04-27 기준 최신 implementation/contract 정렬 상태를 다음 세션이 바로 이어받을 수 있도록 정리한 canonical handoff다.

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
| build public router | `services/build-agent/app/routers/tasks.py` |
| build handlers | `services/build-agent/app/routers/build_resolve_handler.py`, `sdk_analyze_handler.py` |
| build phase0 / loop / result assembly | `services/build-agent/app/core/phase_zero.py`, `agent_loop.py`, `result_assembler.py` |
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

---

## 7. 최신 검증 상태 (2026-04-14)

### fresh verification snapshot
- `services/analysis-agent/.venv/bin/python -m pytest -q` → **321 passed**
- `services/build-agent/.venv/bin/python -m pytest -q` → **237 passed**

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
